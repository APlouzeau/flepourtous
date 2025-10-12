import StatCard from "./front/StatCard";
import ScrollSection from "./scrollSection";
import ScrollDiv from "./scrollSectionDiv";

export default function NumbersSection() {
    return (
        <ScrollSection className="bg-[#1D1E1C] py-16 sm:py-24 md:py-32 lg:py-36 px-4 scroll-animate">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        Les stats parlent d&apos;elles-mêmes
                    </h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    <ScrollDiv className="scroll-animate scroll-animate-delay-1">
                        <StatCard number="2000+" description="Cours" />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-2">
                        <StatCard number="8 ans" description="d'expérience" />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-3">
                        <StatCard number="800+" description="D'heureux élèves" />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-4">
                        <StatCard number="100%" description="Pédagogique" />
                    </ScrollDiv>
                </div>
            </div>
        </ScrollSection>
    );
}
