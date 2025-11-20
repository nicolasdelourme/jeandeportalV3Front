/**
 * Service API pour la boutique
 * Gestion des appels à l'API du catalogue produits
 */

import type { ShopCatalogResponse, APIRawResponse } from '@/types/shop-api.types'
import { ShopAPIError, mapAPIResponseToShopCatalog } from '@/types/shop-api.types'

/**
 * Configuration de l'API Shop
 */
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://jeandeportal.fr',
  ENDPOINTS: {
    CATALOG: '/api/fetchStore',
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
    // Annuler la requête précédente si elle existe
    if (this.abortController) {
      this.abortController.abort()
    }

    this.abortController = new AbortController()

    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATALOG}`

      console.log(`📡 Fetching shop catalog from: ${url}`)

      // Timeout de la requête
      const timeoutId = setTimeout(() => {
        this.abortController?.abort()
      }, API_CONFIG.TIMEOUT)

      const response = await fetch(url, {
        method: 'GET',
        signal: this.abortController.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new ShopAPIError(
          `Erreur HTTP: ${response.status} ${response.statusText}`,
          response.status
        )
      }

      const rawData: APIRawResponse = await response.json()

      // Validation basique de la structure
      if (!Array.isArray(rawData)) {
        throw new ShopAPIError('Structure de réponse API invalide: doit être un tableau')
      }

      // Mapper les données brutes vers notre modèle normalisé
      const data = mapAPIResponseToShopCatalog(rawData)

      console.log(`✅ Shop catalog loaded: ${data.references.length} references`)

      return data
    } catch (error) {
      if (error instanceof ShopAPIError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ShopAPIError('Requête annulée ou timeout')
        }

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
