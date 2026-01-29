/**
 * Service API pour les factures de commandes
 * Gestion des appels à l'API /fetchPaidInvoicePerOrder
 */

import { apiClient } from '@/api/client'
import type { APIShopOrdersResponse, ShopOrderInvoice } from '@/types/shop-orders-api.types'
import { ShopOrdersAPIError, mapAPIOrderInvoice } from '@/types/shop-orders-api.types'
import { mockFetchShopOrdersAPI } from '@/api/shop-orders.mock'

// MOCK MODE : Contrôle par VITE_API_MODE
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

/**
 * Configuration de l'API Shop Orders
 */
const API_CONFIG = {
  ENDPOINTS: {
    FETCH: '/fetchPaidInvoicePerOrder',
  },
  TIMEOUT: 30000, // 30 secondes
} as const

/**
 * Service singleton pour les appels API Shop Orders
 */
class ShopOrdersService {
  private abortController: AbortController | null = null

  /**
   * Récupère les factures de commandes de l'utilisateur
   * @throws {ShopOrdersAPIError} Si l'API échoue ou timeout
   */
  async fetchOrders(): Promise<ShopOrderInvoice[]> {
    // Mode mock : utiliser les données fictives
    if (USE_MOCK) {
      try {
        const rawData = await mockFetchShopOrdersAPI()
        return rawData.invoice_array.map(mapAPIOrderInvoice)
      } catch (error) {
        throw new ShopOrdersAPIError(
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
      console.log(`📡 Fetching shop orders from: ${API_CONFIG.ENDPOINTS.FETCH}`)

      // Timeout de la requête
      const timeoutId = setTimeout(() => {
        this.abortController?.abort()
      }, API_CONFIG.TIMEOUT)

      // Appel API
      const rawData = await apiClient.get<APIShopOrdersResponse>(API_CONFIG.ENDPOINTS.FETCH, {
        signal: this.abortController.signal,
      })

      clearTimeout(timeoutId)

      // Debug: logger la réponse brute complète
      console.log('🔍 [DEBUG] Raw API response:', JSON.stringify(rawData, null, 2))

      // Validation flexible de la structure
      // L'API peut renvoyer:
      // - { status: 'success', invoice_array: [...] }
      // - { invoice_array: [...] } (sans status)
      // - Directement un array [...]
      let invoiceArray: unknown[] = []

      if (Array.isArray(rawData)) {
        // Format: réponse directe en array
        invoiceArray = rawData
      } else if (rawData && typeof rawData === 'object') {
        // Vérifier si erreur explicite
        if (rawData.status === 'error') {
          throw new ShopOrdersAPIError(rawData.message || 'Erreur API')
        }
        // Format: objet avec invoice_array
        invoiceArray = rawData.invoice_array || []
      } else {
        console.error('🔍 [DEBUG] Invalid response structure:', rawData)
        throw new ShopOrdersAPIError('Structure de réponse API invalide')
      }

      console.log(`📡 Received ${invoiceArray.length} order invoices`)

      // Mapper les données brutes vers notre modèle normalisé
      const result = invoiceArray.map((item) => mapAPIOrderInvoice(item as import('@/types/shop-orders-api.types').APIRawOrderInvoice))

      console.log(`✅ Shop orders loaded: ${result.length} invoices`)

      return result
    } catch (error) {
      if (error instanceof ShopOrdersAPIError) {
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
        throw new ShopOrdersAPIError(
          `Erreur HTTP: ${axiosError.response.status} ${axiosError.response.statusText}`,
          axiosError.response.status
        )
      }

      if (axiosError.request) {
        // La requête a été faite mais pas de réponse
        if (axiosError.code === 'ECONNABORTED' || axiosError.name === 'AbortError') {
          throw new ShopOrdersAPIError('Requête annulée ou timeout')
        }
        throw new ShopOrdersAPIError('Aucune réponse du serveur')
      }

      // Autre type d'erreur
      if (error instanceof Error) {
        throw new ShopOrdersAPIError(
          `Erreur lors de la récupération des commandes: ${error.message}`,
          undefined,
          error
        )
      }

      throw new ShopOrdersAPIError('Erreur inconnue lors de la récupération des commandes')
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
export const shopOrdersService = new ShopOrdersService()
