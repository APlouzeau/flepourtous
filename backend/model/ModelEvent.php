<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelEvent extends  ClassDatabase
{
    public function getEvents(int $idUser)
    {
        $req = $this->conn->prepare('SELECT * FROM event WHERE userId = :idUser');
        $req->bindValue(':idUser', $idUser, PDO::PARAM_INT);
        $req->execute();
        $datas = $req->fetchAll();
        count($datas) == 0 ? $events = [] : $events = $datas;
        return $events;
    }
}
