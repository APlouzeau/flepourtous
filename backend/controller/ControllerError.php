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
            'message' => $message
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

    public function debug(string $text, $data = null)
    {
    $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);

    if (is_array($data)) {
        error_log($text);
        foreach ($data as $key => $value) {
            error_log($key . ' => ' . print_r($value, true));
        }
    } else {
        error_log($text . print_r($data, true));
    }

    foreach ($trace as $frame) {
        if (basename($frame['file']) !== 'index.php') {
            error_log('Appel depuis : ' . $frame['file']);
            error_log('Ligne ' . $frame['line']);
            break;
            }
        }
    }

    public function logs(string $title, array $messages, string $file)
    {
        $logFile = APP_PATH . '/../logs/' . $file . '.log';
        $logDir = dirname($logFile);

        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }

        $timestamp = date('Y-m-d H:i:s');
        
        $logContent = "[{$timestamp}] {$title}\n";
        foreach ($messages as $message) {
            $logContent .= "  - {$message}\n";
        }
        $logContent .= "\n";

        file_put_contents($logFile, $logContent, FILE_APPEND | LOCK_EX);
    }
}