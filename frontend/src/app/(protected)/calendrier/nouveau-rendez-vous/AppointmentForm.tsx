"use client";
import { getAvailableTimeSlots, registerAppointment } from "./AppointmentAction";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function NewAppointmentForm() {
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    useEffect(() => {
        const searchAvailableTimeSlots = async () => {
            const availabledSlots = await getAvailableTimeSlots(date);
            setTimeSlots(availabledSlots);
        };
        searchAvailableTimeSlots();
    }, [date]);

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
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </label>
            </div>
            <div className="mb-4">
                <label htmlFor="startTime" className="block text-gray-700 font-bold mb-2">
                    Horaire
                    <select
                        id="startTime"
                        name="startTime"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="mb-4">
                <label htmlFor="duration" className="block text-gray-700 font-bold mb-2">
                    Durée
                    <RadioGroup
                        defaultValue="30"
                        name="duration"
                        className="[--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]"
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="30" id="1" />
                            <Label htmlFor="1">30</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="45" id="2" />
                            <Label htmlFor="2">45</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="60" id="3" />
                            <Label htmlFor="3">60</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="90" id="4" />
                            <Label htmlFor="4">90</Label>
                        </div>
                    </RadioGroup>
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
