import apiClient from "@/lib/axios";

export async function getLessonsWithPrices() {
    try {
        const response = await apiClient.post("/api/getAllLessonsWithPrices", {});
        return response.data;
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
}

export async function getLessons(slug: string) {
    try {
        const response = await apiClient.get(`/api/offre-de-cours/${slug}`, {});
        console.log("Fetched lesson data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
}
