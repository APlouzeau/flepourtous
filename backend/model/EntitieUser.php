<?php

class EntitieUser
{
    private int $idUser;
    private string $firstName;
    private string $lastName;
    private string $role;
    private string $mail;
    private string $nickName;
    private string $password;
    private string $address;
    private string $country;
    private string $dateInscription;
    private int $isVerified;
    private string $verifyToken;

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

    public function getIdUser()
    {
        return $this->idUser;
    }

    public function setIdUser($idUser)
    {
        $this->idUser = $idUser;

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
    public function getAddress()
    {
        return $this->address;
    }
    public function setAddress($address)
    {
        $this->address = $address;

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
    public function getDateInscription()
    {
        return $this->dateInscription;
    }
    public function setDateInscription($dateInscription)
    {
        $this->dateInscription = $dateInscription;

        return $this;
    }

    /**
     * Get the value of isVerified
     */
    public function getIsVerified()
    {
        return $this->isVerified;
    }

    /**
     * Set the value of isVerified
     *
     * @return  self
     */
    public function setIsVerified($isVerified)
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    /**
     * Get the value of verifyToken
     */
    public function getVerifyToken()
    {
        return $this->verifyToken;
    }

    /**
     * Set the value of verifyToken
     *
     * @return  self
     */
    public function setVerifyToken($verifyToken)
    {
        $this->verifyToken = $verifyToken;

        return $this;
    }
}
