import Button from "@/app/components/front/Button";
import { UserDataProps } from "@/app/types/userData";
import { useState } from "react";
import { EditUserModal } from "./EditUserModal";

export function InformationTab({ dataUser }: { dataUser: UserDataProps }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [editedUser, setEditedUser] = useState({
        idUser: typeof dataUser?.idUser === "number" ? dataUser.idUser : 0,
        nickName: dataUser?.nickName || "",
        firstName: dataUser?.firstName || "",
        lastName: dataUser?.lastName || "",
        role: dataUser?.role || "",
        wallet: typeof dataUser?.wallet === "number" ? dataUser.wallet : 0,
        mail: dataUser?.mail || "",
        address: dataUser?.address || "",
        address2: dataUser?.address2 || "",
        address3: dataUser?.address3 || "",
        zip: dataUser?.zip || "",
        city: dataUser?.city || "",
        country: dataUser?.country || "",
        password: "",
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
                {/* Actions */}
                <div className="flex space-x-3">
                    <Button
                        onClick={() => setShowEditModal(true)}
                        variant="black"
                        className="text-sm px-4 py-2 !bg-[#1D1E1C] hover:!bg-gray-800"
                    >
                        Modifier
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Surnom</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.nickName || "Non renseigné"}
                        </div>
                    </div>{" "}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.firstName || "Non renseigné"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.lastName || "Non renseigné"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.mail || "Non renseigné"}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse
                        </label>
                        <div id="address" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.address || "Non renseigné"}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse 2
                        </label>
                        <div id="address2" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.address2 || "Non renseigné"}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address3" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse 3
                        </label>
                        <div id="address3" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.address3 || "Non renseigné"}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                            Zip
                        </label>
                        <div id="zip" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.zip || "Non renseigné"}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            Ville
                        </label>
                        <div id="city" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.city || "Non renseigné"}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Pays
                        </label>
                        <div id="country" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.country || "Non renseigné"}
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal de modification */}
            {showEditModal && (
                <EditUserModal
                    editedUser={dataUser}
                    onClose={() => setShowEditModal(false)} // On passe la fonction pour fermer
                />
            )}
        </div>
    );
}
