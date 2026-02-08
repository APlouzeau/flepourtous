<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelDuration extends  ClassDatabase
{
    public function getAllDurations()
    {
        $req = $this->conn->query('SELECT * FROM durations');
        $datas = $req->fetchAll();
        $durations = [];
        foreach ($datas as $data) {
            $duration = [
                'idDuration' => $data['id_duration'],
                'duration' => $data['duration']
            ];
            $durations[] = $duration;
        }
        return $durations;
    }

    public function getDurationById(int $idDuration)
    {
        $req = $this->conn->prepare('SELECT * FROM durations WHERE id_duration = :idDuration');
        $req->bindValue(':idDuration', $idDuration, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idDuration' => $data['id_duration'],
                'duration' => $data['duration']
            ];
        }
        return null;
    }

    public function createDuration(EntitieDuration $duration)
    {
        $req = $this->conn->prepare('INSERT INTO durations (duration) VALUES (:duration)');
        $req->bindValue(':duration', $duration->getDuration(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function getDurationByDuration(int $duration)
    {
        $req = $this->conn->prepare('SELECT * FROM durations WHERE duration = :duration');
        $req->bindValue(':duration', $duration, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idDuration' => $data['id_duration'],
                'duration' => $data['duration']
            ];
        }
        return null;
    }

    public function updateDurationFromDuration(EntitieDuration $duration, $newDuration)
    {
        $req = $this->conn->prepare('UPDATE durations SET duration = :duration WHERE duration = :oldDuration');
        $req->bindValue(':duration', $newDuration, PDO::PARAM_INT);
        $req->bindValue(':oldDuration', $duration->getDuration(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function deleteDurationFromDuration(int $duration)
    {
        $req = $this->conn->prepare('DELETE FROM durations WHERE duration = :duration');
        $req->bindValue(':duration', $duration, PDO::PARAM_INT);
        return $req->execute();
    }
}
