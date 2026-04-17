<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelInvoice extends ClassDatabase
{
    public function getInvoices($filtersToSql)
    {
        $req = $this->conn->prepare('SELECT * FROM events WHERE ' . $filtersToSql['where']);

        $req->execute($filtersToSql['params']);
        $datas = $req->fetchAll();
        $result = [];
        foreach ($datas as $data) {
            $result[] = [
                'idEvent' => $data['id_event'],
                'userId' => $data['user_id'],
                'startDateTime' => $data['start_date_time'],
                'status' => $data['status'],
                'isInvoiced' => $data['is_invoiced'],
                'duration' => $data['duration']
            ];
        }
        return $result;
    }

    public function setInvoiced(string $idEvent)
    {
        $sql = "UPDATE events SET is_invoiced = 1 WHERE id_event = :id_event";
        $req = $this->conn->prepare($sql);
        $req->bindValue(':id_event', $idEvent, PDO::PARAM_STR);
        if ($req->execute()) {
            return true;
        }
        return false;
    }
}
