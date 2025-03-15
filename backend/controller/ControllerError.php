<?php

class ControllerError
{

    public function index($handler, $method, $uri)
    {
        echo "error";
        var_dump($handler);
        var_dump($method);
        var_dump($uri);
    }
}
