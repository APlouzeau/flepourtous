-- ============================================================
-- 003 : suppression des anciennes colonnes d'acceptation
-- ============================================================
-- À lancer PLUS TARD, une fois le nouveau code en prod et validé
-- (quelques jours d'usage normal). Mysqldump avant, comme toujours.
-- Irréversible sans le dump.
-- ============================================================

-- Comptes créés par l'ANCIEN code entre 002 et le déploiement :
-- ils ont reçu une date d'acceptation par défaut sans avoir rien coché.
-- Règle : pas de version = pas d'acceptation prouvée = pas de date.
UPDATE `users` SET `internal_regulations_accepted_at` = NULL WHERE `internal_regulations_version` IS NULL;
UPDATE `users` SET `terms_of_service_accepted_at`     = NULL WHERE `terms_of_service_version`     IS NULL;
UPDATE `users` SET `privacy_policy_accepted_at`       = NULL WHERE `privacy_policy_version`       IS NULL;

ALTER TABLE `users`
  DROP COLUMN IF EXISTS `accept_terms_rules_privacy`,
  DROP COLUMN IF EXISTS `accept_terms_rules_privacy_date`,
  DROP COLUMN IF EXISTS `terms_version`,
  DROP COLUMN IF EXISTS `rules_version`,
  DROP COLUMN IF EXISTS `privacy_version`;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('003_users_suppression_anciennes_colonnes');
