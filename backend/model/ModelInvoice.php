<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelInvoice extends ClassDatabase
{
    public function getInvoices($filtersToSql)
    {
        $req = $this->conn->prepare('SELECT * FROM event WHERE ' . $filtersToSql['where']);

        $req->execute($filtersToSql['params']);
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

    public function setInvoiced(string $idEvent)
    {
        $sql = "UPDATE event SET is_invoiced = 1 WHERE idEvent = :idEvent";
        $req = $this->conn->prepare($sql);
        $req->bindValue(':idEvent', $idEvent, PDO::PARAM_STR);
        if ($req->execute()) {
            return true;
        }
        return false;
    }
}
