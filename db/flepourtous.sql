SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
CREATE DATABASE IF NOT EXISTS `flepourtous` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `flepourtous`;

CREATE TABLE IF NOT EXISTS `duration` (
  `idDuration` int(11) NOT NULL AUTO_INCREMENT,
  `duration` int(2) NOT NULL,
  PRIMARY KEY (`idDuration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `duration` (`idDuration`, `duration`) VALUES
(1, 30),
(2, 45),
(3, 60);

CREATE TABLE IF NOT EXISTS `event` (
  `idEvent` varchar(50) NOT NULL,
  `userId` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `startDateTime` datetime NOT NULL,
  `timezone` varchar(50) NOT NULL DEFAULT 'UTC',
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'En attente',
  `visioLink` varchar(255) DEFAULT NULL,
  `id_lesson` int(11) NOT NULL,
  `is_invoiced` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idEvent`),
  KEY `id_lesson` (`id_lesson`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `event` (`idEvent`, `userId`, `description`, `duration`, `createdAt`, `startDateTime`, `timezone`, `updatedAt`, `status`, `visioLink`, `id_lesson`, `is_invoiced`) VALUES
('71i5dmogdsp590a2h6ureuk3mc', 1, '', 60, '2025-09-01 20:39:18', '2025-09-02 07:30:00', 'UTC', '2025-09-01 20:39:53', 'Payé', 'https://flepourtous.daily.co/VHOWVMDVbF61qeGOxwJY', 1, 0),
('986iitl9q24t0k0r50vrt1s5s4', 1, '', 30, '2025-09-01 20:10:42', '2025-09-03 06:00:00', 'UTC', '2025-09-01 20:11:15', 'Payé', 'https://flepourtous.daily.co/73Ya6FigOwuZGbPhsxfn', 1, 0);

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

INSERT INTO `google` (`canalId`, `resourceId`, `resourceUri`, `expiration`, `token`, `calendarId`) VALUES
('flepourtous_channel_68325d811eb29', 'rlubMlfOuXotsL7ysp39hC_at1Y', 'https://www.googleapis.com/calendar/v3/calendars/ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807%40group.calendar.google.com/events?alt=json', 1748736001000, 'Jr7mc0St05S9cuDCShp1FoC2rcBxfReK1YU6oiTU0bwGtAhHvRkHIdCtGAKd98FP', NULL);

CREATE TABLE IF NOT EXISTS `googleSync` (
  `idCalendar` varchar(90) NOT NULL,
  `nextSyncToken` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `googleSync` (`idCalendar`, `nextSyncToken`) VALUES
('ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807@group.calendar.google.com', 'CL_58tyXvY0DEL_58tyXvY0DGAUggeKX6gIogeKX6gI=');

CREATE TABLE IF NOT EXISTS `invoices` (
  `id_invoices` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `address_2` varchar(50) NOT NULL,
  `address_3` varchar(50) NOT NULL,
  `zip` int(11) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `lesson` varchar(1150) NOT NULL,
  `event_dateTime` datetime NOT NULL,
  `duration` int(2) NOT NULL,
  `price` decimal(4,2) NOT NULL,
  `invoice_date` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_invoices`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `lesson` (
  `idLesson` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `shortDescription` varchar(50) DEFAULT NULL,
  `fullDescription` text DEFAULT NULL,
  `imagePath` varchar(100) DEFAULT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`idLesson`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lesson` (`idLesson`, `title`, `shortDescription`, `fullDescription`, `imagePath`, `slug`) VALUES
(1, 'Cours pour enfants', 'Venez découvrir mes cours pour les enfants', 'Pleins de cours pour les petits et moyen enfants', '/images/enfant.jpg', 'cours-pour-enfants'),
(2, 'DELF', 'DELF / TCF / TEF ?', 'Et bien il faut venir !', '/images/ados.jpg', 'delf-tcf-tef'),
(3, 'Un cours cher', 'C\'est un cours cher', 'Un cours cher pour tester la base de données', '/images/ados.jpg', 'un-cours-cher');

CREATE TABLE IF NOT EXISTS `lessonPrices` (
  `id_lesson` int(11) NOT NULL,
  `id_price` int(11) NOT NULL,
  `id_duration` int(11) NOT NULL,
  PRIMARY KEY (`id_lesson`,`id_price`,`id_duration`),
  KEY `id_price` (`id_price`),
  KEY `id_duration` (`id_duration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE IF NOT EXISTS `prices` (
  `idPrice` int(11) NOT NULL AUTO_INCREMENT,
  `price` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`idPrice`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `prices` (`idPrice`, `price`) VALUES
(1, 12.00),
(2, 18.00),
(3, 24.00),
(4, 35.00);

CREATE TABLE IF NOT EXISTS `users` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `mail` varchar(50) NOT NULL,
  `nickName` varchar(50) NOT NULL,
  `password` varchar(60) DEFAULT NULL,
  `wallet` decimal(10,2) NOT NULL DEFAULT 0.00,
  `address` varchar(50) DEFAULT NULL,
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

INSERT INTO `users` (`idUser`, `firstName`, `lastName`, `role`, `mail`, `nickName`, `password`, `wallet`, `address`, `address_2`, `address_3`, `zip`, `city`, `country`, `dateInscription`, `isVerified`, `verifyToken`) VALUES
(1, 'cezcxze', 'cezczecz', 'user', 'alex@gmail.com', 'cxzeczec', '$2y$12$X9baMPUou.1gTIMffUttXupxHsv4Mnwn766Sa1AbquSJ7oyrjXdnC', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-18 23:40:31', 1, '830999bce58e3c57415d1028247535bac27fae52192af566f90737ca854364c6');


ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`idLesson`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `lessonPrices`
  ADD CONSTRAINT `lessonPrices_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`idLesson`),
  ADD CONSTRAINT `lessonPrices_ibfk_2` FOREIGN KEY (`id_price`) REFERENCES `prices` (`idPrice`),
  ADD CONSTRAINT `lessonPrices_ibfk_3` FOREIGN KEY (`id_duration`) REFERENCES `duration` (`idDuration`);
