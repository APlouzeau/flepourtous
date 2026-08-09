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

    public function debug(string $text, $data = null): void
    {
        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
        $stderr = fopen('php://stderr', 'w');

        fwrite($stderr, "\n========== DEBUG ==========\n");
        fwrite($stderr, $text . "\n");

        if (is_array($data)) {
            foreach ($data as $key => $value) {
                fwrite($stderr, "  $key => " . print_r($value, true) . "\n");
            }
        } else {
            fwrite($stderr, print_r($data, true) . "\n");
        }

        foreach ($trace as $frame) {
            if (isset($frame['file']) && basename($frame['file']) !== 'index.php') {
                fwrite($stderr, "Appel depuis : " . $frame['file'] . "\n");
                fwrite($stderr, "Ligne : " . $frame['line'] . "\n");
                break;
            }
        }

        fwrite($stderr, "===========================\n");
        fclose($stderr);
    }

    public function logs(string $title, array $messages, string $file)
    {
        $logFile = APP_PATH . '/logs/' . $file . '.log';
        $logDir = dirname($logFile);

        if (!is_dir($logDir)) {
            @mkdir($logDir, 0755, true);
        }

        $timestamp = date('Y-m-d H:i:s');

        $logContent = "[{$timestamp}] {$title}\n";
        foreach ($messages as $message) {
            $logContent .= "  - {$message}\n";
        }
        $logContent .= "\n";

        @file_put_contents($logFile, $logContent, FILE_APPEND);
    }
}
