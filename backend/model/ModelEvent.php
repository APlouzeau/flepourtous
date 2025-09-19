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
        $req = $this->conn->prepare('
        SELECT idEvent, userId, description, duration, createdAt, updatedAt, status, visioLink, startDateTime, title FROM event INNER JOIN lesson l ON event.id_lesson = l.idLesson
        WHERE userId = :idUser');
        $req->bindValue(':idUser', $idUser, PDO::PARAM_INT);
        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) == 0) {
            $events = [];
        } else {
            foreach ($datas as $data) {
                $events[] = [
                    'idEvent' => $data['idEvent'],
                    'userId' => $data['userId'],
                    'description' => $data['description'],
                    'duration' => $data['duration'],
                    'createdAt' => $data['createdAt'],
                    'updatedAt' => $data['updatedAt'],
                    'status' => $data['status'],
                    'visioLink' => $data['visioLink'],
                    'startDateTime' => $data['startDateTime'],
                    'title' => $data['title'],
                ];
            }
        }
        sort($events);
        return $events;
    }

    public function createEvent(EntitieEvent $event)
    {
        $idLesson = $event->getId_lesson();
        if ($idLesson !== null) {
            $req = $this->conn->prepare('INSERT INTO event (idEvent, userId, description, duration, startDateTime, visioLink, id_lesson) VALUES (:idEvent, :userId, :description, :duration, :startDateTime, :visioLink, :id_lesson)');
            $req->bindValue(':id_lesson', $idLesson, PDO::PARAM_INT);
        } else {
            $req = $this->conn->prepare('INSERT INTO event (idEvent, userId, description, duration, startDateTime, visioLink) VALUES (:idEvent, :userId, :description, :duration, :startDateTime, :visioLink)');
        }
        
        error_log("requete: " . $req->queryString);
        // Paramètres communs
        $req->bindValue(':idEvent', $event->getIdEvent(), PDO::PARAM_STR);
        $req->bindValue(':userId', $event->getUserId(), PDO::PARAM_INT);
        $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
        $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
        $req->bindValue(':startDateTime', $event->getStartDateTime(), PDO::PARAM_STR);
        $req->bindValue(':visioLink', $event->getVisioLink(), PDO::PARAM_STR);

        return $req->execute();
    }

    public function updateEvent(EntitieEvent $event)
    {
        $req = $this->conn->prepare('UPDATE event SET description = :description, duration = :duration, startDateTime = :startDateTime, visioLink = :visioLink, userId = :userId WHERE idEvent = :idEvent');
        $req->bindValue(':idEvent', $event->getIdEvent(), PDO::PARAM_STR);
        $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
        $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
        $req->bindValue(':visioLink', $event->getVisioLink(), PDO::PARAM_STR);
        $req->bindValue(':userId', $event->getUserId(), PDO::PARAM_INT);
        $req->bindValue(':startDateTime', $event->getStartDateTime(), PDO::PARAM_STR);
        return $req->execute();
    }

    public function deleteEvent(string $idEvent)
    {
        $req = $this->conn->prepare('DELETE FROM event WHERE idEvent = :idEvent');
        $req->bindValue(':idEvent', $idEvent, PDO::PARAM_STR);
        return $req->execute();
    }

    public function getAllEvents()
    {
        $req = $this->conn->prepare('
            SELECT idEvent, description, duration, status, visioLink, firstName, lastName, startDateTime FROM event
            INNER JOIN users ON event.userId = users.idUser
            ORDER BY startDateTime;');
        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) == 0) {
            return [];
        } else {
            foreach ($datas as $data) {
                $events[] = [
                    'idEvent' => $data['idEvent'],
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

    public function checkEvent(string $idEvent)
    {
        $req = $this->conn->prepare('SELECT * FROM event WHERE idEvent = :idEvent');
        $req->bindValue(':idEvent', $idEvent);
        $req->execute();
        return $req->fetch();
    }

    public function getEventById(string $idEvent)
    {
        $req = $this->conn->prepare('SELECT * FROM event WHERE idEvent = :idEvent');
        $req->bindValue(':idEvent', $idEvent, PDO::PARAM_STR);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idEvent' => $data['idEvent'],
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

    public function checkEventForNextHour(string $dateNow)
    {

        $req = $this->conn->prepare('
        SELECT u.firstName, u.lastName, u.mail, e.description, e.startDateTime, e.visioLink
        FROM event e INNER JOIN users u ON e.userId = u.idUser
        WHERE startDateTime >= DATE_ADD(:dateNow, INTERVAL 55 minute)
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

    public function setEventStatusPaid(string $idEvent)
    {
        $req = $this->conn->prepare('UPDATE event SET status = "Payé" WHERE idEvent = :idEvent');
        $req->bindValue(':idEvent', $idEvent, PDO::PARAM_STR);
        return $req->execute();
    }

    public function setEventStatusRefused(string $idEvent, int $idUser, int $lessonPrice): void
    {
        $req = $this->conn->prepare('
        UPDATE users SET wallet = wallet + :lessonPrice WHERE idUser = :idUser;
        UPDATE event SET status = "Refusé" WHERE idEvent = :idEvent
        ');
        $req->bindValue(':idEvent', $idEvent, PDO::PARAM_STR);
        $req->bindValue(':idUser', $idUser, PDO::PARAM_INT);
        $req->bindValue(':lessonPrice', $lessonPrice, PDO::PARAM_INT);
        $req->execute();
    }

    public function deleteWaitingEvent()
    {
        $condition = 'WHERE createdAt < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 8 HOUR) AND status = "En attente"';

        $this->conn->beginTransaction();

        $selectReq = $this->conn->prepare("SELECT userId, startDateTime FROM event {$condition}");
        $selectReq->execute();
        $datas = $selectReq->fetchAll();

        if (!empty($datas)) {
            $datasToAlert = [];
            foreach ($datas as $data) {
                $userId = $data['userId'];
                $startDateTime = $data['startDateTime'];
                $eventData = [
                    'userId' => $userId,
                    'startDateTime' => $startDateTime,
                ];
                $datasToAlert[] = $eventData;
            }
        }

        $this->conn->commit();

        return $datasToAlert;
    }
}
