import { lessonsWithPrices } from "@/app/types/lessons";
import { getAllLessonsWithPrices } from "./AppointmentAction";
import NewAppointmentForm from "./AppointmentForm";

export default async function NewAppointmentPage() {
    const lessons: lessonsWithPrices = await getAllLessonsWithPrices();
    return (
        <div className="flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Nouveau Rendez-vous</h1>
            <p className="text-lg">Formulaire de prise de rendez-vous en cours...</p>
            <NewAppointmentForm lessons={lessons} />
        </div>
    );
}
