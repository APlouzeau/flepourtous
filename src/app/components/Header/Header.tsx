"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="h-auto md:h-96 bg-purple-800 m-2 flex flex-col rounded-b-box">
            <div className="flex-1 flex items-center justify-center p-4">
                <Link href="/" className="font-bold text-white text-4xl md:text-8xl text-center">
                    FLE pour tous
                </Link>
            </div>

            {/* Bouton burger pour mobile */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden px-4 py-2 text-white self-end mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
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
            </button>

            <nav className={`${isOpen ? "block" : "hidden"} md:block`}>
                <ul className="menu menu-vertical md:menu-horizontal bg-blue-200 rounded-b-box w-full justify-around px-4 text-xl font-bold">
                    <li className="flex-1 flex px-4">
                        <Link
                            href="/"
                            className="w-full text-center justify-center hover:bg-purple-400 transition-colors duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Présentation
                        </Link>
                    </li>
                    <li className="hidden md:block text-purple-700 text-4xl">|</li>
                    <li className="flex-1 flex px-4">
                        <Link
                            href="/offre-de-cours"
                            className="w-full text-center justify-center hover:bg-purple-400 transition-colors duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Offre de cours
                        </Link>
                    </li>
                    <li className="hidden md:block text-purple-700 text-4xl">|</li>
                    <li className="flex-1 flex px-4">
                        <Link
                            href="/ressources"
                            className="w-full text-center justify-center hover:bg-purple-400 transition-colors duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Ressources utilisées
                        </Link>
                    </li>
                    <li className="hidden md:block text-purple-700 text-4xl">|</li>
                    <li className="flex-1 flex px-4">
                        <Link
                            href="/avis-eleves"
                            className="w-full text-center justify-center hover:bg-purple-400 transition-colors duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Avis élèves
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
