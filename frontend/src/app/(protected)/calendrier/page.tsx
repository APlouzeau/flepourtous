import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRole } from "@/lib/session";
import TableUser from "./TableUser";
import TableAdmin from "./TableAdmin";
import InstantVisioButton from "./InstantVisioButton";
import { appointmentList, listInvoices } from "./listEventsActions"; // ✅ Import de la fonction
import Badge from "@/app/components/front/badge";

export default async function CalendarPage() {
    const role = await getRole();
    const appointments = await appointmentList(); // ✅ Nom de variable différent
    const invoiceList = await listInvoices(); // ❌ Tu passes des appointments à un composant qui attend des invoices

    const isAdmin = role === "admin";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* En-tête moderne */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {isAdmin ? "Tableau de bord admin" : "Mon calendrier"}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {isAdmin
                            ? "Gérez tous les rendez-vous et créez des salons visio instantanés"
                            : "Consultez vos rendez-vous à venir et rejoignez vos cours en visio"}
                    </p>
                </div>

                {/* Barre d'actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                    <Button asChild>
                        <Link
                            href="/calendrier/nouveau-rendez-vous"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Nouveau rendez-vous
                        </Link>
                    </Button>
                    {isAdmin && <InstantVisioButton />}
                </div>

                {/* Badge de rôle pour admin */}
                {isAdmin && <Badge role={role} />}

                {/* Statistiques rapides pour admin */}
                {isAdmin && appointments.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total rendez-vous</p>
                                    <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                                </div>
                                <div className="bg-blue-100 rounded-full p-3">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Cours payés</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {
                                            appointments.filter(
                                                (item) =>
                                                    item.status.toLowerCase().includes("payé") ||
                                                    item.status.toLowerCase().includes("paye")
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="bg-green-100 rounded-full p-3">
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">En attente</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {
                                            appointments.filter(
                                                (item) =>
                                                    item.status.toLowerCase().includes("attente") ||
                                                    item.status.toLowerCase().includes("non payé") ||
                                                    item.status.toLowerCase().includes("non paye")
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="bg-yellow-100 rounded-full p-3">
                                    <svg
                                        className="w-6 h-6 text-yellow-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenu principal */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            {isAdmin ? "Tous les rendez-vous" : "Mes rendez-vous"}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {appointments.length > 0
                                ? `${appointments.length} rendez-vous ${isAdmin ? "au total" : "planifiés"}`
                                : "Aucun rendez-vous pour le moment"}
                        </p>
                    </div>

                    <div className="p-6">
                        {isAdmin ? (
                            <TableAdmin listAppointments={appointments} invoiceList={invoiceList} />
                        ) : (
                            <TableUser listAppointments={appointments} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
