/**
 * Service API pour les abonnements utilisateur
 * Gestion des appels à l'API /fetchUserSubscription
 */

import { apiClient } from '@/api/client'
import type {
  APIUserSubscriptionResponse,
  APIUpdatePaymentResponse,
  UserSubscription,
  UserInvoice,
} from '@/types/user-subscription-api.types'
import {
  UserSubscriptionAPIError,
  mapAPISubscription,
  mapAPIInvoice,
} from '@/types/user-subscription-api.types'
import {
  mockFetchUserSubscriptionAPI,
  mockUpdateOneClickPaymentAPI,
} from '@/api/user-subscription.mock'

// MOCK MODE : Contrôle par VITE_API_MODE
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

/**
 * Configuration de l'API User Subscription
 */
const API_CONFIG = {
  ENDPOINTS: {
    FETCH: '/fetchUserSubscription',
    UPDATE_PAYMENT: '/updateOneClickPayment',
  },
  TIMEOUT: 30000, // 30 secondes
} as const

/**
 * Résultat du service
 */
export interface UserSubscriptionResult {
  subscriptions: UserSubscription[]
  invoices: UserInvoice[]
}

/**
 * Service singleton pour les appels API User Subscription
 */
class UserSubscriptionService {
  private abortController: AbortController | null = null

  /**
   * Récupère les abonnements et factures de l'utilisateur
   * @throws {UserSubscriptionAPIError} Si l'API échoue ou timeout
   */
  async fetchUserSubscriptions(): Promise<UserSubscriptionResult> {
    // Mode mock : utiliser les données fictives
    if (USE_MOCK) {
      try {
        const rawData = await mockFetchUserSubscriptionAPI()
        return {
          subscriptions: rawData.subscription_array.map(mapAPISubscription),
          invoices: rawData.invoice_array.map(mapAPIInvoice),
        }
      } catch (error) {
        throw new UserSubscriptionAPIError(
          'Erreur lors du chargement du mock',
          undefined,
          error as Error
        )
      }
    }

    // Annuler la requête précédente si elle existe
    if (this.abortController) {
      this.abortController.abort()
    }

    this.abortController = new AbortController()

    try {
      // Timeout de la requête
      const timeoutId = setTimeout(() => {
        this.abortController?.abort()
      }, API_CONFIG.TIMEOUT)

      // Appel API
      const rawData = await apiClient.get<APIUserSubscriptionResponse>(API_CONFIG.ENDPOINTS.FETCH, {
        signal: this.abortController.signal,
      })

      clearTimeout(timeoutId)

      // Validation basique de la structure
      if (!rawData || rawData.status !== 'success') {
        throw new UserSubscriptionAPIError(rawData?.message || 'Structure de réponse API invalide')
      }

      // Mapper les données brutes vers notre modèle normalisé
      const result: UserSubscriptionResult = {
        subscriptions: (rawData.subscription_array || []).map(mapAPISubscription),
        invoices: (rawData.invoice_array || []).map(mapAPIInvoice),
      }

      return result
    } catch (error) {
      if (error instanceof UserSubscriptionAPIError) {
        throw error
      }

      // Gestion des erreurs Axios (type guard)
      const axiosError = error as {
        response?: { status: number; statusText: string }
        request?: unknown
        code?: string
        name?: string
      }

      if (axiosError.response) {
        // Le serveur a répondu avec un code d'erreur
        throw new UserSubscriptionAPIError(
          `Erreur HTTP: ${axiosError.response.status} ${axiosError.response.statusText}`,
          axiosError.response.status
        )
      }

      if (axiosError.request) {
        // La requête a été faite mais pas de réponse
        if (axiosError.code === 'ECONNABORTED' || axiosError.name === 'AbortError') {
          throw new UserSubscriptionAPIError('Requête annulée ou timeout')
        }
        throw new UserSubscriptionAPIError('Aucune réponse du serveur')
      }

      // Autre type d'erreur
      if (error instanceof Error) {
        throw new UserSubscriptionAPIError(
          `Erreur lors de la récupération des abonnements: ${error.message}`,
          undefined,
          error
        )
      }

      throw new UserSubscriptionAPIError('Erreur inconnue lors de la récupération des abonnements')
    } finally {
      this.abortController = null
    }
  }

  /**
   * Annule la requête en cours
   */
  cancelRequest(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  /**
   * Demande la mise à jour du moyen de paiement pour tous les abonnements
   * @returns Les informations Stripe pour afficher le formulaire de carte
   * @throws {UserSubscriptionAPIError} Si l'API échoue
   */
  async updatePaymentMethod(): Promise<APIUpdatePaymentResponse> {
    // Mode mock : utiliser les données fictives
    if (USE_MOCK) {
      try {
        return await mockUpdateOneClickPaymentAPI()
      } catch (error) {
        throw new UserSubscriptionAPIError(
          'Erreur lors du chargement du mock',
          undefined,
          error as Error
        )
      }
    }

    try {
      const result = await apiClient.post<APIUpdatePaymentResponse>(
        API_CONFIG.ENDPOINTS.UPDATE_PAYMENT
      )

      if (!result || result.status !== 'success') {
        throw new UserSubscriptionAPIError(
          result?.message || 'Erreur lors de la mise à jour du moyen de paiement'
        )
      }

      return result
    } catch (error) {
      if (error instanceof UserSubscriptionAPIError) {
        throw error
      }

      // Gestion des erreurs Axios
      const axiosError = error as {
        response?: { status: number; statusText: string }
        request?: unknown
      }

      if (axiosError.response) {
        throw new UserSubscriptionAPIError(
          `Erreur HTTP: ${axiosError.response.status} ${axiosError.response.statusText}`,
          axiosError.response.status
        )
      }

      if (axiosError.request) {
        throw new UserSubscriptionAPIError('Aucune réponse du serveur')
      }

      if (error instanceof Error) {
        throw new UserSubscriptionAPIError(
          `Erreur lors de la mise à jour du moyen de paiement: ${error.message}`,
          undefined,
          error
        )
      }

      throw new UserSubscriptionAPIError(
        'Erreur inconnue lors de la mise à jour du moyen de paiement'
      )
    }
  }
}

// Export de l'instance singleton
export const userSubscriptionService = new UserSubscriptionService()
