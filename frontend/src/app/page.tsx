import apiClient from "@/lib/axios";
import { LessonWithPrice } from "./types/lessons";
import HomePageClient from "./components/front/HomePageClient"; // Importer le nouveau composant

// Fonction pour récupérer les données. On peut la laisser ici ou la mettre dans un fichier lib.
async function getLessons(): Promise<LessonWithPrice[]> {
    try {
        const response = await apiClient.post(`${process.env.NEXT_PUBLIC_API_URL}/getAllLessonsWithPrices`, {});
        // S'assurer de retourner les données ou un tableau vide en cas d'erreur
        console.log("Leçons récupérées côté serveur :", response.data);
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        return []; // Retourner un tableau vide en cas d'échec de l'appel API
    }
}

// La page est maintenant un Composant Serveur, simple et efficace.
export default async function Home() {
    // 1. On récupère les données côté serveur
    const lessons = await getLessons();

    // 2. On passe les données au composant client qui gère l'affichage et l'interactivité
    return <HomePageClient lessons={lessons} />;
}
