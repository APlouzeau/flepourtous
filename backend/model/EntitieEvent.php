<?php

class EntitieEvent
{
    private string $idEvent;
    private ?string $userId = null;  // 🔥 Rendre nullable pour permettre les mises à jour sans userId
    private string $description;
    private int $duration;
    private string $createdAt;
    private string $startDateTime;
    public string $timezone;
    private string $updatedAt;
    private ?string $status = null;
    private ?string $visioLink = null;
    private ?int $id_lesson = null;
    private int $isInvoiced = 0;

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

    /**
     * Get the value of startDateTime
     */
    public function getStartDateTime()
    {
        return $this->startDateTime;
    }

    /**
     * Set the value of startDateTime
     *
     * @return  self
     */
    public function setStartDateTime($startDateTime)
    {
        $this->startDateTime = $startDateTime;

        return $this;
    }

    /**
     * Get the value of timezone
     */
    public function getTimezone()
    {
        return $this->timezone;
    }

    /**
     * Set the value of timezone
     *
     * @return  self
     */
    public function setTimezone($timezone)
    {
        $this->timezone = $timezone;

        return $this;
    }

    /**
     * Get the value of status
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set the value of status
     *
     * @return  self
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get the value of roomLink
     */
    public function getVisioLink()
    {
        return $this->visioLink;
    }

    /**
     * Set the value of roomLink
     *
     * @return  self
     */
    public function setVisioLink($visioLink)
    {
        $this->visioLink = $visioLink;

        return $this;
    }

    /**
     * Get the value of id_lesson
     */
    public function getId_lesson()
    {
        return $this->id_lesson;
    }

    /**
     * Set the value of id_lesson
     *
     * @return  self
     */
    public function setId_lesson($id_lesson)
    {
        $this->id_lesson = $id_lesson;

        return $this;
    }
    public function getIsInvoiced()
    {
        return $this->isInvoiced;
    }
    public function setIsInvoiced($isInvoiced)
    {
        $this->isInvoiced = $isInvoiced;

        return $this;
    }
}
