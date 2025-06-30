import { LessonsWithPrices } from "@/app/types/lessons";
import { getAllLessonsWithPrices } from "./AppointmentAction";
import NewAppointmentForm from "./AppointmentForm";
import { getWallet } from "@/lib/session";

export default async function NewAppointmentPage() {
    const lessons: LessonsWithPrices = await getAllLessonsWithPrices();
    const wallet = await getWallet();
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            {/* Header avec solde */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Solde disponible</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {wallet ? `${wallet} €` : "Chargement..."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* En-tête de la section */}
                <div className="text-center mb-12">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                        style={{ background: "linear-gradient(to right, #6B7280, #1D1E1C)" }}
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Réserver un nouveau cours</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choisissez votre créneau idéal et réservez votre cours en quelques clics.
                    </p>
                </div>

                {/* Formulaire dans une carte */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6" style={{ background: "linear-gradient(to right, #6B7280, #1D1E1C)" }}>
                        <h2 className="text-2xl font-bold text-white">Détails de votre réservation</h2>
                        <p className="text-gray-200 mt-1">Remplissez les informations ci-dessous</p>
                    </div>
                    <div className="p-8">
                        <NewAppointmentForm lessons={lessons} />
                    </div>
                </div>
            </div>
        </div>
    );
}
