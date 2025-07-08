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
$router->addRoute('POST', BASE_URL . "api/userInformations", 'ControllerUser', 'getUserInformations');
$router->addRoute('POST', BASE_URL . "api/updateUserProfile", 'ControllerUser', 'updateUserProfile');
$router->addRoute('GET', BASE_URL . "api/verify-email/{token}", 'ControllerUser', 'verifyEmail');
$router->addRoute('POST', BASE_URL . "api/getWallet", 'ControllerOrder', 'getWallet');
$router->addRoute('POST', BASE_URL . "api/updateUserProfile", 'ControllerUser', 'updateUserProfile');

//Lessons
$router->addRoute('GET', BASE_URL . "api/lessons", 'ControllerLesson', 'getAllLessons');
$router->addRoute('GET', BASE_URL . "api/offre-de-cours/{slug}", 'ControllerLesson', 'getLessonByName');
$router->addRoute('POST', BASE_URL . "api/getAllLessonsWithPrices", 'ControllerLesson', 'getAllLessonsWithPrices');

//Events
$router->addRoute('GET', BASE_URL . "api/listEvents", 'ControllerCalendar', 'listEvents');
$router->addRoute('POST', BASE_URL . "api/createEvent", 'ControllerCalendar', 'createEvent');
$router->addRoute('POST', BASE_URL . "api/listEvents", 'ControllerCalendar', 'listEvents');
$router->addRoute('POST', BASE_URL . "api/deleteEvent", 'ControllerCalendar', 'deleteEvent');
$router->addRoute('POST', BASE_URL . "api/getAvailableTimeSlots", 'ControllerCalendar', 'getAvailablesTimeSlots');
$router->addRoute('POST', BASE_URL . "api/sendMailToAlertForNextAppointment", 'ControllerMail', 'sendMailToAlertForNextAppointment');
$router->addRoute('POST', BASE_URL . "api/prepareRepayment", 'ControllerOrder', 'prepareRepayment');
$router->addRoute('POST', BASE_URL . "api/deleteWaitingEvent", 'ControllerCalendar', 'checkWaitingEvents');
$router->addRoute('GET', BASE_URL . "api/createInstantRoom", 'ControllerVisio', 'createInstantRoom');

//Google
$router->addRoute('POST', BASE_URL . "api/handleGoogleNotification", 'ControllerGoogle', 'handleGoogleNotification');
$router->addRoute('POST', BASE_URL . "api/setupGoogleWatch", 'ControllerGoogle', 'setupCalendarWatch');

//Visio
$router->addRoute('POST', BASE_URL . "api/createInstantVisio", 'ControllerVisio', 'createInstantRoom');

//Stripe
$router->addRoute('POST', BASE_URL . "api/checkout-session", 'ControllerOrder', 'checkout');
$router->addRoute('POST', BASE_URL . "api/payment-status", 'ControllerOrder', 'status');
$router->addRoute('POST', BASE_URL . "api/verify-payment", 'ControllerOrder', 'verifyPayment');


//debug
$router->addRoute('GET', BASE_URL . "api/debug", 'ControllerDebug', 'debug');
$router->addRoute('GET', BASE_URL . "api/debugBdd", 'ControllerDebug', 'debugBdd');
