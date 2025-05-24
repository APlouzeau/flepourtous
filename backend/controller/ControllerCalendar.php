<?php

use Google\Service\Adsense\TimeZone;

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

        $client = new \Google\Client();
        // Utilise setAuthConfig avec le chemin du fichier de clé
        $client->setAuthConfig($keyFilePath);
        // Ajoute le scope nécessaire pour accéder à Calendar
        $client->addScope(Google\Service\Calendar::CALENDAR);

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
            $response = [
                'code' => 0,
                'message' => 'Données manquante pour créer le rendez-vous.',
            ];
            echo json_encode($response);
            exit();
        } else {
            $availableDuration = [30, 45, 60];
            if ($data['duration'] && !in_array($data['duration'], $availableDuration)) {
                http_response_code(400);
                $response = [
                    'code' => 0,
                    'message' => 'La durée doit être de 30, 45 ou 60 minutes.',
                ];
                echo json_encode($response);
                exit();
            }
        };

        $startDateTime = $data['startDate'] . ' ' . $data['startTime'] . ':00';
        $userTimeZone = $data['userTimeZone'];
        $userStartDateTime = new DateTime($startDateTime, new DateTimeZone($userTimeZone));
        $userStartDateTimeUTC = $userStartDateTime->setTimezone(new DateTimeZone('UTC'));
        $userStartDateTimeUTCToString = $userStartDateTimeUTC->format('Y-m-d H:i:s');
        $nowUTC = new DateTime('now', new DateTimeZone('UTC'));
        $appointDateTimeMin = $nowUTC->add(new DateInterval('PT8H'));

        if ($userStartDateTimeUTC < $appointDateTimeMin) {
            http_response_code(400); // Bad Request
            $response = [
                'code' => 0,
                'message' => 'La date et l\'heure de début doivent être au moins 8 heures dans le futur.',
                'data' => [
                    'appointDateTimeMin' => $appointDateTimeMin->format('Y-m-d H:i:s'),
                    'userStartDateTimeUTCToString' => $userStartDateTimeUTCToString,
                ]
            ];
            echo json_encode($response);
            exit();
        }

        $userId = $_SESSION['idUser'];
        $description = $data['description'];
        $duration = $data['duration'];
        $createdAt = date('Y-m-d H:i:s');
        $updatedAt = date('Y-m-d H:i:s');
        $status = 'active';
        $appointmentName = $_SESSION['firstName'] . "-" . $_SESSION['lastName'];

        try {
            $utcDateTimeForGoogle = new DateTime($userStartDateTimeUTCToString, new DateTimeZone('UTC'));

            $parisStartDateTime = (clone $utcDateTimeForGoogle)->setTimezone(new DateTimeZone('Europe/Paris'));
            $googleStartDateTime = $parisStartDateTime->format(DateTime::RFC3339);

            $interval = new DateInterval('PT' . $duration . 'M');
            $utcEndDateTimeForGoogle = (clone $utcDateTimeForGoogle)->add($interval);
            $parisEndDateTime = $utcEndDateTimeForGoogle->setTimezone(new DateTimeZone('Europe/Paris'));
            $googleEndDateTime = $parisEndDateTime->format(DateTime::RFC3339);

            //GOOGLE INSTANCE
            $client = $this->getClient();
            $service = new Google\Service\Calendar($client);

            // GOOGLE CALENDAR CHECK
            $checkParams = [
                'timeMin' => $googleStartDateTime,
                'timeMax' => $googleEndDateTime,
                'timeZone' => 'Europe/Paris',
                'singleEvents' => true,
            ];
            $existingEvents = $service->events->listEvents(GOOGLE_CALENDAR_ID, $checkParams);
            if (count($existingEvents->getItems()) > 0) {
                $response = [
                    'code' => 0,
                    'message' => 'Un événement existe déjà à cette date et heure.',
                ];
                echo json_encode($response);
                exit();
            }

            //GOOGLE CALENDAR register
            $event = new Google\Service\Calendar\Event([
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
                exit();
            }

            //Visio
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
            }

            //DATABASE
            $eventId = $createdEvent->getId();
            $eventDatabase = new EntitieEvent([
                'eventId' => $eventId,
                'userId' => $userId,
                'description' => $description,
                'duration' => $duration,
                'createdAt' => $createdAt,
                'startDateTime' => $userStartDateTimeUTCToString,
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
        } catch (Exception $e) {
            echo json_encode(['error' => 'Erreur lors de la création de l\'événement: ' . $e->getMessage()]);
            return;
        };
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
        $service = new Google\Service\Calendar($client);
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

    public function getOccupiedTimeSlots()
    {
        $userController = new ControllerUser();
        $userController->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        $utcTimeZone = new DateTimeZone('UTC'); // La timezone de la base de données
        $luluTimeZone = new DateTimeZone('Europe/Paris');

        $userTimeZone = new DateTimeZone($data['userTimeZone']); // Timezone de l'utilisateur
        //$userTimeZone = new DateTimeZone('Asia/Tokyo'); // Timzone de l'utilisateur

        $userDate = $data['date']; // La date demandée par l'utilisateur

        $startTime = new DateTime($userDate . ' 08:00:00', $luluTimeZone); // Crée un objet DateTime pour 8h00
        $startTime->setTimezone($utcTimeZone); // Définit la timezone de l'objet DateTime

        $endTime = new DateTime($userDate . ' 22:00:00', $luluTimeZone);
        $endTime->setTimezone($utcTimeZone); // Définit la timezone de l'objet DateTime

/*         $startLunch = new DateTime($userDate . ' 12:00:00', $luluTimeZone);
        $startLunch->setTimezone($utcTimeZone); // Définit la timezone de l'objet DateTime

        $endLunch = new DateTime($userDate . ' 14:00:00', $luluTimeZone);
        $endLunch->setTimezone($utcTimeZone); // Définit la timezone de l'objet DateTime */

        $userDateReference = new DateTime($userDate . "00:00:00", $userTimeZone); // Crée un objet DateTime avec la date UTC
        $userDateUtc = $userDateReference->setTimezone($utcTimeZone)->format('Y-m-d'); // Crée un objet DateTime avec la date UTC

        $controllerGoogle = new ControllerGoogle();
        $events = $controllerGoogle->getAvaibilityOnGoogleCalendar($startTime, $endTime);

        error_log("Google Busy Periods (pour le jour demandé): " . print_r($events, true));

        $interval = new DateInterval('PT15M'); // Intervalle de 15 minutes
        $occupiedTimeSlots = [];

        foreach ($events as $event) {
            $periodStart = $event->getStart();
            $periodEnd = $event->getEnd();
            $period = new DatePeriod(
                new DateTime($periodStart, new DateTimeZone('UTC')),
                $interval,
                new DateTime($periodEnd, new DateTimeZone('UTC'))
            );
            foreach ($period as $dt) {
                $occupiedTimeSlots[] = $dt->setTimezone($utcTimeZone)->format('Y-m-d H:i:s');
            }
        }

        $availableTimeSlots = [];

        $day = new DatePeriod($startTime, $interval, $endTime);
        $now = new DateTime('now', $utcTimeZone);
        $nextPossibleAppointment = (clone $now)->modify('+8 hours');


        foreach ($day as $time) {
            $timeString = (clone $time)->format('Y-m-d H:i:s');
            if (!in_array($timeString, $occupiedTimeSlots) && $time >= $nextPossibleAppointment) {
                $availableTimeSlots[] = $time;
            }
        }

        $lookupTimestamps = array_map(function ($element) {
            return $element->getTimestamp();
        }, $availableTimeSlots);

        $finalAvailableTimeSlots = [];

        foreach ($availableTimeSlots as $slotTime) {
            $slotTooShort = (clone $slotTime)->modify('+15 minutes');
            if (in_array($slotTooShort->getTimestamp(), $lookupTimestamps)) {
                $finalAvailableTimeSlots[] = $slotTime->setTimezone($userTimeZone)->format('H:i');
            }
        } 
        //echo json_encode($occupiedTimeSlots);
        echo json_encode($finalAvailableTimeSlots);
    }
}
