<?php

class EntitieLesson
{
    private int $idLesson;
    private string $imagePath;

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

    public function getIdLesson(): int
    {
        return $this->idLesson;
    }

    public function setIdLesson(int $idLesson): void
    {
        $this->idLesson = $idLesson;
    }

    public function getImagePath(): string
    {
        return $this->imagePath;
    }

    public function setImagePath(string $imagePath): void
    {
        $this->imagePath = $imagePath;
    }
}
