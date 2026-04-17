"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/axios";
import { useTranslations } from "@/locales/client";

interface PaymentReturnProps {
    sessionId?: string;
    cookie: string | null;
}

export default function PaymentReturn({ sessionId, cookie }: PaymentReturnProps) {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState<string>("");
    const [hasChecked, setHasChecked] = useState(false); // ← État pour éviter les appels multiples
    const router = useRouter();
    const searchParams = useSearchParams();
    const trad = useTranslations();

    useEffect(() => {
        // ✅ Éviter les appels multiples
        if (hasChecked) return;

        const paymentMethod = searchParams.get("method");
        const paymentStatus = searchParams.get("status");

        if (paymentStatus === "success" && paymentMethod === "wallet") {
            setStatus("success");
            setMessage(trad("payment.successMessageWallet"));
            setHasChecked(true);
            setTimeout(() => router.push("/calendrier"), 3000);
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                setHasChecked(true); // ← Marquer comme vérifié AVANT l'appel

                const response = await apiClient.post(
                    "/api/payment-status",
                    { session_id: sessionId },
                    {
                        headers: {
                            Cookie: `PHPSESSID=${cookie}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    },
                );

                const result = response.data;

                if (result.payment_status === "paid" || result.status === "already_processed") {
                    setStatus("success");
                    setMessage(trad("payment.successFullPayment"));
                    setTimeout(() => router.push("/calendrier"), 3000);
                } else {
                    setStatus("error");
                    setMessage(`${trad("payment.errorMessage")} Statut: ${result.payment_status || "inconnu"}`);
                }
            } catch (error) {
                console.error("Erreur:", error);
                setStatus("error");
                setMessage(trad("payment.missingCheck"));
            }
        };

        if (sessionId) {
            checkPaymentStatus();
        }
    }, [sessionId, router, cookie, searchParams, hasChecked, trad]); // ← Ajouter hasChecked

    return (
        <div className="p-4 md:p-8 text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {status === "loading" && trad("payment.processingMessage")}
                {status === "success" && trad("payment.successFullPayment")}
                {status === "error" && trad("payment.errorMessage")}
            </h1>

            <div className="mb-6">
                {status === "loading" && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {status === "success" && <div className="text-green-500 text-6xl mb-4">✓</div>}

                {status === "error" && <div className="text-red-500 text-6xl mb-4">✗</div>}
            </div>

            <p
                className={`text-lg ${
                    status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-600"
                }`}
            >
                {message}
            </p>

            {status === "success" && <p className="text-sm text-gray-500 mt-4">{trad("payment.redirectToCalendar")}</p>}

            {status === "error" && (
                <div className="mt-6 space-y-2">
                    <button
                        onClick={() => router.push("/calendrier")}
                        className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        {trad("payment.returnToCalendar")}
                    </button>
                    <button
                        onClick={() => router.push("/paiement")}
                        className="block w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        {trad("payment.retryPayment")}
                    </button>
                </div>
            )}
        </div>
    );
}
