import Link from "next/link";
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
            <section className="bg-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Augmenter votre niveau en Français avec <span className="text-red-600">FLE</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Développer vos FLE Pour Tous, votre partenaire de cours de français en ligne avec des
                                méthodes efficaces et des cours personnalisés pour atteindre vos objectifs.
                            </p>
                            <Button variant="black" href="/inscription">
                                Prendre rendez-vous
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="relative h-96 rounded-lg overflow-hidden">
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
            <section className="bg-gray-50 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose <span className="text-red-600">FLE</span>?
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
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
                        <FeatureCard
                            icon="👨‍🏫"
                            title="Un super professeur"
                            description="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
                        />
                    </div>
                </div>
            </section>

            {/* Section Formules */}
            <section className="bg-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Présentation des différentes <span className="text-red-600">Formules</span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
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
            </section>

            {/* Section Statistiques */}
            <section className="bg-[#1D1E1C] py-36 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Les stats parlent d'elles même</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCard number="1500+" description="Élèves satisfaits" />
                        <StatCard number="93%" description="Taux de réussite" />
                        <StatCard number="200+" description="Heures dispensées" />
                        <StatCard number="100%" description="Satisfaction garantie" />
                    </div>
                </div>
            </section>

            {/* Section Témoignages */}
            <section className="bg-gray-50 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Hear it from my students</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
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
                        <TestimonialCard
                            quote="I cannot express enough gratitude for the transformative impact Sarah has had on my personal and professional development. Her holistic approach to therapy addresses both mind and spirit."
                            author="JANE SMITH"
                            role="Étudiante en Philosophie"
                            bgColor="bg-pink-200"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
            <section className="bg-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Votre feuille de route</h2>
                        <p className="text-xl text-gray-600">Questions fréquemment posées</p>
                    </div>
                    <div className="space-y-4">
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
            <section className="bg-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        Saisissez <span className="text-red-600">🎯</span> le Moment – Rejoignez FLE
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Chaque journée est une occasion de progresser. Investissez dans votre avenir dès aujourd'hui
                        avec FLE Pour Tous. L'excellence en français n'attend pas – elle se construit maintenant, un
                        cours après l'autre.
                    </p>
                    <Button variant="white" href="/inscription">
                        Démarrer maintenant
                    </Button>
                </div>
            </section>
        </div>
    );
}
