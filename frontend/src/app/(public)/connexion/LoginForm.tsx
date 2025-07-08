"use client";
import { createSession } from "@/lib/session";
import apiClient from "@/lib/axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import Button from "../../components/front/Button";

export default function LoginForm() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await apiClient
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/login`,
                {
                    mail,
                    password,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(async (response) => {
                if (response.data.code == 1) {
                    await createSession(response.data.data.role);
                    redirect("/profil");
                } else {
                    setError(response.data.message);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
                <input
                    type="email"
                    placeholder="Adresse email"
                    name="mail"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                    className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                />
            </div>
            <div>
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm">
                <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded accent-black" />
                    <span className="text-gray-600 select-none">Se souvenir de moi</span>
                </label>
                <Link
                    href="/mot-de-passe-oublie"
                    className="text-red-600 hover:text-red-700 font-medium transition-colors text-center sm:text-left"
                >
                    Mot de passe oublié ?
                </Link>
            </div>

            {error && (
                <p className="text-red-500 text-xs sm:text-sm text-center bg-red-50 p-3 rounded-xl border border-red-200">
                    {error}
                </p>
            )}

            <Button variant="black" type="submit" className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold">
                Connexion
            </Button>
        </form>
    );
}
