import { useEffect, useState } from "react";

export function formatDateInUserTimezone(utcDateTimeString: string | undefined, userTimezone: string | undefined) {
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
}

export function useUserTimezone() {
    const [userTimezone, setUserTimezone] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setUserTimezone(timezone);
        } catch (error) {
            console.error("Error detecting user timezone:", error);
            setUserTimezone("UTC");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { userTimezone, isLoading };
}
