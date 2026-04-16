<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelUser
extends ClassDatabase
{

    public function register(EntitieUser $user)
    {
        $query = "INSERT INTO users (first_name, last_name, mail, nick_name, password, verify_token) VALUES (:first_name, :last_name, :mail, :nick_name, :password, :verify_token)";

        $req = $this->conn->prepare($query);
        $req->bindValue(":first_name", $user->getFirstName());
        $req->bindValue(":last_name", $user->getLastName());
        $req->bindValue(":mail", $user->getMail());
        $req->bindValue(":nick_name", $user->getNickName());
        $req->bindValue(":password", $user->getPassword());
        $req->bindValue(":verify_token", $user->getVerifyToken());

        return $req->execute();
    }

    public function getAllUsers()
    {
        $req = $this->conn->query('SELECT id_user, nick_name, first_name, mail FROM users ORDER BY nick_name');
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
        if ($data['is_verified'] == 0) {
            return ['isVerified' => false];
        } else {
            $user =
                [
                    'idUser' => $data['id_user'],
                    'nickName' => $data['nick_name'],
                    'firstName' => $data['first_name'],
                    'lastName' => $data['last_name'],
                    'mail' => $data['mail'],
                    'role' => $data['role'],
                ];
            return $user;
        }
    }


    public function getUser(EntitieUser $user)
    {
        $req = $this->conn->prepare('SELECT id_user, nick_name, first_name, last_name, mail, role, address, address_2, address_3, zip, city, country FROM users WHERE id_user = :id_user');
        $req->bindValue(":id_user", $user->getIdUser(), PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        if ($data) {
            $user =
                [
                    'idUser' => $data['id_user'],
                    'nickName' => $data['nick_name'],
                    'firstName' => $data['first_name'],
                    'lastName' => $data['last_name'],
                    'mail' => $data['mail'],
                    'address' => $data['address'] ?? null,
                    'address2' => $data['address_2'] ?? null,
                    'address3' => $data['address_3'] ?? null,
                    'zip' => $data['zip'] ?? null,
                    'city' => $data['city'] ?? null,
                    'country' => $data['country'] ?? null,
                    'role' => $data['role'] ?? null
                ];
        } else {
            return null; // Utilisateur non trouvé
        }
        return $data ? $user : null;
    }

    public function deleteUser(EntitieUser $user)
    {
        $req = $this->conn->prepare('DELETE FROM users WHERE id_user = :id_user');
        $req->bindValue(":id_user", $user->getIdUser(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function checkMail(string $mail)
    {
        $query = "SELECT id_user FROM users WHERE mail = :mail";
        $req = $this->conn->prepare($query);
        $req->bindValue(":mail", $mail);
        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        if ($data) {
            $idUser = $data['id_user'];
            return $idUser;
        } else {
            return false;
        }
    }

    public function verifyEmail(string $verifyToken)
    {
        $req = $this->conn->prepare("SELECT id_user FROM users WHERE verify_token = :verify_token");
        $req->bindValue(":verify_token", $verifyToken);
        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            error_log("Invalid verification token: " . $verifyToken);
            return false; // Token invalide
        }
        $query = "UPDATE users SET is_verified = 1 WHERE verify_token = :verify_token";
        $req = $this->conn->prepare($query);
        $req->bindValue(":verify_token", $verifyToken);
        if ($req->execute()) {
            $query = "UPDATE users SET verify_token = NULL WHERE verify_token = :verify_token";
            $req = $this->conn->prepare($query);
            $req->bindValue(":verify_token", $verifyToken);
            $req->execute();
            return $data['id_user'];
        } else {
            error_log("Email verification failed for link: " . $verifyToken);
            return false;
        }
    }

    public function updateWallet(int $idUser, float $amount)
    {
        $query = "UPDATE users SET wallet = :amount WHERE id_user = :id_user";
        $req = $this->conn->prepare($query);
        $req->bindValue(":amount", $amount, PDO::PARAM_STR);
        $req->bindValue(":id_user", $idUser, PDO::PARAM_INT);
        if ($req->execute()) {
            return true;
        } else {
            error_log("Failed to update wallet for user ID: " . $idUser);
            return false;
        }
    }

    public function addToWallet(int $idUser, float $amount)
    {
        $query = "UPDATE users SET wallet = wallet + :amount WHERE id_user = :id_user";
        $req = $this->conn->prepare($query);
        $req->bindValue(":amount", $amount, PDO::PARAM_STR);
        $req->bindValue(":id_user", $idUser, PDO::PARAM_INT);
        if ($req->execute()) {
            return true;
        } else {
            error_log("Failed to add to wallet for user ID: " . $idUser);
            return false;
        }
    }

    public function getWalletFromUser(int $idUser)
    {
        $req = $this->conn->prepare('
        SELECT wallet
        FROM users
        WHERE id_user = :id_user');
        $req->bindValue(':id_user', $idUser, PDO::PARAM_INT);
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
        $query = "UPDATE users SET first_name = :first_name, last_name = :last_name, mail = :mail";
        $params = [
            ':first_name' => $user->getFirstName(),
            ':last_name' => $user->getLastName(),
            ':mail' => $user->getMail(),
            ':id_user' => $user->getIdUser()
        ];

        // Ajouter le surnom si il est fourni
        if ($user->getNickName() !== null) {
            $query .= ", nick_name = :nick_name";
            $params[':nick_name'] = $user->getNickName();
        }

        // Ajouter l'adresse si elle est fournie
        if ($user->getAddress() !== null) {
            $query .= ", address = :address";
            $params[':address'] = $user->getAddress();
        }
        // Ajouter l'adresse 2 si elle est fournie
        if ($user->getAddress2() !== null) {
            $query .= ", address_2 = :address_2";
            $params[':address_2'] = $user->getAddress2();
        }
        // Ajouter l'adresse 3 si elle est fournie
        if ($user->getAddress3() !== null) {
            $query .= ", address_3 = :address_3";
            $params[':address_3'] = $user->getAddress3();
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

        $query .= " WHERE id_user = :id_user";

        $req = $this->conn->prepare($query);

        foreach ($params as $param => $value) {
            $req->bindValue($param, $value);
        }

        return $req->execute();
    }

    public function checkPassword(int $idUser, string $password)
    {
        $query = "SELECT password FROM users WHERE id_user = :id_user";
        $req = $this->conn->prepare($query);
        $req->bindValue(":id_user", $idUser, PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch(PDO::FETCH_ASSOC);
        return $data && password_verify($password, $data['password']) ? true : false;
    }

    public function updateUserPassword(EntitieUser $user)
    {
        $query = "UPDATE users SET password = :password WHERE id_user = :id_user";
        $req = $this->conn->prepare($query);
        $req->bindValue(":password", $user->getPassword(), PDO::PARAM_STR);
        $req->bindValue(":id_user", $user->getIdUser(), PDO::PARAM_INT);
        return $req->execute();
    }

    public function setNewToken(int $idUser, string $token)
    {
        $query = "UPDATE users SET verifyToken = :verifyToken WHERE id_user = :id_user";
        $req = $this->conn->prepare($query);
        $req->bindValue(":verifyToken", $token, PDO::PARAM_STR);
        $req->bindValue(":id_user", $idUser, PDO::PARAM_INT);
        return $req->execute();
    }

    public function updatePassword(int $idUser, string $password)
    {
        $query = "UPDATE users SET password = :password WHERE id_user = :id_user";
        $req = $this->conn->prepare($query);
        $req->bindValue(":id_user", $idUser, PDO::PARAM_INT);
        $req->bindValue(":password", $password,  PDO::PARAM_STR);
        return $req->execute();
    }
}
