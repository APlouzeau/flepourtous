import apiClient from "@/lib/axios";
import { getLocale } from "@/locales/server";

export async function getLessonsWithPrices() {
    try {
        const locale = await getLocale();
        const response = await apiClient.post(`/api/getAllLessonsWithPrices/${locale}`, {});
        return response.data;
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
}

export async function getLessons(slug: string) {
    try {
        const locale = await getLocale();
        const decodedSlug = decodeURIComponent(slug);
        console.log("url : " + locale + " " + decodedSlug);
        const response = await apiClient.get(`/api/offre-de-cours/${decodedSlug}/${locale}`, {});
        console.log("Fetched lesson:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
}

export async function getSlugs() {
    const locale = await getLocale();
    try {
        const response = await apiClient.get(`/api/getSlugs/${locale}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch slugs:", error);
        return [];
    }
}
