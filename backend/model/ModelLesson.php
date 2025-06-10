<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelLesson extends  ClassDatabase
{
    public function getAllLessons()
    {
        $req = $this->conn->query('SELECT * FROM lesson');
        $datas = $req->fetchAll();
        $lessons = [];
        foreach ($datas as $data) {
            $lesson =
                [
                    'idLesson' => $data['idLesson'],
                    'title' => $data['title'],
                    'shortDescription' => $data['shortDescription'],
                    'imagePath' => $data['imagePath'],
                    'slug' => $data['slug']
                ];
            $lessons[] = $lesson;
        }
        return $lessons;
    }

    public function getLessonByName($slug)
    {
        $req = $this->conn->prepare('
        SELECT title, shortDescription, fullDescription, imagePath, price, duration
        FROM lesson
        INNER JOIN lessonPrices ON lessonPrices.id_lesson = lesson.idLesson
        INNER JOIN prices ON lessonPrices.id_price = prices.idPrice
        INNER JOIN duration ON lessonPrices.id_duration = duration.idDuration 
         WHERE slug = :slug');
        $req->bindValue(':slug', $slug, PDO::PARAM_STR);
        $req->execute();
        $datas = $req->fetchAll();
        $times = [];
        foreach ($datas as $data) {
            $price =
                [
                    'price' => $data['price'],
                    'duration' => $data['duration']
                ];
            $times[] = $price;
        }
        $lesson =
            [
                'title' => $datas[0]['title'],
                'shortDescription' => $datas[0]['shortDescription'],
                'fullDescription' => $datas[0]['fullDescription'],
                'imagePath' => $datas[0]['imagePath'],
                'times' => $times
            ];
        return $lesson;
    }

    public function getAllLessonsWithPrices()
    {
        $req = $this->conn->query('
        SELECT lesson.idLesson, lesson.title, prices.price, duration.duration
        FROM lesson
        INNER JOIN lessonPrices ON lessonPrices.id_lesson = lesson.idLesson
        INNER JOIN prices ON lessonPrices.id_price = prices.idPrice
        INNER JOIN duration ON lessonPrices.id_duration = duration.idDuration');

        $datas = $req->fetchAll();
        $lessons = [];
        foreach ($datas as $data) {
            if (isset($lessons[$data['idLesson']])) {
                $lessons[$data['idLesson']]['price'][] = [
                    'price' => $data['price'],
                    'duration' => $data['duration']
                ];
            } else {
                $lessons[$data['idLesson']] = [
                    'idLesson' => $data['idLesson'],
                    'title' => $data['title'],
                    'price' => [
                        [
                            'price' => $data['price'],
                            'duration' => $data['duration']
                        ]
                    ],
                ];
            }
        }
        return $lessons;
    }
}
