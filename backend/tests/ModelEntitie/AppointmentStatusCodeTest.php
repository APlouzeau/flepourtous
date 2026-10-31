<?php

use PHPUnit\Framework\TestCase;
use config\enum\AppointmentStatus;

/**
 * PLAN DE TEST - Codes de statut envoyés au front élève
 *
 * La base stocke le libellé français (« Payé »), le front élève (lib/badge.ts) attend un code
 * (« paid »). Sans conversion : pastille « unknown » et aucun bouton (payer, annuler, visio).
 * Cas testés :
 * - CT01 : chaque libellé de l'enum donne le code attendu par badge.ts
 * - CT02 : libellé hors enum ou vide → « unknown »
 */
class AppointmentStatusCodeTest extends TestCase
{
    // Codes de frontend/src/lib/badge.ts (AppointmentStatusCode), hors « unknown »
    private const FRONT_CODES = [
        'Payé' => 'paid',
        'Payé - Admin' => 'paid_admin',
        'Non payé' => 'unpaid',
        'En attente' => 'pending',
        'Google' => 'google',
        'Annulé - Remboursé' => 'cancelled_refunded',
        'Annulé - non Remboursé' => 'cancelled_not_refunded',
        'Annulé - Admin' => 'cancelled_admin',
        'Annulé Google - Non remboursé' => 'cancelled_google_not_refunded',
        'Annulé Google - Remboursé' => 'cancelled_google_refunded',
        'Annulé - Non payé' => 'cancelled_unpaid',
    ];

    // CT01
    public function testEveryLabelMapsToFrontCode(): void
    {
        $this->assertCount(count(AppointmentStatus::cases()), self::FRONT_CODES, 'un statut a été ajouté : ajouter son code ici et dans badge.ts');
        foreach (self::FRONT_CODES as $label => $code) {
            $this->assertSame($code, AppointmentStatus::codeOf($label), $label);
        }
    }

    // CT02
    public function testUnknownLabels(): void
    {
        $this->assertSame('unknown', AppointmentStatus::codeOf('Refusé'));
        $this->assertSame('unknown', AppointmentStatus::codeOf(''));
        $this->assertSame('unknown', AppointmentStatus::codeOf(null));
    }
}
