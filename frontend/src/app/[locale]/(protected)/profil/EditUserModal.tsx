"use client";
import Button from "@/app/[locale]/components/front/Button";
import { UserDataProps } from "@/app/[locale]/types/userData";
import { useState } from "react";
import { changeUserProfile } from "./profileAction";

export function EditUserModal({
    editedUser: initialUser,
    onClose,
}: {
    editedUser: UserDataProps;
    onClose: () => void;
}) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [editedUser, setEditedUser] = useState<UserDataProps>(initialUser);
    const [modalError, setModalError] = useState("");

    const handleCloseModal = () => {
        onClose();
        setError("");
    };

    const handleInputChange = (field: string, value: string) => {
        setEditedUser((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (error) setError("");
    };

    const handleSaveChanges = async () => {
        const response = await changeUserProfile(editedUser);
        setIsLoading(true);
        setError("");
        if (response.code === 1) {
            setIsLoading(false);
            onClose();
            alert(response.message || "Profil mis à jour avec succès !");
            window.location.reload();
        }
        if (response.code === 0) {
            setIsLoading(false);
            setModalError(response.message || "Erreur lors de la mise à jour du profil");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Modifier mes informations</h2>
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

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nickName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Surnom *
                                </label>
                                <input
                                    type="text"
                                    value={editedUser.nickName}
                                    onChange={(e) => handleInputChange("nickName", e.target.value)}
                                    placeholder="Entrez votre surnom"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    value={editedUser.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    placeholder="Entrez votre prénom"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    value={editedUser.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    placeholder="Entrez votre nom"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="mail" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={editedUser.mail}
                                onChange={(e) => handleInputChange("mail", e.target.value)}
                                placeholder="Entrez votre email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse
                            </label>
                            <input
                                type="text"
                                value={editedUser.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                placeholder="Entrez votre adresse"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                disabled={isLoading}
                            />
                        </div>{" "}
                        <div>
                            <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse 2
                            </label>
                            <input
                                type="text"
                                value={editedUser.address2}
                                onChange={(e) => handleInputChange("address2", e.target.value)}
                                placeholder="Entrez votre adresse"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                disabled={isLoading}
                            />
                        </div>{" "}
                        <div>
                            <label htmlFor="address3" className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse 3
                            </label>
                            <input
                                type="text"
                                value={editedUser.address3}
                                onChange={(e) => handleInputChange("address3", e.target.value)}
                                placeholder="Entrez votre adresse"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                                Zip
                            </label>
                            <input
                                type="text"
                                value={editedUser.zip}
                                onChange={(e) => handleInputChange("zip", e.target.value)}
                                placeholder="Entrez votre adresse"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                disabled={isLoading}
                            />
                        </div>{" "}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                Ville
                            </label>
                            <input
                                type="text"
                                value={editedUser.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                placeholder="Entrez votre adresse"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                disabled={isLoading}
                            />
                        </div>{" "}
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                Pays
                            </label>
                            <input
                                type="text"
                                value={editedUser.country}
                                onChange={(e) => handleInputChange("country", e.target.value)}
                                placeholder="Entrez votre pays"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                disabled={isLoading}
                            />
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
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSaveChanges}
                            variant="black"
                            className="flex-1 text-sm py-3 !bg-[#1D1E1C] hover:!bg-gray-800"
                            disabled={isLoading || !editedUser.firstName || !editedUser.lastName || !editedUser.mail}
                        >
                            {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
