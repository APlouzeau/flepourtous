import apiClient from "@/lib/axios";

export async function getLessons() {
    try {
        const response = await apiClient.post(`${process.env.NEXT_PUBLIC_API_URL}/getAllLessonsWithPrices`, {});
        return response.data;
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
}
