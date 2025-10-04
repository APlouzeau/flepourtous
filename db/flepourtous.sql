SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE `duration` (
  `idDuration` int(11) NOT NULL,
  `duration` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `duration` (`idDuration`, `duration`) VALUES
(1, 30),
(2, 45),
(3, 60);

CREATE TABLE `event` (
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
  `id_lesson` int(11) DEFAULT NULL,
  `is_invoiced` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `event` (`idEvent`, `userId`, `description`, `duration`, `createdAt`, `startDateTime`, `timezone`, `updatedAt`, `status`, `visioLink`, `id_lesson`, `is_invoiced`) VALUES
('71i5dmogdsp590a2h6ureuk3mc', 1, '', 60, '2025-09-01 20:39:18', '2025-09-02 07:30:00', 'UTC', '2025-09-30 21:39:53', 'Payé', 'https://flepourtous.daily.co/VHOWVMDVbF61qeGOxwJY', 1, 0),
('986iitl9q24t0k0r50vrt1s5s4', 1, '', 30, '2025-09-01 20:10:42', '2025-09-03 06:00:00', 'UTC', '2025-09-30 21:39:55', 'Payé', 'https://flepourtous.daily.co/73Ya6FigOwuZGbPhsxfn', 1, 0),
('s8k36aiur95829e63flb8v3u1g', 1, '', 60, '2025-09-30 19:13:16', '2025-10-01 12:00:00', 'Europe/Paris', '2025-09-30 21:47:15', 'Payé', 'https://flepourtous.daily.co/3Dj2PemSh56rr2orxgKm', 1, 1);

CREATE TABLE `google` (
  `canalId` varchar(250) NOT NULL,
  `resourceId` varchar(250) NOT NULL,
  `resourceUri` varchar(250) DEFAULT NULL,
  `expiration` bigint(20) DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL,
  `calendarId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `google` (`canalId`, `resourceId`, `resourceUri`, `expiration`, `token`, `calendarId`) VALUES
('flepourtous_channel_68325d811eb29', 'rlubMlfOuXotsL7ysp39hC_at1Y', 'https://www.googleapis.com/calendar/v3/calendars/ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807%40group.calendar.google.com/events?alt=json', 1748736001000, 'Jr7mc0St05S9cuDCShp1FoC2rcBxfReK1YU6oiTU0bwGtAhHvRkHIdCtGAKd98FP', NULL);

CREATE TABLE `googleSync` (
  `idCalendar` varchar(90) NOT NULL,
  `nextSyncToken` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `invoices` (
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
  `invoice_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `lesson` (
  `idLesson` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `shortDescription` varchar(50) DEFAULT NULL,
  `fullDescription` text DEFAULT NULL,
  `imagePath` varchar(100) DEFAULT NULL,
  `slug` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lesson` (`idLesson`, `title`, `shortDescription`, `fullDescription`, `imagePath`, `slug`) VALUES
(1, 'Cours de conversation', 'Venez découvrir mes cours pour les enfants', 'Pleins de cours pour les petits et moyen enfants', '/images/enfant.jpg', 'cours-pour-enfants'),
(2, 'Cours de préparation aux examens', 'DELF / TCF / TEF ?', 'Et bien il faut venir !', '/images/ados.jpg', 'delf-tcf-tef'),
(3, 'Français général', 'Un cours général', 'C\'est un cours général', NULL, 'francais-general');

CREATE TABLE `lessonPrices` (
  `id_lesson` int(11) NOT NULL,
  `id_price` int(11) NOT NULL,
  `id_duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lessonPrices` (`id_lesson`, `id_price`, `id_duration`) VALUES
(1, 1, 1),
(1, 3, 2),
(1, 5, 3),
(2, 2, 1),
(2, 4, 2),
(2, 6, 3),
(3, 1, 1),
(3, 3, 2),
(3, 5, 3);

CREATE TABLE `prices` (
  `idPrice` int(11) NOT NULL,
  `price` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `prices` (`idPrice`, `price`) VALUES
(1, 11.00),
(2, 12.00),
(3, 16.50),
(4, 18.00),
(5, 22.00),
(6, 24.00);

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
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
  `verifyToken` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`idUser`, `firstName`, `lastName`, `role`, `mail`, `nickName`, `password`, `wallet`, `address`, `address_2`, `address_3`, `zip`, `city`, `country`, `dateInscription`, `isVerified`, `verifyToken`) VALUES
(1, 'cezcxze', 'cezczecz', 'user', 'eyola@live.fr', 'cxzeczec', '$2y$12$X9baMPUou.1gTIMffUttXupxHsv4Mnwn766Sa1AbquSJ7oyrjXdnC', 76.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-18 23:40:31', 1, '830999bce58e3c57415d1028247535bac27fae52192af566f90737ca854364c6'),
(3, 'Ludivine', 'Plouzeau', 'admin', 'flepourtous.online@gmail.com', 'Lulu', '$2y$12$9HihvTfGVjK0ejnJtbQ/jOaXVCGbHg54VMzks3LyZNLw/0tTGGhVO', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 17:28:49', 1, '79fd01a7ea72aab8184748664d435f946951214f6fb006752f99a377e5e74734'),
(4, 'Duncan', 'Gaubert', 'user', 'egaube0494@gmail.com', 'Dunky', '$2y$12$GoKzGwx.9PKbfUVIMgrHPuqWh1YMLtjmoeyADFTDUluiN7vpw4w4C', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 17:33:22', 1, '6efeeeabbf0638028cb2906e3ac36e861e9e8759a75837f935280060cb9d0ee3');


ALTER TABLE `duration`
  ADD PRIMARY KEY (`idDuration`);

ALTER TABLE `event`
  ADD PRIMARY KEY (`idEvent`),
  ADD KEY `id_lesson` (`id_lesson`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `google`
  ADD PRIMARY KEY (`canalId`),
  ADD UNIQUE KEY `calendarId` (`calendarId`);

ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id_invoices`);

ALTER TABLE `lesson`
  ADD PRIMARY KEY (`idLesson`);

ALTER TABLE `lessonPrices`
  ADD PRIMARY KEY (`id_lesson`,`id_price`,`id_duration`),
  ADD KEY `id_price` (`id_price`),
  ADD KEY `id_duration` (`id_duration`);

ALTER TABLE `prices`
  ADD PRIMARY KEY (`idPrice`) USING BTREE;

ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `mail` (`mail`);


ALTER TABLE `duration`
  MODIFY `idDuration` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `lesson`
  MODIFY `idLesson` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `prices`
  MODIFY `idPrice` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`idLesson`) ON DELETE SET NULL,
  ADD CONSTRAINT `event_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `lessonPrices`
  ADD CONSTRAINT `lessonPrices_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`idLesson`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lessonPrices_ibfk_2` FOREIGN KEY (`id_price`) REFERENCES `prices` (`idPrice`),
  ADD CONSTRAINT `lessonPrices_ibfk_3` FOREIGN KEY (`id_duration`) REFERENCES `duration` (`idDuration`);
