<?php


class ControllerUser
{
    private $userNotConnected = [
        'code' => 0,
        'message' => 'Utilisateur non connecté'
    ];

    public function verifyConnectBack()
    {

        if (isset($_SESSION['idUser']) && !empty($_SESSION['idUser'])) {
            return true;
        } else {
            $response = $this->userNotConnected;
            echo json_encode($response);
            exit();
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
            $response = $this->userNotConnected;
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
            $userVerify = $userModel->login($mail, $password);

            if ($userVerify === null) {
                $response = [
                    'code' => 0,
                    'message' => 'Nom ou mot de passe incorrect.'
                ];
            }
            if (isset($userVerify['isVerified']) && $userVerify['isVerified'] === false) {
                $response = [
                    'code' => 0,
                    'message' => 'Utilisateur non vérifié. Veuillez vérifier votre adresse e-mail.'
                ];
            }


            if (isset($userVerify['idUser'])) {
                $_SESSION['idUser'] = $userVerify['idUser'];
                $_SESSION['nickName'] = $userVerify['nickName'];
                $_SESSION['role'] = $userVerify['role'];
                $_SESSION['mail'] = $userVerify['mail'];
                $_SESSION['firstName'] = $userVerify['firstName'];
                $_SESSION['lastName'] = $userVerify['lastName'];
                error_log("LOGIN - Session Data after setting: " . print_r($_SESSION, true));
                $response = [
                    'code' => 1,
                    'message' => 'Connexion réussie.',
                    'data' => $_SESSION
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
        $this->verifyConnectBack();
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

        $wallet = $modelUser->getWalletFromUser($_SESSION['idUser']);
        if ($wallet !== false) {
            $response['data']['wallet'] = $wallet;
        } else {
            $response['data']['wallet'] = null;
        }

        echo json_encode($response);
    }

    public function updateUserProfile()
    {
        $this->verifyConnectBack();
        
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            $response = [
                'code' => 0,
                'message' => 'Erreur de méthode',
            ];
            echo json_encode($response);
            return;
        }
        
        if (!isset($data['firstName']) || !isset($data['lastName']) || !isset($data['mail'])) {
            $response = [
                'code' => 0,
                'message' => 'Paramètres requis manquants (firstName, lastName, mail)',
            ];
            echo json_encode($response);
            return;
        }
        
        // Validation des données
        if (!filter_var($data['mail'], FILTER_VALIDATE_EMAIL)) {
            $response = [
                'code' => 0,
                'message' => 'Adresse e-mail invalide',
            ];
            echo json_encode($response);
            return;
        }
        
        if (strlen($data['firstName']) < 2) {
            $response = [
                'code' => 0,
                'message' => 'Le prénom doit contenir au moins 2 caractères',
            ];
            echo json_encode($response);
            return;
        }
        
        if (strlen($data['lastName']) < 2) {
            $response = [
                'code' => 0,
                'message' => 'Le nom doit contenir au moins 2 caractères',
            ];
            echo json_encode($response);
            return;
        }
        
        $modelUser = new ModelUser();
        
        // Vérifier si l'email n'est pas déjà utilisé par un autre utilisateur
        $existingUserId = $modelUser->checkMail($data['mail']);
        if ($existingUserId && $existingUserId != $_SESSION['idUser']) {
            $response = [
                'code' => 0,
                'message' => 'Cette adresse e-mail est déjà utilisée par un autre utilisateur',
            ];
            echo json_encode($response);
            return;
        }
        
        // Préparer les données pour la mise à jour
        $updateData = [
            'idUser' => $_SESSION['idUser'],
            'firstName' => $data['firstName'],
            'lastName' => $data['lastName'],
            'mail' => $data['mail'],
            'address' => isset($data['address']) ? $data['address'] : null,
            'country' => isset($data['country']) ? $data['country'] : null
        ];
        
        // Si un nouveau mot de passe est fourni, l'ajouter
        if (isset($data['password']) && !empty($data['password'])) {
            if (strlen($data['password']) < 8) {
                $response = [
                    'code' => 0,
                    'message' => 'Le mot de passe doit contenir au moins 8 caractères',
                ];
                echo json_encode($response);
                return;
            }
            $updateData['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        $user = new EntitieUser($updateData);
        $updateResult = $modelUser->updateUser($user);
        
        if ($updateResult) {
            $response = [
                'code' => 1,
                'message' => 'Profil mis à jour avec succès',
            ];
        } else {
            $response = [
                'code' => 0,
                'message' => 'Erreur lors de la mise à jour du profil',
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
        } else {
            $validationUserInformations = $this->controlUserInformations($data);
            if ($validationUserInformations['code'] == 0) {
                $response = [
                    'code' => 0,
                    'message' => $validationUserInformations['message'],
                ];
            } else {
                $validationPassword = $this->controlUserPasswordFormat($data);
                if ($validationPassword['code'] == 0) {
                    $response = [
                        'code' => 0,
                        'message' => $validationPassword['message'],
                    ];
                } else {
                    $userModel = new ModelUser();
                    $checkMail = $userModel->checkMail($data['mail']);
                    if ($checkMail) {
                        $response = [
                            'code' => 0,
                            'message' => 'Adresse e-mail déjà utilisée',
                        ];
                    } else {
                        $verificationToken = hash('sha256', $data['mail'] . $data['nickName'] . CRON_KEY);
                        $user = new EntitieUser([
                            'nickName' => $data['nickName'],
                            'firstName' => $data['firstName'],
                            'lastName' => $data['lastName'],
                            'mail' => $data['mail'],
                            'password' => $data['password'],
                            'verifyToken' => $verificationToken,
                        ]);
                        $controllerMail = new ControllerMail();
                        $sendMail = $controllerMail->sendMailToRegister($user, $verificationToken);
                        $register = $userModel->register($user);

                        !$register  ?
                            $response = [
                                'code' => 0,
                                'message' => 'Erreur lors de l\'enregistrement en base de données',
                            ]
                            :
                            $response = [
                                'code' => 1,
                                'message' => 'Inscription réussie, vous allez recevoir un e-mail de vérification.',
                            ];
                    }
                }
            }
            echo json_encode($response);
        }
    }

    public function verifyEmail($token = null)
    {
        if (!$token) {
            $response = [
                'code' => 0,
                'message' => 'Token manquant',
            ];
            header('Location: ' . URI . 'echec?raison=token_manquant');
        } else {
            $modelUser = new ModelUser();
            $user = $modelUser->verifyEmail($token);
            if ($user) {
                $response = [
                    'code' => 1,
                    'message' => 'Adresse e-mail vérifiée avec succès',
                ];
                header('Location: ' . URI . 'success');
            } else {
                $response = [
                    'code' => 0,
                    'message' => 'Erreur lors de la vérification de l\'adresse e-mail',
                ];
                header('Location: ' . URI . 'echec?raison=token_invalide');
            }
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

    public function controlUserInformations(array $data)
    {
        if (!filter_var($data['mail'], FILTER_VALIDATE_EMAIL)) {
            $response = [
                'code' => 0,
                'message' => 'Adresse e-mail invalide',
            ];
        } elseif (strlen($data['nickName']) < 2) {
            $response = [
                'code' => 0,
                'message' => 'Le pseudo doit contenir au moins 2 caractères',
            ];
        } elseif (strlen($data['firstName']) < 2) {
            $response = [
                'code' => 0,
                'message' => 'Le prénom doit contenir au moins 2 caractères',
            ];
        } elseif (strlen($data['lastName']) < 2) {
            $response = [
                'code' => 0,
                'message' => 'Le nom doit contenir au moins 2 caractères',
            ];
        } else {
            $response = [
                'code' => 1,
                'message' => 'Informations valides',
            ];
        }
        return $response;
    }

    public function controlUserPasswordFormat(array $data)
    {
        if (strlen($data['password']) < 12) {
            $response = [
                'code' => 0,
                'message' => 'Le mot de passe doit contenir au moins 12 caractères',
            ];
        } elseif ($data['password'] != $data['passwordConfirm']) {
            $response = [
                'code' => 0,
                'message' => 'Les mots de passe ne correspondent pas',
            ];
        } else {
            $response = [
                'code' => 1,
                'message' => 'Mot de passe valide',
            ];
        }
        return $response;
    }
}
