<?php

require_once APP_PATH . "/class/ClassDatabase.php";

/**
 * Sessions Stripe déjà traitées (table stripe_payments, migration 006).
 * Garantit qu'un paiement n'est appliqué qu'une fois, même si /api/payment-status
 * est appelé plusieurs fois ou en même temps.
 */
class ModelPayment extends ClassDatabase
{
    /**
     * Réserve le traitement d'une session Stripe.
     * Renvoie true si c'est le premier appel, false si la session a déjà été traitée
     * (clé primaire : un second INSERT IGNORE n'insère rien).
     */
    public function claim(string $stripeSessionId, int $idUser, ?string $eventId, float $amount): bool
    {
        $req = $this->conn->prepare('INSERT IGNORE INTO stripe_payments (stripe_session_id, user_id, event_id, amount, outcome, processed_at)
            VALUES (:session_id, :user_id, :event_id, :amount, \'processing\', UTC_TIMESTAMP())');
        $req->bindValue(':session_id', $stripeSessionId, PDO::PARAM_STR);
        $req->bindValue(':user_id', $idUser, PDO::PARAM_INT);
        $req->bindValue(':event_id', $eventId, $eventId === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $req->bindValue(':amount', $amount);
        $req->execute();
        return $req->rowCount() === 1;
    }

    public function setOutcome(string $stripeSessionId, string $outcome): bool
    {
        $req = $this->conn->prepare('UPDATE stripe_payments SET outcome = :outcome WHERE stripe_session_id = :session_id');
        $req->bindValue(':outcome', $outcome, PDO::PARAM_STR);
        $req->bindValue(':session_id', $stripeSessionId, PDO::PARAM_STR);
        return $req->execute();
    }
}
