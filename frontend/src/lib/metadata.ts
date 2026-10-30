import type { Metadata } from "next";
import { getTranslations } from "@/locales/server";

export type SeoPage = "home" | "offer" | "resources" | "terms" | "rules" | "privacy" | "login" | "register";

/** Titre et description d'une page, dans la langue de l'URL (textes dans locales/<langue>/seo.ts). */
export async function pageMetadata(locale: string, page: SeoPage): Promise<Metadata> {
    const t = await getTranslations({ locale });
    return {
        // absolute : le titre est déjà complet (« … | FLE pour tous »), aucun modèle ne s'y ajoute.
        title: { absolute: t(`seo.${page}.title`) },
        description: t(`seo.${page}.description`),
    };
}

/**
 * Description tirée d'un texte libre (introduction d'un cours) : espaces normalisés,
 * coupée à 155 caractères sur une fin de mot quand il y en a (pas d'espaces en japonais).
 */
export function toDescription(text: string | undefined, max = 155): string | undefined {
    const clean = (text ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!clean) return undefined;
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–]+$/, "") + "…";
}
