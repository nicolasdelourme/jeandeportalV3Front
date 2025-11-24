/**
 * Types pour le système de panier
 *
 * ⚠️ MIGRATION: Ajout du support des quantités et synchronisation backend
 * Les paniers localStorage existants seront vidés au profit du backend
 */

/**
 * Article dans le panier
 *
 * Mappé depuis CartAPIItem du backend
 */
export interface CartItem {
  // ===== Identifiants Backend =====
  /**
   * ID de l'item (backend)
   */
  itemId: number

  /**
   * ID de la référence produit (backend)
   */
  referenceId: number

  /**
   * Référence technique/SKU (backend)
   * Apparaît sur la facture
   */
  reference: string

  /**
   * ID du prix appliqué (backend)
   */
  priceId: number

  /**
   * ID de la boutique (28 pour consultations)
   */
  storeId: number

  /**
   * ID du coupon de réduction appliqué (0 ou null si aucun)
   */
  couponId: number | null

  // ===== Données Produit =====
  /**
   * ID du produit (compatibilité, = referenceId)
   */
  id: string | number

  /**
   * Nom commercial du produit
   */
  name: string

  /**
   * Slug pour le lien produit (optionnel, frontend only)
   */
  slug?: string

  // ===== Quantité =====
  /**
   * ⚠️ NOUVEAU: Quantité de cet article dans le panier
   * Avant: items uniques sans quantité
   * Après: support des quantités multiples
   */
  quantity: number

  // ===== Tarification =====
  /**
   * Prix fort TTC (avec TVA)
   */
  price: number

  /**
   * Prix fort HT (hors TVA)
   */
  priceHT: number

  /**
   * Prix réduit TTC (null si pas de réduction)
   */
  discountPrice: number | null

  /**
   * Prix réduit HT (null si pas de réduction)
   */
  HTDiscount: number | null

  /**
   * Taux de TVA (5.5, 20, etc.)
   */
  vatRate: number

  /**
   * Devise (toujours "EUR")
   */
  currency: string

  // ===== Médias =====
  /**
   * ⚠️ CHANGEMENT: Tableau d'images au lieu d'une seule
   * Avant: image?: string
   * Après: images: string[]
   */
  images: string[]

  // ===== Métadonnées (frontend only) =====
  /**
   * Produit physique nécessitant livraison
   */
  physical?: boolean

  /**
   * Produit dématérialisé (PDF, vidéo, etc.)
   */
  immaterial?: boolean
}

/**
 * Récapitulatif du panier (depuis backend receipt)
 */
export interface CartReceipt {
  /**
   * Nombre de références distinctes
   */
  referenceNumber: number

  /**
   * Montant total de TVA
   */
  tax: number

  /**
   * Total TTC hors remises
   */
  total: number

  /**
   * Total TTC avec remises appliquées
   */
  discountTotal: number
}

/**
 * État du panier
 */
export interface CartState {
  /**
   * Articles dans le panier
   */
  items: CartItem[]

  /**
   * Récapitulatif du panier (depuis backend)
   * null si pas encore chargé
   */
  receipt: CartReceipt | null

  /**
   * État de chargement des opérations
   */
  isLoading: boolean

  /**
   * Indique si le panier est synchronisé avec le backend
   */
  isSynced: boolean

  /**
   * Timestamp de la dernière synchronisation backend
   */
  lastSyncTimestamp: number
}

/**
 * Configuration du panier
 */
export const CART_CONFIG = {
  /**
   * Clé de stockage localStorage (ancien système, sera vidé)
   */
  STORAGE_KEY: 'jdp_cart',

  /**
   * ID de la boutique consultations
   */
  STORE_ID: 28,

  /**
   * Quantité par défaut lors de l'ajout
   */
  DEFAULT_QUANTITY: 1,

  /**
   * Délai de debounce pour les mises à jour de quantité (ms)
   */
  QUANTITY_UPDATE_DEBOUNCE: 500,
} as const

/**
 * Erreurs du panier
 */
export class CartError extends Error {
  code: 'ITEM_ALREADY_IN_CART' | 'ITEM_NOT_FOUND' | 'API_ERROR' | 'INVALID_QUANTITY' | 'SYNC_ERROR'

  constructor(
    message: string,
    code:
      | 'ITEM_ALREADY_IN_CART'
      | 'ITEM_NOT_FOUND'
      | 'API_ERROR'
      | 'INVALID_QUANTITY'
      | 'SYNC_ERROR',
  ) {
    super(message)
    this.name = 'CartError'
    this.code = code
  }
}

/**
 * Type helper pour les opérations sur la quantité
 */
export type QuantityOperation = 'increase' | 'decrease' | 'set' | 'remove'

/**
 * Payload pour la mise à jour de quantité
 */
export interface QuantityUpdatePayload {
  itemId: number
  referenceId: number
  operation: QuantityOperation
  value?: number
}
