"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Button from "./Button";
import MobileMenuButton from "./MobileMenuButton";
import LanguageSelector from "./LanguageSelector";
import { logout } from "@/lib/session";
import { useLocale, useTranslations } from "@/locales/client";
import { translatePath } from "@/lib/translatePath";
import { usePathname } from "next/dist/client/components/navigation";
interface HeaderProps {
    readonly isLoggedIn: boolean;
    readonly slugs: { slug: string; title: string }[]; // pour le map
    readonly localizedSlugs?: Record<string, string>; // pour translatePath
}

export default function Header({ isLoggedIn, slugs }: HeaderProps) {
    const trad = useTranslations();
    const locale = useLocale();
    const pathname = usePathname();
    const slugsRecord = Object.fromEntries(slugs.map((s) => [s.slug, s.title]));
    const courseRouteSegment = translatePath(pathname, locale, slugsRecord);

    const handleLogout = async () => {
        try {
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
                                {trad("header.lessonOffer.menu")}
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
                                    {slugs.map((slug) => (
                                        <Link
                                            key={slug.slug}
                                            href={`/offre-de-cours/${slug.slug}`}
                                            className="block px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            {slug.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/ressources-utilisees"
                            className="text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base"
                        >
                            {trad("header.resourcesUsed.menu")}
                        </Link>

                        {/* Sélecteur de langue */}
                        <LanguageSelector />

                        {/* Boutons d'action Desktop */}
                        <div className="flex items-center space-x-2 ml-4 xl:ml-6">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="white"
                                        href="/profil"
                                        className="text-xs xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        {trad("common.buttons.profile")}
                                    </Button>
                                    <Button
                                        variant="white"
                                        href="/calendrier"
                                        className="text-xs xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        {trad("common.buttons.calendar")}
                                    </Button>
                                    <Button
                                        variant="black"
                                        onClick={handleLogout}
                                        className="text-xs xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        {trad("common.buttons.logout")}
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        variant="white"
                                        href="/inscription"
                                        className="text-xs  xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        {trad("common.buttons.register")}
                                    </Button>
                                    <Button
                                        variant="black"
                                        href="/connexion"
                                        className="text-xs xl:text-sm px-3 !py-1 xl:px-4"
                                    >
                                        {trad("common.buttons.login")}
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
