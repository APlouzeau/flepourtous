<?php

/* use Firebase\JWT\JWT;
use Firebase\JWT\Key; */

class ControllerUser
{

    public function verifyConnect()
    {
        if (isset($_SESSION['id_user']) && !empty($_SESSION['id_user'])) {
            $response = [
                'errno' => 0,
                'errmsg' => 'Utilisateur connecté',
            ];
        } else {
            $response = [
                'errno' => 1,
                'errmsg' => 'Utilisateur non connecté'
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
                $response =
                    "Connexion réussie.";
                /*                         "SESSION" => $_SESSION, */
            } else {
                $response = "Nom ou mot de passe incorrect.";
            }
            echo json_encode($response);
        }
    }

    public function logout()
    {
        session_destroy();
        $_SESSION = [];
        echo json_encode([
            'errno' => 0,
            'errmsg' => 'Deconnexion réussie.'
        ]);
    }



    public function getUserInformations()
    {
        if (!isset($_SESSION['id_user']) || empty($_SESSION['id_user'])) {
            $response['errmsg'] = 'error';
        } else {
            $modelUser = new ModelUser();
            $user = new EntitieUser([
                'id_user' => $_SESSION['id_user']
            ]);
            $response = [
                'errmsg' => 'Utilisateur trouvé',
                'data' =>
                $modelUser->getUser($user)

            ];
        }
        echo json_encode($response);
    }
    public function registerPage()
    {
        $titlePage = "Ecoloquiz : Inscription";
        require_once APP_PATH . "/views/head.php";
        require_once APP_PATH . "/views/header.php";
        require_once APP_PATH . "/views/register.php";
        require_once APP_PATH . "/views/footer.php";
    }

    public function register()
    {
        if (isset($_POST['nickName']) and !empty($_POST['password'])) {
            $nickName = htmlspecialchars($_POST['nickName']);
            $mdp = sha1($_POST['password']);
            $user = new EntitieUser([
                "nickName" => $nickName,
                "password" => $mdp
            ]);
            $userModel = new ModelUser();
            $userModel->register($user);
            header("Location: " . BASE_URL . "login");
        }
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
            'errno' => 1,
            'errmsg' => 'Erreur inconnue',
            'data' => []
        ];
        if (!$_SESSION) {
            $response['errmsg'] = 'Utilisateur non connecté';
        } else if (!$_POST['id_user']) {
            $response['errmsg'] = 'Paramètre manquant';
        } else if ($_SESSION['role'] != 'admin') {
            $response['errmsg'] = 'Utilisateur non autorisé';
        } else {
            $id_user = $_POST['id_user'];
            $modelUser = new ModelUser();
            $user = new EntitieUser([
                'id_user' => $id_user
            ]);
            $modelUser->deleteUser($user);
            $response = [
                'errno' => 0,
                'errmsg' => 'Utilisateur supprimé',
                'data' => [
                    'id_user' => $id_user
                ]
            ];
        }
        echo json_encode($response);
        exit();
    }
}
