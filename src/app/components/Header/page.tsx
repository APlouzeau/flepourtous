import Link from "next/link";
import React from "react";

export default function Header() {
    return (
        <>
            <header className="h-96 bg-purple-800 m-2 flex flex-col rounded-box">
                <div className="flex-1 flex items-center justify-center">
                    <Link href="/" className="font-bold text-white text-8xl">
                        FLE pour tous
                    </Link>
                </div>
                <nav>
                    <ul className="menu menu-horizontal bg-blue-200 rounded-b-box w-full justify-around px-4 text-xl font-bold">
                        <li className="flex-1 flex px-4">
                            <Link
                                href="/"
                                className="w-full text-center justify-center hover:bg-purple-400 transition-colors duration-300"
                            >
                                Présentation
                            </Link>
                        </li>
                        <li className="text-purple-700 text-4xl">|</li>
                        <li className="flex-1 flex px-4">
                            <Link
                                href="/offre-de-cours"
                                className="w-full text-center justify-center hover:bg-purple-400 transition-colors duration-300"
                            >
                                Offre de cours
                            </Link>
                        </li>
                        <li className="text-purple-700 text-4xl">|</li>
                        <li className="flex-1 flex px-4">
                            <Link
                                href="/"
                                className="w-full text-center justify-center hover:bg-purple-400 transition-colors duration-300"
                            >
                                Ressources utilisées
                            </Link>
                        </li>
                        <li className="text-purple-700 text-4xl">|</li>
                        <li className="flex-1 flex px-4">
                            <Link
                                href="/"
                                className="w-full text-center justify-center hover:bg-purple-400 transition-colors duration-300"
                            >
                                Avis élèves
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    );
}
