-- ============================================================
-- 001 : état de référence de la table users en PROD au 29/10/2026
-- ============================================================
-- Ces 5 colonnes ont été ajoutées à la main en prod, hors de tout script.
-- Ce fichier les reproduit pour que local et preprod partent
-- exactement du même état que la prod avant d'appliquer 002.
--
-- En PROD : n'a aucun effet (les colonnes existent déjà), mais on
-- l'exécute quand même pour qu'il soit inscrit dans schema_migrations.
-- Rejouable sans risque (IF NOT EXISTS partout).
-- ============================================================

CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `version`    varchar(100) NOT NULL,
  `applied_at` datetime     NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `accept_terms_rules_privacy`      tinyint(1)  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `accept_terms_rules_privacy_date` datetime    NULL     DEFAULT current_timestamp(),
  ADD COLUMN IF NOT EXISTS `terms_version`                   varchar(10) NULL     DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS `rules_version`                   varchar(10) NULL     DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS `privacy_version`                 varchar(10) NULL     DEFAULT '1.0';

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('001_users_colonnes_acceptation_prod');
