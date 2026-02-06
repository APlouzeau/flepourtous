import { getI18n } from "@/locales/server";
import FAQItem from "./front/FAQItem";
import ScrollSection from "./scrollSection";
import ScrollDiv from "./scrollSectionDiv";

// Import direct des traductions pour accéder au tableau
import frTranslations from "@/locales/fr/homePage";
import enTranslations from "@/locales/en/homePage";

export default async function FaqSection() {
    const trad = await getI18n();
    
    // Récupérer la locale en français ou anglais selon le contexte
    // On détecte simplement en testant une traduction connue
    const isFrench = trad("homePage.faqSection.title") === "Votre feuille de route";
    
    // Récupérer le bon tableau de questions
    const questions = isFrench 
        ? frTranslations.homePage.faqSection.questions 
        : enTranslations.homePage.faqSection.questions;
    
    return (
        <ScrollSection className="bg-white py-12 sm:py-16 px-4 scroll-animate">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {trad("homePage.faqSection.title")}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600">
                        {trad("homePage.faqSection.description")}
                    </p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                    {questions.map((item, index) => (
                        <ScrollDiv key={index} className="scroll-animate scroll-animate-delay-1">
                            <FAQItem
                                question={item.question}
                                answer={item.answer}
                            />
                        </ScrollDiv>
                    ))}
                </div>
            </div>
        </ScrollSection>
    );
}
