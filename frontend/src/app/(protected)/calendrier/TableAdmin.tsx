"use client";

import { showBasicAppointmentProps, showInvoicableAppointmentProps } from "@/app/types/appointments";
import { useUserTimezone } from "@/lib/date";
import { useEffect, useState } from "react";
import TableAdminAppointments from "./TableAdminAppointments";
import TableInvoices from "./TableInvoices";

interface TableAdminProps {
    listAppointments: showBasicAppointmentProps[];
    invoiceList: showInvoicableAppointmentProps[];
}

export default function TableAdmin({ listAppointments, invoiceList }: TableAdminProps) {
    const { userTimezone, isLoading: timezoneLoading } = useUserTimezone();
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        // Mettre à jour l'heure actuelle toutes les minutes
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    if (timezoneLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Chargement des rendez-vous...</span>
            </div>
        );
    }

    if (listAppointments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-600">Aucun rendez-vous planifié pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Version desktop - tableau */}
            <div className="hidden xl:block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <TableAdminAppointments listAppointments={listAppointments} />
                    <TableInvoices invoiceList={invoiceList} />
                </div>
            </div>

            {/* Version mobile/tablet - cartes */}
            {/*<div className="xl:hidden space-y-4">
                {listAppointments.map((item) => {
                    const { date: localDate, time: localTime } = formatDateInUserTimezone(
                        item.startDateTime,
                        userTimezone || "UTC"
                    );
                    const visioStatus = getVisioStatus(item.startDateTime, item.duration);
                    return (
                        <div
                            key={item.idEvent}
                            className={`
                                bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3 transition-all duration-200
                                ${
                                    visioStatus.isJoinable
                                        ? "cursor-pointer hover:shadow-md hover:border-green-300"
                                        : "hover:shadow-md"
                                }
                            `}
                            title={visioStatus.tooltip}
                            onClick={() => handleRowClick(item, visioStatus.isJoinable)}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium">{item.studentName}</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{item.description}</h3>
                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>{localDate}</span>
                                        <span className="text-gray-400">•</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span className="font-mono">{localTime}</span>
                                        <span className="text-gray-400">•</span>
                                        <span>{formatDuration(item.duration)}</span>
                                    </div>
                                </div>
                                {getStatusBadge(item.status)}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                                        visioStatus.isJoinable ? "bg-green-50" : "bg-red-50"
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <div className={`w-2 h-2 rounded-full ${visioStatus.badgeColor}`}></div>
                                    <span className={`text-sm font-medium ${visioStatus.className}`}>
                                        {visioStatus.status}
                                    </span>
                                </div>

                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                            //await deleteAppointment(item.idEvent.toString());
                                            alert(`Rendez-vous annulé avec succès`);
                                            window.location.reload();
                                        } catch (error) {
                                            console.error("Erreur lors de l'annulation:", error);
                                            alert("Erreur lors de l'annulation du rendez-vous.");
                                        }
                                    }}
                                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div> */}
        </div>
    );
}
