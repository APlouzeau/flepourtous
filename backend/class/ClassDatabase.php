<?php

require_once APP_PATH . "config/config.php";

class ClassDatabase
{
    public PDO $conn;

    public function __construct()
    {
        try {
            $this->conn = new PDO(
                'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME,
                DB_USER,
                DB_PSW
            );
        } catch (PDOException $e) {
            // Le détail (hôte, utilisateur) reste dans les logs serveur, jamais dans la réponse.
            error_log("Connexion BDD impossible : " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'code' => 0,
                'message' => 'Erreur serveur'
            ]);
            // Sans connexion, $conn n'est pas initialisé : on s'arrête ici plutôt
            // que de laisser une erreur fatale plus loin.
            exit();
        }
    }
}
