<?php

require_once APP_PATH . 'vendor/autoload.php';

use config\enum\AppointmentStatus;

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
    // Tailles de pack proposées par le formulaire (PackForm.tsx : pack-5, pack-10).
    private const ALLOWED_PACKS = [5, 10];

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

        if (!$this->checkPayableEvent((string) $eventId, (int) $_SESSION['idUser'])) {
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
                ["Aucun utilisateur en session"],
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
                    "event_id: " . ($eventId ?? 'NULL')
                ],
                self::ORDER_LOG_FILE
            );
            echo json_encode(['code' => 0, 'error' => 'Session invalide. Veuillez recommencer le processus de réservation.']);
            return;
        }

        if ($eventId !== 0) {
            // Revérifié ici : entre la réservation et le paiement, le cron a pu annuler le cours.
            if (!$this->checkPayableEvent((string) $eventId, (int) $idUser)) {
                return;
            }
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
            // Passage en « Payé » et débit du porte-monnaie en une transaction : le solde a pu
            // changer depuis la lecture, et le cours a pu être annulé par le cron.
            $result = $this->modelEvent->payWithWallet((string) $eventId, (int) $idUser, (float) $lessonPrice);
            if ($result === ModelEvent::PAY_INSUFFICIENT_WALLET) {
                http_response_code(409);
                echo json_encode(['code' => 0, 'message' => 'Solde du porte-monnaie insuffisant, veuillez réessayer.']);
                return;
            }
            if ($result === ModelEvent::PAY_NOT_PENDING) {
                http_response_code(409);
                echo json_encode(['code' => 0, 'message' => "Ce rendez-vous n'est plus en attente de paiement."]);
                return;
            }
            if ($result !== ModelEvent::PAY_OK) {
                http_response_code(500);
                echo json_encode(['code' => 0, 'message' => 'Erreur lors du paiement, rien n\'a été débité. Veuillez réessayer.']);
                return;
            }

            // Envoi des emails avec gestion d'erreur
            try {
                $this->controllerMail->sendMailForPaymentSuccess($idUser, $eventId);
                $this->controllerMail->sendMailToConfirmAppointment($eventId, $idUser);
            } catch (Exception $e) {
                error_log("❌ Error sending emails after payment: " . $e->getMessage());
                $this->controllerError->logs("Error sending emails after payment", [
                    "Error: " . $e->getMessage(),
                    "User ID: " . $idUser,
                    "Event ID: " . $eventId
                ], self::ORDER_LOG_FILE);
                // Ne pas bloquer le paiement si les emails échouent
            }

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

    /**
     * Un rendez-vous ne se paie que par son propriétaire, et tant qu'il est « En attente ».
     * Sinon : réponse 403 / 409 envoyée, et false.
     */
    private function checkPayableEvent(string $eventId, int $idUser): bool
    {
        $event = $this->modelEvent->getEventById($eventId);
        if (!$event || (int) $event['userId'] !== $idUser) {
            http_response_code(403);
            echo json_encode(['code' => 0, 'message' => "Ce rendez-vous n'existe pas ou ne vous appartient pas."]);
            return false;
        }
        if ($event['status'] !== AppointmentStatus::PENDING->value) {
            http_response_code(409);
            echo json_encode(['code' => 0, 'message' => "Ce rendez-vous n'est plus en attente de paiement."]);
            return false;
        }
        return true;
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
                        // Centimes entiers : 16,40 € * 100 donne 1639.9999999999998 en flottant, refusé par Stripe.
                        'unit_amount' => (int) round($amountToPay * 100),
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

    /**
     * Retour de paiement Stripe (route publique, appelée par la page de retour).
     * Une session Stripe n'est appliquée qu'une fois, enregistrée en base (stripe_payments) :
     * rappeler la route, même depuis une autre session, ne recrédite ni ne redébite rien.
     */
    public function status()
    {
        $jsonObj = json_decode(file_get_contents('php://input'));
        $sessionId = (is_object($jsonObj) && isset($jsonObj->session_id) && is_string($jsonObj->session_id)) ? $jsonObj->session_id : '';
        if ($sessionId === '') {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'session_id manquant']);
            return;
        }

        try {
            $stripe = new \Stripe\StripeClient(STRIPE_SECRET_KEY);
            $session = $stripe->checkout->sessions->retrieve($sessionId);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            error_log("Erreur Stripe: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Vérification du paiement impossible']);
            return;
        }

        if ($session->payment_status !== 'paid') {
            echo json_encode([
                'status' => $session->status ?? 'unknown',
                'payment_status' => $session->payment_status ?? 'unknown',
                'message' => 'Paiement en cours ou non payé'
            ]);
            return;
        }

        $idUser = (int) $session->metadata->user_id;
        $eventId = (string) $session->metadata->event_id;
        $isPack = $eventId === '0' || $eventId === '';
        $amount = $session->amount_total / 100;

        // Sessions de plus de 48 h : antérieures à la table stripe_payments, déjà traitées à l'époque.
        $tooOld = $session->created < time() - 48 * 3600;
        $modelPayment = new ModelPayment();
        if ($tooOld || !$modelPayment->claim($sessionId, $idUser, $isPack ? null : $eventId, $amount)) {
            echo json_encode([
                'status' => 'already_processed',
                'payment_status' => 'paid',
                'message' => 'Paiement déjà traité.'
            ]);
            return;
        }

        if ($isPack) {
            $this->modelUser->addToWallet($idUser, $amount);
            $modelPayment->setOutcome($sessionId, 'pack_credited');
            $this->controllerError->logs("Achat de pack réussi", [
                "Utilisateur ID: " . $idUser,
                "Montant: " . $amount . "€",
                "Leçon: " . $session->metadata->lesson_name
            ], self::ORDER_LOG_FILE);
            $this->controllerMail->sendMailForPackPurchase($idUser, $amount);
            echo json_encode(['status' => 'complete', 'payment_status' => 'paid', 'message' => 'Paiement traité avec succès !']);
            return;
        }

        // Part payée par le porte-monnaie = prix du cours - montant payé par carte. Elle est débitée
        // dans la même transaction que le passage en « Payé », et seulement si le solde la couvre
        // encore : avant, un solde dépensé pendant le paiement par carte tombait à 0 et le cours
        // passait quand même en « Payé » (cours à 22 € obtenu pour 2 € par carte).
        $lesson = $this->modelPrice->getPriceByEventId($eventId);
        $walletPart = $lesson ? max(0, round($lesson['price'] - $amount, 2)) : 0;
        $payResult = $this->modelEvent->payWithWallet($eventId, $idUser, $walletPart);

        if ($payResult === ModelEvent::PAY_INSUFFICIENT_WALLET) {
            // Le cours reste « En attente » ; le montant payé par carte va sur le porte-monnaie,
            // l'élève peut finir de payer le cours avec.
            $this->modelUser->addToWallet($idUser, $amount);
            $modelPayment->setOutcome($sessionId, 'credited_wallet_short');
            $this->controllerError->logs("Paiement carte reçu mais porte-monnaie insuffisant pour le reste : crédité sur le porte-monnaie", [
                "Utilisateur ID: " . $idUser,
                "Événement ID: " . $eventId,
                "Montant carte: " . $amount . "€",
                "Part porte-monnaie attendue: " . $walletPart . "€"
            ], self::ORDER_LOG_FILE);
            echo json_encode([
                'status' => 'credited_wallet_short',
                'payment_status' => 'paid',
                'amount' => $amount,
                'message' => 'Votre porte-monnaie ne couvre plus le reste du cours : le montant payé par carte a été crédité sur votre porte-monnaie. Le rendez-vous reste à payer.'
            ]);
            return;
        }

        if ($payResult === ModelEvent::PAY_ERROR) {
            // Paiement encaissé par Stripe mais rien d'appliqué : à traiter à la main.
            $modelPayment->setOutcome($sessionId, 'error');
            error_log("ALERTE paiement Stripe $sessionId encaissé ($amount €) mais non appliqué à l'événement $eventId, utilisateur $idUser");
            http_response_code(500);
            echo json_encode(['status' => 'error', 'payment_status' => 'paid', 'message' => 'Paiement reçu, mais une erreur empêche de le valider. Contactez-nous, rien n\'est perdu.']);
            return;
        }

        if ($payResult === ModelEvent::PAY_OK) {
            $modelPayment->setOutcome($sessionId, 'lesson_paid');
            $this->controllerError->logs("Paiement de leçon avec carte réussi", [
                "Utilisateur ID: " . $idUser,
                "Événement ID: " . $eventId,
                "Leçon: " . $session->metadata->lesson_name,
                "Montant carte: " . $amount . "€",
                "Part porte-monnaie: " . $walletPart . "€"
            ], self::ORDER_LOG_FILE);
            try {
                $this->controllerMail->sendMailForPaymentSuccess($idUser, $eventId);
                $this->controllerMail->sendMailToConfirmAppointment($eventId, $idUser);
            } catch (Exception $e) {
                error_log("❌ Error sending emails after Stripe payment: " . $e->getMessage());
            }
            echo json_encode(['status' => 'complete', 'payment_status' => 'paid', 'message' => 'Paiement traité avec succès !']);
            return;
        }

        // Le cours n'est plus en attente (annulé par le cron pendant le paiement, ou déjà payé) :
        // on ne le « ressuscite » pas, le montant payé par carte va sur le porte-monnaie.
        $this->modelUser->addToWallet($idUser, $amount);
        $modelPayment->setOutcome($sessionId, 'credited_to_wallet');
        $this->controllerError->logs("Paiement reçu pour un cours qui n'est plus en attente : crédité sur le porte-monnaie", [
            "Utilisateur ID: " . $idUser,
            "Événement ID: " . $eventId,
            "Montant: " . $amount . "€"
        ], self::ORDER_LOG_FILE);
        $this->controllerMail->sendMailForWalletCreditAfterCancellation($idUser, $amount);
        echo json_encode([
            'status' => 'credited_to_wallet',
            'payment_status' => 'paid',
            'amount' => $amount,
            'message' => 'Le rendez-vous a été annulé avant la fin du paiement : le montant a été crédité sur votre porte-monnaie.'
        ]);
    }

    public function orderPacks()
    {
        $controllerUser = new ControllerUser();
        $controllerUser->verifyConnectBack();

        $input = json_decode(file_get_contents('php://input'), true);

        if (!$this->controllerError->validateData($input, 'Données d\'entrée invalides.', 400)) {
            return;
        }

        // Seuls les packs proposés par le formulaire (5 ou 10 cours) : le multiplicateur venait du
        // navigateur sans contrôle (0,01 ou 1000 passaient).
        $pack = filter_var($input['pack'] ?? null, FILTER_VALIDATE_INT);
        if (!in_array($pack, self::ALLOWED_PACKS, true)) {
            http_response_code(400);
            echo json_encode(['code' => 0, 'message' => 'Pack invalide.']);
            return;
        }

        $price = $this->modelPrice->getPriceByDurationAndLesson($input['duration'], $input['idLesson']);

        if (!$price) {
            $this->controllerError->unauthorizedResponse('Prix introuvable pour la leçon et la durée spécifiées.');
            return;
        }

        $packAmount = $this->packAmount($price, $pack);
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
