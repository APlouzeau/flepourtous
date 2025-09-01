/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: flepourtous_preprod
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `duration`
--

LOCK TABLES `duration` WRITE;
/*!40000 ALTER TABLE `duration` DISABLE KEYS */;
INSERT INTO `duration` (`idDuration`, `duration`) VALUES (1,30),
(2,45),
(3,60);
/*!40000 ALTER TABLE `duration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` (`idEvent`, `userId`, `description`, `duration`, `createdAt`, `startDateTime`, `updatedAt`, `status`, `visioLink`, `id_lesson`) VALUES ('190jk8ppqh86d0dp4g1k1a8kac',7,'test du matin',60,'2025-05-24 22:16:00','2025-06-02 06:00:00','2025-05-24 22:46:21','En attente','https://flepourtous.daily.co/dEubv8DdHWTMN6XH8TFz',NULL),
('1jio9u2shop3eqsaspaln0q52s',7,'Eric et Mari',60,'2025-06-29 18:52:48','2025-07-11 09:30:00','2025-06-29 20:45:07','En attente','https://flepourtous.daily.co/flepourtous-1jio9u2shop3eqsaspaln0q52s',NULL),
('2gat0j191ceffdt02tmbc8uqln',7,'testeeeeeee',60,'2025-06-29 20:45:11','2025-06-30 13:00:00','2025-06-29 20:45:11','En attente','https://flepourtous.daily.co/flepourtous-2gat0j191ceffdt02tmbc8uqln',NULL),
('2prhq0jsit1lg513jk95te1bca',7,'test sans mail',60,'2025-05-24 19:31:16','2025-05-28 06:00:00','2025-06-29 17:47:07','En attente',NULL,NULL),
('3505ueqe8pk7of0vd8akna7o00',7,'rdv test',30,'2025-06-29 18:52:51','2025-06-30 12:30:00','2025-06-29 18:56:12','En attente','https://flepourtous.daily.co/U1sndyRbjdqYXllw9pXj',NULL),
('353h0qimtrl70s5gt1udqjn1et',7,'Ryuji - cours en direct',60,'2025-06-29 18:52:48','2025-07-01 08:30:00','2025-06-29 20:45:06','En attente','https://flepourtous.daily.co/flepourtous-353h0qimtrl70s5gt1udqjn1et',NULL),
('4cn5pr11brrvnr630rj6pjhbqv',7,'Pause',60,'2025-05-24 20:35:50','2025-06-06 10:00:00','2025-05-24 20:36:15','En attente','https://flepourtous.daily.co/dQKp7C9Q9lhpvlljfUff',NULL),
('4cn5pr11brrvnr630rj6pjhbqv_20250711T100000Z',7,'Pause',60,'2025-06-29 18:52:50','2025-07-11 10:30:00','2025-06-29 20:45:09','En attente','https://flepourtous.daily.co/flepourtous-4cn5pr11brrvnr630rj6pjhbqv_20250711T100000Z',NULL),
('53cq78eful4hffddijd33jc3a1',22,'Celui-là on y croit',30,'2025-06-29 18:52:51','2025-06-30 13:00:00','2025-06-29 18:56:13','En attente','https://flepourtous.daily.co/MCkp7hSJQuQwbGbOCkhR',NULL),
('5598hdjnsobmfl41d8e2g455g8',7,'Raz le bol',45,'2025-06-29 20:45:11','2025-06-30 12:00:00','2025-06-29 20:45:11','En attente','https://flepourtous.daily.co/flepourtous-5598hdjnsobmfl41d8e2g455g8',NULL),
('63014o1q89jhd1i0ig4uo91ei9',7,'Emi -  cours en direct',60,'2025-06-29 18:52:47','2025-06-30 18:30:00','2025-06-29 20:45:05','En attente','https://flepourtous.daily.co/flepourtous-63014o1q89jhd1i0ig4uo91ei9',NULL),
('64ddqe16c7msdtbuei0f6rjn31',7,'Pause',60,'2025-05-24 20:34:26','2025-06-02 10:00:00','2025-06-29 17:47:08','En attente',NULL,NULL),
('6dja5leqoq3vmvqonf7li98p40',7,'Pause',60,'2025-05-24 20:35:15','2025-06-04 10:00:00','2025-05-24 20:35:35','En attente','https://flepourtous.daily.co/1FGBY6mobCbK708X0sZm',NULL),
('6f2qoji5hiqp47klerj4a7ebst',7,'ergzrgerrz',30,'2025-06-29 20:45:10','2025-06-30 14:00:00','2025-06-29 20:45:10','En attente','https://flepourtous.daily.co/flepourtous-6f2qoji5hiqp47klerj4a7ebst',NULL),
('6gvmgrut84b472faf6ef41aoi9',7,'Saheli - cours en direct',45,'2025-06-29 18:52:47','2025-07-03 16:30:00','2025-06-29 20:45:04','En attente','https://flepourtous.daily.co/flepourtous-6gvmgrut84b472faf6ef41aoi9',NULL),
('6seg32b7u0jel82tmu0iuurfngr',22,'Test api',30,'2025-05-24 16:07:12','2025-05-27 22:05:00','2025-06-29 14:52:21','En attente','https://flepourtous.daily.co/xSWTL2IrTumLlioRQgVv',3),
('7a3402pc82ktj6t54m45ff0vpk',7,'test 2',60,'2025-05-24 17:18:39','2025-05-02 20:00:00','2025-05-24 17:18:39','En attente',NULL,NULL),
('c468c1rlddiroi5bov07sioj1c',22,'',45,'2025-06-08 21:41:55','2025-06-09 13:00:00','2025-06-29 14:51:47','En attente','https://flepourtous.daily.co/L5HAZYCihrzozyLPmKtL',1),
('cou6p7p3guv6opblviurtubmss',23,'',30,'2025-06-30 13:03:06','2025-07-01 09:45:00','2025-06-30 13:03:51','Payé','https://flepourtous.daily.co/IImJFhBya5c2Rh7v7DSp',2),
('dm0j26087k2os1b4kmictgg5oo',30,'<script>alert(\'qsfsdfqf\')</script>\r\ndf(\'\"-\"-(è_(\r\n\"è-çè_\r\nçà_çà(\'é-é\"\r\n&\r\n\"-\r\n\r\nè_-çàè_àè_à\r\n\r\n',30,'2025-07-08 20:38:33','2025-07-09 07:45:00','2025-07-08 20:45:07','Payé','https://flepourtous.daily.co/1gEsQ8YtTj1iL9RBj3iH',1),
('evg77f9fkr178joaesrkh1ruro',22,'',30,'2025-05-28 08:31:04','2025-05-28 19:30:00','2025-06-29 14:51:51','En attente','https://flepourtous.daily.co/6BqfhahaPyo7kuhN3aRy',2),
('fisovhbtgc6cfo1kci7nbejb18',22,'',45,'2025-06-08 20:18:58','2025-06-09 14:30:00','2025-06-29 14:51:55','En attente','https://flepourtous.daily.co/8fhImOYMkNB319LMuWHe',3),
('g42cn4ju967s5qab88bg2lldjo',22,'',60,'2025-06-07 18:00:20','2025-06-09 06:15:00','2025-06-29 14:51:59','En attente','https://flepourtous.daily.co/05nBCtTdCpwzJVPdyFa0',1),
('gkqk063vafket2addf3q598rck',7,'',60,'2025-06-30 18:40:59','2025-08-05 18:30:00','2025-06-30 18:40:59','En attente','https://flepourtous.daily.co/RC6ihKM0flyvWzWorvp2',2),
('j50namfkkglmkqfcqccur23tto',22,'',30,'2025-06-07 18:00:45','2025-06-09 12:30:00','2025-06-29 14:52:02','En attente','https://flepourtous.daily.co/ZI1iJKuQhPR6cXC2NvIU',2),
('k6ffbpkrkt701vvs0osl67jf0o',26,'',60,'2025-07-20 17:31:06','2025-07-21 12:00:00','2025-07-20 17:31:38','Payé','https://flepourtous.daily.co/t3Nere0KKlvMZMj5yBVp',1),
('l4cqp0v8kg12l8f2kmhd8ciqm0',22,'',30,'2025-06-07 18:00:40','2025-06-09 08:45:00','2025-06-29 14:52:05','En attente','https://flepourtous.daily.co/y9SNGx4jYR2L14Z8ieP2',3),
('m5g1k6nrs1k80uldc3quob1ai0',22,'',60,'2025-05-28 08:31:20','2025-05-29 06:00:00','2025-06-29 14:52:08','En attente','https://flepourtous.daily.co/8XjJ7oThUT3jSnw4BitQ',1),
('m5g1k6nrs1k80uldc3quob1ai0a',22,'',60,'2025-05-28 08:31:20','2025-05-30 06:00:00','2025-06-29 14:52:24','En attente','https://flepourtous.daily.co/8XjJ7oThUT3jSnw4BitQ',1),
('mmi7krhtbj255dtrjs5njpjr64',22,'',60,'2025-05-25 21:45:16','2025-05-26 07:15:00','2025-06-29 14:52:11','En attente','https://flepourtous.daily.co/bIhoY1l4EF1XqyeJq3K4',2),
('n2q05559ik582onhrlhviihhlc',22,'Test synchro google',30,'2025-06-29 16:47:41','2025-06-30 08:30:00','2025-06-29 16:48:07','Payé','https://flepourtous.daily.co/TWfpgMi2BxBX3HGyAtHK',1),
('ng1j7mt6b4o685h0npslmesamc',11,'',45,'2025-05-25 08:08:03','2025-05-26 12:00:00','2025-05-25 08:08:03','En attente','https://flepourtous.daily.co/KF8HK6LZ4kXHPw2Mf0rp',NULL),
('ntvcrlupi679moaohbsrdbhc8c',29,'',60,'2025-07-06 05:41:46','2025-07-07 18:30:00','2025-07-06 05:41:46','En attente','https://flepourtous.daily.co/hZUTuukEJuVefgtTLlez',2),
('pfueg0emu7020p4vli91oprg84',22,'',60,'2025-06-08 20:17:18','2025-06-09 07:15:00','2025-06-29 14:52:14','En attente','https://flepourtous.daily.co/yW3KRgXQti1nnStbMazR',3),
('qe5d1urv1jnuv4rtb5drk6l4eo',24,'',45,'2025-06-30 16:54:41','2025-07-03 16:30:00','2025-06-30 16:56:22','Payé','https://flepourtous.daily.co/EyVdxBIrmWAXpZErctn0',2),
('sb6gpkskgt7mkdq4jc6eccfn48',22,'',30,'2025-07-11 17:47:05','2025-07-12 15:15:00','2025-07-11 17:49:36','Payé','https://flepourtous.daily.co/oUAJ572MxmSWO5YLL6SA',1),
('tojmn1qtiu95nqhotp8qs2364c',7,'',60,'2025-07-03 18:26:41','2025-07-25 08:00:00','2025-07-03 18:26:41','En attente','https://flepourtous.daily.co/XqRWbjcl5dfmua35eSAN',2),
('v804a9t8h1e4diq8km0ud9fp94',22,'',60,'2025-06-08 22:06:53','2025-06-09 17:30:00','2025-06-29 14:52:17','En attente','https://flepourtous.daily.co/RwofAiyrARdimomgPUSz',1),
('vvdrclaaquh07mviid3q3lffm0',26,'',45,'2025-06-30 21:56:58','2025-07-01 07:15:00','2025-06-30 21:57:25','Payé','https://flepourtous.daily.co/KwDTfrzEFAbl2WsdVVs3',1);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `google`
--

LOCK TABLES `google` WRITE;
/*!40000 ALTER TABLE `google` DISABLE KEYS */;
INSERT INTO `google` (`canalId`, `resourceId`, `resourceUri`, `expiration`, `token`, `calendarId`) VALUES ('flepourtous_channel_68a11b8213f1d','rlubMlfOuXotsL7ysp39hC_at1Y','https://www.googleapis.com/calendar/v3/calendars/ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807%40group.calendar.google.com/events?alt=json',1755993602000,'28b1efc0f7ef527ff1f62b1bd382593c1ec2b1cd8061e15a76d58123cbf751f4','ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807@group.calendar.google.com');
/*!40000 ALTER TABLE `google` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `googleSync`
--

LOCK TABLES `googleSync` WRITE;
/*!40000 ALTER TABLE `googleSync` DISABLE KEYS */;
INSERT INTO `googleSync` (`idCalendar`, `nextSyncToken`) VALUES ('ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807@group.calendar.google.com','CM_-ia6RjY8DEM_-ia6RjY8DGAUg1tzb-gIo1tzb-gI='),
('ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807@group.calendar.google.com','CM_-ia6RjY8DEM_-ia6RjY8DGAUg1tzb-gIo1tzb-gI='),
('ef7995ba9623e0baa51a0050ba9c48ab6a191193f402b024ddcf27864434b807@group.calendar.google.com','CM_-ia6RjY8DEM_-ia6RjY8DGAUg1tzb-gIo1tzb-gI=');
/*!40000 ALTER TABLE `googleSync` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` (`idLesson`, `title`, `shortDescription`, `fullDescription`, `imagePath`, `slug`) VALUES (1,'Cours pour enfants','Venez découvrir mes cours pour les enfants','Pleins de cours pour les petits et moyen enfants','/images/enfant.jpg','cours-pour-enfants'),
(2,'Préparation aux examens','Vous préparez un concours ? C\'est ici !','Et bien il faut venir !','/images/ados.jpg','cours-de-preparation-aux-examens'),
(3,'Cours de conversation','Apprendre à discuter avec un français.','Vous voulez améliorer votre fluidité, pratiquer le vocabulaire et la grammaire que vous avez appris ? C\'est par ici ! \r\nEnsemble, nous ferons de la pratique orale  pour que votre apprentissage soit utile et pas seulement théorique : comment communiquer en français à l\'oral, avec ses amis, au travail, en voyage, dans les magasins...\r\n\r\nChaque séance est l’occasion de :\r\n\r\n\r\nrenforcer votre fluidité et votre prononciation,\r\nélargir votre vocabulaire,\r\nconsolider votre grammaire en contexte,\r\ngagner en confiance dans vos échanges oraux.\r\n\r\nLes supports sont variés : images, vidéos, mises en situation, jeux de rôle, documents authentiques ou d’actualité.','/images/ados.jpg','cours-de-conversation');
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lessonPrices`
--

LOCK TABLES `lessonPrices` WRITE;
/*!40000 ALTER TABLE `lessonPrices` DISABLE KEYS */;
INSERT INTO `lessonPrices` (`id_lesson`, `id_price`, `id_duration`) VALUES (1,1,1),
(1,2,2),
(1,3,3),
(2,1,1),
(2,2,2),
(2,3,3),
(3,5,1),
(3,6,2),
(3,7,3);
/*!40000 ALTER TABLE `lessonPrices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `prices`
--

LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
INSERT INTO `prices` (`idPrice`, `price`) VALUES (1,12.00),
(2,18.00),
(3,24.00),
(4,35.00),
(5,11.00),
(6,16.50),
(7,22.00);
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`idUser`, `firstName`, `lastName`, `role`, `mail`, `nickName`, `password`, `wallet`, `address`, `country`, `dateInscription`, `isVerified`, `verifyToken`) VALUES (7,'Ludivine','Plouzeau','admin','flepourtous.online@gmail.com','Lulu','$2y$10$u9PaQ0uWcwqn1kEa04x5aut3ega1Ls5SHsIQy1K3ZLgp.IwtYAjai',0.00,NULL,NULL,'2025-05-24 14:11:12',1,NULL),
(10,'Marianne','Lii','user','li.marianne18@gmail.com','Mli','$2y$10$ZAM2BQ8pPJf91keRVuP8MeApcvlp2.9b640ubbtc1Jq/ceXyobU9S',0.00,NULL,NULL,'2025-05-25 08:05:22',1,NULL),
(11,'Marianne','Lii','user','li.marianne88@gmail.com','Mli','$2y$10$beqA7buouSdCAvUSmO/ZNOgtGolhsI6G6gZc6S9PN3hJ2h8E.Aoe2',0.00,NULL,NULL,'2025-05-25 08:06:33',1,NULL),
(22,'Alexandre','Plouzeau','user','eyopaf@gmail.com','Eyonexis','$2y$10$w1Yz.KWaoTsiwls4OIKG.ukzT7IznF6gmzOYsqpgEHLvnHW1K.V6i',0.00,NULL,NULL,'2025-05-25 20:03:00',1,NULL),
(23,'Ludiv','PL','user','plouzeauludivine@gmail.com','Ludi','$2y$10$/wAEiObr6W82sw5dI7KOquvORv.fI7DQulTzig4O6h..SrTEZ4qn6',0.00,NULL,NULL,'2025-06-30 13:00:59',1,NULL),
(24,'Saheli','Mitra','user','saheli.mitra64@gmail.com','Saheli','$2y$10$EZczoxijUXo1QNlYgqn/WeJdZuG.31wih9LZEMo2HswQdaIl/3fVG',0.00,NULL,NULL,'2025-06-30 16:52:04',1,NULL),
(26,'Alex','Plouzeau','user','eyola@live.fr','Eyo','$2y$10$do5XYQnWkHEEeBXxneGRAOv6tX4lc0fzgkCRwEY0XTlTI.9BJvZ2a',0.00,NULL,NULL,'2025-06-30 21:55:35',1,NULL),
(28,'Alexandre','Plouzeau','user','plouzeau.alexandre@hotmail.fr','Eyo','$2y$10$X9bqT/.yJhAApBpgewfQMukwXb./xXZHFIlGkCPcThg9JQTigAQw6',0.00,NULL,NULL,'2025-07-02 06:54:44',1,NULL),
(29,'Emi','OTA','user','j.j.r.gam@gmail.com','EMI','$2y$10$JxZZ/CmoAHX/PGYmzPllHe1PRmIsFKbrtt1vW9aLKE6yjMAEFyJ7y',0.00,NULL,NULL,'2025-07-06 05:40:12',1,NULL),
(30,'<script>alert(\'bé\"aba\')</script>','\' OR 1=1','user','plouzor.amber610@passmail.net','j\'ensaisrien','$2y$10$NPcf5lRTZYGiTeVgrJUzTOMcRBQqscbmYKa4H915YE7glzt9f3HM.',0.00,NULL,NULL,'2025-07-08 20:23:47',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-27  9:53:28
