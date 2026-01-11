<?php

use Google\Service\Adsense\TimeZone;

require_once APP_PATH . 'vendor/autoload.php';



if (!class_exists('Google_Service_Calendar')) {
    die('ERREUR : La classe Google_Service_Calendar n\'a pas été trouvée par l\'autoloader.');
}
class ControllerCalendar
{
    private $frenchTimeZone = "Europe/Paris";
    private $modelEvent;
    private $modelUser;
    private $modelLesson;
    private $modelPrice;
    private $controllerMail;
    private $controllerUser;
    private $controllerLesson;
    private $controllerVisio;
    private $controllerError;

    public function __construct()
    {
        $this->modelEvent = new ModelEvent();
        $this->modelUser = new ModelUser();
        $this->modelLesson = new ModelLesson();
        $this->modelPrice = new ModelPrices();
        $this->controllerMail = new ControllerMail();
        $this->controllerUser = new ControllerUser();
        $this->controllerLesson = new ControllerLesson();
        $this->controllerVisio = new ControllerVisio();
        $this->controllerError = new ControllerError();
    }

    public function listEvents()
    {
        $this->controllerUser->verifyConnectBack();
        error_log("Récupération des événements pour l'utilisateur ID: " . $_SESSION['idUser']);

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
        $client->setAuthConfig($keyFilePath);
        $client->addScope(Google\Service\Calendar::CALENDAR);

        return $client;
    }

