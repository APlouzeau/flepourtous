<?php


class ControllerLesson
{
    private $controllerError;

    public function __construct()
    {
        $this->controllerError = new ControllerError();
    }

    public function getAllLessons()
    {
        $modelLesson = new ModelLesson();
        $lessons = $modelLesson->getAllLessons();
        echo json_encode($lessons);
    }

    public function getLessonByName($slug, $locale)
    {
        $modelLesson = new ModelLesson();
        $slug = urldecode($slug);
        $lesson = $modelLesson->getLessonByName($slug, $locale);
        echo json_encode($lesson);
    }
    public function getAllLessonsWithPrices($locale)
    {
        $modelLesson = new ModelLesson();
        $lessons = $modelLesson->getAllLessonsWithPrices($locale);
        echo json_encode(array_values($lessons));
    }

    public function getSlugsByLocale($locale)
    {
        $modelLesson = new ModelLesson();
        $slugs = $modelLesson->getSlugsByLocale($locale);
        echo json_encode($slugs);
    }
}
