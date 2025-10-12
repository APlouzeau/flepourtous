"use client"; // 1. On ajoute "use client" pour le déclarer comme composant client.

import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import MobileMenuButton from "./MobileMenuButton";
import { logout } from "@/lib/session";

interface HeaderProps {
    readonly isLoggedIn: boolean;
}

// 2. On retire "async" de la signature de la fonction.
export default function Header({ isLoggedIn }: HeaderProps) {
    // 3. La fonction handleLogout reste ici, car c'est une action initiée par le client.
    const handleLogout = async () => {
        try {
            // On appelle la Server Action 'logout'
            await logout();
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <header className="bg-red-600 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo avec mascotte */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Link
                            href="/"
                            className="text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-gray-200 transition-colors flex flex-row items-center"
                        >
                            <Image
                                src="/images/logo.png"
                                alt="Logo FLE Pour Tous"
                                width={48}
                                height={48}
                                className="object-contain sm:w-16 sm:h-16 md:w-18 md:h-18"
                            />

                            <span className="xs:hidden">FLE Pour Tous</span>
                            <span className="hidden xs:inline">FLE</span>
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {/* Menu déroulant Offre de cours */}
                        <div className="relative group">
                            <Link
                                href="/offre-de-cours"
                                className="text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base flex items-center"
                            >
                                Offre de cours
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </Link>

                            {/* Dropdown menu */}
                            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-2">
                                    <Link
                                        href="/offre-de-cours/francais-general"
                                        className="block px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        Français général
                                    </Link>
                                    <Link
                                        href="/offre-de-cours/cours-de-conversation"
                                        className="block px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        Cours de conversation
                                    </Link>
                                    <Link
                                        href="/offre-de-cours/delf-tcf-tef"
                                        className="block px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        Préparation aux examens
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/ressources-utilisees"
                            className="text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base"
                        >
                            Ressources utilisées
                        </Link>

                        {/* Boutons d'action Desktop */}
                        <div className="flex items-center space-x-2 ml-4 xl:ml-6">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="white"
                                        href="/profil"
                                        className="text-xs xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        Profil
                                    </Button>
                                    <Button
                                        variant="white"
                                        href="/calendrier"
                                        className="text-xs xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        Calendrier
                                    </Button>
                                    <Button
                                        variant="black"
                                        onClick={handleLogout}
                                        className="text-xs xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        Déconnexion
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        variant="white"
                                        href="/inscription"
                                        className="text-xs  xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        Inscription
                                    </Button>
                                    <Button
                                        variant="black"
                                        href="/connexion"
                                        className="text-xs xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        Connexion
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Menu mobile */}
                    <div className="lg:hidden">
                        <MobileMenuButton isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                    </div>
                </div>
            </div>
        </header>
    );
}
