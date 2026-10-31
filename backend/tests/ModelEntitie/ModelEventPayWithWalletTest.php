<?php

use PHPUnit\Framework\TestCase;
use config\enum\AppointmentStatus;

/**
 * PLAN DE TEST - Paiement d'un cours avec le porte-monnaie, en une transaction
 *
 * Nécessite une base MariaDB (variables DB_* de l'environnement) ; ignoré sinon.
 * Cas testés :
 * - CT01 : solde suffisant → cours « Payé », porte-monnaie débité
 * - CT02 : solde insuffisant → rien ne change (ni statut, ni solde)
 * - CT03 : solde dépensé pendant un paiement carte → la fin du paiement ne passe pas le cours
 *          en « Payé » (avant : solde forcé à 0, cours obtenu pour la seule part carte)
 * - CT04 : cours d'un autre élève ou plus en attente → refusé
 * - CT05 : part porte-monnaie nulle (tout payé par carte) → « Payé », solde inchangé
 */
class ModelEventPayWithWalletTest extends TestCase
{
    private static ?PDO $pdo = null;
    private ModelEvent $modelEvent;
    private array $users = [];

    public static function setUpBeforeClass(): void
    {
        try {
            self::$pdo = new PDO('mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME, DB_USER, DB_PSW);
        } catch (Throwable $e) {
            self::$pdo = null;
        }
    }

    protected function setUp(): void
    {
        if (self::$pdo === null) {
            $this->markTestSkipped('Base de données injoignable (variables DB_*)');
        }
        $this->modelEvent = new ModelEvent();
    }

    protected function tearDown(): void
    {
        foreach ($this->users as $id) {
            self::$pdo->prepare('DELETE FROM users WHERE id_user = :id')->execute([':id' => $id]);
        }
    }

    private function user(string $wallet): int
    {
        $req = self::$pdo->prepare("INSERT INTO users (first_name, last_name, mail, nick_name, wallet) VALUES ('Test', 'Paiement', :mail, 'test', :wallet)");
        $req->execute([':mail' => 'test-pay-' . bin2hex(random_bytes(4)) . '@example.invalid', ':wallet' => $wallet]);
        $id = (int) self::$pdo->lastInsertId();
        $this->users[] = $id;
        return $id;
    }

    private function event(int $userId, string $status = 'En attente'): string
    {
        $id = 'test-pay-' . bin2hex(random_bytes(6));
        self::$pdo->prepare("INSERT INTO events (id_event, user_id, duration, start_date_time, status) VALUES (:id, :user, 60, '2030-01-01 10:00:00', :status)")
            ->execute([':id' => $id, ':user' => $userId, ':status' => $status]);
        return $id;
    }

    private function wallet(int $userId): string
    {
        $req = self::$pdo->prepare('SELECT wallet FROM users WHERE id_user = :id');
        $req->execute([':id' => $userId]);
        return $req->fetchColumn();
    }

    private function eventStatus(string $eventId): string
    {
        $req = self::$pdo->prepare('SELECT status FROM events WHERE id_event = :id');
        $req->execute([':id' => $eventId]);
        return $req->fetchColumn();
    }

    // CT01
    public function testEnoughWalletPays(): void
    {
        $u = $this->user('30.00');
        $e = $this->event($u);
        $this->assertSame(ModelEvent::PAY_OK, $this->modelEvent->payWithWallet($e, $u, 22.0));
        $this->assertSame('8.00', $this->wallet($u));
        $this->assertSame(AppointmentStatus::PAID->value, $this->eventStatus($e));
    }

    // CT02
    public function testInsufficientWalletChangesNothing(): void
    {
        $u = $this->user('21.99');
        $e = $this->event($u);
        $this->assertSame(ModelEvent::PAY_INSUFFICIENT_WALLET, $this->modelEvent->payWithWallet($e, $u, 22.0));
        $this->assertSame('21.99', $this->wallet($u));
        $this->assertSame(AppointmentStatus::PENDING->value, $this->eventStatus($e));
    }

    // CT03 : 20 € sur le porte-monnaie, cours A à 22 € (2 € par carte), cours B à 20 € payé
    // avec le porte-monnaie pendant le paiement carte de A.
    public function testWalletSpentDuringCardPaymentDoesNotPaySecondLesson(): void
    {
        $u = $this->user('20.00');
        $a = $this->event($u);
        $b = $this->event($u);

        $this->assertSame(ModelEvent::PAY_OK, $this->modelEvent->payWithWallet($b, $u, 20.0));
        // Retour du paiement carte de A : part porte-monnaie attendue 20 €
        $this->assertSame(ModelEvent::PAY_INSUFFICIENT_WALLET, $this->modelEvent->payWithWallet($a, $u, 20.0));

        $this->assertSame(AppointmentStatus::PENDING->value, $this->eventStatus($a));
        $this->assertSame('0.00', $this->wallet($u));
    }

    // CT04
    public function testOtherUserOrNotPendingIsRefused(): void
    {
        $owner = $this->user('50.00');
        $other = $this->user('50.00');
        $e = $this->event($owner);
        $this->assertSame(ModelEvent::PAY_NOT_PENDING, $this->modelEvent->payWithWallet($e, $other, 22.0));
        $this->assertSame('50.00', $this->wallet($other));

        $cancelled = $this->event($owner, AppointmentStatus::CANCELLED_UNPAID->value);
        $this->assertSame(ModelEvent::PAY_NOT_PENDING, $this->modelEvent->payWithWallet($cancelled, $owner, 22.0));
        $this->assertSame('50.00', $this->wallet($owner));
    }

    // CT05
    public function testZeroWalletPartOnlyMarksPaid(): void
    {
        $u = $this->user('0.00');
        $e = $this->event($u);
        $this->assertSame(ModelEvent::PAY_OK, $this->modelEvent->payWithWallet($e, $u, 0.0));
        $this->assertSame('0.00', $this->wallet($u));
        $this->assertSame(AppointmentStatus::PAID->value, $this->eventStatus($e));
    }
}
