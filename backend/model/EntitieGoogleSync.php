<?php

class EntitieGoogleSync
{
    private string $idCalendar;
    private string $nextSyncToken;

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
     * Get the value of idCalendar
     */
    public function getIdCalendar()
    {
        return $this->idCalendar;
    }

    /**
     * Set the value of idCalendar
     *
     * @return  self
     */
    public function setIdCalendar($idCalendar)
    {
        $this->idCalendar = $idCalendar;

        return $this;
    }

    /**
     * Get the value of nextSyncToken
     */
    public function getNextSyncToken()
    {
        return $this->nextSyncToken;
    }

    /**
     * Set the value of nextSyncToken
     *
     * @return  self
     */
    public function setNextSyncToken($nextSyncToken)
    {
        $this->nextSyncToken = $nextSyncToken;

        return $this;
    }
}
