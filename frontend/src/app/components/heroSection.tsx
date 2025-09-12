"use client";

import Link from "next/link";
import Button from "./front/Button";
import Image from "next/image";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

export default function HeroSection() {
    const heroSection = useScrollAnimation();

    return (
        <section
            ref={heroSection.elementRef}
            className={`bg-white py-8 sm:py-12 md:py-16 px-4 scroll-animate-left ${
                heroSection.isVisible ? "visible" : ""
            }`}
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                            Augmenter votre niveau en Français avec{" "}
                            <span className="text-red-600 relative cursor-help group">
                                Guizmo-kun{" "}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                                    C&apos;est mon catamiaou 🐱
                                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></span>
                                </span>
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                            Développez vos connaissances avec FLE Pour Tous,
                            votre partenaire de cours de français en ligne avec
                            des méthodes efficaces et des cours personnalisés
                            pour atteindre vos objectifs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
                            <Link href="/calendrier/nouveau-rendez-vous">
                                <Button variant="black">
                                    Prendre rendez-vous
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative order-1 md:order-2">
                        <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                            <Image
                                src="/images/triomphe.jpg"
                                alt="Apprentissage du français"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
