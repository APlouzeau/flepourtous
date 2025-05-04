SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

DROP TABLE IF EXISTS event;
CREATE TABLE IF NOT EXISTS `event` (
  eventId varchar(50) NOT NULL,
  userId int(11) NOT NULL,
  description varchar(50) DEFAULT NULL,
  duration tinyint(4) NOT NULL,
  createdAt datetime NOT NULL DEFAULT current_timestamp(),
  startDateTime datetime NOT NULL,
  updatedAt datetime DEFAULT NULL,
  status varchar(50) NOT NULL,
  visioLink varchar(255) DEFAULT NULL,
  PRIMARY KEY (eventId),
  KEY id_1 (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO event (eventId, userId, description, duration, createdAt, startDateTime, updatedAt, status, visioLink) VALUES
('7dd00f7jjt9j3r612b2v3r1sic', 4, '', 30, '2025-05-04 17:21:18', '2025-05-05 09:00:00', '2025-05-04 17:21:18', 'active', NULL),
('84dk6l9o53a8chfld86hb6iv2o', 4, '', 30, '2025-05-04 16:48:16', '2025-05-05 08:00:00', '2025-05-04 16:48:16', 'active', NULL);

DROP TABLE IF EXISTS lesson;
CREATE TABLE IF NOT EXISTS lesson (
  id_lesson int(11) NOT NULL AUTO_INCREMENT,
  title varchar(50) DEFAULT NULL,
  shortDescription varchar(50) DEFAULT NULL,
  fullDescription text DEFAULT NULL,
  imagePath varchar(100) DEFAULT NULL,
  slug varchar(50) NOT NULL,
  PRIMARY KEY (id_lesson),
  UNIQUE KEY title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO lesson (id_lesson, title, shortDescription, fullDescription, imagePath, slug) VALUES
(1, 'Cours pour enfants', 'Venez découvrir mes cours pour les enfants', 'Pleins de cours pour les petits et moyen enfants', '/images/enfant.jpg', 'cours-pour-enfants'),
(2, 'DELF', 'DELF / TCF / TEF ?', 'Et bien il faut venir !', '/images/ados.jpg', 'delf-tcf-tef');

DROP TABLE IF EXISTS prices;
CREATE TABLE IF NOT EXISTS prices (
  id_price int(11) NOT NULL,
  lessonId int(11) DEFAULT NULL,
  price decimal(2,2) DEFAULT NULL,
  duration time DEFAULT NULL,
  id_1 int(11) NOT NULL,
  PRIMARY KEY (id_price),
  KEY id_1 (id_1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  idUser int(11) NOT NULL AUTO_INCREMENT,
  firstName varchar(50) NOT NULL,
  lastName varchar(50) NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'user',
  mail varchar(50) NOT NULL,
  nickName varchar(50) NOT NULL,
  password varchar(60) DEFAULT NULL,
  address varchar(100) DEFAULT NULL,
  country varchar(50) DEFAULT NULL,
  dateInscription datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (idUser),
  UNIQUE KEY mail (mail),
  UNIQUE KEY nickName (nickName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO users (idUser, firstName, lastName, role, mail, nickName, password, address, country, dateInscription) VALUES
(1, 'Ludivine', 'Plouzeau', 'user', 'flepourtous.online@gmail.com', 'Lulu', '1234', NULL, NULL, '2025-03-28 22:37:25'),
(2, 'Alexandre', 'Plouzeau', 'user', 'alex@gmail.com', 'Eyo', '1234', NULL, NULL, '2025-04-01 22:46:16'),
(4, 'Laurence', 'Pondarrasse', 'user', 'lolo@gmail.com', 'lolo', '1234', NULL, NULL, '2025-04-24 21:28:29');


ALTER TABLE event
  ADD CONSTRAINT event_ibfk_1 FOREIGN KEY (userId) REFERENCES `users` (idUser);

ALTER TABLE prices
  ADD CONSTRAINT prices_ibfk_1 FOREIGN KEY (id_1) REFERENCES lesson (id_lesson);
