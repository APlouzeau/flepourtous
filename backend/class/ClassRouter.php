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
            $pattern = preg_replace('/\{[a-zA-Z0-9_]+\}/', '([a-zA-Z0-9_-]+)', $route['path']);
            if ($method === $route['method'] && preg_match("#^$pattern$#", $uri, $matches)) {
                array_shift($matches); // Remove the full match
                return [
                    'controller' => $route['controller'],
                    'action' => $route['action'],
                    'params' => $matches
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
