<?php
try {
    $pdo = new PDO('mysql:host=135.125.106.184;dbname=flepourtous-preprod', 'flepourtous-preprod', 'BWG_Char6x9/@t5[');
    echo 'OK';
} catch (PDOException $e) {
    echo $e->getMessage();
}

