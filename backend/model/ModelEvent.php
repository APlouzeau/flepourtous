<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelEvent extends  ClassDatabase
{
    public function getEventsUser(int $idUser)
    {
        $req = $this->conn->prepare('SELECT * FROM event WHERE userId = :idUser');
        $req->bindValue(':idUser', $idUser, PDO::PARAM_INT);
        $req->execute();
        $datas = $req->fetchAll();
        count($datas) == 0 ? $events = [] : $events = $datas;
        return $events;
    }

    public function createEvent(EntitieEvent $event)
    {
        $req = $this->conn->prepare('INSERT INTO event (userId, description, duration, createdAt, startDateTime, updatedAt, status) VALUES (:userId, :description, :duration, :createdAt, :startDateTime, :updatedAt, :status)');
        $req->bindValue(':userId', $event->getUserId(), PDO::PARAM_INT);
        $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
        $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
        $req->bindValue(':createdAt', $event->getCreatedAt(), PDO::PARAM_STR);
        $req->bindValue(':startDateTime', $event->getStartDateTime(), PDO::PARAM_STR);
        $req->bindValue(':updatedAt', $event->getUpdatedAt(), PDO::PARAM_STR);
        $req->bindValue(':status', $event->getStatus(), PDO::PARAM_STR);
        $req->execute();
        return $req->execute();
    }
}
