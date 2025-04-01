<?php

class EntitieUser
{
    private int $id_user;
    private string $firstName;
    private string $lastName;
    private string $role;
    private string $mail;
    private string $nickName;
    private string $password;
    private string $adress;
    private string $country;
    private string $date_inscription;

    // Constructeur pour hydrater les données à partir d'un tableau
    public function __construct(array $data)
    {
        $this->hydrate($data);
    }

    // Méthode pour hydrater l'objet avec les données
    public function hydrate(array $data)
    {
        foreach ($data as $key => $value) {
            $method = "set" . ucfirst($key);
            if (method_exists($this, $method)) {
                $this->$method($value);
            }
        }
    }

    public function getId_user()
    {
        return $this->id_user;
    }

    public function setId_user($id_user)
    {
        $this->id_user = $id_user;

        return $this;
    }

    public function getFirstName()
    {
        return $this->firstName;
    }

    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName()
    {
        return $this->lastName;
    }
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;

        return $this;
    }
    public function getRole()
    {
        return $this->role;
    }
    public function setRole($role)
    {
        $this->role = $role;

        return $this;
    }
    public function getMail()
    {
        return $this->mail;
    }
    public function setMail($mail)
    {
        $this->mail = $mail;

        return $this;
    }
    public function getNickName()
    {
        return $this->nickName;
    }
    public function setNickName($nickName)
    {
        $this->nickName = $nickName;

        return $this;
    }
    public function getPassword()
    {
        return $this->password;
    }
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }
    public function getAdress()
    {
        return $this->adress;
    }
    public function setAdress($adress)
    {
        $this->adress = $adress;

        return $this;
    }
    public function getCountry()
    {
        return $this->country;
    }
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }
    public function getDate_inscription()
    {
        return $this->date_inscription;
    }
    public function setDate_inscription($date_inscription)
    {
        $this->date_inscription = $date_inscription;

        return $this;
    }
}
