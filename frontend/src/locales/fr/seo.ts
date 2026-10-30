// Titres et descriptions des pages pour Google (FLE-81) : titre ≤ 60 caractères, description ≤ 160.
// Les pages de cours prennent leur titre et leur introduction en base ; seul le suffixe vient d'ici.
export default {
    seo: {
        home: {
            title: "Cours de français en ligne avec Ludivine | FLE pour tous",
            description: "Cours de français langue étrangère en ligne avec Ludivine : conversation, préparation au DELF et au TCF, tous niveaux, à des horaires adaptés à votre fuseau.",
        },
        offer: {
            title: "Nos cours : conversation, DELF, TCF | FLE pour tous",
            description: "Cours de français en ligne pour chaque objectif : conversation, français général, préparation au DELF, au TCF et au TEF. À l'unité ou en pack, prix affichés.",
        },
        resources: {
            title: "Ressources utilisées en cours | FLE pour tous",
            description: "Fiches, jeux, mises en situation, vidéos, podcasts et documents authentiques : les ressources qui rendent chaque cours de français en ligne vivant.",
        },
        terms: {
            title: "Conditions générales de vente | FLE pour tous",
            description: "Conditions générales de vente des cours de français en ligne FLE pour tous : réservation, paiement, packs, annulation et remboursement.",
        },
        rules: {
            title: "Règlement intérieur | FLE pour tous",
            description: "Fonctionnement des cours FLE pour tous : réservation au moins 8 h à l'avance, report gratuit jusqu'à 24 h avant, et bonnes pratiques pour les cours en visio.",
        },
        privacy: {
            title: "Politique de confidentialité | FLE pour tous",
            description: "Comment FLE pour tous collecte, utilise et protège vos données personnelles, et comment exercer vos droits (RGPD).",
        },
        login: {
            title: "Connexion | FLE pour tous",
            description: "Connectez-vous à votre compte FLE pour tous pour réserver et gérer vos cours de français en ligne.",
        },
        register: {
            title: "Créer un compte | FLE pour tous",
            description: "Créez votre compte FLE pour tous pour réserver vos cours de français en ligne avec Ludivine.",
        },
        lessonTitleSuffix: " | FLE pour tous",
    },
} as const;
