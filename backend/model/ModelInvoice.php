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
            $result[] = new EntitieEvent($data);
        }
        return $result;
    }
}
