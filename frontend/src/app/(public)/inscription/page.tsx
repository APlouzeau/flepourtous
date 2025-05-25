"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [nickName, setNickName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                nickName,
                firstName,
                lastName,
                mail,
                password,
                passwordConfirm,
            })
            .then((response) => {
                if (response.data.code == 1) {
                    setSuccess(response.data.message);
                } else {
                    setError(response.data.message);
                }
                console.log("test : ", response.data);
            })
            .catch((error) => {
                console.error("Erreur lors de la connexion :", error);
            });
    };

    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Inscription</h2>
            <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="string"
                            placeholder="Pseudo"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="string"
                            placeholder="Prenom"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="string"
                            placeholder="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
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
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
                    <button className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 mt-2 text-lg">
                        Inscription
                    </button>
                </form>
                <Link
                    href="/connexion"
                    type="submit"
                    className="btn w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 mt-2 text-lg"
                >
                    Se connecter
                </Link>
            </div>
        </>
    );
}
