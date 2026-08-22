import { getTranslations } from "@/locales/server";
import Version from "../components/front/version";

export default async function RGPDPage() {
    const trad = await getTranslations();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        {trad("privacy.title1")}
                        <span className="text-red-600">{trad("privacy.title2")}</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        {trad("privacy.subtitle")}
                    </p>
                </div>
            </section>

            {/* Contenu RGPD */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        {/* Responsable du traitement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p1.title")}</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2">
                                    {trad("privacy.p1.p11")}
                                    <strong>Ludivine PLOUZEAU</strong>
                                    {trad("privacy.p1.p13")}
                                    <strong>93014344100010</strong>
                                    {trad("privacy.p1.p15")}
                                    <strong>2 bis rue des Combattants en AFN, 37250 SORIGNY, FRANCE</strong>.
                                </p>
                                <p className="text-gray-700">
                                    {trad("privacy.p1.p17")}
                                    <a
                                        href="mailto:flepourtous.online@gmail.com"
                                        className="text-red-600 hover:text-red-700 underline"
                                    >
                                        flepourtous.online@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Données collectées */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p2.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("privacy.p2.p1")}</p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>
                                    <strong>{trad("privacy.p2.l11")}</strong> : {trad("privacy.p2.l12")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p2.l21")}</strong> : {trad("privacy.p2.l22")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p2.l31")}</strong> : {trad("privacy.p2.l32")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p2.l41")}</strong> : {trad("privacy.p2.l42")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p2.l51")}</strong> : {trad("privacy.p2.l52")}.
                                </li>
                            </ul>
                        </div>

                        {/* Finalité du traitement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p3.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("privacy.p3.p1")}</p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>{trad("privacy.p3.l1")}</li>
                                <li>{trad("privacy.p3.l2")}</li>
                                <li>{trad("privacy.p3.l3")}</li>
                                <li>{trad("privacy.p3.l4")}</li>
                            </ul>
                        </div>

                        {/* Base légale du traitement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p4.title")}</h2>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>
                                    <strong>{trad("privacy.p4.l11")}</strong> : {trad("privacy.p4.l12")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p4.l21")}</strong> : {trad("privacy.p4.l22")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p4.l31")}</strong> : {trad("privacy.p4.l32")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p4.l41")}</strong> : {trad("privacy.p4.l42")}.
                                </li>
                            </ul>
                        </div>

                        {/* Durée de conservation */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p5.title")}</h2>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>
                                    <strong>{trad("privacy.p5.l11")}</strong> : {trad("privacy.p5.l12")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p5.l21")}</strong> : {trad("privacy.p5.l22")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p5.l31")}</strong> : {trad("privacy.p5.l32")}.
                                </li>
                                <li>
                                    <strong>{trad("privacy.p5.l41")}</strong> : {trad("privacy.p5.l42")}.
                                </li>
                            </ul>
                        </div>

                        {/* Destinataires des données */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p6.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("privacy.p6.p1")}</p>
                            <p className="text-gray-700 mb-4">{trad("privacy.p6.p2")}</p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>{trad("privacy.p6.l1")}</li>
                                <li>{trad("privacy.p6.l2")}</li>
                                <li>{trad("privacy.p6.l3")}</li>
                            </ul>
                        </div>

                        {/* Transfert hors Union européenne */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p7.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("privacy.p7.p1")}</p>
                            <p className="text-gray-700">{trad("privacy.p7.p2")}</p>
                        </div>

                        {/* Cookies */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p8.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("privacy.p8.p1")}</p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                    <li>
                                        <strong>{trad("privacy.p8.l11")}</strong> : {trad("privacy.p8.l12")}
                                    </li>
                                    <li>
                                        <strong>{trad("privacy.p8.l21")}</strong> : {trad("privacy.p8.l22")}
                                    </li>
                                    <li>
                                        <strong>{trad("privacy.p8.l31")}</strong> : {trad("privacy.p8.l32")}
                                    </li>
                                    <li>
                                        <strong>{trad("privacy.p8.l34")}</strong> : {trad("privacy.p8.l35")}
                                    </li>
                                </ul>
                                <p className="text-gray-700 mb-4">{trad("privacy.p8.p2")}</p>
                                <p className="text-gray-700">{trad("privacy.p8.p3")}</p>
                            </div>
                        </div>

                        {/* Vos droits */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{trad("privacy.p9.title")}</h2>
                            <p className="text-gray-700 mb-4">{trad("privacy.p9.p1")}</p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>{trad("privacy.p9.l1")}</li>
                                <li>{trad("privacy.p9.l2")}</li>
                                <li>{trad("privacy.p9.l3")}</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                {trad("privacy.p9.p2")}
                                <a
                                    href="mailto:flepourtous.online@gmail.com"
                                    className="text-red-600 hover:text-red-700 underline"
                                >
                                    flepourtous.online@gmail.com
                                </a>
                            </p>
                            <p className="text-gray-700">
                                {trad("privacy.p9.p3")}
                                <a
                                    href="https://www.cnil.fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-600 hover:text-red-700 underline"
                                >
                                    {trad("privacy.p9.pmail2")}
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                    <Version document={trad("privacy.title1") + " " + trad("privacy.title2")} version="1.1" />
                </div>
            </section>
        </div>
    );
}
