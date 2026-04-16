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
                'idPrice' => $data['id_price'],
                'price' => (float)$data['price'],
            ];
            $prices[] = $price;
        }
        return $prices;
    }

    public function getPriceById(int $idPrice)
    {
        $req = $this->conn->prepare('SELECT * FROM prices WHERE id_price = :id_price');
        $req->bindValue(':id_price', $idPrice, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idPrice' => $data['id_price'],
                'price' => (float)$data['price'],
            ];
        }
        return null;
    }

    public function getPriceByPrice(float $price)
    {
        $req = $this->conn->prepare('SELECT * FROM prices WHERE price = :price');
        $req->bindValue(':price', $price);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idPrice' => $data['id_price'],
                'price' => (float)$data['price'],
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
        $req = $this->conn->prepare('UPDATE prices SET price = :price WHERE id_price = :id_price');
        $req->bindValue(':price', $price->getPrice(), PDO::PARAM_STR);
        $req->bindValue(':id_price', $price->getIdPrice(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function deletePrice(float $price)
    {
        $req = $this->conn->prepare('DELETE FROM prices WHERE price = :price');
        $req->bindValue(':price', $price);
        return $req->execute();
    }

    public function getPriceByDurationId(int $durationId)
    {
        $req = $this->conn->prepare('SELECT * FROM prices WHERE duration_id = :duration_id');
        $req->bindValue(':duration_id', $durationId, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idPrice' => $data['id_price'],
                'price' => (float)$data['price'],
                'durationId' => $data['duration_id']
            ];
        }
        return null;
    }


    public function getPriceForAppointment(int $durationValue, int $idLesson)
    {
        $req = $this->conn->prepare('
            SELECT price
            FROM prices p
            INNER JOIN lessonPrices lp ON p.id_price = lp.id_price
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
        error_log("Fetching price for event ID: " . $idEvent);
        $req = $this->conn->prepare('
            SELECT e.id_event, l.title, p.price
            FROM events e
            INNER JOIN lesson l ON l.id_lesson = e.id_lesson
            INNER JOIN lessonPrices lp ON lp.id_lesson = l.id_lesson
            INNER JOIN prices p ON p.id_price = lp.id_price
            INNER JOIN duration d ON d.id_duration = lp.id_duration
            WHERE e.id_event = :id_event AND e.duration = d.duration
        ');
        $req->execute([':id_event' => $idEvent]);

        $data = $req->fetch();

        if ($data) {
            return [
                'price' => (float)$data['price'],
                'title' => $data['title']
            ];
        }
        return null;
    }

    public function getPriceByDurationAndLesson(int $duration, int $idLesson)
    {
        $req = $this->conn->prepare('
            SELECT p.price
            FROM prices p
            INNER JOIN lessonPrices lp ON p.id_price = lp.id_price
            INNER JOIN duration d ON lp.id_duration = d.id_duration
            WHERE d.duration = :duration AND lp.id_lesson = :id_lesson
        ');
        $req->bindValue(':duration', $duration, PDO::PARAM_INT);
        $req->bindValue(':id_lesson', $idLesson, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return (float)$data['price'];
        }
        return null;
    }
}
