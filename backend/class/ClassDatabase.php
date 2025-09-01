<?php

require_once APP_PATH . "config/config.php";

class ClassDatabase
{
    public PDO $conn;

    public function __construct()
    {
        //var_dump(DB_HOST, DB_NAME, DB_USER, DB_PSW);
        try {
            $this->conn = new PDO(
                'mysql:host=135.125.106.184;dbname=flepourtous-preprod', 'flepourtous-preprod','BWG_Char6x9/@t5['
            );
        } catch (PDOException $e) {
            echo $e->getMessage();
            echo "La connexion à la base de données a échoué.";
        }
    }
}
