<?php
// backend/tests/bootstrap.php

// Définir APP_PATH pour les tests
define("APP_PATH", __DIR__ . "/../");

// Charger la configuration (version test)
require_once APP_PATH . "config/config.php";

// Charger l'autoloader de Composer
require_once APP_PATH . "vendor/autoload.php";

// Autoloader pour tes classes
spl_autoload_register(function ($class_name) {
    $patterns = [
        'Class' => APP_PATH . "/class",
        'Controller' => APP_PATH . "/controller",
        'Model' => APP_PATH . "/model",
        'Entitie' => APP_PATH . "/model"
    ];

    foreach ($patterns as $prefix => $dir) {
        if (strpos($class_name, $prefix) === 0) {
            $file = $dir . '/' . $class_name . '.php';
            if (file_exists($file)) {
                require_once $file;
                return;
            }
        }
    }
});
