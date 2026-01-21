/**
 * Mock API pour le panier OneClick (abonnements)
 * Utilise en mode developpement (VITE_API_MODE=mock)
 */

import type {
  APIOneClickBasketResponse,
  APIAddOneClickResponse,
  APIDeleteOneClickResponse,
  APIOneClickCheckoutResponse,
  APIOneClickInitPaymentResponse,
  APIOneClickPlan,
} from '@/types/oneclick-basket.types'

// ============================================================================
// Donnees mock
// ============================================================================

/**
 * Simule le stockage du panier OneClick en memoire
 * Un seul plan a la fois dans le panier OneClick
 */
let mockOneClickBasket: {
  basketCode: string
  plan_array: APIOneClickPlan[]
} | null = null

/**
 * Plans mock disponibles (similaires au catalogue)
 */
const MOCK_PLANS: Record<number, APIOneClickPlan> = {
  // Metaux precieux - Mensuel
  1011: {
    planId: 1011,
    name: 'Metaux precieux - Essentiel',
    description: 'Acces aux tutos mensuels sur les metaux precieux',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 10110,
      name: 'Metaux precieux',
      description: 'Formation sur les metaux precieux',
      technicalTag: 'metauxprecieux',
    },
    oneClickBillingScheme: [{ billingSchemeId: 10111, price: 990 }],
  },
  1021: {
    planId: 1021,
    name: 'Metaux precieux - Standard',
    description: 'Acces aux tutos et consultations privees',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 10210,
      name: 'Metaux precieux',
      description: 'Formation sur les metaux precieux',
      technicalTag: 'metauxprecieux',
    },
    oneClickBillingScheme: [{ billingSchemeId: 10211, price: 1490 }],
  },
  1031: {
    planId: 1031,
    name: 'Metaux precieux - Premium',
    description: 'Acces complet : tutos, consultations, lettres mensuelles',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 10310,
      name: 'Metaux precieux',
      description: 'Formation sur les metaux precieux',
      technicalTag: 'metauxprecieux',
    },
    oneClickBillingScheme: [{ billingSchemeId: 10311, price: 1990 }],
  },
  // Metaux precieux - Annuel
  10112: {
    planId: 10112,
    name: 'Metaux precieux - Essentiel (Annuel)',
    description: 'Acces aux tutos mensuels - Abonnement annuel',
    trialdays: 6,
    regularInterval: 'P1Y',
    currency: 'EUR',
    oneClick: {
      oneClickId: 10110,
      name: 'Metaux precieux',
      description: 'Formation sur les metaux precieux',
      technicalTag: 'metauxprecieux',
    },
    oneClickBillingScheme: [{ billingSchemeId: 10112, price: 9900 }],
  },
  // Portefeuille permanent - Mensuel
  2011: {
    planId: 2011,
    name: 'Portefeuille permanent - Essentiel',
    description: 'Acces aux tutos mensuels sur le portefeuille permanent',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 20110,
      name: 'Portefeuille permanent',
      description: 'Formation sur le portefeuille permanent',
      technicalTag: 'portefeuillepermanent',
    },
    oneClickBillingScheme: [{ billingSchemeId: 20111, price: 990 }],
  },
  2021: {
    planId: 2021,
    name: 'Portefeuille permanent - Standard',
    description: 'Acces aux tutos et consultations privees',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 20210,
      name: 'Portefeuille permanent',
      description: 'Formation sur le portefeuille permanent',
      technicalTag: 'portefeuillepermanent',
    },
    oneClickBillingScheme: [{ billingSchemeId: 20211, price: 1490 }],
  },
  2031: {
    planId: 2031,
    name: 'Portefeuille permanent - Premium',
    description: 'Acces complet : tutos, consultations, lettres mensuelles',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 20310,
      name: 'Portefeuille permanent',
      description: 'Formation sur le portefeuille permanent',
      technicalTag: 'portefeuillepermanent',
    },
    oneClickBillingScheme: [{ billingSchemeId: 20311, price: 1990 }],
  },
  // Liberte financiere - Mensuel
  3011: {
    planId: 3011,
    name: 'Liberte financiere - Essentiel',
    description: 'Acces aux tutos mensuels sur la liberte financiere',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 30110,
      name: 'Liberte financiere',
      description: 'Formation sur la liberte financiere',
      technicalTag: 'libertefinanciere',
    },
    oneClickBillingScheme: [{ billingSchemeId: 30111, price: 990 }],
  },
  3021: {
    planId: 3021,
    name: 'Liberte financiere - Standard',
    description: 'Acces aux tutos et consultations privees',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 30210,
      name: 'Liberte financiere',
      description: 'Formation sur la liberte financiere',
      technicalTag: 'libertefinanciere',
    },
    oneClickBillingScheme: [{ billingSchemeId: 30211, price: 1490 }],
  },
  3031: {
    planId: 3031,
    name: 'Liberte financiere - Premium',
    description: 'Acces complet : tutos, consultations, lettres mensuelles',
    trialdays: 6,
    regularInterval: 'P1M',
    currency: 'EUR',
    oneClick: {
      oneClickId: 30310,
      name: 'Liberte financiere',
      description: 'Formation sur la liberte financiere',
      technicalTag: 'libertefinanciere',
    },
    oneClickBillingScheme: [{ billingSchemeId: 30311, price: 1990 }],
  },
}

