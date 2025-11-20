/**
 * Service pour la gestion des consultations
 * Gère les appels API et la logique métier
 */

import type { APIWebinarListResponse } from '@/types/consultations-api.types'

/**
 * Mode mock pour développement
 * IMPORTANT: Passer à false quand l'API backend sera prête
 */
const USE_MOCK = true

/**
 * Configuration du service
 */
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://jeandeportal.fr',
  ENDPOINTS: {
    WEBINAR_LIST: '/api/fetchWebinarList',
  },
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes en millisecondes
  TIMEOUT: 30000, // 30 secondes (l'API peut être lente)
} as const

/**
 * Classe d'erreur personnalisée pour les erreurs API
 */
export class ConsultationsAPIError extends Error {
  status?: number
  originalError?: unknown

  constructor(message: string, status?: number, originalError?: unknown) {
    super(message)
    this.name = 'ConsultationsAPIError'
    this.status = status
    this.originalError = originalError
  }
}

/**
 * Service pour gérer les consultations
 */
class ConsultationsService {
  private abortController: AbortController | null = null

  /**
   * Récupère la liste complète des webinaires depuis l'API ou les données mock
   * @throws {ConsultationsAPIError} Si l'API échoue ou timeout
   */
  async fetchWebinarList(): Promise<APIWebinarListResponse> {
    // Mode mock : charger les données depuis le fichier JSON local
    if (USE_MOCK) {
      return this.fetchWebinarListMock()
    }

    // Mode production : appeler l'API réelle
    return this.fetchWebinarListAPI()
  }

  /**
   * Récupère les données depuis le fichier JSON local (mode développement)
   */
  private async fetchWebinarListMock(): Promise<APIWebinarListResponse> {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      // Charger le fichier JSON local
      const response = await fetch('/src/data/consultations.json')

      if (!response.ok) {
        throw new ConsultationsAPIError(
          'Impossible de charger les données mock',
          response.status
        )
      }

      const data: APIWebinarListResponse = await response.json()

      // Validation basique de la structure
      if (!data.webinar || !Array.isArray(data.webinar)) {
        throw new ConsultationsAPIError('Structure de données mock invalide')
      }

      console.info('🔧 Mode développement : Données consultations chargées depuis le fichier local')

      return data
    } catch (error) {
      if (error instanceof ConsultationsAPIError) {
        throw error
      }

      throw new ConsultationsAPIError(
        'Erreur lors du chargement des données mock',
        undefined,
        error
      )
    }
  }

  /**
   * Récupère la liste complète des webinaires depuis l'API backend
   */
  private async fetchWebinarListAPI(): Promise<APIWebinarListResponse> {
    // Annuler la requête précédente si elle existe
    if (this.abortController) {
      this.abortController.abort()
    }

    this.abortController = new AbortController()

    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEBINAR_LIST}`

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
        throw new ConsultationsAPIError(
          `Erreur HTTP: ${response.status} ${response.statusText}`,
          response.status
        )
      }

      const data: APIWebinarListResponse = await response.json()

      // Validation basique de la structure
      if (!data.webinar || !Array.isArray(data.webinar)) {
        throw new ConsultationsAPIError('Structure de réponse API invalide')
      }

      return data
    } catch (error) {
      if (error instanceof ConsultationsAPIError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ConsultationsAPIError('Requête annulée ou timeout')
        }

        throw new ConsultationsAPIError(
          `Erreur lors de la récupération des consultations: ${error.message}`,
          undefined,
          error
        )
      }

      throw new ConsultationsAPIError('Erreur inconnue lors de la récupération des consultations')
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
   * Vérifie si on est en mode mock
   */
  isUsingMock(): boolean {
    return USE_MOCK
  }
}

// Export d'une instance singleton
export const consultationsService = new ConsultationsService()

// Export de la classe pour les tests
export { ConsultationsService }
