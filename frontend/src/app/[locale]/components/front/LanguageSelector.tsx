"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation"; // ← useParams de next/navigation, pas next-intl
import { useSlugStore } from "@/store/useSlugStore"; // 👈 nécessaire pour les slugs traduits

export default function LanguageSelector() {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const slugs = useSlugStore((state) => state.slugs);

    const locale = params?.locale as string;

    useEffect(() => {
        const savedPosition = sessionStorage.getItem("scrollPosition");
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
            sessionStorage.removeItem("scrollPosition");
        }
    }, []);

    const handleLanguageChange = (langCode: string) => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
        // Traduit le slug (params.slug) dans la nouvelle langue si disponible, sinon le conserve tel quel
        const translatedSlug = slugs[langCode];
        const newParams = translatedSlug ? { ...params, slug: translatedSlug } : params;
        router.replace(
            // @ts-expect-error — params correspond toujours au pathname actuel
            { pathname, params: newParams },
            { locale: langCode },
        );
    };

    const languages = [
        { code: "fr", name: "Français", flag: "/images/flag/france.png" },
        { code: "en", name: "English", flag: "/images/flag/uk.png" },
        { code: "ja", name: "日本語", flag: "/images/flag/japan.png" },
    ];

    const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

    return (
        <div className="relative group">
            <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors font-medium text-sm xl:text-base">
                <div className="bg-color-white w-full h-full">
                    <Image src={currentLanguage.flag} alt={currentLanguage.name} width={24} height={24} />
                </div>
                <span className="hidden xl:inline whitespace-nowrap">{currentLanguage.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left ${
                                locale === lang.code ? "bg-red-50 text-red-600 font-semibold" : ""
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
