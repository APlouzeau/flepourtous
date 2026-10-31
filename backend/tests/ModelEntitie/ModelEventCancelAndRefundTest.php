<?php

use PHPUnit\Framework\TestCase;
use config\enum\AppointmentStatus;

/**
 * PLAN DE TEST - Annulation et remboursement en une transaction (FLE-56)
 *
 * Nécessite une base MariaDB (variables DB_* de l'environnement) ; ignoré sinon.
 * Les données de test sont créées puis supprimées par le test.
 * Cas testés :
 * - CT01 : annulation remboursée → statut changé, porte-monnaie recrédité une fois
 * - CT02 : deuxième annulation du même cours → refusée, porte-monnaie inchangé
 * - CT03 : annulation non remboursée → statut changé, porte-monnaie inchangé
 * - CT04 : cours dans un statut non annulable → rien ne change
 * - CT05 : utilisateur à rembourser introuvable → rien ne change (rollback du statut)
 */
class ModelEventCancelAndRefundTest extends TestCase
{
    private static ?PDO $pdo = null;
    private ModelEvent $modelEvent;
    private int $userId;
    private string $eventId;

    public static function setUpBeforeClass(): void
    {
        // ClassDatabase fait exit() si la base est injoignable : on teste avant avec PDO.
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

        $mail = 'test-cancel-' . bin2hex(random_bytes(4)) . '@example.invalid';
        $req = self::$pdo->prepare("INSERT INTO users (first_name, last_name, mail, nick_name, wallet) VALUES ('Test', 'Annulation', :mail, 'test', 10.00)");
        $req->execute([':mail' => $mail]);
        $this->userId = (int) self::$pdo->lastInsertId();

        $this->eventId = 'test-cancel-' . bin2hex(random_bytes(6));
        $req = self::$pdo->prepare("INSERT INTO events (id_event, user_id, duration, start_date_time, status) VALUES (:id, :user, 60, '2030-01-01 10:00:00', :status)");
        $req->execute([':id' => $this->eventId, ':user' => $this->userId, ':status' => AppointmentStatus::PAID->value]);
    }

    protected function tearDown(): void
    {
        if (self::$pdo !== null && isset($this->userId)) {
            // ON DELETE CASCADE supprime aussi l'événement
            self::$pdo->prepare('DELETE FROM users WHERE id_user = :id')->execute([':id' => $this->userId]);
        }
    }

    private function wallet(): string
    {
        $req = self::$pdo->prepare('SELECT wallet FROM users WHERE id_user = :id');
        $req->execute([':id' => $this->userId]);
        return $req->fetchColumn();
    }

    private function eventStatus(): string
    {
        $req = self::$pdo->prepare('SELECT status FROM events WHERE id_event = :id');
        $req->execute([':id' => $this->eventId]);
        return $req->fetchColumn();
    }

    private function cancel(string $newStatus, ?int $userId, float $amount): bool
    {
        return $this->modelEvent->cancelAndRefund(
            $this->eventId,
            $newStatus,
            [AppointmentStatus::PAID->value, AppointmentStatus::GOOGLE->value],
            $userId,
            $amount
        );
    }

    // CT01 + CT02
    public function testRefundHappensOnlyOnce(): void
    {
        $this->assertTrue($this->cancel(AppointmentStatus::CANCELLED_REFUNDED->value, $this->userId, 25.0));
        $this->assertSame('35.00', $this->wallet());
        $this->assertSame(AppointmentStatus::CANCELLED_REFUNDED->value, $this->eventStatus());

        $this->assertFalse($this->cancel(AppointmentStatus::CANCELLED_REFUNDED->value, $this->userId, 25.0));
        $this->assertFalse($this->cancel(AppointmentStatus::CANCELLED_ADMIN->value, $this->userId, 25.0));
        $this->assertSame('35.00', $this->wallet());
        $this->assertSame(AppointmentStatus::CANCELLED_REFUNDED->value, $this->eventStatus());
    }

    // CT03
    public function testNotRefundedCancellationKeepsWallet(): void
    {
        $this->assertTrue($this->cancel(AppointmentStatus::CANCELLED_NOT_REFUNDED->value, $this->userId, 0.0));
        $this->assertSame('10.00', $this->wallet());
        $this->assertSame(AppointmentStatus::CANCELLED_NOT_REFUNDED->value, $this->eventStatus());
    }

    // CT04
    public function testNonCancellableStatusChangesNothing(): void
    {
        self::$pdo->prepare('UPDATE events SET status = :s WHERE id_event = :id')
            ->execute([':s' => AppointmentStatus::PENDING->value, ':id' => $this->eventId]);

        $this->assertFalse($this->cancel(AppointmentStatus::CANCELLED_REFUNDED->value, $this->userId, 25.0));
        $this->assertSame('10.00', $this->wallet());
        $this->assertSame(AppointmentStatus::PENDING->value, $this->eventStatus());
    }

    // CT05
    public function testUnknownRefundUserRollsBackStatus(): void
    {
        $this->assertFalse($this->cancel(AppointmentStatus::CANCELLED_REFUNDED->value, 999999999, 25.0));
        $this->assertSame(AppointmentStatus::PAID->value, $this->eventStatus());
        $this->assertSame('10.00', $this->wallet());
    }
}
