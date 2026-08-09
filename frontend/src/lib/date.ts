import { useSyncExternalStore } from "react";

export function formatDateInUserTimezone(
    utcDateTimeString: string | undefined,
    userTimezone: string | undefined,
    locale: string = "fr-FR",
) {
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

        const formattedDate = dateObj.toLocaleDateString(locale, {
            timeZone: userTimezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        const formattedTime = dateObj.toLocaleTimeString(locale, {
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
}

function subscribe() {
    // Le fuseau horaire ne change pas en cours de session, donc pas de vrai événement à écouter
    return () => {};
}

function getSnapshot() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getServerSnapshot() {
    return "UTC"; // valeur de repli pendant le rendu serveur
}

export function useUserTimezone() {
    const userTimezone = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return { userTimezone, isLoading: false };
}
