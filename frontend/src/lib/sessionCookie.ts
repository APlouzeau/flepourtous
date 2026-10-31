// Nom du cookie de session PHP, propre à chaque environnement (FLE-95) : FLE_PROD_SESSID,
// FLE_PREPROD_SESSID, FLE_DEV_SESSID (docker-compose.*.yml), PHPSESSID par défaut.
// Il doit être identique à SESSION_NAME côté API. À n'utiliser que côté serveur
// (variable d'environnement non publique).
const configured = process.env.SESSION_COOKIE_NAME;

export const SESSION_COOKIE_NAME = configured && /^[A-Za-z0-9_]{1,64}$/.test(configured) ? configured : "PHPSESSID";

// En-tête Cookie à envoyer à l'API pour la session PHP de l'utilisateur.
export function phpSessionCookieHeader(sessionId: string | null | undefined): string {
    return `${SESSION_COOKIE_NAME}=${sessionId ?? ""}`;
}
