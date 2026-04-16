import { getI18n } from "@/locales/server";
import PaymentReturn from "./PaymentReturn";
import { getCookieBackend } from "@/lib/session";

export default async function PaymentReturnPage({
    searchParams,
}: {
    searchParams: Promise<{
        session_id?: string;
        method?: string;
        status?: string;
    }>;
}) {
    const resolvedSearchParams = await searchParams;
    const sessionId = resolvedSearchParams.session_id || undefined;
    const method = resolvedSearchParams.method || null;
    const trad = await getI18n();

    const cookie = await getCookieBackend();

    if (!sessionId && method !== "wallet") {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6 text-red-500">{trad("payment.error")}</h1>
                <p>{trad("payment.paymentInformationsNotFound")}</p>
            </div>
        );
    }

    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    if (!stripePublicKey) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6 text-red-500">{trad("payment.error")}</h1>
                <p>{trad("payment.missingPaymentInformations")}</p>
            </div>
        );
    }

    return <PaymentReturn sessionId={sessionId} cookie={cookie} />;
}
