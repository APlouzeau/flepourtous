"use client";
import { useState } from "react";
import axios from "axios";
import { useLoginStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function ConnexionPage() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const { setIsLoggedIn } = useLoginStore();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                mail,
                password,
            })
            .then((response) => {
                if (response.data == "Connexion réussie.") {
                    console.log(response.data);
                    setIsLoggedIn(true);
                    router.push("/profile");
                } else {
                    console.error("Erreur lors de la connexion :", response.data);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la connexion :", error);
            });
    };

    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Connexion</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
                    Se connecter
                </button>
            </form>
        </>
    );
}
