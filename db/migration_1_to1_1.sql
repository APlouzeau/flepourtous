-- ============================================================
-- MIGRATION : schéma initial → schéma visé
-- Faire un mysqldump AVANT d'exécuter ce script !
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

USE `flepourtous-preprod`;

-- ============================================================
-- 1. TABLE users : renommage des colonnes
-- ============================================================
-- Étape 1 : Supprimer les FK qui référencent users.idUser
-- (elles sont dans la table event)
ALTER TABLE `events`
  DROP FOREIGN KEY `events_ibfk_2`;

-- Étape 2 : Renommer les colonnes de users
ALTER TABLE `users`
  CHANGE `idUser`          `id_user`      int(11) NOT NULL AUTO_INCREMENT,
  CHANGE `firstName`       `first_name`   varchar(50) NOT NULL,
  CHANGE `lastName`        `last_name`    varchar(50) NOT NULL,
  CHANGE `nickName`        `nick_name`    varchar(50) NOT NULL,
  CHANGE `address`         `address`      varchar(50) DEFAULT NULL,
  CHANGE `dateInscription` `created_at`   datetime NOT NULL DEFAULT current_timestamp(),
  CHANGE `isVerified`      `is_verified`  int(1) NOT NULL DEFAULT 0,
  CHANGE `verifyToken`     `verify_token` varchar(64) DEFAULT NULL;

-- Étape 3 : Recréer la FK sur event (elle pointe maintenant vers id_user)
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_2`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id_user`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 2. TABLE duration → durations : renommage table + colonne
-- ============================================================
RENAME TABLE `duration` TO `durations`;
ALTER TABLE `durations`
  CHANGE `idDuration` `id_duration` int(11) NOT NULL AUTO_INCREMENT;

