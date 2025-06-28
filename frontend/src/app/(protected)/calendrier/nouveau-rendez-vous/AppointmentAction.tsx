"use server";

import { getCookieBackend } from "@/lib/session";
import axios from "axios";
import { revalidatePath } from "next/cache";

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
    console.log("Data to be sent:", data);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createEvent`, data, {
            headers: {
                Cookie: `PHPSESSID=${cookie}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log("Response from appointmentAction:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        if (axios.isAxiosError(error) && error.response && error.response.data) {
            return error.response.data;
        }
        return { code: 0, message: "Une erreur s'est produite lors de l'enregistrement." };
    }
}

export async function deleteAppointment(idEvent: string) {
    const cookie = await getCookieBackend();
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/deleteEvent`,
            { idEvent },
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        console.log("Response from delete:", response.data);
        revalidatePath("/calendrier");
    } catch (error) {
        console.error("Error during deletion:", error);
    }
}

export async function getAvailableTimeSlots(date: string, userTimeZone: string, selectedDuration: string) {
    const cookie = await getCookieBackend();
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/getAvailableTimeSlots`,
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
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/getAllLessonsWithPrices`,
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
