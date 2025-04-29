<?php


class ControllerUser
{
    public function verifyConnectBack()
    {
        if (isset($_SESSION['idUser']) && !empty($_SESSION['idUser'])) {
            return true;
        }
    }

    public function verifyConnect()
    {
        if (isset($_SESSION['idUser']) && !empty($_SESSION['idUser'])) {
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
                $_SESSION['idUser'] = $userVerify['idUser'];
                $_SESSION['nickName'] = $userVerify['nickName'];
                $_SESSION['role'] = $userVerify['role'];
                $_SESSION['mail'] = $userVerify['mail'];
                $_SESSION['firstName'] = $userVerify['firstName'];
                $_SESSION['lastName'] = $userVerify['lastName'];
                $response = [
                    'code' => 1,
                    'message' => 'Connexion réussie.',
                    'data' => $_SESSION
                ];
            } else {
                $response = [
                    'code' => 0,
                    'message' => 'Nom ou mot de passe incorrect.'
                ];
            }
        } else {
            $response = [
                'code' => 0,
                'message' => 'Erreur de méthode'
            ];
        }
        echo json_encode($response);
    }

    public function logout()
    {
        session_unset();
        session_destroy();
        setcookie(session_name(), "", time() - 3600, "/");
        echo json_encode([
            'code' => 1,
            'message' => 'Deconnexion réussie.'
        ]);
    }



    public function getUserInformations()
    {

        if (!isset($_SESSION['idUser']) || empty($_SESSION['idUser'])) {
            $response = [
                'code' => 0,
                'message' => 'Utilisateur non connecté',
            ];
        } else {
            $modelUser = new ModelUser();
            $user = new EntitieUser([
                'idUser' => $_SESSION['idUser']
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
        } elseif (
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
        } elseif ($data['password'] != $data['passwordConfirm']) {
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
            $register = $userModel->register($user);

            !$register  ?
                $response = [
                    'code' => 0,
                    'message' => 'Erreur lors de l\'enregistrement en base de données',
                ]
                :
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
        } elseif (!$_POST['idUser']) {
            $response['message'] = 'Paramètre manquant';
        } elseif ($_SESSION['role'] != 'admin') {
            $response['message'] = 'Utilisateur non autorisé';
        } else {
            $idUser = $_POST['idUser'];
            $modelUser = new ModelUser();
            $user = new EntitieUser([
                'idUser' => $idUser
            ]);
            $modelUser->deleteUser($user);
            $response = [
                'code' => 0,
                'message' => 'Utilisateur supprimé',
                'data' => [
                    'idUser' => $idUser
                ]
            ];
        }
        echo json_encode($response);
        exit();
    }
}
