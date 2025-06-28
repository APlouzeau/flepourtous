import Link from "next/link";
import Image from "next/image";
import { getSession, logout } from "@/lib/session";
import Button from "./Button";
import MobileMenuButton from "./MobileMenuButton";

export default async function Header() {
    const session = await getSession();
    let isLog = false;
    if (session.get("session")?.value) {
        isLog = true;
    }

    return (
        <header className="bg-red-600 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo avec mascotte */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                    <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-gray-200 transition-colors flex flex-row items-center">
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
                        <Link 
                            href="/" 
                            className="text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base"
                        >
                            Présentation
                        </Link>
                        <Link 
                            href="/offre-de-cours" 
                            className="text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base"
                        >
                            Offre de cours
                        </Link>
                        <Link 
                            href="/" 
                            className="text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base"
                        >
                            Ressources utilisées
                        </Link>
                        <Link 
                            href="/" 
                            className="text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base"
                        >
                            Avis élèves
                        </Link>
                        
                        {/* Boutons d'action Desktop */}
                        <div className="flex items-center space-x-2 ml-4 xl:ml-6">
                            {isLog ? (
                                <div className="flex items-center space-x-2">
                                    <Button variant="white" href="/profil" className="text-xs xl:text-sm px-3 !py-1 xl:px-4">
                                        Profil
                                    </Button>
                                    <Button variant="white" href="/calendrier" className="text-xs xl:text-sm px-3 !py-1 xl:px-4">
                                        Calendrier
                                    </Button>
                                    <form action={logout} className="inline">
                                        <Button variant="black" type="submit" className="text-xs xl:text-sm px-3 !py-1 xl:px-4">
                                            Déconnexion
                                        </Button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <Button variant="white" href="/inscription" className="text-xs  xl:text-sm px-3 !py-1 xl:px-4">
                                        Inscription
                                    </Button>
                                    <Button variant="black" href="/connexion" className="text-xs xl:text-sm px-3 !py-1 xl:px-4">
                                        Connexion
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Menu mobile */}
                    <div className="lg:hidden">
                        <MobileMenuButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