-- ============================================================
-- 3. TABLE lesson → lessons : restructuration + split i18n
-- ============================================================
-- 3a. Créer la nouvelle table lessons (minimaliste)
CREATE TABLE `lessons` (
  `id_lesson` int(11) NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id_lesson`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3b. Migrer les données d'image depuis lesson
INSERT INTO `lessons` (`id_lesson`, `image_path`)
SELECT `idLesson`, COALESCE(`imagePath`, '') FROM `lesson`;

-- 3c. Créer la table lesson_translations
CREATE TABLE `lesson_translations` (
  `id_lesson_translation` int(11) NOT NULL AUTO_INCREMENT,
  `id_lesson` int(11) NOT NULL,
  `locale` varchar(5) DEFAULT 'fr',
  `title` varchar(50) DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `full_description_1` text DEFAULT NULL,
  `full_description_2` text DEFAULT NULL,
  `full_description_3` text DEFAULT NULL,
  `slug` varchar(50) NOT NULL,
  `introduction` text DEFAULT NULL,
  `subtitle_1` text DEFAULT NULL,
  `text_1` text DEFAULT NULL,
  `subtitle_2` text DEFAULT NULL,
  `text_2` text DEFAULT NULL,
  `subtitle_3` text DEFAULT NULL,
  `text_3` text DEFAULT NULL,
  `subtitle_4` text DEFAULT NULL,
  `text_4` text DEFAULT NULL,
  `subtitle_5` text DEFAULT NULL,
  `text_5` text DEFAULT NULL,
  `subtitle_6` text DEFAULT NULL,
  `text_6` text DEFAULT NULL,
  PRIMARY KEY (`id_lesson_translation`),
  UNIQUE KEY `uniq_lesson_locale` (`id_lesson`, `locale`),
  UNIQUE KEY `uniq_locale_slug` (`locale`, `slug`),
  KEY `id_lesson` (`id_lesson`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3d. Migrer les données textuelles de lesson → lesson_translations (locale 'fr')
INSERT INTO `lesson_translations` (
  `id_lesson`, `locale`, `title`, `short_description`,
  `full_description_1`, `full_description_2`, `full_description_3`,
  `slug`, `introduction`,
  `subtitle_1`, `text_1`, `subtitle_2`, `text_2`,
  `subtitle_3`, `text_3`, `subtitle_4`, `text_4`,
  `subtitle_5`, `text_5`, `subtitle_6`, `text_6`
)
SELECT
  `idLesson`, 'fr', `title`, `shortDescription`,
  `fullDescription_1`, `fullDescription_2`, `fullDescription_3`,
  `slug`, `introduction`,
  `subtitle_1`, `text_1`, `subtitle_2`, `text_2`,
  `subtitle_3`, `text_3`, `subtitle_4`, `text_4`,
  `subtitle_5`, `text_5`, `subtitle_6`, `text_6`
FROM `lesson`;

-- 3e. Ajouter FK sur lesson_translations
ALTER TABLE `lesson_translations`
  ADD CONSTRAINT `fk_lt_lesson`
  FOREIGN KEY (`id_lesson`) REFERENCES `lessons` (`id_lesson`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 4. TABLE prices : renommage colonne
-- ============================================================
ALTER TABLE `prices`
  CHANGE `idPrice` `id_price` int(11) NOT NULL AUTO_INCREMENT;

-- ============================================================
-- 5. TABLE lessonPrices → lesson_prices
-- ============================================================
-- 5a. Supprimer les FK existantes
ALTER TABLE `lessonPrices`
  DROP FOREIGN KEY `lessonPrices_ibfk_1`,
  DROP FOREIGN KEY `lessonPrices_ibfk_2`,
  DROP FOREIGN KEY `lessonPrices_ibfk_3`;

-- 5b. Renommer la table
RENAME TABLE `lessonPrices` TO `lesson_prices`;

-- 5c. Recréer les FK avec les nouvelles tables
ALTER TABLE `lesson_prices`
  ADD CONSTRAINT `lesson_prices_ibfk_1`
    FOREIGN KEY (`id_price`) REFERENCES `prices` (`id_price`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lesson_prices_ibfk_3`
    FOREIGN KEY (`id_duration`) REFERENCES `durations` (`id_duration`),
  ADD CONSTRAINT `lesson_prices_ibfk_4`
    FOREIGN KEY (`id_lesson`) REFERENCES `lessons` (`id_lesson`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 6. TABLE event → events : renommage table + colonnes
-- ============================================================
-- 6a. Supprimer les FK existantes
ALTER TABLE `event`
  DROP FOREIGN KEY `event_ibfk_1`,
  DROP FOREIGN KEY `event_ibfk_2`;

-- 6b. Renommer les colonnes
ALTER TABLE `event`
  CHANGE `idEvent`       `id_event`        varchar(50) NOT NULL,
  CHANGE `userId`        `user_id`         int(11) NOT NULL,
  CHANGE `createdAt`     `created_at`      datetime NOT NULL DEFAULT current_timestamp(),
  CHANGE `startDateTime` `start_date_time` datetime NOT NULL,
  CHANGE `updatedAt`     `updated_at`      datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  CHANGE `visioLink`     `visio_link`      varchar(255) DEFAULT NULL;

-- 6c. Renommer la table
RENAME TABLE `event` TO `events`;

-- 6d. Recréer les FK vers les nouvelles tables
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_2`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_3`
    FOREIGN KEY (`id_lesson`) REFERENCES `lessons` (`id_lesson`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 7. TABLE google : renommage colonnes
-- ============================================================
ALTER TABLE `google`
  CHANGE `canalId`     `canal_id`    varchar(250) NOT NULL,
  CHANGE `resourceId`  `resource_id` varchar(250) NOT NULL,
  CHANGE `resourceUri` `resource_uri` varchar(250) DEFAULT NULL,
  CHANGE `calendarId`  `calendar_id` varchar(255) DEFAULT NULL;

-- 7b. Recréer les index (DROP + ADD car le nom change)
ALTER TABLE `google`
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`canal_id`),
  DROP INDEX `calendarId`,
  ADD UNIQUE KEY `calendarId` (`calendar_id`);

-- ============================================================
-- 8. TABLE googleSync → google_sync
-- ============================================================
RENAME TABLE `googleSync` TO `google_sync`;
ALTER TABLE `google_sync`
  CHANGE `idCalendar`     `id_calendar`     varchar(90) NOT NULL,
  CHANGE `nextSyncToken`  `next_sync_token`  varchar(90) NOT NULL;

-- 8b. Recréer l'index unique
ALTER TABLE `google_sync`
  DROP INDEX `unique_calendar`,
  ADD UNIQUE KEY `unique_calendar` (`id_calendar`);

-- ============================================================
-- 9. Supprimer l'ancienne table lesson (devenue inutile)
-- ============================================================
DROP TABLE `lesson`;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;