/**
 * Genere un basketCode unique
 */
function generateBasketCode(): string {
  return 'oc_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

/**
 * Simule un delai reseau
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ============================================================================
// Mock API Functions
// ============================================================================

/**
 * Mock: Recupere le panier OneClick
 * POST /fetchOneClickBasket
 */
export async function mockFetchOneClickBasket(
  basketCode: string
): Promise<APIOneClickBasketResponse> {
  console.log('[MOCK] fetchOneClickBasket:', basketCode)
  await delay(200)

  // Si le basketCode ne correspond pas, retourner une erreur
  if (!mockOneClickBasket || mockOneClickBasket.basketCode !== basketCode) {
    console.log('[MOCK] Panier OneClick non trouve')
    return {
      status: 'error',
      basket: { basketCode: '', plan_array: [] },
      message: 'Panier non trouve',
    }
  }

  console.log('[MOCK] Panier OneClick trouve:', mockOneClickBasket.plan_array.length, 'plan(s)')
  return {
    status: 'success',
    basket: mockOneClickBasket,
  }
}

/**
 * Mock: Ajoute un plan au panier OneClick
 * POST /addOneClick
 */
export async function mockAddOneClick(
  planId: number,
  _storeId: number,
  existingBasketCode?: string | null
): Promise<APIAddOneClickResponse> {
  console.log('[MOCK] addOneClick:', { planId, existingBasketCode })
  await delay(300)

  // Verifier que le plan existe
  const plan = MOCK_PLANS[planId]
  if (!plan) {
    console.log('[MOCK] Plan non trouve:', planId)
    return {
      status: 'error',
      basket: { basketCode: '', plan_array: [] },
      message: 'Plan non trouve',
    }
  }

  // Creer ou reutiliser le panier
  const basketCode = existingBasketCode || generateBasketCode()

  // Le panier OneClick ne contient qu'un seul plan a la fois
  mockOneClickBasket = {
    basketCode,
    plan_array: [plan],
  }

  console.log('[MOCK] Plan ajoute au panier OneClick:', plan.name)
  return {
    status: 'success',
    basket: mockOneClickBasket,
  }
}

/**
 * Mock: Supprime un plan du panier OneClick
 * POST /deleteOneClick
 */
export async function mockDeleteOneClick(
  planId: number,
  basketCode: string
): Promise<APIDeleteOneClickResponse> {
  console.log('[MOCK] deleteOneClick:', { planId, basketCode })
  await delay(200)

  // Verifier que le panier existe
  if (!mockOneClickBasket || mockOneClickBasket.basketCode !== basketCode) {
    return {
      status: 'error',
      basket: { basketCode: '', plan_array: [] },
      message: 'Panier non trouve',
    }
  }

  // Supprimer le plan
  mockOneClickBasket.plan_array = mockOneClickBasket.plan_array.filter(
    (p) => p.planId !== planId
  )

  console.log('[MOCK] Plan supprime du panier OneClick')
  return {
    status: 'success',
    basket: mockOneClickBasket,
  }
}

/**
 * Mock: Initialise le checkout OneClick (verification auth)
 * POST /oneClickCheckout
 */
export async function mockOneClickCheckout(
  _basketCode: string
): Promise<APIOneClickCheckoutResponse> {
  console.log('[MOCK] oneClickCheckout')
  await delay(200)

  // Simuler la verification d'authentification
  // En mode mock, on suppose que l'utilisateur est connecte

  return {
    status: 'success',
    stripePublicKey: 'pk_test_mock_stripe_public_key',
  }
}

/**
 * Mock: Initialise le paiement OneClick (SetupIntent)
 * POST /oneClickInitPayment
 */
export async function mockOneClickInitPayment(
  basketCode: string,
  _addressId: number,
  _billAddressId: number
): Promise<APIOneClickInitPaymentResponse> {
  console.log('[MOCK] oneClickInitPayment:', basketCode)
  await delay(400)

  // Verifier que le panier existe et a un plan
  if (
    !mockOneClickBasket ||
    mockOneClickBasket.basketCode !== basketCode ||
    mockOneClickBasket.plan_array.length === 0
  ) {
    return {
      status: 'error',
      message: 'Panier vide ou non trouve',
    }
  }

  // Generer un mock SetupIntent client_secret
  const mockSetupIntentSecret = `seti_mock_${Date.now()}_secret_${Math.random()
    .toString(36)
    .substring(2, 15)}`

  console.log('[MOCK] SetupIntent cree:', mockSetupIntentSecret.substring(0, 20) + '...')

  return {
    status: 'success',
    stripePublicKey: 'pk_test_mock_stripe_public_key',
    client_secret: mockSetupIntentSecret,
  }
}

/**
 * Reinitialise le panier mock (utile pour les tests)
 */
export function resetMockOneClickBasket(): void {
  mockOneClickBasket = null
  console.log('[MOCK] Panier OneClick reinitialise')
}

/**
 * Retourne l'etat actuel du panier mock (pour debug)
 */
export function getMockOneClickBasketState() {
  return mockOneClickBasket
}
