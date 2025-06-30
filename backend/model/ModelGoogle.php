<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelGoogle extends ClassDatabase
{
    /**
     * Cherche un canal de notification par son ID.
     */
    public function findChannelByChannelId($channelId)
    {
        $req = $this->conn->prepare('SELECT * FROM google WHERE canalId = :canalId');
        $req->bindValue(':canalId', $channelId, PDO::PARAM_STR);
        $req->execute();
        return $req->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Cherche un canal de notification par l'ID du calendrier Google.
     */
    public function findChannelByCalendarId($calendarId)
    {
        $req = $this->conn->prepare('SELECT canalId, resourceId FROM google WHERE calendarId = :calendarId');
        $req->bindValue(':calendarId', $calendarId, PDO::PARAM_STR);
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
        // Cela nécessite que `calendarId` soit une clé UNIQUE dans votre table.
        $sql = "
            INSERT INTO google (calendarId, canalId, resourceId, resourceUri, expiration, token)
            VALUES (:calendarId, :canalId, :resourceId, :resourceUri, :expiration, :token)
            ON DUPLICATE KEY UPDATE
                canalId = VALUES(canalId),
                resourceId = VALUES(resourceId),
                resourceUri = VALUES(resourceUri),
                expiration = VALUES(expiration),
                token = VALUES(token)
        ";

        $req = $this->conn->prepare($sql);

        $req->bindValue(':calendarId', $calendarId, PDO::PARAM_STR);
        $req->bindValue(':canalId', $googleWatchResponse->getId(), PDO::PARAM_STR);
        $req->bindValue(':resourceId', $googleWatchResponse->getResourceId(), PDO::PARAM_STR);
        $req->bindValue(':resourceUri', $googleWatchResponse->getResourceUri(), PDO::PARAM_STR);
        $req->bindValue(':expiration', $googleWatchResponse->getExpiration(), PDO::PARAM_STR);
        $req->bindValue(':token', GOOGLE_TOKEN, PDO::PARAM_STR);

        $req->execute();
    }
}
