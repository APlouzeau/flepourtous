<?php

class ClassDatabase
{
    public PDO $conn;

    public function __construct()
    {
        try {
            $this->conn = new PDO("mysql:host=" . DB_HOST . "; dbname=" . DB_NAME, DB_USER, DB_PSW);
        } catch (PDOException $e) {
            echo $e->getMessage();
            echo "La connexion à la base de données a échoué.";
        }
    }
}
