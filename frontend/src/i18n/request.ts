// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = (await requestLocale) ?? routing.defaultLocale;

    return {
        locale,
        messages: (await import(`../locales/${locale}/index.ts`)).default,
    };
});
