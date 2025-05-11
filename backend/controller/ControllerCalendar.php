<?php

require_once APP_PATH . 'vendor/autoload.php';



if (!class_exists('Google_Service_Calendar')) {
    die('ERREUR : La classe Google_Service_Calendar n\'a pas été trouvée par l\'autoloader.');
}
class ControllerCalendar
{

    public function listEvents()
    {
        $userController = new ControllerUser();
        $userController->verifyConnectBack();

        if ($_SESSION['role'] != 'admin') {
            $this->listEventsUser();
        } else {
            $this->listEventsMain();
        }
    }

    private function getClient()
    {
        $keyFilePath = APP_PATH . 'config/service-account-key.json'; // Chemin vers ta clé JSON
        if (!file_exists($keyFilePath)) {
            throw new Exception("Fichier de clé du compte de service introuvable : " . $keyFilePath);
        }

        $client = new Google_Client();
        // Utilise setAuthConfig avec le chemin du fichier de clé
        $client->setAuthConfig($keyFilePath);
        // Ajoute le scope nécessaire pour accéder à Calendar
        $client->addScope(Google_Service_Calendar::CALENDAR);

        // Pas besoin de setAccessToken, setRedirectUri, etc.
        // Le compte de service s'authentifie avec la clé.

        return $client;
    }

    public function listEventsMain()
    {
        $modelEvent = new ModelEvent();
        $events = $modelEvent->getAllEvents();
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
        return;
    }

    public function createEvent()
    {
        $userController = new ControllerUser();
        $userController->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        if (!$data || !isset($data['description']) || !isset($data['startDate']) || !isset($data['startTime']) || !isset($data['duration'])) {
            http_response_code(400); // Bad Request
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Données manquantes pour créer l\'événement (description, start, end requis).']);
            return;
        }
        $userId = $_SESSION['idUser'];
        $description = $data['description'];
        $duration = 30; //$data['duration'];
        $startDateTime = $data['startDate'] . ' ' . $data['startTime'] . ':00';
        $createdAt = date('Y-m-d H:i:s');
        $updatedAt = date('Y-m-d H:i:s');
        $status = 'active';
        $appointmentName = $_SESSION['firstName'] . "-" . $_SESSION['lastName'];

        try {
            $timeZone = new DateTimeZone('Europe/Paris');
            $startObj = new DateTime($startDateTime, $timeZone);
            $interval = new DateInterval('PT' . $duration . 'M');

            $endObj = clone $startObj;
            $endObj->add($interval);

            $googleStartDateTime = $startObj->format(DateTime::RFC3339);
            $googleEndDateTime = $endObj->format(DateTime::RFC3339);


            //GOOGLE CALENDAR
            $client = $this->getClient();
            $service = new Google_Service_Calendar($client);

            $event = new Google_Service_Calendar_Event([
                'summary' => $appointmentName,
                'description' => $description ?? '',
                'start' => [
                    'dateTime' => $googleStartDateTime, // Format RFC3339 : '2025-05-03T10:00:00+02:00'
                    'timeZone' => 'Europe/Paris',
                ],
                'end' => [
                    'dateTime' => $googleEndDateTime, // Format RFC3339 : '2025-05-03T11:00:00+02:00'
                    'timeZone' => 'Europe/Paris',
                ],

            ]);

            $createdEvent = $service->events->insert(GOOGLE_CALENDAR_ID, $event);
            if (!$createdEvent) {
                $response = [
                    'code' => 0,
                    'message' => 'Erreur lors de la création de l\'événement dans Google Calendar',
                ];
                echo json_encode($response);
                return;
            }

            //Visio
            $visioApiKey = VISIO_API_KEY; // Remplacez par votre clé API
            $url = 'https://api.daily.co/v1/rooms/';

            $startDateTimeUnix = strtotime($startDateTime);
            $durationInSeconds = $duration * 60; // Convertir la durée en secondes
            $data = [
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
                    'content' => json_encode($data)
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
            }

            //DATABASE
            $eventId = $createdEvent->getId();
            $eventDatabase = new EntitieEvent([
                'eventId' => $eventId,
                'userId' => $userId,
                'description' => $description,
                'duration' => $duration,
                'createdAt' => $createdAt,
                'startDateTime' => $startDateTime,
                'updatedAt' => $updatedAt,
                'status' => $status,
                'visioLink' => $roomUrl,
            ]);
            $modelEvent = new ModelEvent();
            $registerEventSuccess = $modelEvent->createEvent($eventDatabase);
            if (!$registerEventSuccess) {
                $response = [
                    'code' => 0,
                    'message' => 'Erreur lors de l\'enregistrement de l\'événement en base de données',
                ];
                echo json_encode($response);
                return;
            } else {
                $response = [
                    'code' => 1,
                    'message' => 'Événement enregistré en base de données avec succès',
                ];
            }

            echo json_encode(['success' => true, 'eventId' => $createdEvent->getId()]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Erreur lors de la création de l\'événement: ' . $e->getMessage()]);
            return;
        }
        echo json_encode($response);
    }

    public function listEventsUser()
    {
        $userController = new ControllerUser();
        $userController->verifyConnectBack();

        $modelEvent = new ModelEvent();
        $events = $modelEvent->getEventsUser($_SESSION['idUser']);
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

    public function deleteEvent()
    {
        $userController = new ControllerUser();
        $userController->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        echo json_encode("data");
        echo json_encode($data);

        if (!$data || !isset($data['eventId'])) {
            $response = [
                'code' => 0,
                'message' => 'Données manquantes pour supprimer l\'événement (eventId requis).'
            ];
            echo json_encode($response);
            return;
        }
        $client = $this->getClient();
        $service = new Google_Service_Calendar($client);
        $deletedEvent = $service->events->delete(GOOGLE_CALENDAR_ID, $data['eventId']);

        if (!$deletedEvent) {
            $response = [
                'code' => 0,
                'message' => 'Erreur lors de la suppression de l\'événement dans Google Calendar',
            ];
            echo json_encode($response);
            return;
        }

        $modelEvent = new ModelEvent();
        $deleteEventSuccess = $modelEvent->deleteEvent($data['eventId']);
        if (!$deleteEventSuccess) {
            $response = [
                'code' => 0,
                'message' => 'Erreur lors de la suppression de l\'événement en base de données',
            ];
            echo json_encode($response);
            return;
        } else {
            $response = [
                'code' => 1,
                'message' => 'Événement supprimé de la base de données avec succès',
            ];
        }
        echo json_encode($response);
    }

    public function getAvailableTimeSlots()
    {
        $userController = new ControllerUser();
        $userController->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        $modelEvent = new ModelEvent();
        $events = $modelEvent->getAvailableTimeSlots($data['date']);
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
        echo json_encode($events);
    }
}
