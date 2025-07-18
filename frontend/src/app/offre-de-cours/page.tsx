import { getLessonsWithPrices } from "@/lib/lessons";
import OfferPageClient from "./OfferPageClient";

export default async function OfferPage() {
    const lessons = await getLessonsWithPrices();
    return <OfferPageClient lessons={lessons} />;
}
