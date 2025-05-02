<?php

require_once APP_PATH . 'vendor/autoload.php';
if (!class_exists('Google_Service_Calendar')) {
    die('ERREUR : La classe Google_Service_Calendar n\'a pas été trouvée par l\'autoloader.');
}
class ControllerCalendar
{

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

    public function listEvents()
    {
        try {
            $client = $this->getClient(); // Obtient le client authentifié via le compte de service
            $service = new Google_Service_Calendar($client);

            // Utilise l'ID du calendrier que tu as partagé avec le compte de service
            // Souvent 'primary' si c'est ton agenda principal, sinon l'ID spécifique du calendrier.
            $calendarId = 'ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807@group.calendar.google.com'; // Ou l'ID de ton calendrier partagé

            $events = $service->events->listEvents($calendarId, [
                'maxResults' => 10,
                'orderBy' => 'startTime',
                'singleEvents' => true,
                //'timeMin' => date('c'),
            ]);
            header('Content-Type: application/json'); // Important pour la réponse JSON
            echo json_encode($events->getItems());
        } catch (Exception $e) {
            http_response_code(500); // Erreur serveur
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Erreur lors de la récupération des événements: ' . $e->getMessage()]);
        }
    }

    // Tu peux maintenant ajouter une méthode pour créer un événement
    public function createEvent()
    {
        // Récupérer les données du POST (envoyées depuis le frontend)
        $postData = json_decode(file_get_contents('php://input'), true);

        if (!$postData || !isset($postData['summary']) || !isset($postData['start']) || !isset($postData['end'])) {
            http_response_code(400); // Bad Request
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Données manquantes pour créer l\'événement (summary, start, end requis).']);
            return;
        }

        try {
            $client = $this->getClient();
            $service = new Google_Service_Calendar($client);
            $calendarId = 'primary'; // Ou l'ID de ton calendrier partagé

            $event = new Google_Service_Calendar_Event([
                'summary' => $postData['summary'], // Ex: 'RDV avec ' . $postData['userName']
                'description' => $postData['description'] ?? '', // Description optionnelle
                'start' => [
                    'dateTime' => $postData['start'], // Format RFC3339 : '2025-05-03T10:00:00+02:00'
                    'timeZone' => 'Europe/Paris', // Adapte à ton fuseau horaire
                ],
                'end' => [
                    'dateTime' => $postData['end'], // Format RFC3339 : '2025-05-03T11:00:00+02:00'
                    'timeZone' => 'Europe/Paris', // Adapte à ton fuseau horaire
                ],
                // Tu peux ajouter des participants ici si tu veux inviter l'utilisateur par email
                // 'attendees' => [
                //     ['email' => $postData['userEmail']],
                // ],
            ]);

            $createdEvent = $service->events->insert($calendarId, $event);

            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'eventId' => $createdEvent->getId()]);
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Erreur lors de la création de l\'événement: ' . $e->getMessage()]);
        }
    }
}
