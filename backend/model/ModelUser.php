<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelUser
extends ClassDatabase
{

    public function register(EntitieUser $user)
    {
        $query = "INSERT INTO users (nickName, firstName, lastName, mail, password) VALUES (:nickName, :firstName, :lastName, :mail, :password)";
        $req = $this->conn->prepare($query);
        $req->bindValue(":nickName", $user->getNickName());
        $req->bindValue(":firstName", $user->getFirstName());
        $req->bindValue(":lastName", $user->getLastName());
        $req->bindValue(":mail", $user->getMail());
        $req->bindValue(":password", $user->getPassword());

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

    public function login(EntitieUser $userVerify)
    {
        $query = "SELECT * FROM users WHERE mail = :mail";
        $req = $this->conn->prepare($query);
        $req->bindValue(":mail", $userVerify->getMail());
        $req->execute();

        $data = $req->fetch(PDO::FETCH_ASSOC);
        if ($data) {
            if ($userVerify->getPassword() == $data['password']) {
                //  if (password_verify($userVerify->getPassword(), $user['password'])) {
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
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function getUser(EntitieUser $user)
    {
        $req = $this->conn->prepare('SELECT * FROM users WHERE idUser = :idUser');
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
                    'role' => $data['role'],
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
}
