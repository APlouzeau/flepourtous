import { getLessons } from "@/lib/lessons";
import OfferPageClient from "./OfferPageClient";

export default async function OfferPage() {
    const lessons = await getLessons();
    return <OfferPageClient lessons={lessons} />;
}
