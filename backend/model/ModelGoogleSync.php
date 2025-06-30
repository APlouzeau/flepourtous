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
            INSERT INTO googleSync (idCalendar, nextSyncToken)
            VALUES (:idCalendar, :nextSyncToken)
            ON DUPLICATE KEY UPDATE
                nextSyncToken = VALUES(nextSyncToken)
        ";

        $req = $this->conn->prepare($sql);
        $req->bindValue(':idCalendar', $idGoogleCalendar, PDO::PARAM_STR);
        $req->bindValue(':nextSyncToken', $nextSyncToken, PDO::PARAM_STR);
        $req->execute();
    }

    /**
     * Récupère le syncToken pour un calendrier donné.
     */
    public function getNextSyncToken($calendarId)
    {
        $req = $this->conn->prepare('SELECT nextSyncToken FROM googleSync WHERE idCalendar = :calendarId');
        $req->bindValue(':idCalendar', $calendarId, PDO::PARAM_STR);
        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        return $data ? $data['nextSyncToken'] : null;
    }

    /**
     * Supprime une ligne de la table de synchronisation en utilisant le syncToken.
     * (Utilisé en cas d'erreur pour forcer une resynchronisation).
     */
    public function deleteNextSyncToken($nextSyncToken)
    {
        $req = $this->conn->prepare('DELETE FROM googleSync WHERE nextSyncToken = :nextSyncToken');
        $req->bindValue(':nextSyncToken', $nextSyncToken, PDO::PARAM_STR);
        $req->execute();
    }

    /**
     * Supprime le syncToken pour un calendrier spécifique.
     * (Utilisé par le cron pour forcer une resynchronisation complète).
     */
    public function deleteSyncTokenForCalendar($calendarId)
    {
        $req = $this->conn->prepare('DELETE FROM googleSync WHERE idCalendar = :calendarId');
        $req->bindValue(':calendarId', $calendarId, PDO::PARAM_STR);
        $req->execute();
    }
}
