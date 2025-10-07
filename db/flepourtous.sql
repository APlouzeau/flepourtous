SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE duration (
  idDuration int(11) NOT NULL,
  duration int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO duration (idDuration, duration) VALUES
(1, 30),
(2, 45),
(3, 60);

CREATE TABLE `event` (
  idEvent varchar(50) NOT NULL,
  userId int(11) NOT NULL,
  description text DEFAULT NULL,
  duration tinyint(4) NOT NULL,
  createdAt datetime NOT NULL DEFAULT current_timestamp(),
  startDateTime datetime NOT NULL,
  timezone varchar(50) NOT NULL DEFAULT 'UTC',
  updatedAt datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  status varchar(50) NOT NULL DEFAULT 'En attente',
  visioLink varchar(255) DEFAULT NULL,
  id_lesson int(11) DEFAULT NULL,
  is_invoiced int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO event (idEvent, userId, description, duration, createdAt, startDateTime, timezone, updatedAt, status, visioLink, id_lesson, is_invoiced) VALUES
('18inpml9muml2gi7pmmo911f2g', 1, '', 60, '2025-10-04 21:14:56', '2025-10-11 19:00:00', 'Europe/Paris', '2025-10-04 21:14:59', 'Payé', 'https://flepourtous.daily.co/PXu2sUFoJKLAHOYgyMIF', 2, 0),
('71i5dmogdsp590a2h6ureuk3mc', 1, '', 60, '2025-09-01 20:39:18', '2025-09-02 07:30:00', 'UTC', '2025-09-30 21:39:53', 'Payé', 'https://flepourtous.daily.co/VHOWVMDVbF61qeGOxwJY', 1, 0),
('7238h5mk339h2tldnjjodfl85c', 1, '', 60, '2025-10-04 21:14:23', '2025-10-06 08:00:00', 'Europe/Paris', '2025-10-04 21:14:27', 'Payé', 'https://flepourtous.daily.co/OtVwWqB96Qv3L9IqGRy9', 1, 0),
('986iitl9q24t0k0r50vrt1s5s4', 1, '', 30, '2025-09-01 20:10:42', '2025-09-03 06:00:00', 'UTC', '2025-09-30 21:39:55', 'Payé', 'https://flepourtous.daily.co/73Ya6FigOwuZGbPhsxfn', 1, 0),
('9cmei0esfomp6ti4g4t8f173ds', 1, '', 60, '2025-10-04 21:15:21', '2025-10-30 07:00:00', 'Europe/Paris', '2025-10-04 21:24:41', 'Annulé - Remboursé', 'https://flepourtous.daily.co/9ehyVQAYibZOvPXADHGz', 2, 0),
('lf3pkb4fh66pi4kat3108p6k4c', 4, 'JE suis anglais', 60, '2025-10-07 15:57:31', '2025-10-30 14:30:00', 'Europe/Paris', '2025-10-07 15:57:31', 'En attente', 'https://flepourtous.daily.co/Ab1zAVB10x5aXJ5rVerK', 2, 0),
('ljtqa77blfbv8pahc5dk49cdck', 1, '', 30, '2025-10-04 21:15:43', '2025-10-06 09:00:00', 'Europe/Paris', '2025-10-04 21:16:13', 'Payé', 'https://flepourtous.daily.co/UOyjRrPdLJQCAQYCCzYx', 1, 0),
('mnvb6u6i4acf75en4dbnt4k6pk', 1, '', 30, '2025-10-04 21:47:35', '2025-10-07 06:00:00', 'Europe/Paris', '2025-10-04 21:47:38', 'Payé', 'https://flepourtous.daily.co/7Vaz4YZbOv9t2dFe8akQ', 1, 0),
('s8k36aiur95829e63flb8v3u1g', 1, '', 60, '2025-09-30 19:13:16', '2025-10-01 12:00:00', 'Europe/Paris', '2025-09-30 21:47:15', 'Payé', 'https://flepourtous.daily.co/3Dj2PemSh56rr2orxgKm', 1, 1);

CREATE TABLE google (
  canalId varchar(250) NOT NULL,
  resourceId varchar(250) NOT NULL,
  resourceUri varchar(250) DEFAULT NULL,
  expiration bigint(20) DEFAULT NULL,
  token varchar(64) DEFAULT NULL,
  calendarId varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO google (canalId, resourceId, resourceUri, expiration, token, calendarId) VALUES
('flepourtous_channel_68325d811eb29', 'rlubMlfOuXotsL7ysp39hC_at1Y', 'https://www.googleapis.com/calendar/v3/calendars/ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807%40group.calendar.google.com/events?alt=json', 1748736001000, 'Jr7mc0St05S9cuDCShp1FoC2rcBxfReK1YU6oiTU0bwGtAhHvRkHIdCtGAKd98FP', NULL);

CREATE TABLE googleSync (
  idCalendar varchar(90) NOT NULL,
  nextSyncToken varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE invoices (
  id_invoices int(11) NOT NULL,
  name varchar(50) NOT NULL,
  first_name varchar(50) NOT NULL,
  address varchar(50) NOT NULL,
  address_2 varchar(50) NOT NULL,
  address_3 varchar(50) NOT NULL,
  zip int(11) NOT NULL,
  city varchar(50) NOT NULL,
  country varchar(50) NOT NULL,
  lesson varchar(1150) NOT NULL,
  event_dateTime datetime NOT NULL,
  duration int(2) NOT NULL,
  price decimal(4,2) NOT NULL,
  invoice_date date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE lesson (
  idLesson int(11) NOT NULL,
  title varchar(50) DEFAULT NULL,
  shortDescription varchar(50) DEFAULT NULL,
  fullDescription text DEFAULT NULL,
  imagePath varchar(100) DEFAULT NULL,
  slug varchar(50) NOT NULL,
  text_1 text DEFAULT NULL,
  text_2 text DEFAULT NULL,
  text_3 text DEFAULT NULL,
  title_1 text DEFAULT NULL,
  subtitle_1 text DEFAULT NULL,
  text_4 text DEFAULT NULL,
  text_5 text DEFAULT NULL,
  text_6 text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO lesson (idLesson, title, shortDescription, fullDescription, imagePath, slug, text_1, text_2, text_3, title_1, subtitle_1, text_4, text_5, text_6) VALUES
(1, 'Cours de conversation', 'Pratique orale et fluidité', 'Vous voulez améliorer votre fluidité, pratiquer le vocabulaire et la grammaire que vous avez appris ? C\'est par ici ! \nEnsemble, nous ferons de la pratique orale  pour que votre apprentissage soit utile et pas seulement théorique : comment communiquer en français à l\'oral, avec ses amis, au travail, en voyage, dans les magasins...\n\n Chaque séance est l\'occasion de :\n\n\nrenforcer votre fluidité et votre prononciation,\nélargir votre vocabulaire,\nconsolider votre grammaire en contexte,\ngagner en confiance dans vos échanges oraux.\n\nLes supports sont variés : images, vidéos, mises en situation, jeux de rôle, documents authentiques ou d\'actualité.', '/images/enfant.jpg', 'cours-pour-enfants', 'A1 : se présenter, parler de ses goûts, faire ses courses, acheter un billet de train/de bus, commander au restaurant, demander son chemin, parler de la météo, inviter quelqu\'un ...', 'A2 : raconter un événement, décrire une personne/un lieu/un objet, parler de ses projets, aller chez le médecin, parler des actualités ...', 'B1 : L\'objectif est d\'utiliser un vocabulaire plus riche et d\'enchaîner naturellement les idées. Nous parlerons des actualités, vous donnerez votre avis, conseillerez, parlerez de votre travail...', 'Niveaux disponibles', NULL, 'B2 : Vous pouvez argumenter, débattre, exprimer des nuances. Les conversations portent sur des sujets d\'actualité, culturels ou professionnels. L\'objectif est d\'atteindre une communication fluide et précise.', 'C1 : Nous travaillerons sur l\'argumentation, la reformulation, les expressions idiomatiques, avec des supports exigeants (podcasts, articles, extraits littéraires, etc.', 'C2 :  Ce cours vise à perfectionner votre expression, affiner vos tournures\net travailler la spontanéité et la richesse du langage \ndans des contextes complexes ou spécialisés.'),
(2, 'Cours de préparation aux examens', 'Préparation aux examens officiels', 'Vous souhaitez obtenir un diplôme ou une certification en français pour vos études, votre travail, ou un projet d\'immigration ? Je propose des cours sur mesure pour vous aider à réussir les examens officiels de français langue étrangère, tels que le DELF (A1 à B2), le TEF (Canada, Intégration, Naturalisation, Études, etc.) ou le TCF (Canada, tout public, Québec, IRN…).', '/images/ados.jpg', 'delf-tcf-tef', 'Un accompagnement personnalisé\n\nChaque parcours est adapté à vos objectifs, à votre niveau et au format de l\'examen visé. Nous travaillerons :\n- la compréhension orale et écrite,\n- l\'expression écrite (structuration, vocabulaire, clarté, correction),\n- l\'expression orale (fluidité, prononciation, interaction),\n- la gestion du temps et les stratégies d\'examen,\n- avec des simulations d\'épreuves pour vous entraîner dans les conditions réelles.', 'Des supports variés et efficaces\n\nJ\'utilise des ouvrages de préparation reconnus, comme :\n- ABC DELF et 100% DELF (Éditions Nathan et Didier),\n- des exercices issus des annales officielles,\n- des modèles d\'épreuves TEF/TCF actualisés,\n- et des documents personnalisés selon vos besoins.', 'Pour tous les niveaux (A1 à C2)\n\nQue vous passiez un premier examen officiel ou que vous cherchiez à valider un niveau supérieur, je vous guide pas à pas avec des conseils clairs, des corrections détaillées et un suivi régulier jusqu\'au jour de l\'examen.', 'Pour cela, plusieurs approches sont possibles :', NULL, 'Gagnez en confiance, structurez vos idées, et mettez toutes les chances de votre côté pour réussir votre certification en français !', NULL, NULL),
(3, 'Apprendre le Français', 'Accompagnement complet pour progresser', 'Vous souhaitez apprendre le français depuis le début, ou perfectionner votre niveau ? Je vous propose un accompagnement complet pour progresser dans tous les domaines de la langue : grammaire, vocabulaire, compréhension, expression, prononciation et culture.\n\nChaque apprenant est différent, c\'est pourquoi nous choisirons ensemble la méthode la plus adaptée à vos besoins, à votre rythme et à vos centres d\'intérêt.', NULL, 'francais-general', 'Avec un manuel : une méthode claire et structurée, idéale pour suivre une progression régulière et mesurable.', 'Avec des fiches pédagogiques : des supports imprimables pour apprendre, s\'exercer et revoir les points essentiels à votre rythme.', 'Avec du matériel authentique : vidéos, articles, chansons, extraits de romans, publicités… pour découvrir le français tel qu\'il est réellement utilisé.', 'Pour cela, plusieurs approches sont possibles :', NULL, 'Apprendre le français, c\'est bien plus que mémoriser des règles : c\'est plonger dans une langue vivante et une culture riche, en explorant ce qui vous motive vraiment. Travaillons ensemble pour construire votre parcours sur mesure !', NULL, NULL);

CREATE TABLE lessonPrices (
  id_lesson int(11) NOT NULL,
  id_price int(11) NOT NULL,
  id_duration int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO lessonPrices (id_lesson, id_price, id_duration) VALUES
(1, 1, 1),
(1, 3, 2),
(1, 5, 3),
(2, 2, 1),
(2, 4, 2),
(2, 6, 3),
(3, 1, 1),
(3, 3, 2),
(3, 5, 3);

CREATE TABLE prices (
  idPrice int(11) NOT NULL,
  price decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO prices (idPrice, price) VALUES
(1, 11.00),
(2, 12.00),
(3, 16.50),
(4, 18.00),
(5, 22.00),
(6, 24.00);

CREATE TABLE users (
  idUser int(11) NOT NULL,
  firstName varchar(50) NOT NULL,
  lastName varchar(50) NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'user',
  mail varchar(50) NOT NULL,
  nickName varchar(50) NOT NULL,
  password varchar(60) DEFAULT NULL,
  wallet decimal(10,2) NOT NULL DEFAULT 0.00,
  address varchar(50) DEFAULT NULL,
  address_2 varchar(50) DEFAULT NULL,
  address_3 varchar(50) DEFAULT NULL,
  zip int(11) DEFAULT NULL,
  city varchar(50) DEFAULT NULL,
  country varchar(50) DEFAULT NULL,
  dateInscription datetime NOT NULL DEFAULT current_timestamp(),
  isVerified int(1) NOT NULL DEFAULT 0,
  verifyToken varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO users (idUser, firstName, lastName, role, mail, nickName, password, wallet, address, address_2, address_3, zip, city, country, dateInscription, isVerified, verifyToken) VALUES
(1, 'cezcxze', 'cezczecz', 'user', 'eyola@live.fr', 'cxzeczec', '$2y$12$X9baMPUou.1gTIMffUttXupxHsv4Mnwn766Sa1AbquSJ7oyrjXdnC', 209.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-18 23:40:31', 1, '830999bce58e3c57415d1028247535bac27fae52192af566f90737ca854364c6'),
(3, 'Ludivine', 'Plouzeau', 'admin', 'flepourtous.online@gmail.com', 'Lulu', '$2y$12$9HihvTfGVjK0ejnJtbQ/jOaXVCGbHg54VMzks3LyZNLw/0tTGGhVO', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 17:28:49', 1, '79fd01a7ea72aab8184748664d435f946951214f6fb006752f99a377e5e74734'),
(4, 'Duncan', 'Gaubert', 'user', 'egaube0494@gmail.com', 'Dunky', '$2y$12$GoKzGwx.9PKbfUVIMgrHPuqWh1YMLtjmoeyADFTDUluiN7vpw4w4C', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 17:33:22', 1, '6efeeeabbf0638028cb2906e3ac36e861e9e8759a75837f935280060cb9d0ee3');


ALTER TABLE duration
  ADD PRIMARY KEY (idDuration);

ALTER TABLE event
  ADD PRIMARY KEY (idEvent),
  ADD KEY id_lesson (id_lesson),
  ADD KEY userId (userId);

ALTER TABLE google
  ADD PRIMARY KEY (canalId),
  ADD UNIQUE KEY calendarId (calendarId);

ALTER TABLE invoices
  ADD PRIMARY KEY (id_invoices);

ALTER TABLE lesson
  ADD PRIMARY KEY (idLesson);

ALTER TABLE lessonPrices
  ADD PRIMARY KEY (id_lesson,id_price,id_duration),
  ADD KEY id_price (id_price),
  ADD KEY id_duration (id_duration);

ALTER TABLE prices
  ADD PRIMARY KEY (idPrice) USING BTREE;

ALTER TABLE users
  ADD PRIMARY KEY (idUser),
  ADD UNIQUE KEY mail (mail);


ALTER TABLE duration
  MODIFY idDuration int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE lesson
  MODIFY idLesson int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE prices
  MODIFY idPrice int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE users
  MODIFY idUser int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE event
  ADD CONSTRAINT event_ibfk_1 FOREIGN KEY (id_lesson) REFERENCES lesson (idLesson) ON DELETE SET NULL,
  ADD CONSTRAINT event_ibfk_2 FOREIGN KEY (userId) REFERENCES `users` (idUser) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE lessonPrices
  ADD CONSTRAINT lessonPrices_ibfk_1 FOREIGN KEY (id_lesson) REFERENCES lesson (idLesson) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT lessonPrices_ibfk_2 FOREIGN KEY (id_price) REFERENCES prices (idPrice),
  ADD CONSTRAINT lessonPrices_ibfk_3 FOREIGN KEY (id_duration) REFERENCES duration (idDuration);
