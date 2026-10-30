<?php

use config\enum\ErrorCodes;

class ControllerUser
{

    private $controllerError;

    public function __construct()
    {
        $this->controllerError = new ControllerError();
    }

    // Versions en vigueur des documents à accepter à l'inscription, dans l'ordre
    // envoyé par le formulaire. À changer ici ET dans le formulaire d'inscription
    // à chaque nouvelle version d'un document.
    public const INTERNAL_REGULATIONS_VERSION = '1.1';
    public const TERMS_OF_SERVICE_VERSION = '1.1';
    public const PRIVACY_POLICY_VERSION = '1.1';

    private $userNotConnected = [
        'code' => 0,
        'message' => 'Utilisateur non connecté'
    ];

    public function verifyConnectBack()
    {

        if (isset($_SESSION['idUser']) && !empty($_SESSION['idUser'])) {
            return true;
        } else {
            http_response_code(401);
            $response = $this->userNotConnected;
            echo json_encode($response);
            exit();
        }
    }

    public function verifyCronKey()
    {
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        if (isset($_SERVER['HTTP_API_KEY']) && hash_equals(CRON_KEY, $_SERVER['HTTP_API_KEY'] ?? '')) {
            return true;
        } else {
            http_response_code(401);
            exit();
        }
    }

    public function verifyConnectAdmin()
    {
        if (isset($_SESSION['idUser']) && !empty($_SESSION['idUser']) && isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
            return true;
        } else {
            http_response_code(401);
            $response = [
                'code' => 0,
                'message' => 'Utilisateur non autorisé'
            ];
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
                    'code' => 0, // 
                    'message' => 'ID_INVALID'
                ];
            }
            if (isset($userVerify['isVerified']) && $userVerify['isVerified'] === false) {
                $response = [
                    'code' => 0,
                    'message' => 'USER_UNVERIFIED'
                ];
            }


            if (isset($userVerify['idUser'])) {
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

        $verification = $this->controlUserInformations($data);
        if ($verification['code'] == 0) {
            $response = [
                'code' => 0,
                'message' => $verification['message'],
            ];
            echo json_encode($response);
            return;
        }
        if ($verification['code'] == 1) {
            $modelUser = new ModelUser();

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
                'nickName' => isset($data['nickName']) ? $data['nickName'] : null,
                'firstName' => $data['firstName'],
                'lastName' => $data['lastName'],
                'mail' => $data['mail'],
                'address' => isset($data['address']) ? $data['address'] : null,
                'address2' => isset($data['address2']) ? $data['address2'] : null,
                'address3' => isset($data['address3']) ? $data['address3'] : null,
                'zip' => isset($data['zip']) ? $data['zip'] : null,
                'city' => isset($data['city']) ? $data['city'] : null,
                'country' => isset($data['country']) ? $data['country'] : null,
            ];

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
    }

