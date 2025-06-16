<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

error_log(print_r($_COOKIE, true));
error_log(print_r($_SESSION, true));

define("DB_HOST", "");
define("DB_NAME", "");
define("DB_USER", "");
define("DB_PSW", "");

define("GOOGLE_CALENDAR_ID", "");
define("GOOGLE_TOKEN", "");

define("VISIO_API_KEY", "");
define("URI", "http://localhost/"); // URI de l'application

define("CRON_KEY", "");
/* define("JWT_KEY", "!MDPdemerde!1942"); */
define("MAIL_HOST", "");
define("MAIL_USERNAME", "");
define("MAIL_PASSWORD", "");
define("MAIL_PORT", 465);

define("TEACHER_MAIL", "");

define("STRIPE_SECRET_KEY", "");
http://pma.localhost/index.php?route=/server/sql