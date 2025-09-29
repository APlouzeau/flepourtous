import apiClient from "@/lib/axios";
import { showBasicAppointmentProps, showInvoicableAppointmentProps } from "@/app/types/appointments";
import { getCookieBackend } from "@/lib/session";

export async function appointmentList(): Promise<showBasicAppointmentProps[]> {
    try {
        const cookie = await getCookieBackend();

        const response = await apiClient.post(
            "/api/listEvents",
            {},
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );

        if (response.data && Array.isArray(response.data.data)) {
            const appointments = response.data.data;

            appointments.sort((a: showBasicAppointmentProps, b: showBasicAppointmentProps) => {
                const dateA = new Date(a.startDateTime).getTime();
                const dateB = new Date(b.startDateTime).getTime();
                return dateB - dateA;
            });

            return appointments;
        } else {
            console.warn("La réponse de l'API ne contient pas de tableau d'événements valide dans .data");
            return [];
        }
    } catch (error) {
        console.error("Error during listEvents:", error);
        return [];
    }
}

export async function listInvoices(): Promise<showInvoicableAppointmentProps[]> {
    try {
        const cookie = await getCookieBackend();

        const response = await apiClient.post(
            "/api/getInvoices",
            {},
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        console.log("Invoices response data:", response.data); // Debugging line
        if (response.data && Array.isArray(response.data.data)) {
            const invoiceList = response.data.data;

            invoiceList.sort((a: showBasicAppointmentProps, b: showBasicAppointmentProps) => {
                const dateA = new Date(a.startDateTime).getTime();
                const dateB = new Date(b.startDateTime).getTime();
                return dateB - dateA;
            });

            return invoiceList;
        } else {
            console.warn("La réponse de l'API ne contient pas de tableau d'événements valide dans .data");
            return [];
        }
    } catch (error) {
        console.error("Error during listEventsAdmin:", error);
        return [];
    }
}
