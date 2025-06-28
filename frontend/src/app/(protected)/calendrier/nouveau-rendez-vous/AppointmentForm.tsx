"use client";
import { getAvailableTimeSlots, registerAppointment } from "./AppointmentAction";
import { useEffect, useId, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { SelectNative } from "@/components/ui/select-native";
import { lessonsWithPrices, LessonWithPrice } from "@/app/types/lessons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewAppointmentForm({ lessons }: { lessons: lessonsWithPrices }) {
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [userTimezone, setUserTimezone] = useState<string>("");
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonWithPrice | null>(null);
    const router = useRouter();

    useEffect(() => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(userTimezone);
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
            if (date && userTimezone && selectedDuration) {
                setLoading(true);
                setError(null);
                setTimeSlots([]);
                try {
                    const availabledSlots = await getAvailableTimeSlots(date, userTimezone, selectedDuration);
                    if (availabledSlots.code == 0) {
                        setError(availabledSlots.message || "Aucun créneau disponible pour cette date.");
                    }
                    if (availabledSlots.code == 1 && availabledSlots.data.length > 0) {
                        setError(null);
                        setTimeSlots(availabledSlots.data);
                    }
                } catch (error) {
                    console.error("Error fetching available time slots:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setTimeSlots([]);
                setError(null);
            }
        };
        searchAvailableTimeSlots();
    }, [date, userTimezone, selectedDuration]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        if (selectedLesson && selectedLesson.idLesson != null) {
            formData.append("idLesson", selectedLesson.idLesson.toString());
        } else {
            console.error("Aucun cours sélectionné pour envoyer l'idLesson");
            setError("Veuillez sélectionner un cours.");
            setLoading(false);
            return;
        }
        const response = await registerAppointment(formData);
        setLoading(false);
        if (response.code === 1 || response.code === 10) {
            setSuccess(response.message || "Rendez-vous enregistré avec succès !");
            setTimeout(() => {
                router.push("/calendrier/nouveau-rendez-vous/paiement");
            }, 2000);
        } else {
            setError(response.message || "Une erreur s'est produite lors de l'enregistrement.");
        }
    };

    return (
        <form onSubmit={handleSubmit} method="POST" className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
            {userTimezone && (
                <div className="space-y-2 min-w-[300px]">
                    <Label htmlFor={id}>Fuseau Horaire (native)</Label>
                    <SelectNative id={id} name="userTimeZone" defaultValue={userTimezone}>
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
                <label htmlFor="lesson" className="block text-gray-700 font-bold mb-2">
                    cours
                    <RadioGroup
                        onValueChange={(value: string) => {
                            const lesson = lessons.find((l) => l.title === value);
                            if (lesson) {
                                setSelectedLesson(lesson);
                                setSelectedDuration(null);
                            }
                        }}
                        name="lesson"
                        className="[--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]"
                    >
                        {lessons &&
                            lessons.length > 0 &&
                            lessons.map((lesson) => (
                                <div key={lesson.idLesson} className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value={lesson.title}
                                        id={`lesson-${lesson.idLesson}`}
                                        disabled={loading}
                                    />
                                    <Label htmlFor={`lesson-${lesson.idLesson}`}>{`${lesson.title}`}</Label>
                                </div>
                            ))}
                    </RadioGroup>
                </label>
            </div>
            <div className="mb-4">
                <label htmlFor="duration" className="block text-gray-700 font-bold mb-2">
                    Durée
                    <RadioGroup
                        defaultValue=""
                        onValueChange={(value: string) => setSelectedDuration(value)}
                        name="duration"
                        className="[--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]"
                    >
                        {selectedLesson &&
                            selectedLesson.price != null &&
                            selectedLesson.price.map((durationPriceOption) => (
                                <div key={durationPriceOption.duration} className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value={durationPriceOption.duration.toString()}
                                        id={`duration-option-${selectedLesson.idLesson}-${durationPriceOption.duration}`}
                                        disabled={loading}
                                    />
                                    <Label
                                        htmlFor={`duration-option-${selectedLesson.idLesson}-${durationPriceOption.duration}`}
                                    >{`${durationPriceOption.duration} mn (${durationPriceOption.price}$)`}</Label>
                                </div>
                            ))}
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

            {/* <button
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
                disabled={loading || error !== null || timeSlots.length === 0 || !selectedLesson || !selectedDuration}
            >
                {loading ? "Veuillez patienter..." : "Réserver"}
            </button> */}
            <Button
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
                {loading ? "Veuillez patienter..." : "Réserver"}
            </Button>
        </form>
    );
}
