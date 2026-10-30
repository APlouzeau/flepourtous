-- ============================================================
-- 002 : une date et une version d'acceptation par document
--       (règlement intérieur, CGV, politique de confidentialité)
-- ============================================================
-- Remplace db/migration_2.sql (syntaxe invalide, colonnes croisées,
-- conversion des statuts incompatible avec le code).
--
-- AVANT : mysqldump de la base (voir procédure dans le ticket).
-- Prérequis : 001 appliqué.
--
-- Principe : on AJOUTE les nouvelles colonnes et on y COPIE les données.
-- Les anciennes colonnes ne sont pas supprimées ici (voir 003) :
--   - si ce script échoue en route, rien n'est perdu ;
--   - le code actuel de main n'utilise ni les anciennes ni les nouvelles
--     colonnes, il peut donc tourner avant le déploiement sans rien casser.
-- Rejouable sans risque.
-- ============================================================

-- 1. Nouvelles colonnes.
--    Les dates d'acceptation sont NULL quand l'acceptation n'est pas prouvée.
--    Par défaut, la date d'insertion : le nouveau code refuse l'inscription
--    tant que les trois cases ne sont pas cochées, donc insertion = acceptation.
--    Les versions n'ont PAS de valeur par défaut : le code les fournit,
--    une version absente doit rester visible (NULL) plutôt que d'être inventée.
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `internal_regulations_accepted_at` datetime    NULL DEFAULT current_timestamp(),
  ADD COLUMN IF NOT EXISTS `internal_regulations_version`     varchar(10) NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `terms_of_service_accepted_at`     datetime    NULL DEFAULT current_timestamp(),
  ADD COLUMN IF NOT EXISTS `terms_of_service_version`         varchar(10) NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `privacy_policy_accepted_at`       datetime    NULL DEFAULT current_timestamp(),
  ADD COLUMN IF NOT EXISTS `privacy_policy_version`           varchar(10) NULL DEFAULT NULL;

-- 2. Reprise des données existantes.
--    accept_terms_rules_privacy = 1 : acceptation des trois documents à la date
--    enregistrée, dans les versions enregistrées.
--    = 0 : aucune acceptation prouvée → NULL partout.
--    (rules = règlement intérieur, terms = CGV, privacy = confidentialité)
UPDATE `users` SET
  `internal_regulations_accepted_at` = IF(`accept_terms_rules_privacy` = 1, `accept_terms_rules_privacy_date`, NULL),
  `internal_regulations_version`     = IF(`accept_terms_rules_privacy` = 1, `rules_version`,   NULL),
  `terms_of_service_accepted_at`     = IF(`accept_terms_rules_privacy` = 1, `accept_terms_rules_privacy_date`, NULL),
  `terms_of_service_version`         = IF(`accept_terms_rules_privacy` = 1, `terms_version`,   NULL),
  `privacy_policy_accepted_at`       = IF(`accept_terms_rules_privacy` = 1, `accept_terms_rules_privacy_date`, NULL),
  `privacy_policy_version`           = IF(`accept_terms_rules_privacy` = 1, `privacy_version`, NULL);

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('002_users_acceptations_par_document');

-- 3. Contrôle à lire avant de continuer : les deux lignes doivent concorder.
SELECT 'avant (anciennes colonnes)' AS controle,
       SUM(`accept_terms_rules_privacy` = 1) AS acceptes, COUNT(*) AS total
FROM `users`
UNION ALL
SELECT 'après (nouvelles colonnes)',
       SUM(`internal_regulations_accepted_at` IS NOT NULL
           AND `terms_of_service_accepted_at` IS NOT NULL
           AND `privacy_policy_accepted_at` IS NOT NULL), COUNT(*)
FROM `users`;
