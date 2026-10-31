<?php

/**
 * Vérifications en LECTURE SEULE sur l'argent des élèves (FLE-56, FLE-99).
 * Ne modifie rien : uniquement des SELECT et des lectures Google Calendar.
 *
 * Sur le VPS, depuis la racine du projet :
 *   docker exec flepourtous-backend-prod php tools/verifier-paiements.php google
 *   docker exec flepourtous-backend-prod php tools/verifier-paiements.php wallets
 *
 * google  : cours « Payé » en base dont l'événement Google est annulé ou introuvable.
 *           Avant le correctif de markGoogleEventAsCancelled (31/10), une suppression dans
 *           Google plantait : l'élève n'était pas recrédité et le cours restait « Payé ».
 * wallets : porte-monnaie non nuls, avec ce que la base sait de leurs mouvements
 *           (paiements Stripe enregistrés depuis le 30/10, cours annulés recrédités),
 *           à rapprocher de l'export des paiements Stripe.
 *
 * Le dossier tools/ n'est pas servi par Apache (DocumentRoot = public/).
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

define('APP_PATH', __DIR__ . '/../');
require_once APP_PATH . 'vendor/autoload.php';
require_once APP_PATH . 'config/config.php';
spl_autoload_register(function ($class) {
    foreach (['Class' => 'class', 'Controller' => 'controller', 'Model' => 'model', 'Entitie' => 'model'] as $prefix => $dir) {
        if (strpos($class, $prefix) === 0 && file_exists(APP_PATH . "$dir/$class.php")) {
            require_once APP_PATH . "$dir/$class.php";
            return;
        }
    }
});

use config\enum\AppointmentStatus;

$action = $argv[1] ?? '';
if (!in_array($action, ['google', 'wallets'], true)) {
    fwrite(STDERR, "Usage : php tools/verifier-paiements.php <google|wallets>\n");
    exit(2);
}

$pdo = (new ClassDatabase())->conn;
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

function price_of(PDO $pdo, string $idEvent): ?string
{
    $req = $pdo->prepare('SELECT p.price FROM events e
        JOIN lesson_prices lp ON lp.id_lesson = e.id_lesson
        JOIN durations d ON d.id_duration = lp.id_duration AND d.duration = e.duration
        JOIN prices p ON p.id_price = lp.id_price
        WHERE e.id_event = :id LIMIT 1');
    $req->execute([':id' => $idEvent]);
    $price = $req->fetchColumn();
    return $price === false ? null : $price;
}

if ($action === 'google') {
    $req = $pdo->prepare('SELECT e.id_event, e.start_date_time, e.timezone, u.id_user, u.first_name, u.last_name
        FROM events e JOIN users u ON u.id_user = e.user_id
        WHERE e.status = :paid ORDER BY e.start_date_time');
    $req->execute([':paid' => AppointmentStatus::PAID->value]);
    $events = $req->fetchAll();

    $client = new Google\Client();
    $client->setAuthConfig(APP_PATH . 'config/service-account-key.json');
    $client->addScope(Google\Service\Calendar::CALENDAR_READONLY);
    $calendar = new Google\Service\Calendar($client);

    $found = 0;
    echo count($events) . " cours « Payé » en base. Cours annulés ou absents dans Google :\n";
    foreach ($events as $e) {
        $problem = null;
        try {
            $g = $calendar->events->get(GOOGLE_CALENDAR_ID, $e['id_event']);
            if ($g->getStatus() === 'cancelled') {
                $problem = 'annulé dans Google';
            }
        } catch (Google\Service\Exception $ex) {
            if (in_array($ex->getCode(), [404, 410], true)) {
                $problem = 'introuvable dans Google';
            } else {
                $problem = 'erreur Google ' . $ex->getCode() . ' (à vérifier à la main)';
            }
        }
        if ($problem !== null) {
            $found++;
            printf(
                "- %s | élève #%d %s %s | cours du %s UTC (%s) | prix %s € | %s\n",
                $e['id_event'],
                $e['id_user'],
                $e['first_name'],
                $e['last_name'],
                $e['start_date_time'],
                $e['timezone'],
                price_of($pdo, $e['id_event']) ?? '?',
                $problem
            );
        }
    }
    echo $found === 0 ? "Aucun.\n" : "$found cours à vérifier avec Ludivine avant de recréditer quoi que ce soit.\n";
    exit(0);
}

// wallets
$users = $pdo->query('SELECT id_user, first_name, last_name, wallet FROM users WHERE wallet <> 0 ORDER BY wallet DESC')->fetchAll();
$stripe = $pdo->prepare('SELECT outcome, COUNT(*) AS n, SUM(amount) AS total FROM stripe_payments WHERE user_id = :u GROUP BY outcome');
$refunded = $pdo->prepare('SELECT id_event FROM events WHERE user_id = :u AND status IN (:r1, :r2, :r3)');

printf("%d porte-monnaie non nuls.\n", count($users));
foreach ($users as $u) {
    printf("\nÉlève #%d %s %s : solde %s €\n", $u['id_user'], $u['first_name'], $u['last_name'], $u['wallet']);

    $stripe->execute([':u' => $u['id_user']]);
    $rows = $stripe->fetchAll();
    if (!$rows) {
        echo "  Paiements Stripe enregistrés (depuis le 30/10) : aucun\n";
    }
    foreach ($rows as $r) {
        printf("  Stripe %s : %d paiement(s), %s €\n", $r['outcome'], $r['n'], $r['total']);
    }

    $refunded->execute([
        ':u' => $u['id_user'],
        ':r1' => AppointmentStatus::CANCELLED_REFUNDED->value,
        ':r2' => AppointmentStatus::CANCELLED_ADMIN->value,
        ':r3' => AppointmentStatus::CANCELLED_GOOGLE_REFUNDED->value,
    ]);
    $ids = array_column($refunded->fetchAll(), 'id_event');
    $sum = 0.0;
    foreach ($ids as $id) {
        $sum += (float) (price_of($pdo, $id) ?? 0);
    }
    printf("  Cours annulés recrédités : %d, %.2f € au tarif actuel\n", count($ids), $sum);
}
echo "\nLa base ne garde pas l'historique des mouvements du porte-monnaie : un solde ne se vérifie\n"
    . "qu'en le rapprochant de l'export Stripe (achats de packs, paiements) et des cours ci-dessus.\n";
