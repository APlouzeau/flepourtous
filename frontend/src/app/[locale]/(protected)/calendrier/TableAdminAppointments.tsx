import { AppointmentRowProps, showBasicAppointmentProps } from "@/app/[locale]/types/appointments";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateInUserTimezone, useUserTimezone } from "@/lib/date";
import { useEffect, useState } from "react";
import { checkDeleteEvent, deleteAppointment } from "./nouveau-rendez-vous/AppointmentAction";
import CancelConfirmationModal from "@/components/CancelConfirmationModal";
import { useRouter } from "next/dist/client/components/navigation";

export default function TableAdminAppointments({ listAppointments }: AppointmentRowProps) {
    const { userTimezone, isLoading: timezoneLoading } = useUserTimezone();
    const router = useRouter();
    const [cancelModal, setCancelModal] = useState<{
        isOpen: boolean;
        eventId: string | null;
        eventTitle: string | null;
        message: string;
        code: number;
        isDeleting: boolean;
    }>({
        isOpen: false,
        eventId: null,
        eventTitle: null,
        message: "",
        code: 0,
        isDeleting: false,
    });
    const handleCancelModalClose = () => {
        setCancelModal({
            isOpen: false,
            eventId: null,
            eventTitle: null,
            message: "",
            code: 0,
            isDeleting: false,
        });
    };
    const handleConfirmCancel = async () => {
        if (!cancelModal.eventId) return;

        setCancelModal((prev) => ({ ...prev, isDeleting: true }));

        try {
            await deleteAppointment(cancelModal.eventId, cancelModal.code); // Utiliser le code de la modal
            setCancelModal({
                isOpen: false,
                eventId: null,
                eventTitle: null,
                message: "",
                code: 0,
                isDeleting: false,
            });
            router.refresh();
        } catch (error) {
            console.error("Erreur lors de l'annulation:", error);
            alert("Erreur lors de l'annulation du rendez-vous.");
            setCancelModal((prev) => ({ ...prev, isDeleting: false }));
        }
    };
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

    const handleRowClick = (item: showBasicAppointmentProps, isJoinable: boolean) => {
        if (isJoinable && item.visioLink) {
            window.open(item.visioLink, "_blank", "noopener,noreferrer");
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

    const formatDuration = (duration: string) => {
        const minutes = parseInt(duration);
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
        }
        return `${minutes} min`;
    };

    const handleCancelClick = async (eventId: string, eventTitle: string) => {
        try {
            // Pour l'admin, on passe le code 3 pour indiquer une annulation admin
            const response = await checkDeleteEvent(eventId, 3);
            setCancelModal({
                isOpen: true,
                eventId,
                eventTitle,
                message: response.message || "Voulez-vous vraiment annuler ce rendez-vous ?",
                code: response.code || 3, // Utiliser le code retourné par l'API
                isDeleting: false,
            });
        } catch (error) {
            console.error("Erreur lors de la vérification:", error);
            setCancelModal({
                isOpen: true,
                eventId,
                eventTitle,
                message: "Erreur lors de la vérification de l'annulation. Voulez-vous continuer ?",
                code: 0,
                isDeleting: false,
            });
        }
    };

    return (
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
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                    Commentaire
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
                            <TableHead className="font-semibold text-gray-900">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Heure
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">Durée</TableHead>
                            <TableHead className="font-semibold text-gray-900">Status</TableHead>
                            <TableHead className="font-semibold text-gray-900">Visio</TableHead>
                            <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listAppointments.map((item) => {
                            const { date: localDate, time: localTime } = formatDateInUserTimezone(
                                item.startDateTime,
                                userTimezone || "UTC",
                            );
                            const visioStatus = getVisioStatus(item.startDateTime, item.duration);
                            return (
                                <TableRow
                                    key={item.idEvent}
                                    className={`
                                            hover:bg-gray-50 transition-all duration-200 border-b border-gray-100
                                            ${visioStatus.isJoinable ? "cursor-pointer" : ""}
                                        `}
                                    title={visioStatus.tooltip}
                                    onClick={() => handleRowClick(item, visioStatus.isJoinable)}
                                >
                                    <TableCell className="font-medium text-gray-900">{item.studentName}</TableCell>
                                    <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                                    <TableCell className="font-medium text-gray-900">{item.description}</TableCell>
                                    <TableCell className="text-gray-700">{localDate}</TableCell>
                                    <TableCell className="text-gray-700">{localTime}</TableCell>
                                    <TableCell className="text-gray-700">{formatDuration(item.duration)}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell>
                                        <div
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                                                visioStatus.isJoinable ? "bg-green-50" : "bg-red-50"
                                            }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${visioStatus.badgeColor}`}></div>
                                            <span className={`text-sm font-medium ${visioStatus.className}`}>
                                                {visioStatus.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        {new Date(item.startDateTime) > currentTime &&
                                        item.status !== "Annulé - Google" &&
                                        item.status !== "Annulé - non remboursé" &&
                                        item.status !== "Annulé Google - Remboursé" &&
                                        item.status !== "Annulé Google - Non Remboursé" &&
                                        item.status !== "Annulé - Admin" &&
                                        item.status !== "Annulé - Non remboursé" &&
                                        item.status !== "Annulé - Remboursé" ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Empêche le clic sur la ligne
                                                    handleCancelClick(item.idEvent.toString(), item.title);
                                                }}
                                                className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                                Annuler
                                            </button>
                                        ) : (
                                            <span className="text-gray-500">Terminé</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <CancelConfirmationModal
                    isOpen={cancelModal.isOpen}
                    onClose={handleCancelModalClose}
                    onConfirm={handleConfirmCancel}
                    isLoading={cancelModal.isDeleting}
                    message={cancelModal.message}
                    code={cancelModal.code}
                    appointmentTitle={cancelModal.eventTitle || undefined}
                />
            </div>
        </div>
    );
}
