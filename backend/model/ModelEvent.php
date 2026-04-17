<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelEvent extends  ClassDatabase
{
    private $controllerError;

    public function __construct()
    {
        parent::__construct(); // Initialise la connexion PDO
        $this->controllerError = new ControllerError();
    }

    public function getOccupiedTimeSlots($date)
    {
        $req = $this->conn->prepare('SELECT start_date_time, duration FROM events WHERE DATE(start_date_time) = :date');
        $req->bindValue(':date', $date, PDO::PARAM_STR);
        $req->execute();
        $datas = $req->fetchAll();
        $occupiedTimeSlot = [];
        if (count($datas) != 0) {
            foreach ($datas as $data) {
                $currentSlotTime = new DateTime($data['start_date_time']);
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

    public function getEventsUser(int $idUser, string $locale = 'fr')
    {
        $req = $this->conn->prepare('
        SELECT 
            e.id_event, e.user_id, e.description, e.duration, e.created_at, e.updated_at, e.status, e.visio_link, e.start_date_time, e.timezone, lt.title 
        FROM 
            events e
        INNER JOIN lessons l ON e.id_lesson = l.id_lesson
        INNER JOIN lesson_translations lt ON l.id_lesson = lt.id_lesson
        WHERE 
            e.user_id = :idUser
        AND lt.locale = :locale');
        $req->bindValue(':idUser', $idUser, PDO::PARAM_INT);
        $req->bindValue(':locale', $locale, PDO::PARAM_STR);
        $this->controllerError->debug("Exécution de la requête pour récupérer les événements de l'utilisateur avec ID: $idUser et locale: $locale");
        $this->controllerError->debug("Requête SQL: " . $req->queryString);
        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) == 0) {
            $events = [];
        } else {
            foreach ($datas as $data) {
                $events[] = [
                    'idEvent' => $data['id_event'],
                    'userId' => $data['user_id'],
                    'description' => $data['description'],
                    'duration' => $data['duration'],
                    'createdAt' => $data['created_at'],
                    'updatedAt' => $data['updated_at'],
                    'status' => $data['status'],
                    'visioLink' => $data['visio_link'],
                    'startDateTime' => $data['start_date_time'],
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
        $this->controllerError->debug("Données de l'événement à enregistrer en base de données : " . json_encode([
            'id_event' => $event->getIdEvent(),
            'user_id' => $event->getUserId(),
            'description' => $event->getDescription(),
            'duration' => $event->getDuration(),
            'start_date_time' => $event->getStartDateTime(),
            'timezone' => $event->getTimezone(),
            'visio_link' => $event->getVisioLink(),
            'id_lesson' => $event->getId_lesson(),
            'status' => $event->getStatus(),
        ]));
        $baseReq = 'id_event, user_id, description, duration, start_date_time, visio_link, timezone';
        $baseValue = ':id_event, :user_id, :description, :duration, :start_date_time, :visio_link, :timezone';

        // Ajouter id_lesson si présent et non vide
        $idLesson = $event->getId_lesson();

        if ($idLesson !== null && $idLesson !== '' && $idLesson !== 0) {
            $baseReq .= ', id_lesson';
            $baseValue .= ', :id_lesson';
        }

        // Ajouter status si présent et non vide
        $status = $event->getStatus();

        if ($status !== null && $status !== '') {
            $baseReq .= ', status';
            $baseValue .= ', :status';
            $req = $this->conn->prepare('INSERT INTO events (' . $baseReq . ') VALUES (' . $baseValue . ')');

            $req->bindValue(':id_event', $event->getIdEvent(), PDO::PARAM_STR);
            $req->bindValue(':user_id', $event->getUserId(), PDO::PARAM_INT);
            $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
            $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
            $req->bindValue(':start_date_time', $event->getStartDateTime(), PDO::PARAM_STR);
            $req->bindValue(':timezone', $event->getTimezone(), PDO::PARAM_STR);
            $req->bindValue(':visio_link', $event->getVisioLink(), PDO::PARAM_STR);

            if ($idLesson !== null && $idLesson !== '' && $idLesson !== 0) {
                $req->bindValue(':id_lesson', $idLesson, PDO::PARAM_INT);
            }

            if ($status !== null && $status !== '') {
                $req->bindValue(':status', $status, PDO::PARAM_STR);
            }


            $result = $req->execute();

            if (!$result) {
                $errorInfo = $req->errorInfo();
                error_log("ERREUR SQL createEvent: " . $errorInfo[0] . " - " . $errorInfo[1] . " - " . $errorInfo[2]);
            }

            return $result;
        }
    }

    public function updateEvent(EntitieEvent $event)
    {
        try {
            $userId = $event->getUserId();

            if ($userId) {
                $req = $this->conn->prepare('UPDATE events SET description = :description, duration = :duration, start_date_time = :start_date_time, timezone = :timezone, visio_link = :visio_link, user_id = :user_id WHERE id_event = :id_event');
                $req->bindValue(':user_id', $userId, PDO::PARAM_INT);
            } else {
                $req = $this->conn->prepare('UPDATE events SET description = :description, duration = :duration, start_date_time = :start_date_time, timezone = :timezone, visio_link = :visio_link WHERE id_event = :id_event');
            }
        } catch (Throwable $e) {
            error_log("Erreur dans updateEvent: " . $e->getMessage());
            throw $e;
        }

        $req->bindValue(':id_event', $event->getIdEvent(), PDO::PARAM_STR);
        $req->bindValue(':description', $event->getDescription(), PDO::PARAM_STR);
        $req->bindValue(':duration', $event->getDuration(), PDO::PARAM_STR);
        $req->bindValue(':visio_link', $event->getVisioLink(), PDO::PARAM_STR);
        $req->bindValue(':start_date_time', $event->getStartDateTime(), PDO::PARAM_STR);
        $req->bindValue(':timezone', $event->getTimezone(), PDO::PARAM_STR);

        return $req->execute();
    }

    public function deleteEvent(string $idEvent)
    {
        $req = $this->conn->prepare('DELETE FROM events WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        return $req->execute();
    }

    public function cancelEvent(string $idEvent)
    {
        $req = $this->conn->prepare('UPDATE events SET status = "Annulé - Remboursé" WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        return $req->execute();
    }

    public function getAllEvents()
    {
        $req = $this->conn->prepare('
            SELECT e.id_event, e.description, e.duration, e.status, e.visio_link, u.first_name, u.last_name, e.start_date_time, lt.title FROM events e
            INNER JOIN users u ON e.user_id = u.id_user
            INNER JOIN lesson l ON e.id_lesson = l.id_lesson
            INNER JOIN lesson_translation lt ON l.id_lesson = lt.id_lesson
            WHERE lt.locale = "fr"
            ORDER BY e.start_date_time;');
        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) == 0) {
            return [];
        } else {
            foreach ($datas as $data) {
                $events[] = [
                    'idEvent' => $data['id_event'],
                    'studentName' => $data['first_name'] . ' ' . $data['last_name'],
                    'description' => $data['description'],
                    'duration' => $data['duration'],
                    'status' => $data['status'],
                    'visioLink' => $data['visio_link'],
                    'startDateTime' => $data['start_date_time'],
                    'title' => $data['title'],
                ];
            }
        }
        return $events;
    }

    public function checkEvent(string $idEvent)
    {
        try {
            $req = $this->conn->prepare('SELECT * FROM events WHERE id_event = :id_event');
            $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
            $success = $req->execute();

            if (!$success) {
                $errorInfo = $req->errorInfo();
                return null;
            }

            $data = $req->fetch();

            return $data ? $data : null;
        } catch (Exception $e) {
            error_log("EXCEPTION dans checkEvent: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            return null;
        }
    }

    public function getEventById(string $idEvent)
    {
        $req = $this->conn->prepare('SELECT * FROM events WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            $event = [
                'idEvent' => $data['id_event'],
                'userId' => $data['user_id'],
                'description' => $data['description'],
                'duration' => $data['duration'],
                'startDateTime' => $data['start_date_time'],
                'timezone' => $data['timezone'],
                'visioLink' => $data['visio_link'],
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

    public function getUserIdByEventId(string $idEvent)
    {
        $req = $this->conn->prepare('SELECT user_id FROM events WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        $req->execute();
        $data = $req->fetch();
        return $data ? $data['user_id'] : null;
    }

    public function checkEventForNextHour()
    {
        ("Checking events for the next hour...");
        $req = $this->conn->prepare("
        SELECT u.first_name, u.last_name, u.mail, e.description, e.start_date_time, e.visio_link, e.timezone
        FROM events e INNER JOIN users u ON e.user_id = u.id_user
        WHERE NOT e.status LIKE '%ANNULE%'
        AND e.start_date_time >= DATE_ADD(NOW(), INTERVAL 55 minute)
        AND e.start_date_time <= DATE_ADD(NOW(), INTERVAL 65 minute);");

        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) > 0) {
            $events = [];
            foreach ($datas as $data) {
                $events[] = [
                    'firstName' => $data['first_name'],
                    'lastName' => $data['last_name'],
                    'mail' => $data['mail'],
                    'description' => $data['description'],
                    'startDateTime' => $data['start_date_time'],
                    'visioLink' => $data['visio_link'],
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
        $req = $this->conn->prepare('UPDATE events SET status = "Payé" WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        return $req->execute();
    }

    public function updateEventStatus(string $idEvent, string $status): bool
    {
        $req = $this->conn->prepare('UPDATE events SET status = :status WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        $req->bindValue(':status', $status, PDO::PARAM_STR);
        return $req->execute();
    }

    public function deleteWaitingEvent()
    {
        $condition = 'WHERE created_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 8 HOUR) AND status = "En attente"';

        $this->conn->beginTransaction();

        $selectReq = $this->conn->prepare("SELECT user_id, start_date_time FROM events {$condition}");
        $selectReq->execute();
        $datas = $selectReq->fetchAll();

        if (!empty($datas)) {
            $datasToAlert = [];
            foreach ($datas as $data) {
                $userId = $data['user_id'];
                $startDateTime = $data['start_date_time'];
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

    public function deleteVisioLink(string $idEvent): bool
    {
        $req = $this->conn->prepare('UPDATE events SET visio_link = NULL WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        return $req->execute();
    }
}
