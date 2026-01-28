<?php

require_once APP_PATH . 'vendor/autoload.php';
class ControllerGoogle
{
    private $modelEvent;
    private $modelUser;
    private $modelGoogleSync;
    private $modelGoogle;
    private $controllerVisio;
    private $controllerCalendar;
    private $modelPrices;  // ✅ Ajouter la déclaration
    private $controllerError;

    public function __construct()
    {
        $this->modelEvent = new ModelEvent();
        $this->modelUser = new ModelUser();
        $this->modelGoogleSync = new ModelGoogleSync();
        $this->modelGoogle = new ModelGoogle();
        $this->controllerVisio = new ControllerVisio();
        $this->controllerCalendar = new ControllerCalendar();
        $this->modelPrices = new ModelPrices();  // ✅ Initialiser
        $this->controllerError = new ControllerError();
    }
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

            $modelGoogleSync = new ModelGoogleSync();
            $modelGoogleSync->deleteSyncTokenForCalendar($calendarId);
            error_log("[Cron Google] Ancien syncToken pour le calendrier " . $calendarId . " supprimé pour forcer la resynchronisation.");

            $oldChannelData = $modelGoogle->findChannelByCalendarId($calendarId);
            if ($oldChannelData && isset($oldChannelData['canalId']) && isset($oldChannelData['resourceId'])) {
                try {
                    $channelToStop = new Google\Service\Calendar\Channel();
                    $channelToStop->setId($oldChannelData['canalId']);
                    $channelToStop->setResourceId($oldChannelData['resourceId']);
                    $service->channels->stop($channelToStop);
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
        error_log("Notification Google reçue.");
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
            echo "Notification reçue. ID : " . $channelIdHeader . ", État : " . $resourceStateHeader;
            flush();

            switch ($resourceStateHeader) {
                case 'sync':
                    $this->getEventsOnSync();
                    break;
                case 'exists':
                    $this->getEventsExists();
                    break;
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

        error_log("Recuperation des evenements existants avec le syncToken : " . $nextSyncToken);
        if ($nextSyncToken) {
            try {
                $eventsResults = $service->events->listEvents($calendarId, ['syncToken' => $nextSyncToken]);
                $events = $eventsResults->getItems();
                $this->controllerError->debug("Evenements recuperes : ", $events);

                foreach ($events as $event) {
                    if (strtolower($event->getSummary()) === 'pause' || strtolower($event->getSummary()) === 'absent' || strtolower($event->getSummary()) === 'ab' || strtolower($event->getSummary()) === 'abs') {
                        continue;
                    }
                    $this->updateCalendar($event);
                }

                $newSyncToken = $eventsResults->getNextSyncToken();
                if ($newSyncToken) {
                    $modelGoogleSync->saveNextSyncToken($calendarId, $newSyncToken);
                    $this->controllerError->debug("Nouveau syncToken sauvegarde apres traitement des evenements existants.");
                }
            } catch (Exception $e) {
                $this->controllerError->debug('Erreur lors de la recuperation des evenements : ', $e->getMessage());
                $modelGoogleSync->deleteNextSyncToken($nextSyncToken);
                $this->getEventsOnSync();
            }
        } else {
            $this->controllerError->debug('Aucun token de synchronisation trouve.');
        }
    }

    public function updateCalendar($event)
    {
        $this->controllerError->debug("Mise a jour de l'evenement Google ID: ", $event->getId());
        $idEvent = $event->getId();
        if ($event->getStatus() == 'cancelled') {
            $this->controllerError->debug("Événement annulé Google ID: ", $idEvent);
            $this->googleEventStatusCancelled($idEvent);
            return;
        }

        $idEvent = $event->getId();
        $isAppEvent = strpos($event->getDescription(), 'Source:app') !== false;
        if ($isAppEvent && $this->checkSameEvent($event)) {
            $this->controllerError->debug("Evenement Google ignoré car créé par l'appli (création initiale) :", $idEvent);
            return;
        }

        $this->controllerError->debug("Traitement de l'evenement Google ID: ", $event->getId());
        $eventStart = $event->getStart();
        $eventEnd = $event->getEnd();

        if (!$eventStart || !$eventStart->getDateTime() || !$eventEnd || !$eventEnd->getDateTime()) {
            return;
        }

        $startDateTimeISO = $eventStart->getDateTime();
        $endDateTimeISO = $eventEnd->getDateTime();

        try {
            $dtStart = new DateTime($startDateTimeISO);
            $dtStartUTC = (clone $dtStart)->setTimezone(new DateTimeZone('UTC'));
            $startDateTimeUTC = $dtStartUTC->format('Y-m-d H:i:s');

            $eventTimezone = $eventStart->getTimeZone() ?? 'Europe/Paris';

            $dtEnd = new DateTime($endDateTimeISO);
            $duration = ($dtEnd->getTimestamp() - $dtStart->getTimestamp()) / 60;

            $now = new DateTime('now', new DateTimeZone('Europe/Paris'));
            if ($dtEnd->getTimestamp() < ($now->getTimestamp() - 86400)) {
                return;
            }
        } catch (Exception $e) {
            error_log("Erreur de conversion de date pour l'événement Google ID: " . $idEvent . " - " . $e->getMessage());
            return;
        }

        $eventExist = $this->modelEvent->checkEvent($idEvent);

        if ($eventExist) {
            error_log("L'événement Google ID: " . $idEvent . " existe déjà en BDD. Mise à jour en cours.");
            $this->updateExistingEvent($event, $idEvent, $duration, $startDateTimeUTC, $eventTimezone);
        } else {
            if (!$eventExist) {
                error_log("L'événement Google ID: " . $idEvent . " n'existe pas en BDD. Création en cours.");
                $this->createNewEventFromGoogle($event, $idEvent, $duration, $startDateTimeUTC, $eventTimezone);
            }
        }
    }

    public function googleEventStatusCancelled($idEvent)
    {
        $this->controllerError->debug("Annulation en cours de l'evenement Google ID: ", $idEvent);
        $eventExist = $this->modelEvent->checkEvent($idEvent);
        error_log("checkEvent retourné: " . var_export($eventExist, true));
        error_log("Type de eventExist: " . gettype($eventExist));
        if ($eventExist) {
            // Si l'événement a déjà été annulé par l'app, on ignore la notification Google
            if (
                strpos($eventExist['status'], 'Annulé') !== false ||
                strpos($eventExist['status'], 'Annulé - Admin') !== false
            ) {
                $this->controllerError->debug("Événement déjà annulé par l'app, ignoré: ", $idEvent);
                return;
            }
            $this->controllerError->debug("Événement Google ID: ", $idEvent);
            $this->controllerError->debug(" annulé et existe en BDD. Suppression de la room visio et mise à jour de l'état.");
            $this->controllerVisio->deleteRoom($idEvent);
            $this->markGoogleEventAsCancelled($idEvent, $eventExist);
        } else {
            $this->controllerError->debug("Événement Google ID: ", $idEvent);
            $this->controllerError->debug(" annulé mais n'existe pas en BDD. Ignoré.");
        }
        $this->controllerError->debug("==================== FIN updateCalendar (cancelled) ====================");
    }

    private function createNewEventFromGoogle($event, $idEvent, $duration, $startDateTimeUTC, $eventTimezone)
    {
        $this->controllerError->debug("Création d'un nouvel événement Google ID: ", $idEvent);

        $userId = $this->getAttendeeFromGoogleEvent($event);

        error_log("userId détecté pour l'événement Google ID: " . $idEvent . " est " . $userId);
        $visioLink = $this->controllerVisio->createRoom($duration, $startDateTimeUTC, $idEvent);
        if (!$visioLink) {
            error_log("Impossible de créer le lien visio pour l'événement Google ID: " . $idEvent);
            return;
        }
        error_log("Lien visio créé pour l'événement Google ID: " . $idEvent . " - Lien: " . $visioLink);

        $newEvent = new EntitieEvent([
            'idEvent' => $idEvent,
            'userId' => $userId,
            'description' => $event->getSummary() || '',
            'duration' => $duration,
            'startDateTime' => $startDateTimeUTC,  // ✅ Stocké en UTC
            'timezone' => $eventTimezone,          // ✅ Timezone de l'événement
            'status' => 'Google',
            'visioLink' => $visioLink
        ]);

        try {
            $this->modelEvent->createEvent($newEvent);
        } catch (Exception $e) {
            error_log("Erreur lors de la création de l'événement Google ID: " . $idEvent . " - " . $e->getMessage());
        }
    }

    public function getAttendeeFromGoogleEvent($event)
    {
        error_log("Récupération de l'assignee pour l'événement Google ");
        try {
            if ($event->getAttendees() && count($event->getAttendees()) > 0) {
                error_log("Récupération de l'assignee pour l'événement Google ID: " . $event->getId());
                foreach ($event->getAttendees() as $attendee) {
                    $userId = $this->modelUser->checkMail($attendee->getEmail());
                    if ($userId) {
                        return $userId;
                    }
                }
            }
            error_log("Aucun participant trouvé autre que le compte de service. Utilisation de l'email par défaut de l'enseignant.");
            return $this->modelUser->checkMail(TEACHER_MAIL);
        } catch (Exception $e) {
            error_log('Erreur lors de la récupération de l\'assignee pour l\'événement Google ID: ' . ($event && method_exists($event, "getId") ? $event->getId() : 'unknown') . ' - ' . $e->getMessage());
            return null;
        }
    }

    public function updateExistingEvent($event, $idEvent, $duration, $startDateTimeUTC, $eventTimezone)
    {
        $this->controllerVisio->deleteRoom($idEvent);

        $visioLink = $this->controllerVisio->createRoom($duration, $startDateTimeUTC, $idEvent);
        $localUserId = $this->modelEvent->getUserIdByEventId($idEvent);
        $googleUserId = $this->getAttendeeFromGoogleEvent($event);

        if ($localUserId != $googleUserId) {
            error_log("Mise à jour de l'userId pour l'événement Google ID: " . $idEvent . " de " . $localUserId . " à " . $googleUserId);
            $userId = $localUserId;
        } else {
            $userId = $googleUserId;
        }

        $eventEntity = new EntitieEvent([
            'idEvent' => $idEvent,
            'userId' => $userId,
            'description' => $event->getSummary(),
            'duration' => $duration,
            'startDateTime' => $startDateTimeUTC,  // ✅ Stocké en UTC
            'timezone' => $eventTimezone,          // ✅ Timezone de l'événement
            'visioLink' => $visioLink,

        ]);
        $this->modelEvent->updateEvent($eventEntity);
    }

    public function markGoogleEventAsCancelled($idEvent, $event)
    {
        error_log("Marquage de l'événement Google ID: " . $idEvent . " comme annulé.");
        try {
            $price = null;  // ✅ Initialiser $price à null par défaut

            if (isset($event['id_lesson'])) {
                $price = $this->modelPrices->getPriceByEventId($idEvent);
                error_log("L'événement ID: " . $idEvent . " est lié à une leçon. Remboursement de " . $price['price'] . " en préparation.");
            }

            $userId = $event['userId'];
            $teacherId = $this->modelUser->checkMail(TEACHER_MAIL);

            if ($userId != $teacherId && $price['price'] != null) {
                $this->modelUser->addToWallet($userId, $price['price']);
                $this->modelEvent->updateEventStatus($idEvent, 'Annulé Google - Remboursé');
            } else {
                error_log("Pas de remboursement (userId=" . $userId . ", teacherId=" . $teacherId . ", price=" . ($price['price'] ?? 'null') . ")");
                $this->modelEvent->updateEventStatus($idEvent, 'Annulé Google - Non Remboursé');
            }
        } catch (Exception $e) {
            error_log("Erreur dans markGoogleEventAsCancelled pour l'événement " . $idEvent . ": " . $e->getMessage());
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

    public function checkSameEvent($googleEvent): bool
    {
        $idEvent = $googleEvent->getId();
        $localEvent = $this->modelEvent->checkEvent($idEvent);
        $localEventStart = new DateTime($localEvent['startDateTime'], new DateTimeZone('UTC'));
        $googleEventStart = new DateTime($googleEvent->getStart()->getDateTime(), new DateTimeZone('UTC'));
        $localEventDuration = $localEvent['duration'];
        $googleEventEnd = new DateTime($googleEvent->getEnd()->getDateTime(), new DateTimeZone('UTC'));
        $googleEventDuration = ($googleEventEnd->getTimestamp() - $googleEventStart->getTimestamp()) / 60;

        return $localEventStart == $googleEventStart && $localEventDuration == $googleEventDuration;
    }
}
