import FeatureCard from "./front/FeatureCard";
import ScrollSection from "./scrollSection";
import ScrollDiv from "./scrollSectionDiv";

export default function WhyChooseFleSection() {
    return (
        <ScrollSection className="bg-gray-50 py-12 sm:py-16 px-4 scroll-animate">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Pourquoi choisir FLE pour tous ?
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <ScrollDiv className="scroll-animate scroll-animate-delay-1">
                        <FeatureCard
                            icon="📅"
                            title="Emploi du temps flexible"
                            subtitle="Apprenez à votre rythme, où que vous soyez."
                            description="Je propose des horaires adaptables selon votre fuseau horaire, vos disponibilités et votre rythme d’apprentissage. Cours du matin, du soir ou le samedi : c’est vous qui choisissez ! En cas d’imprévu, vous pouvez reporter le cours facilement si vous me prévenez à l’avance."
                        />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-2">
                        <FeatureCard
                            icon="💰"
                            title="Prix transparent"
                            subtitle="Pas de frais cachés, juste des tarifs simples et accessibles."
                            description="Vous connaissez le prix dès le départ : que vous preniez un cours à l’unité ou un forfait, tout est clairement indiqué. Le rapport qualité-prix est pensé pour que chacun puisse progresser à son rythme, sans se ruiner."
                        />
                    </ScrollDiv>
                    <ScrollDiv className="sm:col-span-2 lg:col-span-1 scroll-animate scroll-animate-delay-3">
                        <FeatureCard
                            icon="👨‍🏫"
                            title="Approche personnalisée et humaine"
                            subtitle="Des cours adaptés à vos besoins, vos envies et votre niveau."
                            description="Chaque leçon est conçue en fonction de votre niveau, de vos objectifs (voyage, travail, examen…) et de vos centres d’intérêt. J’écoute vos besoins et j’adapte le contenu pour que l’apprentissage soit vivant, efficace et motivant."
                        />
                    </ScrollDiv>
                </div>
            </div>
        </ScrollSection>
    );
}
