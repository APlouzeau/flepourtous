import Link from "next/link";

export default async function Navbar() {
    return (
        <nav className={`${isOpen ? "block" : "hidden"} md:block`}>
            {/* Remplacé les classes DaisyUI par des classes Tailwind standard */}
            <ul className="flex flex-col md:flex-row bg-blue-200 rounded-b-lg w-full justify-around px-4 text-xl font-bold">
                <li className="flex-1 py-2 md:py-4">
                    <Link
                        href="/"
                        className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Présentation
                    </Link>
                </li>
                <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                <li className="flex-1 py-2 md:py-4">
                    <Link
                        href="/offre-de-cours"
                        className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Offre de cours
                    </Link>
                </li>
                <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                <li className="flex-1 py-2 md:py-4">
                    <Link
                        href="/ressources"
                        className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Ressources utilisées
                    </Link>
                </li>
                <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                <li className="flex-1 py-2 md:py-4">
                    <Link
                        href="/avis-eleves"
                        className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Avis élèves
                    </Link>
                </li>
                <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                {isLoggedIn ? (
                    <>
                        <li className="flex-1 py-2 md:py-4">
                            <Link
                                href="/profile"
                                className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Profil
                            </Link>
                        </li>
                        <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                        <li className="flex-1 py-2 md:py-4">
                            <Link
                                href="/calendrier"
                                className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Calendrier
                            </Link>
                        </li>
                        <li className="hidden md:flex items-center justify-center text-purple-700 text-4xl">|</li>
                        <li className="flex-1 py-2 md:py-4">
                            <button
                                className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                                onClick={() => {
                                    setIsOpen(false);
                                    handleLogout();
                                }}
                            >
                                Déconnexion
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="flex-1 py-2 md:py-4">
                        <Link
                            href="/connexion"
                            className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Connexion
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
