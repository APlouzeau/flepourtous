"use client";
import Button from "@/app/components/front/Button";
import { LessonsWithPrices, LessonWithPrice } from "@/app/types/lessons";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import { orderPacks } from "./PacksAction";
import { useRouter } from "next/navigation";

export default function PackForm({ lessons }: { lessons: LessonsWithPrices }) {
    const [selectedLesson, setSelectedLesson] = useState<LessonWithPrice | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedPack, setSelectedPack] = useState<string>("");
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedLesson) {
            setError("Veuillez sélectionner une matière.");
            return;
        }
        if (!selectedDuration) {
            setError("Veuillez sélectionner une durée.");
            return;
        }
        if (!selectedPack) {
            setError("Veuillez sélectionner un pack.");
            return;
        }

        setLoading(true);
        try {
            const response = await orderPacks(selectedLesson.idLesson.toString(), selectedDuration, selectedPack);
            setSuccess(response.message || "Rendez-vous enregistré avec succès !");
            setTimeout(() => {
                router.push("/calendrier/nouveau-rendez-vous/paiement");
            }, 2000);
        } catch (error) {
            console.error("Erreur lors de la création du pack :", error);
            setError("Une erreur s'est produite lors de la création du pack.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} method="POST" className="space-y-8">
            <div className="space-y-4">
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
                                const lesson = lessons.find((l) => l.idLesson.toString() === value);
                                if (lesson) {
                                    setSelectedLesson(lesson);
                                    setSelectedDuration(null);
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
                                            value={lesson.idLesson.toString()}
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
                    {/* 2. Durée */}
                    {selectedLesson && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                <label className="text-base font-semibold text-gray-900">Durée</label>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <RadioGroup
                                    value={selectedDuration || ""}
                                    onValueChange={(value: string) => {
                                        setSelectedDuration(value);
                                        setError(null);
                                    }}
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

                    {selectedDuration && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                <label className="text-base font-semibold text-gray-900">Pack</label>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <RadioGroup
                                    value={selectedPack || ""}
                                    onValueChange={(value: string) => setSelectedPack(value)}
                                    name="pack"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                >
                                    <div
                                        key={5}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem
                                                value="5"
                                                id="pack-5"
                                                disabled={loading}
                                                className="text-gray-700"
                                                style={{ "--primary": "#1D1E1C" } as React.CSSProperties}
                                            />
                                            <Label htmlFor="pack-5" className="cursor-pointer">
                                                <div className="font-medium text-gray-900">5 cours</div>
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem
                                                value="10"
                                                id="pack-10"
                                                disabled={loading}
                                                className="text-gray-700"
                                                style={{ "--primary": "#1D1E1C" } as React.CSSProperties}
                                            />
                                            <Label htmlFor="pack-10" className="cursor-pointer">
                                                <div className="font-medium text-gray-900">10 cours</div>
                                            </Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {error && <div className="text-red-600 font-medium">{error}</div>}
            {/* Bouton de soumission */}
            <div className="pt-6">
                <Button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white shadow-lg hover:shadow-xl"
                >
                    Commander un pack
                </Button>
            </div>
        </form>
    );
}
