<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelEvent extends  ClassDatabase
{

    public function getAvailableTimeSlots($date)
    {
        $req = $this->conn->prepare('SELECT startDateTime, duration FROM event WHERE DATE(startDateTime) = :date');
        $req->bindValue(':date', $date, PDO::PARAM_STR);
        $req->execute();
        $datas = $req->fetchAll();
        $occupiedTimeSlot = [];
        if (count($datas) != 0) {
            foreach ($datas as $data) {
                $currentSlotTime = new DateTime($data['startDateTime']);
                $numberOfSlots = ceil($data['duration'] / 15);
                for ($i = 0; $i < $numberOfSlots; $i++) {
                    $occupiedTimeSlot[] = $currentSlotTime->format('H:i');
                    $currentSlotTime->modify('+15 minutes');
                }
            }
        }
        $occupiedTimeSlot = array_unique($occupiedTimeSlot);
        sort($occupiedTimeSlot);
        return array_values($occupiedTimeSlot);
    }
    public function getEventsUser(int $idUser)
    {
        $req = $this->conn->prepare('SELECT * FROM event WHERE userId = :idUser');
        $req->bindValue(':idUser', $idUser, PDO::PARAM_INT);
        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) == 0) {
            $events = [];
        } else {
            foreach ($datas as $data) {
                $dateObj = new DateTime($data['startDateTime']);
                $startDate = $dateObj->format('d/m/Y');
                $startTime = $dateObj->format('H:i');
                $events[] = [
                    'eventId' => $data['eventId'],
                    'userId' => $data['userId'],
                    'description' => $data['description'],
                    'duration' => $data['duration'],
                    'createdAt' => $data['createdAt'],
                    'startDate' => $startDate,
                    'startTime' => $startTime,
                    'updatedAt' => $data['updatedAt'],
                    'status' => $data['status'],
                    'visioLink' => $data['visioLink'],
                ];
            }
        }
        sort($events);
        return $events;
    }

    public function createEvent(EntitieEvent $event)
    {
        $req = $this->conn->prepare('INSERT INTO event (eventId, userId, description, duration, createdAt, startDateTime, updatedAt, status) VALUES (:eventId, :userId, :description, :duration, :createdAt, :startDateTime, :updatedAt, :status)');
        $req->bindValue(':eventId', $event->getEventId(), PDO::PARAM_STR);
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

    public function deleteEvent(string $eventId)
    {
        $req = $this->conn->prepare('DELETE FROM event WHERE eventId = :eventId');
        $req->bindValue(':eventId', $eventId, PDO::PARAM_STR);
        return $req->execute();
    }
}
