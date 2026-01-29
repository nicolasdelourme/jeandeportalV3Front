/**
 * Store Pinia pour le catalogue d'abonnements
 * Gestion des plans d'abonnement avec cache intelligent (memory + localStorage)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { subscriptionCatalogService } from '@/services/subscription-catalog.service'
import { logger } from '@/utils/logger'
import type { ThemeType } from '@/components/ui/themed-card'
import type {
  SubscriptionPlan,
  SubscriptionTierId,
} from '@/types/subscription-catalog-api.types'
import {
  SubscriptionCatalogAPIError,
  getMonthlyPrice,
  formatSubscriptionPrice,
  TIER_STARS,
} from '@/types/subscription-catalog-api.types'

/**
 * Cle localStorage pour le cache
 */
const CACHE_KEY = 'jdp_subscription_catalog_cache'

/**
 * Version du cache - Incrementer quand la structure change
 */
const CACHE_VERSION = '1.0'

/**
 * Duree du cache en millisecondes (5 minutes)
 */
const CACHE_DURATION = 5 * 60 * 1000

/**
 * Structure du cache localStorage
 */
interface CacheData {
  version: string
  plans: SubscriptionPlan[]
  timestamp: number
}

/**
 * Interface pour les plans formattes pour l'UI
 * Compatible avec SubscriptionModal et PricingSection
 */
export interface UIPricingPlan {
  id: SubscriptionTierId
  planId: number // ID du plan pour l'API OneClick (addOneClick)
  name: string
  priceMonthly: number
  priceYearly?: number
  recommended?: boolean
  isPremium?: boolean
  stars: number
  oneClickId?: string
  trialDays?: number
}

