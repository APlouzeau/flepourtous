import Link from "next/link";
import Button from "./front/Button";
import Image from "next/image";
import ScrollSection from "./scrollSection";
import { getI18n } from "@/locales/server";

export default async function HeroSection() {
    const trad = await getI18n();
    return (
        <ScrollSection className="bg-white py-8 sm:py-12 md:py-16 px-4 scroll-animate-left">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                            {trad("homePage.title")}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                            {trad("homePage.subtitle")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
                            <Link href="/calendrier/nouveau-rendez-vous">
                                <Button variant="black">Prendre rendez-vous</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative order-1 md:order-2">
                        <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                            <Image
                                src="/images/cloitre.jpg"
                                alt="Apprentissage du français"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ScrollSection>
    );
}
