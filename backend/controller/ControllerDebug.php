<?php

class ControllerDebug extends ClassDatabase
{
    public function debugBdd()
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

        var_dump($datasToAlert);
    }
}
