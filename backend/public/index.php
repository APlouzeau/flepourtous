<?php

session_start();

// --- CHARGEMENT DES VARIABLES D'ENVIRONNEMENT ---
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
// --- FIN DU CHARGEMENT ---

// --- GESTION DES CORS ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
define("APP_PATH", __DIR__ . "/../");
define("BASE_URL", "/");

require_once APP_PATH . "config/config.php";

spl_autoload_register(function ($class_name) {
    try {
        preg_match("/^(Class|Controller|Model|Entitie)/", $class_name, $match);
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
        };
    } catch (\Throwable $th) {
        var_dump($th, $class_name);
    }
});

$router = new ClassRouter();
require_once APP_PATH . "config/router.php";

//routes connection

//redirection
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$handler = $router->getHandler($method, $uri);
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
