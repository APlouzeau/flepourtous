import Button from "@/app/components/front/Button";
import { useState } from "react";
import { changeUserPassword } from "./profileAction";

export function PasswordModify() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalError, setModalError] = useState("");
    const [editedPassword, setEditedPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le rechargement de la page

        try {
            setIsLoading(true);
            const response = await changeUserPassword(
                editedPassword.oldPassword,
                editedPassword.newPassword,
                editedPassword.confirmNewPassword
            );

            if (response.code === 1) {
                setError("");
                setEditedPassword({
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
                setShowPasswordModal(false);
                alert(response.message || "Profil mis à jour avec succès !");
                window.location.reload();
            } else {
                setModalError(response.message);
            }
        } catch (err) {
            console.error("Erreur lors de la modification du mot de passe :", err);
            setModalError("Une erreur s'est produite lors de la modification du mot de passe.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setEditedPassword((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCloseModal = () => {
        setShowPasswordModal(false);
        setError("");
    };

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mot de passe</h2>
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">📚</div>
                    <p className="text-gray-500 text-lg mb-4">Modifier le mot de passe</p>
                    <Button
                        onClick={() => setShowPasswordModal(true)}
                        variant="black"
                        className="text-sm px-6 py-3 !bg-[#1D1E1C] hover:!bg-gray-800"
                    >
                        Modifier
                    </Button>
                </div>
            </div>

            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Modifier mon mot de passe</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Fermer la popup"
                                    disabled={isLoading}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="oldPassword"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Ancien mot de passe *
                                        </label>
                                        <input
                                            type="password"
                                            onChange={(e) => handleInputChange("oldPassword", e.target.value)}
                                            pattern="((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,60})"
                                            placeholder="Entrez votre ancien mot de passe"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="newPassword"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Nouveau mot de passe *
                                        </label>
                                        <input
                                            type="password"
                                            onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                            pattern="((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,60})"
                                            placeholder="Entrez votre nouveau mot de passe"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="confirmNewPassword"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Confirmer le mot de passe *
                                        </label>
                                        <input
                                            type="password"
                                            onChange={(e) => handleInputChange("confirmNewPassword", e.target.value)}
                                            pattern="((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,60})"
                                            placeholder="confirmez votre nouveau mot de passe"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="relative hidden sm:block">
                                        <div className="absolute top-8 right-0 flex items-center pr-4 group">
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

                                {modalError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{modalError}</p>
                                    </div>
                                )}

                                <div className="flex space-x-3 mt-6">
                                    <Button
                                        onClick={handleCloseModal}
                                        variant="white"
                                        className="flex-1 text-sm py-3"
                                        disabled={isLoading}
                                        type="button"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        variant="black"
                                        className="flex-1 text-sm py-3 !bg-[#1D1E1C] hover:!bg-gray-800"
                                        type="submit" // 4. Changer le type en "submit"
                                        disabled={
                                            isLoading ||
                                            !editedPassword.oldPassword ||
                                            !editedPassword.newPassword ||
                                            !editedPassword.confirmNewPassword
                                        }
                                    >
                                        {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
