<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelInvoice extends ClassDatabase
{
    public function getInvoices($filtersToSql)
    {
        $req = $this->conn->prepare('SELECT * FROM event ');
        $req->execute();
        $datas = $req->fetchAll();
        $result = [];
        foreach ($datas as $data) {
            $result[] = [
                'idEvent' => $data['idEvent'],
                'userId' => $data['userId'],
                'startDateTime' => $data['startDateTime'],
                'status' => $data['status'],
                'isInvoiced' => $data['is_invoiced'],
                'duration' => $data['duration']
            ];
        }
        return $result;
    }
}
