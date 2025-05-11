import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { getCookieBackend, getRole, verifyToken } from "@/lib/session";
import { showBasicAppointmentProps } from "@/app/types/appointments";
import TableUser from "./TableUser";
import TableAdmin from "./TableAdmin";

export default async function CalendarPage() {
    const cookie = await getCookieBackend();
    const role = await getRole();
    let appointmentList: showBasicAppointmentProps[] = [];
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/listEvents`,
            {},
            {
                headers: {
                    Cookie: `PHPSESSID=${cookie}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        console.log("Response from listEvents:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
            appointmentList = response.data.data;
        } else {
            console.warn("La réponse de l'API ne contient pas de tableau d'événements valide dans .data");
        }
    } catch (error) {
        console.error("Error during listEvents:", error);
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center  bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Calendrier</h1>
            </div>
            <Button asChild>
                <Link
                    href="/calendrier/nouveau-rendez-vous"
                    className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded"
                >
                    Nouveau RDV
                </Link>
            </Button>
            {role !== "admin" ? (
                <TableUser listAppointments={appointmentList}></TableUser>
            ) : (
                <TableAdmin listAppointments={appointmentList}></TableAdmin>
            )}
        </>
    );
}
