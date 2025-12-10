<?php

require_once APP_PATH . 'vendor/autoload.php';
class ControllerOrder
{

    private $invoiceModel;
    private $controllerUser;
    private $controllerError;
    private $modelUser;
    private $modelPrice;
    private $modelEvent;
    private $controllerMail;
    const ORDER_LOG_FILE = "orders";

    public function __construct()
    {
        $this->invoiceModel = new ModelInvoice();
        $this->controllerUser = new ControllerUser();
        $this->controllerError = new ControllerError();
        $this->modelUser = new ModelUser();
        $this->modelPrice = new ModelPrices();
        $this->modelEvent = new ModelEvent();
        $this->controllerMail = new ControllerMail();
    }

    public function getWallet()
    {
        $verifyConnect = new ControllerUser();
        $verifyConnect->verifyConnectBack();

        $userId = $_SESSION['idUser'] ?? null;

        $modelUser = new ModelUser();
        $wallet = $modelUser->getWalletFromUser($userId);

        if ($wallet === false) {
            $response = [
                'code' => 0,
                'message' => 'Failed to retrieve wallet information.'
            ];
        } else {
            $response = [
                'code' => 1,
                'message' => 'Portefeuille récupéré avec succès.',
                'data' => $wallet
            ];
        }
        echo json_encode($response);
    }

    /**
     * Prépare la session pour le paiement d'un rendez-vous existant.
     */
    public function prepareRepayment()
    {
        $controllerUser = new ControllerUser();
        $controllerUser->verifyConnectBack();

        $input = json_decode(file_get_contents('php://input'), true);
        $eventId = $input['eventId'] ?? null;

        if (!$eventId) {
            http_response_code(400);
            echo json_encode(['code' => 0, 'message' => 'ID de l\'événement manquant.']);
            return;
        }

        $modelPrices = new ModelPrices();
        $lessonDetails = $modelPrices->getPriceByEventId($eventId);

        if (!$lessonDetails) {
            http_response_code(404);
            echo json_encode(['code' => 0, 'message' => 'Détails de la leçon introuvables pour cet événement.']);
            return;
        }

        // On met à jour la session, comme dans le tunnel de création
        $_SESSION['event_id'] = $eventId;
        $_SESSION['lesson_price'] = $lessonDetails['price'];
        $_SESSION['lesson_name'] = $lessonDetails['title'];

        echo json_encode([
            'code' => 1,
            'message' => 'Session prête pour le paiement.'
        ]);
    }

    public function checkout()
    {
        $controllerUser = new ControllerUser();
        $controllerUser->verifyConnectBack();

        $idUser = $_SESSION['idUser'] ?? null;
        $lessonPrice = $_SESSION['lesson_price'] ?? null;
        $lessonName = $_SESSION['lesson_name'] ?? null;
        $eventId = $_SESSION['event_id'] ?? null;

        // Validation des données de session
        if (!$idUser) {
            http_response_code(401);
            $this->controllerError->logs(
                "ERREUR checkout: Utilisateur non connecté",
                ["Session: " . session_id()],
                self::ORDER_LOG_FILE
            );
            echo json_encode(['code' => 0, 'error' => 'Utilisateur non connecté']);
            return;
        }

        if ($lessonPrice === null || $lessonName === null || $eventId === null) {
            http_response_code(400);
            $this->controllerError->logs(
                "ERREUR checkout: Données de session manquantes",
                [
                    "Utilisateur ID: " . $idUser,
                    "lesson_price: " . ($lessonPrice ?? 'NULL'),
                    "lesson_name: " . ($lessonName ?? 'NULL'),
                    "event_id: " . ($eventId ?? 'NULL'),
                    "Session ID: " . session_id()
                ],
                self::ORDER_LOG_FILE
            );
            echo json_encode(['code' => 0, 'error' => 'Session invalide. Veuillez recommencer le processus de réservation.']);
            return;
        }

        if ($eventId !== 0) {
            $this->payExistingAppointment($idUser, $lessonPrice, $lessonName, $eventId,);
        } else {
            $this->payPackPurchase($idUser, $lessonPrice, $lessonName);
        }
    }

