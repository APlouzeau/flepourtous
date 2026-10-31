<?php

/**
 * Contrôle d'accès des routes (FLE-56).
 *
 * Chaque route déclare son niveau dans config/router.php ; index.php appelle
 * check() avant le contrôleur. La fonction ne fait ni echo ni exit() : elle
 * renvoie le code HTTP à appliquer, ce qui permet de la tester avec PHPUnit.
 *
 * Niveaux :
 * - public : aucune vérification ;
 * - auth   : utilisateur connecté (élève ou admin) ;
 * - admin  : utilisateur connecté avec le rôle admin ;
 * - cron   : en-tête Api-Key égal à CRON_KEY (refusé si CRON_KEY est vide).
 *
 * Codes renvoyés :
 * - 200 : accès autorisé ;
 * - 401 : pas connecté, ou clé cron absente / fausse ;
 * - 403 : connecté mais pas le droit (élève sur une route admin),
 *         ou niveau inconnu (faute de frappe dans router.php : on ferme).
 */
class ClassAccess
{
    public const LEVELS = ['public', 'auth', 'admin', 'cron'];

    /**
     * @param string       $access  niveau déclaré sur la route
     * @param array        $session contenu de $_SESSION
     * @param array        $server  contenu de $_SERVER (pour l'en-tête Api-Key)
     * @param string|false $cronKey valeur de CRON_KEY (false si la variable n'existe pas)
     */
    public static function check(string $access, array $session, array $server, string|false $cronKey): int
    {
        return match ($access) {
            'public' => 200,
            'auth' => self::isConnected($session) ? 200 : 401,
            'admin' => !self::isConnected($session) ? 401 : (self::isAdmin($session) ? 200 : 403),
            'cron' => self::isValidCronKey($server, $cronKey) ? 200 : 401,
            default => 403,
        };
    }

    private static function isConnected(array $session): bool
    {
        return !empty($session['idUser']);
    }

    private static function isAdmin(array $session): bool
    {
        return ($session['role'] ?? null) === 'admin';
    }

    private static function isValidCronKey(array $server, string|false $cronKey): bool
    {
        // Clé absente ou vide côté serveur : on refuse tout, sinon un en-tête
        // Api-Key vide passerait la comparaison.
        if (!is_string($cronKey) || $cronKey === '') {
            return false;
        }
        $givenKey = $server['HTTP_API_KEY'] ?? '';

        return is_string($givenKey) && hash_equals($cronKey, $givenKey);
    }
}
