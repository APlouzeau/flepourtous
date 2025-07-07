"use client";
import { useState } from "react";
import apiClient from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import Button from "../../components/front/Button";

export default function RegisterPage() {
    const [nickName, setNickName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
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
                    console.log("Inscription réussie :", response.data);
                    setSuccess(response.data.message);
                } else {
                    setError(response.data.message);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la connexion :", error);
            });
    };

    return (
        <div className="w-full">
            <div className="text-center mb-6 sm:mb-8">
                <Link
                    href="/"
                    className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 hover:opacity-80 transition-opacity group"
                >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center p-2 group-hover:bg-gray-200 transition-colors">
                        <Image
                            src="/images/logo.png"
                            alt="Logo FLE Pour Tous"
                            width={32}
                            height={32}
                            className="object-contain w-6 h-6 sm:w-8 sm:h-8"
                        />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">FLE pour tous</h3>
                </Link>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Créer votre compte</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                    <input
                        type="string"
                        placeholder="Pseudo"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        required
                        className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                    />
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Prénom"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                    />
                </div>
                <div>
                    <input
                        type="string"
                        placeholder="Nom de famille"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Adresse email"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        required
                        className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-xs sm:text-sm text-center bg-red-50 p-3 rounded-xl border border-red-200">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 text-xs sm:text-sm text-center bg-green-50 p-3 rounded-xl border border-green-200">
                        {success}
                    </p>
                )}

                <Button
                    variant="black"
                    type="submit"
                    className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold"
                >
                    Inscription
                </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    Vous avez déjà un compte ?{" "}
                    <Link
                        href="/connexion"
                        className="text-red-600 hover:text-red-700 font-medium transition-colors underline decoration-red-600/30 hover:decoration-red-600"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}
