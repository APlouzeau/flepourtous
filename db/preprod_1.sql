SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE `duration` (
  `idDuration` int(11) NOT NULL,
  `duration` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `google` (
  `canalId` varchar(250) NOT NULL,
  `resourceId` varchar(250) NOT NULL,
  `resourceUri` varchar(250) DEFAULT NULL,
  `expiration` bigint(20) DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL,
  `calendarId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `lesson` varchar(50) NOT NULL,
  `event_dateTime` datetime NOT NULL,
  `duration` int(2) NOT NULL,
  `price` decimal(4,2) NOT NULL,
  `invoice_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `lesson` (
  `idLesson` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `shortDescription` varchar(50) DEFAULT NULL,
  `fullDescription_1` text DEFAULT NULL,
  `fullDescription_2` text DEFAULT NULL,
  `fullDescription_3` text DEFAULT NULL,
  `imagePath` varchar(100) DEFAULT NULL,
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
  `text_6` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lesson` (`idLesson`, `title`, `shortDescription`, `fullDescription_1`, `fullDescription_2`, `fullDescription_3`, `imagePath`, `slug`, `introduction`, `subtitle_1`, `text_1`, `subtitle_2`, `text_2`, `subtitle_3`, `text_3`, `subtitle_4`, `text_4`, `subtitle_5`, `text_5`, `subtitle_6`, `text_6`) VALUES
(1, 'Cours de conversation', 'Pratique orale et fluidité', 'Vous voulez améliorer votre fluidité, pratiquer le vocabulaire et la grammaire que vous avez appris ? C\'est par ici ! \r\nEnsemble, nous ferons de la pratique orale  pour que votre apprentissage soit utile et pas seulement théorique : comment communiquer en français à l\'oral, avec ses amis, au travail, en voyage, dans les magasins...\r\n\r\nChaque séance est l\'occasion de :\r\n\r\n\r\n', 'Renforcer votre fluidité et votre prononciation,\r\nélargir votre vocabulaire,\r\nconsolider votre grammaire en contexte,\r\ngagner en confiance dans vos échanges oraux.\r\n\r\n', 'Les supports sont variés : images, vidéos, mises en situation, jeux de rôle, documents authentiques ou d\'actualité.', '/images/conv.jpg', 'cours-de-conversation', 'Niveaux disponibles', 'A1', 'Se présenter, parler de ses goûts, faire ses courses, acheter un billet de train/de bus, commander au restaurant, demander son chemin, parler de la météo, inviter quelqu\'un ...', 'B1', 'L\'objectif est d\'utiliser un vocabulaire plus riche et d\'enchaîner naturellement les idées. Nous parlerons des actualités, vous donnerez votre avis, conseillerez, parlerez de votre travail...', 'C1', 'Nous travaillerons sur l\'argumentation, la reformulation, les expressions idiomatiques, avec des supports exigeants (podcasts, articles, extraits littéraires, etc.', 'A2', 'Raconter un événement, décrire une personne/un lieu/un objet, parler de ses projets, aller chez le médecin, parler des actualités ...', 'B2', 'Vous pouvez argumenter, débattre, exprimer des nuances. Les conversations portent sur des sujets d\'actualité, culturels ou professionnels. L\'objectif est d\'atteindre une communication fluide et précise.', 'C2', 'Ce cours vise à perfectionner votre expression, affiner vos tournures\r\net travailler la spontanéité et la richesse du langage \r\ndans des contextes complexes ou spécialisés.'),
(2, 'Cours de préparation aux examens', 'Préparation aux examens officiels', 'Vous souhaitez obtenir un diplôme ou une certification en français pour vos études, votre travail, ou un projet d\'immigration ? ', 'Je propose des cours sur mesure pour vous aider à réussir les examens officiels de français langue étrangère, tels que le DELF (A1 à B2), le TEF (Canada, Intégration, Naturalisation, Études, etc.) ou le TCF (Canada, tout public, Québec, IRN…).', NULL, '/images/exam.png', 'delf-tcf-tef', 'Un apprentissage adapté grâce à :', 'Un accompagnement personnalisé', 'Chaque parcours est adapté à vos objectifs, à votre niveau et au format de l\'examen visé. Nous travaillerons :\r\n- la compréhension orale et écrite,\r\n- l\'expression écrite (structuration, vocabulaire, clarté, correction),\r\n- l\'expression orale (fluidité, prononciation, interaction),\r\n- la gestion du temps et les stratégies d\'examen,\r\n- avec des simulations d\'épreuves pour vous entraîner dans les conditions réelles.', 'Des supports variés et efficaces', 'J\'utilise des ouvrages de préparation reconnus, comme :\r\n- ABC DELF et 100% DELF (Éditions Nathan et Didier),\r\n- des exercices issus des annales officielles,\r\n- des modèles d\'épreuves TEF/TCF actualisés,\r\n- et des documents personnalisés selon vos besoins.', 'Pour tous les niveaux (A1 à C2)', 'Que vous passiez un premier examen officiel ou que vous cherchiez à valider un niveau supérieur, je vous guide pas à pas avec des conseils clairs, des corrections détaillées et un suivi régulier jusqu\'au jour de l\'examen.', NULL, 'Gagnez en confiance, structurez vos idées, et mettez toutes les chances de votre côté pour réussir votre certification en français !', NULL, NULL, NULL, NULL),
(3, 'Français général', 'Accompagnement complet pour progresser', 'Vous souhaitez apprendre le français depuis le début, ou perfectionner votre niveau ? \r\n\r\n', 'Je vous propose un accompagnement complet pour progresser dans tous les domaines de la langue : grammaire, vocabulaire, compréhension, expression, prononciation et culture.', 'Chaque apprenant est différent, c\'est pourquoi nous choisirons ensemble la méthode la plus adaptée à vos besoins, à votre rythme et à vos centres d\'intérêt.', '/images/enfant.jpg', 'francais-general', 'Pour cela, plusieurs approches sont possibles :', NULL, 'Une méthode claire et structurée, idéale pour suivre une progression régulière et mesurable.', NULL, 'Des supports imprimables pour apprendre, s\'exercer et revoir les points essentiels à votre rythme.', NULL, 'Vidéos, articles, chansons, extraits de romans, publicités… pour découvrir le français tel qu\'il est réellement utilisé.', NULL, 'Apprendre le français, c\'est bien plus que mémoriser des règles : c\'est plonger dans une langue vivante et une culture riche, en explorant ce qui vous motive vraiment. Travaillons ensemble pour construire votre parcours sur mesure !', NULL, NULL, NULL, NULL);

CREATE TABLE `lessonPrices` (
  `id_lesson` int(11) NOT NULL,
  `id_price` int(11) NOT NULL,
  `id_duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `prices` (
  `idPrice` int(11) NOT NULL,
  `price` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
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
  `verifyToken` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `duration`
  ADD PRIMARY KEY (`idDuration`);

ALTER TABLE `event`
  ADD PRIMARY KEY (`idEvent`),
  ADD KEY `id_lesson` (`id_lesson`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `google`
  ADD PRIMARY KEY (`canalId`),
  ADD UNIQUE KEY `calendarId` (`calendarId`);

ALTER TABLE `googleSync`
  ADD UNIQUE KEY `unique_calendar` (`idCalendar`);

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
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`idLesson`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `lessonPrices`
  ADD CONSTRAINT `lessonPrices_ibfk_1` FOREIGN KEY (`id_lesson`) REFERENCES `lesson` (`idLesson`),
  ADD CONSTRAINT `lessonPrices_ibfk_2` FOREIGN KEY (`id_price`) REFERENCES `prices` (`idPrice`),
  ADD CONSTRAINT `lessonPrices_ibfk_3` FOREIGN KEY (`id_duration`) REFERENCES `duration` (`idDuration`);
