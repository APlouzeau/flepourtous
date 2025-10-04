<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelPrices extends  ClassDatabase
{
    public function getAllPrices()
    {
        $req = $this->conn->query('SELECT * FROM prices ');
        $datas = $req->fetchAll();
        $prices = [];
        foreach ($datas as $data) {
            $price = [
                'idPrice' => $data['idPrice'],
                'price' => $data['price'],
                'durationId' => $data['durationId']
            ];
            $prices[] = $price;
        }
        return $prices;
    }

    public function getPriceById(int $idPrice)
    {
        $req = $this->conn->prepare('SELECT * FROM prices WHERE idPrice = :idPrice');
        $req->bindValue(':idPrice', $idPrice, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idPrice' => $data['idPrice'],
                'price' => $data['price'],
                'durationId' => $data['durationId']
            ];
        }
        return null;
    }
    public function createPrice(EntitiePrice $price)
    {
        $req = $this->conn->prepare('INSERT INTO prices (price) VALUES (:price)');
        $req->bindValue(':price', $price->getPrice(), PDO::PARAM_STR);
        return $req->execute();
    }
    public function updatePrice(EntitiePrice $price)
    {
        $req = $this->conn->prepare('UPDATE prices SET price = :price WHERE idPrice = :idPrice');
        $req->bindValue(':price', $price->getPrice(), PDO::PARAM_STR);
        $req->bindValue(':idPrice', $price->getIdPrice(), PDO::PARAM_INT);
        return $req->execute();
    }
    public function deletePrice(int $idPrice)
    {
        $req = $this->conn->prepare('DELETE FROM prices WHERE idPrice = :idPrice');
        $req->bindValue(':idPrice', $idPrice, PDO::PARAM_INT);
        return $req->execute();
    }
    public function getPriceByDurationId(int $durationId)
    {
        $req = $this->conn->prepare('SELECT * FROM prices WHERE durationId = :durationId');
        $req->bindValue(':durationId', $durationId, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idPrice' => $data['idPrice'],
                'price' => $data['price'],
                'durationId' => $data['durationId']
            ];
        }
        return null;
    }

    public function getPriceForAppointment(int $durationValue, int $idLesson)
    {
        $req = $this->conn->prepare('
            SELECT price
            FROM prices p
            INNER JOIN lessonPrices lp ON p.idPrice = lp.id_price
            INNER JOIN lesson l ON lp.id_lesson = l.idLesson
            INNER JOIN duration d ON lp.id_duration = d.idDuration
            WHERE l.idLesson = :idLesson and d.duration = :durationValue
        ');
        $req->bindValue(':durationValue', $durationValue, PDO::PARAM_INT);
        $req->bindValue(':idLesson', $idLesson, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return $data['price'];
        }
        return null;
    }

    public function getPriceByEventId(string $idEvent)
    {
        Error_log("Fetching price for event ID: " . $idEvent);
        $req = $this->conn->prepare('
            SELECT l.title, p.price
            FROM event e
            INNER JOIN lesson l ON l.idLesson = e.id_lesson
            INNER JOIN lessonPrices lp ON lp.id_lesson = l.idLesson
            INNER JOIN prices p ON p.idPrice = lp.id_price
            INNER JOIN duration d ON d.idDuration = lp.id_duration
            WHERE e.idEvent = :idEvent AND e.duration = d.duration
        ');
        $req->bindValue(':idEvent', $idEvent, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        Error_log("Fetched price data: " . print_r($data, true));
        if ($data) {
            return [
                'price' => $data['price'],
                'title' => $data['title']
            ];
        }
        return null;
    }
}
