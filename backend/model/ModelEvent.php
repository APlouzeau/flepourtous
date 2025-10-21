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
        SELECT idEvent, userId, description, duration, createdAt, updatedAt, status, visioLink, startDateTime, timezone, title FROM event LEFT JOIN lesson l ON event.id_lesson = l.idLesson
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
                    'timezone' => $data['timezone'],
                    'title' => $data['title'],
                ];
            }
        }
        sort($events);
        return $events;
    }

    public function createEvent(EntitieEvent $event)
    {
        error_log("Création de l'événement avec les données suivantes : " . print_r($event, true));
        
        error_log("DEBUG 1: Début construction requête");
        
        // Construire la requête dynamiquement
        $baseReq = 'idEvent, userId, description, duration, startDateTime, visioLink, timezone';
        $baseValue = ':idEvent, :userId, :description, :duration, :startDateTime, :visioLink, :timezone';
        
        error_log("DEBUG 2: Récupération id_lesson");
        // Ajouter id_lesson si présent et non vide
        $idLesson = $event->getId_lesson();
        error_log("DEBUG 3: id_lesson = " . var_export($idLesson, true));
        
        if ($idLesson !== null && $idLesson !== '' && $idLesson !== 0) {
            $baseReq .= ', id_lesson';
            $baseValue .= ', :id_lesson';
            error_log("DEBUG 4: id_lesson ajouté à la requête");
        } else {
            error_log("DEBUG 4: id_lesson ignoré (null ou vide)");
        }
        
        error_log("DEBUG 5: Récupération status");
        // Ajouter status si présent et non vide
        $status = $event->getStatus();
        error_log("DEBUG 6: status = " . var_export($status, true));
        
        if ($status !== null && $status !== '') {
            $baseReq .= ', status';
            $baseValue .= ', :status';
            error_log("DEBUG 7: status ajouté");
        } else {
            error_log("DEBUG 7: status ignoré");
        }
        
        error_log("DEBUG 8: Préparation de la requête SQL");
        $req = $this->conn->prepare('INSERT INTO event (' . $baseReq . ') VALUES (' . $baseValue . ')');
        error_log("Requête SQL: " . $req->queryString);
        
        // Bind des valeurs communes
        $req->bindValue(':idEvent', $event->getIdEvent(), PDO::PARAM_STR);
        $req->bindValue(':userId', $event->getUserId(), PDO::PARAM_INT);
        $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
        $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
        $req->bindValue(':startDateTime', $event->getStartDateTime(), PDO::PARAM_STR);
        $req->bindValue(':timezone', $event->getTimezone(), PDO::PARAM_STR);
        $req->bindValue(':visioLink', $event->getVisioLink(), PDO::PARAM_STR);
        
        // Bind conditionnel de id_lesson
        if ($idLesson !== null && $idLesson !== '' && $idLesson !== 0) {
            $req->bindValue(':id_lesson', $idLesson, PDO::PARAM_INT);
        }
        
        // Bind conditionnel de status
        if ($status !== null && $status !== '') {
            $req->bindValue(':status', $status, PDO::PARAM_STR);
        }

        $result = $req->execute();
        error_log("Résultat de l'insertion: " . ($result ? "SUCCESS" : "FAILED"));
        
        if (!$result) {
            $errorInfo = $req->errorInfo();
            error_log("ERREUR SQL createEvent: " . $errorInfo[0] . " - " . $errorInfo[1] . " - " . $errorInfo[2]);
        }
        
        return $result;
    }

    public function updateEvent(EntitieEvent $event)
    {        
        $userId = $event->getUserId();
        
        if ($userId !== null) {
            $req = $this->conn->prepare('UPDATE event SET description = :description, duration = :duration, startDateTime = :startDateTime, timezone = :timezone, visioLink = :visioLink, userId = :userId WHERE idEvent = :idEvent');
            $req->bindValue(':userId', $userId, PDO::PARAM_INT);
        } else {
            $req = $this->conn->prepare('UPDATE event SET description = :description, duration = :duration, startDateTime = :startDateTime, timezone = :timezone, visioLink = :visioLink WHERE idEvent = :idEvent');
        }
        
        $req->bindValue(':idEvent', $event->getIdEvent(), PDO::PARAM_STR);
        $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
        $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
        $req->bindValue(':visioLink', $event->getVisioLink(), PDO::PARAM_STR);
        $req->bindValue(':startDateTime', $event->getStartDateTime(), PDO::PARAM_STR);
        $req->bindValue(':timezone', $event->getTimezone(), PDO::PARAM_STR);
        return $req->execute();
    }

    public function deleteEvent(string $idEvent)
    {
        $req = $this->conn->prepare('DELETE FROM event WHERE idEvent = :idEvent');
        $req->bindValue(':idEvent', $idEvent, PDO::PARAM_STR);
        return $req->execute();
    }

        public function cancelEvent(string $idEvent)
    {
        $req = $this->conn->prepare('UPDATE event SET status = "Annulé - Remboursé" WHERE idEvent = :idEvent');
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
            $event = [
                'idEvent' => $data['idEvent'],
                'userId' => $data['userId'],
                'description' => $data['description'],
                'duration' => $data['duration'],
                'startDateTime' => $data['startDateTime'],
                'timezone' => $data['timezone'],
                'visioLink' => $data['visioLink'],
                'status' => $data['status'],

            ];
            if ($data['id_lesson'] !== null) {
                $event['id_lesson'] = $data['id_lesson'];
            }
            return $event;
        } else {
            return null;
        }
    }

    public function checkEventForNextHour(string $dateNow)
    {

        $req = $this->conn->prepare('
        SELECT u.firstName, u.lastName, u.mail, e.description, e.startDateTime, e.visioLink, e.timezone
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
                    'timezone' => $data['timezone'],
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

    public function updateEventStatus(string $idEvent, string $status): bool
    {
        $req = $this->conn->prepare('UPDATE event SET status = :status WHERE idEvent = :idEvent');
        $req->bindValue(':idEvent', $idEvent, PDO::PARAM_STR);
        $req->bindValue(':status', $status, PDO::PARAM_STR);
        return $req->execute();
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
