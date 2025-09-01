"use client";
import Button from "@/app/components/front/Button";
import { resetPassword } from "@/lib/password";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordForm() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editedPassword, setEditedPassword] = useState({
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setEditedPassword((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setError(""); // Reset l'erreur

        try {
            const response = await resetPassword(editedPassword.newPassword, editedPassword.confirmNewPassword);

            if (response.code === 1) {
                setSuccess(true);
                setEditedPassword({
                    newPassword: "",
                    confirmNewPassword: "",
                });
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Une erreur est survenue");
            console.error("Error resetting password:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Affichage de succès
    if (success) {
        return (
            <div className="w-full">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Mot de passe modifié !
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">Votre mot de passe a été modifié avec succès.</p>
                </div>

                <div className="text-center">
                    <Link
                        href="/connexion"
                        className="inline-block text-white bg-black hover:bg-gray-800 font-medium py-3 px-6 rounded-xl transition-colors"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Nouveau mot de passe</h2>
                <p className="text-sm sm:text-base text-gray-600">Choisissez un nouveau mot de passe sécurisé</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-5">
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Nouveau mot de passe *
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            value={editedPassword.newPassword}
                            onChange={(e) => handleInputChange("newPassword", e.target.value)}
                            pattern="((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,60})"
                            placeholder="Entrez votre nouveau mot de passe"
                            className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                            required
                            disabled={isLoading}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 group">
                            <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full cursor-help">
                                <span className="text-sm font-bold text-gray-600">?</span>
                            </div>
                            <div className="absolute bottom-full right-0 mb-2 w-max max-w-xs p-3 bg-black text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                Le mot de passe doit contenir :
                                <ul className="list-disc list-inside mt-1">
                                    <li>Au moins 8 caractères</li>
                                    <li>Une lettre majuscule (A-Z)</li>
                                    <li>Une lettre minuscule (a-z)</li>
                                    <li>Un chiffre (0-9)</li>
                                    <li>Un caractère spécial (par exemple : !@#$%^&*)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer le mot de passe *
                    </label>
                    <input
                        type="password"
                        value={editedPassword.confirmNewPassword}
                        onChange={(e) => handleInputChange("confirmNewPassword", e.target.value)}
                        pattern="((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,60})"
                        placeholder="Confirmez votre nouveau mot de passe"
                        className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                        required
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
                )}

                <Button
                    variant="black"
                    className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold"
                    type="submit"
                    disabled={isLoading || !editedPassword.newPassword || !editedPassword.confirmNewPassword}
                >
                    {isLoading ? "Modification en cours..." : "Modifier le mot de passe"}
                </Button>
            </form>
        </div>
    );
}
