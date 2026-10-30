-- ============================================================
-- 004 : nettoyage des acceptations sans version
-- ============================================================
-- Entre 003 et la mise en prod du code de preprod, la prod tourne avec
-- le code de main, qui n'écrit pas les colonnes d'acceptation. Un compte
-- créé pendant cette période reçoit les trois dates du jour (valeur par
-- défaut) sans aucune version : une acceptation qui n'a jamais eu lieu.
-- Même règle que 003 : pas de version = pas d'acceptation prouvée = pas de date.
--
-- En PROD : à lancer juste APRÈS la mise en prod du code de preprod.
-- Ailleurs : aucun effet attendu, on l'exécute pour l'inscrire dans
-- schema_migrations. Rejouable sans risque.
-- ============================================================

UPDATE `users` SET `internal_regulations_accepted_at` = NULL WHERE `internal_regulations_version` IS NULL;
UPDATE `users` SET `terms_of_service_accepted_at`     = NULL WHERE `terms_of_service_version`     IS NULL;
UPDATE `users` SET `privacy_policy_accepted_at`       = NULL WHERE `privacy_policy_version`       IS NULL;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('004_users_nettoyage_acceptations_sans_version');
