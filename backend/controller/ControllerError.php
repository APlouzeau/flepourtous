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

    public function validateData($data, string $errorMessage, int $httpCode = 400)
    {
        if (empty($data)) {
            http_response_code($httpCode);
            $response = [
                'code' => 0,
                'message' => $errorMessage
            ];
            echo json_encode($response);
            return false;
        }
        return true;
    }

    public function unauthorizedResponse(string $message = 'Unauthorized')
    {
        http_response_code(401);
        echo json_encode([
            'code' => 0,
            'error' => $message
        ]);
    }

    public function serverErrorResponse(string $message = 'Erreur serveur')
    {
        http_response_code(500);
        echo json_encode([
            'code' => 0,
            'message' => $message
        ]);
    }

    public function successResponse($data, string $message = 'Succès')
    {
        echo json_encode([
            'code' => 1,
            'message' => $message,
            'data' => $data
        ]);
    }
}
