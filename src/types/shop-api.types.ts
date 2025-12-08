/**
 * Types pour l'API Shop/Boutique
 * Structure du catalogue produits
 */

/**
 * Prix d'un produit avec ses variantes
 */
export interface ShopPrice {
  id: string
  amount: number // Prix TTC en euros
  htAmount: number // ✅ Prix HT EXACT en euros (depuis API)
  vatRate: number // ✅ Taux de TVA réel (5.5, 20, etc.)
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
  physical: boolean // ✅ Produit physique (livraison requise)
  immaterial: boolean // ✅ Produit dématérialisé (téléchargement/email)
  weight: number // ✅ Poids en grammes
  width: number // ✅ Largeur en cm
  height: number // ✅ Hauteur en cm
  depth: number // ✅ Profondeur en cm
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
  stock: number // ✅ Stock disponible
  visible: boolean // ✅ Visible sur le site
  available: boolean // ✅ Disponible à la vente
  timestamp: string // ✅ Date de mise à jour
  priority: number // ✅ Ordre d'affichage (pour tri)
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
 * Image dans la structure API brute
 */
export interface APIRawImage {
  id: string
  imageTypeId: string
  name: string
  description: string
  width: string
  height: string
  size: string
  tag: string
  path: string
  timestamp: string
  imageId?: string
  itemId?: string
  sort?: string
}

/**
 * Produit dans la structure API brute
 * Note: Les valeurs sont maintenant des numbers au lieu de strings
 */
export interface APIRawProduct {
  id: number
  referenceId: number
  productId: number
  productQuantity: number
  timestamp: string
  fileId: number | null
  typeId: number | null // ✅ Changed from "type" to "typeId"
  name: string
  description: string
  buyPrice: number | null
  overstock: number
  weight: number
  width: number
  height: number
  depth: number
  physical: number // ✅ 0 ou 1 - Produit physique
  immaterial: number // ✅ 0 ou 1 - Produit dématérialisé
  actived: number
  image_array: APIRawImage[]
  feature_array: any[]
}

/**
 * Prix dans la structure API brute
 * Note: Les valeurs sont maintenant des numbers au lieu de strings
 */
export interface APIRawPrice {
  id: number
  referenceId: number
  storeId: number
  currency: string
  price: number // Prix TTC en centimes (ex: 1900 = 19.00€)
  HTPrice: number // ✅ Prix HT EXACT en centimes (ex: 1801 = 18.01€)
  promo: number // 0 ou 1
  discountPrice: number
  HTDiscount: number
  vat: number // ✅ Taux de TVA réel (ex: 5.5, 20)
  active: number // 0 ou 1
  timestamp: string
}

/**
 * Référence dans la structure API brute
 * Note: Les valeurs sont maintenant des numbers au lieu de strings
 */
export interface APIRawReference {
  id: number
  itemId: number
  collectionId: number | null
  name: string
  subname: string | null
  reference: string
  description: string | null
  tag: string | null // Tags séparés par des virgules
  overstock: number
  available: number // 0 ou 1
  visible: number // 0 ou 1
  actived: number // 0 ou 1
  salestart: string
  salestop: string
  timestamp: string
  product_array: APIRawProduct[]
  price_array: APIRawPrice[]
  image_array: APIRawImage[]
}

/**
 * Item dans la structure API brute (niveau parent des références)
 * Note: Les champs booléens sont maintenant des numbers (0/1) au lieu de strings
 */
export interface APIRawItem {
  id: number // ✅ Changed: number instead of string
  name: string
  subname: string | null
  description: string | null
  tag: string | null
  seoUrl: string | null
  seoTitle: string | null
  seoMetaDescription: string | null
  view: string | null
  available: number // ✅ Changed: 0 or 1 (number)
  visible: number // ✅ Changed: 0 or 1 (number)
  actived: number // ✅ Changed: 0 or 1 (number)
  priorityDeprecated: number
  timestamp: string
  storeId: number
  itemId: number
  priority: number // ✅ Changed: number instead of string
  saleStart: string
  saleStop: string
  featurePerEntity_array: any[]
  reference_array: APIRawReference[] // ✅ Références dans l'item
  feature_array: any[]
  image_array: APIRawImage[] // ✅ Images au niveau item
  tag_array: string[]
  wishListActived: number
}

/**
 * Réponse brute de l'API Store (ancienne structure - deprecated)
 */
export interface APIRawStoreResponse {
  id: string
  projectId: string
  name: string
  start: string
  stop: string
  firstShipping: string
  deferredShipping: string
  numberPayment: string
  firstPayment: string
  deferredPayment: string
  meanPayment: string
  view: string
  url: string
  defaultStore: string
  wishListActived: string
  timestamp: string
  item_array: APIRawItem[] // ✅ Items (contient les références)
}

/**
 * Réponse brute de l'API (nouvelle structure: tableau d'items directement)
 */
export type APIRawResponse = APIRawItem[]

/**
 * Mapper un item API vers ses références (nouvelle structure)
 * Un item contient plusieurs références (reference_array)
 */
export function mapAPIItemToShopReferences(apiItem: APIRawItem): ShopReference[] {
  // Parser les tags au niveau item
  const itemTags = apiItem.tag_array || []

  // Images au niveau item (c'est là qu'elles se trouvent maintenant)
  const itemImages = (apiItem.image_array || [])
    .filter((img) => img && img.path)
    .map((img) => `https://jeandeportal.fr/${img.path}`)

  // Mapper chaque référence de l'item
  return apiItem.reference_array.map((apiRef) => {
    // Vérifier que product_array et price_array existent
    const productArray = Array.isArray(apiRef.product_array) ? apiRef.product_array : []
    const priceArray = Array.isArray(apiRef.price_array) ? apiRef.price_array : []

    // Mapper les produits avec TOUTES leurs infos
    const products: ShopProduct[] = productArray.map((apiProduct) => {
      // Trouver les prix de cette référence
      const productPrices: ShopPrice[] = priceArray
        .filter((p) => p && p.referenceId === apiRef.id && p.active === 1) // ✅ Compare with number
        .map((apiPrice) => ({
          id: String(apiPrice.id || ''),
          amount: (apiPrice.price || 0) / 100, // TTC en euros (already number)
          htAmount: (apiPrice.HTPrice || 0) / 100, // ✅ HT EXACT en euros
          vatRate: apiPrice.vat || 0, // ✅ Taux TVA réel (already number)
          currency: (apiPrice.currency || 'EUR').toUpperCase(),
          label: undefined, // Pas de label dans l'API
          isPromo: apiPrice.promo === 1, // ✅ Compare with number
          originalAmount:
            apiPrice.promo === 1 ? (apiPrice.discountPrice || 0) / 100 : undefined,
        }))

      return {
        id: String(apiProduct.id || ''),
        name: apiProduct.name || '',
        description: apiProduct.description || '',
        images: itemImages, // ✅ Images depuis l'item
        prices: productPrices,
        physical: apiProduct.physical === 1, // ✅ Compare with number
        immaterial: apiProduct.immaterial === 1, // ✅ Compare with number
        weight: apiProduct.weight || 0,
        width: apiProduct.width || 0,
        height: apiProduct.height || 0,
        depth: apiProduct.depth || 0,
      }
    })

    return {
      id: String(apiRef.id),
      name: apiItem.name || '', // ✅ Nom depuis l'item
      subname: apiItem.subname || '', // ✅ Subname depuis l'item
      description: apiItem.description || '', // ✅ Description depuis l'item
      technicalReference: apiRef.reference || '',
      images: itemImages, // ✅ Images depuis l'item
      products,
      collectionId: apiRef.collectionId ? String(apiRef.collectionId) : 'uncategorized',
      tags: itemTags, // ✅ Tags depuis l'item
      stock: apiRef.overstock || 0, // ✅ Stock (using overstock field)
      visible: apiItem.visible === 1, // ✅ Compare with number
      available: apiItem.available === 1, // ✅ Compare with number
      timestamp: apiItem.timestamp || '',
      priority: apiItem.priority || 0, // ✅ Already number
    }
  })
}

/**
 * Mapper la réponse API brute vers notre modèle normalisé
 * Note: La réponse API est maintenant directement un tableau d'items
 */
export function mapAPIResponseToShopCatalog(apiResponse: APIRawResponse): ShopCatalogResponse {
  try {
    // Vérifier que c'est bien un tableau d'items
    if (!apiResponse || !Array.isArray(apiResponse)) {
      console.error('❌ Invalid API response structure. Expected array of items')
      return { references: [] }
    }

    console.log(`📊 Processing ${apiResponse.length} items from API`)

    // Filtrer les items visibles et actifs, puis mapper vers références et aplatir
    const references = apiResponse
      .filter((item) => {
        // Filtrer les items invisibles ou inactifs (comparaison avec number)
        if (item.visible !== 1 || item.actived !== 1) {
          return false
        }
        return true
      })
      .flatMap((item, index) => {
        try {
          return mapAPIItemToShopReferences(item)
        } catch (err) {
          console.error(`❌ Error mapping item at index ${index}:`, err, item)
          return []
        }
      })
      .filter((ref) => ref !== null && ref !== undefined)

    console.log(`✅ Successfully mapped ${references.length} references from ${apiResponse.length} items`)

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
