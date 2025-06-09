<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelDuration extends  ClassDatabase
{
    public function getAllDurations()
    {
        $req = $this->conn->query('SELECT * FROM duration ');
        $datas = $req->fetchAll();
        $durations = [];
        foreach ($datas as $data) {
            $duration = [
                'idDuration' => $data['idDuration'],
                'duration' => $data['duration']
            ];
            $durations[] = $duration;
        }
        return $durations;
    }


    public function getDurationById(int $idDuration)
    {
        $req = $this->conn->prepare('SELECT * FROM duration WHERE idDuration = :idDuration');
        $req->bindValue(':idDuration', $idDuration, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idDuration' => $data['idDuration'],
                'duration' => $data['duration']
            ];
        }
        return null;
    }


    public function createDuration(EntitieDuration $duration)
    {
        $req = $this->conn->prepare('INSERT INTO duration (duration) VALUES (:duration)');
        $req->bindValue(':duration', $duration->getDuration(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function updateDuration(EntitieDuration $duration)
    {
        $req = $this->conn->prepare('UPDATE duration SET duration = :duration WHERE idDuration = :idDuration');
        $req->bindValue(':duration', $duration->getDuration(), PDO::PARAM_INT);
        $req->bindValue(':idDuration', $duration->getIdDuration(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function deleteDuration(int $idDuration)
    {
        $req = $this->conn->prepare('DELETE FROM duration WHERE idDuration = :idDuration');
        $req->bindValue(':idDuration', $idDuration, PDO::PARAM_INT);
        return $req->execute();
    }
}
