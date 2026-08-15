import { getLessonsWithPrices } from "@/lib/lessons";
import OfferPageClient from "./OfferPageClient";
import ReadySection from "../components/readySection";

export default async function OfferPage() {
    const lessons = await getLessonsWithPrices();
    return (
        <>
            <OfferPageClient lessons={lessons} />
            <ReadySection />
        </>
    );
}
