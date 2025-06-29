DROP TABLE IF EXISTS `google`;
CREATE TABLE IF NOT EXISTS `google` (
  `canalId` varchar(250) NOT NULL PRIMARY KEY,
  `resourceId` varchar(250) NOT NULL,
  `resourceUri` varchar(250) DEFAULT NULL,
  `expiration` bigint(20) DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL
); 

DROP TABLE IF EXISTS `googleSync`;
CREATE TABLE IF NOT EXISTS `googleSync` (
  `idCalendar` varchar(90) NOT NULL,
  `nextSyncToken` varchar(90) NOT NULL
);


DROP TABLE IF EXISTS `lesson`;
CREATE TABLE IF NOT EXISTS `lesson` (
  `lessonId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `shortDescription` varchar(50) DEFAULT NULL,
  `fullDescription` text DEFAULT NULL,
  `imagePath` varchar(100) DEFAULT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`lessonId`)
);

DROP TABLE IF EXISTS `prices`;
CREATE TABLE IF NOT EXISTS `prices` (
  `idPrice` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `price` decimal(2,2) DEFAULT NULL
);

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `mail` varchar(50) NOT NULL,
  `nickName` varchar(50) NOT NULL,
  `password` varchar(60) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `dateInscription` datetime NOT NULL DEFAULT current_timestamp(),
  `isVerified` int(1) NOT NULL DEFAULT 0,
  `verifyToken` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `mail` (`mail`)
);

CREATE TABLE IF NOT EXISTS `event` (
  `idEvent` varchar(50) NOT NULL,
  `userId` int(11) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  `duration` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `startDateTime` datetime NOT NULL,
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'En attente',
  `visioLink` varchar(255) DEFAULT NULL,
  `id_lesson` int(11) NOT NULL,
  PRIMARY KEY (`idEvent`),
  KEY `id_lesson` (`id_lesson`),
  KEY `userId` (`userId`),
  FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`lessonId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE
);


DROP TABLE IF EXISTS `duration`;
CREATE TABLE IF NOT EXISTS `duration` (
  `idDuration` int(11) NOT NULL PRIMARY KEY,
  `duration` int(2) NOT NULL
); 

CREATE TABLE lessonPrices(
   id_lesson INT(11),
   id_price INT(11),
   id_duration INT(11),
   PRIMARY KEY(id_lesson, id_Price, id_Duration),
   FOREIGN KEY(id_lesson) REFERENCES lesson(lessonId),
   FOREIGN KEY(id_price) REFERENCES prices(idPrice),
   FOREIGN KEY(id_duration) REFERENCES duration(idDuration)
);

INSERT INTO `google` (`canalId`, `resourceId`, `resourceUri`, `expiration`, `token`) VALUES
('flepourtous_channel_68325d811eb29', 'rlubMlfOuXotsL7ysp39hC_at1Y', 'https://www.googleapis.com/calendar/v3/calendars/ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807%40group.calendar.google.com/events?alt=json', 1748736001000, 'Jr7mc0St05S9cuDCShp1FoC2rcBxfReK1YU6oiTU0bwGtAhHvRkHIdCtGAKd98FP');


INSERT INTO `googleSync` (`idCalendar`, `nextSyncToken`) VALUES
('ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807@group.calendar.google.com', 'CL_58tyXvY0DEL_58tyXvY0DGAUggeKX6gIogeKX6gI=');


INSERT INTO `lesson` (`lessonId`, `title`, `shortDescription`, `fullDescription`, `imagePath`, `slug`) VALUES
(1, 'Cours pour enfants', 'Venez découvrir mes cours pour les enfants', 'Pleins de cours pour les petits et moyen enfants', '/images/enfant.jpg', 'cours-pour-enfants'),
(2, 'DELF', 'DELF / TCF / TEF ?', 'Et bien il faut venir !', '/images/ados.jpg', 'delf-tcf-tef');



INSERT INTO `users` (`idUser`, `firstName`, `lastName`, `role`, `mail`, `nickName`, `password`, `address`, `country`, `dateInscription`, `isVerified`, `verifyToken`) VALUES
(6, 'alex', 'plouz', 'user', 'alex@gmail.com', 'alex', '$2y$10$uVxy0AboIR02IcXPysiIj.lqu3xz7YwSAOkSXNs/LpJnUsVtLELy6', NULL, NULL, '2025-05-18 13:51:08', 1, NULL),
(7, 'Ludivine', 'Plouzeau', 'admin', 'flepourtous.online@gmail.com', 'Lulu', '$2y$10$u9PaQ0uWcwqn1kEa04x5aut3ega1Ls5SHsIQy1K3ZLgp.IwtYAjai', NULL, NULL, '2025-05-24 14:11:12', 1, NULL),
(9, 'Alexandre', 'Plouzeau', 'user', 'eyopaf@gmail.com', 'Alex', '$2y$10$PcBu6J5L6SkFv6CtCw9Qpun2Lv78CwnQcROq2lWOEFrUcnjb8nVBa', NULL, NULL, '2025-05-24 14:33:22', 1, NULL),
(10, 'Marianne', 'Lii', 'user', 'li.marianne18@gmail.com', 'Mli', '$2y$10$ZAM2BQ8pPJf91keRVuP8MeApcvlp2.9b640ubbtc1Jq/ceXyobU9S', NULL, NULL, '2025-05-25 08:05:22', 1, NULL),
(11, 'Marianne', 'Lii', 'user', 'li.marianne88@gmail.com', 'Mli', '$2y$10$beqA7buouSdCAvUSmO/ZNOgtGolhsI6G6gZc6S9PN3hJ2h8E.Aoe2', NULL, NULL, '2025-05-25 08:06:33', 1, NULL),
(14, 'sauce', 'isson', 'user', 'saucisson@gmail.com', 'saucisse', '$2y$10$bI8v0qZdHWOiXdLc0lwe3.7hk.Iu6oVtYhTqqWrh/qd9DO0FE3fqG', NULL, NULL, '2025-05-25 19:12:35', 1, NULL);






