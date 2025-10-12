"use client";
import { getAvailableTimeSlots, registerAppointment } from "./AppointmentAction";
import { useEffect, useId, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectNative } from "@/components/ui/select-native";
import { LessonsWithPrices, LessonWithPrice } from "@/app/types/lessons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewAppointmentForm({ lessons }: { lessons: LessonsWithPrices }) {
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successTimeout, setSuccessTimeout] = useState<boolean>(false);
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
            if (date && userTimezone && selectedDuration && selectedDuration !== "null" && selectedDuration !== null) {
                setLoading(true);
                setError(null);
                setTimeSlots([]);
                try {
                    const availabledSlots = await getAvailableTimeSlots(date, userTimezone, selectedDuration);

                    if (availabledSlots.code == 0) {
                        setError(availabledSlots.message || "Aucun créneau disponible pour cette date.");
                        setTimeSlots([]);
                    } else if (availabledSlots.code == 1 && availabledSlots.data && availabledSlots.data.length > 0) {
                        setError(null);
                        setTimeSlots(availabledSlots.data);
                    } else if (
                        availabledSlots.code == 1 &&
                        (!availabledSlots.data || availabledSlots.data.length === 0)
                    ) {
                        setError("Aucun créneau disponible pour cette date.");
                        setTimeSlots([]);
                    } else {
                        setError("Erreur lors de la récupération des créneaux.");
                        setTimeSlots([]);
                    }
                } catch (error) {
                    console.error("💥 Erreur lors de la récupération des créneaux:", error);
                    setError("Erreur de connexion lors de la récupération des créneaux.");
                    setTimeSlots([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setTimeSlots([]);
                setError(null);
                setLoading(false);
            }
        };

        // Debounce pour éviter trop d'appels API
        const timeoutId = setTimeout(() => {
            searchAvailableTimeSlots();
        }, 300);

        return () => clearTimeout(timeoutId);
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
            setSuccessTimeout(true);
            setTimeout(() => {
                router.push("/calendrier/nouveau-rendez-vous/paiement");
            }, 2000);
        } else {
            setError(response.message || "Une erreur s'est produite lors de l'enregistrement.");
        }
    };

    return (
        <form onSubmit={handleSubmit} method="POST" className="space-y-8">
            {/* 1. Fuseau horaire */}
            {userTimezone && (
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <Label htmlFor={id} className="text-base font-semibold text-gray-900">
                            Fuseau horaire
                        </Label>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <SelectNative
                            id={id}
                            name="userTimeZone"
                            value={userTimezone}
                            onChange={(e) => setUserTimezone(e.target.value)}
                            className="w-full bg-white border-gray-300 rounded-lg shadow-sm focus:border-gray-600 focus:ring-gray-600"
                            style={{ "--ring-color": "#1D1E1C", "--border-color": "#1D1E1C" } as React.CSSProperties}
                        >
                            {formattedTimezones.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </SelectNative>
                    </div>
                </div>
            )}

            {/* 2. Date */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z"
                        />
                    </svg>
                    <label htmlFor="startDate" className="text-base font-semibold text-gray-900">
                        Date du cours
                    </label>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                        required
                        className="w-full bg-white border-gray-300 rounded-lg shadow-sm p-3"
                        style={{ "--ring-color": "#1D1E1C", "--border-color": "#1D1E1C" } as React.CSSProperties}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#1D1E1C";
                            e.target.style.boxShadow = "0 0 0 1px #1D1E1C";
                        }}
                    />
                </div>
            </div>

            {/* 3. Cours */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    <label className="text-base font-semibold text-gray-900">Matière</label>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <RadioGroup
                        onValueChange={(value: string) => {
                            const lesson = lessons.find((l) => l.title === value);
                            if (lesson) {
                                setSelectedLesson(lesson);
                                setSelectedDuration(null);
                                // Réinitialiser les créneaux quand on change de matière
                                setTimeSlots([]);
                                setError(null);
                            }
                        }}
                        name="lesson"
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                        {lessons &&
                            lessons.length > 0 &&
                            lessons.map((lesson) => (
                                <div
                                    key={lesson.idLesson}
                                    className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                                >
                                    <RadioGroupItem
                                        value={lesson.title}
                                        id={`lesson-${lesson.idLesson}`}
                                        disabled={loading}
                                        className="text-gray-700"
                                        style={{ "--primary": "#1D1E1C" } as React.CSSProperties}
                                    />
                                    <Label
                                        htmlFor={`lesson-${lesson.idLesson}`}
                                        className="font-medium text-gray-900 cursor-pointer flex-1"
                                    >
                                        {lesson.title}
                                    </Label>
                                </div>
                            ))}
                    </RadioGroup>
                </div>
            </div>

            {/* 4. Durée */}
            {selectedLesson && (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <label className="text-base font-semibold text-gray-900">Durée et tarif</label>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <RadioGroup
                            value={selectedDuration || ""}
                            onValueChange={(value: string) => setSelectedDuration(value)}
                            name="duration"
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                            {selectedLesson.price?.map((durationPriceOption) => (
                                <div
                                    key={durationPriceOption.duration}
                                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem
                                            value={durationPriceOption.duration.toString()}
                                            id={`duration-option-${selectedLesson.idLesson}-${durationPriceOption.duration}`}
                                            disabled={loading}
                                            className="text-gray-700"
                                            style={{ "--primary": "#1D1E1C" } as React.CSSProperties}
                                        />
                                        <Label
                                            htmlFor={`duration-option-${selectedLesson.idLesson}-${durationPriceOption.duration}`}
                                            className="cursor-pointer"
                                        >
                                            <div className="font-medium text-gray-900">
                                                {durationPriceOption.duration} minutes
                                            </div>
                                        </Label>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold" style={{ color: "#1D1E1C" }}>
                                            {durationPriceOption.price}€
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            )}

            {/* 5. Heure */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <label htmlFor="startTime" className="text-base font-semibold text-gray-900">
                        Horaire
                    </label>
                    {/* Debug info */}
                    <div className="text-xs text-gray-500">
                        {!date && "📅 Date manquante"}
                        {!userTimezone && "🌍 Fuseau manquant"}
                        {!selectedDuration && "⏱️ Durée manquante"}
                        {loading && "🔄 Chargement..."}
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {loading && date && userTimezone && selectedDuration ? (
                        <div className="flex items-center justify-center py-3">
                            <svg
                                className="animate-spin h-5 w-5 text-gray-500 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span className="text-gray-600">Recherche des créneaux disponibles...</span>
                        </div>
                    ) : (
                        <select
                            id="startTime"
                            name="startTime"
                            required
                            disabled={timeSlots.length === 0}
                            className="w-full bg-white border-gray-300 rounded-lg shadow-sm p-3 disabled:bg-gray-100 disabled:text-gray-400"
                            style={{ "--ring-color": "#1D1E1C", "--border-color": "#1D1E1C" } as React.CSSProperties}
                            onFocus={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.borderColor = "#1D1E1C";
                                    e.target.style.boxShadow = "0 0 0 1px #1D1E1C";
                                }
                            }}
                        >
                            <option value="">
                                {!date || !userTimezone || !selectedDuration
                                    ? "Veuillez d'abord sélectionner une matière et une durée"
                                    : timeSlots.length === 0
                                    ? "Aucun créneau disponible pour cette configuration"
                                    : "Sélectionnez un horaire"}
                            </option>
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* 6. Commentaire */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <label htmlFor="description" className="text-base font-semibold text-gray-900">
                        Commentaire <span className="text-sm font-normal text-gray-500">(optionnel)</span>
                    </label>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Ajoutez des détails ou des questions spécifiques pour votre cours..."
                        className="w-full bg-white border-gray-300 rounded-lg shadow-sm p-3 resize-none"
                        disabled={loading}
                        style={{ "--ring-color": "#1D1E1C", "--border-color": "#1D1E1C" } as React.CSSProperties}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#1D1E1C";
                            e.target.style.boxShadow = "0 0 0 1px #1D1E1C";
                        }}
                    />
                </div>
            </div>

            {/* Messages d'erreur et de succès */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                    <div className="flex">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bouton de soumission */}
            <div className="pt-6">
                <Button
                    type="submit"
                    disabled={
                        loading || successTimeout || error !== null || timeSlots.length === 0 || !selectedLesson || !selectedDuration
                    }
                    className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white shadow-lg hover:shadow-xl"
                    style={{
                        backgroundColor: loading || successTimeout ? "#9CA3AF" : "#1D1E1C",
                    }}
                    onMouseEnter={(e) => {
                        if (!loading && !successTimeout && !e.currentTarget.disabled) {
                            e.currentTarget.style.backgroundColor = "#111111";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading && !successTimeout && !e.currentTarget.disabled) {
                            e.currentTarget.style.backgroundColor = "#1D1E1C";
                        }
                    }}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Réservation en cours...
                        </div>
                    ) : successTimeout ? (
                        <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Redirection en cours...
                        </div>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Réserver mon cours
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
