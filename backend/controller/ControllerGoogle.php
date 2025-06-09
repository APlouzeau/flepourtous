<?php

require_once APP_PATH . 'vendor/autoload.php';
class ControllerGoogle
{
    protected function getClient()
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

    public function setupCalendarWatch()
    {
        try {
            $apiKey = $_SERVER['HTTP_API_KEY'] ?? null;
            error_log("Clé API reçue : " . $apiKey);
            if ($apiKey !== CRON_KEY) {
                http_response_code(403);
                echo "Clé API invalide.";
                return;
            }
            $client = $this->getClient();
            $service = new Google\Service\Calendar($client);

            $channel = new Google\Service\Calendar\Channel();
            $channel->setId(uniqid('flepourtous_channel_', false));
            $channel->setType('web_hook');
            $channel->setAddress(URI . "api/handleGoogleNotification"); // L'URL de votre webhook
            $channel->setParams(['ttl' => 7 * 24 * 3600]); // Durée de vie du canal en secondes
            $channel->setToken(GOOGLE_TOKEN); // Un token pour vérifier l'authenticité de la notification
            $watchResponse = $service->events->watch(GOOGLE_CALENDAR_ID, $channel);

            $modelGoogle = new ModelGoogle();
            $modelGoogle->checkChannel($watchResponse);

            echo "Canal de notification configuré. ID: " . $watchResponse->getId() . " Expire le: " . date('Y-m-d H:i:s', $watchResponse->getExpiration() / 1000);
        } catch (Exception $e) {
            echo 'Erreur lors de la création du canal : ' . $e->getMessage();
        }
    }

    public function handleGoogleNotification()
    {
        $channelIdHeader = $_SERVER['HTTP_X_GOOG_CHANNEL_ID'] ?? null;
        $resourceStateHeader = $_SERVER['HTTP_X_GOOG_RESOURCE_STATE'] ?? null;
        $messageNumberHeader = $_SERVER['HTTP_X_GOOG_MESSAGE_NUMBER'] ?? null;
        $channelTokenHeader = $_SERVER['HTTP_X_GOOG_CHANNEL_TOKEN'] ?? null; // Si tu as défini un toke

        $modelGoogle = new ModelGoogle();
        $channel = $modelGoogle->checkIfChannelExists($channelIdHeader);

        if ($channel) {
            if ($channelTokenHeader !== $channel['token']) {
                http_response_code(401);
                echo "Token non valide.";
                return;
            }
            http_response_code(200);
            echo "Notification reçue. ID de la notification : " . $channelIdHeader . ", État de la ressource : " . $resourceStateHeader . ", Numéro de message : " . $messageNumberHeader;
            flush();

            switch ($resourceStateHeader) {
                case 'sync':
                    $this->getEventsOnSync();
                    break;
                case 'exists':
                    $this->getEventsExists();
                    break;

                case 'not_found':
                    error_log("Notification reçue. ID de la notification : " . $channelIdHeader . ", État de la ressource : " . $resourceStateHeader . ", Numéro de message : " . $messageNumberHeader);
                    break;
                case 'not_exists':
                    error_log("Notification reçue. ID de la notification : " . $channelIdHeader . ", État de la ressource : " . $resourceStateHeader . ", Numéro de message : " . $messageNumberHeader);
            }
        } else {
            http_response_code(404);
            echo "Canal de notification non trouvé.";
            error_log("Canal de notification non trouvé pour l'ID : " . $channelIdHeader);
        }
    }



    public function getEventsOnSync()
    {
        $client = $this->getClient();
        $service = new \Google\Service\Calendar($client);
        $calendarId = GOOGLE_CALENDAR_ID;

        $eventsResults = $service->events->listEvents($calendarId);
        $events = $eventsResults->getItems();
        $nextSyncToken = $eventsResults->getNextSyncToken();

        if ($nextSyncToken) {
            $modelGoogleSync = new ModelGoogleSync();
            $modelGoogleSync->saveNextSyncToken($calendarId, $nextSyncToken);
        }
        foreach ($events as $event) {
            $this->updateCalendar($event);
        }
    }

    public function getEventsExists()
    {
        $client = $this->getClient();
        $service = new \Google\Service\Calendar($client);
        $calendarId = GOOGLE_CALENDAR_ID;

        $modelGoogleSync = new ModelGoogleSync();
        $nextSyncToken = $modelGoogleSync->getNextSyncToken($calendarId);

        if ($nextSyncToken) {
            try {
                $eventsResults = $service->events->listEvents($calendarId, ['syncToken' => $nextSyncToken]);
                $events = $eventsResults->getItems();
                foreach ($events as $event) {
                    if ($event->getSummary() === 'Pause' || $event->getSummary() === 'Absent') {
                        return; // Ignorer les événements de type "Pause"
                    }
                    $this->updateCalendar($event);
                }
            } catch (Exception $e) {
                error_log('Erreur lors de la récupération des événements : ' . $e->getMessage());
                $modelGoogleSync->deleteNextSyncToken($nextSyncToken);
                $this->getEventsOnSync();
            }
        } else {
            error_log('Aucun token de synchronisation trouvé.');
        }
    }

