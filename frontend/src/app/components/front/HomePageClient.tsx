"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { LessonsWithPrices, LessonWithPrice } from "@/app/types/lessons";
import FeatureCard from "./FeatureCard";
import FormulaCard from "./FormulaCard";
import StatCard from "./StatCard";
import TestimonialsSlider from "./TestimonialsSlider";
import FAQItem from "./FAQItem";
import Button from "./Button";

interface HomePageClientProps {
    lessons: Readonly<LessonsWithPrices>;
}

export default function HomePageClient({ lessons }: Readonly<HomePageClientProps>) {
    const heroSection = useScrollAnimation();
    const whyChooseSection = useScrollAnimation();
    const formulasSection = useScrollAnimation();
    const statsSection = useScrollAnimation();
    const testimonialsSection = useScrollAnimation();
    const faqSection = useScrollAnimation();
    const ctaSection = useScrollAnimation();

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

    return (
        <div className="min-h-screen">
            {/* Section Hero */}
            <section
                ref={heroSection.elementRef}
                className={`bg-white py-8 sm:py-12 md:py-16 px-4 scroll-animate-left ${
                    heroSection.isVisible ? "visible" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                                Augmenter votre niveau en Français avec{" "}
                                <span className="text-red-600 relative cursor-help group">
                                    Guizmo-kun{" "}
                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                                        C&apos;est mon catamiaou 🐱
                                        <>
                                            <span className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></span>
                                        </>
                                    </span>
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                                Développez vos connaissances avec FLE Pour Tous, votre partenaire de cours de français
                                en ligne avec des méthodes efficaces et des cours personnalisés pour atteindre vos
                                objectifs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
                                <Link href="/calendrier/nouveau-rendez-vous">
                                    <Button variant="black">Prendre rendez-vous</Button>
                                </Link>
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
            <section
                ref={whyChooseSection.elementRef}
                className={`bg-gray-50 py-12 sm:py-16 px-4 scroll-animate ${
                    whyChooseSection.isVisible ? "visible" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Pourquoi choisir FLE pour tous ?
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div
                            className={`scroll-animate scroll-animate-delay-1 ${
                                whyChooseSection.isVisible ? "visible" : ""
                            }`}
                        >
                            <FeatureCard
                                icon="📅"
                                title="Emploi du temps flexible"
                                subtitle="Apprenez à votre rythme, où que vous soyez."
                                description="
 Je propose des horaires adaptables selon votre fuseau horaire, vos disponibilités et votre rythme d’apprentissage. Cours du matin, du soir ou le samedi : c’est vous qui choisissez ! En cas d’imprévu, vous pouvez reporter le cours facilement si vous me prévenez à l’avance."
                            />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-2 ${
                                whyChooseSection.isVisible ? "visible" : ""
                            }`}
                        >
                            <FeatureCard
                                icon="💰"
                                title="Prix transparent"
                                subtitle="Pas de frais cachés, juste des tarifs simples et accessibles."
                                description="Vous connaissez le prix dès le départ : que vous preniez un cours à l’unité ou un forfait, tout est clairement indiqué. Le rapport qualité-prix est pensé pour que chacun puisse progresser à son rythme, sans se ruiner."
                            />
                        </div>
                        <div
                            className={`sm:col-span-2 lg:col-span-1 scroll-animate scroll-animate-delay-3 ${
                                whyChooseSection.isVisible ? "visible" : ""
                            }`}
                        >
                            <FeatureCard
                                icon="👨‍🏫"
                                title="Approche personnalisée et humaine"
                                subtitle="Des cours adaptés à vos besoins, vos envies et votre niveau."
                                description="Chaque leçon est conçue en fonction de votre niveau, de vos objectifs (voyage, travail, examen…) et de vos centres d’intérêt. J’écoute vos besoins et j’adapte le contenu pour que l’apprentissage soit vivant, efficace et motivant."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Formules */}
            <section
                ref={formulasSection.elementRef}
                className={`bg-white py-12 sm:py-16 px-4 scroll-animate ${formulasSection.isVisible ? "visible" : ""}`}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Présentation des différentes <span className="text-red-600">Formules</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Choisissez le cours qui convient le mieux suivant vos objectifs et la durée que vous
                            préférez.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Maintenant, "lessons" est bien un tableau et .slice() fonctionne */}
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

            {/* Section Statistiques */}
            <section
                ref={statsSection.elementRef}
                className={`bg-[#1D1E1C] py-16 sm:py-24 md:py-32 lg:py-36 px-4 scroll-animate ${
                    statsSection.isVisible ? "visible" : ""
                }`}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                            Les stats parlent d&apos;elles-mêmes
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        <div
                            className={`scroll-animate scroll-animate-delay-1 ${
                                statsSection.isVisible ? "visible" : ""
                            }`}
                        >
                            <StatCard number="2000+" description="Cours" />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-2 ${
                                statsSection.isVisible ? "visible" : ""
                            }`}
                        >
                            <StatCard number="99%" description="De satisfaction" />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-3 ${
                                statsSection.isVisible ? "visible" : ""
                            }`}
                        >
                            <StatCard number="200+" description="D'heureux élèves" />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-4 ${
                                statsSection.isVisible ? "visible" : ""
                            }`}
                        >
                            <StatCard number="100%" description="Pédagogiques" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Témoignages */}
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
                    <TestimonialsSlider testimonials={testimonials} isVisible={testimonialsSection.isVisible} />
                </div>
            </section>

            {/* Section FAQ */}
            <section
                ref={faqSection.elementRef}
                className={`bg-white py-12 sm:py-16 px-4 scroll-animate ${faqSection.isVisible ? "visible" : ""}`}
            >
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Votre feuille de route
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600">Questions fréquemment posées</p>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        <div
                            className={`scroll-animate scroll-animate-delay-1 ${faqSection.isVisible ? "visible" : ""}`}
                        >
                            <FAQItem
                                question="Qui êtes-vous ?"
                                answer="Je m'appelle Ludivine et je suis française. Diplômée d'un master de FLE, j'ai vécu au Japon plusieurs années où j'ai enseigné le français. J'ai un master de didactique et une maîtrise de japonais. J'ai enseigné en France à des publics très variés, principalement en français, mais aussi en anglais et j'ai aussi enseigné le japonais à des débutants."
                            />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-2 ${faqSection.isVisible ? "visible" : ""}`}
                        >
                            <FAQItem
                                question="À qui s’adressent vos cours ?"
                                answer="Les cours s’adressent aux apprenants de français à partir de 10 ans. Que vous habitiez en France ou à l’étranger, totalement débutant ou avancé, vous êtes le bienvenu !"
                            />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-3 ${faqSection.isVisible ? "visible" : ""}`}
                        >
                            <FAQItem
                                question="Puis-je choisir les sujets des cours ?"
                                answer="Les cours sont “à la carte”, c’est-à-dire qu’ils sont complètement adaptés à vos besoins. Ensemble, nous déciderons non seulement de la méthode, mais aussi des sujets à aborder."
                            />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-4 ${faqSection.isVisible ? "visible" : ""}`}
                        >
                            <FAQItem
                                question="Quelle est la fréquence recommandée pour les cours ?"
                                answer="Cela dépend de vos objectifs. Pour pratiquer son français, une séance par semaine est tout à fait raisonnable. Cependant, si vous préparez un examen ou que vous voulez suivre des cours de manière intensive, il est recommandé de faire 2 à 3 séances par semaine, afin de se concentrer un maximum sur la langue."
                            />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-5 ${faqSection.isVisible ? "visible" : ""}`}
                        >
                            <FAQItem
                                question="De quoi ai-je besoin pour suivre un cours ?"
                                answer="Il vous faut une bonne connexion. Vous pouvez suivre le cours sur ordinateur, tablette ou téléphone (l’ordinateur est recommandé pour la visibilité du cours). Vous n’avez pas besoin de télécharger de logiciel ou d’application, vous pouvez vous connecter à l’outil de visio directement ! "
                            />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-6 ${faqSection.isVisible ? "visible" : ""}`}
                        >
                            <FAQItem
                                question="Que se passe-t-il si j’arrive en retard ?"
                                answer="Si vous arrivez en retard, le temps est perdu, vous ne pourrez pas récupérer ce temps, l’heure du cours finira à l’heure prévue. Pour plus d’informations, veuillez lire les conditions de vente."
                            />
                        </div>
                        <div
                            className={`scroll-animate scroll-animate-delay-6 ${faqSection.isVisible ? "visible" : ""}`}
                        >
                            <FAQItem
                                question="Puis-je annuler ou reporter un cours ?"
                                answer="Vous pouvez reporter ou annuler un cours jusqu’à 24h avant le cours. Si vous voulez annuler ou reporter dans les 24h avant le cours, le cours sera considéré comme dû et ne sera pas remboursé. Pour plus d’informations, veuillez lire les conditions de vente."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section CTA */}
            <section
                ref={ctaSection.elementRef}
                className={`bg-white py-12 sm:py-16 px-4 scroll-animate-scale ${ctaSection.isVisible ? "visible" : ""}`}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Saisissez <span className="text-red-600">🎯</span> le Moment – Rejoignez FLE
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Chaque journée est une occasion de progresser. Investissez dans votre avenir dès
                        aujourd&apos;hui avec FLE Pour Tous. L&apos;excellence en français n&apos;attend pas – elle se
                        construit maintenant, un cours après l&apos;autre.
                    </p>
                    <Button variant="white" href="/offre-de-cours">
                        Démarrer maintenant
                    </Button>
                </div>
            </section>
        </div>
    );
}
