import { loadStripe } from "@stripe/stripe-js";
import PaymentReturn from "./PaymentReturn";
import { getCookieBackend } from "@/lib/session";

export default async function PaymentReturnPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
    const resolvedSearchParams = await searchParams;
    const sessionId = resolvedSearchParams.session_id || null;

    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    const cookie = await getCookieBackend();

    if (!sessionId) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6 text-red-500">Erreur</h1>
                <p>Session de paiement non trouvée.</p>
            </div>
        );
    }

    if (!stripePublicKey) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6 text-red-500">Erreur</h1>
                <p>Configuration Stripe manquante.</p>
            </div>
        );
    }

    const stripePromise = loadStripe(stripePublicKey);

    return <PaymentReturn sessionId={sessionId} cookie={cookie} />;
}
