<?php

class EntitieLessonTranslation
{
    private int $idLessonTranslation;
    private int $idLesson;
    private string $locale;
    private string $title;
    private string $shortDescription;
    private string $slug;
    private string $introduction;
    private string $fullDescription1;
    private string $fullDescription2;
    private string $fullDescription3;
    private string $subtitle1;
    private string $subtitle2;
    private string $subtitle3;
    private string $subtitle4;
    private string $subtitle5;
    private string $subtitle6;
    private string $text1;
    private string $text2;
    private string $text3;
    private string $text4;
    private string $text5;
    private string $text6;

    public function __construct(array $data)
    {
        $this->hydrate($data);
    }

    public function hydrate(array $data)
    {
        foreach ($data as $key => $value) {
            $method = "set" . ucfirst($key);
            if (method_exists($this, $method)) {
                $this->$method($value);
            }
        }
    }

    public function getIdLessonTranslation(): int
    {
        return $this->idLessonTranslation;
    }

    public function setIdLessonTranslation(int $idLessonTranslation): void
    {
        $this->idLessonTranslation = $idLessonTranslation;
    }

    public function getIdLesson(): int
    {
        return $this->idLesson;
    }
    public function setIdLesson(int $idLesson): void
    {
        $this->idLesson = $idLesson;
    }
    public function getLocale(): string
    {
        return $this->locale;
    }

    public function setLocale(string $locale): void
    {
        $this->locale = $locale;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getShortDescription(): string
    {
        return $this->shortDescription;
    }

    public function setShortDescription(string $shortDescription): void
    {
        $this->shortDescription = $shortDescription;
    }

    public function getSlug(): int
    {
        return $this->slug;
    }

    public function setSlug(int $slug): void
    {
        $this->slug = $slug;
    }

    public function getIntroduction(): string
    {
        return $this->introduction;
    }

    public function setIntroduction(string $introduction): void
    {
        $this->introduction = $introduction;
    }

    public function getFullDescription1(): string
    {
        return $this->fullDescription1;
    }

    public function setFullDescription1(string $fullDescription1): void
    {
        $this->fullDescription1 = $fullDescription1;
    }

    public function getFullDescription2(): string
    {
        return $this->fullDescription2;
    }

    public function setFullDescription2(string $fullDescription2): void
    {
        $this->fullDescription2 = $fullDescription2;
    }

    public function getFullDescription3(): string
    {
        return $this->fullDescription3;
    }

    public function setFullDescription3(string $fullDescription3): void
    {
        $this->fullDescription3 = $fullDescription3;
    }

    public function getSubtitle1(): string
    {
        return $this->subtitle1;
    }

    public function setSubtitle1(string $subtitle1): void
    {
        $this->subtitle1 = $subtitle1;
    }

    public function getSubtitle2(): string
    {
        return $this->subtitle2;
    }

    public function setSubtitle2(string $subtitle2): void
    {
        $this->subtitle2 = $subtitle2;
    }

    public function getSubtitle3(): string
    {
        return $this->subtitle3;
    }

    public function setSubtitle3(string $subtitle3): void
    {
        $this->subtitle3 = $subtitle3;
    }

    public function getSubtitle4(): string
    {
        return $this->subtitle4;
    }

    public function setSubtitle4(string $subtitle4): void
    {
        $this->subtitle4 = $subtitle4;
    }

    public function getSubtitle5(): string
    {
        return $this->subtitle5;
    }

    public function setSubtitle5(string $subtitle5): void
    {
        $this->subtitle5 = $subtitle5;
    }

    public function getSubtitle6(): string
    {
        return $this->subtitle6;
    }

    public function setSubtitle6(string $subtitle6): void
    {
        $this->subtitle6 = $subtitle6;
    }

    public function getText1(): string
    {
        return $this->text1;
    }

    public function setText1(string $text1): void
    {
        $this->text1 = $text1;
    }

    public function getText2(): string
    {
        return $this->text2;
    }

    public function setText2(string $text2): void
    {
        $this->text2 = $text2;
    }

    public function getText3(): string
    {
        return $this->text3;
    }

    public function setText3(string $text3): void
    {
        $this->text3 = $text3;
    }

    public function getText4(): string
    {
        return $this->text4;
    }

    public function setText4(string $text4): void
    {
        $this->text4 = $text4;
    }

    public function getText5(): string
    {
        return $this->text5;
    }

    public function setText5(string $text5): void
    {
        $this->text5 = $text5;
    }

    public function getText6(): string
    {
        return $this->text6;
    }

    public function setText6(string $text6): void
    {
        $this->text6 = $text6;
    }
}
