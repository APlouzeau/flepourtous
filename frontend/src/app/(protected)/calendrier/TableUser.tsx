"use client";

import { showBasicAppointmentProps } from "@/app/types/appointments";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { deleteAppointment, prepareRepaymentAction } from "./nouveau-rendez-vous/AppointmentAction";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AppointmentRowProps {
    listAppointments: showBasicAppointmentProps[];
}

export default function TableUser({ listAppointments }: AppointmentRowProps) {
    const [userTimezone, setUserTimezone] = useState<string | null>(null);
    const [isRepaying, setIsRepaying] = useState<string | null>(null);
    const router = useRouter();

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

    const handleRepay = async (eventId: string) => {
        setIsRepaying(eventId);
        const response = await prepareRepaymentAction(eventId);
        console.log("Response from prepareRepaymentAction:", response);
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
                    <TableHead>Status</TableHead>
                    <TableHead>Lien visio</TableHead>
                    <TableHead className="button">Annuler</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listAppointments.map((item) => {
                    const { date: localDate, time: localTime } = formatDateInUserTimezone(item.startDateTime);
                    const appointmentDate = new Date(item.startDateTime.replace(" ", "T") + "Z");
                    const today = new Date();
                    const canCancel =
                        appointmentDate > today && (item.status === "Confirmé" || item.status === "En attente");

                    const canPay = appointmentDate > today && item.status === "En attente";
                    return (
                        <TableRow key={item.idEvent}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{localDate}</TableCell>
                            <TableCell>{localTime}</TableCell>
                            <TableCell>{item.duration} mn</TableCell>
                            <TableCell>
                                {item.status === "En attente" && canPay ? (
                                    <Button
                                        onClick={() => handleRepay(item.idEvent.toString())}
                                        disabled={isRepaying === item.idEvent.toString()}
                                        variant="destructive"
                                    >
                                        {isRepaying === item.idEvent.toString() ? "Préparation..." : "Payer"}
                                    </Button>
                                ) : (
                                    item.status
                                )}
                            </TableCell>
                            <TableCell>
                                {item.visioLink ? (
                                    <Link href={item.visioLink} target="_blank" rel="noopener noreferrer">
                                        Lien
                                    </Link>
                                ) : (
                                    "Lien non disponible"
                                )}
                            </TableCell>
                            <TableCell>
                                {canCancel ? (
                                    <button
                                        onClick={async () => {
                                            if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
                                                try {
                                                    await deleteAppointment(item.idEvent.toString());
                                                    alert(`Rendez-vous annulé.`);
                                                    // Idéalement, il faudrait rafraîchir la liste ici
                                                    router.refresh();
                                                } catch (error) {
                                                    console.error("Erreur lors de l'annulation:", error);
                                                    alert("Erreur lors de l'annulation du rendez-vous.");
                                                }
                                            }
                                        }}
                                        className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded"
                                    >
                                        Annuler
                                    </button>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </TableCell>
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
    );
}
