"use client";

import { useEffect, useState } from "react";
import TableAdmin from "./TableAdmin";
import TableInvoices from "./TableInvoices";
import FilterSelect from "./FilterSelect";
import { showBasicAppointmentProps, showInvoicableAppointmentProps } from "@/app/types/appointments";
import { listInvoices } from "./listEventsActions";

export interface TableAdminProps {
    listAppointments: showBasicAppointmentProps[];
    invoiceList: showInvoicableAppointmentProps[];
}

export default function AdminDashboard({ listAppointments, invoiceList }: TableAdminProps) {
    const [activeTab, setActiveTab] = useState("rendez-vous");
    const [statusFilter, setStatusFilter] = useState(""); // Pour le statut (Payé, En attente...)
    const [userFilter, setUserFilter] = useState(""); // Pour le filtre utilisateur
    const [invoicedFilter, setInvoicedFilter] = useState(""); // Pour l'état facturé (0, 1)
    const [filteredInvoices, setFilteredInvoices] = useState<showInvoicableAppointmentProps[]>(invoiceList);

    useEffect(() => {
        const fetchFilteredInvoices = async () => {
            try {
                // Construire l'objet de filtres
                const filters: { status?: string; isInvoiced?: number } = {};
                if (statusFilter) filters.status = statusFilter;
                if (invoicedFilter) filters.isInvoiced = Number(invoicedFilter);

                const data = await listInvoices(filters);
                setFilteredInvoices(data);
            } catch (error) {
                console.error("Error fetching filtered invoices:", error);
            }
        };

        fetchFilteredInvoices();
    }, [statusFilter, invoicedFilter]); // ← Écouter les 2 filtres

    console.log("statusFilter:", statusFilter);
    console.log("invoicedFilter:", invoicedFilter);

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
                        {/* FILTRE 1 : Par statut */}
                        <FilterSelect
                            label="User"
                            value={userFilter}
                            onChange={setUserFilter}
                            options={[...new Set(invoiceList.map((element) => element.studentName))].map((user) => ({
                                value: user,
                                label: user,
                            }))}
                            placeholder="Tous les utilisateurs"
                        />
                        <FilterSelect
                            label="Statut"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[...new Set(invoiceList.map((element) => element.status))].map((status) => ({
                                value: status,
                                label: status,
                            }))}
                            placeholder="Tous les statuts"
                        />

                        {/* FILTRE 2 : Par état facturé */}
                        <FilterSelect
                            label="État"
                            value={invoicedFilter}
                            onChange={setInvoicedFilter}
                            options={[...new Set(invoiceList.map((element) => element.isInvoiced))].map(
                                (isInvoiced) => ({
                                    value: isInvoiced.toString(),
                                    label: isInvoiced === 1 ? "Facturé" : "À facturer",
                                })
                            )}
                            placeholder="Tous les états"
                        />

                        <TableInvoices invoiceList={filteredInvoices} />
                    </div>
                )}
            </div>
        </div>
    );
}
