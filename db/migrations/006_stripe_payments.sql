-- ============================================================
-- 006 : sessions Stripe déjà traitées (FLE-99)
-- ============================================================
-- /api/payment-status ne se souvenait d'un paiement que dans la session PHP :
-- rappelé depuis une nouvelle session, il recréditait un pack ou retouchait
-- le porte-monnaie à chaque appel. Une ligne par session Stripe, clé primaire
-- = identifiant Stripe : un paiement n'est appliqué qu'une fois.
-- Rejouable sans risque.
-- ============================================================

CREATE TABLE IF NOT EXISTS `stripe_payments` (
  `stripe_session_id` varchar(255)  NOT NULL,
  `user_id`           int(11)       NOT NULL,
  `event_id`          varchar(50)   NULL DEFAULT NULL COMMENT 'NULL = achat de pack',
  `amount`            decimal(10,2) NOT NULL COMMENT 'Montant payé par carte, en euros',
  `outcome`           varchar(30)   NOT NULL DEFAULT 'processing' COMMENT 'processing, pack_credited, lesson_paid, credited_to_wallet',
  `processed_at`      datetime      NOT NULL COMMENT 'UTC',
  PRIMARY KEY (`stripe_session_id`),
  KEY `idx_stripe_payments_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('006_stripe_payments');