    private function payExistingAppointment($idUser, $lessonPrice, $lessonName, $eventId)
    {
        $userWallet = $this->modelUser->getWalletFromUser($idUser);
        $remainingAmount = $userWallet - $lessonPrice;

        if ($remainingAmount >= 0) {
            $modelEvent = new ModelEvent();
            $this->modelUser->updateWallet($idUser, $remainingAmount);
            $modelEvent->setEventStatusPaid($eventId);
            $this->controllerMail->sendMailForPaymentSuccess($idUser, $eventId);
            echo json_encode([
                'code' => 1,
                'payment_method' => 'wallet',
                'message' => 'Le paiement a été effectué avec succès via votre portefeuille.',
            ]);
            $this->controllerError->logs(
                "Paiement de leçon via portefeuille réussi",
                [
                    "Utilisateur ID: " . $idUser,
                    "Événement ID: " . $eventId,
                    "Leçon: " . $lessonName,
                    "Prix: " . $lessonPrice . "€",
                    "Portefeuille avant: " . $userWallet . "€",
                    "Portefeuille après: " . $remainingAmount . "€"
                ],
                self::ORDER_LOG_FILE
            );
            return;
        }

        $amountToPay = abs($remainingAmount); // Montant manquant
        $this->createStripeSession($amountToPay, $lessonName, $eventId, $idUser);
    }

    private function payPackPurchase($idUser, $lessonPrice, $lessonName)
    {
        $amountToPay = $lessonPrice;
        $this->createStripeSession($amountToPay, $lessonName, 0, $idUser);
    }

