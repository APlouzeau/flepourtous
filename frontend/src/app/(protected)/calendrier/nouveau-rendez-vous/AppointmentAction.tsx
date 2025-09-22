"use server";

import { getCookieBackend } from "@/lib/session";
import apiClient from "@/lib/axios";
import { revalidatePath } from "next/cache";
import axios from "axios";

export async function registerAppointment(formData: FormData) {
    const cookie = await getCookieBackend();
    const data = {
        description: formData.get("description"),
        startDate: formData.get("startDate"),
        startTime: formData.get("startTime"),
        duration: formData.get("duration"),
        userTimeZone: formData.get("userTimeZone"),
        idLesson: formData.get("idLesson"),
    };
    try {
        const response = await apiClient.post("/api/createEvent", data, {
            headers: {
                Cookie: `PHPSESSID=${cookie}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        if (axios.isAxiosError(error) && error.response && error.response.data) {
            return error.response.data;
        }
        return { code: 0, message: "Une erreur s'est produite lors de l'enregistrement." };
    }
}

export async function prepareRepaymentAction(eventId: string) {
    const cookie = await getCookieBackend();
    try {
        const response = await apiClient.post(
            "/api/prepareRepayment",
            { eventId },
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error preparing repayment:", error);
        if (axios.isAxiosError(error) && error.response && error.response.data) {
            return error.response.data;
        }
        return { code: 0, message: "Une erreur s'est produite lors de la préparation du paiement." };
    }
}

export async function checkDeleteEvent(idEvent: string) {
    const cookie = await getCookieBackend();
    try {
        const response = await apiClient.post(
            "/api/checkDeleteEvent",
            { idEvent },
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        console.log("Response from checkDeleteEvent:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error checking deletion:", error);
        if (axios.isAxiosError(error) && error.response && error.response.data) {
            return error.response.data;
        }
        return { code: 0, message: "Une erreur s'est produite lors de la vérification de l'annulation." };
    }
}

export async function deleteAppointment(idEvent: string, code: number) {
    const cookie = await getCookieBackend();
    try {
        await apiClient.post(
            "/api/deleteEvent",
            { idEvent, code },
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        revalidatePath("/calendrier");
    } catch (error) {
        console.error("Error during deletion:", error);
    }
}

export async function getAvailableTimeSlots(date: string, userTimeZone: string, selectedDuration: string) {
    const cookie = await getCookieBackend();
    try {
        const response = await apiClient.post(
            "/api/getAvailableTimeSlots",
            { date, userTimeZone, selectedDuration },
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error during fetching available time slots:", error);
        return [];
    }
}

export async function getAllLessonsWithPrices() {
    const cookie = await getCookieBackend();
    try {
        const response = await apiClient.post(
            "/api/getAllLessonsWithPrices",
            {},
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching lessons information:", error);
        return [];
    }
}
