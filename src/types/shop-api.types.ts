/**
 * Types pour l'API Shop/Boutique
 * Structure du catalogue produits
 */

import { logger } from '@/utils/logger'

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
 * Structure d'un tag parsé
 */
export interface ParsedTag {
  raw: string        // Tag original (ex: "filter_evolutionor")
  prefix: string     // Préfixe (ex: "filter")
  value: string      // Valeur sans préfixe (ex: "evolutionor")
  displayName: string // Nom d'affichage formaté (ex: "Evolutionor")
}

/**
 * Helper: Parser un tag au format "prefix_value"
 * Retourne le préfixe, la valeur et le nom d'affichage formaté
 */
export function parseTag(tag: string): ParsedTag {
  const underscoreIndex = tag.indexOf('_')

  if (underscoreIndex === -1) {
    // Pas de préfixe, c'est un tag simple (ex: "Métaux précieux")
    return {
      raw: tag,
      prefix: '',
      value: tag,
      displayName: tag,
    }
  }

  const prefix = tag.substring(0, underscoreIndex)
  const value = tag.substring(underscoreIndex + 1)

  // Capitaliser la première lettre pour l'affichage
  const displayName = value.charAt(0).toUpperCase() + value.slice(1)

  return {
    raw: tag,
    prefix,
    value,
    displayName,
  }
}

/**
 * Helper: Obtenir les tags de filtre boutique (préfixe "filter_")
 * Retourne les tags parsés pour l'affichage
 */
export function getFilterTags(references: ShopReference[]): ParsedTag[] {
  const tagsSet = new Set<string>()

  references.forEach((ref) => {
    ref.tags.forEach((tag) => {
      if (tag.startsWith('filter_')) {
        tagsSet.add(tag)
      }
    })
  })

  return Array.from(tagsSet)
    .map(parseTag)
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'fr'))
}

/**
 * Helper: Extraire les tags d'un produit par préfixe
 * Retourne les tags parsés pour l'affichage
 */
export function getTagsByPrefix(tags: string[], prefix: string): ParsedTag[] {
  return tags
    .filter((tag) => tag.startsWith(`${prefix}_`))
    .map(parseTag)
}

/**
 * Helper: Obtenir le premier tag d'un préfixe donné (pour affichage)
 */
export function getFirstTagByPrefix(tags: string[], prefix: string): ParsedTag | null {
  const tag = tags.find((t) => t.startsWith(`${prefix}_`))
  return tag ? parseTag(tag) : null
}

/**
 * Helper: Obtenir les tags d'affichage (tous sauf filter_ et reco_)
 * Pour la page produit
 */
export function getDisplayTags(tags: string[]): ParsedTag[] {
  return tags
    .filter((tag) => !tag.startsWith('filter_') && !tag.startsWith('reco_'))
    .map(parseTag)
}

/**
 * Helper: Obtenir tous les tags uniques du catalogue (tous types confondus)
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
  imageId: number | string
  imageType: string // Type de l'image (en varchar)
  name: string
  description: string
  path: string // Chemin vers l'image (SANS préfixe domaine)
}

/**
 * Prix dans la structure API brute
 * Note: Prix en CENTIMES (2900 = 29,00€)
 */
export interface APIRawPrice {
  priceId: number | string
  price: number // Prix TTC non remisé en centimes
  HTPrice: number // Prix HT non remisé en centimes
  discountPrice: number // Prix TTC remisé en centimes
  HTDiscount: number // Prix HT remisé en centimes
  vat: number // Taux de TVA (ex: 5.5, 20)
  currency: string // 'eur' ou 'jdp'
}

/**
 * Référence dans la structure API brute (variante de produit)
 */
export interface APIRawReference {
  referenceId: number | string
  name: string
  subname: string | null
  description: string | null // Description commerciale
  tag: string | null
  reference: string // Référence technique (apparaît sur facture)
  price_array: APIRawPrice[]
  image_array: APIRawImage[]
}

/**
 * Item dans la structure API brute (produit principal)
 */
export interface APIRawItem {
  itemId: number | string
  name: string
  subname: string | null
  description: string | null // Peut contenir du HTML
  tag: string | null
  seoUrl: string | null
  seoTitle: string | null
  seoMetaDescription: string | null
  image_array: APIRawImage[]
  reference_array: APIRawReference[]
}

/**
 * Catégorie dans la structure API brute
 */
export interface APIRawCategory {
  categoryId: number | string
  name: string
  item_array: APIRawItem[]
}

