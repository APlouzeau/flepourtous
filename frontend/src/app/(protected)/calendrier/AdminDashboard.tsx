"use client";

import { useEffect, useState } from "react";
import TableAdmin from "./TableAdmin";
import TableInvoices from "./TableInvoices";
import { showBasicAppointmentProps, showInvoicableAppointmentProps } from "@/app/types/appointments";
import { listInvoices } from "./listEventsActions";

interface TableAdminProps {
    listAppointments: showBasicAppointmentProps[];
    invoiceList: showInvoicableAppointmentProps[];
}

export default function AdminDashboard({ listAppointments, invoiceList }: TableAdminProps) {
    const [activeTab, setActiveTab] = useState("rendez-vous");
    const [statusFilter, setStatusFilter] = useState("");
    const [filteredInvoices, setFilteredInvoices] = useState<showInvoicableAppointmentProps[]>(invoiceList);

    useEffect(() => {
        const fetchFilteredInvoices = async () => {
            try {
                console.log("🔍 Filtering with status:", statusFilter);
                const data = await listInvoices(statusFilter ? { status: statusFilter } : {});
                console.log("📊 Filtered data received:", data.length, "items");
                setFilteredInvoices(data);
            } catch (error) {
                console.error("Error fetching filtered invoices:", error);
            }
        };

        fetchFilteredInvoices();
    }, [statusFilter]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header avec onglets */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                {/* Onglets ici */}
                <div className="flex gap-1">
                    <button
                        onClick={() => setActiveTab("rendez-vous")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === "rendez-vous" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Tous les rendez-vous
                    </button>
                    <button
                        onClick={() => setActiveTab("facturation")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === "facturation" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Facturation
                    </button>
                </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
                {activeTab === "rendez-vous" ? (
                    <TableAdmin listAppointments={listAppointments} invoiceList={invoiceList} />
                ) : (
                    <div>
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut :</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="Payé">Payé</option>
                                <option value="En attente">En attente</option>
                                <option value="annulé - non remboursé">Annulé - non remboursé</option>
                            </select>
                        </div>
                        <TableInvoices invoiceList={filteredInvoices} />
                    </div>
                )}
            </div>
        </div>
    );
}
