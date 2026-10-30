import { pageMetadata } from "@/lib/metadata";
import { getLessonsWithPrices } from "@/lib/lessons";
import OfferPageClient from "./OfferPageClient";
import ReadySection from "../components/readySection";


type LocaleParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocaleParams) {
    const { locale } = await params;
    return pageMetadata(locale, "offer");
}

export default async function OfferPage() {
    const lessons = await getLessonsWithPrices();
    return (
        <>
            <OfferPageClient lessons={lessons} />
            <ReadySection />
        </>
    );
}
