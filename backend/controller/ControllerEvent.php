<?php

class ControllerEvent
{
    public function getEvents()
    {
        $controllerUser = new ControllerUser();
        $isConnected = $controllerUser->verifyConnectBack();

        if (!$isConnected) {
            $response = [
                'code' => 0,
                'message' => 'Utilisateur non connecté'
            ];
            echo json_encode($response);
            return;
        }
        $modelEvent = new ModelEvent();
        $events = $modelEvent->getEvents($_SESSION['idUser']);
        if (count($events) == 0) {
            $response = [
                'code' => 0,
                'message' => 'Pas de rendez-vous'
            ];
        } else {
            $response = [
                'code' => 1,
                'message' => 'Rendez-vous récupérés avec succès',
                'data' => $events
            ];
        }
        echo json_encode($response);
    }
}
