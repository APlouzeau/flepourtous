-- ============================================================
-- 005 : jetons de vérification et de réinitialisation (FLE-52)
-- ============================================================
-- Avant : un seul jeton (`verify_token`) pour la vérification d'e-mail ET
-- le mot de passe oublié, calculé à partir du mail et de CRON_KEY, stocké
-- en clair, sans expiration.
-- Après :
--   - vérification d'e-mail : `verify_token` (hash SHA-256 du jeton envoyé
--     par mail) + `verify_token_expires_at` (48 h) ;
--   - mot de passe oublié : `reset_token` (hash SHA-256) +
--     `reset_token_expires_at` (1 h).
-- Toutes les dates sont en UTC (UTC_TIMESTAMP()).
--
-- Les liens de vérification déjà envoyés restent valables 48 h : le jeton
-- en clair déjà stocké est remplacé par son hash, que le nouveau code compare.
-- Les jetons restants sur des comptes déjà vérifiés étaient des jetons de
-- réinitialisation ou des restes : ils sont effacés.
--
-- À lancer AVANT le déploiement du code qui l'utilise. Rejouable sans risque.
-- ============================================================

ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `verify_token_expires_at` datetime    NULL DEFAULT NULL AFTER `verify_token`,
  ADD COLUMN IF NOT EXISTS `reset_token`             varchar(64) NULL DEFAULT NULL AFTER `verify_token_expires_at`,
  ADD COLUMN IF NOT EXISTS `reset_token_expires_at`  datetime    NULL DEFAULT NULL AFTER `reset_token`;

-- Comptes vérifiés : plus aucun jeton de vérification à garder.
UPDATE `users` SET `verify_token` = NULL
WHERE `is_verified` = 1 AND `verify_token` IS NOT NULL;

-- Comptes non vérifiés : jeton en clair → son hash, valable 48 h.
-- La condition sur l'expiration rend le script rejouable (on ne hache pas un hash).
UPDATE `users`
SET `verify_token` = SHA2(`verify_token`, 256),
    `verify_token_expires_at` = UTC_TIMESTAMP() + INTERVAL 48 HOUR
WHERE `is_verified` = 0 AND `verify_token` IS NOT NULL AND `verify_token_expires_at` IS NULL;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('005_users_jetons_aleatoires_avec_expiration');