    private function createStripeSession($amountToPay, $lessonName, $eventId, $idUser)
    {
        $stripe = new \Stripe\StripeClient(STRIPE_SECRET_KEY);

        try {
            $productName = $eventId === 0
                ? "Achat d'un pack de {$lessonName}"
                : "Paiement d'une leçon de {$lessonName}";

            $checkout_session = $stripe->checkout->sessions->create([
                'ui_mode' => 'embedded',
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => $productName,
                        ],
                        'unit_amount' => $amountToPay * 100,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'return_url' => URI_STRIPE . '/retour-paiement?session_id={CHECKOUT_SESSION_ID}',
                'metadata' => [
                    'event_id' => $eventId,
                    'user_id' => $idUser,
                    'lesson_name' => $lessonName,
                ]
            ]);

            echo json_encode(['clientSecret' => $checkout_session->client_secret]);
        } catch (Error $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function status()
    {
        $stripe = new \Stripe\StripeClient(STRIPE_SECRET_KEY);

        try {
            $jsonStr = file_get_contents('php://input');
            $jsonObj = json_decode($jsonStr);

            // ✅ Vérifier si déjà traité via les sessions PHP
            $sessionKey = "stripe_processed_" . $jsonObj->session_id;

            if (isset($_SESSION[$sessionKey])) {
                echo json_encode([
                    'status' => 'already_processed',
                    'payment_status' => 'paid',
                    'message' => 'Paiement déjà traité avec succès !'
                ]);
                return;
            }

            $session = $stripe->checkout->sessions->retrieve($jsonObj->session_id);

            if ($session->payment_status === 'paid') {
                $idUser = $session->metadata->user_id;
                $eventId = $session->metadata->event_id;

                if ($eventId != 0) {
                    $this->modelEvent->setEventStatusPaid($eventId);
                    $this->modelUser->updateWallet($idUser, 0); // Mettre à jour le portefeuille à 0
                    $this->controllerError->logs(
                        "Paiement de leçon avec carte réussi",
                        [
                            "Utilisateur ID: " . $idUser,
                            "Événement ID: " . $eventId,
                            "Leçon: " . $session->metadata->lesson_name,
                            "Montant: " . $session->amount_total / 100 . "€"
                        ],
                        self::ORDER_LOG_FILE
                    );
                } else {
                    $amount = $session->amount_total / 100;
                    $modelUser = new ModelUser();
                    $modelUser->addToWallet($idUser, $amount);
                    $this->controllerError->logs(
                        "Achat de pack réussi",
                        [
                            "Utilisateur ID: " . $idUser,
                            "Montant: " . $amount . "€",
                            "Leçon: " . $session->metadata->lesson_name
                        ],
                        self::ORDER_LOG_FILE
                    );
                }

                // ✅ MARQUER COMME TRAITÉ dans la session PHP
                $_SESSION[$sessionKey] = [
                    'processed_at' => date('Y-m-d H:i:s'),
                    'user_id' => $idUser,
                    'event_id' => $eventId
                ];

                // Envoyer l'email approprié selon le type de paiement
                if ($eventId != 0) {
                    $this->controllerMail->sendMailForPaymentSuccess($idUser, $eventId);
                } else {
                    $amount = $session->amount_total / 100;
                    $this->controllerMail->sendMailForPackPurchase($idUser, $amount);
                }

                echo json_encode([
                    'status' => 'complete',
                    'payment_status' => 'paid',
                    'message' => 'Paiement traité avec succès !'
                ]);
            } else {
                /*                 $this->controllerError->logs(
                    "Paiement en attente ou non payé", 
                    [
                        "Utilisateur: " . $_SESSION['firstName'] . " " . $_SESSION['lastName'],
                        "Mail: " . $_SESSION['email'],
                        "Session ID: " . $jsonObj->session_id,
                        "Statut de paiement: " . $session->payment_status
                    ], 
                    self::ORDER_LOG_FILE
                ); */
                echo json_encode([
                    'status' => $session->status ?? 'unknown',
                    'payment_status' => $session->payment_status ?? 'unknown',
                    'message' => 'Paiement en cours ou non payé'
                ]);
            }
        } catch (\Stripe\Exception\ApiErrorException $e) {
            /*             $this->controllerError->logs(
                "ERREUR Stripe lors de la vérification du paiement", 
                [
                    "Utilisateur: " . ($_SESSION['firstName'] ?? 'Inconnu') . " " . ($_SESSION['lastName'] ?? ''),
                    "Session ID: " . ($jsonObj->session_id ?? 'N/A'),
                    "Message d'erreur: " . $e->getMessage()
                ], 
                self::ORDER_LOG_FILE
            ); */
            error_log("Erreur Stripe: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function refuseAppointment()
    {
        $controllerUser = new ControllerUser();
        $controllerUser->verifyConnectBack();

        $input = json_decode(file_get_contents('php://input'), true);
        $eventId = $input['event_id'];
        $idUser = $input['id_user'];

        if ($eventId) {
            $modelEvent = new ModelEvent();
            $modelPrices = new ModelPrices();
            $modelUser = new ModelUser();
            $lessonPrice = $modelPrices->getPriceByEventId($eventId);
            $wallet = $modelUser->addToWallet($idUser, $lessonPrice['price']);
            $status = $modelEvent->updateEventStatus($eventId, 'Refusé');

            if ($wallet && $status) {
                /*                 $this->controllerError->logs(
                    "Rendez-vous refusé et remboursé", 
                    [
                        "Utilisateur ID: " . $idUser,
                        "Événement ID: " . $eventId,
                        "Montant remboursé: " . $lessonPrice['price'] . "€",
                        "Leçon: " . $lessonPrice['title']
                    ], 
                    self::ORDER_LOG_FILE
                ); */
                echo json_encode([
                    'code' => 1,
                    'message' => 'Rendez-vous refusé avec succès.'
                ]);
            } else {
                /*                 $this->controllerError->logs(
                    "ERREUR lors du refus de rendez-vous", 
                    [
                        "Utilisateur ID: " . $idUser,
                        "Événement ID: " . $eventId,
                        "Raison: Échec de la mise à jour du wallet ou du statut"
                    ], 
                    self::ORDER_LOG_FILE
                ); */
                echo json_encode([
                    'code' => 0,
                    'message' => 'Échec du refus du rendez-vous.'
                ]);
            }
        } else {
            echo json_encode([
                'code' => 0,
                'message' => 'ID de l\'événement manquant.'
            ]);
        }
    }

    public function orderPacks()
    {
        $controllerUser = new ControllerUser();
        $controllerUser->verifyConnectBack();

        $input = json_decode(file_get_contents('php://input'), true);

        if (!$this->controllerError->validateData($input, 'Données d\'entrée invalides.', 400)) {
            return;
        }

        $price = $this->modelPrice->getPriceByDurationAndLesson($input['duration'], $input['idLesson']);

        if (!$price) {
            $this->controllerError->unauthorizedResponse('Prix introuvable pour la leçon et la durée spécifiées.');
            return;
        }

        $packAmount = $this->packAmount($price, $input['pack']);
        $_SESSION['lesson_price'] = $packAmount;
        $_SESSION['lesson_name'] = $input['idLesson'];
        $_SESSION['event_id'] = 0;
        $this->controllerError->successResponse($packAmount, 'Demande de commande de pack réussie.');
    }

    private function packAmount($price, $pack)
    {
        return $price * $pack;
    }
}
