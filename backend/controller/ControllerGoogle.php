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
            if ($apiKey !== CRON_KEY) {
                http_response_code(403);
                echo "Clé API invalide.";
                error_log("[Cron Google] Tentative d'accès avec une clé API invalide.");
                return;
            }

            $client = $this->getClient();
            $service = new Google\Service\Calendar($client);
            $calendarId = GOOGLE_CALENDAR_ID;
            $modelGoogle = new ModelGoogle();

            // --- DÉBUT DE LA MODIFICATION ---

            // 1. On supprime l'ancien syncToken pour forcer une resynchronisation complète.
            // C'est la seule façon de garantir que le syncToken et le canal sont toujours alignés.
            $modelGoogleSync = new ModelGoogleSync();
            $modelGoogleSync->deleteSyncTokenForCalendar($calendarId);
            error_log("[Cron Google] Ancien syncToken pour le calendrier " . $calendarId . " supprimé pour forcer la resynchronisation.");

            // --- FIN DE LA MODIFICATION ---

            $oldChannelData = $modelGoogle->findChannelByCalendarId($calendarId);
            if ($oldChannelData && isset($oldChannelData['canalId']) && isset($oldChannelData['resourceId'])) {
                try {
                    $channelToStop = new Google\Service\Calendar\Channel();
                    $channelToStop->setId($oldChannelData['canalId']);
                    $channelToStop->setResourceId($oldChannelData['resourceId']);
                    $service->channels->stop($channelToStop);
                    error_log("[Cron Google] Ancien canal de notification arrêté avec succès : " .  $oldChannelData['canalId']);
                } catch (Exception $e) {
                    error_log("[Cron Google] Avertissement lors de l'arrêt de l'ancien canal (ce n'est probablement pas une erreur grave) : " . $e->getMessage());
                }
            }

            $channel = new Google\Service\Calendar\Channel();
            $channel->setId(uniqid('flepourtous_channel_', false));
            $channel->setType('web_hook');
            $channel->setAddress(URI . "api/handleGoogleNotification");
            $channel->setParams(['ttl' => 7 * 24 * 3600]);
            $channel->setToken(GOOGLE_TOKEN);

            $watchResponse = $service->events->watch($calendarId, $channel);

            // ✅ Utiliser la nouvelle méthode plus simple et robuste
            $modelGoogle->upsertChannel($watchResponse, $calendarId);

            echo "Canal de notification reconfiguré. Nouvel ID: " . $watchResponse->getId() . " Expire le: " . date('Y-m-d H:i:s', $watchResponse->getExpiration() / 1000);
        } catch (Exception $e) {
            http_response_code(500);
            error_log('Erreur critique lors de la création du canal : ' . $e->getMessage());
            echo 'Erreur critique lors de la création du canal : ' . $e->getMessage();
        }
    }

    public function handleGoogleNotification()
    {
        $channelIdHeader = $_SERVER['HTTP_X_GOOG_CHANNEL_ID'] ?? null;
        $resourceStateHeader = $_SERVER['HTTP_X_GOOG_RESOURCE_STATE'] ?? null;
        $messageNumberHeader = $_SERVER['HTTP_X_GOOG_MESSAGE_NUMBER'] ?? null;
        $channelTokenHeader = $_SERVER['HTTP_X_GOOG_CHANNEL_TOKEN'] ?? null;

        $modelGoogle = new ModelGoogle();
        $channel = $modelGoogle->findChannelByChannelId($channelIdHeader);

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
        $modelEvent = new ModelEvent();
        $idEvent = $event->getId();

        $eventStart = $event->getStart();
        $eventEnd = $event->getEnd();

        if (!$eventStart || !$eventStart->getDateTime() || !$eventEnd || !$eventEnd->getDateTime()) {
            error_log("Événement Google ID: " . $idEvent . " est un événement 'toute la journée' ou invalide. Ignoré.");
            return;
        }

        $startDateTimeISO = $eventStart->getDateTime();
        $endDateTimeISO = $eventEnd->getDateTime();

        try {
            $dtStart = new DateTime($startDateTimeISO);
            $dtStart->setTimezone(new DateTimeZone('UTC'));
            $startDateTimeUtcFormatted = $dtStart->format('Y-m-d H:i:s');

            $dtEnd = new DateTime($endDateTimeISO);
            $duration = ($dtEnd->getTimestamp() - $dtStart->getTimestamp()) / 60;
        } catch (Exception $e) {
            error_log("Erreur de conversion de date pour l'événement Google ID: " . $idEvent . " - " . $e->getMessage());
            return;
        }

        $description = $event->getSummary();

        $modelUser = new ModelUser();
        $userId = null;

        $emailsToCheck = [];
        $attendees = $event->getAttendees();
        if (!empty($attendees)) {
            foreach ($attendees as $attendee) {
                if ($attendee && $attendee->getEmail()) $emailsToCheck[] = $attendee->getEmail();
            }
        }
        $creator = $event->getCreator();
        if ($creator && $creator->getEmail()) $emailsToCheck[] = $creator->getEmail();
        $organizer = $event->getOrganizer();
        if ($organizer && $organizer->getEmail()) $emailsToCheck[] = $organizer->getEmail();

        foreach (array_unique($emailsToCheck) as $email) { // array_unique pour éviter de vérifier deux fois le même email
            $potentialUserId = $modelUser->checkMail($email);
            if ($potentialUserId) {
                $userId = $potentialUserId;
                break;
            }
        }

        if ($userId === null) {
            error_log("Aucun utilisateur correspondant trouvé pour l'événement Google ID: " . $idEvent . ". Ignoré.");
            return;
        }

        error_log("Traitement de l'événement Google ID: " . $idEvent . " pour l'utilisateur ID: " . $userId);

        $controllerVisio = new ControllerVisio();
        $status = $event->getStatus();

        if ($status == 'cancelled') {
            $controllerVisio->deleteRoom($idEvent);
            $modelEvent->deleteEvent($idEvent);
        } else {
            $eventExist = $modelEvent->checkEvent($idEvent);
            if ($eventExist) {
                $controllerVisio->deleteRoom($idEvent);
                $roomUrl = $controllerVisio->createRoom($duration, $startDateTimeUtcFormatted, $idEvent);
                if (!$roomUrl) {
                    error_log("Erreur lors de la création de la room visio pour la mise à jour de l'événement ID: " . $idEvent);
                    return;
                }
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
                $roomUrl = $controllerVisio->createRoom($duration, $startDateTimeUtcFormatted, $idEvent);
                if (!$roomUrl) {
                    error_log("Erreur lors de la création de la room visio pour le nouvel événement ID: " . $idEvent);
                    return;
                }
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
