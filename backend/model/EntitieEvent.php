<?php

class EntitieEvent
{
    private int $idEvent;
    private string $name;
    private string $description;
    private int $duration;
    private string $isActive;
    private string $createdAt;
    private string $updatedAt;
    private int $userId;

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

    public function getIdEvent()
    {
        return $this->idEvent;
    }
    public function setIdEvent($idEvent)
    {
        $this->idEvent = $idEvent;

        return $this;
    }
    public function getName()
    {
        return $this->name;
    }
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }
    public function getDescription()
    {
        return $this->description;
    }
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }
    public function getDuration()
    {
        return $this->duration;
    }
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }
    public function getIsActive()
    {
        return $this->isActive;
    }
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }
    public function getCreatedAt()
    {
        return $this->createdAt;
    }
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
    public function getUserId()
    {
        return $this->userId;
    }
    public function setUserId($userId)
    {
        $this->userId = $userId;

        return $this;
    }
}
