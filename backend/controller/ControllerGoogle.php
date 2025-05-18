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
    public function handleGoogleNotification()
    {
        $channelIdHeader = $_SERVER['HTTP_X_GOOG_CHANNEL_ID'] ?? null;
        $resourceStateHeader = $_SERVER['HTTP_X_GOOG_RESOURCE_STATE'] ?? null;
        $messageNumberHeader = $_SERVER['HTTP_X_GOOG_MESSAGE_NUMBER'] ?? null;
        $channelTokenHeader = $_SERVER['HTTP_X_GOOG_CHANNEL_TOKEN'] ?? null; // Si tu as défini un toke

        $modelGoogle = new ModelGoogle();
        $response = $modelGoogle->checkIfResponseExists($channelIdHeader);

        if ($response) {
            if ($channelTokenHeader !== $response['token']) {
                echo "Token non valide.";
                return;
            }
            http_response_code(200);
            echo "Notification reçue. ID de la notification : " . $channelIdHeader . ", État de la ressource : " . $resourceStateHeader . ", Numéro de message : " . $messageNumberHeader;
            flush();

            if ($resourceStateHeader === 'sync') {
                error_log("Notification reçue. ID de la notification : " . $channelIdHeader . ", État de la ressource : " . $resourceStateHeader . ", Numéro de message : " . $messageNumberHeader);
            }
            if ($resourceStateHeader === 'exists') {
                error_log("Notification reçue. ID de la notification : " . $channelIdHeader . ", État de la ressource : " . $resourceStateHeader . ", Numéro de message : " . $messageNumberHeader);
            }
            if ($resourceStateHeader === 'deleted') {
                error_log("Notification reçue. ID de la notification : " . $channelIdHeader . ", État de la ressource : " . $resourceStateHeader . ", Numéro de message : " . $messageNumberHeader);
            }
            if ($resourceStateHeader === 'not_exists') {
                error_log("Notification reçue. ID de la notification : " . $channelIdHeader . ", État de la ressource : " . $resourceStateHeader . ", Numéro de message : " . $messageNumberHeader);
            }
        }
    }

    public function setupCalendarWatch()
    {
        try {
            $client = $this->getClient();
            $service = new Google\Service\Calendar($client);

            $channel = new Google\Service\Calendar\Channel();
            $channel->setId(uniqid('flepourtous_channel_', true));
            $channel->setType('web_hook');
            $channel->setAddress(BASE_URL . "api/handleGoogleNotification"); // L'URL de votre webhook
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
}
