/**
 * Types pour le système de panier
 * Items uniques - pas de gestion de quantités (PDFs, dossiers, etc.)
 */

/**
 * Article dans le panier (unique - 1 seul exemplaire par produit)
 */
export interface CartItem {
  id: string | number           // ID du produit
  name: string                   // Nom du produit
  price: number                  // Prix TTC
  priceHT: number                // ✅ Prix HT EXACT (depuis API)
  vatRate: number                // ✅ Taux de TVA réel (5.5, 20, etc.)
  image?: string                 // Image du produit (optionnel)
  slug?: string                  // Slug pour le lien produit
  physical?: boolean             // ✅ Produit physique (livraison requise)
  immaterial?: boolean           // ✅ Produit dématérialisé
}

/**
 * État du panier
 */
export interface CartState {
  items: CartItem[]              // Articles dans le panier
  expiresAt: number              // Timestamp d'expiration (7 jours)
}

/**
 * Configuration du panier
 */
export const CART_CONFIG = {
  STORAGE_KEY: 'jdp_cart',
  EXPIRY_DAYS: 7,                // Durée de vie du panier : 7 jours
} as const

/**
 * Erreurs du panier
 */
export class CartError extends Error {
  code: 'ITEM_ALREADY_IN_CART' | 'ITEM_NOT_FOUND'

  constructor(
    message: string,
    code: 'ITEM_ALREADY_IN_CART' | 'ITEM_NOT_FOUND',
  ) {
    super(message)
    this.name = 'CartError'
    this.code = code
  }
}
