<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelGoogleSync extends ClassDatabase
{
    /**
     * Sauvegarde ou met à jour le syncToken pour un calendrier donné.
     * Utilise une requête UPSERT pour être plus robuste.
     * Assurez-vous que la colonne 'idCalendar' est une clé UNIQUE ou PRIMARY.
     */
    public function saveNextSyncToken(string $idGoogleCalendar, string $nextSyncToken)
    {
        $sql = "
            INSERT INTO google_sync (id_calendar, next_sync_token)
            VALUES (:id_calendar, :next_sync_token)
            ON DUPLICATE KEY UPDATE
                next_sync_token = VALUES(next_sync_token)
        ";

        $req = $this->conn->prepare($sql);
        $req->bindValue(':id_calendar', $idGoogleCalendar, PDO::PARAM_STR);
        $req->bindValue(':next_sync_token', $nextSyncToken, PDO::PARAM_STR);
        $req->execute();
    }

    /**
     * Récupère le syncToken pour un calendrier donné.
     */
    public function getNextSyncToken($calendarId)
    {
        $req = $this->conn->prepare('SELECT next_sync_token FROM google_sync WHERE id_calendar = :id_calendar');
        $req->bindValue(':id_calendar', $calendarId, PDO::PARAM_STR);
        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        return $data ? $data['next_sync_token'] : null;
    }

    /**
     * Supprime une ligne de la table de synchronisation en utilisant le syncToken.
     * (Utilisé en cas d'erreur pour forcer une resynchronisation).
     */
    public function deleteNextSyncToken($nextSyncToken)
    {
        $req = $this->conn->prepare('DELETE FROM google_sync WHERE next_sync_token = :next_sync_token');
        $req->bindValue(':next_sync_token', $nextSyncToken, PDO::PARAM_STR);
        $req->execute();
    }
}
