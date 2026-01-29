/**
 * Service API pour le catalogue d'abonnements (OneClick)
 * Gestion des appels a l'API du catalogue d'abonnements
 */

import { apiClient } from '@/api/client'
import type {
  SubscriptionCatalogResponse,
  APIRawOneClickCatalogResponse,
} from '@/types/subscription-catalog-api.types'
import {
  SubscriptionCatalogAPIError,
  mapAPIResponseToSubscriptionCatalog,
} from '@/types/subscription-catalog-api.types'
import { mockFetchOneClickCatalogAPI } from '@/api/subscription-catalog.mock'

// MOCK MODE : Controle par VITE_API_MODE
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

/**
 * Configuration de l'API Subscription Catalog
 */
const API_CONFIG = {
  ENDPOINTS: {
    CATALOG: '/fetchOneClickCatalog',
  },
  TIMEOUT: 30000, // 30 secondes
} as const

/**
 * Service singleton pour les appels API Subscription Catalog
 */
class SubscriptionCatalogService {
  private abortController: AbortController | null = null

  /**
   * Recupere le catalogue complet des abonnements
   * @throws {SubscriptionCatalogAPIError} Si l'API echoue ou timeout
   */
  async fetchCatalog(): Promise<SubscriptionCatalogResponse> {
    // Mode mock : utiliser les donnees fictives
    if (USE_MOCK) {
      try {
        const rawData = await mockFetchOneClickCatalogAPI()
        const catalog = mapAPIResponseToSubscriptionCatalog(rawData)
        return { plans: catalog.plans }
      } catch (error) {
        throw new SubscriptionCatalogAPIError(
          'Erreur lors du chargement du mock',
          undefined,
          error as Error
        )
      }
    }

    // Annuler la requete precedente si elle existe
    if (this.abortController) {
      this.abortController.abort()
    }

    this.abortController = new AbortController()

    try {
      // Timeout de la requete
      const timeoutId = setTimeout(() => {
        this.abortController?.abort()
      }, API_CONFIG.TIMEOUT)

      // Appel API
      const rawData = await apiClient.get<APIRawOneClickCatalogResponse>(
        API_CONFIG.ENDPOINTS.CATALOG,
        {
          signal: this.abortController.signal,
        }
      )

      clearTimeout(timeoutId)

      // Validation basique de la structure
      if (!rawData || !rawData.oneClick_array) {
        throw new SubscriptionCatalogAPIError(
          'Structure de reponse API invalide: attendu un objet avec oneClick_array'
        )
      }

      // Mapper les donnees brutes vers notre modele normalise
      const catalog = mapAPIResponseToSubscriptionCatalog(rawData)

      return { plans: catalog.plans }
    } catch (error) {
      if (error instanceof SubscriptionCatalogAPIError) {
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
        // Le serveur a repondu avec un code d'erreur
        throw new SubscriptionCatalogAPIError(
          `Erreur HTTP: ${axiosError.response.status} ${axiosError.response.statusText}`,
          axiosError.response.status
        )
      }

      if (axiosError.request) {
        // La requete a ete faite mais pas de reponse
        if (axiosError.code === 'ECONNABORTED' || axiosError.name === 'AbortError') {
          throw new SubscriptionCatalogAPIError('Requete annulee ou timeout')
        }
        throw new SubscriptionCatalogAPIError('Aucune reponse du serveur')
      }

      // Autre type d'erreur
      if (error instanceof Error) {
        throw new SubscriptionCatalogAPIError(
          `Erreur lors de la recuperation du catalogue: ${error.message}`,
          undefined,
          error
        )
      }

      throw new SubscriptionCatalogAPIError('Erreur inconnue lors de la recuperation du catalogue')
    } finally {
      this.abortController = null
    }
  }

  /**
   * Annule la requete en cours
   */
  cancelRequest(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }
}

// Export de l'instance singleton
export const subscriptionCatalogService = new SubscriptionCatalogService()
