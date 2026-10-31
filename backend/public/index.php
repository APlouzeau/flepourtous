<?php

define("APP_PATH", __DIR__ . "/../");
define("BASE_URL", "/");

require_once __DIR__ . '/../vendor/autoload.php';
// En preprod et prod, les variables viennent de l'env_file de Docker : le .env n'est plus copié
// dans l'image (.dockerignore). safeLoad() lit backend/.env s'il existe (local), sans erreur sinon.
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

require_once APP_PATH . "config/config.php";

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [CORS];


if ($origin && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


session_name(SESSION_NAME);
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => COOKIE_DOMAIN,
    'secure' => SESSION_COOKIE_SECURE, // true partout, sauf SESSION_COOKIE_SECURE=false en local
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

spl_autoload_register(function ($class_name) {
    try {
        if (!preg_match("/^(Class|Controller|Model|Entitie)/", $class_name, $match)) {
            return;
        }
        $dir = match ($match[0]) {
            'Class' => APP_PATH . "/class",
            'Controller' => APP_PATH . "/controller",
            'Model' => APP_PATH . "/model",
            'Entitie' => APP_PATH . "/model"
        };
        if (file_exists($dir . '/' . $class_name . '.php')) {
            require_once $dir . '/' . $class_name . '.php';
        } else {
            throw new Exception("Class not found => " . $class_name, 1);
        }
    } catch (\Throwable $th) {
        error_log("Autoload impossible pour " . $class_name . " : " . $th->getMessage());
    }
});

$router = new ClassRouter();
require_once APP_PATH . "config/router.php";

//routes connection

//redirection
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$handler = $router->getHandler($method, $uri);

// Contrôle d'accès centralisé (FLE-56) : le niveau est déclaré sur la route
// dans config/router.php, une route sans niveau est 'auth' par défaut.
$accessStatus = ClassAccess::check($handler['access'], $_SESSION, $_SERVER, CRON_KEY);
if ($accessStatus !== 200) {
    if (!in_array($handler['access'], ClassAccess::LEVELS, true)) {
        error_log("Niveau d'accès inconnu '" . $handler['access'] . "' pour $method $uri");
    }
    http_response_code($accessStatus);
    header('Content-Type: application/json');
    echo json_encode([
        'code' => 0,
        'message' => $accessStatus === 401 ? 'Utilisateur non connecté' : 'Utilisateur non autorisé'
    ]);
    exit();
}

if (!class_exists($handler['controller']) || $handler['controller'] == 'ControllerError') {
    $controller = new ControllerError();
    $controller->index($handler, $method, $uri);
} else {
    $controller = new $handler['controller']();
    if (!method_exists($controller, $handler['action'])) {
        $controller = new ControllerError();
        $controller->index($handler, $method, $uri);
    } else {

        $actionParams = [];
        $reflectionMethod = new ReflectionMethod($handler['controller'], $handler['action']);
        $methodParameters = $reflectionMethod->getParameters();

        foreach ($methodParameters as $reflectionParameter) {
            $paramName = $reflectionParameter->getName();
            if (isset($handler['params'][$paramName])) {
                $actionParams[] = $handler['params'][$paramName];
            } elseif ($reflectionParameter->isDefaultValueAvailable()) {
                $actionParams[] = $reflectionParameter->getDefaultValue();
            } else {

                $actionParams[] = null;
            }
        }

        call_user_func_array([$controller, $handler['action']], $actionParams);
    }
}
