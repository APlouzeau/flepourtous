import FeatureCard from "./front/FeatureCard";
import ScrollSection from "./scrollSection";
import ScrollDiv from "./scrollSectionDiv";
import { getI18n } from "@/locales/server";

export default async function WhyChooseFleSection() {
   const trad = await getI18n();
    return (
        <ScrollSection className="bg-gray-50 py-12 sm:py-16 px-4 scroll-animate">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {trad("homePage.WhyChooseFleSection.title")}
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <ScrollDiv className="scroll-animate scroll-animate-delay-1">
                        <FeatureCard
                            icon="📅"
                            title={trad("homePage.WhyChooseFleSection.features.0.flexibleSchedule.title")}
                            subtitle={trad("homePage.WhyChooseFleSection.features.0.flexibleSchedule.subtitle")}
                            description={trad("homePage.WhyChooseFleSection.features.0.flexibleSchedule.description")}
                        />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-2">
                        <FeatureCard
                            icon="💰"
                            title={trad("homePage.WhyChooseFleSection.features.1.transparentPricing.title")}
                            subtitle={trad("homePage.WhyChooseFleSection.features.1.transparentPricing.subtitle")}
                            description={trad("homePage.WhyChooseFleSection.features.1.transparentPricing.description")}
                        />
                    </ScrollDiv>
                    <ScrollDiv className="sm:col-span-2 lg:col-span-1 scroll-animate scroll-animate-delay-3">
                        <FeatureCard
                            icon="👨‍🏫"
                            title={trad("homePage.WhyChooseFleSection.features.2.personalizedApproach.title")}
                            subtitle={trad("homePage.WhyChooseFleSection.features.2.personalizedApproach.subtitle")}
                            description={trad("homePage.WhyChooseFleSection.features.2.personalizedApproach.description")}
                        />
                    </ScrollDiv>
                </div>
            </div>
        </ScrollSection>
    );
}
