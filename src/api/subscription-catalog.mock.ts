/**
 * Mock API pour le catalogue d'abonnements (OneClick)
 * Utilise en mode developpement (VITE_API_MODE=mock)
 */

import type { APIRawOneClickCatalogResponse } from '@/types/subscription-catalog-api.types'

/**
 * Donnees mock du catalogue d'abonnements
 * Structure: 4 themes x 3 tiers = 12 produits
 */
const MOCK_CATALOG: APIRawOneClickCatalogResponse = {
  status: 'success',
  oneClick_array: [
    // ============================================================================
    // Metaux precieux
    // ============================================================================
    {
      id: 101,
      name: 'Metaux precieux - Essentiel',
      description: 'abonnement essentiel',
      technicalTag: 'metauxprecieux',
      plan_array: [
        {
          id: 1011,
          oneClickId: 10110,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 10111, price: 990, regularInterval: 'P1M' },
            { id: 10112, price: 9900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
    {
      id: 102,
      name: 'Metaux precieux - Standard',
      description: 'abonnement standard',
      technicalTag: 'metauxprecieux',
      plan_array: [
        {
          id: 1021,
          oneClickId: 10210,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 10211, price: 1490, regularInterval: 'P1M' },
            { id: 10212, price: 14900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
    {
      id: 103,
      name: 'Metaux precieux - Premium',
      description: 'abonnement premium',
      technicalTag: 'metauxprecieux',
      plan_array: [
        {
          id: 1031,
          oneClickId: 10310,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 10311, price: 1990, regularInterval: 'P1M' },
            { id: 10312, price: 19900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },

    // ============================================================================
    // Portefeuille permanent
    // ============================================================================
    {
      id: 201,
      name: 'Portefeuille permanent - Essentiel',
      description: 'abonnement essentiel',
      technicalTag: 'portefeuillepermanent',
      plan_array: [
        {
          id: 2011,
          oneClickId: 20110,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 20111, price: 990, regularInterval: 'P1M' },
            { id: 20112, price: 9900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
    {
      id: 202,
      name: 'Portefeuille permanent - Standard',
      description: 'abonnement standard',
      technicalTag: 'portefeuillepermanent',
      plan_array: [
        {
          id: 2021,
          oneClickId: 20210,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 20211, price: 1490, regularInterval: 'P1M' },
            { id: 20212, price: 14900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
    {
      id: 203,
      name: 'Portefeuille permanent - Premium',
      description: 'abonnement premium',
      technicalTag: 'portefeuillepermanent',
      plan_array: [
        {
          id: 2031,
          oneClickId: 20310,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 20311, price: 1990, regularInterval: 'P1M' },
            { id: 20312, price: 19900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },

    // ============================================================================
    // Liberte financiere
    // ============================================================================
    {
      id: 301,
      name: 'Liberte financiere - Essentiel',
      description: 'abonnement essentiel',
      technicalTag: 'libertefinanciere',
      plan_array: [
        {
          id: 3011,
          oneClickId: 30110,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 30111, price: 990, regularInterval: 'P1M' },
            { id: 30112, price: 9900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
    {
      id: 302,
      name: 'Liberte financiere - Standard',
      description: 'abonnement standard',
      technicalTag: 'libertefinanciere',
      plan_array: [
        {
          id: 3021,
          oneClickId: 30210,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 30211, price: 1490, regularInterval: 'P1M' },
            { id: 30212, price: 14900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
    {
      id: 303,
      name: 'Liberte financiere - Premium',
      description: 'abonnement premium',
      technicalTag: 'libertefinanciere',
      plan_array: [
        {
          id: 3031,
          oneClickId: 30310,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 30311, price: 1990, regularInterval: 'P1M' },
            { id: 30312, price: 19900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },

    // ============================================================================
    // Bonus
    // ============================================================================
    {
      id: 401,
      name: 'Bonus exclusif - Essentiel',
      description: 'abonnement essentiel',
      technicalTag: 'bonus',
      plan_array: [
        {
          id: 4011,
          oneClickId: 40110,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 40111, price: 990, regularInterval: 'P1M' },
            { id: 40112, price: 9900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
    {
      id: 402,
      name: 'Bonus exclusif - Standard',
      description: 'abonnement standard',
      technicalTag: 'bonus',
      plan_array: [
        {
          id: 4021,
          oneClickId: 40210,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 40211, price: 1490, regularInterval: 'P1M' },
            { id: 40212, price: 14900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
    {
      id: 403,
      name: 'Bonus exclusif - Premium',
      description: 'abonnement premium',
      technicalTag: 'bonus',
      plan_array: [
        {
          id: 4031,
          oneClickId: 40310,
          regularInterval: 'P1M',
          trialDays: 6,
          billingScheme_array: [
            { id: 40311, price: 1990, regularInterval: 'P1M' },
            { id: 40312, price: 19900, regularInterval: 'P1Y' },
          ],
        },
      ],
    },
  ],
}

/**
 * Simule un delai reseau
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock API pour recuperer le catalogue d'abonnements
 */
export async function mockFetchOneClickCatalogAPI(): Promise<APIRawOneClickCatalogResponse> {
  console.log('[MOCK] Chargement du catalogue abonnements...')

  // Simuler un delai reseau
  await delay(300)

  console.log(
    `[MOCK] Catalogue abonnements charge: ${MOCK_CATALOG.oneClick_array.length} produits`
  )

  return MOCK_CATALOG
}
