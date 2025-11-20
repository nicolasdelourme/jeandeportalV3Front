/**
 * Types pour l'API Shop/Boutique
 * Structure du catalogue produits
 */

/**
 * Prix d'un produit avec ses variantes
 */
export interface ShopPrice {
  id: string
  amount: number // Prix en euros
  currency: string // 'EUR'
  label?: string // Ex: "PDF", "Papier", "Bundle"
  isPromo?: boolean
  originalAmount?: number // Prix barré si promo
}

/**
 * Produit avec ses variantes et prix
 */
export interface ShopProduct {
  id: string
  name: string
  description: string
  images: string[] // URLs des images
  prices: ShopPrice[]
}

/**
 * Référence produit principale (correspond à une collection/série)
 */
export interface ShopReference {
  id: string
  name: string // Peut contenir du HTML (ex: &nbsp;)
  subname: string // Sous-titre/description courte en HTML pour la vente
  description: string // Description complète en HTML
  technicalReference: string // SKU ou référence interne
  images: string[] // Images de la référence
  products: ShopProduct[] // Produits/variantes de cette référence
  collectionId: string // ID de la collection (ex: "or", "argent", "patrimoine")
  tags: string[] // Tags/thèmes (ex: ["métaux", "investissement"])
}

/**
 * Réponse API du catalogue
 */
export interface ShopCatalogResponse {
  references: ShopReference[]
}

/**
 * Erreur API Shop
 */
export class ShopAPIError extends Error {
  public statusCode?: number
  public originalError?: Error

