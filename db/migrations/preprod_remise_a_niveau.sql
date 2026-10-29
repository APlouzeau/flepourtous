-- ============================================================
-- PREPROD UNIQUEMENT : remettre users dans l'état de la prod
-- ============================================================
-- La preprod a reçu une version corrigée à la main de migration_2.sql.
-- On la ramène à l'état exact de la prod pour répéter 001 + 002
-- dans les mêmes conditions. Les comptes preprod sont des comptes de
-- test : leurs dates d'acceptation sont perdues, c'est voulu.
-- ============================================================

ALTER TABLE `users`
  DROP COLUMN IF EXISTS `internal_regulations_accepted_at`,
  DROP COLUMN IF EXISTS `internal_regulations_version`,
  DROP COLUMN IF EXISTS `terms_of_service_accepted_at`,
  DROP COLUMN IF EXISTS `terms_of_service_version`,
  DROP COLUMN IF EXISTS `privacy_policy_accepted_at`,
  DROP COLUMN IF EXISTS `privacy_policy_version`;

-- Ensuite : 001, puis 002.
