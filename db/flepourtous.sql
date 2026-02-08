-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : db:3306
-- Généré le : dim. 08 fév. 2026 à 16:59
-- Version du serveur : 10.6.24-MariaDB-ubu2204
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

--
-- Base de données : `flepourtous`
--

-- --------------------------------------------------------

--
-- Structure de la table `durations`
--

CREATE TABLE `durations` (
  `id_duration` int(11) NOT NULL,
  `duration` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `durations`
--

INSERT INTO `durations` (`id_duration`, `duration`) VALUES
(1, 30),
(2, 45),
(3, 60);

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE `events` (
  `id_event` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` tinyint(4) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `start_date_time` datetime NOT NULL,
  `timezone` varchar(50) NOT NULL DEFAULT 'UTC',
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'En attente',
  `visio_link` varchar(255) DEFAULT NULL,
  `id_lesson` int(11) DEFAULT NULL,
  `is_invoiced` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `google`
--

CREATE TABLE `google` (
  `canal_id` varchar(250) NOT NULL,
  `resource_id` varchar(250) NOT NULL,
  `resource_uri` varchar(250) DEFAULT NULL,
  `expiration` bigint(20) DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL,
  `calendar_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `googleSync`
--

CREATE TABLE `googleSync` (
  `id_calendar` varchar(90) NOT NULL,
  `next_sync_token` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `invoices`
--

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

-- --------------------------------------------------------

--
-- Structure de la table `lessons`
--

CREATE TABLE `lessons` (
  `id_lesson` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lessons`
--

INSERT INTO `lessons` (`id_lesson`, `image_path`) VALUES
(1, ''),
(2, ''),
(3, '');

-- --------------------------------------------------------

--
-- Structure de la table `lesson_price`
--

CREATE TABLE `lesson_price` (
  `id_lesson` int(11) NOT NULL,
  `id_price` int(11) NOT NULL,
  `id_duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lesson_price`
--

INSERT INTO `lesson_price` (`id_lesson`, `id_price`, `id_duration`) VALUES
(1, 1, 1),
(1, 3, 2),
(1, 5, 3),
(2, 2, 1),
(2, 4, 2),
(2, 6, 3),
(3, 1, 1),
(3, 3, 2),
(3, 5, 3);

-- --------------------------------------------------------

--
-- Structure de la table `lesson_translations`
--

CREATE TABLE `lesson_translations` (
  `id_lesson_translation` int(11) NOT NULL,
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
  `text_6` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lesson_translations`
--

INSERT INTO `lesson_translations` (`id_lesson_translation`, `id_lesson`, `locale`, `title`, `short_description`, `full_description_1`, `full_description_2`, `full_description_3`, `slug`, `introduction`, `subtitle_1`, `text_1`, `subtitle_2`, `text_2`, `subtitle_3`, `text_3`, `subtitle_4`, `text_4`, `subtitle_5`, `text_5`, `subtitle_6`, `text_6`) VALUES
(1, 1, 'fr', 'Cours de conversation', 'Pratique orale et fluidité', 'Vous voulez améliorer votre fluidité, pratiquer le vocabulaire et la grammaire que vous avez appris ? C\'est par ici ! \r\nEnsemble, nous ferons de la pratique orale  pour que votre apprentissage soit utile et pas seulement théorique : comment communiquer en français à l\'oral, avec ses amis, au travail, en voyage, dans les magasins...\r\n\r\nChaque séance est l\'occasion de :\r\n\r\n\r\n', 'Renforcer votre fluidité et votre prononciation,\r\nélargir votre vocabulaire,\r\nconsolider votre grammaire en contexte,\r\ngagner en confiance dans vos échanges oraux.\r\n\r\n', 'Les supports sont variés : images, vidéos, mises en situation, jeux de rôle, documents authentiques ou d\'actualité.', 'cours-de-conversation', 'Niveaux disponibles', 'A1', 'Se présenter, parler de ses goûts, faire ses courses, acheter un billet de train/de bus, commander au restaurant, demander son chemin, parler de la météo, inviter quelqu\'un ...', 'B1', 'L\'objectif est d\'utiliser un vocabulaire plus riche et d\'enchaîner naturellement les idées. Nous parlerons des actualités, vous donnerez votre avis, conseillerez, parlerez de votre travail...', 'C1', 'Nous travaillerons sur l\'argumentation, la reformulation, les expressions idiomatiques, avec des supports exigeants (podcasts, articles, extraits littéraires, etc.', 'A2', 'Raconter un événement, décrire une personne/un lieu/un objet, parler de ses projets, aller chez le médecin, parler des actualités ...', 'B2', 'Vous pouvez argumenter, débattre, exprimer des nuances. Les conversations portent sur des sujets d\'actualité, culturels ou professionnels. L\'objectif est d\'atteindre une communication fluide et précise.', 'C2', 'Ce cours vise à perfectionner votre expression, affiner vos tournures\net travailler la spontanéité et la richesse du langage \ndans des contextes complexes ou spécialisés.'),
(2, 2, 'fr', 'Cours de préparation aux examens', 'Préparation aux examens officiels', 'Vous souhaitez obtenir un diplôme ou une certification en français pour vos études, votre travail, ou un projet d\'immigration ? Je propose des cours sur mesure pour vous aider à réussir les examens officiels de français langue étrangère, tels que le DELF (A1 à B2), le TEF (Canada, Intégration, Naturalisation, Études, etc.) ou le TCF (Canada, tout public, Québec, IRN…).', 'Je propose des cours sur mesure pour vous aider à réussir les examens officiels de français langue étrangère, tels que le DELF (A1 à B2), le TEF (Canada, Intégration, Naturalisation, Études, etc.) ou le TCF (Canada, tout public, Québec, IRN…).', NULL, 'delf-tcf-tef', 'Un apprentissage adapté grâce à :', 'Un accompagnement personnalisé', 'Chaque parcours est adapté à vos objectifs, à votre niveau et au format de l\'examen visé. Nous travaillerons :\n- la compréhension orale et écrite,\n- l\'expression écrite (structuration, vocabulaire, clarté, correction),\n- l\'expression orale (fluidité, prononciation, interaction),\n- la gestion du temps et les stratégies d\'examen,\n- avec des simulations d\'épreuves pour vous entraîner dans les conditions réelles.', 'Des supports variés et efficaces', 'J\'utilise des ouvrages de préparation reconnus, comme :\n- ABC DELF et 100% DELF (Éditions Nathan et Didier),\n- des exercices issus des annales officielles,\n- des modèles d\'épreuves TEF/TCF actualisés,\n- et des documents personnalisés selon vos besoins.', 'Pour tous les niveaux (A1 à C2)', 'Que vous passiez un premier examen officiel ou que vous cherchiez à valider un niveau supérieur, je vous guide pas à pas avec des conseils clairs, des corrections détaillées et un suivi régulier jusqu\'au jour de l\'examen.', NULL, 'Gagnez en confiance, structurez vos idées, et mettez toutes les chances de votre côté pour réussir votre certification en français !', '0', NULL, '', NULL),
(3, 3, 'fr', 'Français général', 'Accompagnement complet pour progresser', 'Vous souhaitez apprendre le français depuis le début, ou perfectionner votre niveau ? \r\n\r\n', 'Je vous propose un accompagnement complet pour progresser dans tous les domaines de la langue : grammaire, vocabulaire, compréhension, expression, prononciation et culture.', 'Chaque apprenant est différent, c\'est pourquoi nous choisirons ensemble la méthode la plus adaptée à vos besoins, à votre rythme et à vos centres d\'intérêt.', 'francais-general', 'Pour cela, plusieurs approches sont possibles :', NULL, 'Une méthode claire et structurée, idéale pour suivre une progression régulière et mesurable.', NULL, 'Des supports imprimables pour apprendre, s\'exercer et revoir les points essentiels à votre rythme.', NULL, 'Vidéos, articles, chansons, extraits de romans, publicités… pour découvrir le français tel qu\'il est réellement utilisé.', NULL, 'Apprendre le français, c\'est bien plus que mémoriser des règles : c\'est plonger dans une langue vivante et une culture riche, en explorant ce qui vous motive vraiment. Travaillons ensemble pour construire votre parcours sur mesure !', '0', NULL, '', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `prices`
--

CREATE TABLE `prices` (
  `id_price` int(11) NOT NULL,
  `price` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `prices`
--

INSERT INTO `prices` (`id_price`, `price`) VALUES
(1, 11.00),
(2, 12.00),
(3, 16.50),
(4, 18.00),
(5, 22.00),
(6, 24.00);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `mail` varchar(50) NOT NULL,
  `nick_name` varchar(50) NOT NULL,
  `password` varchar(60) DEFAULT NULL,
  `wallet` decimal(10,2) NOT NULL DEFAULT 0.00,
  `address` varchar(50) DEFAULT NULL,
  `address_2` varchar(50) DEFAULT NULL,
  `address_3` varchar(50) DEFAULT NULL,
  `zip` int(11) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `is_verified` int(1) NOT NULL DEFAULT 0,
  `verifyToken` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id_user`, `first_name`, `last_name`, `role`, `mail`, `nick_name`, `password`, `wallet`, `address`, `address_2`, `address_3`, `zip`, `city`, `country`, `created_at`, `is_verified`, `verifyToken`) VALUES
(1, 'Alexandre', 'Plouzeau', 'user', 'eyola@live.fr', 'Eyo', '$2y$12$X9baMPUou.1gTIMffUttXupxHsv4Mnwn766Sa1AbquSJ7oyrjXdnC', 368.50, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-18 23:40:31', 1, '830999bce58e3c57415d1028247535bac27fae52192af566f90737ca854364c6'),
(3, 'Ludivine', 'Plouzeau', 'admin', 'flepourtous.dev@gmail.com', 'Lulu', '$2y$12$9HihvTfGVjK0ejnJtbQ/jOaXVCGbHg54VMzks3LyZNLw/0tTGGhVO', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 17:28:49', 1, '79fd01a7ea72aab8184748664d435f946951214f6fb006752f99a377e5e74734'),
(4, 'Duncan', 'Gaubert', 'user', 'egaube0494@gmail.com', 'Dunky', '$2y$12$GoKzGwx.9PKbfUVIMgrHPuqWh1YMLtjmoeyADFTDUluiN7vpw4w4C', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 17:33:22', 1, '6efeeeabbf0638028cb2906e3ac36e861e9e8759a75837f935280060cb9d0ee3');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `durations`
--
ALTER TABLE `durations`
  ADD PRIMARY KEY (`id_duration`);

--
-- Index pour la table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id_event`),
  ADD KEY `userId` (`user_id`),
  ADD KEY `id_lesson` (`id_lesson`);

--
-- Index pour la table `google`
--
ALTER TABLE `google`
  ADD PRIMARY KEY (`canal_id`),
  ADD UNIQUE KEY `calendarId` (`calendar_id`);

--
-- Index pour la table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id_invoices`);

--
-- Index pour la table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id_lesson`);

--
-- Index pour la table `lesson_price`
--
ALTER TABLE `lesson_price`
  ADD PRIMARY KEY (`id_lesson`,`id_price`,`id_duration`),
  ADD KEY `id_duration` (`id_duration`),
  ADD KEY `id_price` (`id_price`);

--
-- Index pour la table `lesson_translations`
--
ALTER TABLE `lesson_translations`
  ADD PRIMARY KEY (`id_lesson_translation`),
  ADD UNIQUE KEY `uniq_lesson_locale` (`id_lesson`,`locale`),
  ADD UNIQUE KEY `uniq_locale_slug` (`locale`,`slug`),
  ADD KEY `id_lesson` (`id_lesson`);

--
-- Index pour la table `prices`
--
ALTER TABLE `prices`
  ADD PRIMARY KEY (`id_price`) USING BTREE;

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `durations`
--
ALTER TABLE `durations`
  MODIFY `id_duration` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id_lesson` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `lesson_translations`
--
ALTER TABLE `lesson_translations`
  MODIFY `id_lesson_translation` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `prices`
--
ALTER TABLE `prices`
  MODIFY `id_price` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_3` FOREIGN KEY (`id_lesson`) REFERENCES `lessons` (`id_lesson`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `lesson_price`
--
ALTER TABLE `lesson_price`
  ADD CONSTRAINT `lesson_price_ibfk_1` FOREIGN KEY (`id_price`) REFERENCES `prices` (`id_price`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lesson_price_ibfk_3` FOREIGN KEY (`id_duration`) REFERENCES `durations` (`id_duration`),
  ADD CONSTRAINT `lesson_price_ibfk_4` FOREIGN KEY (`id_lesson`) REFERENCES `lessons` (`id_lesson`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `lesson_translations`
--
ALTER TABLE `lesson_translations`
  ADD CONSTRAINT `fk_lt_lesson` FOREIGN KEY (`id_lesson`) REFERENCES `lessons` (`id_lesson`) ON DELETE CASCADE ON UPDATE CASCADE;
