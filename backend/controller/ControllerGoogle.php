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

    public function __construct()
    {
        $this->modelEvent = new ModelEvent();
        $this->modelUser = new ModelUser();
        $this->modelGoogleSync = new ModelGoogleSync();
        $this->modelGoogle = new ModelGoogle();
        $this->controllerVisio = new ControllerVisio();
        $this->controllerCalendar = new ControllerCalendar();
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
                error_log("Nombre d'événements récupérés: " . count($events));
                $compteur = 0;
                foreach ($events as $event) {
                    $compteur++;
                    error_log("Traitement de l'événement $compteur/" . count($events) . ": " . $event->getId() . " - Summary: " . ($event->getSummary() ?? 'NULL') . " - Status: " . ($event->getStatus() ?? 'NULL'));
                    if ($event->getSummary() === 'Pause' || $event->getSummary() === 'Absent') {
                        error_log("Événement ignoré (Pause/Absent): " . $event->getId());
                        continue; // Utiliser continue au lieu de return pour traiter les autres événements
                    }
                    $this->updateCalendar($event);
                    error_log("Événement $compteur traité avec succès");
                }
                error_log("FIN DE LA BOUCLE - Total traité: $compteur événements");
                
                $newSyncToken = $eventsResults->getNextSyncToken();
                if ($newSyncToken) {
                    error_log("🔄 Mise à jour du syncToken: " . substr($newSyncToken, 0, 50) . "...");
                    $modelGoogleSync->saveNextSyncToken($calendarId, $newSyncToken);
                } else {
                    error_log("⚠️ Aucun nouveau syncToken retourné par Google API");
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
        $idEvent = $event->getId();
        error_log("==================== DÉBUT updateCalendar ====================");
        error_log("Event ID: " . $idEvent);
        error_log("Event Summary: " . ($event->getSummary() ?? 'NULL'));
        error_log("Event Status: " . ($event->getStatus() ?? 'NULL'));
        
        // Ignorer immédiatement les événements annulés s'ils n'existent pas en BDD
        if ($event->getStatus() == 'cancelled') {
            $this->googleEventStatusCancelled($idEvent);
            return;
        }
        
        $eventStart = $event->getStart();
        $eventEnd = $event->getEnd();
        
        if (!$eventStart || !$eventStart->getDateTime() || !$eventEnd || !$eventEnd->getDateTime()) {
            error_log("Événement Google ID: " . $idEvent . " est un événement 'toute la journée' ou invalide. Ignoré.");
            error_log("==================== FIN updateCalendar (ignoré) ====================");
            return;
        }
        
        $startDateTimeISO = $eventStart->getDateTime();
        $endDateTimeISO = $eventEnd->getDateTime();
        error_log("Start DateTime ISO: " . $startDateTimeISO);
        error_log("End DateTime ISO: " . $endDateTimeISO);
        
        try {
            $dtStart = new DateTime($startDateTimeISO);
            $dtDbStart = $dtStart;
            $startDateTimeParisFormatted = $dtStart->format('Y-m-d H:i:s');
            
            $startDateTime = $dtDbStart->format('Y-m-d H:i:s');
            
            $dtEnd = new DateTime($endDateTimeISO);
            $duration = ($dtEnd->getTimestamp() - $dtStart->getTimestamp()) / 60;

            error_log("Start DateTime Paris Formatted: " . $startDateTimeParisFormatted);
            error_log("Duration: " . $duration . " minutes");

            $now = new DateTime('now', new DateTimeZone('Europe/Paris'));
            if ($dtEnd->getTimestamp() < ($now->getTimestamp() - 86400)) {
                error_log("Événement Google ID: " . $idEvent . " est trop ancien (fin: " . $dtEnd->format('Y-m-d H:i:s') . "). Ignoré.");
                error_log("==================== FIN updateCalendar (trop ancien) ====================");
                return;
            }
        } catch (Exception $e) {
            error_log("Erreur de conversion de date pour l'événement Google ID: " . $idEvent . " - " . $e->getMessage());
            error_log("==================== FIN updateCalendar (erreur) ====================");
            return;
        }

        $eventExist = $this->modelEvent->checkEvent($idEvent);
        error_log("L'événement existe en BDD: " . ($eventExist ? 'OUI' : 'NON'));
        
        if ($eventExist) {
            error_log("Événement Google ID: " . $idEvent . " existe déjà. Mise à jour en cours.");
            error_log("Mise à jour de l'événement Google ID: " . $idEvent . " dans la base de données locale.");
            $this->updateExistingEvent($event, $idEvent, $duration, $startDateTimeParisFormatted, $startDateTime);
            error_log("==================== FIN updateCalendar (updated) ====================");
            return;
        }

        if (!$eventExist) {
            error_log("Création d'un nouvel événement Google ID: " . $idEvent);
            $this->createNewEventFromGoogle($event,$idEvent, $duration, $startDateTimeParisFormatted, $startDateTime);
            error_log("==================== FIN updateCalendar (created) ====================");
            return;
        }
        
        error_log("==================== FIN updateCalendar (aucune action) ====================");
    }

    public function googleEventStatusCancelled($idEvent)
    {
        $eventExist = $this->modelEvent->checkEvent($idEvent);
        if ($eventExist) {
            error_log("Événement Google ID: " . $idEvent . " annulé et existe en BDD. Suppression de la room visio et mise à jour de l'état.");
            $this->controllerVisio->deleteRoom($idEvent);
            $this->markGoogleEventAsCancelled($idEvent);
            return;
        } else {
            error_log("Événement Google ID: " . $idEvent . " annulé mais n'existe pas en BDD. Ignoré.");
        }
        error_log("==================== FIN updateCalendar (cancelled) ====================");
        return;
    }
    
    public function createNewEventFromGoogle($event, $idEvent, $duration, $startDateTimeParisFormatted, $startDateTime)
    {
        error_log(">>> CRÉATION d'un nouvel événement depuis Google <<<");
        error_log("ID Event: " . $idEvent);
        error_log("Duration: " . $duration);
        error_log("Start DateTime Paris: " . $startDateTimeParisFormatted);
        error_log("Summary: " . ($event->getSummary() ?? 'NULL'));
        
        $startDateTimeUtc = (new DateTime($startDateTimeParisFormatted))->setTimezone(new DateTimeZone('UTC'));
        $visioLink = $this->controllerVisio->createRoom($duration, $startDateTimeUtc->format('Y-m-d H:i:s'), $idEvent);
        $userId = $this->getAttendeeFromGoogleEvent($event);

        error_log("Préparation de l'objet EntitieEvent pour l'enregistrement.");
        error_log("User ID trouvé: " . ($userId ?? 'NULL'));
        
        $eventEntity = new EntitieEvent([
            'idEvent' => $idEvent,
            'duration' => $duration,
            'startDateTime' => $startDateTimeParisFormatted,
            'timezone' => 'Europe/Paris',
            'visioLink' => $visioLink,
            'userId' => $userId,
            'description' => $event->getSummary(),
            'status' => 'Google'
        ]);
        error_log("Préparation à l'enregistrement en BDD.");
        $result = $this->modelEvent->createEvent($eventEntity);
        error_log("Résultat de la création: " . ($result ? 'SUCCESS' : 'FAILED'));
    }

    public function getAttendeeFromGoogleEvent($event)
    {
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

    public function updateExistingEvent($event, $idEvent, $duration, $startDateTimeParisFormatted, $startDateTime)
    {
        error_log(">>> MISE À JOUR d'un événement existant <<<");
        error_log("ID Event: " . $idEvent);
        error_log("Duration: " . $duration);
        error_log("Start DateTime Paris: " . $startDateTimeParisFormatted);
        error_log("Summary: " . ($event->getSummary() ?? 'NULL'));
        
        $startDateTimeUtc = new DateTime($event->getStart()->getDateTime(), new DateTimeZone('UTC'));
        error_log("Suppression de l'ancienne room visio...");
        $this->controllerVisio->deleteRoom($idEvent);
        error_log("Création de la nouvelle room visio...");
        $visioLink = $this->controllerVisio->createRoom($duration, $startDateTimeUtc->format('Y-m-d H:i:s'), $idEvent);
        error_log("Nouvelle room créée: " . $visioLink);
        
        $eventEntity = new EntitieEvent([
            'idEvent' => $idEvent,
            'description' => $event->getSummary(),
            'duration' => $duration,
            'startDateTime' => $startDateTimeParisFormatted,
            'timezone' => 'Europe/Paris',
            'visioLink' => $visioLink,
        ]);
        error_log("Mise à jour en BDD...");
        $result = $this->modelEvent->updateEvent($eventEntity);
        error_log("Résultat de la mise à jour: " . ($result ? 'SUCCESS' : 'FAILED'));
    }

    public function markGoogleEventAsCancelled($idEvent)
    {
        try {
            error_log("Début du traitement de l'annulation pour l'événement: " . $idEvent);

            $event = $this->modelEvent->checkEvent($idEvent);
            if (isset($event['id_lesson'])){
                $price = $this->modelPrices->getPriceByEventId($idEvent);
                error_log("Prix récupéré: " . ($price ?? 'NULL'));
            }
            
            $userId = $this->modelEvent->getUserIdByEventId($idEvent);
            error_log("User ID récupéré: " . ($userId ?? 'NULL'));
            
            if ($userId && $price) {
                error_log("Remboursement de l'utilisateur ID: " . $userId . " pour l'événement Google ID: " . $idEvent . " d'un montant de: " . $price);
                $this->modelUser->updateWallet($userId, $price);
                $this->modelEvent->updateEventStatus($idEvent, 'Annulé - Remboursé');
            } else {
                error_log("Pas de remboursement: userId=" . ($userId ?? 'NULL') . ", price=" . ($price ?? 'NULL'));
                $this->modelEvent->updateEventStatus($idEvent, 'Annulé');
            }
            
            error_log("Événement Google ID: " . $idEvent . " marqué comme annulé dans la base de données locale.");
        } catch (Exception $e) {
            error_log("ERREUR dans markGoogleEventAsCancelled pour l'événement " . $idEvent . ": " . $e->getMessage());
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
