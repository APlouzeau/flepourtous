UPDATE events SET status = 'paid'       WHERE status = 'Payé';
UPDATE events SET status = 'paid_admin' WHERE status = 'Payé - Admin';
UPDATE events SET status = 'unpaid'     WHERE status = 'Non payé';
UPDATE events SET status = 'pending'    WHERE status = 'En attente';
update events set status = 'google' where status = 'Google';
UPDATE events SET status = 'cancelled_refunded'     WHERE status = 'Annulé - Remboursé';
UPDATE events SET status = 'cancelled_not_refunded' WHERE status = 'Annulé - non Remboursé';
UPDATE events SET status = 'cancelled_admin'        WHERE status = 'Annulé - Admin';
UPDATE events SET status = 'cancelled_google_not_refunded' WHERE status = 'Annulé Google - Non remboursé';
UPDATE events SET status = 'cancelled_google_refunded'     WHERE status = 'Annulé Google - Remboursé';
UPDATE events SET status = 'cancelled_unpaid'     WHERE status = 'Annulé - Non payé';

