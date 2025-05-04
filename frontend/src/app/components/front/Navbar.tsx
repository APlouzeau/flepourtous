import { getSession, logout } from "@/lib/session";
import Link from "next/link";

export default async function Navbar() {
    const session = await getSession();
    let isLog = false;
    if (session.get("session")?.value) {
        isLog = true;
    }

    return (
        <nav className="md:block">
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
                {isLog ? (
                    <>
                        <li className="flex-1 py-2 md:py-4">
                            <Link
                                href="/profil"
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
                            <form action={logout}>
                                <button className="block w-full text-center hover:bg-purple-400 transition-colors duration-300 py-2">
                                    Déconnexion
                                </button>
                            </form>
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
    );
}
