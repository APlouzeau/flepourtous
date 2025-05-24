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
            $client = $this->getClient();
            $service = new Google\Service\Calendar($client);

            $channel = new Google\Service\Calendar\Channel();
            $channel->setId(uniqid('flepourtous_channel_', false));
            $channel->setType('web_hook');
            $channel->setAddress(URI . "api/handleGoogleNotification"); // L'URL de votre webhook
            $channel->setParams(['ttl' => 3600]); // Durée de vie du canal en secondes
            $channel->setToken(GOOGLE_TOKEN); // Un token pour vérifier l'authenticité de la notification
            $watchResponse = $service->events->watch(GOOGLE_CALENDAR_ID, $channel);

            $modelGoogle = new ModelGoogle();
            $modelGoogle->saveWatchResponse($watchResponse);

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
        $response = $modelGoogle->checkIfResponseExists($channelIdHeader);

        echo json_encode("Coucou");
        if ($response) {
            if ($channelTokenHeader !== $response['token']) {
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

        //
        //error_log("Traitement de l'événement Google (print_r): " . print_r($event, true));
        // error_log("Traitement de l'événement Google (var_export): " . var_export($event, true));
        // error_log("Traitement de l'événement Google (json_encode): " . json_encode($event, JSON_PRETTY_PRINT));


        $modelUser = new ModelUser();
        $modelEvent = new ModelEvent();
        $eventId = $event->getId();
        // --- Début des vérifications robustes ---
        $eventStart = $event->getStart();
        if (!$eventStart) {
            error_log("Événement Google ID: " . $eventId . " n'a pas de propriété 'start'. Skipping.");
            return;
        }
        $startDateTimeISO = $eventStart->getDateTime() ?: $eventStart->getDate();

        $eventEnd = $event->getEnd();
        if (!$eventEnd) {
            error_log("\nÉvénement Google ID: " . $eventId . " n'a pas de propriété 'end'. Skipping.");
            return;
        }
        $endDateTimeISO = $eventEnd->getDateTime() ?: $eventEnd->getDate();

        if (empty($startDateTimeISO) || empty($endDateTimeISO)) {
            error_log("\nÉvénement Google ID: " . $eventId . " a des dates de début/fin invalides après traitement. Skipping.");
            return;
        }

        // Conversion de la date de début au format YYYY-MM-DD HH:MM:SS
        try {
            $dtStart = new DateTime($startDateTimeISO);
            $startDateTimeFormatted = $dtStart->format('Y-m-d H:i:s');
        } catch (Exception $e) {
            error_log("Événement Google ID: " . $eventId . " - Erreur de formatage de startDateTimeISO: " . $startDateTimeISO . " - Erreur: " . $e->getMessage());
            return; // Ne pas traiter si la date est invalide
        }

        // Calcul de la durée de manière plus robuste
        try {
            $dtEnd = new DateTime($endDateTimeISO);
            // $duration = (strtotime($endDateTimeISO) - strtotime($startDateTimeISO)) / 60; // Ancienne méthode
            $duration = ($dtEnd->getTimestamp() - $dtStart->getTimestamp()) / 60; // Nouvelle méthode plus fiable
        } catch (Exception $e) {
            error_log("Événement Google ID: " . $eventId . " - Erreur de calcul de duration avec startDateTimeISO: " . $startDateTimeISO . " et endDateTimeISO: " . $endDateTimeISO . " - Erreur: " . $e->getMessage());
            return; // Ne pas traiter si les dates pour la durée sont invalides
        }

        $description = $event->getSummary(); 
error_log("ControllerGoogle - eventId: " . $eventId . " - Valeur de startDateTimeFormatted AVANT création EntitieEvent: " . $startDateTimeFormatted);
        $attendees = $event->getAttendees();
        $userId = null;
        if (!empty($attendees) && isset($attendees[0]) && $attendees[0] instanceof \Google\Service\Calendar\EventAttendee && $attendees[0]->getEmail()) {
            $userEmail = $attendees[0]->getEmail();
            $userId = $modelUser->checkMail($userEmail);
            if ($userId === null || $userId === false) {
                error_log("Utilisateur non trouvé pour l'email: " . $userEmail . " (Événement Google ID: " . $eventId . ")");
                return;
            }
        } else {
            error_log("Aucun participant valide trouvé pour l'événement Google ID: " . $eventId . " pour déterminer l'utilisateur. Tentative avec le créateur/organisateur.");
            // Tentative avec le créateur
            $creator = $event->getCreator();
            if ($creator && $creator->getEmail()) {
                $creatorEmail = $creator->getEmail();
                $userId = $modelUser->checkMail($creatorEmail);
                if ($userId === null || $userId === false) {
                    error_log("Utilisateur non trouvé pour l'email du créateur: " . $creatorEmail . " (Événement Google ID: " . $eventId . ")");
                    return; // Ou autre logique
                }
            } else {
                // Tentative avec l'organisateur si pas de créateur ou pas d'email créateur
                $organizer = $event->getOrganizer();
                if ($organizer && $organizer->getEmail()) {
                    $organizerEmail = $organizer->getEmail();
                    $userId = $modelUser->checkMail($organizerEmail);
                    if ($userId === null || $userId === false) {
                        error_log("Utilisateur non trouvé pour l'email de l'organisateur: " . $organizerEmail . " (Événement Google ID: " . $eventId . ")");
                        return; // Ou autre logique
                    }
                } else {
                    error_log("Ni participant, ni créateur, ni organisateur avec email trouvé pour l'événement Google ID: " . $eventId);
                    return; // Ou autre logique si aucun utilisateur ne peut être déterminé
                }
            }
        }


        //--------------------------------------------
   error_log("ControllerGoogle - eventId: " . $eventId . " - Valeur de startDateTimeFormatted AVANT création EntitieEvent: " . $startDateTimeFormatted);
        error_log("ControllerGoogle - eventId: " . $eventId . " - Type de startDateTimeFormatted: " . gettype($startDateTimeFormatted));

        $eventDatabase = new EntitieEvent([
            'eventId' => $eventId,
            'userId' => $userId,
            'description' => $description,
            'duration' => $duration,
            'startDateTime' => $startDateTimeFormatted,
        ]);

        $status = $event->getStatus();
        if ($status == 'cancelled') {
            $modelEvent->deleteEvent($eventId);
        } else {
            $modelEvent->checkEvent($eventDatabase);
        }
    }
}
