import PaymentForm from "./PaymentForm";
import { getCookieBackend } from "@/lib/session";

export default async function PaymentPage() {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    let pageError: string | null = null;

    if (!pk) {
        // Cette erreur sera affichée par PaymentForm si pk est null
        console.error("[PaymentPage - Server] ERREUR CRITIQUE: NEXT_PUBLIC_STRIPE_PUBLIC_KEY n'est pas définie !");
        pageError = "Configuration Stripe (clé publique) manquante côté serveur.";
    }

    const cookie = await getCookieBackend();
    if (!cookie && !pageError) {
        // Ne pas écraser l'erreur de clé
        pageError = "Session utilisateur non trouvée ou expirée.";
    }

    return (
        <div id="checkout">
            {/* On ne passe plus stripePromise, mais la clé publique directement */}
            <PaymentForm stripePublicKey={pk} cookie={cookie} serverError={pageError} />
        </div>
    );
}
