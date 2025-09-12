import FAQItem from "./front/FAQItem";
import ScrollSection from "./scrollSection";
import ScrollDiv from "./scrollSectionDiv";

export default function FaqSection() {
    return (
        <ScrollSection className="bg-white py-12 sm:py-16 px-4 scroll-animate">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Votre feuille de route
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600">
                        Questions fréquemment posées
                    </p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                    <ScrollDiv className="scroll-animate scroll-animate-delay-1">
                        <FAQItem
                            question="Qui êtes-vous ?"
                            answer="Je m'appelle Ludivine et je suis française. Diplômée d'un master de FLE, j'ai vécu au Japon plusieurs années où j'ai enseigné le français. J'ai un master de didactique et une maîtrise de japonais. J'ai enseigné en France à des publics très variés, principalement en français, mais aussi en anglais et j'ai aussi enseigné le japonais à des débutants."
                        />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-2">
                        <FAQItem
                            question="À qui s’adressent vos cours ?"
                            answer="Les cours s’adressent aux apprenants de français à partir de 10 ans. Que vous habitiez en France ou à l’étranger, totalement débutant ou avancé, vous êtes le bienvenu !"
                        />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-3">
                        <FAQItem
                            question="Puis-je choisir les sujets des cours ?"
                            answer="Les cours sont “à la carte”, c’est-à-dire qu’ils sont complètement adaptés à vos besoins. Ensemble, nous déciderons non seulement de la méthode, mais aussi des sujets à aborder."
                        />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-4">
                        <FAQItem
                            question="Quelle est la fréquence recommandée pour les cours ?"
                            answer="Cela dépend de vos objectifs. Pour pratiquer son français, une séance par semaine est tout à fait raisonnable. Cependant, si vous préparez un examen ou que vous voulez suivre des cours de manière intensive, il est recommandé de faire 2 à 3 séances par semaine, afin de se concentrer un maximum sur la langue."
                        />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-5">
                        <FAQItem
                            question="De quoi ai-je besoin pour suivre un cours ?"
                            answer="Il vous faut une bonne connexion. Vous pouvez suivre le cours sur ordinateur, tablette ou téléphone (l’ordinateur est recommandé pour la visibilité du cours). Vous n’avez pas besoin de télécharger de logiciel ou d’application, vous pouvez vous connecter à l’outil de visio directement ! "
                        />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-6">
                        <FAQItem
                            question="Que se passe-t-il si j’arrive en retard ?"
                            answer="Si vous arrivez en retard, le temps est perdu, vous ne pourrez pas récupérer ce temps, l’heure du cours finira à l’heure prévue. Pour plus d’informations, veuillez lire les conditions de vente."
                        />
                    </ScrollDiv>
                    <ScrollDiv className="scroll-animate scroll-animate-delay-6">
                        <FAQItem
                            question="Puis-je annuler ou reporter un cours ?"
                            answer="Vous pouvez reporter ou annuler un cours jusqu’à 24h avant le cours. Si vous voulez annuler ou reporter dans les 24h avant le cours, le cours sera considéré comme dû et ne sera pas remboursé. Pour plus d’informations, veuillez lire les conditions de vente."
                        />
                    </ScrollDiv>
                </div>
            </div>
        </ScrollSection>
    );
}
