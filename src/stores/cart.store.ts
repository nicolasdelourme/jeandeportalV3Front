/**
 * Store Pinia pour la gestion du panier
 * - Persistance dans localStorage avec expiration (7 jours)
 * - Items uniques (pas de quantités multiples)
 * - Calcul du total
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, CartState } from '@/types/cart.types'
import { CartError, CART_CONFIG } from '@/types/cart.types'
import { decodeHtmlEntities } from '@/utils/html.utils'

/**
 * Charge le panier depuis localStorage
 */
function loadCartFromStorage(): CartState {
  try {
    const stored = localStorage.getItem(CART_CONFIG.STORAGE_KEY)
    if (!stored) {
      return createEmptyCart()
    }

    const cart: CartState = JSON.parse(stored)

    // Vérifier si le panier a expiré
    if (Date.now() > cart.expiresAt) {
      localStorage.removeItem(CART_CONFIG.STORAGE_KEY)
      return createEmptyCart()
    }

    // Nettoyer et valider les items (supprimer quantity si présente, valider prix, décoder HTML)
    const validItems = cart.items
      .map((item: any) => ({
        id: item.id,
        name: decodeHtmlEntities(item.name),
        price: Number(item.price) || 0,
        image: item.image,
        slug: item.slug,
      }))
      .filter((item) => item.price > 0) // Supprimer les items avec prix invalide

    return {
      items: validItems,
      expiresAt: cart.expiresAt,
    }
  } catch (error) {
    console.error('Erreur lors du chargement du panier:', error)
    return createEmptyCart()
  }
}

/**
 * Sauvegarde le panier dans localStorage
 */
function saveCartToStorage(cart: CartState): void {
  try {
    localStorage.setItem(CART_CONFIG.STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier:', error)
  }
}

/**
 * Crée un panier vide avec expiration
 */
function createEmptyCart(): CartState {
  const expiresAt = Date.now() + CART_CONFIG.EXPIRY_DAYS * 24 * 60 * 60 * 1000
  return {
    items: [],
    expiresAt,
  }
}

/**
 * Store du panier
 */
export const useCartStore = defineStore('cart', () => {
  // === État ===
  const cartState = ref<CartState>(loadCartFromStorage())

  // === Getters ===

  /**
   * Articles du panier
   */
  const items = computed(() => cartState.value.items)

  /**
   * Nombre d'articles dans le panier
   */
  const itemCount = computed(() => cartState.value.items.length)

  /**
   * Total du panier TTC (somme des prix)
   */
  const subtotal = computed(() => {
    return cartState.value.items.reduce((total, item) => {
      const price = Number(item.price) || 0
      return total + price
    }, 0)
  })

  /**
   * Montant HT (hors taxe)
   */
  const subtotalExclVAT = computed(() => {
    if (!subtotal.value || subtotal.value === 0) return 0
    return subtotal.value / (1 + CART_CONFIG.VAT_RATE)
  })

  /**
   * Montant de la TVA
   */
  const vatAmount = computed(() => {
    return subtotal.value - subtotalExclVAT.value
  })

  /**
   * Vérifie si le panier est vide
   */
  const isEmpty = computed(() => cartState.value.items.length === 0)

  /**
   * Trouve un article par ID
   */
  const findItem = (productId: string | number): CartItem | undefined => {
    return cartState.value.items.find(item => item.id === productId)
  }

  /**
   * Vérifie si un produit est dans le panier
   */
  const hasItem = (productId: string | number): boolean => {
    return findItem(productId) !== undefined
  }

  // === Actions ===

  /**
   * Ajoute un article au panier (item unique)
   */
  function addItem(product: CartItem): void {
    const existingItem = findItem(product.id)

    if (existingItem) {
      // L'article existe déjà dans le panier
      throw new CartError(
        'Ce produit est déjà dans votre panier',
        'ITEM_ALREADY_IN_CART'
      )
    }

    // Normaliser le produit (s'assurer que price est un nombre et décoder les entités HTML)
    const normalizedProduct: CartItem = {
      ...product,
      name: decodeHtmlEntities(product.name),
      price: Number(product.price) || 0,
    }

    // Nouvel article : l'ajouter au panier
    cartState.value.items.push(normalizedProduct)
    saveCartToStorage(cartState.value)
  }

  /**
   * Supprime un article du panier
   */
  function removeItem(productId: string | number): void {
    const index = cartState.value.items.findIndex(item => item.id === productId)

    if (index === -1) {
      throw new CartError('Produit non trouvé dans le panier', 'ITEM_NOT_FOUND')
    }

    cartState.value.items.splice(index, 1)
    saveCartToStorage(cartState.value)
  }

  /**
   * Vide complètement le panier
   */
  function clearCart(): void {
    cartState.value = createEmptyCart()
    saveCartToStorage(cartState.value)
  }

  /**
   * Prolonge la durée de vie du panier (renouvelle l'expiration)
   */
  function renewCart(): void {
    cartState.value.expiresAt = Date.now() + CART_CONFIG.EXPIRY_DAYS * 24 * 60 * 60 * 1000
    saveCartToStorage(cartState.value)
  }

  /**
   * Obtient le nombre de jours restants avant expiration
   */
  const daysUntilExpiry = computed(() => {
    const msUntilExpiry = cartState.value.expiresAt - Date.now()
    return Math.ceil(msUntilExpiry / (24 * 60 * 60 * 1000))
  })

  // === Return (API publique du store) ===
  return {
    // State
    items,
    itemCount,
    subtotal,
    subtotalExclVAT,
    vatAmount,
    isEmpty,
    daysUntilExpiry,

    // Getters
    findItem,
    hasItem,

    // Actions
    addItem,
    removeItem,
    clearCart,
    renewCart,
  }
})
