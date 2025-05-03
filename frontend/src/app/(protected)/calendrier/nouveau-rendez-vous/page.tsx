import NewAppointmentForm from "./AppointmentForm";

export default async function NewAppointmentPage() {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Nouveau Rendez-vous</h1>
            <p className="text-lg">Formulaire de prise de rendez-vous en cours...</p>
            <NewAppointmentForm />
        </div>
    );
}
