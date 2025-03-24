<?php


class ControllerLesson
{
    public function getAllLessons()
    {
        $modelLesson = new ModelLesson();
        $lessons = $modelLesson->getAllLessons();
        echo json_encode($lessons);
    }

    public function getLessonByName($slug)
    {
        $modelLesson = new ModelLesson();
        $lesson = $modelLesson->getLessonByName($slug);
        echo json_encode($lesson);
    }
}
