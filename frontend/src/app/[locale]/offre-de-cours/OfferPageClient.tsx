"use client";

import Button from "@/app/[locale]/components/front/Button";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import Image from "next/image";
import { LessonsWithPrices } from "../types/lessons";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl"; // 👈 import direct next-intl
import { routing } from "../../../i18n/routing";

interface OfferPageClientProps {
    lessons: Readonly<LessonsWithPrices>;
}

export default function OfferPageClient({ lessons }: Readonly<OfferPageClientProps>) {
    // Hooks pour les animations
    const offersSection = useScrollAnimation();
    const detailsSection = useScrollAnimation();
    const trad = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) ?? "en";
    const coursePathnames = routing.pathnames["/offre-de-cours"] as Record<string, string>;
    const courseRouteSegment = coursePathnames[locale]?.replace("/", "") ?? "offre-de-cours";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        {trad("coursesOffer.titleBlack")}
                        <span className="text-red-600">{trad("coursesOffer.titleRed")}</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                        {trad("coursesOffer.introduction")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div className="bg-gray-50 rounded-2xl px-8 py-4 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-900">{trad("common.stats.courses")}</div>
                            <div className="text-gray-600">{trad("homePage.numbersSection.stats.courses")}</div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl px-8 py-4 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-900">
                                {trad("common.stats.experience")}
                                {trad("common.stats.yearsString")}
                            </div>
                            <div className="text-gray-600">{trad("homePage.numbersSection.stats.experience")}</div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl px-8 py-4 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-900">{trad("common.stats.students")}</div>
                            <div className="text-gray-600">{trad("homePage.numbersSection.stats.happyStudents")}</div>
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
                            {trad("coursesOffer.chooseBlack")}
                            <span className="text-red-600">{trad("coursesOffer.chooseRed")}</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{trad("coursesOffer.subChoose")}</p>
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
                                        {offer.imagePath ? (
                                            <Image
                                                src={offer.imagePath}
                                                alt={offer.title}
                                                fill
                                                className="object-cover transition-all duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                <svg
                                                    className="w-16 h-16 text-blue-400"
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
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-2xl font-bold text-white mb-2">{offer.title}</h3>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <p className="text-gray-600 mb-6 leading-relaxed text-lg flex-grow">
                                            {offer.shortDescription}
                                        </p>

                                        <div className="mb-8">
                                            <div className="text-center">
                                                <div className="text-5xl font-bold text-red-600 mb-2">
                                                    {offer.price[0].price}€
                                                </div>
                                                <div className="text-gray-500 text-lg">
                                                    {trad("common.prices.for")} {offer.price[0].duration}{" "}
                                                    {trad("common.prices.mn")}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="black"
                                            href={`/${courseRouteSegment}/${offer.slug}`}
                                            className="w-full justify-center text-lg py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 mt-auto"
                                        >
                                            {trad("common.buttons.learnMore")}
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
                            {trad("coursesOffer.whyBlack")}
                            <span className="text-red-600">{trad("coursesOffer.whyRed")}</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{trad("coursesOffer.subWhy")}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div className="bg-red-50 p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100">
                            <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-10 h-10 text-white"
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
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {trad("coursesOffer.cards.0.title")}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {trad("coursesOffer.cards.0.description")}
                            </p>
                        </div>

                        <div className="bg-red-50 p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100">
                            <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-10 h-10 text-white"
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
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {trad("coursesOffer.cards.1.title")}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {trad("coursesOffer.cards.1.description")}
                            </p>
                        </div>

                        <div className="bg-red-50 p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100">
                            <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-10 h-10 text-white"
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
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {trad("coursesOffer.cards.2.title")}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {trad("coursesOffer.cards.2.description")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
