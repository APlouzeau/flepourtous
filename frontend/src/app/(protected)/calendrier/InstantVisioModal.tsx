"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface InstantVisioModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InstantVisioModal({ isOpen, onClose }: InstantVisioModalProps) {
    const [email, setEmail] = useState("");
    const [duration, setDuration] = useState(60);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/createInstantVisio`,
                {
                    email: email,
                    duration: duration
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.code === 1) {
                // Ouvrir le salon visio directement
                window.open(response.data.data.roomUrl, '_blank', 'noopener,noreferrer');
                
                // Fermer le modal et réinitialiser
                setEmail("");
                setDuration(60);
                onClose();
                
                alert(`Salon visio créé avec succès ! Durée : ${duration} minutes`);
            } else {
                setError(response.data.message || "Erreur lors de la création du salon");
            }
        } catch (error: unknown) {
            console.error("Error creating instant visio:", error);
            const errorMessage = error instanceof Error && 'response' in error && 
                                typeof error.response === 'object' && error.response !== null &&
                                'data' in error.response && 
                                typeof error.response.data === 'object' && error.response.data !== null &&
                                'message' in error.response.data && 
                                typeof error.response.data.message === 'string'
                                ? error.response.data.message 
                                : "Erreur lors de la création du salon visio";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setEmail("");
            setDuration(60);
            setError("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Créer un salon visio instantané</h2>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse email de l&apos;élève
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="eleve@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Durée du salon (en minutes)
                        </label>
                        <select
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isLoading}
                        >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                        </select>
                    </div>

                    {error && ( 
                        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !email}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            {isLoading ? "Création..." : "Créer et rejoindre"}
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-xs text-gray-500">
                    <p>• Le salon sera accessible 15 minutes avant sa création</p>
                    <p>• Il restera ouvert pendant la durée sélectionnée + 15 minutes</p>
                    <p>• Le salon s&apos;ouvrira automatiquement après création</p>
                </div>
            </div>
        </div>
    );
} 