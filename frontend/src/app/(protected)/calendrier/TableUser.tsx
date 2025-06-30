"use client";

import { showBasicAppointmentProps } from "@/app/types/appointments";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteAppointment } from "./nouveau-rendez-vous/AppointmentAction";
import { useEffect, useState } from "react";

interface AppointmentRowProps {
    listAppointments: showBasicAppointmentProps[];
}

export default function TableUser({ listAppointments }: AppointmentRowProps) {
    const [userTimezone, setUserTimezone] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        setIsLoading(false);
        
        // Mettre à jour l'heure actuelle toutes les minutes
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const formatDateInUserTimezone = (utcDateTimeString: string | undefined) => {
        if (!utcDateTimeString || !userTimezone) {
            return { date: "Chargement...", time: "" };
        }
        try {
            const isoUtcString = utcDateTimeString.includes("T")
                ? utcDateTimeString
                : utcDateTimeString.replace(" ", "T") + "Z";
            const dateObj = new Date(isoUtcString);

            if (isNaN(dateObj.getTime())) {
                return { date: "Date invalide", time: "" };
            }

            const formattedDate = dateObj.toLocaleDateString(undefined, {
                timeZone: userTimezone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            const formattedTime = dateObj.toLocaleTimeString(undefined, {
                timeZone: userTimezone,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
            return { date: formattedDate, time: formattedTime };
        } catch (error) {
            console.error("Error formatting date:", error);
            return { date: "Erreur", time: "" };
        }
    };

    const getVisioStatus = (startDateTime: string, duration: string) => {
        try {
            const isoUtcString = startDateTime.includes("T")
                ? startDateTime
                : startDateTime.replace(" ", "T") + "Z";
            const appointmentStart = new Date(isoUtcString);
            const appointmentEnd = new Date(appointmentStart.getTime() + parseInt(duration) * 60000);
            
            // Autoriser l'accès 15 minutes avant le début
            const accessTime = new Date(appointmentStart.getTime() - 15 * 60000);
            
            const now = currentTime;
            
            if (now >= accessTime && now <= appointmentEnd) {
                return { 
                    status: "Rejoignable", 
                    className: "text-green-600 font-semibold",
                    isJoinable: true,
                    tooltip: "Vous pouvez rejoindre la visio",
                    badgeColor: "bg-green-500"
                };
            } else {
                return { 
                    status: "Non rejoignable", 
                    className: "text-red-600",
                    isJoinable: false,
                    tooltip: "Vous ne pouvez pas rejoindre cette visio",
                    badgeColor: "bg-red-500"
                };
            }
        } catch (error) {
            console.error("Error calculating visio status:", error);
            return { 
                status: "Erreur", 
                className: "text-gray-500",
                isJoinable: false,
                tooltip: "Erreur de calcul du statut",
                badgeColor: "bg-gray-500"
            };
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
        } else if (statusLower.includes("non payé") || statusLower.includes("non paye") || statusLower.includes("impayé")) {
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
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColor}`}>
                <div className={`w-2 h-2 rounded-full ${badgeColor}`}></div>
                <span className={`text-sm font-medium ${textColor}`}>{status}</span>
            </div>
        );
    };

    const handleRowClick = (item: showBasicAppointmentProps, isJoinable: boolean) => {
        if (isJoinable && item.visioLink) {
            window.open(item.visioLink, '_blank', 'noopener,noreferrer');
        }
    };

    const formatDuration = (duration: string) => {
        const minutes = parseInt(duration);
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
        }
        return `${minutes} min`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Chargement de vos rendez-vous...</span>
            </div>
        );
    }

    if (listAppointments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-600">Vous n'avez aucun rendez-vous planifié pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Version desktop - tableau */}
            <div className="hidden lg:block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Cours
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Date
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Heure
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Durée
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Status
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Visio
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listAppointments.map((item) => {
                                const { date: localDate, time: localTime } = formatDateInUserTimezone(item.startDateTime);
                                const visioStatus = getVisioStatus(item.startDateTime, item.duration);
                                return (
                                    <TableRow 
                                        key={item.idEvent}
                                        className={`
                                            hover:bg-gray-50 transition-all duration-200 border-b border-gray-100
                                            ${visioStatus.isJoinable ? 'cursor-pointer' : ''}
                                        `}
                                        title={visioStatus.tooltip}
                                        onClick={() => handleRowClick(item, visioStatus.isJoinable)}
                                    >
                                        <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                                        <TableCell className="text-gray-700">{localDate}</TableCell>
                                        <TableCell className="text-gray-700 font-mono">{localTime}</TableCell>
                                        <TableCell className="text-gray-700">{formatDuration(item.duration)}</TableCell>
                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${visioStatus.isJoinable ? 'bg-green-50' : 'bg-red-50'}`}>
                                                <div className={`w-2 h-2 rounded-full ${visioStatus.badgeColor}`}></div>
                                                <span className={`text-sm font-medium ${visioStatus.className}`}>
                                                    {visioStatus.status}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await deleteAppointment(item.idEvent.toString());
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Annuler
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Version mobile/tablet - cartes */}
            <div className="lg:hidden space-y-4">
                {listAppointments.map((item) => {
                    const { date: localDate, time: localTime } = formatDateInUserTimezone(item.startDateTime);
                    const visioStatus = getVisioStatus(item.startDateTime, item.duration);
                    return (
                        <div 
                            key={item.idEvent}
                            className={`
                                bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3 transition-all duration-200
                                ${visioStatus.isJoinable ? 'cursor-pointer hover:shadow-md hover:border-green-300' : 'hover:shadow-md'}
                            `}
                            title={visioStatus.tooltip}
                            onClick={() => handleRowClick(item, visioStatus.isJoinable)}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{localDate}</span>
                                        <span className="text-gray-400">•</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-mono">{localTime}</span>
                                        <span className="text-gray-400">•</span>
                                        <span>{formatDuration(item.duration)}</span>
                                    </div>
                                </div>
                                {getStatusBadge(item.status)}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${visioStatus.isJoinable ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
                                            await deleteAppointment(item.idEvent.toString());
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
