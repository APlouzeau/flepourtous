<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelUser
extends ClassDatabase
{

    public function register(EntitieUser $user)
    {
        $query = "INSERT INTO users (firstName, lastName, mail, nickName, password, verifyToken) VALUES (:firstName, :lastName, :mail, :nickName, :password, :verifyToken)";

        $req = $this->conn->prepare($query);
        $req->bindValue(":firstName", $user->getFirstName());
        $req->bindValue(":lastName", $user->getLastName());
        $req->bindValue(":mail", $user->getMail());
        $req->bindValue(":nickName", $user->getNickName());
        $req->bindValue(":password", $user->getPassword());
        $req->bindValue(":verifyToken", $user->getVerifyToken());

        return $req->execute();
    }

    public function getAllUsers()
    {
        $req = $this->conn->query('SELECT idUser, nickName, firstName, mail FROM users ORDER BY nickName');
        $datas = $req->fetchAll();
        $users = [];
        foreach ($datas as $data) {
            $user = new EntitieUser($data);
            $users[] = $user;
        }
        return $users;
    }

    public function login(string $mail, string $password)
    {
        $query = "SELECT * FROM users WHERE mail = :mail";
        $req = $this->conn->prepare($query);
        $req->bindValue(":mail", $mail);
        $req->execute();

        $data = $req->fetch(PDO::FETCH_ASSOC);
        if (!$data || !password_verify($password, $data['password'])) {
            return null;
        }
        if ($data['isVerified'] == 0) {
            return ['isVerified' => false];
        } else {
            $user =
                [
                    'idUser' => $data['idUser'],
                    'nickName' => $data['nickName'],
                    'firstName' => $data['firstName'],
                    'lastName' => $data['lastName'],
                    'mail' => $data['mail'],
                    'role' => $data['role'],
                ];
            return $user;
        }
    }


    public function getUser(EntitieUser $user)
    {
        $req = $this->conn->prepare('SELECT idUser, nickName, firstName, lastName, mail, address, address_2, address_3, zip, city, country FROM users WHERE idUser = :idUser');
        $req->bindValue(":idUser", $user->getIdUser(), PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            $user =
                [
                    'idUser' => $data['idUser'],
                    'nickName' => $data['nickName'],
                    'firstName' => $data['firstName'],
                    'lastName' => $data['lastName'],
                    'mail' => $data['mail'],
                    'address' => $data['address'] ?? null,
                    'address2' => $data['address_2'] ?? null,
                    'address3' => $data['address_3'] ?? null,
                    'zip' => $data['zip'] ?? null,
                    'city' => $data['city'] ?? null,
                    'country' => $data['country'] ?? null,
                ];
        } else {
            return null; // Utilisateur non trouvé
        }
        return $data ? $user : null;
    }

    public function deleteUser(EntitieUser $user)
    {
        $req = $this->conn->prepare('DELETE FROM users WHERE idUser = :idUser');
        $req->bindValue(":idUser", $user->getIdUser(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function checkMail(string $mail)
    {
        $query = "SELECT idUser FROM users WHERE mail = :mail";
        $req = $this->conn->prepare($query);
        $req->bindValue(":mail", $mail);
        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        if ($data) {
            $idUser = $data['idUser'];
            error_log("Mail already exists: " . $mail . " - ID: " . $idUser);
            return $idUser;
        } else {
            return false;
        }
    }

    public function verifyEmail(string $verifyToken)
    {
        $req = $this->conn->prepare("SELECT idUser FROM users WHERE verifyToken = :verifyToken");
        $req->bindValue(":verifyToken", $verifyToken);
        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            error_log("Invalid verification token: " . $verifyToken);
            return false; // Token invalide
        }
        $query = "UPDATE users SET isVerified = 1 WHERE verifyToken = :verifyToken";
        $req = $this->conn->prepare($query);
        $req->bindValue(":verifyToken", $verifyToken);
        if ($req->execute()) {
            $query = "UPDATE users SET verifyToken = NULL WHERE verifyToken = :verifyToken";
            $req = $this->conn->prepare($query);
            $req->bindValue(":verifyToken", $verifyToken);
            $req->execute();
            return $data['idUser'];
        } else {
            error_log("Email verification failed for link: " . $verifyToken);
            return false;
        }
    }

    public function updateWallet(int $idUser, float $amount)
    {
        $query = "UPDATE users SET wallet = :amount WHERE idUser = :idUser";
        $req = $this->conn->prepare($query);
        $req->bindValue(":amount", $amount, PDO::PARAM_STR);
        $req->bindValue(":idUser", $idUser, PDO::PARAM_INT);
        if ($req->execute()) {
            return true;
        } else {
            error_log("Failed to update wallet for user ID: " . $idUser);
            return false;
        }
    }

    public function getWalletFromUser(int $idUser)
    {
        $req = $this->conn->prepare('
        SELECT wallet
        FROM users
        WHERE idUser = :idUser');
        $req->bindValue(':idUser', $idUser, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data && $data['wallet'] !== null) {
            return $data['wallet'];
        } else {
            return false;
        }
    }

    public function updateUser(EntitieUser $user)
    {
        $query = "UPDATE users SET firstName = :firstName, lastName = :lastName, mail = :mail";
        $params = [
            ':firstName' => $user->getFirstName(),
            ':lastName' => $user->getLastName(),
            ':mail' => $user->getMail(),
            ':idUser' => $user->getIdUser()
        ];

        // Ajouter le surnom si il est fourni
        if ($user->getNickName() !== null) {
            $query .= ", nickName = :nickName";
            $params[':nickName'] = $user->getNickName();
        }

        // Ajouter l'adresse si elle est fournie
        if ($user->getAddress() !== null) {
            $query .= ", address = :address";
            $params[':address'] = $user->getAddress();
        }
        // Ajouter l'adresse 2 si elle est fournie
        if ($user->getAddress2() !== null) {
            $query .= ", address_2 = :address2";
            $params[':address2'] = $user->getAddress2();
        }
        // Ajouter l'adresse 3 si elle est fournie
        if ($user->getAddress3() !== null) {
            $query .= ", address_3 = :address3";
            $params[':address3'] = $user->getAddress3();
        }

        // Ajouter le code postal si il est fourni
        if ($user->getZip() !== null) {
            $query .= ", zip = :zip";
            $params[':zip'] = $user->getZip();
        }

        // Ajouter la ville si elle est fournie
        if ($user->getCity() !== null) {
            $query .= ", city = :city";
            $params[':city'] = $user->getCity();
        }

        // Ajouter le pays si il est fourni
        if ($user->getCountry() !== null) {
            $query .= ", country = :country";
            $params[':country'] = $user->getCountry();
        }

        $query .= " WHERE idUser = :idUser";

        $req = $this->conn->prepare($query);

        foreach ($params as $param => $value) {
            $req->bindValue($param, $value);
        }

        return $req->execute();
    }

    public function checkPassword(int $idUser, string $password)
    {
        $query = "SELECT password FROM users WHERE idUser = :idUser";
        $req = $this->conn->prepare($query);
        $req->bindValue(":idUser", $idUser, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        return $data && password_verify($password, $data['password']) ? true : false;
    }

    public function updateUserPassword(EntitieUser $user)
    {
        $query = "UPDATE users SET password = :password WHERE idUser = :idUser";
        $req = $this->conn->prepare($query);
        $req->bindValue(":password", $user->getPassword(), PDO::PARAM_STR);
        $req->bindValue(":idUser", $user->getIdUser(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function setNewToken(int $idUser, string $token)
    {
        $query = "UPDATE users SET verifyToken = :verifyToken WHERE idUser = :idUser";
        $req = $this->conn->prepare($query);
        $req->bindValue(":verifyToken", $token, PDO::PARAM_STR);
        $req->bindValue(":idUser", $idUser, PDO::PARAM_INT);
        return $req->execute();
    }

    public function updatePassword(int $idUser, string $password)
    {
        $query = "UPDATE users SET password = :password WHERE idUser = :idUser";
        $req = $this->conn->prepare($query);
        $req->bindValue(":idUser", $idUser, PDO::PARAM_INT);
        $req->bindValue(":password", $password,  PDO::PARAM_STR);
        return $req->execute();
    }
}
