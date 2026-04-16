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
        $this->controllerError->debug("Début appel getLessonByName dans le modèle", ['slug' => $slug, 'locale' => $locale]);
        $lesson = $modelLesson->getLessonByName($slug, $locale);
        $this->controllerError->debug("Leçon récupérée dans le controller", ['lesson' => $lesson]);
        echo json_encode($lesson);
    }
    public function getAllLessonsWithPrices($locale)
    {
        $this->controllerError->debug("Début appel getAllLessonsWithPrices dans le controller", ['locale' => $locale]);
        $modelLesson = new ModelLesson();
        $lessons = $modelLesson->getAllLessonsWithPrices($locale);
        $this->controllerError->debug("Leçons récupérées dans le controller", ['lessons' => $lessons]);
        echo json_encode(array_values($lessons));
    }

    public function getSlugsByLocale($locale)
    {
        $modelLesson = new ModelLesson();
        $slugs = $modelLesson->getSlugsByLocale($locale);
        echo json_encode($slugs);
    }
}
