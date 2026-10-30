import type { MetadataRoute } from "next";
import apiClient from "@/lib/axios";
import { routing } from "@/i18n/routing";
import { SITE_URL, SiteLocale, absoluteUrl, localizedPath } from "@/lib/site";

// Généré à chaque appel : un cours ajouté en base apparaît sans rebuild.
export const dynamic = "force-dynamic";

// Pages publiques indexables (chemins internes = chemins français).
// Connexion, inscription et les pages techniques en sont exclues : elles sont en noindex (FLE-84).
const PUBLIC_PAGES: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/offre-de-cours", priority: 0.9 },
    { path: "/ressources-utilisees", priority: 0.5 },
    { path: "/cgv", priority: 0.2 },
    { path: "/reglement-interieur", priority: 0.2 },
    { path: "/rgpd", priority: 0.2 },
];

const DEFAULT_LOCALE = routing.defaultLocale as SiteLocale;

type LessonSlug = { idLesson?: number | string; slug: string };

async function getSlugs(locale: SiteLocale): Promise<LessonSlug[]> {
    try {
        const response = await apiClient.get(`/api/getSlugs/${locale}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error(`sitemap : slugs ${locale} indisponibles`, error);
        return [];
    }
}

/** Une entrée par langue, chacune déclarant ses équivalents (hreflang) et la version par défaut. */
function entriesFor(
    paths: Partial<Record<SiteLocale, string>>,
    priority: number,
): MetadataRoute.Sitemap {
    const languages: Record<string, string> = {};
    for (const [locale, path] of Object.entries(paths)) {
        if (path) languages[locale] = absoluteUrl(path);
    }
    const defaultPath = paths[DEFAULT_LOCALE];
    if (defaultPath) languages["x-default"] = absoluteUrl(defaultPath);

    return Object.values(paths)
        .filter((path): path is string => Boolean(path))
        .map((path) => ({ url: absoluteUrl(path), priority, alternates: { languages } }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    if (!SITE_URL) return [];

    const locales = routing.locales as readonly SiteLocale[];

    const pages = PUBLIC_PAGES.flatMap(({ path, priority }) =>
        entriesFor(Object.fromEntries(locales.map((l) => [l, localizedPath(path, l)])), priority),
    );

    // Pages de cours : une par cours et par langue, regroupées par cours pour relier les traductions.
    const slugLists = await Promise.all(locales.map((l) => getSlugs(l)));
    const byLesson = new Map<string, Partial<Record<SiteLocale, string>>>();
    locales.forEach((locale, i) => {
        for (const { idLesson, slug } of slugLists[i]) {
            if (!slug) continue;
            const key = idLesson !== undefined ? String(idLesson) : `${locale}:${slug}`;
            const paths = byLesson.get(key) ?? {};
            paths[locale] = `${localizedPath("/offre-de-cours", locale)}/${slug}`;
            byLesson.set(key, paths);
        }
    });
    const lessons = [...byLesson.values()].flatMap((paths) => entriesFor(paths, 0.8));

    return [...pages, ...lessons];
}
