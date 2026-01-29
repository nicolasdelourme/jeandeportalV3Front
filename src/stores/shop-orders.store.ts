/**
 * Store Pinia pour les factures de commandes
 * Gestion des factures des commandes payées de l'utilisateur connecté
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { shopOrdersService } from '@/services/shop-orders.service'
import type { ShopOrderInvoice } from '@/types/shop-orders-api.types'
import { ShopOrdersAPIError } from '@/types/shop-orders-api.types'

export const useShopOrdersStore = defineStore('shopOrders', () => {
  // ============================================================================
  // État
  // ============================================================================

  /**
   * Liste des factures de commandes de l'utilisateur
   */
  const orders = ref<ShopOrderInvoice[]>([])

  /**
   * État de chargement
   */
  const isLoading = ref(false)

  /**
   * Erreur éventuelle
   */
  const error = ref<string | null>(null)

  /**
   * Timestamp du dernier chargement réussi
   */
  const lastFetchTimestamp = ref<number>(0)

  // ============================================================================
  // Getters
  // ============================================================================

  /**
   * Vérifie si des données sont chargées
   */
  const hasData = computed(() => orders.value.length > 0)

  /**
   * Nombre total de commandes
   */
  const totalOrders = computed(() => orders.value.length)

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Récupère les factures de commandes depuis l'API
   */
  async function fetchData(force = false): Promise<void> {
    // Si on a déjà des données et qu'on ne force pas, ne rien faire
    if (!force && hasData.value) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await shopOrdersService.fetchOrders()
      orders.value = result
      lastFetchTimestamp.value = Date.now()

    } catch (err) {
      const errorMessage =
        err instanceof ShopOrdersAPIError
          ? err.message
          : 'Impossible de charger vos achats'

      error.value = errorMessage
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Force le rechargement des données
   */
  async function refresh(): Promise<void> {
    await fetchData(true)
  }

  /**
   * Vide les données (utile lors de la déconnexion)
   */
  function clearData(): void {
    orders.value = []
    lastFetchTimestamp.value = 0
    error.value = null
  }

  // ============================================================================
  // Retour du store
  // ============================================================================

  return {
    // État
    orders,
    isLoading,
    error,
    lastFetchTimestamp,

    // Getters
    hasData,
    totalOrders,

    // Actions
    fetchData,
    refresh,
    clearData,
  }
})
