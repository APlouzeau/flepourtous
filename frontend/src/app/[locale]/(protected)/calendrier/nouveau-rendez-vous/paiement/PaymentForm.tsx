"use client";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import apiClient from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/locales/client";

interface PaymentFormProps {
    stripePublicKey: string | null | undefined;
    cookie: string | null;
    serverError?: string | null;
}

export default function PaymentForm({ stripePublicKey, cookie, serverError }: PaymentFormProps) {
    const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
    const [stripeUserError, setStripeUserError] = useState<string | null>(null);
    const router = useRouter();
    const trad = useTranslations();

    const stripePromise = useMemo(() => {
        if (stripePublicKey) {
            return loadStripe(stripePublicKey);
        }
        return null;
    }, [stripePublicKey]);

    useEffect(() => {
        if (!stripePromise) {
            if (!stripePublicKey) {
                setStripeUserError(trad("payments.errorMessage"));
            }
            return;
        }

        setStripeUserError(null);

        stripePromise
            .then((resolvedStripe) => {
                if (resolvedStripe) {
                    setStripeInstance(resolvedStripe);
                } else {
                    console.error(
                        "[PaymentForm] ERREUR CLIENT: stripePromise s'est résolue à null. Vérifiez la clé publique et la console réseau.",
                    );
                    setStripeUserError(trad("payments.errorMessage"));
                }
            })
            .catch((error) => {
                console.error("[PaymentForm] ERREUR CLIENT: stripePromise a été rejetée:", error);
                setStripeUserError(trad("payments.errorMessage"));
            });
    }, [stripePromise, stripePublicKey, trad]);

    const fetchClientSecret = useCallback(async (): Promise<string> => {
        if (!cookie) {
            console.warn("[PaymentForm] fetchClientSecret: Tentative d'appel sans cookie.");
            return "";
        }
        try {
            const response = await apiClient.post(
                "/api/checkout-session",
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                },
            );
            const data = response.data;

            // Paiement via wallet - redirection immédiate
            if (data.code == 1 && data.payment_method === "wallet") {
                router.push("/retour-paiement?status=success&method=wallet");
                return ""; // Retourner immédiatement après la redirection
            }

            // Paiement Stripe - vérifier le clientSecret
            if (!response.data || response.data.error || !response.data.clientSecret) {
                console.error("[PaymentForm] fetchClientSecret: Erreur backend ou clientSecret manquant:", data?.error);
                setStripeUserError(trad("payments.errorMessage"));
                return "";
            }
            return response.data.clientSecret;
        } catch (error) {
            console.error("[PaymentForm] fetchClientSecret: Erreur pendant l'appel Axios:", error);
            setStripeUserError(trad("payments.errorMessage"));
            return "";
        }
    }, [cookie, router, trad]);

    if (serverError) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">{trad("payment.finish")}</h1>
                <p className="text-red-500">{serverError}</p>
            </div>
        );
    }

    if (stripeUserError) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">{trad("payment.finish")}</h1>
                <p className="text-red-500">{stripeUserError}</p>
            </div>
        );
    }

    if (!stripePromise) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">{trad("payment.finish")}</h1>
                <p className="text-orange-500">
                    Configuration Stripe manquante (clé publique non disponible côté client).
                </p>
            </div>
        );
    }

    if (!stripeInstance) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">{trad("payment.finish")}</h1>
                <p className="text-orange-500">Chargement du module de paiement Stripe...</p>
            </div>
        );
    }

    if (!cookie || cookie.trim() === "") {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">{trad("payment.finish")}</h1>
                <p className="text-orange-500">{trad("payment.missingPaymentInformations")}</p>
            </div>
        );
    }

    const options = { fetchClientSecret };

    return (
        <div id="checkout" className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">{trad("payment.finish")}</h1>
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout className="w-full" />
            </EmbeddedCheckoutProvider>
        </div>
    );
}
