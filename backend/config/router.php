<?php

// Connexion
$router->addRoute('GET', BASE_URL, 'ControllerUser', 'loginPage');
$router->addRoute('GET', BASE_URL . 'login', 'ControllerUser', 'loginPage');
$router->addRoute('POST', BASE_URL . 'login', 'ControllerUser', 'login');
$router->addRoute('GET', BASE_URL . 'logout', 'ControllerUser', 'disconnect');
$router->addRoute('GET', BASE_URL . 'register', 'ControllerUser', 'registerPage');
$router->addRoute('POST', BASE_URL . 'register', 'ControllerUser', 'register');

// Navigation
$router->addRoute('GET', BASE_URL . "home", 'ControllerUser', 'homePage');
