<?php

class ControllerVisio
{
    public function createRoom($duration, $userStartDateTimeUTCToString)
    {
        $visioApiKey = VISIO_API_KEY;
        $url = 'https://api.daily.co/v1/rooms/';

        $startDateTimeUnix = strtotime($userStartDateTimeUTCToString);
        $durationInSeconds = $duration * 60; // Convertir la durée en secondes
        $visio = [
            'privacy' => 'public',
            'properties' => [
                'nbf' => $startDateTimeUnix - 15 * 60,
                'exp' => $startDateTimeUnix + $durationInSeconds + 15 * 60,
                'start_audio_off' => false,
                'start_video_off' => false,
                'enable_pip_ui' => true,
                'enable_people_ui' => true,
                'enable_emoji_reactions' => true,
                'enable_screenshare' => true,
                'enable_video_processing_ui' => true,
                'enable_chat' => true,
                'enable_advanced_chat' => true,
                'enable_recording' => 'local',
            ]
        ];

        $options = [
            'http' => [
                'header' => "Content-type: application/json\r\nAuthorization: Bearer " . $visioApiKey,
                'method' => 'POST',
                'content' => json_encode($visio)
            ]
        ];

        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        if ($result === FALSE) {
            $responseVisio = [
                'code' => 0,
                'message' => 'Erreur lors de la création de la room visio',
            ];
            echo json_encode($responseVisio);
            return;
        } else {
            $responseVisio = json_decode($result, true);
            $roomUrl = $responseVisio['url'];
            return $roomUrl;
        }
    }

    public function deleteRoom($idEvent)
    {
        $modelEvent = new ModelEvent();
        $event = $modelEvent->getEventById($idEvent);
        $path = parse_url($event['visioLink'], PHP_URL_PATH);
        $roomNameOnly = $path ? ltrim($path, '/') : null;
        $visioApiKey = VISIO_API_KEY;
        $apiUrl = 'https://api.daily.co/v1/rooms/' . $roomNameOnly;

        $options = [
            'http' => [
                'header' => "Authorization: Bearer " . $visioApiKey,
                'method' => 'DELETE',
                'ignore_errors' => true
            ]
        ];
        $context = stream_context_create($options);
        $result = file_get_contents($apiUrl, false, $context);
    }

    public function createInstantRoom()
    {
        session_start();
        
        // Vérifier que l'utilisateur est connecté et admin
        if (!isset($_SESSION['userId']) || $_SESSION['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode([
                'code' => 0,
                'message' => 'Accès refusé : droits administrateur requis'
            ]);
            return;
        }

        // Récupérer les données POST
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['email']) || !isset($input['duration'])) {
            http_response_code(400);
            echo json_encode([
                'code' => 0,
                'message' => 'Email et durée requis'
            ]);
            return;
        }

        $email = $input['email'];
        $duration = intval($input['duration']);

        // Valider l'email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'code' => 0,
                'message' => 'Adresse email invalide'
            ]);
            return;
        }

        // Valider la durée (entre 15 minutes et 180 minutes)
        if ($duration < 15 || $duration > 180) {
            http_response_code(400);
            echo json_encode([
                'code' => 0,
                'message' => 'La durée doit être entre 15 et 180 minutes'
            ]);
            return;
        }

        // Créer la room immédiatement (maintenant)
        $currentDateTime = new DateTime('now', new DateTimeZone('UTC'));
        $startDateTime = $currentDateTime->format('Y-m-d H:i:s');
        
        $roomUrl = $this->createRoom($duration, $startDateTime);
        
        if (!$roomUrl) {
            http_response_code(500);
            echo json_encode([
                'code' => 0,
                'message' => 'Erreur lors de la création du salon visio'
            ]);
            return;
        }

        // Ici vous pourriez envoyer un email à l'utilisateur avec le lien
        // $this->sendVisioEmail($email, $roomUrl, $duration);

        echo json_encode([
            'code' => 1,
            'message' => 'Salon visio créé avec succès',
            'data' => [
                'roomUrl' => $roomUrl,
                'email' => $email,
                'duration' => $duration,
                'startTime' => $startDateTime
            ]
        ]);
    }
}
