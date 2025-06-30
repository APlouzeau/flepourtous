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
    console.log("Offres reçues dans le composant client :", lessons);
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
            {/* Section Offres Principales */}
            <section
                ref={offersSection.elementRef}
                className={`py-16 sm:py-20 px-4 scroll-animate ${offersSection.isVisible ? "visible" : ""}`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Choisissez votre <span className="text-red-600">Formule</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Trois formules de cours individuels adaptées aux besoins spécifiques de chaque âge
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
                                    className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                                        offer.popular ? "ring-2 ring-red-500" : ""
                                    }`}
                                >
                                    {offer.popular && (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                                            Populaire
                                        </div>
                                    )}

                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={offer.imagePath}
                                            alt={offer.title}
                                            fill
                                            className="object-cover transition-transform duration-300 hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{offer.title}</h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed">{offer.shortDescription}</p>

                                        <div className="mb-6">
                                            <div className="flex items-baseline justify-center mb-4">
                                                A partir de
                                                <span className="text-4xl font-bold text-red-600">
                                                    {offer.price[0].price} €
                                                </span>{" "}
                                                /<span className="text-gray-500 ml-2">{offer.price[0].duration}</span>{" "}
                                                min
                                            </div>
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            {/* {offer.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-gray-700">
                                                    <svg
                                                        className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))} */}
                                        </ul>

                                        <Button
                                            variant={offer.popular ? "black" : "white"}
                                            href={`offre-de-cours/${offer.slug}`}
                                            className="w-full justify-center"
                                        >
                                            Découvrir cette formule
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Détails Supplémentaires */}
            <section
                ref={detailsSection.elementRef}
                className={`bg-white py-16 sm:py-20 px-4 scroll-animate ${detailsSection.isVisible ? "visible" : ""}`}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                Pourquoi choisir nos <span className="text-red-600">cours individuels</span> ?
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                                        <svg
                                            className="w-5 h-5 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Méthode éprouvée</h3>
                                        <p className="text-gray-600">
                                            8 années d&apos;expérience avec plus de 1500 élèves satisfaits
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                                        <svg
                                            className="w-5 h-5 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Cours individuels</h3>
                                        <p className="text-gray-600">
                                            Attention exclusive du professeur pour un apprentissage optimal
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                                        <svg
                                            className="w-5 h-5 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Garantie de résultats</h3>
                                        <p className="text-gray-600">100% de satisfaction garantie ou remboursement</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">Commencez dès maintenant</h3>
                                <p className="mb-6">
                                    Découvrez notre approche pédagogique personnalisée avec des cours individuels
                                    adaptés à votre niveau et vos objectifs.
                                </p>
                                <Button variant="white" href="/inscription">
                                    S&apos;inscrire maintenant
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
