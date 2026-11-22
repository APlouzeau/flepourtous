<?php

use PHPUnit\Framework\TestCase;

/**
 * PLAN DE TEST - Date des mails d'annulation en français
 *
 * Objectif : les mails affichent "3 décembre 2026" et non "3 December 2026"
 * (DateTime::format('F') ignore setlocale()).
 * Cas testés :
 * - CT01 : mois en français
 * - CT02 : la date est celle du fuseau de l'élève, pas celle de l'UTC
 */
class ControllerMailFrenchDateTest extends TestCase
{
    // CT01
    public function testMonthIsInFrench(): void
    {
        $date = new DateTime('2026-12-03 19:30:00', new DateTimeZone('UTC'));
        $date->setTimezone(new DateTimeZone('Europe/Paris'));
        $this->assertSame('3 décembre 2026', ControllerMail::frenchDate($date));
    }

    // CT02
    public function testDateUsesTheUserTimezone(): void
    {
        // 23h30 UTC le 3 décembre = 4 décembre à Tokyo
        $date = new DateTime('2026-12-03 23:30:00', new DateTimeZone('UTC'));
        $date->setTimezone(new DateTimeZone('Asia/Tokyo'));
        $this->assertSame('4 décembre 2026', ControllerMail::frenchDate($date));
    }
}
