"use client";
import { getAvailableTimeSlots, registerAppointment } from "./AppointmentAction";
import { useEffect, useId, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { SelectNative } from "@/components/ui/select-native";

export default function NewAppointmentForm() {
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [timezone, setTimezone] = useState<string>("");

    useEffect(() => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(userTimezone);
    }, []);

    const id = useId();

    const timezones = Intl.supportedValuesOf("timeZone");

    const formattedTimezones = useMemo(() => {
        return timezones
            .map((tz) => {
                const formatter = new Intl.DateTimeFormat("en", {
                    timeZone: tz,
                    timeZoneName: "shortOffset",
                });
                const parts = formatter.formatToParts(new Date());
                const offset = parts.find((part) => part.type === "timeZoneName")?.value || "";
                const modifiedOffset = offset === "GMT" ? "GMT+0" : offset;

                return {
                    value: tz,
                    label: `(${modifiedOffset}) ${tz.replace(/_/g, " ")}`,
                    numericOffset: parseInt(offset.replace("GMT", "").replace("+", "") || "0"),
                };
            })
            .sort((a, b) => a.numericOffset - b.numericOffset);
    }, [timezones]);

    useEffect(() => {
        const searchAvailableTimeSlots = async () => {
            const availabledSlots = await getAvailableTimeSlots(date);
            setTimeSlots(availabledSlots);
        };
        searchAvailableTimeSlots();
    }, [date]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const response = await registerAppointment(formData);
        setLoading(false);
        if (response.code === 1) {
            setSuccess(response.message || "Rendez-vous enregistré avec succès !");
        } else {
            setError(response.message || "Une erreur s'est produite lors de l'enregistrement.");
        }
    };

    return (
        <form onSubmit={handleSubmit} method="POST" className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
            {timezone && (
                <div className="space-y-2 min-w-[300px]">
                    <Label htmlFor={id}>Fuseau Horaire (native)</Label>
                    <SelectNative id={id} name="userTimeZone" defaultValue={timezone}>
                        {formattedTimezones.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </SelectNative>
                </div>
            )}
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
                            <RadioGroupItem value="30" id="1" disabled={loading} />
                            <Label htmlFor="1">30</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="45" id="2" disabled={loading} />
                            <Label htmlFor="2">45</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="60" id="3" disabled={loading} />
                            <Label htmlFor="3">60</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="90" id="4" disabled={loading} />
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
                        disabled={loading}
                    ></textarea>
                </label>
            </div>
            {error && <p className="text-red-500 text-sm text-center my-2">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center my-2">{success}</p>}

            <button
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Enregistrement..." : "Réserver"}
            </button>
        </form>
    );
}
