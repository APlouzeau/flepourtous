import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, isIndexable, localizedPath } from "@/lib/site";

// Espaces privés, dans les 3 langues. Le préfixe couvre aussi les sous-pages (calendrier/packs…).
// Les pages techniques publiques (connexion, inscription…) ne sont pas bloquées ici : elles portent
// un noindex (layout du groupe (public)), que Google ne pourrait pas lire si elles étaient bloquées.
const PRIVATE_PATHS = ["/calendrier", "/profil", "/retour-paiement"];

export default function robots(): MetadataRoute.Robots {
    if (!isIndexable) {
        // Preprod, local, ou variables absentes : rien n'est indexé.
        return { rules: { userAgent: "*", disallow: "/" } };
    }

    const disallow = routing.locales.flatMap((locale) =>
        PRIVATE_PATHS.map((path) => encodeURI(localizedPath(path, locale))),
    );

    return {
        rules: { userAgent: "*", allow: "/", disallow },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
