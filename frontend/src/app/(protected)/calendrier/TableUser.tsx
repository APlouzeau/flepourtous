"use client";

import { showBasicAppointmentProps } from "@/app/types/appointments";
import { useEffect, useState } from "react";

// Imports pour react-big-calendar
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale"; // Pour la localisation française de base
import "react-big-calendar/lib/css/react-big-calendar.css"; // TRÈS IMPORTANT : le CSS

interface AppointmentRowProps {
    listAppointments: showBasicAppointmentProps[];
}

// Configuration minimale du localizer avec date-fns
const locales = {
    fr: fr,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { locale: fr }), // Commence la semaine le lundi
    getDay,
    locales,
});

export default function TableUser({ listAppointments }: AppointmentRowProps) {
    // Votre logique de fuseau horaire existante peut rester si vous en avez besoin pour autre chose,
    // mais pour react-big-calendar, nous allons lui donner des objets Date JavaScript.
    // const [userTimezone, setUserTimezone] = useState<string | null>(null);
    // useEffect(() => {
    //     setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    // }, []);

    // Transformer vos données pour react-big-calendar
    // 'start' et 'end' DOIVENT être des objets Date JavaScript.
    const calendarEvents = listAppointments.map((app) => {
        // Assurez-vous que app.startDateTime est une chaîne ISO valide ou une chaîne
        // que le constructeur Date peut interpréter correctement.
        // Si app.startDateTime est déjà en UTC, c'est encore mieux.
        const startDate = new Date(app.startDateTime || new Date()); // Fournir une date par défaut si undefined

        // Calculez l'heure de fin. app.duration est en minutes.
        // Si app.duration est undefined ou null, vous pouvez définir une durée par défaut ou gérer l'erreur.
        const durationMinutes = app.duration || 0; // Durée par défaut de 0 si undefined
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

        return {
            title: app.title || app.description || "Rendez-vous", // Assurez-vous d'avoir un titre
            start: startDate,
            end: endDate,
            allDay: false, // Mettez à true si c'est un événement sur toute la journée
            resource: {
                /* Vous pouvez mettre ici des données supplémentaires si besoin */ idEvent: app.idEvent,
                status: app.status,
                visioLink: app.visioLink,
            },
        };
    });

    return (
        <>
            <div style={{ height: "70vh", marginTop: "20px", marginLeft: "5vw", marginRight: "5vw" }}>
                {" "}
                {/* Donnez une hauteur au calendrier */}
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    culture="fr"
                    messages={{
                        // Traduction des boutons et messages
                        next: "Suivant",
                        previous: "Précédent",
                        today: "Aujourd'hui",
                        month: "Mois",
                        week: "Semaine",
                        day: "Jour",
                        agenda: "Agenda",
                        date: "Date",
                        time: "Heure",
                        event: "Événement",
                        noEventsInRange: "Aucun événement pour cette période.",
                        showMore: (total) => `+ ${total} de plus`,
                    }}
                />
            </div>
        </>
    );
}
