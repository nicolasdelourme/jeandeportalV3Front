/**
 * Store Pinia pour les abonnements utilisateur
 * Gestion des abonnements et factures de l'utilisateur connecté
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userSubscriptionService } from '@/services/user-subscription.service'
import type {
  UserSubscription,
  UserInvoice,
  APIUpdatePaymentResponse,
} from '@/types/user-subscription-api.types'
import { UserSubscriptionAPIError } from '@/types/user-subscription-api.types'

export const useUserSubscriptionStore = defineStore('userSubscription', () => {
  // ============================================================================
  // État
  // ============================================================================

  /**
   * Liste des abonnements de l'utilisateur
   */
  const subscriptions = ref<UserSubscription[]>([])

  /**
   * Liste des factures de l'utilisateur
   */
  const invoices = ref<UserInvoice[]>([])

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

  /**
   * État de mise à jour du moyen de paiement
   */
  const isUpdatingPayment = ref(false)

  /**
   * Résultat de la mise à jour du moyen de paiement
   */
  const paymentUpdateResult = ref<APIUpdatePaymentResponse | null>(null)

  // ============================================================================
  // Getters
  // ============================================================================

  /**
   * Abonnements actifs ou suspendus (non résiliés)
   */
  const activeSubscriptions = computed(() =>
    subscriptions.value.filter((s) => s.status !== 'cancelled')
  )

  /**
   * Abonnements résiliés
   */
  const cancelledSubscriptions = computed(() =>
    subscriptions.value.filter((s) => s.status === 'cancelled')
  )

  /**
   * Vérifie si des données sont chargées
   */
  const hasData = computed(() => subscriptions.value.length > 0 || invoices.value.length > 0)

  /**
   * Nombre total d'abonnements
   */
  const totalSubscriptions = computed(() => subscriptions.value.length)

  /**
   * Nombre d'abonnements actifs
   */
  const activeCount = computed(() => activeSubscriptions.value.length)

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Récupère les abonnements et factures depuis l'API
   */
  async function fetchData(force = false): Promise<void> {
    // Si on a déjà des données et qu'on ne force pas, ne rien faire
    if (!force && hasData.value) {
      console.log('📦 User subscriptions already loaded')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await userSubscriptionService.fetchUserSubscriptions()
      subscriptions.value = result.subscriptions
      invoices.value = result.invoices
      lastFetchTimestamp.value = Date.now()

      console.log(
        `✅ User subscriptions loaded: ${result.subscriptions.length} subscriptions, ${result.invoices.length} invoices`
      )
    } catch (err) {
      const errorMessage =
        err instanceof UserSubscriptionAPIError
          ? err.message
          : 'Impossible de charger vos abonnements'

      error.value = errorMessage
      console.error('❌ Failed to fetch user subscriptions:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Force le rechargement des données
   */
  async function refresh(): Promise<void> {
    console.log('🔄 Force refreshing user subscriptions...')
    await fetchData(true)
  }

  /**
   * Vide les données (utile lors de la déconnexion)
   */
  function clearData(): void {
    console.log('🗑️ Clearing user subscriptions...')
    subscriptions.value = []
    invoices.value = []
    lastFetchTimestamp.value = 0
    error.value = null
    paymentUpdateResult.value = null
  }

  /**
   * Demande la mise à jour du moyen de paiement
   * Retourne les informations Stripe pour afficher le formulaire
   */
  async function updatePaymentMethod(): Promise<APIUpdatePaymentResponse | null> {
    isUpdatingPayment.value = true
    error.value = null

    try {
      const result = await userSubscriptionService.updatePaymentMethod()
      paymentUpdateResult.value = result
      return result
    } catch (err) {
      const errorMessage =
        err instanceof UserSubscriptionAPIError
          ? err.message
          : 'Impossible de mettre à jour le moyen de paiement'

      error.value = errorMessage
      console.error('❌ Failed to update payment method:', err)
      return null
    } finally {
      isUpdatingPayment.value = false
    }
  }

  /**
   * Réinitialise le résultat de mise à jour du paiement
   */
  function clearPaymentResult(): void {
    paymentUpdateResult.value = null
  }

  // ============================================================================
  // Retour du store
  // ============================================================================

  return {
    // État
    subscriptions,
    invoices,
    isLoading,
    error,
    lastFetchTimestamp,
    isUpdatingPayment,
    paymentUpdateResult,

    // Getters
    activeSubscriptions,
    cancelledSubscriptions,
    hasData,
    totalSubscriptions,
    activeCount,

    // Actions
    fetchData,
    refresh,
    clearData,
    updatePaymentMethod,
    clearPaymentResult,
  }
})
