ALTER TABLE users CHANGE accept_terms_rules_privacy internal_regulations_accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP();
ALTER TABLE users CHANGE accept_terms_rules_privacy_date internal_regulations_version VARCHAR(10) DEFAULT '1.1';
ALTER TABLE users RENAME COLUMN terms_version terms_of_service_version VARCHAR(10) DEFAULT '1.1';
ALTER TABLE users RENAME COLUMN rules_version terms_of_service_accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP();
ALTER TABLE users RENAME COLUMN privacy_version privacy_policy_accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP();
ALTER TABLE users ADD COLUMN privacy_policy_version VARCHAR(10) NOT NULL DEFAULT '1.1';

update events set status = 'google' where status = 'Google';
UPDATE events SET status = 'cancelled_google_not_refunded' WHERE status = 'Annulé Google - Non remboursé';
UPDATE events SET status = 'paid'       WHERE status = 'Payé';
UPDATE events SET status = 'cancelled_not_refunded' WHERE status = 'Annulé - non Remboursé';
UPDATE events SET status = 'pending'    WHERE status = 'En attente';
UPDATE events SET status = 'cancelled_refunded'     WHERE status = 'Annulé - Remboursé';
UPDATE events SET status = 'cancelled_admin'        WHERE status = 'Annulé - Admin';
UPDATE events SET status = 'unpaid'     WHERE status = 'Non payé';
UPDATE events SET status = 'cancelled_google_refunded'     WHERE status = 'Annulé Google - Remboursé';
UPDATE events SET status = 'cancelled_unpaid'     WHERE status = 'Annulé - Non payé';
UPDATE events SET status = 'paid_admin' WHERE status = 'Payé - Admin';