import Button from "./front/Button";
import ScrollSection from "./scrollSection";

export default function CtaSection() {
    return (
        <ScrollSection className="bg-white py-12 sm:py-16 px-4 scroll-animate-scale">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Saisissez le moment :
                </h2>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Rejoignez nous !
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Chaque journée est une occasion de progresser. Investissez dans votre avenir dès aujourd&apos;hui
                    avec FLE Pour Tous. L&apos;excellence en français n&apos;attend pas – elle se construit maintenant,
                    un cours après l&apos;autre.
                </p>
                <Button variant="white" href="/offre-de-cours">
                    Démarrer maintenant
                </Button>
            </div>
        </ScrollSection>
    );
}
