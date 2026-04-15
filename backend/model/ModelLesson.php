<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelLesson extends  ClassDatabase
{
    private $controllerError;

    public function __construct()
    {
        parent::__construct();
        $this->controllerError = new ControllerError();
    }
    public function getAllLessons()
    {
        file_put_contents('/tmp/model_lesson.log', 'Début appel getAllLessonsWithPrices\n', FILE_APPEND);
        $req = $this->conn->query('SELECT * FROM lesson');
        $datas = $req->fetchAll();
        $lessons = [];
        foreach ($datas as $data) {
            $lesson =
                [
                    'id_lesson' => $data['id_lesson'],
                    'title' => $data['title'],
                    'shortDescription' => $data['short_description'],
                    'imagePath' => $data['image_path'],
                    'slug' => $data['slug']
                ];
            $lessons[] = $lesson;
        }
        return $lessons;
    }

    public function getLessonByName($slug, $locale)
    {
        $this->controllerError->debug("Début appel getLessonByName dans le modèle", ['slug' => $slug, 'locale' => $locale]);
        $req = $this->conn->prepare('
        SELECT
        l.id_lesson,
        lt.title,
        lt.short_description,
        lt.full_description_1,
        lt.full_description_2,
        lt.full_description_3,
        l.image_path,
        lt.introduction,
        lt.subtitle_1,
        lt.text_1,
        lt.subtitle_2,
        lt.text_2,
        lt.subtitle_3,
        lt.text_3,
        lt.subtitle_4,
        lt.text_4,
        lt.subtitle_5,
        lt.text_5,
        lt.subtitle_6,
        lt.text_6,
        p.price,
        d.duration
        FROM lesson_translations lt
        INNER JOIN lessons l ON l.id_lesson = lt.id_lesson
        INNER JOIN lesson_price lp ON lp.id_lesson = l.id_lesson
        INNER JOIN prices p ON lp.id_price = p.id_price
        INNER JOIN durations d ON lp.id_duration = d.id_duration
        WHERE lt.locale = :locale
        AND lt.slug = :slug');
        $req->bindValue(':locale', $locale, PDO::PARAM_STR);
        $req->bindValue(':slug', $slug, PDO::PARAM_STR);
        $req->execute();
        $datas = $req->fetchAll();
        $times = [];
        $this->controllerError->debug("Résultat de la requête getLessonByName", ['datas' => $datas[0]]);
        foreach ($datas as $data) {
            $price =
                [
                    'price' => $data['price'],
                    'duration' => $data['duration']
                ];
            $times[] = $price;
        }
        $stmtSlugs = $this->conn->prepare('
        SELECT locale, slug 
        FROM lesson_translations 
        WHERE id_lesson = :id_lesson
    ');
        $stmtSlugs->execute(['id_lesson' => $datas[0]['id_lesson']]);
        $slugs = $stmtSlugs->fetchAll(PDO::FETCH_KEY_PAIR);

        return [
            'id_lesson' => $datas[0]['id_lesson'],
            'title' => $datas[0]['title'],
            'shortDescription' => $datas[0]['short_description'],
            'fullDescription_1' => $datas[0]['full_description_1'],
            'fullDescription_2' => $datas[0]['full_description_2'],
            'fullDescription_3' => $datas[0]['full_description_3'],
            'imagePath' => $datas[0]['image_path'],
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
            'times' => $times,
            'slugs' => $slugs
        ];
    }

    public function getAllLessonsWithPrices($locale)
    {
        $this->controllerError->debug("Début appel getAllLessonsWithPrices dans le modèle", ['locale' => $locale]);
        $req = $this->conn->prepare('
        SELECT l.id_lesson, l.image_path, lt.title, lt.short_description,lt.slug, p.price, d.duration
        FROM lessons l
        INNER JOIN lesson_translations lt ON lt.id_lesson = l.id_lesson
        INNER JOIN lesson_price lp ON lp.id_lesson = l.id_lesson
        INNER JOIN prices p ON lp.id_price = p.id_price
        INNER JOIN durations d ON lp.id_duration = d.id_duration
        WHERE lt.locale = :locale');
        $req->bindValue(':locale', $locale, PDO::PARAM_STR);
        $req->execute();

        $datas = $req->fetchAll();
        $lessons = [];
        foreach ($datas as $data) {
            if (isset($lessons[$data['id_lesson']])) {
                $lessons[$data['id_lesson']]['price'][] = [
                    'price' => $data['price'],
                    'duration' => $data['duration']
                ];
            } else {
                $lessons[$data['id_lesson']] = [
                    'id_lesson' => $data['id_lesson'],
                    'title' => $data['title'],
                    'shortDescription' => $data['short_description'],
                    'imagePath' => $data['image_path'],
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

    public function getLessonById($id_lesson)
    {
        $req = $this->conn->prepare('SELECT * FROM lesson WHERE id_lesson = :id_lesson');
        $req->bindValue(':id_lesson', $id_lesson, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            return [
                'id_lesson' => $data['id_lesson'],
                'title' => $data['title'],
                'shortDescription' => $data['short_description'],
                'imagePath' => $data['image_path'],
                'slug' => $data['slug']
            ];
        }
        return null;
    }
    public function getSlugsByLocale($locale)
    {
        $req = $this->conn->prepare('SELECT slug, title FROM lesson_translations WHERE locale = :locale');
        $req->bindValue(':locale', $locale, PDO::PARAM_STR);
        $req->execute();
        $datas = $req->fetchAll();
        $slugs = [];
        foreach ($datas as $data) {
            $slugs[] = [
                'slug' => $data['slug'],
                'title' => $data['title']
            ];
        }
        return $slugs;
    }
}
