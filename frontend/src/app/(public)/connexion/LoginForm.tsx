"use client";
import { createSession } from "@/lib/session";
import axios from "axios";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios
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
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <input
                    type="email"
                    placeholder="Mail"
                    name="mail"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
                Se connecter
            </button>
        </form>
    );
}
