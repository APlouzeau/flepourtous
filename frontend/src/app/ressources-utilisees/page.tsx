import Image from "next/image";
import Link from "next/link";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                                    Ressources utilisées
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
                <p>
                    Pour proposer des cours dynamiques, variés et adaptés aux besoins de chaque apprenant, j’utilise un
                    large éventail de ressources pédagogiques.
                </p>
                <h3 className="text-2xl font-bold mb-2 mt-4">Documents personnalisés</h3>
                <p>
                    Je conçois moi-même de nombreux supports (fiches de vocabulaire, activités de grammaire, jeux, mises
                    en situation, etc.) afin de m’adapter au niveau, aux centres d’intérêt et aux objectifs de chaque
                    élève. Ces documents sont pensés pour favoriser l’interaction, l’autonomie et le plaisir
                    d’apprendre.
                </p>
                <h3 className="text-2xl font-bold mb-2 mt-4">Ressources en ligne</h3>
                <p>
                    Des extraits d’articles, des vidéos, des podcasts, des images ou des documents issus de la vie
                    quotidienne (menus, publicités, horaires, formulaires...) viennent enrichir les cours pour une
                    immersion dans le français réel et vivant.
                </p>
                <h3 className="text-2xl font-bold mb-2 mt-4">Manuels et ouvrages de référence</h3>
                <p>
                    Je m’appuie sur des manuels de référence reconnus pour la qualité de leur contenu et leur efficacité
                    pédagogique. Ces ressources sont sélectionnées avec soin pour garantir des cours de qualité, riches
                    et stimulants, quel que soit le niveau.
                </p>
            </section>

            <section className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <h4 className="text-2xl font-bold mb-2 mt-4">
                    Voici quelques-uns des ouvrages que j’utilise régulièrement en fonction du niveau et des objectifs
                    des apprenants :
                </h4>
                <div>
                    <ul className="list-disc list-inside space-y-2">
                        <li className="flex items-center">
                            <p>
                                <strong>Édito</strong> (Édition Didier) : une méthode actuelle, idéale pour développer
                                les compétences générales tout en explorant la culture francophone.
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
                                <strong>La série &quot;Progressive&quot;</strong> (CLE International) : des ouvrages
                                progressifs par niveau pour travailler la grammaire, le vocabulaire, la conjugaison, la
                                compréhension écrite/orale, etc.
                            </p>
                        </li>
                        <li className="flex items-center">
                            <p>
                                <strong>Les 100% DELF</strong> (Édition Didier) : pour s’entraîner de manière intensive
                                et ciblée à chaque épreuve du DELF, avec des stratégies et des mises en situation
                                proches des examens officiels.
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
                                <strong>Les ABC DELF</strong> (Éditions Nathan) : pour se préparer efficacement aux
                                examens du DELF avec des explications claires, des conseils méthodologiques et des
                                exercices corrigés.
                            </p>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
