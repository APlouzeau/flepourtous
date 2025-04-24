SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


DROP TABLE IF EXISTS `availability`;
CREATE TABLE `availability` (
  `id_availability` varchar(60) NOT NULL,
  `scheduleId` varchar(60) DEFAULT NULL,
  `startTime` datetime DEFAULT NULL,
  `endTime` varchar(60) DEFAULT NULL,
  `dayOfWeek` varchar(50) DEFAULT NULL,
  `id_1` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `idEvent` varchar(60) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `isActive` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `lesson`;
CREATE TABLE `lesson` (
  `id_lesson` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `shortDescription` varchar(50) DEFAULT NULL,
  `fullDescription` text DEFAULT NULL,
  `imagePath` varchar(100) DEFAULT NULL,
  `slug` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lesson` (`id_lesson`, `title`, `shortDescription`, `fullDescription`, `imagePath`, `slug`) VALUES
(1, 'Cours pour enfants', 'Venez découvrir mes cours pour les enfants', 'Pleins de cours pour les petits et moyen enfants', '/images/enfant.jpg', 'cours-pour-enfants'),
(2, 'DELF', 'DELF / TCF / TEF ?', 'Et bien il faut venir !', '/images/ados.jpg', 'delf-tcf-tef');

DROP TABLE IF EXISTS `prices`;
CREATE TABLE `prices` (
  `id_price` int(11) NOT NULL,
  `lessonId` int(11) DEFAULT NULL,
  `price` decimal(2,2) DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `id_1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `id_schedule` varchar(60) NOT NULL,
  `timezone` varchar(50) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `mail` varchar(50) NOT NULL,
  `nickName` varchar(50) NOT NULL,
  `password` varchar(60) DEFAULT NULL,
  `adress` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `dateInscription` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`idUser`, `firstName`, `lastName`, `role`, `mail`, `nickName`, `password`, `adress`, `country`, `dateInscription`) VALUES
(1, 'Ludivine', 'Plouzeau', 'user', 'flepourtous.online@gmail.com', 'Lulu', '1234', NULL, NULL, '2025-03-28 22:37:25'),
(2, 'Alexandre', 'Plouzeau', 'user', 'alex@gmail.com', 'Eyo', '1234', NULL, NULL, '2025-04-01 22:46:16'),
(4, 'Laurence', 'Pondarrasse', 'user', 'lolo@gmail.com', 'lolo', '1234', NULL, NULL, '2025-04-24 21:28:29');


ALTER TABLE `availability`
  ADD PRIMARY KEY (`id_availability`),
  ADD KEY `id_1` (`id_1`);

ALTER TABLE `event`
  ADD PRIMARY KEY (`idEvent`),
  ADD KEY `id_1` (`userId`);

ALTER TABLE `lesson`
  ADD PRIMARY KEY (`id_lesson`),
  ADD UNIQUE KEY `title` (`title`);

ALTER TABLE `prices`
  ADD PRIMARY KEY (`id_price`),
  ADD KEY `id_1` (`id_1`);

ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id_schedule`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `mail` (`mail`),
  ADD UNIQUE KEY `nickName` (`nickName`);


ALTER TABLE `lesson`
  MODIFY `id_lesson` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


ALTER TABLE `availability`
  ADD CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`id_1`) REFERENCES `schedule` (`id_schedule`);

ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`);

ALTER TABLE `prices`
  ADD CONSTRAINT `prices_ibfk_1` FOREIGN KEY (`id_1`) REFERENCES `lesson` (`id_lesson`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
