/**
 * Données riches des formations Infocash Académie
 * Utilisé par FormationDetailPage et ThemesSection
 */
import type { ThemeType } from '@/components/ui/themed-card'

export interface CurriculumModule {
  id: number
  title: string
  description: string
  duration: string
  topics: string[]
}

export interface ContentPreview {
  type: 'tuto' | 'newsletter' | 'consultation'
  title: string
  description: string
}

export interface Instructor {
  name: string
  role: string
  bio: string
  credentials: string[]
}

export interface FAQItem {
  question: string
  answer: string
}

export interface Formation {
  // Identité
  id: ThemeType
  number: string
  name: string
  subtitle: string
  shortDescription: string

  // Theming
  color: string
  textColor: string

  // Contenu riche
  longDescription: string
  highlights: string[]
  curriculum: CurriculumModule[]
  sampleContent: ContentPreview[]
  instructor: Instructor
  faq: FAQItem[]

  // Bonus spécifique
  isBonus?: boolean
  starsRequired?: number
}

export const formations: Record<ThemeType, Formation> = {
  metaux: {
    id: 'metaux',
    number: '01',
    name: 'Métaux précieux',
    subtitle: 'Or & Argent physique',
    shortDescription: "Apprenez à investir dans l'or et l'argent. Comprendre les cycles, le stockage et la protection de votre patrimoine.",
    color: '#F2CC00',
    textColor: 'text-black',

    longDescription: `Les métaux précieux sont depuis des millénaires une valeur refuge par excellence. Cette formation vous donne toutes les clés pour comprendre ce marché, identifier les meilleures opportunités d'achat et constituer un patrimoine tangible à l'abri des crises monétaires.

Vous apprendrez à distinguer l'or papier de l'or physique, à comprendre les cycles de marché, et à optimiser vos achats selon votre profil d'investisseur.`,

    highlights: [
      'Comprendre les fondamentaux du marché de l\'or et de l\'argent',
      'Identifier les meilleurs moments pour acheter',
      'Choisir entre pièces, lingots et or papier',
      'Sécuriser et stocker vos métaux précieux',
      'Optimiser la fiscalité de vos plus-values',
    ],

    curriculum: [
      {
        id: 1,
        title: 'Les fondamentaux des métaux précieux',
        description: 'Comprendre pourquoi l\'or et l\'argent sont des valeurs refuges depuis des millénaires.',
        duration: '1 semaine',
        topics: [
          'Histoire monétaire et rôle de l\'or',
          'Différences entre or et argent',
          'Or physique vs or papier',
          'Les acteurs du marché',
        ],
      },
      {
        id: 2,
        title: 'Analyser le marché',
        description: 'Apprendre à lire les cycles et identifier les opportunités.',
        duration: '1 semaine',
        topics: [
          'Les cycles de l\'or et de l\'argent',
          'Indicateurs clés à surveiller',
          'Corrélation avec les autres actifs',
          'Timing d\'achat optimal',
        ],
      },
      {
        id: 3,
        title: 'Acheter intelligemment',
        description: 'Stratégies d\'achat et choix des produits.',
        duration: '1 semaine',
        topics: [
          'Pièces vs lingots : avantages et inconvénients',
          'Les meilleures pièces pour investir',
          'Où acheter en confiance',
          'Négocier les primes',
        ],
      },
      {
        id: 4,
        title: 'Stocker et transmettre',
        description: 'Sécuriser votre patrimoine et optimiser la fiscalité.',
        duration: '1 semaine',
        topics: [
          'Solutions de stockage (coffre, banque, étranger)',
          'Fiscalité des métaux précieux',
          'Transmission et succession',
          'Déclaration et traçabilité',
        ],
      },
    ],

    sampleContent: [
      {
        type: 'newsletter',
        title: 'Analyse mensuelle du marché de l\'or',
        description: 'Décryptage des tendances et opportunités du mois.',
      },
      {
        type: 'tuto',
        title: 'Comment reconnaître une vraie pièce d\'or',
        description: 'Les techniques pour éviter les contrefaçons.',
      },
      {
        type: 'consultation',
        title: 'Session Q&A métaux précieux',
        description: 'Réponses en direct à vos questions sur l\'or et l\'argent.',
      },
    ],

    instructor: {
      name: 'Nicolas Delourme',
      role: 'Expert en investissement patrimonial',
      bio: 'Passionné par les métaux précieux depuis plus de 15 ans, Nicolas accompagne les investisseurs dans la constitution d\'un patrimoine tangible et résilient.',
      credentials: [
        '20 ans d\'expérience en investissement',
        'Fondateur d\'Infocash',
        'Auteur de plusieurs ouvrages sur l\'or',
      ],
    },

    faq: [
      {
        question: 'Faut-il privilégier l\'or ou l\'argent ?',
        answer: 'Les deux ont leur place dans un portefeuille. L\'or est plus stable et reconnu, l\'argent offre un potentiel de hausse plus important mais avec plus de volatilité. Une allocation 70% or / 30% argent est souvent recommandée pour débuter.',
      },
      {
        question: 'Où stocker mes métaux précieux ?',
        answer: 'Plusieurs options existent : coffre-fort personnel, coffre en banque, ou stockage dans des coffres privés spécialisés. Chaque solution a ses avantages en termes de sécurité, accessibilité et confidentialité.',
      },
      {
        question: 'Quelle est la fiscalité sur l\'or ?',
        answer: 'En France, deux régimes existent : la taxe forfaitaire (11,5% du prix de vente) ou le régime des plus-values (36,2% sur la plus-value avec abattement de 5% par an après 2 ans). Le choix dépend de votre situation.',
      },
    ],
  },

  portefeuille: {
    id: 'portefeuille',
    number: '02',
    name: 'Portefeuille permanent',
    subtitle: 'Stratégie long terme',
    shortDescription: 'Construisez un portefeuille résilient basé sur la diversification. Performant dans toutes les conditions de marché.',
    color: '#A8C7EA',
    textColor: 'text-slate-900',

    longDescription: `Le portefeuille permanent est une stratégie d'investissement conçue pour performer dans tous les environnements économiques : croissance, récession, inflation ou déflation.

Basée sur les travaux de Harry Browne, cette approche simple mais puissante vous permet de construire un patrimoine résilient avec un minimum d'interventions.`,

    highlights: [
      'Comprendre la philosophie du portefeuille permanent',
      'Construire une allocation équilibrée',
      'Choisir les meilleurs supports pour chaque classe d\'actifs',
      'Rééquilibrer efficacement votre portefeuille',
      'Adapter la stratégie à votre situation personnelle',
    ],

    curriculum: [
      {
        id: 1,
        title: 'Philosophie et fondements',
        description: 'Comprendre pourquoi cette stratégie fonctionne depuis 50 ans.',
        duration: '1 semaine',
        topics: [
          'Histoire du portefeuille permanent',
          'Les 4 scénarios économiques',
          'Pourquoi 25% par classe d\'actifs',
          'Performance historique',
        ],
      },
      {
        id: 2,
        title: 'Les 4 classes d\'actifs',
        description: 'Maîtriser chaque composante du portefeuille.',
        duration: '1 semaine',
        topics: [
          'Actions : croissance économique',
          'Obligations long terme : déflation',
          'Or : inflation et crise',
          'Cash : récession et opportunités',
        ],
      },
      {
        id: 3,
        title: 'Mise en place pratique',
        description: 'Construire votre portefeuille pas à pas.',
        duration: '1 semaine',
        topics: [
          'Choix des ETF et supports',
          'Ouverture des comptes (PEA, CTO, AV)',
          'Allocation initiale',
          'Automatisation des versements',
        ],
      },
      {
        id: 4,
        title: 'Gestion et optimisation',
        description: 'Faire vivre votre portefeuille sur le long terme.',
        duration: '1 semaine',
        topics: [
          'Quand et comment rééquilibrer',
          'Optimisation fiscale',
          'Variantes du portefeuille permanent',
          'Erreurs à éviter',
        ],
      },
    ],

    sampleContent: [
      {
        type: 'newsletter',
        title: 'Bilan trimestriel du portefeuille permanent',
        description: 'Analyse des performances et ajustements recommandés.',
      },
      {
        type: 'tuto',
        title: 'Rééquilibrer son portefeuille en 15 minutes',
        description: 'Guide pratique pour maintenir votre allocation.',
      },
      {
        type: 'consultation',
        title: 'Session stratégie long terme',
        description: 'Échanges sur vos allocations et objectifs.',
      },
    ],

    instructor: {
      name: 'Nicolas Delourme',
      role: 'Expert en investissement patrimonial',
      bio: 'Adepte de l\'investissement passif et de la stratégie du portefeuille permanent depuis plus de 10 ans, Nicolas partage son expérience pour vous aider à construire un patrimoine serein.',
      credentials: [
        '20 ans d\'expérience en investissement',
        'Portefeuille permanent personnel depuis 2012',
        'Formateur en gestion de patrimoine',
      ],
    },

    faq: [
      {
        question: 'Le portefeuille permanent est-il adapté aux débutants ?',
        answer: 'Absolument ! C\'est même une des meilleures stratégies pour débuter car elle est simple à comprendre, à mettre en place et à maintenir. Elle ne nécessite pas de suivre les marchés quotidiennement.',
      },
      {
        question: 'Quel capital minimum pour commencer ?',
        answer: 'Vous pouvez commencer avec quelques centaines d\'euros grâce aux ETF. L\'important est la régularité des versements plutôt que le montant initial.',
      },
      {
        question: 'Faut-il rééquilibrer souvent ?',
        answer: 'Non, un rééquilibrage annuel suffit généralement. Certains préfèrent rééquilibrer uniquement quand une classe d\'actifs s\'écarte de plus de 5-10% de son allocation cible.',
      },
    ],
  },

  liberte: {
    id: 'liberte',
    number: '03',
    name: 'Liberté financière',
    subtitle: 'Indépendance & revenus',
    shortDescription: 'Les clés pour atteindre l\'indépendance financière. Revenus passifs, optimisation et stratégies de croissance.',
    color: '#F4BFA6',
    textColor: 'text-slate-900',

    longDescription: `La liberté financière n'est pas réservée aux plus riches. C'est un objectif atteignable avec la bonne méthode, de la discipline et du temps.

Cette formation vous guide pas à pas vers l'indépendance financière : définir vos objectifs, optimiser vos revenus et dépenses, créer des sources de revenus passifs et construire un patrimoine qui travaille pour vous.`,

    highlights: [
      'Définir votre nombre de liberté financière',
      'Optimiser vos revenus et réduire vos dépenses',
      'Créer des sources de revenus passifs',
      'Accélérer la constitution de votre patrimoine',
      'Planifier votre transition vers l\'indépendance',
    ],

    curriculum: [
      {
        id: 1,
        title: 'Définir sa liberté financière',
        description: 'Calculer précisément vos besoins et objectifs.',
        duration: '1 semaine',
        topics: [
          'Le concept de liberté financière',
          'Calculer votre "nombre"',
          'Définir votre timeline',
          'Les différents niveaux de liberté',
        ],
      },
      {
        id: 2,
        title: 'Optimiser sa situation actuelle',
        description: 'Maximiser l\'écart entre revenus et dépenses.',
        duration: '1 semaine',
        topics: [
          'Audit de vos finances personnelles',
          'Réduire les dépenses inutiles',
          'Augmenter vos revenus actifs',
          'Taux d\'épargne optimal',
        ],
      },
      {
        id: 3,
        title: 'Créer des revenus passifs',
        description: 'Construire des sources de revenus qui travaillent pour vous.',
        duration: '1 semaine',
        topics: [
          'Dividendes et intérêts',
          'Immobilier locatif',
          'Business en ligne',
          'Royalties et droits d\'auteur',
        ],
      },
      {
        id: 4,
        title: 'Accélérer et pérenniser',
        description: 'Stratégies avancées pour atteindre vos objectifs plus vite.',
        duration: '1 semaine',
        topics: [
          'Effet de levier intelligent',
          'Optimisation fiscale',
          'Protection du patrimoine',
          'Planifier sa sortie professionnelle',
        ],
      },
    ],

    sampleContent: [
      {
        type: 'newsletter',
        title: 'Calculez votre progression vers la liberté',
        description: 'Outils et méthodes pour suivre votre avancement.',
      },
      {
        type: 'tuto',
        title: 'Créer sa première source de revenu passif',
        description: 'Guide pratique pour générer vos premiers euros passifs.',
      },
      {
        type: 'consultation',
        title: 'Session stratégie patrimoniale',
        description: 'Analyse de votre situation et recommandations personnalisées.',
      },
    ],

    instructor: {
      name: 'Nicolas Delourme',
      role: 'Expert en investissement patrimonial',
      bio: 'Ayant lui-même atteint l\'indépendance financière, Nicolas partage les stratégies concrètes qui lui ont permis de construire un patrimoine générateur de revenus.',
      credentials: [
        'Indépendant financièrement depuis 2018',
        'Multiple sources de revenus passifs',
        'Accompagnement de centaines d\'investisseurs',
      ],
    },

    faq: [
      {
        question: 'Combien de temps faut-il pour atteindre la liberté financière ?',
        answer: 'Cela dépend de votre situation de départ, votre taux d\'épargne et vos objectifs. Avec un taux d\'épargne de 50%, comptez environ 15-17 ans. Avec 25%, plutôt 30-35 ans. La formation vous aide à optimiser ce délai.',
      },
      {
        question: 'Faut-il gagner beaucoup pour devenir libre financièrement ?',
        answer: 'Non ! Ce qui compte c\'est l\'écart entre vos revenus et vos dépenses. Quelqu\'un qui gagne 3000€ et en dépense 1500€ atteindra la liberté plus vite que quelqu\'un qui gagne 10000€ et en dépense 9000€.',
      },
      {
        question: 'Par quoi commencer ?',
        answer: 'Commencez par faire un audit complet de vos finances : revenus, dépenses, patrimoine, dettes. Ensuite, définissez votre objectif chiffré. La formation vous guide dans toutes ces étapes.',
      },
    ],
  },

  bonus: {
    id: 'bonus',
    number: '04',
    name: 'Bonus exclusif',
    subtitle: 'Déblocable avec vos étoiles',
    shortDescription: 'Contenus premium réservés aux membres fidèles. Astuces fiscales avancées et opportunités confidentielles.',
    color: '#1D1D1D',
    textColor: 'text-white',
    isBonus: true,
    starsRequired: 200,

    longDescription: `La formation Bonus est notre espace VIP réservé aux membres les plus fidèles de l'Académie. Accessible uniquement avec vos étoiles, elle contient nos analyses les plus pointues et nos recommandations les plus confidentielles.

Vous y trouverez des stratégies fiscales avancées, des opportunités d'investissement exclusives et un accès privilégié à notre réseau de partenaires de confiance.`,

    highlights: [
      'Stratégies fiscales avancées et légales',
      'Opportunités d\'investissement confidentielles',
      'Accès au réseau de tiers de confiance',
      'Analyses approfondies et exclusives',
      'Contenus réservés aux initiés',
    ],

    curriculum: [
      {
        id: 1,
        title: 'Optimisation fiscale avancée',
        description: 'Les stratégies légales pour réduire votre imposition.',
        duration: 'Continu',
        topics: [
          'Montages patrimoniaux',
          'Holding familiale',
          'Expatriation fiscale',
          'Transmission optimisée',
        ],
      },
      {
        id: 2,
        title: 'Opportunités exclusives',
        description: 'Investissements réservés aux membres Bonus.',
        duration: 'Continu',
        topics: [
          'Private equity accessible',
          'Immobilier off-market',
          'Placements atypiques',
          'Deals négociés',
        ],
      },
      {
        id: 3,
        title: 'Réseau de confiance',
        description: 'Accès à nos partenaires vérifiés.',
        duration: 'Continu',
        topics: [
          'Conseillers en gestion de patrimoine',
          'Notaires spécialisés',
          'Experts-comptables',
          'Courtiers privilégiés',
        ],
      },
      {
        id: 4,
        title: 'Masterclasses exclusives',
        description: 'Sessions approfondies sur des sujets pointus.',
        duration: 'Mensuel',
        topics: [
          'Interviews d\'experts',
          'Études de cas réels',
          'Stratégies de millionnaires',
          'Tendances émergentes',
        ],
      },
    ],

    sampleContent: [
      {
        type: 'newsletter',
        title: 'Opportunité confidentielle du mois',
        description: 'Analyse d\'un investissement exclusif réservé aux membres.',
      },
      {
        type: 'tuto',
        title: 'Créer sa holding familiale',
        description: 'Guide complet pour structurer votre patrimoine.',
      },
      {
        type: 'consultation',
        title: 'Masterclass avec un CGP',
        description: 'Session exclusive avec un conseiller en gestion de patrimoine.',
      },
    ],

    instructor: {
      name: 'Nicolas Delourme',
      role: 'Expert en investissement patrimonial',
      bio: 'Dans cette formation Bonus, Nicolas partage ses stratégies les plus avancées et ouvre les portes de son réseau de professionnels de confiance.',
      credentials: [
        'Réseau de 50+ professionnels vérifiés',
        'Accès à des deals exclusifs',
        'Stratégies éprouvées personnellement',
      ],
    },

    faq: [
      {
        question: 'Comment débloquer la formation Bonus ?',
        answer: 'La formation Bonus se débloque avec 200 étoiles. Vous gagnez des étoiles chaque mois selon votre formule d\'abonnement : 1 étoile (Essentiel), 5 étoiles (Standard) ou 10 étoiles (Premium).',
      },
      {
        question: 'L\'accès est-il permanent une fois débloqué ?',
        answer: 'Oui, une fois débloqué avec vos étoiles, l\'accès à la formation Bonus reste actif tant que vous êtes abonné à au moins une formation de l\'Académie.',
      },
      {
        question: 'Les contenus sont-ils vraiment exclusifs ?',
        answer: 'Absolument. Les contenus Bonus ne sont disponibles nulle part ailleurs. Ils représentent notre expertise la plus pointue et nos recommandations les plus confidentielles.',
      },
    ],
  },
}

/**
 * Récupère une formation par son ID
 */
export function getFormationById(id: string): Formation | undefined {
  return formations[id as ThemeType]
}

/**
 * Liste toutes les formations (hors bonus optionnellement)
 */
export function getAllFormations(includeBonus = true): Formation[] {
  const all = Object.values(formations)
  return includeBonus ? all : all.filter(f => !f.isBonus)
}
