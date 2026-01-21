/**
 * Store Pinia pour la gestion du panier OneClick (abonnements)
 *
 * Differences avec le panier boutique (cart.store.ts):
 * - Un seul plan a la fois (pas de quantites)
 * - Pas d'affichage dans le header
 * - Utilise SetupIntent au lieu de PaymentIntent
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { OneClickBasketState } from '@/types/oneclick-basket.types'
import { ONECLICK_STORE_ID } from '@/types/oneclick-basket.types'
import { oneClickBasketService } from '@/services/oneclick-basket.service'
import { toast } from 'vue-sonner'
import { getErrorMessage } from '@/lib/error-utils'

/**
 * Cree un etat de panier vide
 */
function createEmptyState(): OneClickBasketState {
  return {
    basketCode: null,
    items: [],
    isLoading: false,
    isSynced: false,
    error: null,
  }
}

/**
 * Store du panier OneClick
 */
export const useOneClickBasketStore = defineStore('oneClickBasket', () => {
  // === Etat ===
  const state = ref<OneClickBasketState>(createEmptyState())

  // === Getters ===

  /**
   * Code du panier
   */
  const basketCode = computed(() => state.value.basketCode)

  /**
   * Items du panier (normalement 0 ou 1)
   */
  const items = computed(() => state.value.items)

  /**
   * Premier item du panier (le plan selectionne)
   */
  const currentPlan = computed(() => state.value.items[0] || null)

  /**
   * Panier vide?
   */
  const isEmpty = computed(() => state.value.items.length === 0)

  /**
   * A des items?
   */
  const hasItems = computed(() => state.value.items.length > 0)

  /**
   * Prix total (le plan selectionne)
   */
  const totalPrice = computed(() => {
    const firstItem = state.value.items[0]
    if (!firstItem) return 0
    return firstItem.price
  })

  /**
   * Etat de chargement
   */
  const isLoading = computed(() => state.value.isLoading)

  /**
   * Erreur eventuelle
   */
  const error = computed(() => state.value.error)

  /**
   * Panier synchronise avec le backend?
   */
  const isSynced = computed(() => state.value.isSynced)

  // === Actions ===

  /**
   * Initialise le panier (pas de restauration localStorage)
   * Le panier OneClick est toujours cree frais lors du choix d'un abonnement
   */
  async function initialize(): Promise<void> {
    // Pas de restauration localStorage - le panier vit uniquement pendant la session de checkout
    state.value.isSynced = true
    console.log('🛒 [ONECLICK STORE] Initialise (pas de persistence localStorage)')
  }

  /**
   * Synchronise avec le backend
   */
  async function syncWithBackend(): Promise<void> {
    if (!state.value.basketCode) {
      state.value.isSynced = true
      return
    }

    state.value.isLoading = true
    state.value.error = null

    try {
      const result = await oneClickBasketService.fetchBasket(state.value.basketCode)

      state.value.basketCode = result.basketCode
      state.value.items = result.items
      state.value.isSynced = true

      console.log('✅ [ONECLICK STORE] Panier synchronise:', result.items.length, 'item(s)')
    } catch (error) {
      state.value.error = getErrorMessage(error)
      throw error
    } finally {
      state.value.isLoading = false
    }
  }

  /**
   * Ajoute un plan au panier OneClick
   * Cree toujours un nouveau panier (basketCode = null)
   *
   * @param planId - ID du plan a ajouter
   * @param isAnnual - Si true, ajoute le plan annuel
   */
  async function addPlan(planId: number, isAnnual: boolean = false): Promise<void> {
    state.value.isLoading = true
    state.value.error = null

    try {
      // Pour l'instant, on utilise directement le planId
      // Le backend gerera la distinction mensuel/annuel via le planId
      // (les plans annuels ont des IDs differents des plans mensuels)
      const actualPlanId = isAnnual ? planId : planId

      console.log('🛒 [ONECLICK STORE] Ajout plan:', { planId: actualPlanId, isAnnual })

      // Toujours creer un nouveau panier (basketCode = null)
      // L'utilisateur choisit un nouveau plan, pas de reprise d'ancien panier
      const result = await oneClickBasketService.addPlan(
        actualPlanId,
        ONECLICK_STORE_ID,
        null // Force nouveau panier
      )

      state.value.basketCode = result.basketCode
      state.value.items = result.items
      state.value.isSynced = true

      // Pas de sauvegarde localStorage - le panier vit uniquement pendant la session

      console.log('✅ [ONECLICK STORE] Plan ajoute:', result.items[0]?.name)
      toast.success('Abonnement ajoute')
    } catch (error) {
      state.value.error = getErrorMessage(error)
      toast.error(getErrorMessage(error))
      throw error
    } finally {
      state.value.isLoading = false
    }
  }

  /**
   * Supprime le plan du panier
   */
  async function removePlan(): Promise<void> {
    const firstItem = state.value.items[0]
    if (!state.value.basketCode || !firstItem) {
      return
    }

    const planId = firstItem.planId

    state.value.isLoading = true
    state.value.error = null

    try {
      const result = await oneClickBasketService.removePlan(planId, state.value.basketCode)

      state.value.items = result.items
      state.value.isSynced = true

      console.log('✅ [ONECLICK STORE] Plan supprime')
      toast.success('Abonnement retire')
    } catch (error) {
      state.value.error = getErrorMessage(error)
      toast.error(getErrorMessage(error))
      throw error
    } finally {
      state.value.isLoading = false
    }
  }

  /**
   * Vide le panier (local seulement)
   */
  function clearBasket(): void {
    console.log('🛒 [ONECLICK STORE] Vidage du panier')
    state.value = createEmptyState()
  }

  /**
   * Reinitialise le panier (apres paiement ou deconnexion)
   */
  function resetBasket(): void {
    console.log('🛒 [ONECLICK STORE] Reinitialisation du panier')
    state.value = createEmptyState()
  }

  // === Return (API publique du store) ===
  return {
    // State
    basketCode,
    items,
    currentPlan,
    isEmpty,
    hasItems,
    totalPrice,
    isLoading,
    error,
    isSynced,

    // Actions
    initialize,
    syncWithBackend,
    addPlan,
    removePlan,
    clearBasket,
    resetBasket,
  }
})
