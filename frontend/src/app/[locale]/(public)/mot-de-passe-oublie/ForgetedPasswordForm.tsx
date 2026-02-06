"use client";
import Link from "next/link";
import { useState } from "react";
import Button from "@/app/[locale]/components/front/Button";
import { forgetedPassword } from "@/lib/password";

export default function ForgetedPasswordForm() {
    const [mail, setMail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const isValidForm = mail.trim() !== "" && mail.includes("@");
    const [emailSent, setEmailSent] = useState(false);

    function handleSubmit(e: React.FormEvent): void {
        e.preventDefault();
        if (!isValidForm) return;
        setIsLoading(true);
        forgetedPassword(mail)
            .then(() => {
                setEmailSent(true);
            })
            .catch((error) => {
                console.error("Erreur lors de la soumission du formulaire :", error);
                setEmailSent(true); // For simplicity, we assume the email was sent even if there was an error
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    if (emailSent) {
        return (
            <div className="text-center space-y-4">
                <div className="text-blue-600 text-sm bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <p className="font-medium mb-2">Email envoyé !</p>
                    <p className="text-xs">
                        Si cette adresse existe dans notre système, vous recevrez un lien de récupération dans quelques
                        minutes.
                    </p>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Vérifiez votre dossier spam</p>
                    <p>• Le lien expire dans 1 heure</p>
                </div>
                <Link
                    href="/connexion"
                    className="inline-block text-gray-600 hover:text-gray-800 font-medium transition-colors underline"
                >
                    Retour à la connexion
                </Link>
            </div>
        );
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <input
                type="email"
                placeholder="Adresse email"
                name="mail"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                pattern="^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$"
                required
                className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
            />
            <Button
                variant="black"
                type="submit"
                className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold"
                disabled={isLoading || !isValidForm}
            >
                Envoyer le lien
            </Button>
            <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    Vous n&apos;avez pas de compte ?{" "}
                    <Link
                        href="/inscription"
                        className="text-red-600 hover:text-red-700 font-medium transition-colors underline decoration-red-600/30 hover:decoration-red-600"
                    >
                        Créer votre compte
                    </Link>
                </p>
            </div>
        </form>
    );
}
