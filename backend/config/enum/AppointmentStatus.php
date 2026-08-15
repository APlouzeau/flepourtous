<?php

namespace config\enum;

enum AppointmentStatus: string
{
    case PAID = 'Payé';
    case PAID_ADMIN = 'Payé - Admin';
    case UNPAID = 'Non payé';
    case GOOGLE = 'Google';
    case CANCELLED_REFUNDED = 'Annulé - Remboursé';
    case CANCELLED_NOT_REFUNDED = 'Annulé - non Remboursé';
    case CANCELLED_ADMIN = 'Annulé - Admin';
    case CANCELLED_GOOGLE_NOT_REFUNDED = 'Annulé Google - Non remboursé';
    case CANCELLED_GOOGLE_REFUNDED = 'Annulé Google - Remboursé';


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
        };
    }
}
