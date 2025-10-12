export default function CGVPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        Conditions Générales de <span className="text-red-600">Vente</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Pour les cours de français de « FLE pour tous »
                    </p>
                </div>
            </section>

            {/* Contenu des CGV */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        {/* Article 1 - Inscription aux cours */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">1 – Inscription aux cours</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">a. Modalités d&apos;inscription</h3>
                            <p className="text-gray-700 mb-4">
                                Toute inscription implique l&apos;acceptation pleine et entière des présentes conditions
                                générales de vente.
                            </p>
                            <p className="text-gray-700 mb-4">
                                L&apos;inscription à un cours nécessite une validation préalable de l&apos;enseignant.
                                En cas d&apos;indisponibilité pour le créneau souhaité, une autre proposition sera faite
                                à l&apos;élève.
                            </p>
                            <p className="text-gray-700 mb-4">
                                L&apos;inscription s&apos;effectue via une fiche disponible lors de la création du compte
                                utilisateur sur le site internet de FLE pour tous. Les données personnelles communiquées
                                sont conservées pendant toute la durée des cours. Au-delà de cette période, l&apos;élève peut
                                demander par écrit la suppression de ses données.
                            </p>
                            <p className="text-gray-700">
                                FLE pour tous se réserve le droit de refuser une inscription en cas de comportement
                                inapproprié ou non-respect du règlement.
                            </p>
                        </div>

                        {/* Article 2 - Modalités de paiement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">2 – Modalités de paiement</h2>
                            <p className="text-gray-700 mb-4">
                                Le règlement des cours doit être effectué en une seule fois avant la participation au
                                cours sélectionné, par carte bancaire via la boutique en ligne.
                            </p>
                            <p className="text-gray-700">Aucune réservation ne sera validée sans paiement préalable.</p>
                        </div>

                        {/* Article 3 - Tarifs des cours */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">3 – Tarifs des cours</h2>
                            <p className="text-gray-700 mb-4">
                                Les tarifs sont indiqués en euros, toutes taxes comprises (TTC) sur le site internet.
                                Aucun frais supplémentaire ne sera appliqué, sauf frais liés au mode de paiement (ex. :
                                commissions PayPal).
                            </p>
                            <p className="text-gray-700">
                                Certains cours nécessitent l&apos;achat d&apos;un manuel, à la charge de l&apos;élève.
                            </p>
                        </div>

                        {/* Article 4 - Cours privés */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">4 – Cours privés</h2>
                            <p className="text-gray-700 mb-4">Les cours sont accessibles à partir de 10 ans.</p>
                            <p className="text-gray-700 mb-4">
                                Ils peuvent être suivis en présentiel à Tours ou en ligne, depuis la France ou
                                l&apos;étranger.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Les cours en ligne sont assurés via la plateforme Daily. Sur demande, une autre
                                plateforme peut être proposée.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Formules :</h3>
                            <p className="text-gray-700 mb-4">
                                Les cours particuliers peuvent être achetés à l&apos;unité ou sous forme de crédits valables
                                6 mois à compter de la date d&apos;achat. Ces crédits sont nominatifs et non transférables.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Réservation des cours :</h3>
                            <p className="text-gray-700 mb-4">
                                Les réservations via le site sont acceptées jusqu&apos;à 8 heures avant le début du cours.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirmation :</h3>
                            <p className="text-gray-700 mb-4">
                                Une confirmation de réservation sera envoyée par FLE pour tous dans les meilleurs
                                délais.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Changement / annulation :</h3>
                            <p className="text-gray-700">
                                Les modifications ou annulations de cours à l&apos;initiative de l&apos;élève sont acceptées
                                jusqu&apos;à 24 heures avant le début du cours. Passé ce délai, le cours est dû et le crédit
                                est considéré comme consommé. En cas d&apos;absence non justifiée, le cours est également
                                perdu.
                            </p>
                        </div>

                        {/* Article 5 - Remboursement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">5 – Remboursement</h2>
                            <p className="text-gray-700 mb-4">
                                Un remboursement partiel des crédits non utilisés peut être accordé, uniquement sur
                                présentation d&apos;un certificat médical ou d&apos;une attestation de l&apos;employeur. Le
                                remboursement sera calculé sur la base du tarif unitaire d&apos;achat.
                            </p>
                            <p className="text-gray-700">
                                Des frais administratifs de 20 % seront déduits du montant total à rembourser.
                            </p>
                        </div>

                        {/* Article 6 - Cas de force majeure */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                6 – Cas de force majeure / situation exceptionnelle
                            </h2>
                            <p className="text-gray-700 mb-4">
                                En cas de force majeure (catastrophes naturelles, troubles de l&apos;ordre public, pandémie,
                                etc.), FLE pour tous se réserve le droit d&apos;annuler ou reporter les cours.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Les cours annulés seront reprogrammés dans la mesure du possible. Ces séances de
                                rattrapage pourront avoir lieu à un autre horaire que celui initialement prévu, dans la
                                limite des créneaux disponibles.
                            </p>
                            <p className="text-gray-700">
                                Si aucun report n&apos;est possible dans le mois suivant, un remboursement pourra être
                                proposé.
                            </p>
                        </div>

                        {/* Article 7 - Cours de groupe */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">7 – Cours de groupe</h2>
                            <p className="text-gray-700 mb-4">
                                Pour toute demande de cours en groupe (plus de deux personnes), un mail devra être
                                envoyé à FLE pour tous, précisant :
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Le nombre de participants</li>
                                <li>Le niveau de chacun</li>
                                <li>La durée souhaitée</li>
                                <li>Les objectifs du cours</li>
                            </ul>
                            <p className="text-gray-700">Un devis personnalisé pourra être établi.</p>
                        </div>

                        {/* Article 8 - Avoirs */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">8 – Avoirs</h2>
                            <p className="text-gray-700 mb-4">
                                Les avoirs (crédits non consommés ou gestes commerciaux) sont valables 6 mois à compter
                                de leur émission.
                            </p>
                            <p className="text-gray-700">
                                Ils ne peuvent être ni transférés ni prolongés. Au-delà de ce délai, aucun remboursement
                                ne sera possible.
                            </p>
                        </div>

                        {/* Article 9 - Modalités de remboursement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">9 – Modalités de remboursement</h2>
                            <p className="text-gray-700">
                                Tout remboursement s&apos;effectuera par virement bancaire, dans un délai maximum de 30 jours
                                à compter de la réception de la demande complète.
                            </p>
                        </div>

                        {/* Article 10 - Réclamations */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">10 – Réclamations</h2>
                            <p className="text-gray-700 mb-4">
                                Toute demande ou réclamation peut être envoyée par email à l&apos;adresse suivante :
                            </p>
                            <p className="text-gray-700 mb-4">
                                📧{" "}
                                <a
                                    href="mailto:flepourtous.online@gmail.com"
                                    className="text-red-600 hover:text-red-700 underline"
                                >
                                    flepourtous.online@gmail.com
                                </a>
                            </p>
                            <p className="text-gray-700">
                                FLE pour tous s&apos;engage à répondre dans un délai de 30 jours maximum.
                            </p>
                        </div>

                        {/* Article 11 - Mentions légales */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">11 - Mentions légales</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2">
                                    <strong>FLE pour tous (Entrepreneur individuel)</strong>
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Ludivine PLOUZEAU</strong>
                                </p>
                                <p className="text-gray-700 mb-2">
                                    2 bis rue des Combattants en AFN, 37250 SORIGNY, FRANCE
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <a
                                        href="mailto:flepourtous.online@gmail.com"
                                        className="text-red-600 hover:text-red-700 underline"
                                    >
                                        flepourtous.online@gmail.com
                                    </a>
                                </p>
                                <p className="text-gray-700 mb-2">SIRET : 93014344100010</p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Hébergement :</strong>
                                </p>
                                <p className="text-gray-700">
                                    OVH SAS : 2 rue Kellermann - 59100 Roubaix - France (1007)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
