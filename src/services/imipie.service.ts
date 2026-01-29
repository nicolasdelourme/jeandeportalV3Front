/**
 * Service API pour imiPie - Graphiques Highcharts
 * Gestion des appels à l'API imiPie pour récupérer les données de graphiques
 */

import type { ImiPieChartParams, ImiPieChartResponse } from '@/types/imipie.types'
import { ImiPieAPIError } from '@/types/imipie.types'
import { mockFetchChart } from '@/api/imipie.mock'

// MOCK MODE : Contrôlé par VITE_API_MODE
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

/**
 * Configuration de l'API imiPie
 */
const API_CONFIG = {
  BASE_URL: 'https://imipie.ovh/api',
  DEFAULT_PROFILE: 'infocashWeb',
  TIMEOUT: 30000, // 30 secondes
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const

/**
 * Interface pour les entrées du cache
 */
interface CacheEntry {
  data: ImiPieChartResponse
  timestamp: number
}

/**
 * Service singleton pour les appels API imiPie
 */
class ImiPieService {
  private cache: Map<string, CacheEntry> = new Map()
  private pendingRequests: Map<string, Promise<ImiPieChartResponse>> = new Map()

  /**
   * Génère une clé de cache unique pour les paramètres
   */
  private getCacheKey(params: ImiPieChartParams): string {
    return JSON.stringify({
      family: params.family,
      serie: params.serie,
      profile: params.profile || API_CONFIG.DEFAULT_PROFILE,
      startDate: params.startDate,
      stopDate: params.stopDate,
      xTick: params.xTick,
    })
  }

  /**
   * Vérifie si une entrée du cache est valide
   */
  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < API_CONFIG.CACHE_TTL
  }

  /**
   * Construit l'URL de l'API avec les paramètres
   */
  private buildUrl(params: ImiPieChartParams): string {
    const url = new URL(
      `${API_CONFIG.BASE_URL}/${params.family}/${params.serie}/highcharts`
    )

    url.searchParams.set('output', 'json')
    url.searchParams.set('profile', params.profile || API_CONFIG.DEFAULT_PROFILE)

    if (params.startDate) {
      url.searchParams.set('startDate', params.startDate)
    }
    if (params.stopDate) {
      url.searchParams.set('stopDate', params.stopDate)
    }
    if (params.xTick) {
      url.searchParams.set('xTick', params.xTick.toString())
    }

    return url.toString()
  }

  /**
   * Récupère les données d'un graphique depuis l'API imiPie
   * @throws {ImiPieAPIError} Si l'API échoue ou timeout
   */
  async fetchChart(params: ImiPieChartParams): Promise<ImiPieChartResponse> {
    const cacheKey = this.getCacheKey(params)

    // Vérifier le cache
    const cached = this.cache.get(cacheKey)
    if (cached && this.isCacheValid(cached)) {
      return cached.data
    }

    // Vérifier si une requête est déjà en cours pour les mêmes paramètres
    const pending = this.pendingRequests.get(cacheKey)
    if (pending) {
      return pending
    }

    // Mode mock : utiliser les données fictives
    if (USE_MOCK) {
      const promise = mockFetchChart(params)
        .then((data) => {
          this.cache.set(cacheKey, { data, timestamp: Date.now() })
          return data
        })
        .finally(() => {
          this.pendingRequests.delete(cacheKey)
        })

      this.pendingRequests.set(cacheKey, promise)
      return promise
    }

    // Mode réel : appeler l'API
    const url = this.buildUrl(params)

    const promise = this.fetchFromAPI(url)
      .then((data) => {
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
        return data
      })
      .finally(() => {
        this.pendingRequests.delete(cacheKey)
      })

    this.pendingRequests.set(cacheKey, promise)
    return promise
  }

  /**
   * Effectue l'appel API réel
   */
  private async fetchFromAPI(url: string): Promise<ImiPieChartResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new ImiPieAPIError(
          `Erreur HTTP: ${response.status} ${response.statusText}`,
          response.status
        )
      }

      const data = await response.json()

      // L'API retourne directement le payload enrichi { type, chart, formatter, sdk }
      // On le retourne tel quel sans encapsulation
      return data as ImiPieChartResponse
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ImiPieAPIError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ImiPieAPIError('Requête annulée ou timeout')
        }
        throw new ImiPieAPIError(
          `Erreur lors de la récupération du graphique: ${error.message}`,
          undefined,
          error
        )
      }

      throw new ImiPieAPIError('Erreur inconnue lors de la récupération du graphique')
    }
  }

  /**
   * Vide le cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Supprime une entrée spécifique du cache
   */
  invalidateCache(params: ImiPieChartParams): void {
    const cacheKey = this.getCacheKey(params)
    this.cache.delete(cacheKey)
  }
}

// Export de l'instance singleton
export const imipieService = new ImiPieService()
