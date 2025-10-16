import { getLessonsWithPrices } from "@/lib/lessons";
import HeroSection from "./components/heroSection";
import WhyChooseFleSection from "./components/whyChooseFleSection";
import PricesSection from "./components/pricesSection";
import NumbersSection from "./components/numbersSection";
import TestimonialsSection from "./components/testimonialsSection";
import FaqSection from "./components/faqSection";
import CtaSection from "./components/ctaSection";

export default async function Home() {
    
    // Cette page doit toujours rester server pour récupérer les données server side et hydrater les sous-composants qui peuvent être client. C'est le Server Side Rendering (SSR).

    const lessons = await getLessonsWithPrices();
    console.log("Lessons with prices:", lessons); // Debugging line to check fetched lessons

    return (
        <div className="min-h-screen">
            <HeroSection />
            <WhyChooseFleSection />
            <PricesSection lessons={lessons} /> {/* PricesSection est pré-rendu côté serveur (SSR) */}
            <NumbersSection />
            <TestimonialsSection />
            <FaqSection />
            <CtaSection />
        </div>
    );
}