    public function listEventsMain()
    {
        $events = $this->modelEvent->getAllEvents();
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

    public function createEvent()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        if (!$data || !isset($data['description']) || !isset($data['startDate']) || !isset($data['startTime']) || !isset($data['duration']) || !isset($data['idLesson'])) {
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
        }

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

        $idLesson = (int)$data['idLesson'];
        $userId = $_SESSION['idUser'];
        $description = $data['description'];
        $duration = $data['duration'];
        $createdAt = date('Y-m-d H:i:s');
        $updatedAt = date('Y-m-d H:i:s');
        $status = 'En attente';
        $appointmentName = $_SESSION['firstName'] . "-" . $_SESSION['lastName'];

        // Récupérer l'email de l'utilisateur pour l'ajouter comme attendee dans Google Calendar
        $user = new EntitieUser([
            'idUser' => $userId,
        ]);
        $userData = $this->modelUser->getUser($user);
        $userEmail = $userData['mail'] ?? null;

        try {
            $utcDateTimeForGoogle = new DateTime($userStartDateTimeUTCToString, new DateTimeZone('UTC'));

            $parisStartDateTime = (clone $utcDateTimeForGoogle)->setTimezone(new DateTimeZone($this->frenchTimeZone));
            $googleStartDateTime = $parisStartDateTime->format(DateTime::RFC3339);

            $interval = new DateInterval('PT' . $duration . 'M');
            $utcEndDateTimeForGoogle = (clone $utcDateTimeForGoogle)->add($interval);
            $parisEndDateTime = $utcEndDateTimeForGoogle->setTimezone(new DateTimeZone($this->frenchTimeZone));
            $googleEndDateTime = $parisEndDateTime->format(DateTime::RFC3339);

            //GOOGLE INSTANCE
            $client = $this->getClient();
            $service = new Google\Service\Calendar($client);

            // GOOGLE CALENDAR CHECK
            $checkParams = [
                'timeMin' => $googleStartDateTime,
                'timeMax' => $googleEndDateTime,
                'timeZone' => $this->frenchTimeZone,
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
            $eventDescription = $description ?? '';
            if ($userEmail) {
                $eventDescription .= "\n\nUser: " . $userEmail;
            }
            $eventDescription .= "\n\nSource:app";

            $event = new Google\Service\Calendar\Event([
                'summary' => $appointmentName,
                'description' => $eventDescription,
                'start' => [
                    'dateTime' => $googleStartDateTime, // Format RFC3339 : '2025-05-03T10:00:00+02:00'
                    'timeZone' => $this->frenchTimeZone,
                ],
                'end' => [
                    'dateTime' => $googleEndDateTime, // Format RFC3339 : '2025-05-03T11:00:00+02:00'
                    'timeZone' => $this->frenchTimeZone,
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

            $idEvent = $createdEvent->getId();
            //Visio
            $roomUrl = $this->controllerVisio->createRoom($duration, $userStartDateTimeUTCToString, $idEvent);

            if ($roomUrl === false) {
                $responseVisio = [
                    'code' => 0,
                    'message' => 'Erreur lors de la création de la room visio',
                ];
                echo json_encode($responseVisio);
                return;
            }

            //DATABASE
            $eventDatabase = new EntitieEvent([
                'idEvent' => $idEvent,
                'userId' => $userId,
                'description' => $description,
                'duration' => $duration,
                'createdAt' => $createdAt,
                'startDateTime' => $userStartDateTimeUTCToString,  // Stocké en UTC
                'timezone' => $userTimeZone,  // Timezone de l'utilisateur pour affichage
                'updatedAt' => $updatedAt,
                'status' => $status,
                'visioLink' => $roomUrl,
                'id_lesson' => $idLesson,
            ]);

            $createdEvent = $this->modelEvent->createEvent($eventDatabase);
            $price = $this->modelPrice->getPriceForAppointment($duration, $idLesson);
            $lesson = $this->modelLesson->getLessonById($idLesson);
            $_SESSION['lesson_price'] = $price;
            $_SESSION['lesson_name'] = $lesson['title'];
            $_SESSION['event_id'] = $idEvent;

            if (!$createdEvent) {
                $response = [
                    'code' => 10,
                    'message' => 'Erreur lors de l\'enregistrement de l\'événement en base de données',
                    'data' => $eventDatabase
                ];
                echo json_encode($response);
                return;
            } else {
                $response = [
                    'code' => 1,
                    'message' => 'Événement enregistré avec succès',
                ];
            }
        } catch (Exception $e) {
            $errorResponse = [
                'error' => 'Erreur lors de la création de l\'événement: ' . $e->getMessage(),
                'details' => isset($eventDatabase) ? $eventDatabase : null
            ];
            echo json_encode($errorResponse);
            return;
        }
        echo json_encode($response);
    }

    public function listEventsUser()
    {
        $this->controllerUser->verifyConnectBack();
        $events = $this->modelEvent->getEventsUser($_SESSION['idUser']);
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

    public function checkDeleteEvent()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        $event = $this->modelEvent->getEventById($data['idEvent']);
        if (!$event) {
            $response = [
                'code' => 0,
                'message' => 'Événement non trouvé en base de données',
            ];
            echo json_encode($response);
            return;
        }
        error_log("data received : " . print_r($data, true));

        $timeRemaining = (new DateTime($event['startDateTime']))->getTimestamp() - (new DateTime('now', new DateTimeZone('UTC')))->getTimestamp();

        // Vérifier si c'est une annulation admin
        if (isset($data['code']) && $data['code'] === 3) {
            $response = [
                'code' => 3,
                'message' => "En tant qu'administrateur, vous pouvez annuler ce rendez-vous sans frais pour l'utilisateur. Un mail sera automatiquement envoyé à l'élève afin de le prévenir, et son porte-monnaie sera recrédité. Confirmez-vous l'annulation ?",
            ];
        } else {
            // Logique normale pour les utilisateurs
            if ($timeRemaining < 24 * 3600) {
                $response = [
                    'code' => 2,
                    'message' => "L'annulation d'un rendez-vous moins de 24 heures avant le début entraîne le paiement de la totalité de la séance. Confirmez- vous l'annulation ?",
                ];
            } else {
                $response = [
                    'code' => 1,
                    'message' => "L'annulation d'un rendez-vous plus de 24 heures avant le début n'entraîne aucune pénalité. Le montant de votre leçon sera recrédité sur votre porte-monnaie. Confirmez-vous l'annulation ?",
                ];
            }
        }
        echo json_encode($response);
    }

    public function deleteEvent()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        error_log("Début de la suppression de l'événement : " . print_r($data, true));

        if (!$data || !isset($data['idEvent']) || !isset($data['code'])) {
            $response = [
                'code' => 0,
                'message' => 'Données manquantes pour supprimer l\'événement (idEvent requis).'
            ];
            echo json_encode($response);
            return;
        }

        $event = $this->modelEvent->getEventById($data['idEvent']);
        if (!$event) {
            $response = [
                'code' => 0,
                'message' => 'Événement non trouvé en base de données',
            ];
            echo json_encode($response);
            return;
        }

        if ($event['userId'] != $_SESSION['idUser'] && $_SESSION['role'] != 'admin') {
            $response = [
                'code' => 0,
                'message' => 'Vous n\'êtes pas autorisé à supprimer cet événement.',
            ];
            echo json_encode($response);
            return;
        }
        $this->controllerError->debug("Suppression de l'evenement : ", $event);

        if ($event['status'] != 'Payé' && $event['status'] != 'Google') {
            $response = [
                'code' => 0,
                'message' => 'Seuls les rendez-vous payés ou pris par l\'enseignante peuvent être supprimés.',
            ];

            echo json_encode($response);
            return;
        }


        if ($event['status'] == 'Annulé - Remboursé' || $event['status'] == 'Annulé - Non remboursé' || $event['status'] == 'Annulé - Admin') {
            $response = [
                'code' => 0,
                'message' => 'Cet événement a déjà été annulé.',
            ];
            echo json_encode($response);
            return;
        }

        $invoiced = $data['code'];

        $lessonPrice = $this->modelPrice->getPriceByEventId($event['idEvent']);
        if ($invoiced == 1) {
            $this->modelUser->addToWallet($event['userId'], $lessonPrice['price']);
            $deleteEventSuccess = $this->modelEvent->updateEventStatus($data['idEvent'], 'Annulé - Remboursé');
        }

        if ($invoiced == 2) {
            $deleteEventSuccess = $this->modelEvent->updateEventStatus($data['idEvent'], 'Annulé - non remboursé');
        }

        if ($invoiced == 3) {
            $this->modelUser->addToWallet($event['userId'], $lessonPrice['price']);
            $this->controllerMail->sendMailToAlertEventDeleteByAdmin($event['userId'], $event['startDateTime'], $event['timezone'], $lessonPrice['price']);
            $deleteEventSuccess = $this->modelEvent->updateEventStatus($data['idEvent'], 'Annulé - Admin');
        }

        $client = $this->getClient();
        $service = new Google\Service\Calendar($client);
        $deletedEvent = $service->events->delete(GOOGLE_CALENDAR_ID, $data['idEvent']);

        if (!$deletedEvent) {
            $response = [
                'code' => 0,
                'message' => 'Erreur lors de la suppression de l\'événement dans Google Calendar',
            ];
            echo json_encode($response);
            return;
        }




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


    public function getAvailablesTimeSlots()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        $utcTimeZone = new DateTimeZone('UTC'); // La timezone de la base de données
        $frenchTimeZone = new DateTimeZone($this->frenchTimeZone); // La timezone de Paris

        $userTimeZone = new DateTimeZone($data['userTimeZone']); // Timezone de l'utilisateur

        $userDate = $data['date']; // La date demandée par l'utilisateur

        $startTime = new DateTime($userDate . ' 08:00:00', $frenchTimeZone); // Crée un objet DateTime pour 8h00 (heure minimum de rendez-vous)
        $startTime->setTimezone($utcTimeZone); // Définit la timezone de l'objet DateTime

        $endTime = new DateTime($userDate . ' 22:00:00', $frenchTimeZone); // Crée un objet DateTime pour 22h00 (heure de maximale de fin de journée)
        $endTime->setTimezone($utcTimeZone); // Définit la timezone de l'objet DateTime

        $controllerGoogle = new ControllerGoogle();
        $events = $controllerGoogle->getOccupiedSlotsOnGoogleCalendar($startTime, $endTime);

        error_log("Google Busy Periods (pour le jour demandé): " . print_r($events, true));

        $interval = new DateInterval('PT15M'); // Intervalle de 15 minutes
        $occupiedTimeSlots = [];

        if (is_array($events) && !empty($events)) {
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
        $occupiedTimeSlotsForAppointment = $data['selectedDuration'] / 15; // nombre de slots de 15 minutes nécessaires pour l'occupation

        foreach ($availableTimeSlots as $potentialStartSlot) {
            $isSlotSuitable = true;
            for ($i = 1; $i < $occupiedTimeSlotsForAppointment; $i++) {
                $nextBlockToCheckTime = (clone $potentialStartSlot)->modify('+' . (15 * $i) . ' minutes');
                if (!in_array($nextBlockToCheckTime->getTimestamp(), $lookupTimestamps)) {
                    $isSlotSuitable = false;
                    break;
                }
            }

            if ($isSlotSuitable) {
                $finalAvailableTimeSlots[] = $potentialStartSlot->setTimezone($userTimeZone)->format('H:i');
            }
        }
        if (empty($finalAvailableTimeSlots)) {
            $response = [
                'code' => 0,
                'message' => 'Aucun créneau disponible pour cette date.',
            ];
            echo json_encode($response);
            return;
        }
        if (!empty($finalAvailableTimeSlots)) {
            $response = [
                'code' => 1,
                'message' => 'Créneaux disponibles récupérés avec succès',
                'data' => $finalAvailableTimeSlots,
            ];
            echo json_encode($response);
        }
    }

    public function checkWaitingEvents()
    {
        $userWithEventDelete = $this->modelEvent->deleteWaitingEvent();
        if (!$userWithEventDelete) {
            $this->controllerMail = new ControllerMail();
            foreach ($userWithEventDelete as $user) {
                $this->controllerMail->sendMailToAlertEventDeleteBecauseNotPaid($user);
            }
            $response = [
                'code' => 1,
                'message' => 'Vérification des événements en attente effectuée avec succès',
            ];
            echo json_encode($response);
        }
    }

    public function createNewEventFromGoogle($event, $idEvent, $duration, $startDateTimeUtcFormatted, $startDateTime)
    {
        $description = $event->getSummary();
        $userId = null;

        $emailsToCheck = [];
        $attendees = $event->getAttendees();

        if (!empty($attendees)) {
            foreach ($attendees as $attendee) {
                if ($attendee->getEmail()) {
                    $emailsToCheck[] = $attendee->getEmail();
                }
            }
        }

        $creator = $event->getCreator();
        if ($creator && $creator->getEmail()) $emailsToCheck[] = $creator->getEmail();
        $organizer = $event->getOrganizer();
        if ($organizer && $organizer->getEmail()) $emailsToCheck[] = $organizer->getEmail();

        foreach ($emailsToCheck as $email) {
            $foundUserId = $this->modelUser->checkMail($email);
            if ($foundUserId) {
                $userId = $foundUserId;
                break;
            }
        }

        if ($userId === null) {
            error_log("Aucun utilisateur correspondant trouvé pour l'événement Google ID: " . $idEvent . ". Utilisation de l'admin par défaut.");
            $adminUserId = $this->modelUser->checkMail(TEACHER_MAIL);
            if ($adminUserId) {
                $userId = $adminUserId;
            } else {
                error_log("Erreur : L'utilisateur admin par défaut n'a pas été trouvé. L'événement Google ID: " . $idEvent . " ne peut pas être créé en base de données.");
                return;
            }
        }

        $status = 'Google';
        $visioLink = $this->controllerVisio->createRoom($duration, $startDateTimeUtcFormatted, $idEvent);
        $userTimeZone = 'Europe/Paris';

        $this->registerEventInDatabase($idEvent, $userId, $description, $duration, $startDateTimeUtcFormatted, $userTimeZone, $visioLink, $status);
    }

    private function registerEventInDatabase($idEvent, $userId, $description, $duration, $startDateTimeUtcFormatted, $userTimeZone, $visioLink, $status)
    {
        $createdAt = date('Y-m-d H:i:s');
        $updatedAt = date('Y-m-d H:i:s');

        $eventDatabase = new EntitieEvent([
            'idEvent' => $idEvent,
            'userId' => $userId,
            'description' => $description,
            'duration' => $duration,
            'createdAt' => $createdAt,
            'startDateTime' => $startDateTimeUtcFormatted,
            'timezone' => $userTimeZone,
            'updatedAt' => $updatedAt,
            'status' => $status,
            'visioLink' => $visioLink,
        ]);

        $createdEvent = $this->modelEvent->createEvent($eventDatabase);

        return $createdEvent;
    }
}
