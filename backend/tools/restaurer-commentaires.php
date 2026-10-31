<?php

/**
 * Restaure les commentaires d'élèves écrasés par le nom de l'élève (bug corrigé le 31/10).
 *
 * Une notification Google remplaçait la description d'un cours réservé dans l'app (le commentaire
 * de l'élève) par le titre de l'événement Google (« Prénom-Nom »). Le commentaire d'origine est
 * toujours dans la description Google, suivi de « Source:app » : on le recopie en base.
 *
 * Ne touche qu'aux cours dont la description en base est exactement le titre Google, et dont la
 * description Google contient « Source:app ».
 *
 * Sur le VPS, depuis la racine du projet :
 *   docker exec flepourtous-backend-prod php tools/restaurer-commentaires.php            liste, ne modifie rien
 *   scripts/db.sh backup prod                                                             sauvegarde avant d'écrire
 *   docker exec flepourtous-backend-prod php tools/restaurer-commentaires.php --apply    restaure
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

define('APP_PATH', __DIR__ . '/../');
require_once APP_PATH . 'vendor/autoload.php';
require_once APP_PATH . 'config/config.php';
require_once APP_PATH . 'class/ClassDatabase.php';

$apply = in_array('--apply', $argv, true);

$pdo = (new ClassDatabase())->conn;
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$client = new Google\Client();
$client->setAuthConfig(APP_PATH . 'config/service-account-key.json');
$client->addScope(Google\Service\Calendar::CALENDAR_READONLY);
$calendar = new Google\Service\Calendar($client);

// Cours réservés dans l'app : ceux qui ont un cours (id_lesson) ; les créneaux créés dans Google n'en ont pas.
$events = $pdo->query('SELECT id_event, user_id, start_date_time, description FROM events WHERE id_lesson IS NOT NULL ORDER BY start_date_time')->fetchAll();
$update = $pdo->prepare('UPDATE events SET description = :description WHERE id_event = :id AND description = :current');

$toFix = 0;
$fixed = 0;
foreach ($events as $e) {
    try {
        $g = $calendar->events->get(GOOGLE_CALENDAR_ID, $e['id_event']);
    } catch (Google\Service\Exception $ex) {
        continue; // absent de Google : rien pour retrouver le commentaire
    }
    $googleDescription = $g->getDescription() ?? '';
    if (strpos($googleDescription, 'Source:app') === false) {
        continue;
    }
    $summary = $g->getSummary() ?? '';
    // Description Google = commentaire + "\n\nSource:app" (ControllerCalendar::createEvent)
    $comment = preg_replace('/\s*Source:app\s*$/', '', $googleDescription);
    if ($e['description'] !== $summary || $comment === $summary) {
        continue;
    }

    $toFix++;
    printf(
        "- %s (élève #%d, cours du %s UTC) : « %s » → « %s »\n",
        $e['id_event'],
        $e['user_id'],
        $e['start_date_time'],
        $e['description'],
        mb_strimwidth(str_replace("\n", ' ', $comment), 0, 80, '…')
    );
    if ($apply) {
        // Condition sur la valeur actuelle : si quelqu'un a modifié le cours entre-temps, on n'écrase rien.
        $update->execute([':description' => $comment, ':id' => $e['id_event'], ':current' => $e['description']]);
        $fixed += $update->rowCount();
    }
}

echo "\n$toFix commentaire(s) à restaurer.";
echo $apply ? " $fixed restauré(s).\n" : " Rien n'a été modifié (relancer avec --apply après « scripts/db.sh backup <env> »).\n";
