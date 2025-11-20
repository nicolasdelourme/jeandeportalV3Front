/**
 * Composable pour utiliser facilement les consultations
 * Simplifie l'utilisation du store avec gestion automatique du chargement
 */

import { computed, onMounted, ref } from 'vue'
import { useConsultationsStore } from '@/stores/consultations.store'
import type { FilterCategory } from '@/types/consultations-api.types'

/**
 * Options pour le composable
 */
interface UseConsultationsOptions {
  /**
   * Charger automatiquement les données au montage
   * @default true
   */
  autoLoad?: boolean

  /**
   * Filtres de catégories par défaut
   * @default ['argent', 'metaux', 'patrimoine', 'immobilier']
   */
  defaultFilters?: FilterCategory[]

  /**
   * Type de webinaires à afficher
   * @default 'replays' - Consultations passées
   */
  type?: 'replays' | 'upcoming' | 'all'
}

/**
 * Composable pour gérer les consultations
 *
 * @example
 * ```vue
 * <script setup>
 * import { useConsultations } from '@/composables/useConsultations'
 *
 * const { webinars, isLoading, error, toggleFilter, refresh } = useConsultations()
 * </script>
 * ```
 */
export function useConsultations(options: UseConsultationsOptions = {}) {
  const {
    autoLoad = true,
    defaultFilters = ['argent', 'metaux', 'patrimoine', 'immobilier'],
    type = 'replays',
  } = options

  // Store Pinia
  const store = useConsultationsStore()

  // État local des filtres
  const activeFilters = ref<Set<FilterCategory>>(new Set(defaultFilters))

  // === Computed ===

  /**
   * Webinaires filtrés selon le type et les catégories actives
   */
  const webinars = computed(() => {
    if (type === 'replays') {
      return store.getReplaysByCategory(activeFilters.value)
    }
    if (type === 'upcoming') {
      return store.getUpcomingByCategory(activeFilters.value)
    }
    // type === 'all'
    return [...store.replays, ...store.upcoming].filter((w) => {
      const category = w.tag === 'métaux précieux' ? 'metaux' : (w.tag as FilterCategory)
      return activeFilters.value.has(category)
    })
  })

  /**
   * État de chargement
   */
  const isLoading = computed(() => store.isLoading)

  /**
   * Erreur éventuelle
   */
  const error = computed(() => store.error)

  /**
   * Vérifier si des données sont présentes
   */
  const hasData = computed(() => store.hasData)

  /**
   * Vérifier si le cache est valide
   */
  const isCacheValid = computed(() => store.isCacheValid)

  /**
   * Nombre de webinaires affichés
   */
  const count = computed(() => webinars.value.length)

  // === Méthodes ===

  /**
   * Toggle un filtre de catégorie
   */
  const toggleFilter = (filter: FilterCategory) => {
    if (activeFilters.value.has(filter)) {
      activeFilters.value.delete(filter)
    } else {
      activeFilters.value.add(filter)
    }
    // Force la réactivité
    activeFilters.value = new Set(activeFilters.value)
  }

  /**
   * Vérifier si un filtre est actif
   */
  const isFilterActive = (filter: FilterCategory): boolean => {
    return activeFilters.value.has(filter)
  }

  /**
   * Activer tous les filtres
   */
  const enableAllFilters = () => {
    activeFilters.value = new Set(['argent', 'metaux', 'patrimoine', 'immobilier'])
  }

  /**
   * Désactiver tous les filtres
   */
  const disableAllFilters = () => {
    activeFilters.value = new Set()
  }

  /**
   * Définir les filtres actifs
   */
  const setFilters = (filters: FilterCategory[]) => {
    activeFilters.value = new Set(filters)
  }

  /**
   * Charger les consultations
   */
  const load = async (forceRefresh = false) => {
    await store.fetchConsultations(forceRefresh)
  }

  /**
   * Rafraîchir les données (invalide le cache)
   */
  const refresh = async () => {
    await store.refresh()
  }

  /**
   * Obtenir un webinaire par son ID
   */
  const getById = (id: number | string) => {
    return store.getWebinarById(id)
  }

  // === Lifecycle ===

  if (autoLoad) {
    onMounted(async () => {
      await load()
    })
  }

  // === Return ===

  return {
    // État
    webinars,
    isLoading,
    error,
    hasData,
    isCacheValid,
    count,
    activeFilters,

    // Méthodes de filtrage
    toggleFilter,
    isFilterActive,
    enableAllFilters,
    disableAllFilters,
    setFilters,

    // Méthodes de chargement
    load,
    refresh,
    getById,
  }
}
