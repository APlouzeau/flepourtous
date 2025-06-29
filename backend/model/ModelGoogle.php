<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelGoogle extends  ClassDatabase
{
    public function saveWatchResponse($googleWatchResponse)
    {
        $req = $this->conn->prepare('INSERT INTO google (canalId, resourceId, resourceUri, expiration, token) VALUES (:canalId, :resourceId, :resourceUri, :expiration, :token)');
        $req->bindValue(':canalId', $googleWatchResponse->getId(), PDO::PARAM_STR);
        $req->bindValue(':resourceId', $googleWatchResponse->getResourceId(), PDO::PARAM_STR);
        $req->bindValue(':resourceUri', $googleWatchResponse->getResourceUri(), PDO::PARAM_STR);
        $req->bindValue(':expiration', $googleWatchResponse->getExpiration(), PDO::PARAM_STR);
        $req->bindValue(':token', GOOGLE_TOKEN, PDO::PARAM_STR);
        $req->execute();
    }


    public function findChannelByChannelId($channelId)
    {
        $req = $this->conn->prepare('SELECT * FROM google WHERE canalId = :canalId');
        $req->bindValue(':canalId', $channelId, PDO::PARAM_STR);
        $req->execute();
        return $req->fetch(PDO::FETCH_ASSOC);
    }

    public function findChannelByCalendarId($calendarId)
    {
        $req = $this->conn->prepare('SELECT canalId, resourceId FROM google WHERE calendarId = :calendarId');
        $req->bindValue(':calendarId', $calendarId, PDO::PARAM_STR);
        $req->execute();
        return $req->fetch(PDO::FETCH_ASSOC);
    }

    public function checkChannel($googleWatchResponse)
    {
        $req = $this->conn->prepare('SELECT * FROM google WHERE resourceId = :resourceId');
        $req->bindValue(':resourceId', $googleWatchResponse->getResourceId(), PDO::PARAM_STR);
        $req->execute();
        $existingChannel = $req->fetch(PDO::FETCH_ASSOC);
        if (!$existingChannel) {
            $this->saveWatchResponse($googleWatchResponse);
        } else {
            $this->updateChannel($googleWatchResponse, $existingChannel['calendarId']);
        }
    }

    public function updateChannel($googleWatchResponse, $calendarId)
    {
        $reqCheck = $this->conn->prepare('SELECT * FROM google WHERE calendarId = :calendarId');
        $reqCheck->bindValue(':calendarId', $calendarId, PDO::PARAM_STR);
        $reqCheck->execute();
        $existingChannel = $reqCheck->fetch(PDO::FETCH_ASSOC);

        if ($existingChannel) {
            $req = $this->conn->prepare('UPDATE google SET canalId = :canalId, resourceId = :resourceId, resourceUri = :resourceUri, expiration = :expiration, token = :token WHERE calendarId = :calendarId');
        } else {
            $req = $this->conn->prepare('INSERT INTO google (canalId, resourceId, resourceUri, expiration, token, calendarId) VALUES (:canalId, :resourceId, :resourceUri, :expiration, :token, :calendarId)');
        }

        $req->bindValue(':canalId', $googleWatchResponse->getId(), PDO::PARAM_STR);
        $req->bindValue(':resourceId', $googleWatchResponse->getResourceId(), PDO::PARAM_STR);
        $req->bindValue(':resourceUri', $googleWatchResponse->getResourceUri(), PDO::PARAM_STR);
        $req->bindValue(':expiration', $googleWatchResponse->getExpiration(), PDO::PARAM_STR);
        $req->bindValue(':token', GOOGLE_TOKEN, PDO::PARAM_STR);
        $req->bindValue(':calendarId', $calendarId, PDO::PARAM_STR);
        $req->execute();
    }
}
