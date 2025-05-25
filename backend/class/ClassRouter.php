<?php

class ClassRouter
{

    private $routes;

    public function __construct()
    {
        $this->routes = [];
    }

    public function addRoute($method, $path, $controller, $action)
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'controller' => $controller,
            'action' => $action
        ];
    }

    public function getHandler($method, $uri)
    {
        foreach ($this->routes as $route) {
            $paramNames = [];

            $pattern = preg_replace_callback(
                '/\{([a-zA-Z0-9_]+)\}/', // Capture le nom du placeholder dans $match[1]
                function ($match) use (&$paramNames) {
                    $paramNames[] = $match[1]; // Stocke le nom du paramètre (ex: 'token')
                    return '([a-zA-Z0-9_-]+)';    // Le pattern de capture regex
                },
                $route['path']
            );

            if ($method === $route['method'] && preg_match("#^$pattern$#", $uri, $matches)) {
                array_shift($matches);

                $params = [];
                if (!empty($paramNames) && count($paramNames) === count($matches)) {

                    $params = array_combine($paramNames, $matches);
                } elseif (empty($paramNames) && !empty($matches)) {
                }


                return [
                    'controller' => $route['controller'],
                    'action' => $route['action'],
                    'params' => $params
                ];
            }
        }
        return ['controller' => 'ControllerError', 'action' => 'index', 'params' => []];
    }

    public function getRoutes()
    {
        return $this->routes;
    }
}
