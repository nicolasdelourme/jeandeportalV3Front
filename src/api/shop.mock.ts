/**
 * Mock API pour la boutique
 * Utilisé en mode développement (VITE_API_MODE=mock)
 */

import type { APIRawResponse, APIRawItem } from '@/types/shop-api.types'

/**
 * Données mock du catalogue
 */
const MOCK_ITEMS: APIRawItem[] = [
  {
    id: '1',
    name: 'Guide de l\'Investissement Or 2025',
    subname: 'Tout comprendre sur l\'or physique et papier',
    description: '<p>Le guide complet pour investir dans l\'or en 2025. Découvrez les meilleures stratégies, les pièges à éviter et les opportunités à saisir.</p>',
    tag: 'or,investissement,guide',
    seoUrl: 'guide-investissement-or-2025',
    seoTitle: 'Guide Investissement Or 2025',
    seoMetaDescription: 'Guide complet pour investir dans l\'or',
    view: null,
    available: '1',
    visible: '1',
    actived: '1',
    priorityDeprecated: '0',
    timestamp: '2025-01-15T10:00:00Z',
    storeId: '1',
    itemId: '1',
    priority: '10',
    saleStart: '',
    saleStop: '',
    featurePerEntity_array: [],
    reference_array: [
      {
        id: 'ref-1',
        itemId: '1',
        collectionId: 'or',
        name: 'Guide Or 2025',
        subname: '',
        reference: 'GUIDE-OR-2025',
        description: '',
        tag: '',
        overstock: '100',
        available: '1',
        visible: '1',
        actived: '1',
        salestart: '',
        salestop: '',
        timestamp: '2025-01-15T10:00:00Z',
        product_array: [
          {
            id: 'prod-1',
            referenceId: 'ref-1',
            productId: '1',
            productQuantity: '1',
            timestamp: '2025-01-15T10:00:00Z',
            fileId: null,
            type: null,
            name: 'Guide PDF',
            description: 'Version numérique PDF',
            buyPrice: '0',
            overstock: '999',
            weight: '0',
            width: '0',
            height: '0',
            depth: '0',
            physical: '0',
            immaterial: '1',
            actived: '1',
            image_array: [],
            feature_array: []
          },
          {
            id: 'prod-2',
            referenceId: 'ref-1',
            productId: '2',
            productQuantity: '1',
            timestamp: '2025-01-15T10:00:00Z',
            fileId: null,
            type: null,
            name: 'Guide Papier',
            description: 'Version imprimée',
            buyPrice: '0',
            overstock: '50',
            weight: '350',
            width: '21',
            height: '29',
            depth: '1',
            physical: '1',
            immaterial: '0',
            actived: '1',
            image_array: [],
            feature_array: []
          }
        ],
        price_array: [
          {
            id: 'price-1',
            referenceId: 'ref-1',
            storeId: '1',
            currency: 'EUR',
            price: '2900',
            HTPrice: '2417',
            promo: '0',
            discountPrice: '0',
            HTDiscount: '0',
            vat: '20',
            active: '1',
            timestamp: '2025-01-15T10:00:00Z'
          }
        ],
        image_array: [],
        stock: 100
      }
    ],
    feature_array: [],
    image_array: [
      {
        id: 'img-1',
        imageTypeId: '1',
        name: 'guide-or-cover',
        description: '',
        width: '800',
        height: '1200',
        size: '150000',
        tag: '',
        path: 'images/shop/guide-or-2025.jpg',
        timestamp: '2025-01-15T10:00:00Z'
      }
    ],
    tag_array: ['or', 'investissement', 'guide'],
    wishListActived: 0
  },
  {
    id: '2',
    name: 'Analyse Argent Métal 2025',
    subname: 'Perspectives et opportunités sur le marché de l\'argent',
    description: '<p>Analyse approfondie du marché de l\'argent métal. Tendances, prévisions et stratégies d\'investissement pour 2025.</p>',
    tag: 'argent,analyse,metal',
    seoUrl: 'analyse-argent-metal-2025',
    seoTitle: 'Analyse Argent 2025',
    seoMetaDescription: 'Analyse du marché de l\'argent métal',
    view: null,
    available: '1',
    visible: '1',
    actived: '1',
    priorityDeprecated: '0',
    timestamp: '2025-01-10T10:00:00Z',
    storeId: '1',
    itemId: '2',
    priority: '20',
    saleStart: '',
    saleStop: '',
    featurePerEntity_array: [],
    reference_array: [
      {
        id: 'ref-2',
        itemId: '2',
        collectionId: 'argent',
        name: 'Analyse Argent 2025',
        subname: '',
        reference: 'ANALYSE-AG-2025',
        description: '',
        tag: '',
        overstock: '80',
        available: '1',
        visible: '1',
        actived: '1',
        salestart: '',
        salestop: '',
        timestamp: '2025-01-10T10:00:00Z',
        product_array: [
          {
            id: 'prod-3',
            referenceId: 'ref-2',
            productId: '3',
            productQuantity: '1',
            timestamp: '2025-01-10T10:00:00Z',
            fileId: null,
            type: null,
            name: 'Analyse PDF',
            description: 'Version numérique PDF',
            buyPrice: '0',
            overstock: '999',
            weight: '0',
            width: '0',
            height: '0',
            depth: '0',
            physical: '0',
            immaterial: '1',
            actived: '1',
            image_array: [],
            feature_array: []
          }
        ],
        price_array: [
          {
            id: 'price-2',
            referenceId: 'ref-2',
            storeId: '1',
            currency: 'EUR',
            price: '1900',
            HTPrice: '1583',
            promo: '0',
            discountPrice: '0',
            HTDiscount: '0',
            vat: '20',
            active: '1',
            timestamp: '2025-01-10T10:00:00Z'
          }
        ],
        image_array: [],
        stock: 80
      }
    ],
    feature_array: [],
    image_array: [
      {
        id: 'img-2',
        imageTypeId: '1',
        name: 'analyse-argent-cover',
        description: '',
        width: '800',
        height: '1200',
        size: '140000',
        tag: '',
        path: 'images/shop/analyse-argent-2025.jpg',
        timestamp: '2025-01-10T10:00:00Z'
      }
    ],
    tag_array: ['argent', 'analyse', 'metal'],
    wishListActived: 0
  },
  {
    id: '3',
    name: 'Pack Patrimoine Complet',
    subname: 'Stratégies de diversification patrimoniale',
    description: '<p>Le pack complet pour diversifier votre patrimoine. Inclut guides sur l\'or, l\'argent, l\'immobilier et les placements alternatifs.</p>',
    tag: 'patrimoine,pack,diversification',
    seoUrl: 'pack-patrimoine-complet',
    seoTitle: 'Pack Patrimoine Complet',
    seoMetaDescription: 'Pack complet de diversification patrimoniale',
    view: null,
    available: '1',
    visible: '1',
    actived: '1',
    priorityDeprecated: '0',
    timestamp: '2025-01-20T10:00:00Z',
    storeId: '1',
    itemId: '3',
    priority: '5',
    saleStart: '',
    saleStop: '',
    featurePerEntity_array: [],
    reference_array: [
      {
        id: 'ref-3',
        itemId: '3',
        collectionId: 'patrimoine',
        name: 'Pack Patrimoine',
        subname: '',
        reference: 'PACK-PATRI-2025',
        description: '',
        tag: '',
        overstock: '30',
        available: '1',
        visible: '1',
        actived: '1',
        salestart: '',
        salestop: '',
        timestamp: '2025-01-20T10:00:00Z',
        product_array: [
          {
            id: 'prod-4',
            referenceId: 'ref-3',
            productId: '4',
            productQuantity: '1',
            timestamp: '2025-01-20T10:00:00Z',
            fileId: null,
            type: null,
            name: 'Pack Digital',
            description: 'Tous les guides en PDF',
            buyPrice: '0',
            overstock: '999',
            weight: '0',
            width: '0',
            height: '0',
            depth: '0',
            physical: '0',
            immaterial: '1',
            actived: '1',
            image_array: [],
            feature_array: []
          },
          {
            id: 'prod-5',
            referenceId: 'ref-3',
            productId: '5',
            productQuantity: '1',
            timestamp: '2025-01-20T10:00:00Z',
            fileId: null,
            type: null,
            name: 'Pack Papier Premium',
            description: 'Coffret avec tous les guides imprimés',
            buyPrice: '0',
            overstock: '20',
            weight: '1500',
            width: '25',
            height: '32',
            depth: '5',
            physical: '1',
            immaterial: '0',
            actived: '1',
            image_array: [],
            feature_array: []
          }
        ],
        price_array: [
          {
            id: 'price-3',
            referenceId: 'ref-3',
            storeId: '1',
            currency: 'EUR',
            price: '9900',
            HTPrice: '8250',
            promo: '1',
            discountPrice: '12900',
            HTDiscount: '10750',
            vat: '20',
            active: '1',
            timestamp: '2025-01-20T10:00:00Z'
          }
        ],
        image_array: [],
        stock: 30
      }
    ],
    feature_array: [],
    image_array: [
      {
        id: 'img-3',
        imageTypeId: '1',
        name: 'pack-patrimoine-cover',
        description: '',
        width: '800',
        height: '1200',
        size: '180000',
        tag: '',
        path: 'images/shop/pack-patrimoine-2025.jpg',
        timestamp: '2025-01-20T10:00:00Z'
      }
    ],
    tag_array: ['patrimoine', 'pack', 'diversification'],
    wishListActived: 0
  },
  {
    id: '4',
    name: 'Guide Immobilier Locatif',
    subname: 'Investir dans l\'immobilier en 2025',
    description: '<p>Le guide pratique pour réussir votre investissement immobilier locatif. Fiscalité, financement, gestion locative.</p>',
    tag: 'immobilier,locatif,investissement',
    seoUrl: 'guide-immobilier-locatif',
    seoTitle: 'Guide Immobilier Locatif',
    seoMetaDescription: 'Guide investissement immobilier locatif',
    view: null,
    available: '1',
    visible: '1',
    actived: '1',
    priorityDeprecated: '0',
    timestamp: '2025-01-18T10:00:00Z',
    storeId: '1',
    itemId: '4',
    priority: '15',
    saleStart: '',
    saleStop: '',
    featurePerEntity_array: [],
    reference_array: [
      {
        id: 'ref-4',
        itemId: '4',
        collectionId: 'immobilier',
        name: 'Guide Immo Locatif',
        subname: '',
        reference: 'GUIDE-IMMO-2025',
        description: '',
        tag: '',
        overstock: '60',
        available: '1',
        visible: '1',
        actived: '1',
        salestart: '',
        salestop: '',
        timestamp: '2025-01-18T10:00:00Z',
        product_array: [
          {
            id: 'prod-6',
            referenceId: 'ref-4',
            productId: '6',
            productQuantity: '1',
            timestamp: '2025-01-18T10:00:00Z',
            fileId: null,
            type: null,
            name: 'Guide PDF',
            description: 'Version numérique',
            buyPrice: '0',
            overstock: '999',
            weight: '0',
            width: '0',
            height: '0',
            depth: '0',
            physical: '0',
            immaterial: '1',
            actived: '1',
            image_array: [],
            feature_array: []
          }
        ],
        price_array: [
          {
            id: 'price-4',
            referenceId: 'ref-4',
            storeId: '1',
            currency: 'EUR',
            price: '3900',
            HTPrice: '3250',
            promo: '0',
            discountPrice: '0',
            HTDiscount: '0',
            vat: '20',
            active: '1',
            timestamp: '2025-01-18T10:00:00Z'
          }
        ],
        image_array: [],
        stock: 60
      }
    ],
    feature_array: [],
    image_array: [
      {
        id: 'img-4',
        imageTypeId: '1',
        name: 'guide-immo-cover',
        description: '',
        width: '800',
        height: '1200',
        size: '160000',
        tag: '',
        path: 'images/shop/guide-immo-2025.jpg',
        timestamp: '2025-01-18T10:00:00Z'
      }
    ],
    tag_array: ['immobilier', 'locatif', 'investissement'],
    wishListActived: 0
  }
]

/**
 * Réponse mock complète du store
 */
const MOCK_STORE_RESPONSE: APIRawResponse = {
  id: '1',
  projectId: '1',
  name: 'Boutique Jean de Portal',
  start: '2024-01-01',
  stop: '2030-12-31',
  firstShipping: '0',
  deferredShipping: '0',
  numberPayment: '1',
  firstPayment: '0',
  deferredPayment: '0',
  meanPayment: 'card',
  view: 'grid',
  url: 'https://jeandeportal.fr/boutique',
  defaultStore: '1',
  wishListActived: '0',
  timestamp: '2025-01-01T00:00:00Z',
  item_array: MOCK_ITEMS
}

/**
 * Simule un délai réseau
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock API pour récupérer le catalogue
 */
export async function mockFetchCatalogAPI(): Promise<APIRawResponse> {
  console.log('🔧 [MOCK] Chargement du catalogue boutique...')

  // Simuler un délai réseau
  await delay(500)

  console.log(`✅ [MOCK] Catalogue chargé: ${MOCK_ITEMS.length} produits`)

  return MOCK_STORE_RESPONSE
}
