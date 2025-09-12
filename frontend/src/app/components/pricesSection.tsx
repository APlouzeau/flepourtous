"use client";

import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { LessonWithPrice } from "../types/lessons";
import FormulaCard from "./front/FormulaCard";

export default function PricesSection ({ lessons }: { lessons: LessonWithPrice[] }) {
    // Ce composant nécessite d'être client car la <section> utilise un hook useRef (client)
    // Les informations `lessons` sont hydratées côté serveur (SSR) et passées en props.
    const formulasSection = useScrollAnimation();

    return (
        <section
            ref={formulasSection.elementRef}
            className={`bg-white py-12 sm:py-16 px-4 scroll-animate ${
                formulasSection.isVisible ? "visible" : ""
            }`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Présentation des différentes{" "}
                        <span className="text-red-600">Formules</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Choisissez le cours qui convient le mieux suivant vos
                        objectifs et la durée que vous préférez.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {lessons.slice(0, 3).map((lesson: LessonWithPrice) => (
                        <FormulaCard
                            key={lesson.slug}
                            image={lesson.imagePath || "/images/enfant.jpg"}
                            title={lesson.title}
                            description={lesson.shortDescription}
                            price={lesson.price[0].price + "€"}
                            duration={lesson.price[0].duration + "mn"}
                            link={"/offre-de-cours" + `/${lesson.slug}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};