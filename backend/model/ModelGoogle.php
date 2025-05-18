<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelGoogle extends  ClassDatabase
{
    public function saveWatchResponse($googleWatchResponse)
    {
        $req = $this->conn->prepare('INSERT INTO google VALUES (:idResponse, :idResource, :expiration, :token)');
        $req->bindValue(':idResponse', $googleWatchResponse->getId(), PDO::PARAM_STR);
        $req->bindValue(':idResource', $googleWatchResponse->getResourceId(), PDO::PARAM_STR);
        $req->bindValue(':expiration', $googleWatchResponse->getExpiration(), PDO::PARAM_STR);
        $req->bindValue(':token', $googleWatchResponse->getToken(), PDO::PARAM_STR);
        $req->execute();
    }

    public function checkIfResponseExists($idResponse)
    {
        $req = $this->conn->prepare('SELECT * FROM google WHERE idResponse = :idResponse');
        $req->bindValue(':idResponse', $idResponse, PDO::PARAM_STR);
        $req->execute();
        return $req->fetch(PDO::FETCH_ASSOC);
    }
}
