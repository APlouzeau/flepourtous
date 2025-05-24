<?php

class EntitieGoogle
{
    private string $canalId;
    private string $resourceId;
    private string $resourceUri;
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

    public function getCanalId(): string
    {
        return $this->canalId;
    }
    public function setCanalId(string $canalId): self
    {
        $this->canalId = $canalId;
        return $this;
    }
    public function getResourceId(): string
    {
        return $this->resourceId;
    }
    public function setResourceId(string $resourceId): self
    {
        $this->resourceId = $resourceId;
        return $this;
    }
    public function getResourceUri(): string
    {
        return $this->ressourceUri;
    }
    public function setResourceUri(string $resourceUri): self
    {
        $this->resourceUri = $resourceUri;
        return $this;
    }
    public function getExpiration(): int
    {
        return $this->expiration;
    }
    public function setExpiration(int $expiration): self
    {
        $this->expiration = $expiration;
        return $this;
    }

    
}
