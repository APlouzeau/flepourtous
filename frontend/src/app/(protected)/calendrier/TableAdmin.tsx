"use client";

import { showBasicAppointmentProps } from "@/app/types/appointments";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { deleteAppointment } from "./nouveau-rendez-vous/AppointmentAction";
import { useEffect, useState } from "react";

interface AppointmentRowProps {
    listAppointments: showBasicAppointmentProps[];
}

export default function TableAdmin({ listAppointments }: AppointmentRowProps) {
    const [userTimezone, setUserTimezone] = useState<string | null>(null);

    useEffect(() => {
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
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
    console.log("TableUser", listAppointments);
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent text-center">
                        <TableHead>Elève</TableHead>
                        <TableHead>Cours</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Lien visio</TableHead>
                        <TableHead className="button">Annuler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listAppointments.map((item) => {
                        const { date: localDate, time: localTime } = formatDateInUserTimezone(item.startDateTime);
                        return (
                            <TableRow key={item.idEvent}>
                                <TableCell className="font-medium">{item.studentName}</TableCell>
                                {/* Ajout de la cellule pour le nom de l'élève */}
                                <TableCell className="font-medium">{item.description}</TableCell>
                                <TableCell>{localDate}</TableCell>
                                <TableCell>{localTime}</TableCell>
                                <TableCell>{item.duration}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>
                                    {item.visioLink ? <Link href={item.visioLink}>Lien</Link> : "Lien non disponible"}
                                </TableCell>
                                <button
                                    onClick={async () => {
                                        try {
                                            console.log(`Tentative d'annulation pour l'ID: ${item.idEvent}`);
                                            // Appelle la Server Action importée en passant l'ID converti en string
                                            await deleteAppointment(item.idEvent.toString());
                                            // Il faut ajouter revalidatePath dans la Server Action.
                                            alert(`Rendez-vous ${item.idEvent} annulé (ou tentative lancée).`); // Feedback simple
                                        } catch (error) {
                                            console.error("Erreur lors de l'annulation:", error);
                                            alert("Erreur lors de l'annulation du rendez-vous.");
                                        }
                                    }}
                                    className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded"
                                >
                                    Annuler
                                </button>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter className="bg-transparent">
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    );
}