  constructor(
    message: string,
    statusCode?: number,
    originalError?: Error
  ) {
    super(message)
    this.name = 'ShopAPIError'
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

/**
 * Options de tri pour le catalogue
 */
export type ShopSortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest' | 'oldest'

/**
 * Filtre de collection
 */
export type ShopCollectionFilter = string // collectionId

/**
 * Filtre de tag/thème
 */
export type ShopTagFilter = string // tag name

/**
 * Helper: Obtenir l'URL complète d'une image
 */
export function getShopImageUrl(relativePath: string): string {
  if (!relativePath) return ''
  if (relativePath.startsWith('http')) return relativePath
  return `https://jeandeportal.fr/${relativePath}`
}

/**
 * Helper: Obtenir le prix minimum d'un produit
 */
export function getMinPrice(product: ShopProduct): number {
  if (product.prices.length === 0) return 0
  return Math.min(...product.prices.map((p) => p.amount))
}

/**
 * Helper: Obtenir le prix maximum d'un produit
 */
export function getMaxPrice(product: ShopProduct): number {
  if (product.prices.length === 0) return 0
  return Math.max(...product.prices.map((p) => p.amount))
}

/**
 * Helper: Formater un prix
 */
export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Helper: Obtenir tous les tags uniques du catalogue
 */
export function getAllTags(references: ShopReference[]): string[] {
  const tagsSet = new Set<string>()
  references.forEach((ref) => {
    ref.tags.forEach((tag) => tagsSet.add(tag))
  })
  return Array.from(tagsSet).sort()
}

/**
 * Helper: Obtenir toutes les collections uniques du catalogue
 */
export function getAllCollections(references: ShopReference[]): string[] {
  const collectionsSet = new Set<string>()
  references.forEach((ref) => {
    collectionsSet.add(ref.collectionId)
  })
  return Array.from(collectionsSet).sort()
}

// ============================================================================
// Types API bruts (structure réelle renvoyée par le backend)
// ============================================================================

/**
 * Produit dans la structure API brute
 */
export interface APIRawProduct {
  id: string
  referenceId: string
  productId: string
  productQuantity: string
  timestamp: string
  fileId: string
  type: string | null
  name: string
  description: string
  buyPrice: string
  overstock: string
  weight: string
  width: string
  height: string
  depth: string
  physical: string
  immaterial: string
  actived: string
  image_array: any[]
}

/**
 * Prix dans la structure API brute
 */
export interface APIRawPrice {
  id: string
  referenceId: string
  storeId: string
  currency: string
  price: string // Prix TTC en centimes (ex: "1900" = 19.00€)
  HTPrice: string
  promo: string
  discountPrice: string
  HTDiscount: string
  vat: string
  active: string
  timestamp: string
}

/**
 * Référence dans la structure API brute
 */
export interface APIRawReference {
  id: string
  itemId: string
  collectionId: string | null
  name: string
  subname: string
  reference: string
  description: string
  tag: string // Tags séparés par des virgules
  overstock: string
  available: string
  visible: string
  actived: string
  salestart: string
  salestop: string
  timestamp: string
  product_array: APIRawProduct[]
  price_array: APIRawPrice[]
  image_array: any[]
  stock: number
}

/**
 * Réponse brute de l'API (tableau de tableaux)
 */
export type APIRawResponse = APIRawReference[][]

/**
 * Mapper une référence API brute vers notre modèle normalisé
 */
export function mapAPIReferenceToShopReference(apiRef: APIRawReference): ShopReference {
  // Parser les tags
  const tags = apiRef.tag
    ? apiRef.tag.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
    : []

  // Vérifier que product_array et price_array existent et sont des tableaux
  const productArray = Array.isArray(apiRef.product_array) ? apiRef.product_array : []
  const priceArray = Array.isArray(apiRef.price_array) ? apiRef.price_array : []

  // Mapper les produits
  const products: ShopProduct[] = productArray.map((apiProduct) => {
    // Trouver les prix associés à ce produit
    const productPrices = priceArray
      .filter((p) => p && p.referenceId === apiRef.id)
      .map((apiPrice) => ({
        id: apiPrice.id || '',
        amount: parseFloat(apiPrice.price || '0') / 100, // Convertir centimes en euros
        currency: (apiPrice.currency || 'EUR').toUpperCase(),
        label: undefined, // Pas de label dans l'API
        isPromo: apiPrice.promo === '1',
        originalAmount:
          apiPrice.promo === '1' ? parseFloat(apiPrice.discountPrice || '0') / 100 : undefined,
      }))

    return {
      id: apiProduct.id || '',
      name: apiProduct.name || '',
      description: apiProduct.description || '',
      images: [], // Pas d'images dans l'API actuelle
      prices: productPrices,
    }
  })

  const mapped = {
    id: apiRef.id,
    name: apiRef.name || '', // Contient du HTML (ex: &nbsp;)
    subname: apiRef.subname || '', // HTML - description courte pour la vente
    description: apiRef.description || '', // HTML - description complète
    technicalReference: apiRef.reference || '',
    images: [], // Pas d'images dans l'API actuelle
    products,
    collectionId: apiRef.collectionId || 'uncategorized',
    tags,
  }

  // Debug log pour le premier produit
  if (apiRef.id === '82') {
    console.log('🔍 Debug mapping premier produit:', {
      id: apiRef.id,
      hasName: !!apiRef.name,
      hasSubname: !!apiRef.subname,
      hasDescription: !!apiRef.description,
      subnameLength: apiRef.subname?.length,
      descriptionLength: apiRef.description?.length,
    })
  }

  return mapped
}

/**
 * Mapper la réponse API brute vers notre modèle normalisé
 */
export function mapAPIResponseToShopCatalog(apiResponse: APIRawResponse): ShopCatalogResponse {
  try {
    // Vérifier que apiResponse est bien un tableau
    if (!Array.isArray(apiResponse)) {
      console.error('❌ API response is not an array:', apiResponse)
      return { references: [] }
    }

    // Aplatir le tableau de tableaux (flat(1) pour un seul niveau)
    // Structure API: [[{item1}], [{item2}], [{item3}]]
    const flatReferences = apiResponse.flat(1)

    // Filtrer les éléments null ou undefined et vérifier la structure minimale
    const validReferences = flatReferences.filter((ref) => {
      if (!ref) return false
      if (!ref.id) {
        console.warn('⚠️ Reference without ID skipped:', ref)
        return false
      }
      return true
    })

    console.log(`📊 Valid references to map: ${validReferences.length}`)

    // Mapper chaque référence avec gestion d'erreur
    const references = validReferences
      .map((ref, index) => {
        try {
          return mapAPIReferenceToShopReference(ref)
        } catch (err) {
          console.error(`❌ Error mapping reference at index ${index}:`, err, ref)
          return null
        }
      })
      .filter((ref): ref is ShopReference => ref !== null)

    console.log(`📦 Successfully mapped ${references.length} references from API`)

    return { references }
  } catch (err) {
    console.error('❌ Fatal error in mapAPIResponseToShopCatalog:', err)
    return { references: [] }
  }
}

// ============================================================================
// Helpers pour gérer le HTML
// ============================================================================

/**
 * Décode les entités HTML dans une chaîne
 * Ex: "Pourquoi&nbsp;?" → "Pourquoi ?"
 */
export function decodeHTMLEntities(text: string): string {
  if (!text) return ''
  if (typeof document === 'undefined') return text // SSR safe

  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

/**
 * Extrait le texte brut d'une chaîne HTML
 * Utile pour les meta descriptions, previews, etc.
 */
export function stripHTML(html: string): string {
  if (!html) return ''
  if (typeof document === 'undefined') return html // SSR safe

  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

/**
 * Nettoie et prépare une chaîne HTML pour l'affichage
 * - Décode les entités HTML
 * - Garde les balises HTML pour v-html
 */
export function sanitizeHTML(html: string): string {
  return decodeHTMLEntities(html)
}
