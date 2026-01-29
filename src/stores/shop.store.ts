/**
 * Store Pinia pour la boutique
 * Gestion du catalogue produits avec cache intelligent (memory + localStorage)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { shopService } from '@/services/shop.service'
import { logger } from '@/utils/logger'
import type {
  ShopCatalogResponse,
  ShopReference,
  ShopSortOption,
  ShopCollectionFilter,
  ShopTagFilter,
  ParsedTag,
} from '@/types/shop-api.types'
import { getAllTags, getAllCollections, getFilterTags } from '@/types/shop-api.types'
import { ShopAPIError } from '@/types/shop-api.types'

/**
 * Clé localStorage pour le cache
 */
const CACHE_KEY = 'jdp_shop_catalog_cache'

/**
 * Version du cache - Incrémenter quand la structure change
 */
const CACHE_VERSION = '2.0'

/**
 * Durée du cache en millisecondes (5 minutes)
 * Réduit pour que les utilisateurs voient les mises à jour plus rapidement
 */
const CACHE_DURATION = 5 * 60 * 1000

/**
 * Structure du cache localStorage
 */
interface CacheData {
  version: string
  catalog: ShopCatalogResponse
  timestamp: number
}


export const useShopStore = defineStore('shop', () => {
  // ============================================================================
  // État
  // ============================================================================

  /**
   * Catalogue complet des références produits
   */
  const catalog = ref<ShopCatalogResponse>({ references: [] })

  /**
   * État de chargement
   */
  const isLoading = ref(false)

  /**
   * Erreur éventuelle
   */
  const error = ref<ShopAPIError | null>(null)

  /**
   * Timestamp du dernier chargement réussi
   */
  const lastFetchTimestamp = ref<number>(0)

  /**
   * Filtres actifs
   */
  const activeCollectionFilters = ref<Set<ShopCollectionFilter>>(new Set())
  const activeTagFilters = ref<Set<ShopTagFilter>>(new Set())
  const searchQuery = ref<string>('')
  const activeSortOption = ref<ShopSortOption>('newest')

  // ============================================================================
  // Getters
  // ============================================================================

  /**
   * Toutes les références du catalogue
   */
  const references = computed(() => catalog.value.references)

  /**
   * Cache des prix min/max par référence
   * Calculé une seule fois quand le catalogue change (pas à chaque accès getter)
   */
  const priceDataByReference = computed(() => {
    const priceMap = new Map<string, { min: number; max: number }>()

    for (const ref of references.value) {
      const allPrices = ref.products.flatMap((p) => p.prices.map((price) => price.amount))
      priceMap.set(ref.id, {
        min: allPrices.length > 0 ? Math.min(...allPrices) : Infinity,
        max: allPrices.length > 0 ? Math.max(...allPrices) : -Infinity,
      })
    }

    return priceMap
  })

  /**
   * Toutes les collections uniques disponibles
   */
  const availableCollections = computed(() => {
    return getAllCollections(references.value)
  })

  /**
   * Tous les tags uniques disponibles
   */
  const availableTags = computed(() => {
    return getAllTags(references.value)
  })

  /**
   * Références filtrées par collection, tags et recherche
   */
  const filteredReferences = computed(() => {
    let filtered = references.value

    // Filtre par collections (OU logique: doit être dans AU MOINS une collection sélectionnée)
    if (activeCollectionFilters.value.size > 0) {
      filtered = filtered.filter((ref) => activeCollectionFilters.value.has(ref.collectionId))
    }

    // Filtre par tags (OU logique: doit avoir AU MOINS UN des tags sélectionnés)
    if (activeTagFilters.value.size > 0) {
      filtered = filtered.filter((ref) => {
        return Array.from(activeTagFilters.value).some((tag) => ref.tags.includes(tag))
      })
    }

    // Filtre par recherche textuelle (nom + description + technicalReference)
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter((ref) => {
        return (
          ref.name.toLowerCase().includes(query) ||
          ref.description.toLowerCase().includes(query) ||
          ref.technicalReference.toLowerCase().includes(query)
        )
      })
    }

    return filtered
  })

  /**
   * Tags de filtre disponibles (préfixe "filter_") en fonction des collections sélectionnées
   * Retourne des ParsedTag avec displayName pour l'affichage
   */
  const availableTagsFiltered = computed((): ParsedTag[] => {
    let refs = references.value

    // Si des collections sont sélectionnées, filtrer uniquement sur ces collections
    if (activeCollectionFilters.value.size > 0) {
      refs = refs.filter((ref) => activeCollectionFilters.value.has(ref.collectionId))
    }

    return getFilterTags(refs)
  })

  /**
   * Références filtrées ET triées
   * Optimisé: pré-calcul des prix pour éviter O(n*m) dans chaque comparaison
   */
  const sortedReferences = computed(() => {
    const filtered = filteredReferences.value
    const sortOption = activeSortOption.value

    // Tris simples sans pré-calcul nécessaire
    if (sortOption === 'name-asc') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    }

    if (sortOption === 'name-desc') {
      return [...filtered].sort((a, b) => b.name.localeCompare(a.name, 'fr'))
    }

    if (sortOption === 'newest') {
      return [...filtered].sort((a, b) => parseInt(b.id) - parseInt(a.id))
    }

    if (sortOption === 'oldest') {
      return [...filtered].sort((a, b) => parseInt(a.id) - parseInt(b.id))
    }

    // Tris par prix: utilise le cache pré-calculé (priceDataByReference)
    if (sortOption === 'price-asc' || sortOption === 'price-desc') {
      const priceCache = priceDataByReference.value

      if (sortOption === 'price-asc') {
        return [...filtered].sort((a, b) => {
          return (priceCache.get(a.id)?.min ?? Infinity) - (priceCache.get(b.id)?.min ?? Infinity)
        })
      }

      // price-desc
      return [...filtered].sort((a, b) => {
        return (priceCache.get(b.id)?.max ?? -Infinity) - (priceCache.get(a.id)?.max ?? -Infinity)
      })
    }

    return [...filtered]
  })

  /**
   * Vérifie si le cache est encore valide
   */
  const isCacheValid = computed(() => {
    if (lastFetchTimestamp.value === 0) return false
    const now = Date.now()
    return now - lastFetchTimestamp.value < CACHE_DURATION
  })

  /**
   * Nombre de résultats après filtrage
   */
  const resultsCount = computed(() => sortedReferences.value.length)

  /**
   * Vérifie si des filtres sont actifs
   */
  const hasActiveFilters = computed(() => {
    return (
      activeCollectionFilters.value.size > 0 ||
      activeTagFilters.value.size > 0 ||
      searchQuery.value.trim() !== ''
    )
  })

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Charge le catalogue depuis localStorage (si valide)
   */
  const loadFromLocalStorage = (): boolean => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return false

      const cacheData: CacheData = JSON.parse(cached)
      const now = Date.now()

      // Vérifier la version du cache frontend
      if (!cacheData.version || cacheData.version !== CACHE_VERSION) {
        localStorage.removeItem(CACHE_KEY)
        return false
      }

      // Vérifier si le cache est encore valide temporellement
      if (now - cacheData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return false
      }

      // Restaurer les données
      catalog.value = cacheData.catalog
      lastFetchTimestamp.value = cacheData.timestamp

      return true
    } catch (err) {
      localStorage.removeItem(CACHE_KEY)
      return false
    }
  }

  /**
   * Sauvegarde le catalogue dans localStorage
   */
  const saveToLocalStorage = () => {
    try {
      const cacheData: CacheData = {
        version: CACHE_VERSION,
        catalog: catalog.value,
        timestamp: lastFetchTimestamp.value,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (err) {
      logger.warn('Failed to save shop catalog to localStorage:', err)
    }
  }

  /**
   * Récupère le catalogue depuis l'API
   */
  const fetchCatalog = async (force = false): Promise<void> => {
    // Si le cache est valide et qu'on ne force pas le refresh, ne rien faire
    if (!force && isCacheValid.value && catalog.value.references.length > 0) {
      return
    }

    // Si on a déjà des données en cache localStorage, les utiliser
    if (!force && loadFromLocalStorage()) {
      return
    }

    // Charger depuis l'API
    isLoading.value = true
    error.value = null

    try {
      const data = await shopService.fetchCatalog()
      catalog.value = data
      lastFetchTimestamp.value = Date.now()

      // Sauvegarder dans localStorage
      saveToLocalStorage()

    } catch (err) {
      error.value = err instanceof ShopAPIError ? err : new ShopAPIError('Erreur inconnue')
      logger.error('❌ Failed to fetch shop catalog:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Force le rechargement du catalogue (ignore le cache)
   */
  const refresh = async (): Promise<void> => {
    await fetchCatalog(true)
  }

  /**
   * Toggle une collection dans les filtres actifs
   */
  const toggleCollectionFilter = (collectionId: ShopCollectionFilter) => {
    if (activeCollectionFilters.value.has(collectionId)) {
      activeCollectionFilters.value.delete(collectionId)
    } else {
      activeCollectionFilters.value.add(collectionId)
    }
    // Force la réactivité
    activeCollectionFilters.value = new Set(activeCollectionFilters.value)
  }

  /**
   * Toggle un tag dans les filtres actifs
   */
  const toggleTagFilter = (tag: ShopTagFilter) => {
    if (activeTagFilters.value.has(tag)) {
      activeTagFilters.value.delete(tag)
    } else {
      activeTagFilters.value.add(tag)
    }
    // Force la réactivité
    activeTagFilters.value = new Set(activeTagFilters.value)
  }

  /**
   * Réinitialise tous les filtres de collections
   */
  const clearCollectionFilters = () => {
    activeCollectionFilters.value.clear()
    activeCollectionFilters.value = new Set()
  }

  /**
   * Réinitialise tous les filtres de tags
   */
  const clearTagFilters = () => {
    activeTagFilters.value.clear()
    activeTagFilters.value = new Set()
  }

  /**
   * Définit la requête de recherche
   */
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  /**
   * Définit l'option de tri active
   */
  const setSortOption = (option: ShopSortOption) => {
    activeSortOption.value = option
  }

  /**
   * Réinitialise tous les filtres et la recherche
   */
  const resetFilters = () => {
    activeCollectionFilters.value.clear()
    activeTagFilters.value.clear()
    searchQuery.value = ''
    activeSortOption.value = 'newest'
  }

  /**
   * Trouve une référence par son ID
   */
  const findReferenceById = (id: string): ShopReference | undefined => {
    return references.value.find((ref) => ref.id === id)
  }

  /**
   * Vide complètement le cache (mémoire + localStorage) et réinitialise le store
   */
  const clearCache = () => {
    catalog.value = { references: [] }
    lastFetchTimestamp.value = 0
    localStorage.removeItem(CACHE_KEY)
    resetFilters()
  }

  // ============================================================================
  // Retour du store
  // ============================================================================

  return {
    // État
    catalog,
    isLoading,
    error,
    lastFetchTimestamp,
    activeCollectionFilters,
    activeTagFilters,
    searchQuery,
    activeSortOption,

    // Getters
    references,
    availableCollections,
    availableTags,
    availableTagsFiltered,
    filteredReferences,
    sortedReferences,
    isCacheValid,
    resultsCount,
    hasActiveFilters,

    // Actions
    fetchCatalog,
    refresh,
    clearCache,
    toggleCollectionFilter,
    toggleTagFilter,
    clearCollectionFilters,
    clearTagFilters,
    setSearchQuery,
    setSortOption,
    resetFilters,
    findReferenceById,
  }
})
