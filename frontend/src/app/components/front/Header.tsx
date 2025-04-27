"use client";
import Link from "next/link";
import React from "react";
import { UserConnectProps } from "@/app/types/userData";

export default function Header(user: UserConnectProps) {
    const { userConnect } = user;
    return (
        <header className="h-auto md:h-96 bg-pink-300 m-2 flex flex-col rounded-lg">
            <div className="flex-1 flex items-center justify-center p-4">
                <Link href="/" className="font-bold text-8xl shadow-black text-white text-center">
                    FLE pour tous
                </Link>
            </div>

            {/* Bouton burger pour mobile */}
            {/*             <button onClick={() => setIsOpen(!isOpen)} className="md:hidden px-4 py-2 text-white self-end mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {userConnect ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button> */}

            <nav className={`${userConnect ? "block" : "hidden"} md:block`}>
                {/* Remplacé les classes DaisyUI par des classes Tailwind standard */}
                <ul className="flex flex-col md:flex-row bg-blue-200 rounded-b-lg w-full justify-around px-4 text-xl font-bold">
                    <li className="flex-1 py-2 md:py-4">
                        <Link
                            href="/"
                            className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                        >
                            Présentation
                        </Link>
                    </li>
                    <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                    <li className="flex-1 py-2 md:py-4">
                        <Link
                            href="/offre-de-cours"
                            className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                        >
                            Offre de cours
                        </Link>
                    </li>
                    <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                    <li className="flex-1 py-2 md:py-4">
                        <Link
                            href="/ressources"
                            className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                        >
                            Ressources utilisées
                        </Link>
                    </li>
                    <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                    <li className="flex-1 py-2 md:py-4">
                        <Link
                            href="/avis-eleves"
                            className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                        >
                            Avis élèves
                        </Link>
                    </li>
                    <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                    {userConnect ? (
                        <>
                            <li className="flex-1 py-2 md:py-4">
                                <Link
                                    href="/profile"
                                    className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                                >
                                    Profil
                                </Link>
                            </li>
                            <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                            <li className="flex-1 py-2 md:py-4">
                                <Link
                                    href="/calendrier"
                                    className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                                >
                                    Calendrier
                                </Link>
                            </li>
                            <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                            <li className="flex-1 py-2 md:py-4">
                                <button className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2">
                                    Déconnexion
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="flex-1 py-2 md:py-4">
                            <Link
                                href="/connexion"
                                className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                            >
                                Connexion
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
