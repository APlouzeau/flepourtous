import HomePageClient from "./components/front/HomePageClient"; // Importer le nouveau composant
import { getLessonsWithPrices } from "@/lib/lessons";

// La page est maintenant un Composant Serveur, simple et efficace.
export default async function Home() {
    // 1. On récupère les données côté serveur
    const lessons = await getLessonsWithPrices();
    // 2. On passe les données au composant client qui gère l'affichage et l'interactivité
    return <HomePageClient lessons={lessons} />;
}
