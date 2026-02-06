import TestimonialsSlider from "./front/TestimonialsSlider";
import ScrollSection from "./scrollSection";
import { getI18n } from "@/locales/server";

export default async function TestimonialsSection() {
    const trad = await getI18n();
    const testimonials = [
    {
        quote: trad("homePage.testimonial.vladislava.comment"),
        author: trad("homePage.testimonial.vladislava.name"),
        nationality: trad("homePage.testimonial.vladislava.nationality"),
        bgColor: "bg-orange-200",
    },
    {
        quote: trad("homePage.testimonial.august.comment"),
        author: trad("homePage.testimonial.august.name"),
        nationality: trad("homePage.testimonial.august.nationality"),
        bgColor: "bg-gray-200",
    },
    {
        quote: trad("homePage.testimonial.graham.comment"),
        author: trad("homePage.testimonial.graham.name"),
        nationality: trad("homePage.testimonial.graham.nationality"),
        bgColor: "bg-pink-200",
    },
];

return (
        <ScrollSection className="bg-gray-50 py-12 sm:py-16 px-4 scroll-animate">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ce que disent mes étudiants
                    </h2>
                </div>
                <TestimonialsSlider testimonials={testimonials} />
            </div>
        </ScrollSection>
    );
}
