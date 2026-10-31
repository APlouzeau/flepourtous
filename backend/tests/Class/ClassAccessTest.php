<?php

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * PLAN DE TEST - Contrôle d'accès centralisé (FLE-56)
 *
 * Objectif : aucune route n'est accessible au-delà de son niveau.
 * Les routes sont lues dans config/router.php, comme en production.
 * Cas testés :
 * - CT01 : chaque route déclare un niveau connu (public, auth, admin, cron)
 * - CT02 : échantillon de routes, pour chaque profil : sans session, élève, admin, cron
 * - CT03 : clé cron vide ou absente côté serveur → tout est refusé, même un en-tête vide
 * - CT04 : niveau inconnu (faute de frappe) → refusé
 * - CT05 : route inconnue → 'public' pour pouvoir renvoyer la 404 de ControllerError
 */
class ClassAccessTest extends TestCase
{
    private const CRON_KEY = 'cle-de-test';

    private const NO_SESSION = [];
    private const STUDENT = ['idUser' => 12, 'role' => 'user'];
    private const ADMIN = ['idUser' => 1, 'role' => 'admin'];

    private static ClassRouter $router;

    public static function setUpBeforeClass(): void
    {
        if (!defined('BASE_URL')) {
            define('BASE_URL', '/');
        }
        $router = new ClassRouter();
        require APP_PATH . 'config/router.php';
        self::$router = $router;
    }

    private static function statusFor(string $method, string $uri, array $session, array $server = []): int
    {
        $handler = self::$router->getHandler($method, $uri);

        return ClassAccess::check($handler['access'], $session, $server, self::CRON_KEY);
    }

    // CT01
    public function testEveryRouteHasAKnownAccessLevel(): void
    {
        $routes = self::$router->getRoutes();
        $this->assertNotEmpty($routes);

        foreach ($routes as $route) {
            $this->assertContains(
                $route['access'],
                ClassAccess::LEVELS,
                "{$route['method']} {$route['path']} a un niveau inconnu"
            );
        }
    }

    // CT02 : [méthode, uri, sans session, élève, admin]
    public static function sampleRoutes(): array
    {
        return [
            'public login' => ['POST', '/api/login', 200, 200, 200],
            'public offre (paramètres)' => ['GET', '/api/offre-de-cours/francais-general/fr', 200, 200, 200],
            'public payment-status' => ['POST', '/api/payment-status', 200, 200, 200],
            'auth userInformations' => ['POST', '/api/userInformations', 401, 200, 200],
            'auth createEvent' => ['POST', '/api/createEvent', 401, 200, 200],
            'auth deleteEvent' => ['POST', '/api/deleteEvent', 401, 200, 200],
            'admin getInvoices' => ['POST', '/api/getInvoices', 401, 403, 200],
            'admin setInvoiced' => ['POST', '/api/setInvoiced', 401, 403, 200],
            'admin createInstantVisio' => ['POST', '/api/createInstantVisio', 401, 403, 200],
            // Une session, même admin, ne remplace pas la clé cron.
            'cron checkWaitingEvents' => ['POST', '/api/checkWaitingEvents', 401, 401, 401],
            'cron sendMailToAlert' => ['POST', '/api/sendMailToAlertForNextAppointment', 401, 401, 401],
            'cron setupGoogleWatch' => ['POST', '/api/setupGoogleWatch', 401, 401, 401],
        ];
    }

    #[DataProvider('sampleRoutes')]
    public function testSampleRoutesBySession(string $method, string $uri, int $noSession, int $student, int $admin): void
    {
        $this->assertSame($noSession, self::statusFor($method, $uri, self::NO_SESSION), 'sans session');
        $this->assertSame($student, self::statusFor($method, $uri, self::STUDENT), 'élève');
        $this->assertSame($admin, self::statusFor($method, $uri, self::ADMIN), 'admin');
    }

    public function testCronRoutesAcceptTheRightKeyOnly(): void
    {
        $uri = '/api/checkWaitingEvents';
        $this->assertSame(200, self::statusFor('POST', $uri, [], ['HTTP_API_KEY' => self::CRON_KEY]));
        $this->assertSame(401, self::statusFor('POST', $uri, [], ['HTTP_API_KEY' => 'mauvaise-cle']));
        $this->assertSame(401, self::statusFor('POST', $uri, [], ['HTTP_API_KEY' => '']));
        $this->assertSame(401, self::statusFor('POST', $uri, [], ['HTTP_API_KEY' => ['tableau']]));
    }

    // CT03
    public function testEmptyOrMissingServerCronKeyRefusesEverything(): void
    {
        foreach (['', false] as $serverKey) {
            $this->assertSame(401, ClassAccess::check('cron', [], ['HTTP_API_KEY' => ''], $serverKey));
            $this->assertSame(401, ClassAccess::check('cron', [], [], $serverKey));
        }
    }

    // CT04
    public function testUnknownLevelIsRefused(): void
    {
        $this->assertSame(403, ClassAccess::check('Admin', self::ADMIN, [], self::CRON_KEY));
        $this->assertSame(403, ClassAccess::check('', self::ADMIN, [], self::CRON_KEY));
    }

    public function testRouteWithoutDeclaredLevelIsAuth(): void
    {
        $router = new ClassRouter();
        $router->addRoute('POST', '/api/oubli', 'ControllerUser', 'oubli');

        $this->assertSame('auth', $router->getHandler('POST', '/api/oubli')['access']);
    }

    public function testSessionWithEmptyIdUserIsNotConnected(): void
    {
        $this->assertSame(401, ClassAccess::check('auth', ['idUser' => '', 'role' => 'admin'], [], self::CRON_KEY));
        $this->assertSame(401, ClassAccess::check('admin', ['idUser' => 0, 'role' => 'admin'], [], self::CRON_KEY));
    }

    // CT05
    public function testUnknownRouteIsPublicSoThe404IsReturned(): void
    {
        $this->assertSame(200, self::statusFor('POST', '/api/nexistepas', self::NO_SESSION));
        // Ancienne route supprimée (audit FLE-55)
        $this->assertSame('ControllerError', self::$router->getHandler('GET', '/')['controller']);
    }
}
