<?php

require_once APP_PATH . "/class/ClassDatabase.php";

class ModelLesson extends  ClassDatabase
{
    public function getAllLessons()
    {
        $req = $this->conn->query('SELECT * FROM lesson ');
        $datas = $req->fetchAll();
        $lessons = [];
        foreach ($datas as $data) {
            $lesson =
                [
                    'id' => $data['id'],
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
        $req = $this->conn->prepare('SELECT * FROM lesson WHERE slug = :slug');
        $req->execute(['slug' => $slug]);
        $data = $req->fetch();
        $lesson =
            [
                'id' => $data['id'],
                'title' => $data['title'],
                'fullDescription' => $data['fullDescription'],
                'imagePath' => $data['imagePath'],
            ];
        return $lesson;
    }
}
