<?php

namespace config\enum;

enum ErrorCodes: string
{
    case UNKNOWN_ERROR = 'Erreur inconnue';
    case USER_NOT_CONNECTED = 'Utilisateur non connecté';
    case MISSING_PARAMETER = 'Paramètre manquant';
    case UNAUTHORIZED_USER = 'Utilisateur non autorisé';
    case INVALID_EMAIL = 'Adresse e-mail invalide';
    case INVALID_NICKNAME = 'Pseudo invalide';
    case INVALID_FIRSTNAME = 'Prénom invalide';
    case INVALID_LASTNAME = 'Nom invalide';
    case REGULATIONS_INTERIOR_NOT_ACCEPTED = 'Le règlement intérieur n\'a pas été accepté';
    case PRIVACY_POLICY_NOT_ACCEPTED = 'La politique de confidentialité n\'a pas été acceptée';
    case TERMS_OF_SERVICE_NOT_ACCEPTED = 'Les conditions générales de vente n\'ont pas été acceptées';
    case DOCUMENT_VERSION_OUTDATED = 'Un document à accepter a été mis à jour, rechargez la page pour lire la nouvelle version';

    public function label(): string
    {
        return match ($this) {
            self::UNKNOWN_ERROR => 'Erreur inconnue',
            self::USER_NOT_CONNECTED => 'Utilisateur non connecté',
            self::MISSING_PARAMETER => 'Paramètre manquant',
            self::UNAUTHORIZED_USER => 'Utilisateur non autorisé',
            self::INVALID_EMAIL => 'Adresse e-mail invalide',
            self::INVALID_NICKNAME => 'Pseudo invalide',
            self::INVALID_FIRSTNAME => 'Prénom invalide',
            self::INVALID_LASTNAME => 'Nom invalide',
            self::REGULATIONS_INTERIOR_NOT_ACCEPTED => 'Les acceptations requises ne sont pas toutes acceptées',
            self::PRIVACY_POLICY_NOT_ACCEPTED => 'La politique de confidentialité n\'a pas été acceptée',
            self::TERMS_OF_SERVICE_NOT_ACCEPTED => 'Les conditions générales de vente n\'ont pas été acceptées',
            self::DOCUMENT_VERSION_OUTDATED => 'Un document à accepter a été mis à jour, rechargez la page pour lire la nouvelle version',
        };
    }
}