    public function register()
    {
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        // return;
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
            !isset($data['passwordConfirm']) ||
            !isset($data['acceptations'])
        ) {
            $response = [
                'code' => 0,
                'message' => 'Erreur de paramètres',
            ];
        } else {
            $validationUserInformations = $this->controlUserInformations($data);
            $validationAcceptations = $this->controlAcceptations($data['acceptations']);
            if ($validationUserInformations['code'] == 0) {
                $response = [
                    'code' => 0,
                    'message' => $validationUserInformations['message'],
                ];
            } elseif ($validationAcceptations['code'] == 0) {
                $response = [
                    'code' => 0,
                    'message' => $validationAcceptations['message'],
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
                            'password' => password_hash($data['password'], PASSWORD_BCRYPT),
                            'verifyToken' => $verificationToken,
                            'internalRegulationsVersion' => self::INTERNAL_REGULATIONS_VERSION,
                            'termsOfServiceVersion' => self::TERMS_OF_SERVICE_VERSION,
                            'privacyPolicyVersion' => self::PRIVACY_POLICY_VERSION,
                        ]);

                        $register = $userModel->register($user);

                        if ($register) {
                            $controllerMail = new ControllerMail();
                            $controllerMail->sendMailToRegister($user, $verificationToken);

                            $response = [
                                'code' => 1,
                                'message' => 'Inscription réussie, vous allez recevoir un e-mail de vérification.',
                            ];
                        }

                        if (!$register) {
                            $response = [
                                'code' => 0,
                                'message' => 'Erreur lors de l\'enregistrement en base de données',
                            ];
                        }
                    }
                }
            }
        }
        echo json_encode($response);
    }

    public function verifyEmail($token = null)
    {
        if (!$token) {
            $response = [
                'code' => 0,
                'message' => 'Token manquant',
            ];
            header('Location: ' . URI_FRONT . 'echec?raison=token_manquant');
        } else {
            $modelUser = new ModelUser();
            $user = $modelUser->verifyEmail($token);
            if ($user) {
                $response = [
                    'code' => 1,
                    'message' => 'Adresse e-mail vérifiée avec succès',
                ];
                header('Location: ' . URI_FRONT . 'success');
            } else {
                $response = [
                    'code' => 0,
                    'message' => 'Erreur lors de la vérification de l\'adresse e-mail',
                ];
                header('Location: ' . URI_FRONT . 'echec?raison=token_invalide');
            }
        }
        echo json_encode($response);
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
        // 1. Validation de l'adresse e-mail (filter_var est la meilleure méthode)
        if (!filter_var($data['mail'], FILTER_VALIDATE_EMAIL)) {
            return [
                'code' => 0,
                'message' => 'Adresse e-mail invalide',
            ];
        }

        // 2. Validation du pseudo
        if (strlen($data['nickName']) < 2 || strlen($data['nickName']) > 25) {
            return [
                'code' => 0,
                'message' => 'Le pseudo doit contenir entre 2 et 25 caractères',
            ];
        }
        // Regex pour autoriser lettres, chiffres et underscore pour le pseudo
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $data['nickName'])) {
            return [
                'code' => 0,
                'message' => 'Le pseudo ne peut contenir que des lettres (sans accent), des chiffres et des underscores (_).',
            ];
        }

        // 3. Validation du prénom
        if (strlen($data['firstName']) < 2 || strlen($data['firstName']) > 25) {
            return [
                'code' => 0,
                'message' => 'Le prénom doit contenir entre 2 et 25 caractères',
            ];
        }

        // 4. Validation du nom
        if (strlen($data['lastName']) < 2 || strlen($data['lastName']) > 25) {
            return [
                'code' => 0,
                'message' => 'Le nom doit contenir entre 2 et 25 caractères',
            ];
        }

        // Si toutes les vérifications ci-dessus sont passées, les informations sont valides.
        return [
            'code' => 1,
            'message' => 'Informations valides',
        ];
    }

    /**
     * Les trois documents doivent être acceptés, dans la version en vigueur.
     * La version envoyée par le formulaire sert seulement à vérifier que la personne
     * a vu le document actuel : c'est la version du backend qui est enregistrée.
     */
    public function controlAcceptations($acceptations)
    {
        $documents = [
            [self::INTERNAL_REGULATIONS_VERSION, ErrorCodes::REGULATIONS_INTERIOR_NOT_ACCEPTED],
            [self::TERMS_OF_SERVICE_VERSION, ErrorCodes::TERMS_OF_SERVICE_NOT_ACCEPTED],
            [self::PRIVACY_POLICY_VERSION, ErrorCodes::PRIVACY_POLICY_NOT_ACCEPTED],
        ];

        if (!is_array($acceptations) || count($acceptations) != count($documents)) {
            return [
                'code' => 0,
                'message' => 'Erreur de paramètres',
            ];
        }

        foreach ($documents as $index => [$currentVersion, $notAcceptedError]) {
            $acceptation = $acceptations[$index] ?? null;
            if (!is_array($acceptation)) {
                return [
                    'code' => 0,
                    'message' => 'Erreur de paramètres',
                ];
            }
            if (($acceptation['accepted'] ?? null) !== true) {
                return [
                    'code' => 0,
                    'message' => $notAcceptedError,
                ];
            }
            if (($acceptation['version'] ?? null) !== $currentVersion) {
                return [
                    'code' => 0,
                    'message' => ErrorCodes::DOCUMENT_VERSION_OUTDATED,
                ];
            }
        }

        return [
            'code' => 1,
            'message' => 'Acceptations valides',
        ];
    }

    public function controlUserPasswordFormat(array $data)
    {
        if ($data['password'] != $data['passwordConfirm']) {
            return [
                'code' => 0,
                'message' => 'Les mots de passe ne correspondent pas',
            ];
        }

        $regex = "/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,60})/";
        if (!preg_match($regex, $data['password'])) {
            return [
                'code' => 0,
                'message' => 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
            ];
        }

        return [
            'code' => 1,
            'message' => 'Mot de passe valide',
        ];
    }

    public function updateUserPassword()
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

        if (!isset($data['oldPassword']) || !isset($data['newPassword']) || !isset($data['confirmNewPassword'])) {
            $response = [
                'code' => 0,
                'message' => 'Paramètres requis manquants (oldPassword, newPassword, confirmNewPassword)',
            ];
            echo json_encode($response);
            return;
        }

        $modelUser = new ModelUser();
        $passwordsOk = $modelUser->checkPassword($_SESSION['idUser'], $data['oldPassword']);
        if (!$passwordsOk) {
            $response = [
                'code' => 0,
                'message' => 'Ancien mot de passe incorrect',
            ];
            echo json_encode($response);
            return;
        }

        $passwords = [
            'password' => $data['newPassword'],
            'passwordConfirm' => $data['confirmNewPassword']
        ];
        $validation = $this->controlUserPasswordFormat($passwords);
        if ($validation['code'] == 0) {
            $response = [
                'code' => 0,
                'message' => $validation['message'],
            ];
            echo json_encode($response);
            return;
        }

        $user = new EntitieUser([
            'idUser' => $_SESSION['idUser'],
            'password' => password_hash($data['newPassword'], PASSWORD_BCRYPT),
        ]);

        $updateResult = $modelUser->updateUserPassword($user);

        if ($updateResult) {
            $response = [
                'code' => 1,
                'message' => 'Mot de passe mis à jour avec succès',
            ];
        } else {
            $response = [
                'code' => 0,
                'message' => 'Erreur lors de la mise à jour du mot de passe',
            ];
        }
        echo json_encode($response);
    }

    public function forgetedPassword()
    {
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);


        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            echo json_encode([
                'code' => 0,
                'message' => 'Erreur de méthode',
            ]);
            return;
        }
        if (!isset($data['mail'])) {
            echo json_encode([
                'code' => 0,
                'message' => 'Paramètre manquant (mail)',
            ]);
            return;
        }
        $mail = $data['mail'];
        $modelUser = new ModelUser();
        $userId = $modelUser->checkMail($mail);
        if ($userId) {
            $verificationToken = hash('sha256', $data['mail'] . CRON_KEY);
            $modelUser->setNewToken($userId, $verificationToken);

            $controllerMail = new ControllerMail();
            $controllerMail->sendMailToForgetedPassword($mail, $verificationToken);

            echo json_encode([
                'code' => 1,
                'message' => 'Un e-mail de réinitialisation du mot de passe a été envoyé.',
            ]);
            return;
        } else {
            echo json_encode([
                'code' => 0,
                'message' => 'Aucun utilisateur trouvé avec cette adresse e-mail.',
            ]);
            return;
        }
    }

    public function resetPasswordLink($token = null)
    {
        if (!$token) {
            echo json_encode([
                'code' => 0,
                'message' => 'Token manquant',
            ]);
            header('Location: ' . URI_FRONT . 'echec-reinitialisation-du-mot-de-passe?raison=token_manquant');
            return;
        }

        $modelUser = new ModelUser();
        $userId = $modelUser->verifyEmail($token);
        if (!$userId) {
            header('Location: ' . URI_FRONT . 'echec?raison=token_invalide');
            echo json_encode([
                'code' => 0,
                'message' => 'Token invalide ou expiré',
            ]);
            return;
        }

        if ($userId) {
            $_SESSION['idUser'] = $userId;
            header('Location: ' . URI_FRONT . 'reset-password');
        }
    }

    public function resetPassword()
    {
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            echo json_encode([
                'code' => 0,
                'message' => 'Erreur de méthode',
            ]);
            return;
        }
        if (!isset($data['newPassword']) || !isset($data['confirmNewPassword'])) {
            echo json_encode([
                'code' => 0,
                'message' => 'Paramètres manquants (newPassword, confirmNewPassword)',
            ]);
            return;
        }
        $passwords = [
            'password' => $data['newPassword'],
            'passwordConfirm' => $data['confirmNewPassword']
        ];
        $validation = $this->controlUserPasswordFormat($passwords);
        if ($validation['code'] == 0) {
            echo json_encode([
                'code' => 0,
                'message' => $validation['message'],
            ]);
            return;
        }
        $password = password_hash($data['newPassword'], PASSWORD_BCRYPT);
        $modelUser = new ModelUser();
        $updatePassword = $modelUser->updatePassword($_SESSION['idUser'], $password);
        if (!$updatePassword) {
            echo json_encode([
                'code' => 0,
                'message' => 'Erreur lors de la mise à jour du mot de passe',
            ]);
            return;
        }
        session_unset();
        session_destroy();
        setcookie(session_name(), "", time() - 3600, "/");
        echo json_encode([
            'code' => 1,
            'message' => 'Mot de passe réinitialisé avec succès',
        ]);
        return;
    }
}
