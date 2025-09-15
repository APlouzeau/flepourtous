"use client";

import { showBasicAppointmentProps } from "@/app/types/appointments";

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteAppointment, prepareRepaymentAction } from "./nouveau-rendez-vous/AppointmentAction";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AppointmentRowProps {
    listAppointments: showBasicAppointmentProps[];
}

export default function TableUser({ listAppointments }: AppointmentRowProps) {
    const [currentTime] = useState<Date>(new Date());
    const [isRepaying, setIsRepaying] = useState<string | null>(null);
    const router = useRouter();

    // Fonction pour formater la date et l'heure selon le fuseau de l'événement
    const formatDateTime = (dateTimeString: string, timezone: string) => {
        try {
            // Convertir la string en objet Date (UTC)
            const dateObj = new Date(dateTimeString.replace(" ", "T") + "Z");

            if (isNaN(dateObj.getTime())) {
                return { date: "Date invalide", time: "Heure invalide" };
            }

            // Formater la date selon le fuseau de l'événement
            const formattedDate = dateObj.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: timezone, // ← AJOUT : utilise le fuseau de l'événement
            });

            // Formater l'heure selon le fuseau de l'événement
            const formattedTime = dateObj.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: timezone, // ← AJOUT : utilise le fuseau de l'événement
            });

            return { date: formattedDate, time: formattedTime };
        } catch (error) {
            console.error("Error formatting date:", error);
            return { date: "Erreur", time: "Erreur" };
        }
    };

    const getVisioStatus = (startDateTime: string, duration: string) => {
        try {
            const isoUtcString = startDateTime.includes("T") ? startDateTime : startDateTime.replace(" ", "T") + "Z";
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
                    badgeColor: "bg-green-500",
                };
            } else {
                return {
                    status: "Non rejoignable",
                    className: "text-red-600",
                    isJoinable: false,
                    tooltip: "Vous ne pouvez pas rejoindre cette visio",
                    badgeColor: "bg-red-500",
                };
            }
        } catch (error) {
            console.error("Error calculating visio status:", error);
            return {
                status: "Erreur",
                className: "text-gray-500",
                isJoinable: false,
                tooltip: "Erreur de calcul du statut",
                badgeColor: "bg-gray-500",
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
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColor}`}>
                <div className={`w-2 h-2 rounded-full ${badgeColor}`}></div>
                <span className={`text-sm font-medium ${textColor}`}>{status}</span>
            </div>
        );
    };

    const handleRowClick = (item: showBasicAppointmentProps, isJoinable: boolean) => {
        if (isJoinable && item.visioLink) {
            window.open(item.visioLink, "_blank", "noopener,noreferrer");
        }
    };

    const handleRepay = async (eventId: string) => {
        setIsRepaying(eventId);
        const response = await prepareRepaymentAction(eventId);
        if (response.code === 1) {
            router.push("/calendrier/nouveau-rendez-vous/paiement");
        } else {
            alert(response.message || "Une erreur est survenue.");
            setIsRepaying(null);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent text-center">
                    <TableHead>Cours</TableHead>
                    <TableHead>Fuseau</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut Paiement</TableHead>
                    <TableHead>Statut Visio</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listAppointments.map((item) => {
                    const visioStatus = getVisioStatus(item.startDateTime, item.duration);
                    const { date: formattedDate, time: formattedTime } = formatDateTime(
                        item.startDateTime,
                        item.timezone
                    ); // ← AJOUT ICI
                    const appointmentDate = new Date(item.startDateTime.replace(" ", "T") + "Z");
                    const today = new Date();
                    const canCancel =
                        appointmentDate > today && (item.status === "Confirmé" || item.status === "En attente");
                    const canPay = appointmentDate > today && item.status === "En attente";

                    return (
                        <TableRow
                            key={item.idEvent}
                            className={`
                                ${
                                    visioStatus.isJoinable
                                        ? "cursor-pointer hover:bg-green-50"
                                        : "cursor-not-allowed hover:bg-red-50"
                                }
                                transition-colors duration-200
                            `}
                            title={visioStatus.tooltip}
                            onClick={() => handleRowClick(item, visioStatus.isJoinable)}
                        >
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.timezone}</TableCell>
                            <TableCell className="font-mono">{formattedDate}</TableCell> {/* ← MODIFIÉ */}
                            <TableCell className="font-mono">{formattedTime}</TableCell> {/* ← MODIFIÉ */}
                            <TableCell>{item.duration} mn</TableCell>
                            <TableCell>
                                {canPay ? (
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche le clic sur la ligne
                                            handleRepay(item.idEvent.toString());
                                        }}
                                        disabled={isRepaying === item.idEvent.toString()}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        {isRepaying === item.idEvent.toString() ? "..." : "Payer"}
                                    </Button>
                                ) : (
                                    // Si on ne peut pas payer, on affiche le badge du collègue
                                    getStatusBadge(item.status)
                                )}
                            </TableCell>
                            <TableCell className={visioStatus.className}>{visioStatus.status}</TableCell>
                            <TableCell>
                                {canCancel ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async (e) => {
                                            e.stopPropagation(); // Empêche le clic sur la ligne
                                            if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
                                                try {
                                                    await deleteAppointment(item.idEvent.toString());
                                                    alert(`Rendez-vous annulé.`);
                                                    router.refresh();
                                                } catch (error) {
                                                    console.error("Erreur lors de l'annulation:", error);
                                                    alert("Erreur lors de l'annulation du rendez-vous.");
                                                }
                                            }
                                        }}
                                    >
                                        Annuler
                                    </Button>
                                ) : (
                                    // Si on ne peut pas annuler, on affiche un tiret
                                    <span className="text-gray-400">-</span>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter className="bg-transparent">
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7}></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
