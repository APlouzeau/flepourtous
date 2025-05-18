<<?php

    require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

    class ModelGoogleSync extends  ClassDatabase
    {
        public function saveNextSyncToken(string $idGoogleCalendar, string $nextSyncToken)
        {
            $req = $this->conn->query('SELECT idCalendar FROM googleSync');
            $datas = $req->fetch();
            if ($datas) {
                $req = $this->conn->prepare('UPDATE googleSync SET nextSyncToken = :nextSyncToken WHERE idCalendar = :idCalendar');
                $req->bindValue(':idCalendar', $idGoogleCalendar, PDO::PARAM_STR);
                $req->bindValue(':nextSyncToken', $nextSyncToken, PDO::PARAM_STR);
                $req->execute();
            } else {
                $req = $this->conn->prepare('INSERT INTO googleSync (idCalendar, nextSyncToken) VALUES (:idCalendar, :nextSyncToken)');
                $req->bindValue(':idCalendar', $idGoogleCalendar, PDO::PARAM_STR);
                $req->bindValue(':nextSyncToken', $nextSyncToken, PDO::PARAM_STR);
                $req->execute();
            }
        }

        public function getNextSyncToken($calendarId)
        {
            $req = $this->conn->prepare('SELECT nextSyncToken FROM googleSync WHERE idCalendar = :idCalendar');
            $req->bindValue(':idCalendar', $calendarId, PDO::PARAM_STR);
            $req->execute();
            $datas = $req->fetch();
            if ($datas) {
                return $datas['nextSyncToken'];
            } else {
                return null;
            }
        }

        public function deleteNextSyncToken(string $nextSyncToken)
        {
            $req = $this->conn->prepare('DELETE FROM googleSync WHERE nextSyncToken = :nextSyncToken');
            $req->bindValue(':nextSyncToken', $nextSyncToken, PDO::PARAM_STR);
            return $req->execute();
        }
    }
