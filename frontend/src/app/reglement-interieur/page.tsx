export default function ReglementInterieurPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        Règlement <span className="text-red-600">Intérieur</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Règlement intérieur des cours – FLE pour tous
                    </p>
                </div>
            </section>

            {/* Contenu du règlement */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        
                        {/* Article 1 - Réservation des cours */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">📌</span>
                                <h2 className="text-2xl font-bold text-gray-900">1. Réservation des cours</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Les cours doivent être réservés au moins 8 heures à l&apos;avance via le site internet ou par email.
                            </p>
                            <p className="text-gray-700 mb-4">
                                La confirmation du cours est envoyée par email ou via la plateforme utilisée.
                            </p>
                            <p className="text-gray-700">
                                Les créneaux sont attribués selon les disponibilités : premier arrivé, premier servi.
                            </p>
                        </div>

                        {/* Article 2 - Annulation et report de cours */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">🔁</span>
                                <h2 className="text-2xl font-bold text-gray-900">2. Annulation et report de cours</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Toute annulation faite moins de 24 heures avant l&apos;horaire prévu est facturée intégralement.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Les cours peuvent être reportés gratuitement jusqu&apos;à 24 heures avant le début prévu.
                            </p>
                            <p className="text-gray-700">
                                En cas d&apos;annulation du cours de la part de l&apos;enseignante, un report sera proposé. Si aucun créneau n&apos;est possible, le montant sera remboursé ou un avoir sera émis.
                            </p>
                        </div>

                        {/* Article 3 - Retards et absences */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">💻</span>
                                <h2 className="text-2xl font-bold text-gray-900">3. Retards et absences</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                En cas de retard de l&apos;élève, le cours se termine à l&apos;heure prévue initialement. Le temps perdu ne peut être récupéré, sauf exception.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Si l&apos;élève ne se présente pas dans les 15 minutes suivant le début du cours sans prévenir, le cours est considéré comme annulé et dû.
                            </p>
                            <p className="text-gray-700">
                                En cas de retard de l&apos;enseignante, le cours sera prolongé ou une nouvelle séance sera proposée selon les disponibilités.
                            </p>
                        </div>

                        {/* Article 4 - Paiement */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">💳</span>
                                <h2 className="text-2xl font-bold text-gray-900">4. Paiement</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Les cours doivent être payés à l&apos;avance, soit à l&apos;unité, soit sous forme de packs (ex. : 5 ou 10 cours).
                            </p>
                            <p className="text-gray-700 mb-4">
                                Moyens de paiement acceptés : carte bancaire, PayPal, ApplePay, PayPay.. (via la boutique en ligne).
                            </p>
                            <p className="text-gray-700">
                                Aucune leçon ne sera donnée sans règlement préalable.
                            </p>
                        </div>

                        {/* Article 5 - Matériel pédagogique */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">📚</span>
                                <h2 className="text-2xl font-bold text-gray-900">5. Matériel pédagogique</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Les supports de cours (PDF, exercices, documents, liens) sont fournis par l&apos;enseignante, sauf dans le cas où un manuel est requis : l&apos;achat du manuel est alors à la charge de l&apos;élève.
                            </p>
                            <p className="text-gray-700">
                                Ces supports sont réservés à un usage strictement personnel. Toute diffusion, partage ou reproduction sans autorisation est interdite.
                            </p>
                        </div>

                        {/* Article 6 - Propriété intellectuelle */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">📜</span>
                                <h2 className="text-2xl font-bold text-gray-900">6. Propriété intellectuelle</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Tous les contenus, documents et supports pédagogiques produits par FLE pour tous sont protégés par le droit d&apos;auteur.
                            </p>
                            <p className="text-gray-700">
                                Toute reproduction, modification ou diffusion, même partielle, sans autorisation écrite est formellement interdite.
                            </p>
                        </div>

                        {/* Article 7 - Données personnelles */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">🔒</span>
                                <h2 className="text-2xl font-bold text-gray-900">7. Données personnelles</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Les données personnelles recueillies (nom, email, niveau de langue, préférences d&apos;apprentissage, etc.) sont utilisées exclusivement dans le cadre pédagogique et administratif.
                            </p>
                            <p className="text-gray-700">
                                Conformément au Règlement Général sur la Protection des Données (RGPD), ces informations ne sont transmises à aucun tiers et peuvent être supprimées à la demande de l&apos;élève.
                            </p>
                        </div>

                        {/* Article 8 - Plateforme et responsabilités techniques */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">🌐</span>
                                <h2 className="text-2xl font-bold text-gray-900">8. Plateforme et responsabilités techniques</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Les cours sont dispensés en ligne via [Zoom / Google Meet / autre]. Le lien est envoyé avant chaque cours.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Il est de la responsabilité de l&apos;élève d&apos;avoir une connexion internet stable, ainsi qu&apos;un micro et une caméra fonctionnels.
                            </p>
                            <p className="text-gray-700">
                                L&apos;enseignante ne pourra être tenue responsable des interruptions liées au matériel ou à la connexion de l&apos;élève.
                            </p>
                        </div>

                        {/* Article 9 - Communication et contact */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">📣</span>
                                <h2 className="text-2xl font-bold text-gray-900">9. Communication et contact</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Pour toute question pédagogique ou administrative, vous pouvez contacter l&apos;enseignante par email à 
                                <a href="mailto:flepourtous.online@gmail.com" className="text-red-600 hover:text-red-700 underline ml-1">flepourtous.online@gmail.com</a> 
                                ou via le formulaire de contact sur le site.
                            </p>
                            <p className="text-gray-700">
                                Une réponse sera apportée sous 24 heures (jours ouvrés).
                            </p>
                        </div>

                        {/* Article 10 - Engagement mutuel */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <span className="text-3xl mr-4">🎓</span>
                                <h2 className="text-2xl font-bold text-gray-900">10. Engagement mutuel</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                L&apos;élève s&apos;engage à se présenter en cours dans de bonnes conditions : ponctualité, concentration, matériel prêt.
                            </p>
                            <p className="text-gray-700 mb-4">
                                L&apos;enseignante s&apos;engage à proposer un accompagnement bienveillant, individualisé, en tenant compte des objectifs et du niveau de l&apos;apprenant.
                            </p>
                            <p className="text-gray-700">
                                Le respect, l&apos;écoute et la régularité sont essentiels au bon déroulement des séances.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
