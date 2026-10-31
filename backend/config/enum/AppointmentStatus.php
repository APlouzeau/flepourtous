<?php

namespace config\enum;

enum AppointmentStatus: string
{
    case PAID = 'Payé';
    case PAID_ADMIN = 'Payé - Admin';
    case UNPAID = 'Non payé';
    case PENDING = 'En attente';
    case GOOGLE = 'Google';
    case CANCELLED_REFUNDED = 'Annulé - Remboursé';
    case CANCELLED_NOT_REFUNDED = 'Annulé - non Remboursé';
    case CANCELLED_ADMIN = 'Annulé - Admin';
    case CANCELLED_GOOGLE_NOT_REFUNDED = 'Annulé Google - Non remboursé';
    case CANCELLED_GOOGLE_REFUNDED = 'Annulé Google - Remboursé';
    case CANCELLED_UNPAID = 'Annulé - Non payé';


    /**
     * Code envoyé au front élève (lib/badge.ts) : nom du cas en minuscules, ex. PAID → "paid",
     * CANCELLED_GOOGLE_REFUNDED → "cancelled_google_refunded". La base garde le libellé français.
     */
    public function code(): string
    {
        return strtolower($this->name);
    }

    /** Code d'un libellé stocké en base ; "unknown" pour un libellé hors enum (ex. « Refusé »). */
    public static function codeOf(?string $label): string
    {
        return self::tryFrom((string) $label)?->code() ?? 'unknown';
    }

    public function label(): string
    {
        return match ($this) {
            self::PAID => 'Payé',
            self::PAID_ADMIN => 'Payé - Admin',
            self::GOOGLE => 'Google',
            self::CANCELLED_REFUNDED => 'Annulé - Remboursé',
            self::UNPAID => 'Non payé',
            self::CANCELLED_NOT_REFUNDED => 'Annulé - non Remboursé',
            self::CANCELLED_ADMIN => 'Annulé - Admin',
            self::CANCELLED_GOOGLE_NOT_REFUNDED => 'Annulé Google - Non remboursé',
            self::CANCELLED_UNPAID => 'Annulé - Non payé',
            self::CANCELLED_GOOGLE_REFUNDED => 'Annulé Google - Remboursé',
            self::PENDING => 'En attente',
        };
    }
}
