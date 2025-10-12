<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelLesson extends  ClassDatabase
{
    public function getAllLessons()
    {
        file_put_contents('/tmp/model_lesson.log', 'Début appel getAllLessonsWithPrices\n', FILE_APPEND);
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
        SELECT
        l.title,
        l.shortDescription,
        l.fullDescription_1,
        l.fullDescription_2,
        l.fullDescription_3,
        l.imagePath,
        l.introduction,
        l.subtitle_1,
        l.text_1,
        l.subtitle_2,
        l.text_2,
        l.subtitle_3,
        l.text_3,
        l.subtitle_4,
        l.text_4,
        l.subtitle_5,
        l.text_5,
        l.subtitle_6,
        l.text_6,
        p.price,
        d.duration
        FROM lesson l
        INNER JOIN lessonPrices lp ON lp.id_lesson = l.idLesson
        INNER JOIN prices p ON lp.id_price = p.idPrice
        INNER JOIN duration d ON lp.id_duration = d.idDuration
        WHERE l.slug = :slug');
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
        return [
            'title' => $datas[0]['title'],
            'shortDescription' => $datas[0]['shortDescription'],
            'fullDescription_1' => $datas[0]['fullDescription_1'],
            'fullDescription_2' => $datas[0]['fullDescription_2'],
            'fullDescription_3' => $datas[0]['fullDescription_3'],
            'imagePath' => $datas[0]['imagePath'],
            'introduction' => $datas[0]['introduction'],
            'subtitle_1' => $datas[0]['subtitle_1'],
            'text_1' => $datas[0]['text_1'],
            'subtitle_2' => $datas[0]['subtitle_2'],
            'text_2' => $datas[0]['text_2'],
            'subtitle_3' => $datas[0]['subtitle_3'],
            'text_3' => $datas[0]['text_3'],
            'subtitle_4' => $datas[0]['subtitle_4'],
            'text_4' => $datas[0]['text_4'],
            'subtitle_5' => $datas[0]['subtitle_5'],
            'text_5' => $datas[0]['text_5'],
            'subtitle_6' => $datas[0]['subtitle_6'],
            'text_6' => $datas[0]['text_6'],
            'times' => $times
        ];
    }

    public function getAllLessonsWithPrices()
    {
        $req = $this->conn->query('
        SELECT lesson.idLesson, lesson.title, lesson.shortDescription, lesson.imagePath, prices.price, duration.duration, lesson.slug
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
                    'shortDescription' => $data['shortDescription'],
                    'imagePath' => $data['imagePath'],
                    'slug' => $data['slug'],
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

    public function getLessonById($idLesson)
    {
        $req = $this->conn->prepare('SELECT * FROM lesson WHERE idLesson = :idLesson');
        $req->bindValue(':idLesson', $idLesson, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'idLesson' => $data['idLesson'],
                'title' => $data['title'],
                'shortDescription' => $data['shortDescription'],
                'fullDescription' => $data['fullDescription'],
                'imagePath' => $data['imagePath'],
                'slug' => $data['slug']
            ];
        }
        return null;
    }
}
