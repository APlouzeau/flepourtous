<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelEvent extends  ClassDatabase
{

    public function getOccupiedTimeSlots($date)
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
                    $occupiedTimeSlot[] = $currentSlotTime->format('Y-m-d H:i:s');
                    $currentSlotTime->modify('+15 minutes');
                }
            }
            $occupiedTimeSlot = array_unique($occupiedTimeSlot);
            sort($occupiedTimeSlot);
            return array_values($occupiedTimeSlot);
        } else {
            return [];
        }
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
                $events[] = [
                    'eventId' => $data['eventId'],
                    'userId' => $data['userId'],
                    'description' => $data['description'],
                    'duration' => $data['duration'],
                    'createdAt' => $data['createdAt'],
                    'updatedAt' => $data['updatedAt'],
                    'status' => $data['status'],
                    'visioLink' => $data['visioLink'],
                    'startDateTime' => $data['startDateTime'],
                ];
            }
        }
        sort($events);
        return $events;
    }

    public function createEvent(EntitieEvent $event)
    {
        $req = $this->conn->prepare('INSERT INTO event (eventId, userId, description, duration, startDateTime, visioLink) VALUES (:eventId, :userId, :description, :duration, :startDateTime, :visioLink)');
        $req->bindValue(':eventId', $event->getEventId(), PDO::PARAM_STR);
        $req->bindValue(':userId', $event->getUserId(), PDO::PARAM_INT);
        $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
        $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
        $req->bindValue(':startDateTime', $event->getStartDateTime(), PDO::PARAM_STR);
        //$req->bindValue(':status', $event->getStatus(), PDO::PARAM_STR);
        $req->bindValue(':visioLink', $event->getVisioLink(), PDO::PARAM_STR);
        $createdEvent = $req->execute();
        return $createdEvent;
    }

    public function updateEvent(EntitieEvent $event)
    {
        $req = $this->conn->prepare('UPDATE event SET description = :description, duration = :duration, startDateTime = :startDateTime, visioLink = :visioLink WHERE eventId = :eventId');
        $req->bindValue(':eventId', $event->getEventId(), PDO::PARAM_STR);
        $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
        $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
        //$req->bindValue(':status', $event->getStatus(), PDO::PARAM_STR);
        $req->bindValue(':visioLink', $event->getVisioLink(), PDO::PARAM_STR);
        $req->bindValue(':startDateTime', $event->getStartDateTime(), PDO::PARAM_STR);
        return $req->execute();
    }

    public function deleteEvent(string $eventId)
    {
        $req = $this->conn->prepare('DELETE FROM event WHERE eventId = :eventId');
        $req->bindValue(':eventId', $eventId, PDO::PARAM_STR);
        return $req->execute();
    }

    public function getAllEvents()
    {
        $req = $this->conn->prepare('
            SELECT eventId, description, duration, status, visioLink, firstName, lastName, startDateTime FROM event
            INNER JOIN users ON event.userId = users.idUser
            ORDER BY startDateTime;');
        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) == 0) {
            return [];
        } else {
            foreach ($datas as $data) {
                $events[] = [
                    'eventId' => $data['eventId'],
                    'studentName' => $data['firstName'] . ' ' . $data['lastName'],
                    'description' => $data['description'],
                    'duration' => $data['duration'],
                    'status' => $data['status'],
                    'visioLink' => $data['visioLink'],
                    'startDateTime' => $data['startDateTime'],
                ];
            }
        }
        return $events;
    }

    public function checkEvent(string $eventId)
    {
        $req = $this->conn->prepare('SELECT * FROM event WHERE eventId = :eventId');
        $req->bindValue(':eventId', $eventId);
        $req->execute();
        $datas = $req->fetch();
        if ($datas) {
            return true;
        } else {
            return false;
        }
    }

    public function getEventById(string $eventId)
    {
        $req = $this->conn->prepare('SELECT * FROM event WHERE eventId = :eventId');
        $req->bindValue(':eventId', $eventId, PDO::PARAM_STR);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'eventId' => $data['eventId'],
                'userId' => $data['userId'],
                'description' => $data['description'],
                'duration' => $data['duration'],
                'startDateTime' => $data['startDateTime'],
                'visioLink' => $data['visioLink'],
            ];
        } else {
            return null;
        }
    }

    public function checkEventForNextHour(string $dateNow) {
        
        $req = $this->conn->prepare('
        SELECT 
            u.firstName, 
            u.lastName, 
            u.mail, 
            e.description, 
            e.startDateTime, 
            e.visioLink
        FROM event e 
        INNER JOIN users u ON e.userId = u.idUser
        WHERE 
            startDateTime >= DATE_ADD(:dateNow, INTERVAL 55 minute)
            AND startDateTime <= DATE_ADD(:dateNow, INTERVAL 65 minute);');

        $req->bindValue(':dateNow', $dateNow, PDO::PARAM_STR);
        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) > 0) {
            $events = [];
            foreach ($datas as $data) {
                $events[] = [
                    'firstName' => $data['firstName'],
                    'lastName' => $data['lastName'],
                    'mail' => $data['mail'],
                    'description' => $data['description'],
                    'startDateTime' => $data['startDateTime'],
                    'visioLink' => $data['visioLink'],
                ];
            }
            return $events; // Il y a des événements dans l'heure à venir
        } else {
            return false; // Pas d'événements dans l'heure à venir
        }
        
    }
}
