"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/axios";

interface PaymentReturnProps {
    sessionId?: string;
    cookie: string | null;
}

export default function PaymentReturn({ sessionId, cookie }: PaymentReturnProps) {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const paymentMethod = searchParams.get("method");
        const paymentStatus = searchParams.get("status");

        //  Gérer le cas du paiement par portefeuille
        if (paymentStatus === "success" && paymentMethod === "wallet") {
            setStatus("success");
            setMessage("Paiement réussi avec votre portefeuille ! Votre rendez-vous est enregistré.");
            setTimeout(() => {
                router.push("/calendrier");
            }, 3000);
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                const response = await apiClient.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/payment-status`,
                    { session_id: sessionId },
                    {
                        headers: {
                            Cookie: `PHPSESSID=${cookie}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                const result = response.data;

                if (result.payment_status === "paid") {
                    setStatus("success");
                    setMessage("Paiement réussi ! Votre rendez-vous est enregistré !");

                    setTimeout(() => {
                        router.push("/calendrier");
                    }, 3000);
                } else if (result.status === "open") {
                    setStatus("error");
                    setMessage("Session de paiement encore ouverte. Le paiement n'est pas terminé.");
                } else {
                    setStatus("error");
                    setMessage(`Statut du paiement: ${result.payment_status || "inconnu"}`);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification du paiement:", error);
                setStatus("error");
                setMessage("Une erreur inattendue est survenue lors de la vérification.");
            }
        };

        if (sessionId) {
            checkPaymentStatus();
        }
    }, [sessionId, router, cookie, searchParams]);

    return (
        <div className="p-4 md:p-8 text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {status === "loading" && "Vérification du paiement..."}
                {status === "success" && "Paiement réussi !"}
                {status === "error" && "Erreur de paiement"}
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

            {status === "success" && (
                <p className="text-sm text-gray-500 mt-4">
                    Redirection automatique vers votre calendrier dans quelques secondes...
                </p>
            )}

            {status === "error" && (
                <div className="mt-6 space-y-2">
                    <button
                        onClick={() => router.push("/calendrier")}
                        className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Retour au calendrier
                    </button>
                    <button
                        onClick={() => router.push("/paiement")}
                        className="block w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Réessayer le paiement
                    </button>
                </div>
            )}
        </div>
    );
}
