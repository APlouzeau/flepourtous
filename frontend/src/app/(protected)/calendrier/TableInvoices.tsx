"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateInUserTimezone, useUserTimezone } from "@/lib/date";
import { setInvoiced } from "./listEventsActions";
import { Button } from "@/components/ui/button";
import { showInvoicableAppointmentProps } from "@/app/types/appointments";

interface TableInvoicesProps {
    invoiceList: showInvoicableAppointmentProps[];
}

export default function TableInvoices({ invoiceList }: TableInvoicesProps) {
    const { userTimezone, isLoading: timezoneLoading } = useUserTimezone();
    const [invoices, setInvoices] = useState(invoiceList);
    const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

    // Synchroniser le state local avec les nouvelles données du parent
    useEffect(() => {
        setInvoices(invoiceList);
    }, [invoiceList]);

    const handleSetInvoiced = async (eventId: string) => {
        setLoadingItems((prev) => new Set([...prev, eventId]));

        try {
            const success = await setInvoiced(eventId);

            if (success) {
                setInvoices((prevInvoices) =>
                    prevInvoices.map((invoice) =>
                        invoice.idEvent === eventId ? { ...invoice, isInvoiced: 1 } : invoice
                    )
                );
            } else {
                alert("Erreur lors de la facturation");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Erreur lors de la facturation");
        } finally {
            // Retirer l'item du loading
            setLoadingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(eventId);
                return newSet;
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const statusLower = status.toLowerCase();
        let badgeColor = "";
        let textColor = "";
        let bgColor = "";

        if (statusLower.includes("payé") || statusLower.includes("paye")) {
            badgeColor = "bg-green-500";
            textColor = "text-green-700";
            bgColor = "bg-green-50";
        } else if (
            statusLower.includes("non payé") ||
            statusLower.includes("non paye") ||
            statusLower.includes("impayé")
        ) {
            badgeColor = "bg-red-500";
            textColor = "text-red-700";
            bgColor = "bg-red-50";
        } else if (statusLower.includes("en attente") || statusLower.includes("attente")) {
            badgeColor = "bg-yellow-500";
            textColor = "text-yellow-700";
            bgColor = "bg-yellow-50";
        } else if (statusLower.includes("à voir") || statusLower.includes("a voir")) {
            badgeColor = "bg-orange-500";
            textColor = "text-orange-700";
            bgColor = "bg-orange-50";
        } else {
            badgeColor = "bg-gray-500";
            textColor = "text-gray-700";
            bgColor = "bg-gray-50";
        }

        return (
            <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${badgeColor} ${textColor} ${bgColor}`}
            >
                {status}
            </span>
        );
    };

    if (timezoneLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Chargement des rendez-vous...</span>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            {/* Version desktop - tableau */}
            <div className="hidden xl:block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Élève
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                        Cours
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Date
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">Durée</TableHead>
                                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices
                                .filter((item) => item.status !== "En attente")
                                .map((item) => {
                                    const { date: localDate } = formatDateInUserTimezone(
                                        item.startDateTime,
                                        userTimezone || "UTC"
                                    );
                                    const isLoading = loadingItems.has(item.idEvent);
                                    const isInvoiced = item.isInvoiced === 1;

                                    return (
                                        <TableRow
                                            key={item.idEvent}
                                            className={`
                                            hover:bg-gray-50 transition-all duration-200 border-b border-gray-100
                                        `}
                                        >
                                            <TableCell className="font-medium text-gray-900">
                                                {item.studentName}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {item.description}
                                            </TableCell>
                                            <TableCell className="text-gray-700">{localDate}</TableCell>
                                            <TableCell className="text-gray-700">{item.duration} min</TableCell>

                                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {!isInvoiced ? (
                                                    <Button
                                                        onClick={() => handleSetInvoiced(item.idEvent)}
                                                        disabled={isLoading}
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                Facturation...
                                                            </>
                                                        ) : (
                                                            "Marquer comme facturé"
                                                        )}
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-gray-500 font-medium">
                                                        ✅ Facturé
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {invoices.length === 0 && <div className="text-center py-8 text-gray-500">Aucune facture à traiter</div>}
        </div>
    );
}
