import apiClient from "@/lib/axios";
import { getCurrentLocale } from "@/locales/server";

export async function getLessonsWithPrices() {
    try {
        const locale = await getCurrentLocale();
        console.log(`Fetching lessons with prices for locale: ${locale}`); // Log the locale for debugging
        const response = await apiClient.post(`/api/getAllLessonsWithPrices/${locale}`, {});
        console.log("Fetched lesson data:", response.data); // Log the fetched data for debugging
        return response.data;
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
}

export async function getLessons(slug: string) {
    try {
        const locale = await getCurrentLocale();
        const decodedSlug = decodeURIComponent(slug);
        console.log(`Fetching lesson with slug: ${decodedSlug} for locale: ${locale}`); // Log the slug and locale for debugging
        const response = await apiClient.get(`/api/offre-de-cours/${decodedSlug}/${locale}`, {});
        console.log("Fetched lesson data:", response.data); // Log the fetched data for debugging
        return response.data;
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
}

export async function getSlugs() {
    const locale = await getCurrentLocale();
    try {
        const response = await apiClient.get(`/api/getSlugs/${locale}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch slugs:", error);
        return [];
    }
}
