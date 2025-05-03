import registerAppointment from "./AppointmentAction";

export default function NewAppointmentForm() {
    return (
        <form
            action={registerAppointment}
            method="POST"
            className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg"
        >
            <div className="mb-4">
                <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">
                    Date
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </label>
            </div>
            <div className="mb-4">
                <label htmlFor="startTime" className="block text-gray-700 font-bold mb-2">
                    Heure
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </label>
            </div>
            <div className="mb-4">
                <label htmlFor="duration" className="block text-gray-700 font-bold mb-2">
                    Durée
                    <input
                        type="time"
                        id="duration"
                        name="duration"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </label>
            </div>
            <div>
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                    Commentaire (optionnel)
                    <textarea
                        id="description"
                        name="description"
                        className="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                </label>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
                Reserver
            </button>
        </form>
    );
}
