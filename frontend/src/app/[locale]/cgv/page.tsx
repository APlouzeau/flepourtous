import { getTranslations } from "@/locales/server";

export default async function CGVPage() {
    const trad = await getTranslations();
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        {trad("cgv.titleBlack")} <span className="text-red-600">{trad("cgv.titleRed")}</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        {trad("cgv.introduction")}
                    </p>
                </div>
            </section>

            {/* Contenu des CGV */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        {/* Article 1 - Inscription aux cours */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.1.title")}</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">{trad("cgv.1.a.title")}</h3>
                            <p className="text-gray-700 mb-4">{trad("cgv.1.a.content.0.paragraph")}</p>
                            <p className="text-gray-700 mb-4">{trad("cgv.1.a.content.1.paragraph")}</p>
                            <p className="text-gray-700 mb-4">{trad("cgv.1.a.content.2.paragraph")}</p>
                            <p className="text-gray-700">{trad("cgv.1.a.content.3.paragraph")}</p>
                        </div>

                        {/* Article 1-2 - Modalités de paiement */}
                        <div className="mb-12">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">{trad("cgv.1.b.title")}</h3>
                            <p className="text-gray-700 mb-4">{trad("cgv.1.b.content.0.paragraph")}</p>
                            <p className="text-gray-700">{trad("cgv.1.b.content.1.paragraph")}</p>
                        </div>

                        {/* Article 2 - Tarifs des cours */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.2.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("cgv.2.content.0.paragraph")}</p>
                            <p className="text-gray-700">{trad("cgv.2.content.1.paragraph")}</p>
                        </div>

                        {/* Article 3 - Cours privés */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.3.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("cgv.3.content.0.paragraph")}</p>
                            <p className="text-gray-700 mb-4">{trad("cgv.3.content.1.paragraph")}</p>
                            <p className="text-gray-700 mb-4">{trad("cgv.3.content.2.paragraph")}</p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {trad("cgv.3.content.3.subtitle")}
                            </h3>
                            <p className="text-gray-700 mb-4">{trad("cgv.3.content.3.paragraph")}</p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {trad("cgv.3.content.4.subtitle")}
                            </h3>
                            <p className="text-gray-700 mb-4">{trad("cgv.3.content.4.paragraph")}</p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {trad("cgv.3.content.5.subtitle")}
                            </h3>
                            <p className="text-gray-700 mb-4">{trad("cgv.3.content.5.paragraph")}</p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {trad("cgv.3.content.6.subtitle")}
                            </h3>
                            <p className="text-gray-700">{trad("cgv.3.content.6.paragraph")}</p>
                        </div>

                        {/* Article 4 - Remboursement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.4.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("cgv.4.content.0.paragraph")}</p>
                            <p className="text-gray-700">{trad("cgv.4.content.1.paragraph")}</p>
                        </div>
                    </div>

                    {/* Article 5 - Cas de force majeure */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.5.title")}</h2>
                        <p className="text-gray-700 mb-4">{trad("cgv.5.content.0.paragraph")}</p>
                        <p className="text-gray-700 mb-4">{trad("cgv.5.content.1.paragraph")}</p>
                        <p className="text-gray-700">{trad("cgv.5.content.2.paragraph")}</p>
                    </div>

                    {/* Article 6 - Cours de groupe */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.6.title")}</h2>
                        <p className="text-gray-700 mb-4">{trad("cgv.6.content.0.paragraph")}</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                            <li>{trad("cgv.6.content.1.list.0")}</li>
                            <li>{trad("cgv.6.content.1.list.1")}</li>
                            <li>{trad("cgv.6.content.1.list.2")}</li>
                            <li>{trad("cgv.6.content.1.list.3")}</li>
                        </ul>
                        <p className="text-gray-700">{trad("cgv.6.content.2.paragraph")}</p>
                    </div>

                    {/* Article 7 - Avoirs */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.7.title")}</h2>
                        <p className="text-gray-700 mb-4">{trad("cgv.7.content.0.paragraph")}</p>
                        <p className="text-gray-700 mb-4">{trad("cgv.7.content.1.paragraph")}</p>
                        <p className="text-gray-700">{trad("cgv.7.content.2.paragraph")}</p>
                    </div>

                    {/* Article 8 - Modalités de remboursement */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.8.title")}</h2>
                        <p className="text-gray-700">{trad("cgv.8.content.0.paragraph")}</p>
                    </div>

                    {/* Article 9 - Réclamations */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.9.title")}</h2>
                        <p className="text-gray-700 mb-4">{trad("cgv.9.content.0.paragraph")}</p>
                        <p className="text-gray-700 mb-4">
                            📧{" "}
                            <a
                                href="mailto:flepourtous.online@gmail.com"
                                className="text-red-600 hover:text-red-700 underline"
                            >
                                flepourtous.online@gmail.com
                            </a>
                        </p>
                        <p className="text-gray-700">{trad("cgv.9.content.2.paragraph")}</p>
                    </div>

                    {/* Article 10 - Mentions légales */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("cgv.10.title")}</h2>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="text-gray-700 mb-2">
                                <strong>FLE pour tous (Entrepreneur individuel)</strong>
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Ludivine PLOUZEAU</strong>
                            </p>
                            <p className="text-gray-700 mb-2">
                                2 bis rue des Combattants en AFN, 37250 SORIGNY, FRANCE
                            </p>
                            <p className="text-gray-700 mb-2">
                                <a
                                    href="mailto:flepourtous.online@gmail.com"
                                    className="text-red-600 hover:text-red-700 underline"
                                >
                                    flepourtous.online@gmail.com
                                </a>
                            </p>
                            <p className="text-gray-700 mb-2">SIRET : 93014344100010</p>
                            <p className="text-gray-700 mb-2">
                                <strong>Hébergement :</strong>
                            </p>
                            <p className="text-gray-700">OVH SAS : 2 rue Kellermann - 59100 Roubaix - France (1007)</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
