"use client";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
interface PaymentFormProps {
    stripePublicKey: string | null | undefined;
    cookie: string | null;
    serverError?: string | null;
}

export default function PaymentForm({ stripePublicKey, cookie, serverError }: PaymentFormProps) {
    const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
    const [stripeUserError, setStripeUserError] = useState<string | null>(null);
    const router = useRouter();

    const stripePromise = useMemo(() => {
        if (stripePublicKey) {
            return loadStripe(stripePublicKey);
        }
        return null;
    }, [stripePublicKey]);

    useEffect(() => {
        if (!stripePromise) {
            if (!stripePublicKey) {
                setStripeUserError("Clé publique Stripe non configurée pour le chargement client.");
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
                        "[PaymentForm] ERREUR CLIENT: stripePromise s'est résolue à null. Vérifiez la clé publique et la console réseau."
                    );
                    setStripeUserError(
                        "L'initialisation de Stripe a échoué côté client (la clé publique pourrait être incorrecte ou le script Stripe n'a pas pu se charger)."
                    );
                }
            })
            .catch((error) => {
                console.error("[PaymentForm] ERREUR CLIENT: stripePromise a été rejetée:", error);
                setStripeUserError("Une erreur critique est survenue lors du chargement de Stripe côté client.");
            });
    }, [stripePromise, stripePublicKey]);

    const fetchClientSecret = useCallback(async (): Promise<string> => {
        if (!cookie) {
            console.warn("[PaymentForm] fetchClientSecret: Tentative d'appel sans cookie.");
            return "";
        }
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/checkout-session`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `PHPSESSID=${cookie}`,
                    },
                    withCredentials: true,
                }
            );
            const data = response.data;
            if (data.code == 1 && data.payment_method === "wallet") {
                router.push("/retour-paiement?status=success&method=wallet");
            }
            if (!response.data || response.data.error || !response.data.clientSecret) {
                console.error("[PaymentForm] fetchClientSecret: Erreur backend ou clientSecret manquant:", data?.error);
                return "";
            }
            return response.data.clientSecret;
        } catch (error) {
            console.error("[PaymentForm] fetchClientSecret: Erreur pendant l'appel Axios:", error);
            return "";
        }
        // Always return a string to satisfy the return type
        return "";
    }, [cookie, router]);

    if (serverError) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">Finaliser votre paiement</h1>
                <p className="text-red-500">{serverError}</p>
            </div>
        );
    }

    if (stripeUserError) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">Finaliser votre paiement</h1>
                <p className="text-red-500">{stripeUserError}</p>
            </div>
        );
    }

    if (!stripePromise) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">Finaliser votre paiement</h1>
                <p className="text-orange-500">
                    Configuration Stripe manquante (clé publique non disponible côté client).
                </p>
            </div>
        );
    }

    if (!stripeInstance) {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">Finaliser votre paiement</h1>
                <p className="text-orange-500">Chargement du module de paiement Stripe...</p>
            </div>
        );
    }

    if (!cookie || cookie.trim() === "") {
        return (
            <div className="p-4 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">Finaliser votre paiement</h1>
                <p className="text-orange-500">Session utilisateur non valide. Veuillez vous reconnecter.</p>
            </div>
        );
    }

    const options = { fetchClientSecret };

    return (
        <div id="checkout" className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Finaliser votre paiement</h1>
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout className="w-full" />
            </EmbeddedCheckoutProvider>
        </div>
    );
}
