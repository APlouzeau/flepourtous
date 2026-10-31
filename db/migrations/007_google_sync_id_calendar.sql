-- ============================================================
-- 007 : google_sync.idCalendar → id_calendar (FLE-109)
-- ============================================================
-- Le code (ModelGoogleSync) utilise id_calendar depuis le passage en snake_case
-- (commit 17d13f0, en prod le 15/08), mais la colonne n'avait jamais été renommée
-- en preprod ni en prod : chaque notification Google plantait sur
-- « Unknown column 'id_calendar' », et aucune modification faite dans Google
-- n'arrivait en base.
--
-- Déjà appliqué à la main en preprod et en prod le 31/10/2026 (dumps du
-- 31/10 21:00 UTC) : ici, IF EXISTS ne change plus rien. Le fichier garde
-- l'historique et met à jour les bases locales créées avant le renommage.
-- L'index unique suit la colonne. Rejouable sans risque.
-- ============================================================

ALTER TABLE `google_sync` RENAME COLUMN IF EXISTS `idCalendar` TO `id_calendar`;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('007_google_sync_id_calendar');
