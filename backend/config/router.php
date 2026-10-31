<?php

// Niveaux d'accès (FLE-55 / FLE-56), vérifiés par ClassAccess dans public/index.php :
// public, auth (défaut si omis), admin, cron (en-tête Api-Key).

// Connexion
$router->addRoute("POST", "/api/login", "ControllerUser", "login", 'public');
// public : se déconnecter doit marcher même si la session PHP a déjà expiré.
$router->addRoute("POST", "/api/logout", "ControllerUser", "logout", 'public');
$router->addRoute("POST", "/api/register", "ControllerUser", "register", 'public');
$router->addRoute("POST", "/api/verifyConnect", "ControllerUser", "verifyConnect", 'public');

//Users
$router->addRoute("POST", "/api/userInformations", "ControllerUser", "getUserInformations", 'auth');
$router->addRoute("POST", "/api/updateUserProfile", "ControllerUser", "updateUserProfile", 'auth');
$router->addRoute("GET", "/api/verify-email/{token}", "ControllerUser", "verifyEmail", 'public');
$router->addRoute("POST", "/api/getWallet", "ControllerOrder", "getWallet", 'auth');
$router->addRoute("POST", "/api/updateUserPassword", "ControllerUser", "updateUserPassword", 'auth');
$router->addRoute("POST", "/api/forgetedPassword", "ControllerUser", "forgetedPassword", 'public');
$router->addRoute("GET", "/api/reset-password/{token}", "ControllerUser", "resetPasswordLink", 'public');
$router->addRoute("POST", "/api/resetPassword", "ControllerUser", "resetPassword", 'public');

//Lessons
$router->addRoute("GET", "/api/lessons", "ControllerLesson", "getAllLessons", 'public');
$router->addRoute("GET", "/api/offre-de-cours/{slug}/{locale}", "ControllerLesson", "getLessonByName", 'public');
$router->addRoute("POST", "/api/getAllLessonsWithPrices/{locale}", "ControllerLesson", "getAllLessonsWithPrices", 'public');
$router->addRoute("GET", "/api/getSlugs/{locale}", "ControllerLesson", "getSlugsByLocale", 'public');

//Events
$router->addRoute("POST", "/api/createEvent", "ControllerCalendar", "createEvent", 'auth');
$router->addRoute("POST", "/api/listEvents", "ControllerCalendar", "listEvents", 'auth');
$router->addRoute("POST", "/api/checkDeleteEvent", "ControllerCalendar", "checkDeleteEvent", 'auth');
$router->addRoute("POST", "/api/deleteEvent", "ControllerCalendar", "deleteEvent", 'auth');
$router->addRoute("POST", "/api/getAvailableTimeSlots", "ControllerCalendar", "getAvailablesTimeSlots", 'auth');
$router->addRoute("POST", "/api/sendMailToAlertForNextAppointment", "ControllerMail", "sendMailToAlertForNextAppointment", 'cron');
$router->addRoute("POST", "/api/prepareRepayment", "ControllerOrder", "prepareRepayment", 'auth');
$router->addRoute("POST", "/api/checkWaitingEvents", "ControllerCalendar", "checkWaitingEvents", 'cron');

//Google
$router->addRoute("POST", "/api/handleGoogleNotification", "ControllerGoogle", "handleGoogleNotification", 'public');
$router->addRoute("POST", "/api/setupGoogleWatch", "ControllerGoogle", "setupCalendarWatch", 'cron');

//Visio
$router->addRoute("POST", "/api/createInstantVisio", "ControllerVisio", "createInstantRoom", 'admin');

//Stripe
$router->addRoute("POST", "/api/checkout-session", "ControllerOrder", "checkout", 'auth');
$router->addRoute("POST", "/api/payment-status", "ControllerOrder", "status", 'public');

//admin
$router->addRoute("POST", "/api/getInvoices", "ControllerInvoice", "getInvoices", 'admin');
$router->addRoute("POST", "/api/setInvoiced", "ControllerInvoice", "setInvoiced", 'admin');

//packs
$router->addRoute("POST", "/api/orderPacks", "ControllerOrder", "orderPacks", 'auth');
