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
    };

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
    } catch (error: any) {
        console.error("Error during registration:", error);
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return { code: 0, message: "Une erreur s'est produite lors de l'enregistrement." };
    }
}

export async function deleteAppointment(eventId: string) {
    const cookie = await getCookieBackend();
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/deleteEvent`,
            { eventId },
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

export async function getAvailableTimeSlots(date: string) {
    const cookie = await getCookieBackend();
    console.log(date);
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/getAvailableTimeSlots`,
            { date },
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        console.log("Response from getAvailableTimeSlots:", response.data);
        const availableTimeSlots = generateTimeSlots(8, 22, 15, response.data);
        return availableTimeSlots;
    } catch (error) {
        console.error("Error during fetching available time slots:", error);
        return [];
    }
}

const generateTimeSlots = (startHour: number, endHour: number, interval: number, occupiedSlots: string[]) => {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(startHour, 0, 0, 0);
    endDate.setHours(endHour, 0, 0, 0);
    const timeSlots: string[] = [];
    for (let i = startDate.getTime(); i < endDate.getTime(); i += interval * 60 * 1000) {
        const date = new Date(i);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        if (!occupiedSlots.includes(`${hours}:${minutes}`)) {
            timeSlots.push(`${hours}:${minutes}`);
        }
    }
    return timeSlots;
};
