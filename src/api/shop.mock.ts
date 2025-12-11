/**
 * Mock API pour la boutique
 * Utilisé en mode développement (VITE_API_MODE=mock)
 * Structure: { storeId, name, category_array: [{ categoryId, name, item_array }] }
 */

import type { APIRawStoreResponse } from '@/types/shop-api.types'

/**
 * Données mock du catalogue (nouvelle structure avec category_array)
 */
const MOCK_STORE: APIRawStoreResponse = {
  storeId: '28',
  name: 'Boutique Jean de Portal',
  view: null,
  url: null,
  category_array: [
    {
      categoryId: 1,
      name: 'Or & Métaux précieux',
      item_array: [
        {
          itemId: 111,
          name: "Guide de l'Investissement Or 2025",
          subname: "Tout comprendre sur l'or physique et papier",
          description:
            "<p>Le guide complet pour investir dans l'or en 2025. Découvrez les meilleures stratégies, les pièges à éviter et les opportunités à saisir.</p>",
          tag: 'or,investissement,guide',
          seoUrl: 'guide-investissement-or-2025',
          seoTitle: 'Guide Investissement Or 2025',
          seoMetaDescription: "Guide complet pour investir dans l'or",
          image_array: [
            {
              imageId: 1,
              imageType: 'cover',
              name: 'guide-or-cover',
              description: '',
              path: 'images/shop/guide-or-2025.jpg',
            },
          ],
          reference_array: [
            {
              referenceId: 1001,
              name: 'Guide PDF',
              subname: 'Version numérique',
              description: 'Version numérique PDF téléchargeable',
              tag: 'pdf,digital',
              reference: 'GUIDE-OR-2025-PDF',
              price_array: [
                {
                  priceId: 10001,
                  price: 2900, // 29,00€
                  HTPrice: 2417,
                  discountPrice: 0,
                  HTDiscount: 0,
                  vat: 20,
                  currency: 'eur',
                },
              ],
              image_array: [],
            },
            {
              referenceId: 1002,
              name: 'Guide Papier',
              subname: 'Version imprimée',
              description: 'Version imprimée livrée à domicile',
              tag: 'papier,physique',
              reference: 'GUIDE-OR-2025-PAPIER',
              price_array: [
                {
                  priceId: 10002,
                  price: 4900, // 49,00€
                  HTPrice: 4083,
                  discountPrice: 0,
                  HTDiscount: 0,
                  vat: 20,
                  currency: 'eur',
                },
              ],
              image_array: [],
            },
          ],
        },
      ],
    },
    {
      categoryId: 2,
      name: 'Argent métal',
      item_array: [
        {
          itemId: 222,
          name: 'Analyse Argent Métal 2025',
          subname: "Perspectives et opportunités sur le marché de l'argent",
          description:
            "<p>Analyse approfondie du marché de l'argent métal. Tendances, prévisions et stratégies d'investissement pour 2025.</p>",
          tag: 'argent,analyse,metal',
          seoUrl: 'analyse-argent-metal-2025',
          seoTitle: 'Analyse Argent 2025',
          seoMetaDescription: "Analyse du marché de l'argent métal",
          image_array: [
            {
              imageId: 2,
              imageType: 'cover',
              name: 'analyse-argent-cover',
              description: '',
              path: 'images/shop/analyse-argent-2025.jpg',
            },
          ],
          reference_array: [
            {
              referenceId: 2001,
              name: 'Analyse PDF',
              subname: 'Version numérique',
              description: 'Version numérique PDF',
              tag: 'pdf',
              reference: 'ANALYSE-AG-2025-PDF',
              price_array: [
                {
                  priceId: 20001,
                  price: 1900, // 19,00€
                  HTPrice: 1583,
                  discountPrice: 0,
                  HTDiscount: 0,
                  vat: 20,
                  currency: 'eur',
                },
              ],
              image_array: [],
            },
          ],
        },
      ],
    },
    {
      categoryId: 3,
      name: 'Packs & Bundles',
      item_array: [
        {
          itemId: 333,
          name: 'Pack Patrimoine Complet',
          subname: 'Stratégies de diversification patrimoniale',
          description:
            "<p>Le pack complet pour diversifier votre patrimoine. Inclut guides sur l'or, l'argent, l'immobilier et les placements alternatifs.</p>",
          tag: 'patrimoine,pack,diversification',
          seoUrl: 'pack-patrimoine-complet',
          seoTitle: 'Pack Patrimoine Complet',
          seoMetaDescription: 'Pack complet de diversification patrimoniale',
          image_array: [
            {
              imageId: 3,
              imageType: 'cover',
              name: 'pack-patrimoine-cover',
              description: '',
              path: 'images/shop/pack-patrimoine-2025.jpg',
            },
          ],
          reference_array: [
            {
              referenceId: 3001,
              name: 'Pack Digital',
              subname: 'Tous les guides en PDF',
              description: 'Accès à tous les guides en version PDF',
              tag: 'pdf,bundle',
              reference: 'PACK-PATRI-2025-PDF',
              price_array: [
                {
                  priceId: 30001,
                  price: 12900, // Prix barré 129,00€
                  HTPrice: 10750,
                  discountPrice: 9900, // Prix promo 99,00€
                  HTDiscount: 8250,
                  vat: 20,
                  currency: 'eur',
                },
              ],
              image_array: [],
            },
            {
              referenceId: 3002,
              name: 'Pack Papier Premium',
              subname: 'Coffret avec tous les guides',
              description: 'Coffret avec tous les guides imprimés',
              tag: 'papier,premium,bundle',
              reference: 'PACK-PATRI-2025-PAPIER',
              price_array: [
                {
                  priceId: 30002,
                  price: 19900, // 199,00€
                  HTPrice: 16583,
                  discountPrice: 0,
                  HTDiscount: 0,
                  vat: 20,
                  currency: 'eur',
                },
              ],
              image_array: [],
            },
          ],
        },
      ],
    },
    {
      categoryId: 4,
      name: 'Immobilier',
      item_array: [
        {
          itemId: 444,
          name: 'Guide Immobilier Locatif',
          subname: "Investir dans l'immobilier en 2025",
          description:
            '<p>Le guide pratique pour réussir votre investissement immobilier locatif. Fiscalité, financement, gestion locative.</p>',
          tag: 'immobilier,locatif,investissement',
          seoUrl: 'guide-immobilier-locatif',
          seoTitle: 'Guide Immobilier Locatif',
          seoMetaDescription: 'Guide investissement immobilier locatif',
          image_array: [
            {
              imageId: 4,
              imageType: 'cover',
              name: 'guide-immo-cover',
              description: '',
              path: 'images/shop/guide-immo-2025.jpg',
            },
          ],
          reference_array: [
            {
              referenceId: 4001,
              name: 'Guide PDF',
              subname: 'Version numérique',
              description: 'Version numérique PDF',
              tag: 'pdf',
              reference: 'GUIDE-IMMO-2025-PDF',
              price_array: [
                {
                  priceId: 40001,
                  price: 3900, // 39,00€
                  HTPrice: 3250,
                  discountPrice: 0,
                  HTDiscount: 0,
                  vat: 20,
                  currency: 'eur',
                },
              ],
              image_array: [],
            },
          ],
        },
      ],
    },
  ],
}

/**
 * Simule un délai réseau
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock API pour récupérer le catalogue
 * Retourne la structure complète avec category_array
 */
export async function mockFetchCatalogAPI(): Promise<APIRawStoreResponse> {
  console.log('[MOCK] Chargement du catalogue boutique...')

  // Simuler un délai réseau
  await delay(500)

  const itemCount = MOCK_STORE.category_array.reduce(
    (acc, cat) => acc + cat.item_array.length,
    0
  )
  console.log(
    `[MOCK] Catalogue chargé: ${MOCK_STORE.category_array.length} catégories, ${itemCount} produits`
  )

  return MOCK_STORE
}
