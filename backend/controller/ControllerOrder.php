<?php

require_once APP_PATH . 'vendor/autoload.php';
class ControllerOrder
{

    public function getWallet()
    {
        $verifyConnect = new ControllerUser();
        $verifyConnect->verifyConnectBack();

        $userId = $_SESSION['idUser'] ?? null;

        $modelEvent = new ModelEvent();
        $wallet = $modelEvent->getWalletFromUser($userId);

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

    public function checkout()
    {
        $controllerUser = new ControllerUser();
        $controllerUser->verifyConnectBack();

        $modelUser = new ModelUser();

        $idUser = $_SESSION['idUser'];
        $lessonPrice = $_SESSION['lesson_price'];
        $lessonName = $_SESSION['lesson_name'];
        $eventId = $_SESSION['event_id'];

        $modelEvent = new ModelEvent();
        $userWallet = $modelEvent->getWalletFromUser($idUser);

        $amount = $userWallet - $lessonPrice;

        if ($amount >= 0) {
            $modelUser->updateWallet($idUser, $amount);
            $modelEvent->setEventStatusPaid($eventId);
            echo json_encode([
                'code' => 1,
                'payment_method' => 'wallet',
                'message' => 'Le paiement a été effectué avec succès via votre portefeuille.',
            ]);
        }

        if ($amount < 0) {
            $amountToPay = abs($amount);

            $modelUser->updateWallet($idUser, 0);

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

                $modelEvent = new ModelEvent();
                $status = $modelEvent->setEventStatusPaid($session->metadata->event_id);
            }

            if (isset($status) && $status === true) {

                echo json_encode([
                    'status' => $session->status, // 'complete', 'open', 'expired'
                    'payment_status' => $session->payment_status, // 'paid', 'unpaid', 'no_payment_required'
                    'customer_email' => $session->customer_details ? $session->customer_details->email : null
                ]);
                http_response_code(200);
            }
        } catch (\Stripe\Exception\ApiErrorException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur serveur générale.']);
        }
    }

    public function verifyPayment()
    {
        $controllerUser = new ControllerUser();
        $controllerUser->verifyConnectBack();

        $input = json_decode(file_get_contents('php://input'), true);
        $sessionId = $input['session_id'] ?? null;

        try {
            $stripe = new \Stripe\StripeClient(STRIPE_SECRET_KEY);

            $session = $stripe->checkout->sessions->retrieve($sessionId);
            if ($session->payment_status === 'paid') {
                $modelEvent = new ModelEvent();
                $status = $modelEvent->setEventStatusPaid($session->metadata->event_id);

                if ($status == true) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Paiement confirmé',
                        'session' => [
                            'id' => $session->id,
                            'payment_status' => $session->payment_status,
                            'amount_total' => $session->amount_total
                        ]
                    ]);
                }
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Paiement non confirmé',
                    'payment_status' => $session->payment_status
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
