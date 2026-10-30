import { routing } from "@/i18n/routing";

export type SiteLocale = (typeof routing.locales)[number];

/**
 * URL publique et environnement du site, fixés au build (args Docker, voir docker-compose.<env>.yml).
 * Absents en local : le site n'est alors jamais indexable.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
export const SITE_ENV = process.env.NEXT_PUBLIC_SITE_ENV ?? "";

/** Indexation autorisée seulement en prod ET avec une URL connue : jamais d'indexation par erreur. */
export const isIndexable = SITE_ENV === "prod" && SITE_URL !== "";

/**
 * Chemin public d'une page pour une langue, à partir de son chemin interne (le chemin français, ex. "/offre-de-cours").
 * S'appuie sur routing.pathnames, donc sur les URL réellement servies (une entrée en double dans routes.ts
 * est résolue comme le fait next-intl). Une page absente de routes.ts garde le même chemin dans toutes les langues.
 */
export function localizedPath(internalPath: string, locale: SiteLocale): string {
    if (internalPath === "/") return `/${locale}`;
    const pathnames = routing.pathnames as Record<string, string | Record<string, string>>;
    const entry = pathnames[internalPath];
    const path = typeof entry === "string" ? entry : (entry?.[locale] ?? internalPath);
    return `/${locale}${path}`;
}

/** URL absolue, encodée (chemins japonais compris). */
export function absoluteUrl(path: string): string {
    return `${SITE_URL}${encodeURI(path)}`;
}
