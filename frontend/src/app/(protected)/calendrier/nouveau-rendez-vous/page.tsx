import { lessonsWithPrices } from "@/app/types/lessons";
import { getAllLessonsWithPrices } from "./AppointmentAction";
import NewAppointmentForm from "./AppointmentForm";
import axios from "axios";
import { getWallet } from "@/lib/session";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

export default async function NewAppointmentPage() {
    const lessons: lessonsWithPrices = await getAllLessonsWithPrices();
    const wallet = await getWallet();
    return (
        <>
            <div>
                <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
                    <div className="flex items-center space-x-4">
                        <span className="text-lg">Solde: {wallet ? `${wallet} $` : "Chargement..."}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Nouveau Rendez-vous</h1>
                <p className="text-lg">Formulaire de prise de rendez-vous en cours...</p>
                <NewAppointmentForm lessons={lessons} />
            </div>
        </>
    );
}
