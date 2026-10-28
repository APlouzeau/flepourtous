<?php

// Connexion
$router->addRoute("GET", BASE_URL, "ControllerUser", "loginPage", 'public');
$router->addRoute("POST", "/api/login", "ControllerUser", "login", 'public');
$router->addRoute("POST", "/api/logout", "ControllerUser", "logout", 'auth');
$router->addRoute("POST", "/api/register", "ControllerUser", "register", 'public');
$router->addRoute("POST", "/api/verifyConnect", "ControllerUser", "verifyConnect", 'auth');

//Users
$router->addRoute("GET", "/api/users", "ControllerUser", "listUsers", 'admin');
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
$router->addRoute("POST", "/api/sendMailToAlertForNextAppointment", "ControllerMail", "sendMailToAlertForNextAppointment", 'auth');
$router->addRoute("POST", "/api/prepareRepayment", "ControllerOrder", "prepareRepayment", 'auth');
$router->addRoute("POST", "/api/checkWaitingEvents", "ControllerCalendar", "checkWaitingEvents", 'cron');

//Google
$router->addRoute("POST", "/api/handleGoogleNotification", "ControllerGoogle", "handleGoogleNotification", 'cron');
$router->addRoute("POST", "/api/setupGoogleWatch", "ControllerGoogle", "setupCalendarWatch", 'cron');

//Visio
$router->addRoute("POST", "/api/createInstantVisio", "ControllerVisio", "createInstantRoom", 'admin');

//Stripe
$router->addRoute("POST", "/api/checkout-session", "ControllerOrder", "checkout", 'auth');
$router->addRoute("POST", "/api/payment-status", "ControllerOrder", "status", 'auth');

//admin
$router->addRoute("POST", "/api/getInvoices", "ControllerInvoice", "getInvoices", 'admin');
$router->addRoute("POST", "/api/setInvoiced", "ControllerInvoice", "setInvoiced", 'admin');

//packs
$router->addRoute("POST", "/api/orderPacks", "ControllerOrder", "orderPacks", 'auth');
