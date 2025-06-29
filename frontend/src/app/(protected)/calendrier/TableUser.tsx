"use client";

import { showBasicAppointmentProps } from "@/app/types/appointments";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteAppointment, prepareRepaymentAction } from "./nouveau-rendez-vous/AppointmentAction";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AppointmentRowProps {
    listAppointments: showBasicAppointmentProps[];
}

export default function TableUser({ listAppointments }: AppointmentRowProps) {
    const [userTimezone, setUserTimezone] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isRepaying, setIsRepaying] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

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
                };
            } else {
                return {
                    status: "Non rejoignable",
                    className: "text-red-600",
                    isJoinable: false,
                    tooltip: "Vous ne pouvez pas rejoindre cette visio",
                };
            }
        } catch (error) {
            console.error("Error calculating visio status:", error);
            return {
                status: "Erreur",
                className: "text-gray-500",
                isJoinable: false,
                tooltip: "Erreur de calcul du statut",
            };
        }
    };

    const getStatusBadge = (status: string) => {
        const statusLower = status.toLowerCase();
        let badgeColor = "";
        let textColor = "";

        if (statusLower.includes("payé") || statusLower.includes("paye")) {
            badgeColor = "bg-green-500";
            textColor = "text-green-700";
        } else if (
            statusLower.includes("non payé") ||
            statusLower.includes("non paye") ||
            statusLower.includes("impayé")
        ) {
            badgeColor = "bg-red-500";
            textColor = "text-red-700";
        } else if (statusLower.includes("en attente") || statusLower.includes("attente")) {
            badgeColor = "bg-yellow-500";
            textColor = "text-yellow-700";
        } else if (statusLower.includes("à voir") || statusLower.includes("a voir")) {
            badgeColor = "bg-orange-500";
            textColor = "text-orange-700";
        } else {
            badgeColor = "bg-gray-500";
            textColor = "text-gray-700";
        }

        return (
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${badgeColor}`}></div>
                <span className={textColor}>{status}</span>
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

    if (!userTimezone) {
        return <p>Chargement du fuseau horaire de l&apos;utilisateur...</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent text-center">
                    <TableHead>Cours</TableHead>
                    <TableHead>Date (votre fuseau)</TableHead>
                    <TableHead>Heure (votre fuseau)</TableHead>
                    <TableHead>Durée</TableHead>
                    {/* Étape 1 : On renomme les colonnes pour plus de clarté */}
                    <TableHead>Statut Paiement</TableHead>
                    <TableHead>Statut Visio</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listAppointments.map((item) => {
                    // --- Ta logique existante (parfaite, on n'y touche pas) ---
                    const visioStatus = getVisioStatus(item.startDateTime, item.duration);
                    const { date: localDate, time: localTime } = formatDateInUserTimezone(item.startDateTime);
                    const appointmentDate = new Date(item.startDateTime.replace(" ", "T") + "Z");
                    const today = new Date();
                    const canCancel =
                        appointmentDate > today && (item.status === "Confirmé" || item.status === "En attente");
                    const canPay = appointmentDate > today && item.status === "En attente";
                    // --- Fin de la logique ---

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
                            <TableCell>{localDate}</TableCell>
                            <TableCell>{localTime}</TableCell>
                            <TableCell>{item.duration} mn</TableCell>

                            {/* Étape 2 : La colonne "Statut Paiement" fusionnée */}
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

                            {/* Étape 3 : On réintègre la colonne "Statut Visio" du collègue */}
                            <TableCell className={visioStatus.className}>{visioStatus.status}</TableCell>

                            {/* Étape 4 : La colonne "Actions" fusionnée */}
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
                    <TableCell colSpan={7}></TableCell> {/* Ajuster le colSpan */}
                </TableRow>
            </TableFooter>
        </Table>
    );
}
