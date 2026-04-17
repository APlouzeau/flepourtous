import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "@/locales/server";

export default async function ResourcesPage() {
    const trad = await getTranslations();
    return (
        <div className="min-h-screen bg-gray-50">
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                                    {trad("ressources.title")}
                                </h1>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/ressources.png"
                                    alt="Ressources utilisées"
                                    width={600}
                                    height={400}
                                    className="w-full h-80 object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <p>{trad("ressources.introduction")}</p>
                <h3 className="text-2xl font-bold mb-2 mt-4">{trad("ressources.subTtitle1")}</h3>
                <p>{trad("ressources.content1")}</p>
                <h3 className="text-2xl font-bold mb-2 mt-4">{trad("ressources.subTtitle2")}</h3>
                <p>{trad("ressources.content2")}</p>
                <h3 className="text-2xl font-bold mb-2 mt-4">{trad("ressources.subTtitle3")}</h3>
                <p>{trad("ressources.content3")}</p>
            </section>

            <section className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <h4 className="text-2xl font-bold mb-2 mt-4">{trad("ressources.bookSection.title")}</h4>
                <div>
                    <ul className="list-disc list-inside space-y-2">
                        <li className="flex items-center">
                            <p>
                                <strong>{trad("ressources.bookSection.books.0.title")}</strong>
                                {trad("ressources.bookSection.books.0.description")}
                            </p>
                            <Link
                                href="https://didierfle.com/produit/edito-b1-edition-2022-2024-livre-didierfle-app/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/images/edito.png"
                                    alt="Manuel Édito"
                                    width={400}
                                    height={267}
                                    className="mt-2 rounded-lg shadow-md"
                                />
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <Link
                                href="https://www.cle-international.com/recherche/collection/progressive-604?text=progressive"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/images/progressive.jpg"
                                    alt="Manuel Édito"
                                    width={300}
                                    height={150}
                                    className="mt-2 rounded-lg shadow-md"
                                />
                            </Link>
                            <p className="ml-4">
                                <strong>{trad("ressources.bookSection.books.1.title")}</strong>
                                {trad("ressources.bookSection.books.1.description")}
                            </p>
                        </li>
                        <li className="flex items-center">
                            <p>
                                <strong>{trad("ressources.bookSection.books.2.title")}</strong>{" "}
                                {trad("ressources.bookSection.books.2.description")}
                            </p>
                            <Link
                                href="https://didierfle.com/produit/le-delf-b2-100-reussite-edition-2021-2022-livre-didierfle-app/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/images/100.jpeg"
                                    alt="Manuel Édito"
                                    width={300}
                                    height={150}
                                    className="mt-2 rounded-lg shadow-md"
                                />
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <Link
                                href="https://www.cle-international.com/recherche?text=abc%20delf"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/images/abc.jpg"
                                    alt="Manuel Édito"
                                    width={300}
                                    height={150}
                                    className="mt-2 rounded-lg shadow-md"
                                />
                            </Link>
                            <p className="ml-4">
                                <strong>{trad("ressources.bookSection.books.3.title")}</strong>{" "}
                                {trad("ressources.bookSection.books.3.description")}
                            </p>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
