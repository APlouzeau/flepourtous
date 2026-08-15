// i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { localizedRoutes } from "./routes";

const pathnames = Object.fromEntries(
    localizedRoutes.flatMap(({ fr, en, ja }) => [
        [`/${fr}`, { fr: `/${fr}`, en: `/${en}`, ja: `/${ja}` }],
        [`/${fr}/[slug]`, { fr: `/${fr}/[slug]`, en: `/${en}/[slug]`, ja: `/${ja}/[slug]` }],
    ]),
);

export const routing = defineRouting({
    locales: ["en", "fr", "ja"],
    defaultLocale: "en",
    pathnames: pathnames,
});
