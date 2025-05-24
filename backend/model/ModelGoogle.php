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

    public function checkIfChannelExists($canalId)
    {
        $req = $this->conn->prepare('SELECT * FROM google WHERE canalId = :canalId');
        $req->bindValue(':canalId', $canalId, PDO::PARAM_STR);
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
        $this->updateChannel($googleWatchResponse) ;
        }
    }

    public function updateChannel($googleWatchResponse)
    {
        $req = $this->conn->prepare('UPDATE google SET canalId = :canalId, resourceUri = :resourceUri, expiration = :expiration, token = :token WHERE resourceId = :resourceId');
        $req->bindValue(':canalId', $googleWatchResponse->getId(), PDO::PARAM_STR);
        $req->bindValue(':resourceId', $googleWatchResponse->getResourceId(), PDO::PARAM_STR);
        $req->bindValue(':resourceUri', $googleWatchResponse->getResourceUri(), PDO::PARAM_STR);
        $req->bindValue(':expiration', $googleWatchResponse->getExpiration(), PDO::PARAM_STR);
        $req->bindValue(':token', GOOGLE_TOKEN, PDO::PARAM_STR);
        return $req->execute();
    }
}
