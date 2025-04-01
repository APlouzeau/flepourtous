<?php

/* use Firebase\JWT\JWT;
use Firebase\JWT\Key; */

class ControllerUser
{

    public function verifyConnect()
    {
        if (isset($_SESSION['id_user']) && !empty($_SESSION['id_user'])) {
            $response = [
                'code' => 1,
                'message' => 'Utilisateur connecté',
            ];
        } else {
            $response = [
                'code' => 0,
                'message' => 'Utilisateur non connecté'
            ];
        }
        echo json_encode($response);
    }

    public function login()
    {
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $mail = $data['mail'];
            $password = $data['password'];

            $userModel = new ModelUser();
            $user = new EntitieUser([
                'mail' => $mail,
                'password' => $password
            ]);


            $userVerify = $userModel->login($user);
            if ($userVerify) {
                /* $response = JWT::encode($userVerify, JWT_KEY, 'HS256'); */
                $_SESSION = [
                    'id_user' => $userVerify['id_user'],
                    'nickName' => $userVerify['nickName'],
                    'role' => $userVerify['role'],
                    'mail' => $userVerify['mail'],
                    'firstName' => $userVerify['firstName'],
                    'lastName' => $userVerify['lastName'],
                ];
                $response = [
                    'code' => 1,
                    'message' => 'Connexion réussie.'
                ];
            } else {
                $response = [
                    'code' => 0,
                    'message' => 'Nom ou mot de passe incorrect.'
                ];
            }
            echo json_encode($response);
        }
    }

    public function logout()
    {
        session_destroy();
        $_SESSION = [];
        echo json_encode([
            'code' => 1,
            'message' => 'Deconnexion réussie.'
        ]);
    }



    public function getUserInformations()
    {
        if (!isset($_SESSION['id_user']) || empty($_SESSION['id_user'])) {
            $response['message'] = 'error';
        } else {
            $modelUser = new ModelUser();
            $user = new EntitieUser([
                'id_user' => $_SESSION['id_user']
            ]);
            $response = [
                'code' => 1,
                'message' => 'Utilisateur trouvé',
                'data' =>
                $modelUser->getUser($user)

            ];
        }
        echo json_encode($response);
    }

    public function register()
    {
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            $response = [
                'code' => 0,
                'message' => 'Erreur de méthode',
            ];
        } else if (
            !isset($data['nickName']) ||
            !isset($data['firstName']) ||
            !isset($data['lastName']) ||
            !isset($data['mail']) ||
            !isset($data['password']) ||
            !isset($data['passwordConfirm'])
        ) {
            $response = [
                'code' => 0,
                'message' => 'Erreur de paramètres',
            ];
        } else if ($data['password'] != $data['passwordConfirm']) {
            $response = [
                'code' => 0,
                'message' => 'Les mots de passe ne correspondent pas',
            ];
        } else {
            $user = new EntitieUser([
                'nickName' => $data['nickName'],
                'firstName' => $data['firstName'],
                'lastName' => $data['lastName'],
                'mail' => $data['mail'],
                'password' => $data['password'],
            ]);
            $userModel = new ModelUser();
            $userModel->register($user);
            $response = [
                'code' => 1,
                'message' => 'Inscription réussie',
            ];
        }
        echo json_encode($response);
    }


    public function listUsers()
    {
        // Ajouter les headers CORS pour permettre la communication entre domaines


        $result = array("message" => "Hello from PHP!");

        $modelUser = new ModelUser();
        $users = $modelUser->getAllUsers();
        $result = [];
        foreach ($users as $user) {
            $result[] = [
                'mail' => $user->getMail(),
            ];
        }
        echo json_encode($result);
    }

    public function deleteUser()
    {
        $response = [
            'code' => 1,
            'message' => 'Erreur inconnue',
            'data' => []
        ];
        if (!$_SESSION) {
            $response['message'] = 'Utilisateur non connecté';
        } else if (!$_POST['id_user']) {
            $response['message'] = 'Paramètre manquant';
        } else if ($_SESSION['role'] != 'admin') {
            $response['message'] = 'Utilisateur non autorisé';
        } else {
            $id_user = $_POST['id_user'];
            $modelUser = new ModelUser();
            $user = new EntitieUser([
                'id_user' => $id_user
            ]);
            $modelUser->deleteUser($user);
            $response = [
                'code' => 0,
                'message' => 'Utilisateur supprimé',
                'data' => [
                    'id_user' => $id_user
                ]
            ];
        }
        echo json_encode($response);
        exit();
    }
}
