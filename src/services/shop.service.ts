/**
 * Service API pour la boutique
 * Gestion des appels à l'API du catalogue produits
 */

import { apiClient } from '@/api/client'
import type { ShopCatalogResponse, APIRawStoreResponse } from '@/types/shop-api.types'
import { ShopAPIError, mapAPIResponseToShopCatalog } from '@/types/shop-api.types'
import { mockFetchCatalogAPI } from '@/api/shop.mock'

// MOCK MODE : Contrôlé par VITE_API_MODE
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

/**
 * Configuration de l'API Shop
 */
const API_CONFIG = {
  ENDPOINTS: {
    CATALOG: '/fetchStore',
  },
  TIMEOUT: 30000, // 30 secondes
} as const

/**
 * Service singleton pour les appels API Shop
 */
class ShopService {
  private abortController: AbortController | null = null

  /**
   * Récupère le catalogue complet de la boutique
   * @throws {ShopAPIError} Si l'API échoue ou timeout
   */
  async fetchCatalog(): Promise<ShopCatalogResponse> {
    // Mode mock : utiliser les données fictives
    if (USE_MOCK) {
      try {
        const rawData = await mockFetchCatalogAPI()
        return mapAPIResponseToShopCatalog(rawData)
      } catch (error) {
        throw new ShopAPIError('Erreur lors du chargement du mock', undefined, error as Error)
      }
    }

    // Annuler la requête précédente si elle existe
    if (this.abortController) {
      this.abortController.abort()
    }

    this.abortController = new AbortController()

    try {
      console.log(`📡 Fetching shop catalog from: ${API_CONFIG.ENDPOINTS.CATALOG}`)

      // Timeout de la requête
      const timeoutId = setTimeout(() => {
        this.abortController?.abort()
      }, API_CONFIG.TIMEOUT)

      // Utilisation d'apiClient au lieu de fetch() manuel
      // Cela évite les problèmes de conversion de path sur Git Bash Windows
      // et utilise automatiquement le proxy Vite en dev
      // Note: apiClient.get() retourne directement les données (pas besoin de .data)
      const rawData = await apiClient.get<APIRawStoreResponse>(
        API_CONFIG.ENDPOINTS.CATALOG,
        {
          signal: this.abortController.signal,
        }
      )

      clearTimeout(timeoutId)

      // Validation basique de la structure (nouvelle structure avec category_array)
      if (!rawData || !rawData.category_array) {
        console.error('🔍 [DEBUG] Invalid response structure:', {
          type: typeof rawData,
          hasCategories: rawData && 'category_array' in rawData,
          sample: rawData
        })
        throw new ShopAPIError('Structure de réponse API invalide: attendu un objet avec category_array')
      }

      console.log(`📡 Received store "${rawData.name}" with ${rawData.category_array.length} categories`)

      // Mapper les données brutes vers notre modèle normalisé
      const data = mapAPIResponseToShopCatalog(rawData)

      console.log(`✅ Shop catalog loaded: ${data.references.length} references`)

      return data
    } catch (error: any) {
      if (error instanceof ShopAPIError) {
        throw error
      }

      // Gestion des erreurs Axios
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        throw new ShopAPIError(
          `Erreur HTTP: ${error.response.status} ${error.response.statusText}`,
          error.response.status
        )
      }

      if (error.request) {
        // La requête a été faite mais pas de réponse
        if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
          throw new ShopAPIError('Requête annulée ou timeout')
        }
        throw new ShopAPIError('Aucune réponse du serveur')
      }

      // Autre type d'erreur
      if (error instanceof Error) {
        throw new ShopAPIError(
          `Erreur lors de la récupération du catalogue: ${error.message}`,
          undefined,
          error
        )
      }

      throw new ShopAPIError('Erreur inconnue lors de la récupération du catalogue')
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
}

// Export de l'instance singleton
export const shopService = new ShopService()
