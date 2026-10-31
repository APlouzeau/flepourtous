<?php

use config\enum\AppointmentStatus;

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
        $req->execute();
        $datas = $req->fetchAll();
        if (count($datas) == 0) {
            return $events = [];
        } else {
            foreach ($datas as $data) {
                $events[] = [
                    'idEvent' => $data['id_event'],
                    'userId' => $data['user_id'],
                    'description' => $data['description'],
                    'duration' => $data['duration'],
                    'createdAt' => $data['created_at'],
                    'updatedAt' => $data['updated_at'],
                    // Le front élève (TableUser, lib/badge.ts) attend un code (« paid »), la base stocke
                    // le libellé français (« Payé ») : sans conversion, pastille « unknown » et aucun bouton
                    // (payer, annuler, rejoindre la visio). Le côté admin lit toujours le libellé.
                    'status' => AppointmentStatus::codeOf($data['status']),
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
            SELECT e.id_event, e.description, e.duration, e.status, e.visio_link, u.first_name, u.last_name, e.start_date_time, lt.title 
            FROM events e
            INNER JOIN users u ON e.user_id = u.id_user
            INNER JOIN lessons l ON e.id_lesson = l.id_lesson
            INNER JOIN lesson_translations lt ON l.id_lesson = lt.id_lesson
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
        $status = AppointmentStatus::PAID->value;
        $req = $this->conn->prepare('UPDATE events SET status = :status WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        $req->bindValue(':status', $status, PDO::PARAM_STR);
        return $req->execute();
    }

    /**
     * Annule un rendez-vous et recrédite éventuellement le porte-monnaie, en une transaction.
     *
     * Le statut ne change que si le rendez-vous est encore dans un des $fromStatuses :
     * si deux requêtes arrivent en même temps (double clic, notifications Google en double),
     * une seule modifie la ligne et donc une seule recrédite.
     *
     * @param string[] $fromStatuses statuts depuis lesquels l'annulation est permise
     * @return bool true si cette requête a annulé (et recrédité) ; false si le rendez-vous
     *              n'était plus annulable, ou en cas d'erreur (rien n'est modifié)
     */
    public function cancelAndRefund(string $idEvent, string $newStatus, array $fromStatuses, ?int $refundUserId, float $refundAmount): bool
    {
        if (empty($fromStatuses)) {
            return false;
        }

        try {
            $this->conn->beginTransaction();

            $placeholders = [];
            foreach (array_values($fromStatuses) as $i => $status) {
                $placeholders[] = ':from' . $i;
            }
            $req = $this->conn->prepare('UPDATE events SET status = :new_status
                WHERE id_event = :id_event AND status IN (' . implode(', ', $placeholders) . ')');
            $req->bindValue(':new_status', $newStatus, PDO::PARAM_STR);
            $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
            foreach (array_values($fromStatuses) as $i => $status) {
                $req->bindValue(':from' . $i, $status, PDO::PARAM_STR);
            }
            $req->execute();

            if ($req->rowCount() !== 1) {
                $this->conn->rollBack();
                return false;
            }

            if ($refundUserId !== null && $refundAmount > 0) {
                $wallet = $this->conn->prepare('UPDATE users SET wallet = wallet + :amount WHERE id_user = :id_user');
                $wallet->bindValue(':amount', $refundAmount);
                $wallet->bindValue(':id_user', $refundUserId, PDO::PARAM_INT);
                $wallet->execute();
                if ($wallet->rowCount() !== 1) {
                    throw new RuntimeException("Utilisateur $refundUserId introuvable pour le remboursement");
                }
            }

            $this->conn->commit();
            return true;
        } catch (Throwable $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            error_log("Annulation de l'événement $idEvent impossible : " . $e->getMessage());
            return false;
        }
    }

    public const PAY_OK = 'paid';
    public const PAY_NOT_PENDING = 'not_pending';
    public const PAY_INSUFFICIENT_WALLET = 'insufficient_wallet';
    public const PAY_ERROR = 'error';

    /**
     * Passe le rendez-vous en « Payé » et débite $walletAmount du porte-monnaie, en une transaction.
     *
     * - Le rendez-vous doit être « En attente » et appartenir à $idUser.
     * - Le porte-monnaie doit couvrir $walletAmount au moment du débit (jamais de solde forcé à 0) :
     *   sinon rien ne change. Un solde dépensé entre le début et la fin d'un paiement par carte
     *   ne peut donc plus servir à payer deux cours.
     *
     * @return string PAY_OK, PAY_NOT_PENDING, PAY_INSUFFICIENT_WALLET ou PAY_ERROR (rien n'a changé sauf PAY_OK)
     */
    public function payWithWallet(string $idEvent, int $idUser, float $walletAmount): string
    {
        $walletAmount = round($walletAmount, 2);
        try {
            $this->conn->beginTransaction();

            $event = $this->conn->prepare('UPDATE events SET status = :paid
                WHERE id_event = :id_event AND user_id = :id_user AND status = :pending');
            $event->bindValue(':paid', AppointmentStatus::PAID->value, PDO::PARAM_STR);
            $event->bindValue(':pending', AppointmentStatus::PENDING->value, PDO::PARAM_STR);
            $event->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
            $event->bindValue(':id_user', $idUser, PDO::PARAM_INT);
            $event->execute();
            if ($event->rowCount() !== 1) {
                $this->conn->rollBack();
                return self::PAY_NOT_PENDING;
            }

            if ($walletAmount > 0) {
                $wallet = $this->conn->prepare('UPDATE users SET wallet = wallet - :amount
                    WHERE id_user = :id_user AND wallet >= :amount_check');
                $wallet->bindValue(':amount', number_format($walletAmount, 2, '.', ''), PDO::PARAM_STR);
                $wallet->bindValue(':amount_check', number_format($walletAmount, 2, '.', ''), PDO::PARAM_STR);
                $wallet->bindValue(':id_user', $idUser, PDO::PARAM_INT);
                $wallet->execute();
                if ($wallet->rowCount() !== 1) {
                    $this->conn->rollBack();
                    return self::PAY_INSUFFICIENT_WALLET;
                }
            }

            $this->conn->commit();
            return self::PAY_OK;
        } catch (Throwable $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            error_log("Paiement de l'événement $idEvent impossible : " . $e->getMessage());
            return self::PAY_ERROR;
        }
    }

    /**
     * Passe le rendez-vous en « Payé » seulement s'il est encore « En attente », en une requête :
     * si le cron l'a annulé entre-temps, rien ne change et la méthode renvoie false.
     */
    public function markPaidIfPending(string $idEvent): bool
    {
        $req = $this->conn->prepare('UPDATE events SET status = :paid WHERE id_event = :id_event AND status = :pending');
        $req->bindValue(':paid', AppointmentStatus::PAID->value, PDO::PARAM_STR);
        $req->bindValue(':pending', AppointmentStatus::PENDING->value, PDO::PARAM_STR);
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        $req->execute();
        return $req->rowCount() === 1;
    }

    public function updateEventStatus(string $idEvent, string $status): bool
    {
        $req = $this->conn->prepare('UPDATE events SET status = :status WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        $req->bindValue(':status', $status, PDO::PARAM_STR);
        return $req->execute();
    }

    public function checkWaitingEvent()
    {
        $waitingStatus = AppointmentStatus::PENDING->value;
        $selectReq = $this->conn->prepare('SELECT user_id, start_date_time, id_event, created_at,timezone FROM events WHERE status = :waitingStatus');
        $selectReq->bindValue(':waitingStatus', $waitingStatus, PDO::PARAM_STR);
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
                    'idEvent' => $data['id_event'],
                    'createdAt' => $data['created_at'],
                    'timezone' => $data['timezone'],
                ];
                $datasToAlert[] = $eventData;
            }
        }

        return $datasToAlert ?? [];
    }

    public function deleteVisioLink(string $idEvent): bool
    {
        $req = $this->conn->prepare('UPDATE events SET visio_link = NULL WHERE id_event = :id_event');
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        return $req->execute();
    }
}
