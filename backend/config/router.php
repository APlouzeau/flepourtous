<?php

// Connexion
$router->addRoute('GET', BASE_URL, 'ControllerUser', 'loginPage');
$router->addRoute('GET', BASE_URL . 'login', 'ControllerUser', 'loginPage');
$router->addRoute('POST', BASE_URL . 'api/login', 'ControllerUser', 'login');
$router->addRoute('POST', BASE_URL . 'api/logout', 'ControllerUser', 'logout');
$router->addRoute('POST', BASE_URL . 'api/register', 'ControllerUser', 'register');
$router->addRoute('POST', BASE_URL . 'api/verifyConnect', 'ControllerUser', 'verifyConnect');

// Navigation
$router->addRoute('GET', BASE_URL . "home", 'ControllerUser', 'homePage');

//Users
$router->addRoute('GET', BASE_URL . "api/users", 'ControllerUser', 'listUsers');
$router->addRoute('GET', BASE_URL . "api/userInformations", 'ControllerUser', 'getUserInformations');

//Lessons
$router->addRoute('GET', BASE_URL . "api/lessons", 'ControllerLesson', 'getAllLessons');
$router->addRoute('GET', BASE_URL . "api/offre-de-cours/(?<slug>[a-zA-Z0-9\-]+)", 'ControllerLesson', 'getLessonByName');

//Events
$router->addRoute('GET', BASE_URL . "api/getEvents", 'ControllerEvent', 'getEvents');
