import Button from "@/app/[locale]/components/front/Button";
import { UserDataProps } from "@/app/[locale]/types/userData";
import { useState } from "react";
import { EditUserModal } from "./EditUserModal";
import { useI18n } from "@/locales/client";

export function InformationTab({ dataUser }: { dataUser: UserDataProps }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const trad = useI18n(); // Récupère les traductions spécifiques à la section "informations"

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{trad("profile.informations.sectionName")}</h2>
                {/* Actions */}
                <div className="flex space-x-3">
                    <Button
                        onClick={() => setShowEditModal(true)}
                        variant="black"
                        className="text-sm px-4 py-2 !bg-[#1D1E1C] hover:!bg-gray-800"
                    >
                        {trad("common.buttons.modify")}
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.nickName")}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.nickName || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>{" "}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.firstName")}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.firstName || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.lastName")}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.lastName || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.email")}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.mail || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.address")}
                        </label>
                        <div id="address" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.address || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.address2")}
                        </label>
                        <div id="address2" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.address2 || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address3" className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.address3")}
                        </label>
                        <div id="address3" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.address3 || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.zip")}
                        </label>
                        <div id="zip" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.zip || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.city")}
                        </label>
                        <div id="city" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.city || trad("common.miscellaneous.notProvided")}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            {trad("profile.informations.country")}
                        </label>
                        <div id="country" className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {dataUser?.country || trad("common.miscellaneous.notProvided")}
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
