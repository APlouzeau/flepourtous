"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileMenuButtonProps {
    isLoggedIn: boolean;
    onLogout: () => Promise<void>;
}

export default function MobileMenuButton({ isLoggedIn, onLogout }: MobileMenuButtonProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // Empêcher le scroll du body quand le menu est ouvert
        document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
    };

    return (
        <>
            {/* Bouton hamburger */}
            <button 
                className={`text-white hover:text-gray-200 transition-colors p-2 relative z-50 ${
                    isMenuOpen ? 'hidden' : 'block'
                }`}
                title="Ouvrir le menu de navigation"
                aria-label="Ouvrir le menu de navigation"
                onClick={toggleMenu}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Menu plein écran */}
            <div 
                className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Overlay sombre */}
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={toggleMenu}
                />
                
                {/* Contenu du menu */}
                <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-[#1D1E1C] shadow-xl">
                    {/* Header du menu avec bouton fermer */}
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-white text-xl font-bold">FLE Pour Tous</h2>
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:text-gray-200 transition-colors p-2"
                            aria-label="Fermer le menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4">
                        <div className="space-y-2">
                            <Link 
                                href="/" 
                                className="text-white hover:text-gray-200 hover:bg-red-700 transition-colors block px-4 py-3 rounded-md font-medium text-lg"
                                onClick={toggleMenu}
                            >
                                Présentation
                            </Link>
                            <Link 
                                href="/offre-de-cours" 
                                className="text-white hover:text-gray-200 hover:bg-red-700 transition-colors block px-4 py-3 rounded-md font-medium text-lg"
                                onClick={toggleMenu}
                            >
                                Offre de cours
                            </Link>
                            <Link 
                                href="/" 
                                className="text-white hover:text-gray-200 hover:bg-red-700 transition-colors block px-4 py-3 rounded-md font-medium text-lg"
                                onClick={toggleMenu}
                            >
                                Ressources utilisées
                            </Link>
                            <Link 
                                href="/" 
                                className="text-white hover:text-gray-200 hover:bg-red-700 transition-colors block px-4 py-3 rounded-md font-medium text-lg"
                                onClick={toggleMenu}
                            >
                                Avis élèves
                            </Link>
                        </div>

                        {/* Boutons d'action */}
                        <div className="mt-8 pt-8 space-y-3">
                            {isLoggedIn ? (
                                <>
                                    <Link 
                                        href="/profil"
                                        className="block w-full bg-white text-black hover:bg-gray-100 transition-colors px-6 py-3 rounded-md font-medium text-center text-lg"
                                        onClick={toggleMenu}
                                    >
                                        Profil
                                    </Link>
                                    <Link 
                                        href="/calendrier"
                                        className="block w-full bg-gray-700 text-white hover:bg-gray-600 transition-colors px-6 py-3 rounded-md font-medium text-center text-lg"
                                        onClick={toggleMenu}
                                    >
                                        Calendrier
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            await onLogout();
                                            toggleMenu();
                                        }}
                                        className="block w-full bg-black text-white hover:bg-gray-800 transition-colors px-6 py-3 rounded-md font-medium text-center text-lg"
                                    >
                                        Déconnexion
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        href="/inscription"
                                        className="block w-full bg-white text-black hover:bg-gray-100 transition-colors px-6 py-3 rounded-md font-medium text-center text-lg"
                                        onClick={toggleMenu}
                                    >
                                        Inscription
                                    </Link>
                                    <Link 
                                        href="/connexion"
                                        className="block w-full bg-black text-white hover:bg-gray-800 transition-colors px-6 py-3 rounded-md font-medium text-center text-lg"
                                        onClick={toggleMenu}
                                    >
                                        Connexion
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
} 