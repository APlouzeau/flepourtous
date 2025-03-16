<?php


class ControllerLesson
{
    public function getAllLessons()
    {
        $modelLesson = new ModelLesson();
        $lessons = $modelLesson->getAllLessons();
        echo json_encode($lessons);
    }
}
