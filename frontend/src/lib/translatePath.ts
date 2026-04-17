import { routing } from "@/i18n/routing";

export function translatePath(pathname: string, newLocale: string, slugs: Record<string, string> = {}): string {
    const segments = pathname.split("/").filter(Boolean);
    const knownLocales = ["fr", "en", "ja"];
    const hasLocale = knownLocales.includes(segments[0]);

    if (!hasLocale) return `/${newLocale}/${segments.join("/")}`;
    if (segments.length === 1) return `/${newLocale}`;

    const translated = segments.map((seg, i) => {
        if (i === 0) return newLocale;
        const match = Object.entries(routing.pathnames).find(([, langs]) =>
            Object.values(langs as Record<string, string>).some((v) => v.replace("/", "") === seg),
        );
        return match ? ((match[1] as Record<string, string>)[newLocale]?.replace("/", "") ?? seg) : seg;
    });

    if (slugs[newLocale]) translated[translated.length - 1] = slugs[newLocale];

    return "/" + translated.join("/");
}
