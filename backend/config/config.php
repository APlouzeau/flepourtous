<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define("CORS", getenv('CORS'));

define("DB_HOST", getenv('DB_HOST'));
define("DB_NAME", getenv('DB_NAME'));
define("DB_USER", getenv('DB_USER'));
define("DB_PSW", getenv('DB_PSW'));
define("DB_PORT", getenv('DB_PORT'));

define("GOOGLE_CALENDAR_ID", getenv('GOOGLE_CALENDAR_ID'));
define("GOOGLE_TOKEN", getenv('GOOGLE_TOKEN'));

define("VISIO_API_KEY", getenv('VISIO_API_KEY'));
define("URI", getenv('URI'));
define("URI_MAIL", getenv('URI_MAIL'));
define("URI_FRONT", getenv('URI_FRONT'));
define('URI_STRIPE', getenv('URI_STRIPE'));
define("COOKIE_DOMAIN", getenv('COOKIE_DOMAIN'));

define("CRON_KEY", getenv('CRON_KEY_PROD'));
define("JWT_KEY", getenv('JWT_KEY_PROD'));

define("MAIL_HOST", getenv('MAIL_HOST'));
define("MAIL_USERNAME", getenv('MAIL_USERNAME'));
define("MAIL_PASSWORD", getenv('MAIL_PASSWORD'));
define("MAIL_PORT", getenv('MAIL_PORT'));

define("TEACHER_MAIL", getenv('TEACHER_MAIL'));

define("STRIPE_SECRET_KEY", getenv('STRIPE_SECRET_KEY'));
