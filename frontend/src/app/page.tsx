import Image from "next/image";
import FeatureCard from "./components/front/FeatureCard";
import FormulaCard from "./components/front/FormulaCard";
import StatCard from "./components/front/StatCard";
import TestimonialCard from "./components/front/TestimonialCard";
import FAQItem from "./components/front/FAQItem";
import Button from "./components/front/Button";

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Section Hero */}
            <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                                Augmenter votre niveau en Français avec <span 
                                    className="text-red-600 relative cursor-help group"
                                >
                                    Guizmo-kun
                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                                        C&apos;est mon catamiaou 🐱
                                        <span className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></span>
                                    </span>
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                                Développer vos FLE Pour Tous, votre partenaire de cours de français en ligne avec des méthodes efficaces et des cours personnalisés pour atteindre vos objectifs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
                                <Button variant="black" href="/inscription">
                                    Prendre rendez-vous
                                </Button>
                            </div>
                        </div>
                        <div className="relative order-1 md:order-2">
                            <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                                <Image
                                    src="/images/triomphe.jpg"
                                    alt="Apprentissage du français"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Why Choose FLE */}
            <section className="bg-gray-50 py-12 sm:py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose <span className="text-red-600">FLE</span>?
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <FeatureCard
                            icon="📅"
                            title="Emploi du temps flexible"
                            description="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
                        />
                        <FeatureCard
                            icon="💰"
                            title="Prix transparent"
                            description="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
                        />
                        <div className="sm:col-span-2 lg:col-span-1">
                            <FeatureCard
                                icon="👨‍🏫"
                                title="Un super professeur"
                                description="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Formules */}
            <section className="bg-white py-12 sm:py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Présentation des différentes <span className="text-red-600">Formules</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <FormulaCard
                            image="/images/enfant.jpg"
                            title="Carte titre"
                            description="Lorem ipsum dolor sit amet consectetur adipiscing elit."
                            price="35€"
                            duration="par mois"
                            link="/offre-de-cours/enfant"
                        />
                        <FormulaCard
                            image="/images/ados.jpg"
                            title="Carte titre"
                            description="Lorem ipsum dolor sit amet consectetur adipiscing elit."
                            price="45€"
                            duration="par mois"
                            link="/offre-de-cours/ados"
                        />
                        <div className="sm:col-span-2 lg:col-span-1">
                            <FormulaCard
                                image="/images/enfant.jpg"
                                title="Carte titre"
                                description="Lorem ipsum dolor sit amet consectetur adipiscing elit."
                                price="55€"
                                duration="par mois"
                                link="/offre-de-cours/adulte"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Statistiques */}
            <section className="bg-[#1D1E1C] py-16 sm:py-24 md:py-32 lg:py-36 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                            Les stats parlent d&apos;elles même
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        <StatCard number="1500+" description="Élèves satisfaits" />
                        <StatCard number="93%" description="Taux de réussite" />
                        <StatCard number="200+" description="Heures dispensées" />
                        <StatCard number="100%" description="Satisfaction garantie" />
                    </div>
                </div>
            </section>

            {/* Section Témoignages */}
            <section className="bg-gray-50 py-12 sm:py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Hear it from my students
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <TestimonialCard
                            quote="Working with Sarah has been an incredible journey of growth and self-discovery. Her expertise in mindfulness and emotional regulation has truly transformed my approach to daily challenges."
                            author="DAVID MARTINEZ"
                            role="Étudiant en Philosophie"
                            bgColor="bg-orange-200"
                        />
                        <TestimonialCard
                            quote="Sarah's personalized approach and deep understanding of both cognitive behavioral therapy and mindfulness practices have been instrumental in helping me navigate life's complexities."
                            author="ARIANE GONZALEZ"
                            role="Professeure de Psychologie"
                            bgColor="bg-gray-200"
                        />
                        <div className="sm:col-span-2 lg:col-span-1">
                            <TestimonialCard
                                quote="I cannot express enough gratitude for the transformative impact Sarah has had on my personal and professional development. Her holistic approach to therapy addresses both mind and spirit."
                                author="JANE SMITH"
                                role="Étudiante en Philosophie"
                                bgColor="bg-pink-200"
                            />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        <TestimonialCard
                            quote="Sarah has a remarkable ability to create a safe, supportive environment where authentic growth can occur. Her insights and techniques have become invaluable tools in my personal toolkit."
                            author="MIKE BROWN"
                            role="Étudiant en Psychologie"
                            bgColor="bg-pink-200"
                        />
                        <TestimonialCard
                            quote="What sets Sarah apart is her genuine care for each individual's unique journey. Her methods are both evidence-based and deeply compassionate, creating a perfect balance for healing and growth."
                            author="ALEX JONES"
                            role="Chef d'Entreprise"
                            bgColor="bg-orange-200"
                        />
                    </div>
                </div>
            </section>

            {/* Section FAQ */}
            <section className="bg-white py-12 sm:py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Votre feuille de route
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600">
                            Questions fréquemment posées
                        </p>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        <FAQItem
                            question="Qui êtes-vous Sarah et Que faites-vous Compétences ?"
                            answer="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                        <FAQItem
                            question="Comment savez-vous si votre méthode va marcher ?"
                            answer="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                        <FAQItem
                            question="Où se déroulent vos séances ?"
                            answer="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                        <FAQItem
                            question="Les cours individuels ? Ou se déroulent-ils exactement dans le TCF pour CHELF ?"
                            answer="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                        <FAQItem
                            question="Où se déroule votre mise place lors des cours. Merci ?"
                            answer="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                        <FAQItem
                            question="Puis-je annuler un certificat qui ne me plaire ?"
                            answer="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                    </div>
                </div>
            </section>

            {/* Section CTA */}
            <section className="bg-white py-12 sm:py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Saisissez <span className="text-red-600">🎯</span> le Moment – Rejoignez FLE
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Chaque journée est une occasion de progresser. Investissez dans votre avenir dès aujourd&apos;hui avec FLE Pour Tous. L&apos;excellence en français n&apos;attend pas – elle se construit maintenant, un cours après l&apos;autre.
                    </p>
                    <Button variant="white" href="/offre-de-cours">
                        Démarrer maintenant
                    </Button>
                </div>
            </section>
        </div>
    );
}
