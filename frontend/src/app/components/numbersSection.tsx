"use client";

import { useScrollAnimation } from "@/lib/useScrollAnimation";
import StatCard from "./front/StatCard";
import { cn } from "@/lib/utils";

export default function NumbersSection() {
    const statsSection = useScrollAnimation();

    return (
        <section
            ref={statsSection.elementRef}
            className={cn(
                "bg-[#1D1E1C] py-16 sm:py-24 md:py-32 lg:py-36 px-4 scroll-animate",
                statsSection.isVisible && "visible"
            )}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        Les stats parlent d&apos;elles-mêmes
                    </h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    <div
                        className={cn(
                            "scroll-animate scroll-animate-delay-1",
                            statsSection.isVisible && "visible"
                        )}
                    >
                        <StatCard number="2000+" description="Cours" />
                    </div>
                    <div
                        className={cn(
                            "scroll-animate scroll-animate-delay-2",
                            statsSection.isVisible && "visible"
                        )}
                    >
                        <StatCard number="99%" description="De satisfaction" />
                    </div>
                    <div
                        className={cn(
                            "scroll-animate scroll-animate-delay-3",
                            statsSection.isVisible && "visible"
                        )}
                    >
                        <StatCard
                            number="200+"
                            description="D'heureux élèves"
                        />
                    </div>
                    <div
                        className={cn(
                            "scroll-animate scroll-animate-delay-4",
                            statsSection.isVisible && "visible"
                        )}
                    >
                        <StatCard number="100%" description="Pédagogiques" />
                    </div>
                </div>
            </div>
        </section>
    );
}
