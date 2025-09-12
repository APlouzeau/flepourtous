"use client";

import TestimonialsSlider from "./front/TestimonialsSlider";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

const testimonials = [
    {
        quote: "Ludivine est incroyablement gentille et très facile à aborder. Son professionnalisme est admirable, et elle fait toujours preuve de bienveillance envers ses élèves, faisant preuve d’une grande patience face aux défis que représente l’apprentissage d’une nouvelle langue. Elle adapte ses méthodes d’enseignement à la personnalité de chacun, ce qui permet à chaque élève de progresser à son propre rythme. De plus, elle crée une atmosphère bienveillante où les élèves se sentent à l’aise de faire des erreurs et de poser des questions. Elle fournit également des retours constructifs qui nous aident à améliorer nos compétences. En outre, elle a un très bel accent, ce qui rend l’apprentissage encore plus agréable. Je recommande vivement ses cours à toute personne souhaitant apprendre le français dans un environnement amical et encourageant.",
        author: "Vladislava",
        nationality: "Russe",
        bgColor: "bg-orange-200",
    },
    {
        quote: "En tant qu’introverti ayant grandi dans une famille française sans jamais avoir réellement appris la langue, j’ai toujours eu très peur de parler français — trop inquiet·ète de faire des erreurs ou de paraître ridicule. Depuis que j’ai commencé les cours avec Ludivine, je sens que cela change peu à peu. Elle est incroyablement patiente, à l’écoute, et crée un espace où je ne me sens jamais jugé·e. En seulement quelques mois, j’ai parlé plus français que durant toute ma vie, et je commence enfin à gagner en confiance grâce à ses cours. Je ne peux que la recommander chaleureusement.",
        author: "August",
        nationality: "Américain-Français",
        bgColor: "bg-gray-200",
    },
    {
        quote: 'Je dois dire qu’au moment de m’inscrire sur Preply, j’étais terrifié·e à l’idée de devoir vraiment parler français. Ludivine est incroyable, elle sait mettre à l’aise immédiatement. J’apprends à parler français en tant que grand·e débutant·e, et elle est la personne la plus patiente du monde. Elle supporte mon accent affreux et ma grammaire approximative, et me corrige toujours avec douceur. Elle a un don pour faire couler le français naturellement. Elle parle lentement et clairement. Elle est vraiment formidable. Merci Ludivine, tu es très gentille et tu es une professeure exceptionnelle."',
        author: "Graham",
        nationality: "Anglais",
        bgColor: "bg-pink-200",
    },
];

export default function TestimonialsSection() {
    const testimonialsSection = useScrollAnimation();

    return (
        <section
            ref={testimonialsSection.elementRef}
            className={`bg-gray-50 py-12 sm:py-16 px-4 scroll-animate ${
                testimonialsSection.isVisible ? "visible" : ""
            }`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Hear it from my students
                    </h2>
                </div>
                <TestimonialsSlider
                    testimonials={testimonials}
                    isVisible={testimonialsSection.isVisible}
                />
            </div>
        </section>
    );
}
