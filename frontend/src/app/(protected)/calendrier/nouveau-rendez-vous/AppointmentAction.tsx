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
    };
    console.log("send : Form data:", formData);
    console.log("Data to be sent:", data);

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createEvent`, data, {
            headers: {
                Cookie: `PHPSESSID=${cookie}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log("Response from register:", response.data);
    } catch (error) {
        console.error("Error during registration:", error);
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
