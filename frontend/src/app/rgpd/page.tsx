export default function RGPDPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-white">
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        Politique de <span className="text-red-600">Confidentialité</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        RGPD - Protection de vos données personnelles
                    </p>
                </div>
            </section>

            {/* Contenu RGPD */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        
                        {/* Responsable du traitement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Responsable du traitement</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2">
                                    Ce site est édité par <strong>Ludivine PLOUZEAU</strong>, auto-entrepreneur immatriculé sous le numéro <strong>93014344100010</strong>, dont le siège est situé à <strong>2 bis rue des Combattants en AFN, 37250 SORIGNY, FRANCE</strong>.
                                </p>
                                <p className="text-gray-700">
                                    Contact : <a href="mailto:flepourtous.online@gmail.com" className="text-red-600 hover:text-red-700 underline">flepourtous.online@gmail.com</a>
                                </p>
                            </div>
                        </div>

                        {/* Données collectées */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Données collectées</h2>
                            <p className="text-gray-700 mb-4">
                                Nous collectons et traitons les données suivantes :
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li><strong>Formulaire de contact</strong> : nom, prénom, adresse email, message.</li>
                                <li><strong>Inscription utilisateur</strong> : nom, prénom, adresse email, mot de passe (chiffré).</li>
                                <li><strong>Prise de rendez-vous</strong> : nom, prénom, email, téléphone, date et heure choisies (enregistrées dans notre base de données et sur le calendrier Google de l&apos;administrateur).</li>
                                <li><strong>Paiement</strong> : informations nécessaires au traitement du paiement (transmises directement et uniquement à Stripe ou PayPal – aucune donnée bancaire n&apos;est stockée sur ce site).</li>
                                <li><strong>Cookies</strong> : uniquement un cookie technique de session (PHPSESSID).</li>
                            </ul>
                        </div>

                        {/* Finalité du traitement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalité du traitement</h2>
                            <p className="text-gray-700 mb-4">
                                Vos données sont collectées pour :
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Gérer et répondre à vos demandes via le formulaire de contact.</li>
                                <li>Créer et gérer votre compte utilisateur.</li>
                                <li>Gérer vos rendez-vous et les synchroniser avec le calendrier de l&apos;administrateur.</li>
                                <li>Traiter vos paiements via Stripe/PayPal.</li>
                                <li>Assurer le bon fonctionnement technique du site.</li>
                            </ul>
                        </div>

                        {/* Base légale du traitement */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Base légale du traitement</h2>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li><strong>Exécution d&apos;un contrat</strong> : création de compte, réservation de rendez-vous, paiement.</li>
                                <li><strong>Consentement</strong> : utilisation du formulaire de contact.</li>
                                <li><strong>Obligation légale</strong> : conservation des documents comptables (factures, paiements).</li>
                                <li><strong>Intérêt légitime</strong> : bon fonctionnement technique du site (cookie de session).</li>
                            </ul>
                        </div>

                        {/* Durée de conservation */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Durée de conservation</h2>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li><strong>Données de contact</strong> : 3 ans après le dernier échange.</li>
                                <li><strong>Comptes utilisateurs</strong> : supprimés 3 ans après la dernière activité (sauf obligation légale).</li>
                                <li><strong>Rendez-vous</strong> : conservés 3 ans après la date du rendez-vous.</li>
                                <li><strong>Données de facturation et paiements</strong> : 10 ans (obligation légale).</li>
                                <li><strong>Cookie de session PHP</strong> : supprimé à la fermeture du navigateur.</li>
                            </ul>
                        </div>

                        {/* Destinataires des données */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Destinataires des données</h2>
                            <p className="text-gray-700 mb-4">
                                Vos données sont uniquement accessibles par <strong>Ludivine PLOUZEAU</strong> en tant qu&apos;auto-entrepreneur.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Elles peuvent être transmises à des prestataires techniques strictement nécessaires :
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Hébergeur du site,</li>
                                <li>Google (synchronisation des rendez-vous via Google Calendar),</li>
                                <li>Stripe et PayPal (paiements sécurisés).</li>
                            </ul>
                        </div>

                        {/* Transfert hors Union européenne */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfert hors Union européenne</h2>
                            <p className="text-gray-700 mb-4">
                                Certains prestataires (Google, Stripe, PayPal) sont situés hors de l&apos;Union européenne.
                            </p>
                            <p className="text-gray-700">
                                Ils appliquent des garanties conformes au RGPD, notamment via les clauses contractuelles types validées par la Commission européenne.
                            </p>
                        </div>

                        {/* Cookies */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies</h2>
                            <p className="text-gray-700 mb-4">
                                Notre site utilise uniquement un cookie de session (PHPSESSID), indispensable au bon fonctionnement du site.
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                    <li><strong>Type</strong> : cookie technique de session</li>
                                    <li><strong>Finalité</strong> : maintenir votre navigation et vos actions d&apos;une page à l&apos;autre</li>
                                    <li><strong>Durée</strong> : supprimé à la fermeture du navigateur</li>
                                    <li><strong>Consentement</strong> : non requis (cookie indispensable)</li>
                                </ul>
                                <p className="text-gray-700 mb-4">
                                    Aucun cookie publicitaire ou de suivi n&apos;est utilisé.
                                </p>
                                <p className="text-gray-700">
                                    Lors de l&apos;utilisation du module de paiement, Stripe et PayPal peuvent déposer leurs propres cookies nécessaires au traitement sécurisé des transactions.
                                </p>
                            </div>
                        </div>

                        {/* Vos droits */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos droits</h2>
                            <p className="text-gray-700 mb-4">
                                Conformément au RGPD, vous disposez des droits suivants :
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Accès, rectification, suppression de vos données,</li>
                                <li>Limitation ou opposition au traitement,</li>
                                <li>Portabilité de vos données (export sur demande).</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Vous pouvez exercer ces droits en contactant : 
                                <a href="mailto:flepourtous.online@gmail.com" className="text-red-600 hover:text-red-700 underline">flepourtous.online@gmail.com</a>
                            </p>
                            <p className="text-gray-700">
                                En cas de litige, vous pouvez introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 underline">www.cnil.fr</a>).
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
