import apiClient from "@/lib/axios";
import { showBasicAppointmentProps, showInvoicableAppointmentProps } from "@/app/types/appointments";
import { getCookieBackend } from "@/lib/session";

interface filtersProps {
    begin_period?: string;
    end_period?: string;
    user_id?: string;
    invoiced?: number;
    status?: string;
}

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

export async function listInvoices(filters?: filtersProps): Promise<showInvoicableAppointmentProps[]> {
    try {
        const response = await apiClient.post("/api/getInvoices", filters || {}, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log("Response from getInvoices:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
            const invoiceList = response.data.data;
            console.log("✅ Invoice list before sort:", invoiceList.length, "items");
            console.log("📋 First item:", invoiceList[0]);

            invoiceList.sort((a: showBasicAppointmentProps, b: showBasicAppointmentProps) => {
                const dateA = new Date(a.startDateTime).getTime();
                const dateB = new Date(b.startDateTime).getTime();
                return dateB - dateA;
            });

            console.log("🔄 Invoice list after sort:", invoiceList.length, "items");
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

export async function setInvoiced(idEvent: string) {
    try {
        const cookie = await getCookieBackend();
        const response = await apiClient.post(
            "/api/setInvoiced",
            { idEvent },
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        if (response.data && response.data.code === 1) {
            return response.data;
            alert(`Rendez-vous facturé avec succès`);
        }
    } catch (error) {
        console.error("Error setting invoiced status:", error);
    }
}