export const useSubscriptionCatalogStore = defineStore('subscriptionCatalog', () => {
  // ============================================================================
  // Etat
  // ============================================================================

  /**
   * Liste des plans d'abonnement
   */
  const plans = ref<SubscriptionPlan[]>([])

  /**
   * Etat de chargement
   */
  const isLoading = ref(false)

  /**
   * Erreur eventuelle
   */
  const error = ref<SubscriptionCatalogAPIError | null>(null)

  /**
   * Timestamp du dernier chargement reussi
   */
  const lastFetchTimestamp = ref<number>(0)

  // ============================================================================
  // Getters
  // ============================================================================

  /**
   * Verifie si le cache est encore valide
   */
  const isCacheValid = computed(() => {
    if (lastFetchTimestamp.value === 0) return false
    const now = Date.now()
    return now - lastFetchTimestamp.value < CACHE_DURATION
  })

  /**
   * Verifie si des plans sont charges
   */
  const hasPlans = computed(() => plans.value.length > 0)

  // ============================================================================
  // Accessors
  // ============================================================================

  /**
   * Recupere les plans pour un theme donne
   */
  const getPlansByTheme = (theme: ThemeType): SubscriptionPlan[] => {
    return plans.value.filter((plan) => plan.theme === theme)
  }

  /**
   * Recupere les plans pour un tier donne
   */
  const getPlansByTier = (tier: SubscriptionTierId): SubscriptionPlan[] => {
    return plans.value.filter((plan) => plan.tier === tier)
  }

  /**
   * Recupere un plan specifique par theme et tier
   */
  const getPlan = (theme: ThemeType, tier: SubscriptionTierId): SubscriptionPlan | undefined => {
    return plans.value.find((plan) => plan.theme === theme && plan.tier === tier)
  }

  /**
   * Recupere les plans pour un theme, formates pour l'UI (SubscriptionModal/PricingSection)
   * Retourne les 3 tiers: essentiel, standard, premium
   */
  const getPlansForTheme = (theme: ThemeType): UIPricingPlan[] => {
    const themePlans = getPlansByTheme(theme)

    if (themePlans.length === 0) {
      return []
    }

    // Mapper vers le format UI
    return themePlans.map((plan) => {
      const monthlyPrice = getMonthlyPrice(plan)
      const yearlyPricing = plan.pricing.find((p) => p.interval === 'yearly')

      return {
        id: plan.tier,
        planId: plan.planId, // ID du plan pour l'API OneClick
        name: capitalize(plan.tier),
        priceMonthly: monthlyPrice ?? 0,
        priceYearly: yearlyPricing?.price,
        recommended: plan.tier === 'standard',
        isPremium: plan.tier === 'premium',
        stars: plan.stars,
        oneClickId: plan.oneClickId,
        trialDays: plan.trialDays,
      }
    })
  }

  /**
   * Recupere les plans de pricing generiques (non lies a un theme)
   * Pour PricingSection qui affiche les prix de base
   */
  const getPricingPlans = (): UIPricingPlan[] => {
    // Prendre les plans du premier theme disponible comme reference
    // (les prix sont identiques pour tous les themes)
    const firstTheme: ThemeType = 'metaux'
    const themePlans = getPlansForTheme(firstTheme)

    if (themePlans.length > 0) {
      return themePlans
    }

    // Fallback si pas de plans charges
    return []
  }

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

      // Verifier la version du cache frontend
      if (!cacheData.version || cacheData.version !== CACHE_VERSION) {
        localStorage.removeItem(CACHE_KEY)
        return false
      }

      // Verifier si le cache est encore valide temporellement
      if (now - cacheData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return false
      }

      // Restaurer les donnees
      plans.value = cacheData.plans
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
        plans: plans.value,
        timestamp: lastFetchTimestamp.value,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (err) {
      logger.warn('Failed to save subscription catalog to localStorage:', err)
    }
  }

  /**
   * Recupere le catalogue depuis l'API
   */
  const fetchCatalog = async (force = false): Promise<void> => {
    // Si le cache est valide et qu'on ne force pas le refresh, ne rien faire
    if (!force && isCacheValid.value && plans.value.length > 0) {
      return
    }

    // Si on a deja des donnees en cache localStorage, les utiliser
    if (!force && loadFromLocalStorage()) {
      return
    }

    // Charger depuis l'API
    isLoading.value = true
    error.value = null

    try {
      const data = await subscriptionCatalogService.fetchCatalog()
      plans.value = data.plans
      lastFetchTimestamp.value = Date.now()

      // Sauvegarder dans localStorage
      saveToLocalStorage()

    } catch (err) {
      error.value =
        err instanceof SubscriptionCatalogAPIError
          ? err
          : new SubscriptionCatalogAPIError('Erreur inconnue')
      logger.error('❌ Failed to fetch subscription catalog:', err)
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
   * Vide completement le cache (memoire + localStorage)
   */
  const clearCache = () => {
    plans.value = []
    lastFetchTimestamp.value = 0
    localStorage.removeItem(CACHE_KEY)
  }

  // ============================================================================
  // Helpers exportes
  // ============================================================================

  /**
   * Formate un prix pour l'affichage
   */
  const formatPrice = (price: number): string => {
    return formatSubscriptionPrice(price)
  }

  /**
   * Obtient les etoiles pour un tier
   */
  const getStarsForTier = (tier: SubscriptionTierId): number => {
    return TIER_STARS[tier]
  }

  // ============================================================================
  // Retour du store
  // ============================================================================

  return {
    // Etat
    plans,
    isLoading,
    error,
    lastFetchTimestamp,

    // Getters
    isCacheValid,
    hasPlans,

    // Accessors
    getPlansByTheme,
    getPlansByTier,
    getPlan,
    getPlansForTheme,
    getPricingPlans,

    // Actions
    fetchCatalog,
    refresh,
    clearCache,

    // Helpers
    formatPrice,
    getStarsForTier,
  }
})

// ============================================================================
// Helpers prives
// ============================================================================

/**
 * Capitalise la premiere lettre d'une chaine
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
