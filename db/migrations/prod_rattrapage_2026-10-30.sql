-- ============================================================
-- PROD UNIQUEMENT : rattrapage après la migration manuelle du 30/10/2026
-- ============================================================
-- Le 30/10/2026, la prod a reçu migration_2_users_prod.sql (renommage des
-- anciennes colonnes) au lieu de 001 → 002 → 003. Ce script amène la prod
-- exactement dans l'état produit par 001 + 002 + 003, et les inscrit dans
-- schema_migrations.
--
-- Données : avant le 30/10, accept_terms_rules_privacy valait 0 pour les
-- 17 comptes (le code de main n'écrivait jamais ces colonnes) ; les dates
-- venaient de l'ajout manuel des colonnes et de l'ON UPDATE. 002 aurait
-- donc mis NULL partout : on fait pareil.
-- Seuls les comptes existant au 30/10 (id_user <= 23) sont concernés.
-- ============================================================

CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `version`    varchar(100) NOT NULL,
  `applied_at` datetime     NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `users`
  MODIFY `internal_regulations_accepted_at` datetime    NULL DEFAULT current_timestamp() AFTER `verify_token`,
  MODIFY `internal_regulations_version`     varchar(10) NULL DEFAULT NULL AFTER `internal_regulations_accepted_at`,
  MODIFY `terms_of_service_accepted_at`     datetime    NULL DEFAULT current_timestamp() AFTER `internal_regulations_version`,
  MODIFY `terms_of_service_version`         varchar(10) NULL DEFAULT NULL AFTER `terms_of_service_accepted_at`,
  MODIFY `privacy_policy_accepted_at`       datetime    NULL DEFAULT current_timestamp() AFTER `terms_of_service_version`,
  MODIFY `privacy_policy_version`           varchar(10) NULL DEFAULT NULL AFTER `privacy_policy_accepted_at`;

UPDATE `users` SET
  `internal_regulations_accepted_at` = NULL, `internal_regulations_version` = NULL,
  `terms_of_service_accepted_at`     = NULL, `terms_of_service_version`     = NULL,
  `privacy_policy_accepted_at`       = NULL, `privacy_policy_version`       = NULL
WHERE `id_user` <= 23;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES
  ('001_users_colonnes_acceptation_prod'),
  ('002_users_acceptations_par_document'),
  ('003_users_suppression_anciennes_colonnes');
