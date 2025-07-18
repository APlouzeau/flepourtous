-- Base de données : `flepourtous`
--
CREATE DATABASE IF NOT EXISTS `flepourtous` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `flepourtous`;

-- --------------------------------------------------------

--
-- Structure de la table `duration`
--

DROP TABLE IF EXISTS `duration`;
CREATE TABLE IF NOT EXISTS `duration` (
  `idDuration` int(11) NOT NULL AUTO_INCREMENT,
  `duration` int(2) NOT NULL,
  PRIMARY KEY (`idDuration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `duration`
--

INSERT INTO `duration` (`idDuration`, `duration`) VALUES
(1, 30),
(2, 45),
(3, 60);

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

DROP TABLE IF EXISTS `event`;
CREATE TABLE IF NOT EXISTS `event` (
  `idEvent` varchar(50) NOT NULL,
  `userId` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `startDateTime` datetime NOT NULL,
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'En attente',
  `visioLink` varchar(255) DEFAULT NULL,
  `id_lesson` int(11) NOT NULL,
  PRIMARY KEY (`idEvent`),
  KEY `id_lesson` (`id_lesson`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `google`
--

DROP TABLE IF EXISTS `google`;
CREATE TABLE IF NOT EXISTS `google` (
  `canalId` varchar(250) NOT NULL,
  `resourceId` varchar(250) NOT NULL,
  `resourceUri` varchar(250) DEFAULT NULL,
  `expiration` bigint(20) DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL,
  `calendarId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`canalId`),
  UNIQUE KEY `calendarId` (`calendarId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `google`
--

INSERT INTO `google` (`canalId`, `resourceId`, `resourceUri`, `expiration`, `token`, `calendarId`) VALUES
('flepourtous_channel_68325d811eb29', 'rlubMlfOuXotsL7ysp39hC_at1Y', 'https://www.googleapis.com/calendar/v3/calendars/ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807%40group.calendar.google.com/events?alt=json', 1748736001000, 'Jr7mc0St05S9cuDCShp1FoC2rcBxfReK1YU6oiTU0bwGtAhHvRkHIdCtGAKd98FP', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `googleSync`
--

DROP TABLE IF EXISTS `googleSync`;
CREATE TABLE IF NOT EXISTS `googleSync` (
  `idCalendar` varchar(90) NOT NULL,
  `nextSyncToken` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `googleSync`
--

INSERT INTO `googleSync` (`idCalendar`, `nextSyncToken`) VALUES
('ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807@group.calendar.google.com', 'CL_58tyXvY0DEL_58tyXvY0DGAUggeKX6gIogeKX6gI=');

-- --------------------------------------------------------

--
-- Structure de la table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
CREATE TABLE IF NOT EXISTS `lesson` (
  `idLesson` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `shortDescription` varchar(50) DEFAULT NULL,
  `fullDescription` text DEFAULT NULL,
  `imagePath` varchar(100) DEFAULT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`idLesson`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lesson`
--

INSERT INTO `lesson` (`idLesson`, `title`, `shortDescription`, `fullDescription`, `imagePath`, `slug`) VALUES
(1, 'Cours pour enfants', 'Venez découvrir mes cours pour les enfants', 'Pleins de cours pour les petits et moyen enfants', '/images/enfant.jpg', 'cours-pour-enfants'),
(2, 'DELF', 'DELF / TCF / TEF ?', 'Et bien il faut venir !', '/images/ados.jpg', 'delf-tcf-tef'),
(3, 'Un cours cher', 'C\'est un cours cher', 'Un cours cher pour tester la base de données', '/images/ados.jpg','un-cours-cher');

-- --------------------------------------------------------

--
-- Structure de la table `lessonPrices`
--

DROP TABLE IF EXISTS `lessonPrices`;
CREATE TABLE IF NOT EXISTS `lessonPrices` (
  `id_lesson` int(11) NOT NULL,
  `id_price` int(11) NOT NULL,
  `id_duration` int(11) NOT NULL,
  PRIMARY KEY (`id_lesson`,`id_price`,`id_duration`),
  KEY `id_price` (`id_price`),
  KEY `id_duration` (`id_duration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lessonPrices`
--

INSERT INTO `lessonPrices` (`id_lesson`, `id_price`, `id_duration`) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(2, 1, 1),
(2, 2, 2),
(2, 3, 3),
(3, 2, 1),
(3, 3, 2),
(3, 4, 3);

-- --------------------------------------------------------

--
-- Structure de la table `prices`
--

DROP TABLE IF EXISTS `prices`;
CREATE TABLE IF NOT EXISTS `prices` (
  `idPrice` int(11) NOT NULL AUTO_INCREMENT,
  `price` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`idPrice`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `prices`
--

INSERT INTO `prices` (`idPrice`, `price`) VALUES
(1, 12.00),
(2, 18.00),
(3, 24.00),
(4, 35.00);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `mail` varchar(50) NOT NULL,
  `nickName` varchar(50) NOT NULL,
  `password` varchar(60) DEFAULT NULL,
  `wallet` decimal(10,2) NOT NULL DEFAULT 0.00,
  `address` varchar(100) DEFAULT NULL,
  `address_2` varchar(50) DEFAULT NULL,
  `address_3` varchar(50) DEFAULT NULL,
  `zip` int(11) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `dateInscription` datetime NOT NULL DEFAULT current_timestamp(),
  `isVerified` int(1) NOT NULL DEFAULT 0,
  `verifyToken` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`idLesson`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `lessonPrices`
--
ALTER TABLE `lessonPrices`
  ADD CONSTRAINT `lessonPrices_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`idLesson`),
  ADD CONSTRAINT `lessonPrices_ibfk_2` FOREIGN KEY (`id_price`) REFERENCES `prices` (`idPrice`),
  ADD CONSTRAINT `lessonPrices_ibfk_3` FOREIGN KEY (`id_duration`) REFERENCES `duration` (`idDuration`);
COMMIT;