/**
 * Réponse brute de l'API fetchStore
 */
export interface APIRawStoreResponse {
  storeId: string
  name: string
  view: string | null // Deprecated
  url: string | null // Deprecated pour l'API, utilisé ailleurs
  category_array: APIRawCategory[]
}

/**
 * Mapper une référence API vers un produit ShopProduct
 * Dans la nouvelle structure, une référence = une variante de produit
 */
function mapAPIReferenceToProduct(
  apiRef: APIRawReference,
  itemImages: string[]
): ShopProduct {
  // Mapper les prix de la référence
  const prices: ShopPrice[] = (apiRef.price_array || []).map((apiPrice) => {
    const hasDiscount = apiPrice.discountPrice > 0 && apiPrice.discountPrice < apiPrice.price
    return {
      id: String(apiPrice.priceId || ''),
      amount: hasDiscount ? (apiPrice.discountPrice || 0) / 100 : (apiPrice.price || 0) / 100,
      htAmount: hasDiscount ? (apiPrice.HTDiscount || 0) / 100 : (apiPrice.HTPrice || 0) / 100,
      vatRate: apiPrice.vat || 0,
      currency: (apiPrice.currency || 'EUR').toUpperCase(),
      label: undefined,
      isPromo: hasDiscount,
      originalAmount: hasDiscount ? (apiPrice.price || 0) / 100 : undefined,
    }
  })

  // Images: priorité aux images de la référence, sinon images de l'item
  const refImages = (apiRef.image_array || [])
    .filter((img) => img && img.path)
    .map((img) => `https://jeandeportal.fr/${img.path}`)
  const images = refImages.length > 0 ? refImages : itemImages

  return {
    id: String(apiRef.referenceId || ''),
    name: apiRef.name || '',
    description: apiRef.description || '',
    images,
    prices,
    // Par défaut, on suppose produit physique sauf si indiqué autrement
    physical: true,
    immaterial: false,
    weight: 0,
    width: 0,
    height: 0,
    depth: 0,
  }
}

/**
 * Mapper un item API vers une ShopReference
 * Un item = un produit principal avec ses variantes (références)
 */
export function mapAPIItemToShopReference(
  apiItem: APIRawItem,
  categoryId: string,
  categoryName: string
): ShopReference {
  // Parser les tags
  const tags = apiItem.tag ? apiItem.tag.split(',').map((t) => t.trim()).filter(Boolean) : []

  // Images au niveau item
  const itemImages = (apiItem.image_array || [])
    .filter((img) => img && img.path)
    .map((img) => `https://jeandeportal.fr/${img.path}`)

  // Mapper les références (variantes) en produits
  const products: ShopProduct[] = (apiItem.reference_array || []).map((apiRef) =>
    mapAPIReferenceToProduct(apiRef, itemImages)
  )

  return {
    id: String(apiItem.itemId),
    name: apiItem.name || '',
    subname: apiItem.subname || '',
    description: apiItem.description || '',
    technicalReference: apiItem.seoUrl || '',
    images: itemImages,
    products,
    collectionId: categoryId,
    tags: [...tags, categoryName], // Ajouter le nom de catégorie comme tag
    stock: 999, // Non fourni dans la nouvelle API
    visible: true,
    available: true,
    timestamp: '',
    priority: 0,
  }
}

/**
 * Mapper la réponse API brute vers notre modèle normalisé
 * Structure: storeId, name, category_array[{categoryId, name, item_array[...]}]
 */
export function mapAPIResponseToShopCatalog(apiResponse: APIRawStoreResponse): ShopCatalogResponse {
  try {
    // Vérifier la structure de la réponse
    if (!apiResponse || !apiResponse.category_array) {
      logger.error('❌ Invalid API response structure. Expected object with category_array')
      return { references: [] }
    }

    // Parcourir les catégories et mapper les items
    const references: ShopReference[] = []

    for (const category of apiResponse.category_array) {
      const categoryId = String(category.categoryId || 'uncategorized')
      const categoryName = category.name || ''

      for (const item of category.item_array || []) {
        try {
          const ref = mapAPIItemToShopReference(item, categoryId, categoryName)
          references.push(ref)
        } catch (err) {
          logger.error(`❌ Error mapping item ${item.itemId}:`, err)
        }
      }
    }

    return { references }
  } catch (err) {
    logger.error('❌ Fatal error in mapAPIResponseToShopCatalog:', err)
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
