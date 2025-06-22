import Link from "next/link";
import Image from "next/image";
import { getSession, logout } from "@/lib/session";
import Button from "./Button";

export default async function Header() {
    const session = await getSession();
    let isLog = false;
    if (session.get("session")?.value) {
        isLog = true;
    }

    return (
        <header className="bg-red-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo avec mascotte */}
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                            <Image
                                src="/images/logo.png"
                                alt="Logo FLE Pour Tous"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
                            FLE Pour Tous
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link 
                            href="/" 
                            className="text-white hover:text-gray-200 transition-colors font-medium"
                        >
                            Présentation
                        </Link>
                        <Link 
                            href="/offre-de-cours" 
                            className="text-white hover:text-gray-200 transition-colors font-medium"
                        >
                            Offre de cours
                        </Link>
                        <Link 
                            href="/ressources" 
                            className="text-white hover:text-gray-200 transition-colors font-medium"
                        >
                            Ressources utilisées
                        </Link>
                        <Link 
                            href="/avis-eleves" 
                            className="text-white hover:text-gray-200 transition-colors font-medium"
                        >
                            Avis élèves
                        </Link>
                        
                        {/* Boutons d'action */}
                        <div className="flex items-center space-x-3 ml-6">
                            {isLog ? (
                                <div className="flex items-center space-x-3">
                                    <Button variant="white" href="/profil" className="text-sm px-4 py-2">
                                        Profil
                                    </Button>
                                    <Button variant="white" href="/calendrier" className="text-sm px-4 py-2">
                                        Calendrier
                                    </Button>
                                    <form action={logout} className="inline">
                                        <Button variant="black" type="submit" className="text-sm px-4 py-2">
                                            Déconnexion
                                        </Button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <Button variant="white" href="/inscription" className="text-sm px-4 py-2">
                                        Inscription
                                    </Button>
                                    <Button variant="black" href="/connexion" className="text-sm px-4 py-2">
                                        Connexion
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Menu mobile */}
                    <div className="md:hidden">
                        <button 
                            className="text-white hover:text-gray-200 transition-colors"
                            title="Ouvrir le menu de navigation"
                            aria-label="Ouvrir le menu de navigation"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span className="sr-only">Menu</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
