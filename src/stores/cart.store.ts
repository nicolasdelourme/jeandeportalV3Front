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
import { getErrorMessage } from '@/lib/error-utils'
import { logger } from '@/utils/logger'

/**
 * Clé localStorage pour le basketCode
 */
const BASKET_CODE_KEY = 'jdp_basket_code'

/**
 * Crée un état de panier vide
 */
function createEmptyCartState(): CartState {
  return {
    items: [],
    receipt: null,
    basketCode: null,
    isLoading: false,
    isSynced: false,
    lastSyncTimestamp: 0,
  }
}

/**
 * Sauvegarde le basketCode en localStorage
 */
function saveBasketCode(code: string | null): void {
  try {
    if (code) {
      localStorage.setItem(BASKET_CODE_KEY, code)
      // Vérification immédiate
      const verify = localStorage.getItem(BASKET_CODE_KEY)
    } else {
      localStorage.removeItem(BASKET_CODE_KEY)
    }
  } catch (error) {
    logger.error('❌ Erreur lors de la sauvegarde du basketCode:', error)
  }
}

/**
 * Charge le basketCode depuis localStorage
 */
function loadBasketCode(): string | null {
  try {
    const code = localStorage.getItem(BASKET_CODE_KEY)
    return code
  } catch {
    return null
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
    }
  } catch (error) {
    logger.error('Erreur lors du nettoyage du localStorage:', error)
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
   * Code du panier (identifiant backend)
   */
  const basketCode = computed(() => cartState.value.basketCode)

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
      const quantity = item.quantity || 0
      return total + item.price * quantity
    }, 0)
  })

  /**
   * Montant HT (hors taxe)
   * Calcul depuis les items avec quantités
   */
  const subtotalExclVAT = computed(() => {
    return cartState.value.items.reduce((total, item) => {
      const quantity = item.quantity || 0
      return total + item.priceHT * quantity
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
      const vatAmount = (item.price - item.priceHT) * (item.quantity || 0)

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
   * Trouve un article par priceId
   */
  const findItem = (priceId: number): CartItem | undefined => {
    return cartState.value.items.find(item => item.priceId === priceId)
  }

  /**
   * Trouve un article par itemId (= referenceId pour l'API)
   */
  const findItemByItemId = (itemId: number): CartItem | undefined => {
    return cartState.value.items.find(item => item.itemId === itemId)
  }

  /**
   * Vérifie si un produit est dans le panier
   */
  const hasItem = (priceId: number): boolean => {
    return findItem(priceId) !== undefined
  }

  // === Actions ===

  /**
   * Synchronise le panier avec le backend
   * Charge le panier complet depuis l'API
   * Note: Nécessite un basketCode existant, sinon ne fait rien
   */
  async function syncWithBackend(): Promise<void> {
    // Si pas de basketCode, pas de panier à synchroniser
    if (!cartState.value.basketCode) {
      cartState.value.isSynced = true
      return
    }

    cartState.value.isLoading = true

    try {
      const response = await cartService.fetchCart(cartState.value.basketCode)
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.basketCode = mapped.basketCode
      cartState.value.isSynced = true
      cartState.value.lastSyncTimestamp = Date.now()
    } catch (error) {
      logger.error('❌ [CART STORE] Erreur lors de la synchronisation:', error)
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

    // Charger le basketCode depuis localStorage (persistance entre sessions)
    const savedBasketCode = loadBasketCode()
    if (savedBasketCode) {
      cartState.value.basketCode = savedBasketCode
    }

    // Charger le panier depuis le backend (si on a un basketCode)
    try {
      await syncWithBackend()
    } catch (error) {
      // Debug: voir l'erreur complète
      const cartError = error as CartError

      // Si le panier n'existe plus côté backend, supprimer le basketCode local
      if (cartError?.code === 'BASKET_NOT_FOUND') {
        cartState.value.basketCode = null
        saveBasketCode(null)
      }
    }
  }

  /**
   * Ajoute un article au panier via le backend
   *
   * @param referenceId - ID de la référence à ajouter (reference_array[].id du catalogue)
   * @param quantity - Quantité à ajouter (défaut: 1)
   */
  async function addItem(referenceId: number, quantity: number = CART_CONFIG.DEFAULT_QUANTITY): Promise<void> {
    cartState.value.isLoading = true

    try {
      // Passer le basketCode actuel (null si premier ajout → création du panier)
      const response = await cartService.addToCart(
        referenceId,
        quantity,
        CART_CONFIG.STORE_ID,
        cartState.value.basketCode
      )
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.basketCode = mapped.basketCode
      cartState.value.isSynced = true
      cartState.value.lastSyncTimestamp = Date.now()

      // Sauvegarder le basketCode en localStorage (important pour premier ajout)
      if (mapped.basketCode) {
        saveBasketCode(mapped.basketCode)
      } else {
        logger.error('❌ [CART STORE] ATTENTION: basketCode est null/undefined dans la réponse!')
      }
    } catch (error) {
      logger.error('❌ [CART STORE] Erreur lors de l\'ajout:', error)
      throw error
    } finally {
      cartState.value.isLoading = false
    }
  }

  /**
   * ⚠️ NOUVEAU: Met à jour la quantité d'un article
   *
   * @param priceId - ID du prix à modifier
   * @param quantity - Nouvelle quantité (0 = supprimer)
   */
  async function updateItemQuantity(priceId: number, quantity: number): Promise<void> {
    if (!cartState.value.basketCode) {
      throw new CartError('Pas de panier actif', 'SYNC_ERROR')
    }

    cartState.value.isLoading = true

    try {
      const response = await cartService.updateQuantity(priceId, quantity, cartState.value.basketCode)
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.basketCode = mapped.basketCode
      cartState.value.lastSyncTimestamp = Date.now()

      if (quantity === 0) {
        toast.success('Article retiré du panier')
      } else {
        toast.success('Quantité mise à jour')
      }

    } catch (error) {
      logger.error('❌ [CART STORE] Erreur lors de la mise à jour:', error)
      throw error
    } finally {
      cartState.value.isLoading = false
    }
  }

  /**
   * Supprime un article du panier via POST /deleteReference
   *
   * @param itemId - ID de l'item à supprimer (= referenceId pour l'API)
   * @param quantity - Quantité à supprimer (défaut: quantité totale de l'article)
   */
  async function removeItem(itemId: number, quantity?: number): Promise<void> {
    if (!cartState.value.basketCode) {
      throw new CartError('Pas de panier actif', 'SYNC_ERROR')
    }

    const item = findItemByItemId(itemId)
    if (!item) {
      throw new CartError('Article non trouvé', 'ITEM_NOT_FOUND')
    }

    // Par défaut, supprimer toute la quantité
    const quantityToRemove = quantity ?? item.quantity

    cartState.value.isLoading = true

    try {
      const response = await cartService.deleteReference(
        itemId, // referenceId = itemId
        quantityToRemove,
        cartState.value.basketCode
      )
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.basketCode = mapped.basketCode
      cartState.value.lastSyncTimestamp = Date.now()

      toast.success('Article retiré du panier')
    } catch (error) {
      logger.error('❌ [CART STORE] Erreur lors de la suppression:', error)
      throw error
    } finally {
      cartState.value.isLoading = false
    }
  }

  /**
   * ⚠️ CHANGEMENT: clearCart appelle le backend pour supprimer tous les items
   */
  async function clearCart(): Promise<void> {
    if (cartState.value.items.length === 0 || !cartState.value.basketCode) {
      return
    }

    cartState.value.isLoading = true

    try {
      const response = await cartService.clearCart(cartState.value.items, cartState.value.basketCode)
      const mapped = cartService.mapAPIResponse(response)

      cartState.value.items = mapped.items
      cartState.value.receipt = mapped.receipt
      cartState.value.basketCode = mapped.basketCode
      cartState.value.lastSyncTimestamp = Date.now()

      toast.success('Panier vidé')
    } catch (error) {
      logger.error('❌ [CART STORE] Erreur lors du vidage:', error)
      throw error
    } finally {
      cartState.value.isLoading = false
    }
  }

  /**
   * Augmente la quantité d'un article de 1
   */
  async function increaseQuantity(priceId: number): Promise<void> {
    const item = findItem(priceId)
    if (!item) {
      throw new CartError('Article non trouvé', 'ITEM_NOT_FOUND')
    }
    return updateItemQuantity(priceId, item.quantity + 1)
  }

  /**
   * Diminue la quantité d'un article de 1
   */
  async function decreaseQuantity(priceId: number): Promise<void> {
    const item = findItem(priceId)
    if (!item) {
      throw new CartError('Article non trouvé', 'ITEM_NOT_FOUND')
    }

    const newQuantity = Math.max(0, item.quantity - 1)
    return updateItemQuantity(priceId, newQuantity)
  }

  /**
   * Réinitialise le panier lors de la déconnexion
   *
   * Efface le basketCode du localStorage pour qu'un autre utilisateur
   * sur le même appareil puisse créer un nouveau panier.
   *
   * Note: Si un utilisateur anonyme a un panier et se connecte,
   * le backend gère l'association du panier au compte.
   */
  function resetCart(): void {
    cartState.value = createEmptyCartState()
    saveBasketCode(null) // Effacer le basketCode du localStorage
  }

  // === Return (API publique du store) ===
  return {
    // State
    items,
    receipt,
    basketCode,
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
    findItemByItemId,
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
    resetCart,
  }
})
