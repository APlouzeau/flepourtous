<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelGoogle extends ClassDatabase
{
    /**
     * Cherche un canal de notification par son ID.
     */
    public function findChannelByChannelId($channelId)
    {
        $req = $this->conn->prepare('SELECT * FROM google WHERE canal_id = :canal_id');
        $req->bindValue(':canal_id', $channelId, PDO::PARAM_STR);
        $req->execute();
        return $req->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Cherche un canal de notification par l'ID du calendrier Google.
     */
    public function findChannelByCalendarId($calendarId)
    {
        $req = $this->conn->prepare('SELECT calendar_id, resource_id FROM google WHERE calendar_id = :calendar_id');
        $req->bindValue(':calendar_id', $calendarId, PDO::PARAM_STR);
        $req->execute();
        return $req->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Met à jour ou insère les informations du canal de notification.
     * C'est la seule méthode pour écrire les informations du canal.
     */
    public function upsertChannel($googleWatchResponse, $calendarId)
    {
        // On utilise ON DUPLICATE KEY UPDATE pour une opération atomique (UPSERT)
        // Cela nécessite que `calendar_id` soit une clé UNIQUE dans votre table.
        $sql = "
            INSERT INTO google (calendar_id, canal_id, resource_id, resource_uri, expiration, token)
            VALUES (:calendar_id, :canal_id, :resource_id, :resource_uri, :expiration, :token)
            ON DUPLICATE KEY UPDATE
                canal_id = VALUES(canal_id),
                resource_id = VALUES(resource_id),
                resource_uri = VALUES(resource_uri),
                expiration = VALUES(expiration),
                token = VALUES(token)
        ";

        $req = $this->conn->prepare($sql);

        $req->bindValue(':calendar_id', $calendarId, PDO::PARAM_STR);
        $req->bindValue(':canal_id', $googleWatchResponse->getId(), PDO::PARAM_STR);
        $req->bindValue(':resource_id', $googleWatchResponse->getResourceId(), PDO::PARAM_STR);
        $req->bindValue(':resource_uri', $googleWatchResponse->getResourceUri(), PDO::PARAM_STR);
        $req->bindValue(':expiration', $googleWatchResponse->getExpiration(), PDO::PARAM_STR);
        $req->bindValue(':token', GOOGLE_TOKEN, PDO::PARAM_STR);

        $req->execute();
    }
}
