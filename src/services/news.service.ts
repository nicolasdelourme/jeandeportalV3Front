/**
 * Service API pour les actualités
 * Gestion des appels à l'API des contenus éditoriaux
 */

import { apiClient } from '@/api/client'
import type { NewsItem, PaginatedNews, NewsQueryParams } from '@/types/news.types'
import { NewsError, NEWS_CONFIG } from '@/types/news.types'
import {
  mockFetchNews,
  mockFetchNewsItem,
  mockFetchTrending,
  mockFetchLatest,
  mockFetchFeatured,
} from '@/api/news.mock'

// MOCK MODE : Contrôlé par VITE_API_MODE ou VITE_NEWS_MOCK (pour prod sans backend news)
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock' || import.meta.env.VITE_NEWS_MOCK === 'true'

/**
 * Configuration de l'API News
 */
const API_CONFIG = {
  ENDPOINTS: {
    NEWS: '/news',
    TRENDING: '/news/trending',
    LATEST: '/news/latest',
    FEATURED: '/news/featured',
  },
  TIMEOUT: 30000,
} as const

/**
 * Service singleton pour les appels API News
 */
class NewsService {
  private abortController: AbortController | null = null

  /**
   * Récupère la liste paginée des actualités
   */
  async fetchNews(params?: NewsQueryParams): Promise<PaginatedNews> {
    if (USE_MOCK) {
      return mockFetchNews(params)
    }

    this.cancelRequest()
    this.abortController = new AbortController()

    try {
      const timeoutId = setTimeout(() => {
        this.abortController?.abort()
      }, API_CONFIG.TIMEOUT)

      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.set('page', String(params.page))
      if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize))
      if (params?.type) queryParams.set('type', params.type)

      const url = queryParams.toString()
        ? `${API_CONFIG.ENDPOINTS.NEWS}?${queryParams}`
        : API_CONFIG.ENDPOINTS.NEWS

      const data = await apiClient.get<PaginatedNews>(url, {
        signal: this.abortController.signal,
      })

      clearTimeout(timeoutId)

      // Convertir les dates string en Date
      return {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
        })),
      }
    } catch (error) {
      if (error instanceof NewsError) throw error

      const axiosError = error as {
        response?: { status: number; statusText: string }
        request?: unknown
        code?: string
        name?: string
      }

      if (axiosError.response) {
        throw new NewsError(
          `Erreur HTTP: ${axiosError.response.status} ${axiosError.response.statusText}`,
          'API_ERROR'
        )
      }

      if (axiosError.request) {
        if (axiosError.code === 'ECONNABORTED' || axiosError.name === 'AbortError') {
          throw new NewsError('Requête annulée ou timeout', 'API_ERROR')
        }
        throw new NewsError('Aucune réponse du serveur', 'API_ERROR')
      }

      throw new NewsError('Erreur lors de la récupération des actualités', 'API_ERROR')
    } finally {
      this.abortController = null
    }
  }

  /**
   * Récupère une actualité par son slug
   */
  async fetchNewsItem(slug: string): Promise<NewsItem> {
    if (USE_MOCK) {
      const item = await mockFetchNewsItem(slug)
      if (!item) {
        throw new NewsError(`Actualité non trouvée: ${slug}`, 'NOT_FOUND')
      }
      return item
    }

    try {
      const data = await apiClient.get<NewsItem>(`${API_CONFIG.ENDPOINTS.NEWS}/${slug}`)

      return {
        ...data,
        publishedAt: new Date(data.publishedAt),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      }
    } catch (error) {
      const axiosError = error as { response?: { status: number } }

      if (axiosError.response?.status === 404) {
        throw new NewsError(`Actualité non trouvée: ${slug}`, 'NOT_FOUND')
      }

      throw new NewsError('Erreur lors de la récupération de l\'actualité', 'API_ERROR')
    }
  }

  /**
   * Récupère les actualités tendances (les plus lues)
   */
  async fetchTrending(): Promise<NewsItem[]> {
    if (USE_MOCK) {
      return mockFetchTrending()
    }

    try {
      const data = await apiClient.get<NewsItem[]>(API_CONFIG.ENDPOINTS.TRENDING)

      return data.map((item) => ({
        ...item,
        publishedAt: new Date(item.publishedAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
      }))
    } catch (error) {
      throw new NewsError('Erreur lors de la récupération des tendances', 'API_ERROR')
    }
  }

  /**
   * Récupère les dernières actualités (En Continu)
   */
  async fetchLatest(limit: number = NEWS_CONFIG.LIVE_FEED_COUNT): Promise<NewsItem[]> {
    if (USE_MOCK) {
      return mockFetchLatest(limit)
    }

    try {
      const data = await apiClient.get<NewsItem[]>(
        `${API_CONFIG.ENDPOINTS.LATEST}?limit=${limit}`
      )

      return data.map((item) => ({
        ...item,
        publishedAt: new Date(item.publishedAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
      }))
    } catch (error) {
      throw new NewsError('Erreur lors de la récupération des dernières actualités', 'API_ERROR')
    }
  }

  /**
   * Récupère l'actualité à la une
   */
  async fetchFeatured(): Promise<NewsItem | null> {
    if (USE_MOCK) {
      return mockFetchFeatured()
    }

    try {
      const data = await apiClient.get<NewsItem | null>(API_CONFIG.ENDPOINTS.FEATURED)

      if (!data) return null

      return {
        ...data,
        publishedAt: new Date(data.publishedAt),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      }
    } catch (error) {
      throw new NewsError('Erreur lors de la récupération de l\'actualité à la une', 'API_ERROR')
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
export const newsService = new NewsService()
