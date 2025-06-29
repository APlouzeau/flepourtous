<?php

class EntitieDuration
{
    private int $idDuration;
    private int $duration;

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

    /**
     * Get the value of duration
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set the value of duration
     *
     * @return  self
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * Get the value of idDuration
     */
    public function getIdDuration()
    {
        return $this->idDuration;
    }

    /**
     * Set the value of idDuration
     *
     * @return  self
     */
    public function setIdDuration($idDuration)
    {
        $this->idDuration = $idDuration;

        return $this;
    }
}
