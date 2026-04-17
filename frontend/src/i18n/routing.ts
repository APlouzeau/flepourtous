// i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "fr", "ja"],
    defaultLocale: "en",
    pathnames: {
        "/offre-de-cours": { fr: "/offre-de-cours", en: "/courses-offer", ja: "/コースの提供" },
        "/offre-de-cours/[slug]": {
            fr: "/offre-de-cours/[slug]",
            en: "/courses-offer/[slug]",
            ja: "/コースの提供/[slug]",
        },
        "/ressources-utilisees": { fr: "/ressources-utilisees", en: "/used-resources", ja: "/使用されたリソース" },
    },
});
