import { Lesson } from "@/app/[locale]/types/lessons";
import { getLessons } from "@/lib/lessons";
import Image from "next/image";
import Link from "next/link";
import { getCookieBackend } from "@/lib/session";

// Icônes SVG personnalisées
const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
    </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
    </svg>
);

const AcademicCapIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
    </svg>
);

type tParams = Promise<{ slug: string }>;

export default async function LessonPage(props: { params: tParams }) {
    const { slug } = await props.params;

    const lesson: Lesson = await getLessons(slug);
    const {
        title,
        fullDescription_1,
        fullDescription_2,
        fullDescription_3,
        imagePath,
        introduction,
        subtitle_1,
        text_1,
        subtitle_2,
        text_2,
        subtitle_3,
        text_3,
        subtitle_4,
        text_4,
        subtitle_5,
        text_5,
        subtitle_6,
        text_6,
    } = lesson;

    // Vérifier si l'utilisateur est connecté
    const isAuthenticated = await getCookieBackend();

    // ✅ Variable pour simplifier les conditions
    const isConversationCourse = title === "Cours de conversation";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                                    {title}
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">{fullDescription_1}</p>
                                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">{fullDescription_2}</p>
                                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">{fullDescription_3}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={isAuthenticated ? "/calendrier/nouveau-rendez-vous" : "/inscription"}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    <ClockIcon className="w-5 h-5 mr-2" />
                                    {isAuthenticated ? "Réserver maintenant" : "S'inscrire pour réserver"}
                                </Link>
                                <Link
                                    href="#tarifs"
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                                >
                                    Voir les tarifs
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={imagePath}
                                    alt={title}
                                    width={600}
                                    height={400}
                                    className="w-full h-80 object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Approaches Section - Standard layout for most courses */}
            {introduction && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{introduction}</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {text_1 && (
                                <div className="text-center p-8 rounded-3xl bg-blue-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
                                    <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl font-bold">
                                            {isConversationCourse ? subtitle_1 : "📘"}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {isConversationCourse ? "" : subtitle_1}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">{text_1}</p>
                                </div>
                            )}

                            {text_2 && (
                                <div className="text-center p-8 rounded-3xl bg-green-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
                                    <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl font-bold">
                                            {isConversationCourse ? subtitle_2 : "📁"}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {isConversationCourse ? "" : subtitle_2}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">{text_2}</p>
                                </div>
                            )}

                            {text_3 && (
                                <div className="text-center p-8 rounded-3xl bg-purple-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
                                    <div className="bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl font-bold">
                                            {isConversationCourse ? subtitle_3 : "🎬"}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {isConversationCourse ? "" : subtitle_3}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">{text_3}</p>
                                </div>
                            )}

                            {text_4 && (
                                <div className="text-center p-8 rounded-3xl bg-orange-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-orange-100">
                                    <div className="bg-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl font-bold">
                                            {isConversationCourse ? subtitle_4 : "🎯"}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {isConversationCourse ? "" : subtitle_4}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">{text_4}</p>
                                </div>
                            )}

                            {text_5 && (
                                <div className="text-center p-8 rounded-3xl bg-yellow-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-yellow-100">
                                    <div className="bg-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl font-bold">
                                            {isConversationCourse ? subtitle_5 : "�"}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {isConversationCourse ? "" : subtitle_5}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">{text_5}</p>
                                </div>
                            )}

                            {text_6 && (
                                <div className="text-center p-8 rounded-3xl bg-red-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100">
                                    <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl font-bold">
                                            {isConversationCourse ? subtitle_6 : "🚀"}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {isConversationCourse ? "" : subtitle_6}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">{text_6}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing Section */}
            <section id="tarifs" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nos tarifs</h2>
                        <p className="text-lg text-gray-600">Choisissez la durée qui vous convient le mieux</p>
                    </div>

                    {lesson.times && lesson.times.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {lesson.times.map((lessonTime, index) => (
                                <div
                                    key={`${lessonTime.duration}-${lessonTime.price}`}
                                    className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                                        index === 1 ? "ring-2 ring-red-500 scale-105" : ""
                                    }`}
                                >
                                    {index === 1 && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                                Recommandé
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <div className="mb-6">
                                            <div className="text-4xl font-bold text-gray-900 mb-2">
                                                {lessonTime.price}€
                                            </div>
                                            <div className="text-gray-600">pour {lessonTime.duration} minutes</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center justify-center">
                                                <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                                                <span className="text-gray-700">Cours individuel</span>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                                                <span className="text-gray-700">Matériel inclus</span>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                                                <span className="text-gray-700">Suivi personnalisé</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={isAuthenticated ? "/calendrier/nouveau-rendez-vous" : "/inscription"}
                                            className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                                index === 1
                                                    ? "bg-red-600 text-white hover:bg-red-700"
                                                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                            }`}
                                        >
                                            {isAuthenticated ? "Réserver ce cours" : "S'inscrire pour réserver"}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Prêt à commencer votre aventure en français ?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Rejoignez des centaines d&apos;élèves qui ont déjà transformé leur niveau de français avec
                            nos cours personnalisés.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                href={isAuthenticated ? "/calendrier/nouveau-rendez-vous" : "/inscription"}
                                className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                            >
                                <ClockIcon className="w-5 h-5 mr-2" />
                                {isAuthenticated ? "Réserver votre premier cours" : "Commencer maintenant"}
                            </Link>
                            <a
                                href="mailto:flepourtous.online@gmail.com?subject=Demande%20d'information&body=Bonjour,%0D%0A%0D%0AJe%20souhaiterais%20obtenir%20plus%20d'informations%20sur%20vos%20cours%20de%20français.%0D%0A%0D%0AMerci."
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                            >
                                Nous contacter
                            </a>
                        </div>

                        <div className="flex items-center justify-center space-x-8 text-gray-600">
                            <div className="flex items-center">
                                <StarIcon className="w-5 h-5 text-red-600 mr-1" />
                                <span className="font-semibold">99% de satisfaction</span>
                            </div>
                            <div className="flex items-center">
                                <UserIcon className="w-5 h-5 text-red-600 mr-1" />
                                <span className="font-semibold">200+ élèves</span>
                            </div>
                            <div className="flex items-center">
                                <AcademicCapIcon className="w-5 h-5 text-red-600 mr-1" />
                                <span className="font-semibold">8 ans d&apos;expérience</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
