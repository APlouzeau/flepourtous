import { getCookieBackend } from "@/lib/session";
import { getI18n } from "@/locales/server";
import Button from "./front/Button";

export default async function ReadySection() {
    const trad = await getI18n();
    const isAuthenticated = await getCookieBackend();

    return (
        <section className="py-16 bg-gray-50 w-1/2 mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{trad("coursesOffer.readySection.title")}</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{trad("coursesOffer.readySection.description")}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button
                        variant="black"
                        href={isAuthenticated ? "/calendrier/nouveau-rendez-vous" : "/inscription"}
                        className="text-lg py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                    >
                        {isAuthenticated
                            ? trad("coursesOffer.readySection.beginButton")
                            : trad("common.buttons.inscriptionToReserve")}
                    </Button>
                    <Button
                        variant="white"
                        href="mailto:flepourtous.online@gmail.com?subject=Demande%20d'information&body=Bonjour,%0D%0A%0D%0AJe%20souhaiterais%20obtenir%20plus%20d'informations%20sur%20vos%20cours%20de%20français.%0D%0A%0D%0AMerci."
                        className="text-lg py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                    >
                        {trad("common.buttons.contactUs")}
                    </Button>
                </div>

                <div className="flex items-center justify-center space-x-8 text-gray-600">
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 text-red-600 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                        <span className="font-semibold">{trad("coursesOffer.readySection.satisfaction")}</span>
                    </div>
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 text-red-600 mr-1"
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
                        <span className="font-semibold">
                            {trad("common.stats.students")} {trad("common.stats.studentsString")}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 text-red-600 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                            />
                        </svg>
                        <span className="font-semibold">
                            {trad("common.stats.experience")} {trad("common.stats.years")}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
