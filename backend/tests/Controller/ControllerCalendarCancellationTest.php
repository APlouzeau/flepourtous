<?php

use PHPUnit\Framework\TestCase;

/**
 * PLAN DE TEST - Règle d'annulation d'un cours (FLE-56)
 *
 * Objectif : le remboursement est décidé par le serveur, pas par le code envoyé par le navigateur.
 * Cas testés :
 * - CT01 : élève, plus de 24 h avant → 1 (recrédité), quel que soit le code envoyé
 * - CT02 : élève, moins de 24 h avant → 2 (séance due), même s'il envoie 1 ou 3
 * - CT03 : élève, cours déjà commencé ou passé → 2
 * - CT04 : admin qui demande 3 → 3, même à moins de 24 h
 * - CT05 : admin sans demande d'annulation admin → règle des 24 h
 * - CT06 : la date stockée est lue en UTC, indépendamment du fuseau par défaut de PHP
 */
class ControllerCalendarCancellationTest extends TestCase
{
    private DateTimeImmutable $now;

    protected function setUp(): void
    {
        $this->now = new DateTimeImmutable('2026-11-02 10:00:00', new DateTimeZone('UTC'));
    }

    private function code(string $start, bool $isAdmin, mixed $requested): int
    {
        return ControllerCalendar::cancellationCode($start, $isAdmin, $requested, $this->now);
    }

    // CT01
    public function testStudentMoreThan24HoursBeforeIsRefunded(): void
    {
        foreach ([1, 2, 3, null, 'x'] as $requested) {
            $this->assertSame(1, $this->code('2026-11-03 10:00:01', false, $requested));
        }
        // Exactement 24 h avant : encore gratuit
        $this->assertSame(1, $this->code('2026-11-03 10:00:00', false, 1));
    }

    // CT02
    public function testStudentLessThan24HoursBeforeCannotForceRefund(): void
    {
        foreach ([1, 2, 3, '3', null] as $requested) {
            $this->assertSame(2, $this->code('2026-11-03 09:59:59', false, $requested));
        }
    }

    // CT03
    public function testStudentPastLessonIsNotRefunded(): void
    {
        $this->assertSame(2, $this->code('2026-11-01 10:00:00', false, 1));
    }

    // CT04
    public function testAdminCancellationIsAlwaysRefunded(): void
    {
        $this->assertSame(3, $this->code('2026-11-02 11:00:00', true, 3));
        $this->assertSame(3, $this->code('2026-11-10 11:00:00', true, 3));
    }

    // CT05
    public function testAdminWithoutAdminCodeFollowsThe24HoursRule(): void
    {
        $this->assertSame(2, $this->code('2026-11-02 11:00:00', true, 1));
        $this->assertSame(1, $this->code('2026-11-10 11:00:00', true, null));
    }

    // CT06
    public function testStartDateIsReadAsUtc(): void
    {
        $previous = date_default_timezone_get();
        date_default_timezone_set('America/New_York');
        try {
            // 23 h 59 avant en UTC ; lu à l'heure de New York, ce serait plus de 24 h.
            $this->assertSame(2, $this->code('2026-11-03 09:59:00', false, 1));
        } finally {
            date_default_timezone_set($previous);
        }
    }
}
