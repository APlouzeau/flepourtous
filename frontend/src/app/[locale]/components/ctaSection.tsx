import { getI18n } from "@/locales/server";
import Button from "./front/Button";
import ScrollSection from "./scrollSection";

export default async function CtaSection() {
    const trad = await getI18n();
    return (
        <ScrollSection className="bg-white py-12 sm:py-16 px-4 scroll-animate-scale">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {trad("homePage.CtaSection.title")}
                </h2>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {trad("homePage.CtaSection.subtitle")}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    {trad("homePage.CtaSection.description")}
                </p>
                <Button variant="white" href="/offre-de-cours">
                    {trad("common.buttons.joinUs")}
                </Button>
            </div>
        </ScrollSection>
    );
}
