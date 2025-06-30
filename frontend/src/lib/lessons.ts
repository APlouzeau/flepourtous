import axios from "axios";

export async function getLessons() {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/getAllLessonsWithPrices`, {});
        // On extrait le tableau de données de la réponse de l'API
        return response.data;
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return [];
    }
}
