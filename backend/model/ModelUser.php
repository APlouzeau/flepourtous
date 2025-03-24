<?php

require_once APP_PATH . "/class/ClassDatabase.php"; // Inclure la classe PDOServer

class ModelUser
extends ClassDatabase
{

    public function register(EntitieUser $user)
    {
        $query = "INSERT INTO Users (pseudo, password) VALUES (:pseudo, :password)";
        $req = $this->conn->prepare($query);

        $pseudo = htmlspecialchars(strip_tags($user->getpseudo()));
        $password_hash = password_hash($user->getPassword(), PASSWORD_BCRYPT);

        $req->bindParam(":pseudo", $pseudo);
        $req->bindParam(":password", $password_hash);

        return $req->execute();
    }

    public function getAllUsers()
    {
        $req = $this->conn->query('SELECT id, nickName, firstname, mail FROM users ORDER BY nickName');
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
        $query = "SELECT * FROM Users WHERE pseudo = :pseudo";
        $req = $this->conn->prepare($query);
        $req->bindValue(":pseudo", $userVerify->getPseudo());
        $req->execute();

        // Récupérer les données de l'utilisateur
        $user = $req->fetch();
        if ($user) {
            // Vérifier si le mot de passe correspond
            if ($userVerify->getPassword() == $user['password']) {
                //  if (password_verify($userVerify->getPassword(), $user['password'])) {
                return new EntitieUser(
                    [
                        'id_user' => $user['id_user'],
                        'pseudo' => $user['pseudo'],
                        'mail' => $user['mail'],
                        'role' => $user['role']
                    ]
                );
            } else {
                return false; // Mot de passe incorrect
            }
        } else {
            return false; // Utilisateur non trouvé
        }
    }

    public function getUser(EntitieUser $user)
    {
        $req = $this->conn->prepare('SELECT * FROM users WHERE id_user = :id_user');
        $req->bindValue(":id_user", $user->getId_user(), PDO::PARAM_INT);
        $req->execute();
        $data = $req->fetch();
        return $data ? new EntitieUser($data) : null;
    }

    public function deleteUser(EntitieUser $user)
    {
        $req = $this->conn->prepare('DELETE FROM users WHERE id_user = :id_user');
        $req->bindValue(":id_user", $user->getId_user(), PDO::PARAM_INT);
        return $req->execute();
    }
}
