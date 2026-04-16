"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSlugStore } from "@/store/useSlugStore";

const routeSegments: Record<string, string> = {
    fr: "offre-de-cours",
    en: "courses-offer",
    //ja: "コースの提供",
};

export default function LanguageSelector() {
    const pathname = usePathname();
    const router = useRouter();
    const [currentLocale, setCurrentLocale] = useState<string>("fr");
    const slugs = useSlugStore((state) => state.slugs);

    useEffect(() => {
        // Extraire la locale du pathname
        const locale = pathname?.split("/")[1];
        if (locale === "en" || locale === "fr" || locale === "ja") {
            setCurrentLocale(locale);
        }
    }, [pathname]);

    const getPathForLocale = (newLocale: string) => {
        if (!pathname) return `/${newLocale}`;

        const segments = pathname.split("/"); // Sur "/fr" -> ["", "fr"]

        // Si on est juste à la racine (ex: /fr)
        if (segments.length === 2 && segments[1].length === 2) {
            return `/${newLocale}`;
        }

        // 1. Remplacer la langue (toujours à l'index 1)
        segments[1] = newLocale;

        // 2. Remplacer le segment de route si on est dessus
        // On vérifie que la route est assez longue ET que c'est une route traduisible
        if (segments.length >= 3 && routeSegments[newLocale]) {
            // Ex: si on est sur /fr/offre-de-cours/... on remplace l'index 2
            // Mais attention, il faut vérifier qu'on était bien sur une route traduite !
            const oldSegments = Object.values(routeSegments); // ["offre-de-cours", "courses-offer"]
            if (oldSegments.includes(segments[2])) {
                segments[2] = routeSegments[newLocale];
            }
        }

        // 3. Remplacer le slug si on en a un
        const translatedSlug = slugs[newLocale];
        if (translatedSlug && segments.length >= 4) {
            segments[segments.length - 1] = translatedSlug;
        }

        return segments.join("/");
    };

    const languages = [
        {
            code: "fr",
            name: "Français",
            flag: "/images/flag/france.png",
        },
        {
            code: "en",
            name: "English",
            flag: "/images/flag/uk.png",
        },
        /*         {
            code: "ja",
            name: "日本語",
            flag: "/images/flag/japan.png",
        }, */
    ];

    const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

    useEffect(() => {
        // Restaurer la position de scroll après le changement de langue
        const savedPosition = sessionStorage.getItem("scrollPosition");
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
            sessionStorage.removeItem("scrollPosition");
        }
    }, []);

    const handleLanguageChange = (langCode: string) => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
        const newPath = getPathForLocale(langCode);
        router.push(newPath);
    };

    return (
        <div className="relative group">
            <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base">
                <div className="bg-color-white w-full h-full">
                    <Image src={currentLanguage.flag} alt={currentLanguage.name} width={36} height={24} />
                </div>
                <span className="hidden xl:inline">{currentLanguage.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left ${
                                currentLocale === lang.code ? "bg-red-50 text-red-600 font-semibold" : ""
                            }`}
                        >
                            <Image alt={lang.name} src={lang.flag} width={24} height={18} />
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
