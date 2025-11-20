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
  price: number                  // Prix
  image?: string                 // Image du produit (optionnel)
  slug?: string                  // Slug pour le lien produit
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
  VAT_RATE: 0.20,                // Taux de TVA français : 20%
} as const

/**
 * Erreurs du panier
 */
export class CartError extends Error {
  constructor(
    message: string,
    public code: 'ITEM_ALREADY_IN_CART' | 'ITEM_NOT_FOUND',
  ) {
    super(message)
    this.name = 'CartError'
  }
}
