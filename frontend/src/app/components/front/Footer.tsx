import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <div className="w-full px-[5%] py-8">
            <footer className="bg-[#1D1E1C]  text-white w-full rounded-[50px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo et nom */}
                        <div className="md:col-span-1">
                            <div className="flex items-center space-x-3 mb-4">
                                
                                    <Image
                                        src="/images/logo.png"
                                        alt="Logo FLE Pour Tous"
                                        width={72}
                                        height={72}
                                        className="object-contain"
                                    />
                               
                                <h3 className="text-xl font-bold text-white">FLE Pour Tous</h3>
                            </div>
                        </div>

                        {/* Navigation principale */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                NAVIGATION
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Accueil
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/offre-de-cours" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Offre de cours
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Ressources utilisées
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Avis élèves
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Liens utilisateur */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                COMPTE
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/inscription" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Inscription
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/connexion" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Connexion
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/profil" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Profil
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/calendrier" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Calendrier
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact et légal */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                SUPPORT
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/me-contacter" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Me contacter
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/rgpd" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        RGPD
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/mentions-legales" className="text-gray-300 hover:text-white transition-colors duration-200">
                                        Mentions légales
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Ligne de séparation */}
                    <div className="border-t border-gray-700 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-gray-400 text-sm">
                                © 2025 FLE pour tous. Tous droits réservés.
                            </div>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <Link href="/politique-confidentialite" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                    Politique de confidentialité
                                </Link>
                                <Link href="/conditions-utilisation" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                    Conditions d&apos;utilisation
                                </Link>
                                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                    Paramètres des cookies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
