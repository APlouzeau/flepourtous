"use client";

import { useEffect, useState } from "react";
import TableAdmin from "./TableAdmin";
import TableInvoices from "./TableInvoices";
import FilterSelect from "./FilterSelect";
import { showBasicAppointmentProps, showInvoicableAppointmentProps } from "@/app/[locale]/types/appointments";
import { listInvoices } from "./listEventsActions";
import FilterDate from "./FilterDate";

export interface TableAdminProps {
    listAppointments: showBasicAppointmentProps[];
    invoiceList: showInvoicableAppointmentProps[];
}

export default function AdminDashboard({ listAppointments, invoiceList }: TableAdminProps) {
    const defaultDates = () => {
        const today = new Date();

        // ✅ Fonction pour formater sans conversion UTC
        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

        return [formatDate(firstDay), formatDate(lastDay)];
    };
    const [activeTab, setActiveTab] = useState("rendez-vous");
    const [statusFilter, setStatusFilter] = useState(""); // Pour le statut (Payé, En attente...)
    const [userFilter, setUserFilter] = useState(""); // Pour le filtre utilisateur
    const [invoicedFilter, setInvoicedFilter] = useState(""); // Pour l'état facturé (0, 1)
    const [beginPeriodFilter, setBeginPeriodFilter] = useState(defaultDates()[0]); // Pour le filtre de date de début
    const [endPeriodFilter, setEndPeriodFilter] = useState(defaultDates()[1]); // Pour le filtre de date de fin
    const [filteredInvoices, setFilteredInvoices] = useState<showInvoicableAppointmentProps[]>(invoiceList);

    useEffect(() => {
        const fetchFilteredInvoices = async () => {
            try {
                // Construire l'objet de filtres
                const filters: {
                    status?: string;
                    isInvoiced?: number;
                    userId?: number;
                    beginPeriod?: string;
                    endPeriod?: string;
                } = {};
                if (statusFilter) filters.status = statusFilter;
                if (invoicedFilter) filters.isInvoiced = Number(invoicedFilter);
                if (userFilter) filters.userId = Number(userFilter); // ← Ajouter ça !
                if (beginPeriodFilter) filters.beginPeriod = beginPeriodFilter;
                if (endPeriodFilter) filters.endPeriod = endPeriodFilter;

                const data = await listInvoices(filters);
                setFilteredInvoices(data);
            } catch (error) {
                console.error("Error fetching filtered invoices:", error);
            }
        };

        fetchFilteredInvoices();
    }, [statusFilter, invoicedFilter, userFilter, beginPeriodFilter, endPeriodFilter]); // ← Et ça !

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
                    <TableAdmin listAppointments={listAppointments} />
                ) : (
                    <div>
                        {/* Container avec grille pour les filtres */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                            {/* FILTRE 1 : User */}
                            <FilterSelect
                                label="User"
                                value={userFilter}
                                onChange={setUserFilter}
                                options={invoiceList
                                    .filter(
                                        (user, index, self) =>
                                            index === self.findIndex((u) => u.userId === user.userId),
                                    )
                                    .map((user) => ({
                                        value: user.userId.toString(),
                                        label: user.studentName,
                                    }))}
                                placeholder="Tous les utilisateurs"
                                className="mb-0" // ← Enlever le margin-bottom par défaut
                            />

                            {/* FILTRE 2 : Statut */}
                            <FilterSelect
                                label="Statut"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    ...new Set(
                                        invoiceList
                                            .filter((element) => element.status !== "En attente")
                                            .map((element) => element.status),
                                    ),
                                ].map((status) => ({
                                    value: status,
                                    label: status,
                                }))}
                                placeholder="Tous les statuts"
                                className="mb-0"
                            />

                            {/* FILTRE 3 : État */}
                            <FilterSelect
                                label="État"
                                value={invoicedFilter}
                                onChange={setInvoicedFilter}
                                options={[...new Set(invoiceList.map((element) => element.isInvoiced))].map(
                                    (isInvoiced) => ({
                                        value: isInvoiced.toString(),
                                        label: isInvoiced === 1 ? "Facturé" : "À facturer",
                                    }),
                                )}
                                placeholder="Tous les états"
                                className="mb-0"
                            />

                            {/* FILTRE 4 : Date début */}
                            <FilterDate
                                label="Date de début"
                                value={beginPeriodFilter}
                                onChange={setBeginPeriodFilter}
                                className="mb-0"
                            />

                            {/* FILTRE 5 : Date fin */}
                            <FilterDate
                                label="Date de fin"
                                value={endPeriodFilter}
                                onChange={setEndPeriodFilter}
                                className="mb-0"
                            />
                        </div>

                        <TableInvoices invoiceList={filteredInvoices} />
                    </div>
                )}
            </div>
        </div>
    );
}
