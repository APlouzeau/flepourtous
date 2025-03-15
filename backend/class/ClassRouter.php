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
        $routeFinded = array_filter($this->routes, function ($route) use ($method, $uri) {
            return $route['method'] == $method && $route['path'] === $uri;
        });
        return current($routeFinded);
    }

    public function getRoutes()
    {
        return $this->routes;
    }
}
