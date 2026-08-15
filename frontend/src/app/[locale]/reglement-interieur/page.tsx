import { getTranslations } from "@/locales/server";

export default async function ReglementInterieurPage() {
    const trad = await getTranslations();
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        {trad("rules.title1")} <span className="text-red-600">{trad("rules.title2")}</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        {trad("rules.subtitle")}
                    </p>
                </div>
            </section>

            {/* Contenu du règlement */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        {/* Article 1 - Réservation des cours */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p1.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p1.p1")}</p>
                            <p className="text-gray-700 mb-4">{trad("rules.p1.p2")}</p>
                            <p className="text-gray-700">{trad("rules.p1.p3")}</p>
                        </div>

                        {/* Article 2 - Annulation et report de cours */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p2.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p2.p1")}</p>
                            <p className="text-gray-700 mb-4">{trad("rules.p2.p2")}</p>
                            <p className="text-gray-700">{trad("rules.p2.p3")}</p>
                        </div>

                        {/* Article 3 - Retards et absences */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p3.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p3.p1")}</p>
                            <p className="text-gray-700 mb-4">{trad("rules.p3.p2")}</p>
                            <p className="text-gray-700">{trad("rules.p3.p3")}</p>
                        </div>

                        {/* Article 4 - Paiement */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p4.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p4.p1")}</p>
                            <p className="text-gray-700 mb-4">{trad("rules.p4.p2")}</p>
                            <p className="text-gray-700">{trad("rules.p4.p3")}</p>
                        </div>

                        {/* Article 5 - Matériel pédagogique */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p5.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p5.p1")}</p>
                            <p className="text-gray-700">{trad("rules.p5.p2")}</p>
                        </div>

                        {/* Article 6 - Propriété intellectuelle */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p6.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p6.p1")}</p>
                            <p className="text-gray-700">{trad("rules.p6.p2")}</p>
                        </div>

                        {/* Article 7 - Données personnelles */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p7.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p7.p1")}</p>
                            <p className="text-gray-700">{trad("rules.p7.p2")}</p>
                        </div>

                        {/* Article 8 - Plateforme et responsabilités techniques */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p8.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p8.p1")}</p>
                            <p className="text-gray-700 mb-4">{trad("rules.p8.p2")}</p>
                            <p className="text-gray-700">{trad("rules.p8.p3")}</p>
                        </div>

                        {/* Article 9 - Communication et contact */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p9.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                {trad("rules.p9.p11")}{" "}
                                <a
                                    href={`mailto:${trad("rules.p9.mail")}`}
                                    className="text-red-600 hover:text-red-700 underline ml-1"
                                >
                                    {trad("rules.p9.mail")}
                                </a>
                                {trad("rules.p9.p12")}
                            </p>
                            <p className="text-gray-700">{trad("rules.p9.p2")}</p>
                        </div>

                        {/* Article 10 - Engagement mutuel */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{trad("rules.p10.title")}</h2>
                            </div>
                            <p className="text-gray-700 mb-4">{trad("rules.p10.p1")}</p>
                            <p className="text-gray-700 mb-4">{trad("rules.p10.p2")}</p>
                            <p className="text-gray-700">{trad("rules.p10.p3")}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
