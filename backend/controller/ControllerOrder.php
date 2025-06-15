<?php

class ControllerOrder
{

    public function getWallet()
    {
        $verifyConnect = new ControllerUser();
        $verifyConnect->verifyConnectBack();

        $userId = $_SESSION['idUser'] ?? null;

        $wallet = new ModelEvent();
        $wallet = $wallet->getWalletFromUser($userId);

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
}
