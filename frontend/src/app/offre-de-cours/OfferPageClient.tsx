"use client";

import Button from "@/app/components/front/Button";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import Image from "next/image";
import { LessonsWithPrices } from "../types/lessons";

interface OfferPageClientProps {
    lessons: Readonly<LessonsWithPrices>;
}

export default function OfferPageClient({ lessons }: Readonly<OfferPageClientProps>) {
    // Hooks pour les animations
    const offersSection = useScrollAnimation();
    const detailsSection = useScrollAnimation();

    // Données détaillées des formules
    /*  const detailedOffers = [
        {
            image: "/images/enfant.jpg",
            title: "Formule Enfant",
            description:
                "Cours individuels de français ludiques et adaptés aux enfants de 6 à 12 ans. Méthodes pédagogiques personnalisées pour captiver l'attention de votre enfant.",
            price: "35€",
            duration: "par mois",
            link: "/offre-de-cours/enfant",
            features: [
                "1h de cours individuel par semaine",
                "Supports pédagogiques inclus",
                "Jeux et activités ludiques",
                "Suivi 100% personnalisé",
                "Cours adapté au rythme de l'enfant",
            ],
            popular: false,
        },
        {
            image: "/images/ados.jpg",
            title: "Formule Adolescent",
            description:
                "Cours individuels adaptés aux adolescents de 13 à 17 ans. Focus personnel sur l'expression orale et écrite avec des sujets qui passionnent votre adolescent.",
            price: "45€",
            duration: "par mois",
            link: "/offre-de-cours/ados",
            features: [
                "1h30 de cours individuel par semaine",
                "Préparation aux examens",
                "Débats et discussions personnalisés",
                "Projets créatifs adaptés",
                "Attention exclusive de l'enseignant",
            ],
            popular: true,
        },
        {
            image: "/images/enfant.jpg",
            title: "Formule Adulte",
            description:
                "Cours individuels sur-mesure pour adultes tous niveaux. Apprentissage flexible et exclusif adapté à votre rythme de vie et vos objectifs professionnels.",
            price: "55€",
            duration: "par mois",
            link: "/offre-de-cours/adulte",
            features: [
                "2h de cours individuel par semaine",
                "Français professionnel personnalisé",
                "Préparation DELF/DALF ciblée",
                "Conversation adaptée à vos besoins",
                "Flexibilité totale des horaires",
            ],
            popular: false,
        },
    ]; */

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        Nos <span className="text-red-600">Formules</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                        Découvrez nos cours de français personnalisés, adaptés à tous les âges et tous les niveaux
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div className="bg-gray-50 rounded-2xl px-8 py-4 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-900">150+</div>
                            <div className="text-gray-600">Élèves satisfaits</div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl px-8 py-4 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-900">8 ans</div>
                            <div className="text-gray-600">D'expérience</div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl px-8 py-4 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-900">99%</div>
                            <div className="text-gray-600">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Offres Principales */}
            <section
                ref={offersSection.elementRef}
                className={`py-16 px-4 scroll-animate ${offersSection.isVisible ? "visible" : ""}`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Choisissez votre <span className="text-red-600">Formule</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Choisissez le cours qui convient le mieux suivant vos objectifs et la durée que vous préférez.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {lessons.map((offer, index) => (
                            <div
                                key={offer.title}
                                className={`scroll-animate-scale scroll-animate-delay-${index + 1} ${
                                    offersSection.isVisible ? "visible" : ""
                                }`}
                            >
                                <div
                                    className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:-translate-y-4 group h-full flex flex-col ${
                                        offer.popular ? "ring-4 ring-red-500 scale-105" : ""
                                    }`}
                                >
                                    {offer.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                            <div className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                                ⭐ Plus Populaire
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={offer.imagePath}
                                            alt={offer.title}
                                            fill
                                            className="object-cover transition-all duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-2xl font-bold text-white mb-2">{offer.title}</h3>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <p className="text-gray-600 mb-6 leading-relaxed text-lg flex-grow">{offer.shortDescription}</p>

                                        <div className="mb-8">
                                            <div className="text-center">
                                                <div className="text-5xl font-bold text-red-600 mb-2">
                                                    {offer.price[0].price}€
                                                </div>
                                                <div className="text-gray-500 text-lg">
                                                    pour {offer.price[0].duration} minutes
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="black"
                                            href={`offre-de-cours/${offer.slug}`}
                                            className="w-full justify-center text-lg py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 mt-auto"
                                        >
                                            En savoir plus
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Avantages */}
            <section
                ref={detailsSection.elementRef}
                className={`py-16 px-4 scroll-animate ${detailsSection.isVisible ? "visible" : ""}`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Pourquoi choisir nos <span className="text-red-600">cours individuels</span> ?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Une approche pédagogique unique qui s'adapte à chaque élève
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div className="bg-red-50 p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100">
                            <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Méthode éprouvée</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                8 années d'expérience avec plus de 150 élèves satisfaits et des résultats garantis
                            </p>
                        </div>

                        <div className="bg-red-50 p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100">
                            <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cours individuels</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Attention exclusive du professeur pour un apprentissage optimal et personnalisé
                            </p>
                        </div>

                        <div className="bg-red-50 p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100">
                            <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Garantie de satisfaction</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                99% de satisfaction garantie avec un suivi personnalisé
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Prêt à commencer votre aventure en français ?</h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Rejoignez des centaines d'élèves qui ont déjà transformé leur niveau de français avec nos cours personnalisés.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Button variant="black" href="/inscription" className="text-lg py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-all duration-300">
                                Commencer maintenant
                            </Button>
                            <Button variant="white" href="/contact" className="text-lg py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-all duration-300">
                                Nous contacter
                            </Button>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-8 text-gray-600">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span className="font-semibold">99% de satisfaction</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="font-semibold">150+ élèves</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                                <span className="font-semibold">8 ans d'expérience</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
