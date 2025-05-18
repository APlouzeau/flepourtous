<?php

class EntitieGoogle
{
    private string $idResponse;
    private string $idResource;
    private int $expiration;

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
     * Get the value of idResponse
     */
    public function getIdResponse()
    {
        return $this->idResponse;
    }

    /**
     * Set the value of idResponse
     *
     * @return  self
     */
    public function setIdResponse($idResponse)
    {
        $this->idResponse = $idResponse;

        return $this;
    }

    /**
     * Get the value of idResource
     */
    public function getIdResource()
    {
        return $this->idResource;
    }

    /**
     * Set the value of idResource
     *
     * @return  self
     */
    public function setIdResource($idResource)
    {
        $this->idResource = $idResource;

        return $this;
    }

    /**
     * Get the value of expiration
     */
    public function getExpiration()
    {
        return $this->expiration;
    }

    /**
     * Set the value of expiration
     *
     * @return  self
     */
    public function setExpiration($expiration)
    {
        $this->expiration = $expiration;

        return $this;
    }
}
