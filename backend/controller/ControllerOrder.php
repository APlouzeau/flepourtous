<?php

require_once APP_PATH . 'vendor/autoload.php';
class ControllerOrder
{

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

        $modelUser = new ModelUser();

        $idUser = $_SESSION['idUser'];
        $lessonPrice = $_SESSION['lesson_price'];
        $lessonName = $_SESSION['lesson_name'];
        $eventId = $_SESSION['event_id'];

        $userWallet = $modelUser->getWalletFromUser($idUser);

        $amount = $userWallet - $lessonPrice;

        if ($amount >= 0) {
            $modelEvent = new ModelEvent();
            $modelUser->updateWallet($idUser, $amount);
            $modelEvent->setEventStatusPaid($eventId);
            echo json_encode([
                'code' => 1,
                'payment_method' => 'wallet',
                'message' => 'Le paiement a été effectué avec succès via votre portefeuille.',
            ]);
            return;
        }

        if ($amount < 0) {
            $amountToPay = abs($amount);

            $stripe = new \Stripe\StripeClient(STRIPE_SECRET_KEY);

            try {
                $checkout_session = $stripe->checkout->sessions->create([
                    'ui_mode' => 'embedded',
                    'line_items' => [[
                        'price_data' => [
                            'currency' => 'eur',
                            'product_data' => [
                                'name' => "Paiement d'une leçon de {$lessonName} ",
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
                echo json_encode(array('clientSecret' => $checkout_session->client_secret));
            } catch (Error $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    }

    public function status()
    {
        $stripe = new \Stripe\StripeClient(STRIPE_SECRET_KEY);

        try {
            // retrieve JSON from POST body
            $jsonStr = file_get_contents('php://input');
            $jsonObj = json_decode($jsonStr);

            $session = $stripe->checkout->sessions->retrieve($jsonObj->session_id);

            if ($session->payment_status === 'paid') {

                $idUser = $session->metadata->user_id;

                $modelEvent = new ModelEvent();
                $status = $modelEvent->setEventStatusPaid($session->metadata->event_id);

                $modelUser = new ModelUser();
                $modelUser->updateWallet($idUser, 0);

                $controllerEmail = new ControllerMail();
                $controllerEmail->sendMailForPaymentSuccess($_SESSION['idUser'], $_SESSION['event_id']);
            }

            if (isset($status) && $status === true) {

                echo json_encode([
                    'status' => $session->status, // 'complete', 'open', 'expired'
                    'payment_status' => $session->payment_status, // 'paid', 'unpaid', 'no_payment_required'
                    'customer_email' => $session->customer_details ? $session->customer_details->email : null
                ]);
            }
        } catch (\Stripe\Exception\ApiErrorException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur serveur générale.']);
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
                echo json_encode([
                    'code' => 1,
                    'message' => 'Rendez-vous refusé avec succès.'
                ]);
            } else {
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
}
