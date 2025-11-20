/**
 * Store Pinia pour la gestion des consultations
 * Gère le cache, le chargement et les états d'erreur
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  APIWebinar,
  APIWebinarListResponse,
  FilterCategory,
} from '@/types/consultations-api.types'
import { apiTagToFilterCategory } from '@/types/consultations-api.types'
import { consultationsService, ConsultationsAPIError } from '@/services/consultations.service'

/**
 * Configuration du cache
 */
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes (réduit pour voir les mises à jour plus vite)
  STORAGE_KEY: 'jdp_consultations_cache',
  VERSION: '2.0', // Pour invalider le cache en cas de changement de structure
} as const

/**
 * Structure du cache en localStorage
 */
interface CacheData {
  data: APIWebinarListResponse
  timestamp: number
  version: string
}

/**
 * Store des consultations
 */
export const useConsultationsStore = defineStore('consultations', () => {
  // === État ===
  const webinars = ref<APIWebinar[]>([])
  const lastWebinarId = ref<number>(0)
  const nextWebinarId = ref<number>(0)
  const isLoading = ref<boolean>(false)
  const error = ref<ConsultationsAPIError | null>(null)
  const lastFetchTime = ref<number>(0)

  // === Getters (computed) ===

  /**
   * Tous les webinaires en replay (passés)
   * lastWebinarId est un INDEX dans le tableau, pas un ID
   */
  const replays = computed(() => {
    return webinars.value.slice(0, lastWebinarId.value + 1)
  })

  /**
   * Tous les webinaires à venir (futurs)
   * nextWebinarId est un INDEX dans le tableau, pas un ID
   */
  const upcoming = computed(() => {
    return webinars.value.slice(nextWebinarId.value)
  })

  /**
   * Webinaires en replay filtrés par catégorie
   */
  const getReplaysByCategory = computed(() => {
    return (categories: Set<FilterCategory>) => {
      return replays.value
        .filter((w) => {
          const category = apiTagToFilterCategory(w.tag)
          return categories.has(category)
        })
        .sort((a, b) => parseInt(b.id) - parseInt(a.id)) // Plus récent d'abord
    }
  })

  /**
   * Webinaires à venir filtrés par catégorie
   */
  const getUpcomingByCategory = computed(() => {
    return (categories: Set<FilterCategory>) => {
      return upcoming.value
        .filter((w) => {
          const category = apiTagToFilterCategory(w.tag)
          return categories.has(category)
        })
        .sort((a, b) => parseInt(a.id) - parseInt(b.id)) // Plus proche d'abord
    }
  })

  /**
   * Obtenir un webinaire par son ID
   */
  const getWebinarById = computed(() => {
    return (id: number | string) => {
      const idNum = typeof id === 'string' ? parseInt(id) : id
      return webinars.value.find((w) => parseInt(w.id) === idNum)
    }
  })

  /**
   * Vérifier si le cache est valide
   */
  const isCacheValid = computed(() => {
    if (lastFetchTime.value === 0) return false
    const now = Date.now()
    return now - lastFetchTime.value < CACHE_CONFIG.TTL
  })

  /**
   * Vérifier si des données sont présentes
   */
  const hasData = computed(() => {
    return webinars.value.length > 0
  })

  // === Actions ===

  /**
   * Charger depuis le localStorage
   */
  function loadFromLocalStorage(): boolean {
    try {
      const cached = localStorage.getItem(CACHE_CONFIG.STORAGE_KEY)
      if (!cached) return false

      const cacheData: CacheData = JSON.parse(cached)

      // Vérifier la version
      if (cacheData.version !== CACHE_CONFIG.VERSION) {
        localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY)
        return false
      }

      // Vérifier la validité temporelle
      const now = Date.now()
      if (now - cacheData.timestamp > CACHE_CONFIG.TTL) {
        localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY)
        return false
      }

      // Charger les données
      webinars.value = cacheData.data.webinar
      lastWebinarId.value = cacheData.data.lastWebinar
      nextWebinarId.value = cacheData.data.nextWebinar
      lastFetchTime.value = cacheData.timestamp

      return true
    } catch (error) {
      console.error('Erreur lors du chargement du cache:', error)
      localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY)
      return false
    }
  }

  /**
   * Sauvegarder dans le localStorage
   */
  function saveToLocalStorage(data: APIWebinarListResponse): void {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        version: CACHE_CONFIG.VERSION,
      }
      localStorage.setItem(CACHE_CONFIG.STORAGE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du cache:', error)
    }
  }

  /**
   * Récupérer les consultations (avec cache intelligent)
   */
  async function fetchConsultations(forceRefresh = false): Promise<void> {
    // Si on a déjà des données valides et pas de forceRefresh, ne rien faire
    if (!forceRefresh && hasData.value && isCacheValid.value) {
      return
    }

    // Essayer de charger depuis le localStorage d'abord
    if (!forceRefresh && loadFromLocalStorage()) {
      return
    }

    // Sinon, charger depuis l'API
    isLoading.value = true
    error.value = null

    try {
      const data = await consultationsService.fetchWebinarList()

      // Mettre à jour l'état
      webinars.value = data.webinar
      lastWebinarId.value = data.lastWebinar
      nextWebinarId.value = data.nextWebinar
      lastFetchTime.value = Date.now()

      // Sauvegarder dans le localStorage
      saveToLocalStorage(data)
    } catch (err) {
      error.value = err instanceof ConsultationsAPIError
        ? err
        : new ConsultationsAPIError('Erreur inconnue')

      // En cas d'erreur, essayer de charger depuis le cache même expiré
      if (!hasData.value) {
        loadFromLocalStorage()
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Invalider le cache et forcer le rechargement
   */
  async function refresh(): Promise<void> {
    localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY)
    lastFetchTime.value = 0
    await fetchConsultations(true)
  }

  /**
   * Réinitialiser complètement le store
   */
  function reset(): void {
    webinars.value = []
    lastWebinarId.value = 0
    nextWebinarId.value = 0
    isLoading.value = false
    error.value = null
    lastFetchTime.value = 0
    localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY)
  }

  // === Return ===
  return {
    // État
    webinars,
    lastWebinarId,
    nextWebinarId,
    isLoading,
    error,
    lastFetchTime,

    // Getters
    replays,
    upcoming,
    getReplaysByCategory,
    getUpcomingByCategory,
    getWebinarById,
    isCacheValid,
    hasData,

    // Actions
    fetchConsultations,
    refresh,
    reset,
  }
})