    public function updateCalendar($event)
    {

        $modelUser = new ModelUser();
        $modelEvent = new ModelEvent();
        $idEvent = $event->getId();
        // --- Début des vérifications  ---
        $eventStart = $event->getStart();
        if (!$eventStart) {
            error_log("Événement Google ID: " . $idEvent . " n'a pas de propriété 'start'. Skipping.");
            return;
        }
        $startDateTimeISO = $eventStart->getDateTime() ?: $eventStart->getDate();

        $eventEnd = $event->getEnd();
        if (!$eventEnd) {
            error_log("\nÉvénement Google ID: " . $idEvent . " n'a pas de propriété 'end'. Skipping.");
            return;
        }
        $endDateTimeISO = $eventEnd->getDateTime() ?: $eventEnd->getDate();

        if (empty($startDateTimeISO) || empty($endDateTimeISO)) {
            error_log("\nÉvénement Google ID: " . $idEvent . " a des dates de début/fin invalides après traitement. Skipping.");
            return;
        }

        // Conversion de la date de début au format YYYY-MM-DD HH:MM:SS
        try {
            $dtStart = new DateTime($startDateTimeISO);
            $startDateTimeFormatted = $dtStart->format('Y-m-d H:i:s');
        } catch (Exception $e) {

            return;
        }


        try {
            $dtEnd = new DateTime($endDateTimeISO);

            $duration = ($dtEnd->getTimestamp() - $dtStart->getTimestamp()) / 60;
        } catch (Exception $e) {
            return; // Ne pas traiter si les dates pour la durée sont invalides
        }

        $description = $event->getSummary();

        $attendees = $event->getAttendees();
        $userId = null;
        if (!empty($attendees) && isset($attendees[0]) && $attendees[0] instanceof \Google\Service\Calendar\EventAttendee && $attendees[0]->getEmail()) {
            $userEmail = $attendees[0]->getEmail();
            $userId = $modelUser->checkMail($userEmail);
            if ($userId === null || $userId === false) {
                return;
            }
        } else {
            // Tentative avec le créateur
            $creator = $event->getCreator();
            if ($creator && $creator->getEmail()) {
                $creatorEmail = $creator->getEmail();
                $userId = $modelUser->checkMail($creatorEmail);
                if ($userId === null || $userId === false) {
                    return; // Ou autre logique
                }
            } else {
                // Tentative avec l'organisateur si pas de créateur ou pas d'email créateur
                $organizer = $event->getOrganizer();
                if ($organizer && $organizer->getEmail()) {
                    $organizerEmail = $organizer->getEmail();
                    $userId = $modelUser->checkMail($organizerEmail);
                    if ($userId === null || $userId === false) {
                        return; // Ou autre logique
                    }
                } else {

                    return; // Ou autre logique si aucun utilisateur ne peut être déterminé
                }
            }
        }


        //--------------------------------------------

        $startDateTimeUtc = new DateTime($startDateTimeFormatted, new DateTimeZone('Europe/Paris'));
        $startDateTimeUtc->setTimezone(new DateTimeZone('UTC'));
        $startDateTimeUtcFormatted = $startDateTimeUtc->format('Y-m-d H:i:s');

        $controllerVisio = new ControllerVisio();

        $status = $event->getStatus();
        if ($status == 'cancelled') {
            $controllerVisio->deleteRoom($idEvent);
            $modelEvent->deleteEvent($idEvent);
        } else {
            $eventExist = $modelEvent->checkEvent($idEvent);
            if ($eventExist) {
                $controllerVisio->deleteRoom($idEvent);
                $roomUrl = $controllerVisio->createRoom($duration, $startDateTimeUtcFormatted);

                $eventDatabase = new EntitieEvent([
                    'idEvent' => $idEvent,
                    'userId' => $userId,
                    'description' => $description,
                    'duration' => $duration,
                    'startDateTime' => $startDateTimeUtcFormatted,
                    'visioLink' => $roomUrl,
                ]);

                $modelEvent->updateEvent($eventDatabase);
            } else {
                $roomUrl = $controllerVisio->createRoom($duration, $startDateTimeUtcFormatted);
                $eventDatabase = new EntitieEvent([
                    'idEvent' => $idEvent,
                    'userId' => $userId,
                    'description' => $description,
                    'duration' => $duration,
                    'startDateTime' => $startDateTimeUtcFormatted,
                    'visioLink' => $roomUrl,
                ]);
                $modelEvent->createEvent($eventDatabase);
            }
        }
        if (!$roomUrl) {
            error_log("Erreur lors de la création de la room visio pour l'événement ID: " . $idEvent);
            return; // Ne pas continuer si la room visio n'a pas pu être créée
        }
    }

    public function getOccupiedSlotsOnGoogleCalendar($startDateTime, $endDateTime)
    {
        $client = $this->getClient();
        $service = new \Google\Service\Calendar($client);
        $calendarId = GOOGLE_CALENDAR_ID;

        $startDateTimeGoogle = $startDateTime->format(DateTime::RFC3339);
        $endDateTimeGoogle = $endDateTime->format(DateTime::RFC3339);

        try {
            $freebusyQuery = new Google\Service\Calendar\FreeBusyRequest();
            $freebusyQuery->setTimeMin($startDateTimeGoogle);
            $freebusyQuery->setTimeMax($endDateTimeGoogle);
            $freebusyQuery->setItems([['id' => $calendarId]]);

            $freebusyResponse = $service->freebusy->query($freebusyQuery);
            $calendarsData = $freebusyResponse->getCalendars();
            $calendarSpecificData = $calendarsData[$calendarId];
            $busySlots = $calendarSpecificData->getBusy();

            error_log("Disponibilité récupérée pour la période du " . $startDateTime->format('Y-m-d H:i:s') . " au " . $endDateTime->format('Y-m-d H:i:s') . "\n");

            return $busySlots;
        } catch (Exception $e) {
            error_log('Erreur lors de la récupération de la disponibilité : ' . $e->getMessage());
            return null;
        }
    }
}
