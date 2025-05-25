<?php

class ControllerVisio 
{
    public function createRoom($duration, $userStartDateTimeUTCToString){
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

    public function deleteRoom ($eventId) {
        $modelEvent = new ModelEvent();
        $event = $modelEvent->getEventById($eventId);
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
        $result = file_get_contents($apiUrl,false, $context);
    }
}