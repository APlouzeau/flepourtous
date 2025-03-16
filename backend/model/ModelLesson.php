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
                    'fullDescription' => $data['fullDescription'],
                    'imagePath' => $data['imagePath']
                ];
            $lessons[] = $lesson;
        }
        return $lessons;
    }
}
