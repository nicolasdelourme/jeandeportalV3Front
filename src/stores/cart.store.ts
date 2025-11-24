/**
 * Store Pinia pour la gestion du panier
 *
 * ⚠️ MIGRATION: Passage de localStorage uniquement à synchronisation backend
 * - Ancien système: items uniques en localStorage avec expiration 7 jours
 * - Nouveau système: items avec quantités synchronisés avec backend API
 *
 * Les paniers localStorage existants sont automatiquement vidés au profit du backend
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, CartState, CartReceipt } from '@/types/cart.types'
import { CartError, CART_CONFIG } from '@/types/cart.types'
import { cartService } from '@/services/cart.service'
import { decodeHtmlEntities } from '@/utils/html.utils'
import { toast } from 'vue-sonner'

/**
 * Crée un état de panier vide
 */
function createEmptyCartState(): CartState {
  return {
    items: [],
    receipt: null,
    isLoading: false,
    isSynced: false,
    lastSyncTimestamp: 0,
  }
}

/**
 * Vide l'ancien panier localStorage (migration)
 */
function clearOldLocalStorageCart(): void {
  try {
    const oldCart = localStorage.getItem(CART_CONFIG.STORAGE_KEY)
    if (oldCart) {
      localStorage.removeItem(CART_CONFIG.STORAGE_KEY)
      console.info('🛒 [CART STORE] Ancien panier localStorage vidé (migration vers backend)')
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage du localStorage:', error)
  }
}

/**
 * Store du panier
 */
export const useCartStore = defineStore('cart', () => {
  // === État ===
  const cartState = ref<CartState>(createEmptyCartState())

  // === Getters ===

  /**
   * Articles du panier
   */
  const items = computed(() => cartState.value.items)

  /**
   * Récapitulatif du panier (backend receipt)
   */
  const receipt = computed(() => cartState.value.receipt)

  /**
   * État de chargement
   */
  const isLoading = computed(() => cartState.value.isLoading)

  /**
   * Panier synchronisé avec backend
   */
  const isSynced = computed(() => cartState.value.isSynced)

  /**
   * ⚠️ CHANGEMENT: Nombre d'articles = somme des quantités
   * Avant: items.length (items uniques)
   * Après: sum(item.quantity)
   */
  const itemCount = computed(() => {
    return cartState.value.items.reduce((total, item) => {
      return total + (item.quantity || 0)
    }, 0)
  })

  /**
   * Total du panier TTC
   * Priorité au receipt backend si disponible, sinon calcul local
   */
  const subtotal = computed(() => {
    // Si on a le receipt backend, l'utiliser (plus fiable)
    if (cartState.value.receipt) {
      return cartState.value.receipt.discountTotal
    }

    // Sinon, calcul local (fallback)
    return cartState.value.items.reduce((total, item) => {
      const price = item.discountPrice ?? item.price
      const quantity = item.quantity || 0
      return total + price * quantity
    }, 0)
  })

  /**
   * Montant HT (hors taxe)
   * Calcul depuis les items avec quantités
   */
  const subtotalExclVAT = computed(() => {
    return cartState.value.items.reduce((total, item) => {
      const priceHT = item.HTDiscount ?? item.priceHT
      const quantity = item.quantity || 0
      return total + priceHT * quantity
    }, 0)
  })

  /**
   * Montant de la TVA
   * Priorité au receipt backend si disponible
   */
  const vatAmount = computed(() => {
    // Si on a le receipt backend, l'utiliser
    if (cartState.value.receipt) {
      return cartState.value.receipt.tax
    }

    // Sinon, calcul local
    return subtotal.value - subtotalExclVAT.value
  })

  /**
   * TVA groupée par taux (pour affichage détaillé)
   */
  const vatByRate = computed(() => {
    const vatMap: Record<string, number> = {}

    cartState.value.items.forEach((item) => {
      const vatRate = item.vatRate || 0
      const priceTTC = item.discountPrice ?? item.price
      const priceHT = item.HTDiscount ?? item.priceHT
      const vatAmount = (priceTTC - priceHT) * (item.quantity || 0)

      const key = vatRate.toString()
      vatMap[key] = (vatMap[key] || 0) + vatAmount
    })

    return vatMap
  })

  /**
   * Vérifie si le panier est vide
   */
  const isEmpty = computed(() => cartState.value.items.length === 0)

  /**
   * Trouve un article par referenceId
   */
  const findItem = (referenceId: number): CartItem | undefined => {
    return cartState.value.items.find(item => item.referenceId === referenceId)
  }

  /**
   * Vérifie si un produit est dans le panier
   */
  const hasItem = (referenceId: number): boolean => {
    return findItem(referenceId) !== undefined
  }

  // === Actions ===

  /**
   * Synchronise le panier avec le backend
   * Charge le panier complet depuis l'API
   */
  async function syncWithBackend(): Promise<void> {
    cartState.value.isLoading = true

    try {
      console.log('🔄 [CART STORE] Synchronisation avec le backend...')

      const response = await cartService.fetchCart()
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.isSynced = true
      cartState.value.lastSyncTimestamp = Date.now()

      console.log(`✅ [CART STORE] Panier synchronisé: ${mapped.items.length} items`)
    } catch (error) {
      console.error('❌ [CART STORE] Erreur lors de la synchronisation:', error)
      toast.error('Impossible de charger le panier')
      throw error
    } finally {
      cartState.value.isLoading = false
    }
  }

  /**
   * Initialise le panier au chargement de l'application
   * Vide l'ancien localStorage et charge depuis backend
   */
  async function initialize(): Promise<void> {
    // Vider l'ancien panier localStorage (migration)
    clearOldLocalStorageCart()

    // Charger le panier depuis le backend
    try {
      await syncWithBackend()
    } catch (error) {
      // En cas d'erreur, panier vide (normal pour utilisateur non connecté sans session)
      console.info('🛒 [CART STORE] Panier vide ou non accessible (normal si pas de session)')
    }
  }

  /**
   * ⚠️ CHANGEMENT: addItem devient async et appelle le backend
   * Avant: Ajout local immédiat en localStorage
   * Après: Appel API puis mise à jour du store
   *
   * @param referenceId - ID de la référence à ajouter
   * @param quantity - Quantité à ajouter (défaut: 1)
   */
  async function addItem(referenceId: number, quantity: number = CART_CONFIG.DEFAULT_QUANTITY): Promise<void> {
    cartState.value.isLoading = true

    try {
      console.log(`🛒 [CART STORE] Ajout au panier: referenceId=${referenceId}, quantity=${quantity}`)

      const response = await cartService.addToCart(referenceId, quantity)
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.isSynced = true
      cartState.value.lastSyncTimestamp = Date.now()

      toast.success('Article ajouté au panier')
      console.log('✅ [CART STORE] Article ajouté')
    } catch (error: any) {
      console.error('❌ [CART STORE] Erreur lors de l\'ajout:', error)
      toast.error(error.message || 'Impossible d\'ajouter l\'article')
      throw error
    } finally {
      cartState.value.isLoading = false
    }
  }

  /**
   * ⚠️ NOUVEAU: Met à jour la quantité d'un article
   *
   * @param referenceId - ID de la référence à modifier
   * @param quantity - Nouvelle quantité (0 = supprimer)
   */
  async function updateItemQuantity(referenceId: number, quantity: number): Promise<void> {
    cartState.value.isLoading = true

    try {
      console.log(`🛒 [CART STORE] Mise à jour quantité: referenceId=${referenceId}, quantity=${quantity}`)

      const response = await cartService.updateQuantity(referenceId, quantity)
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.lastSyncTimestamp = Date.now()

      if (quantity === 0) {
        toast.success('Article retiré du panier')
      } else {
        toast.success('Quantité mise à jour')
      }

      console.log('✅ [CART STORE] Quantité mise à jour')
    } catch (error: any) {
      console.error('❌ [CART STORE] Erreur lors de la mise à jour:', error)
      toast.error(error.message || 'Impossible de modifier la quantité')
      throw error
    } finally {
      cartState.value.isLoading = false
    }
  }

  /**
   * ⚠️ CHANGEMENT: removeItem devient async et appelle le backend
   *
   * @param referenceId - ID de la référence à supprimer
   */
  async function removeItem(referenceId: number): Promise<void> {
    return updateItemQuantity(referenceId, 0)
  }

  /**
   * ⚠️ CHANGEMENT: clearCart appelle le backend pour supprimer tous les items
   */
  async function clearCart(): Promise<void> {
    if (cartState.value.items.length === 0) {
      return
    }

    cartState.value.isLoading = true

    try {
      console.log('🛒 [CART STORE] Vidage du panier')

      const response = await cartService.clearCart(cartState.value.items)
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.lastSyncTimestamp = Date.now()

      toast.success('Panier vidé')
      console.log('✅ [CART STORE] Panier vidé')
    } catch (error: any) {
      console.error('❌ [CART STORE] Erreur lors du vidage:', error)
      toast.error(error.message || 'Impossible de vider le panier')
      throw error
    } finally {
      cartState.value.isLoading = false
    }
  }

  /**
   * Augmente la quantité d'un article de 1
   */
  async function increaseQuantity(referenceId: number): Promise<void> {
    const item = findItem(referenceId)
    if (!item) {
      throw new CartError('Article non trouvé', 'ITEM_NOT_FOUND')
    }
    return updateItemQuantity(referenceId, item.quantity + 1)
  }

  /**
   * Diminue la quantité d'un article de 1
   */
  async function decreaseQuantity(referenceId: number): Promise<void> {
    const item = findItem(referenceId)
    if (!item) {
      throw new CartError('Article non trouvé', 'ITEM_NOT_FOUND')
    }

    const newQuantity = Math.max(0, item.quantity - 1)
    return updateItemQuantity(referenceId, newQuantity)
  }

  // === Return (API publique du store) ===
  return {
    // State
    items,
    receipt,
    isLoading,
    isSynced,
    itemCount,
    subtotal,
    subtotalExclVAT,
    vatAmount,
    vatByRate,
    isEmpty,

    // Getters
    findItem,
    hasItem,

    // Actions
    initialize,
    syncWithBackend,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  }
})
