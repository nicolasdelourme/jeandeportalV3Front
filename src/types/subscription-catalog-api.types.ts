/**
 * Types pour l'API Subscription Catalog (OneClick)
 * Endpoint: /fetchOneClickCatalog
 */

import type { ThemeType } from '@/components/ui/themed-card'

// ============================================================================
// Types API bruts (structure réelle renvoyée par le backend)
// ============================================================================

/**
 * Schéma de facturation dans la structure API brute
 */
export interface APIRawBillingScheme {
  id: number | string
  price: number // Prix en centimes (1990 = 19.90€)
  regularInterval: string // 'P1M' = mensuel, 'P1Y' = annuel
}

/**
 * Plan dans la structure API brute
 */
export interface APIRawPlan {
  id: number | string
  oneClickId: number | string
  regularInterval: string // 'P1M' = mensuel, 'P1Y' = annuel
  trialDays: number // Période d'essai en jours (ex: 6)
  billingScheme_array: APIRawBillingScheme[]
}

/**
 * Produit OneClick dans la structure API brute
 */
export interface APIRawOneClickProduct {
  id: number | string
  name: string
  description: string // "abonnement premium", "abonnement standard", "abonnement essentiel"
  technicalTag: string // "portefeuillepermanent", "metauxprecieux", "libertefinanciere", "bonus"
  plan_array: APIRawPlan[]
}

/**
 * Réponse brute de l'API /fetchOneClickCatalog
 */
export interface APIRawOneClickCatalogResponse {
  status: string // "success"
  oneClick_array: APIRawOneClickProduct[]
}

// ============================================================================
// Types normalisés frontend
// ============================================================================

/**
 * Identifiant de tier d'abonnement
 */
export type SubscriptionTierId = 'essentiel' | 'standard' | 'premium'

/**
 * Intervalle de facturation
 */
export type BillingInterval = 'monthly' | 'yearly'

/**
 * Prix d'un abonnement
 */
export interface SubscriptionPricing {
  id: string
  interval: BillingInterval
  price: number // Prix en euros (19.90)
  priceInCentimes: number // Prix en centimes (1990)
}

/**
 * Plan d'abonnement normalisé
 */
export interface SubscriptionPlan {
  id: string // ID unique du produit (pour reference)
  planId: number // ID du plan pour l'API OneClick (addOneClick)
  oneClickId: string // ID pour l'API OneClick
  theme: ThemeType // 'metaux', 'portefeuille', 'liberte', 'bonus'
  tier: SubscriptionTierId // 'essentiel', 'standard', 'premium'
  name: string // Nom d'affichage du produit
  trialDays: number // Période d'essai
  pricing: SubscriptionPricing[] // Prix mensuel et annuel
  stars: number // Étoiles gagnées par mois
}

/**
 * Catalogue complet des abonnements
 */
export interface SubscriptionCatalog {
  plans: SubscriptionPlan[]
  byTheme: Map<ThemeType, SubscriptionPlan[]>
  byTier: Map<SubscriptionTierId, SubscriptionPlan[]>
  lastUpdated: number
}

/**
 * Réponse du service
 */
export interface SubscriptionCatalogResponse {
  plans: SubscriptionPlan[]
}

// ============================================================================
// Mappings et constantes
// ============================================================================

/**
 * Mapping des technicalTag API vers les ThemeType frontend
 */
export const THEME_TAG_MAP: Record<string, ThemeType> = {
  portefeuillepermanent: 'portefeuille',
  metauxprecieux: 'metaux',
  libertefinanciere: 'liberte',
  bonus: 'bonus',
}

/**
 * Mapping des descriptions API vers les SubscriptionTierId
 */
export const TIER_DESCRIPTION_MAP: Record<string, SubscriptionTierId> = {
  'abonnement essentiel': 'essentiel',
  'abonnement standard': 'standard',
  'abonnement premium': 'premium',
}

/**
 * Mapping des intervalles API vers BillingInterval
 */
export const INTERVAL_MAP: Record<string, BillingInterval> = {
  P1M: 'monthly',
  P1Y: 'yearly',
}

/**
 * Étoiles par tier
 */
export const TIER_STARS: Record<SubscriptionTierId, number> = {
  essentiel: 1,
  standard: 5,
  premium: 10,
}

/**
 * Ordre des tiers pour le tri
 */
export const TIER_ORDER: Record<SubscriptionTierId, number> = {
  essentiel: 1,
  standard: 2,
  premium: 3,
}

// ============================================================================
// Erreur API
// ============================================================================

/**
 * Erreur API Subscription Catalog
 */
export class SubscriptionCatalogAPIError extends Error {
  public statusCode?: number
  public originalError?: Error

  constructor(message: string, statusCode?: number, originalError?: Error) {
    super(message)
    this.name = 'SubscriptionCatalogAPIError'
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

// ============================================================================
// Fonctions de mapping
// ============================================================================

/**
 * Extrait le tier depuis la description du produit
 */
function extractTierFromDescription(description: string): SubscriptionTierId {
  const normalized = description.toLowerCase().trim()

  for (const [key, tier] of Object.entries(TIER_DESCRIPTION_MAP)) {
    if (normalized.includes(key)) {
      return tier
    }
  }

  // Fallback: chercher les mots-clés
  if (normalized.includes('premium')) return 'premium'
  if (normalized.includes('standard')) return 'standard'
  return 'essentiel'
}

/**
 * Mappe un produit API vers un SubscriptionPlan
 */
export function mapAPIProductToSubscriptionPlan(
  product: APIRawOneClickProduct
): SubscriptionPlan | null {
  // Extraire le theme depuis technicalTag
  const theme = THEME_TAG_MAP[product.technicalTag]
  if (!theme) {
    console.warn(`Unknown technicalTag: ${product.technicalTag}`)
    return null
  }

  // Extraire le tier depuis la description
  const tier = extractTierFromDescription(product.description)

  // Trouver le premier plan avec des pricing (généralement il n'y en a qu'un)
  const plan = product.plan_array?.[0]
  if (!plan) {
    console.warn(`No plan found for product: ${product.name}`)
    return null
  }

  // Mapper les prix
  const pricing: SubscriptionPricing[] = (plan.billingScheme_array || []).map((scheme) => ({
    id: String(scheme.id),
    interval: INTERVAL_MAP[scheme.regularInterval] || 'monthly',
    price: scheme.price / 100, // Centimes vers euros
    priceInCentimes: scheme.price,
  }))

  return {
    id: String(product.id),
    planId: Number(plan.id), // ID du plan pour l'API OneClick
    oneClickId: String(plan.oneClickId),
    theme,
    tier,
    name: product.name,
    trialDays: plan.trialDays || 0,
    pricing,
    stars: TIER_STARS[tier],
  }
}

/**
 * Mappe la réponse API complète vers un SubscriptionCatalog
 */
export function mapAPIResponseToSubscriptionCatalog(
  response: APIRawOneClickCatalogResponse
): SubscriptionCatalog {
  const plans: SubscriptionPlan[] = []
  const byTheme = new Map<ThemeType, SubscriptionPlan[]>()
  const byTier = new Map<SubscriptionTierId, SubscriptionPlan[]>()

  // Initialiser les maps
  const themes: ThemeType[] = ['metaux', 'portefeuille', 'liberte', 'bonus']
  const tiers: SubscriptionTierId[] = ['essentiel', 'standard', 'premium']

  themes.forEach((theme) => byTheme.set(theme, []))
  tiers.forEach((tier) => byTier.set(tier, []))

  // Mapper chaque produit
  for (const product of response.oneClick_array || []) {
    const plan = mapAPIProductToSubscriptionPlan(product)
    if (plan) {
      plans.push(plan)

      // Ajouter aux maps
      byTheme.get(plan.theme)?.push(plan)
      byTier.get(plan.tier)?.push(plan)
    }
  }

  // Trier les plans par tier
  const sortByTier = (a: SubscriptionPlan, b: SubscriptionPlan) =>
    TIER_ORDER[a.tier] - TIER_ORDER[b.tier]

  plans.sort(sortByTier)
  byTheme.forEach((themePlans) => themePlans.sort(sortByTier))

  return {
    plans,
    byTheme,
    byTier,
    lastUpdated: Date.now(),
  }
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Obtient le prix mensuel d'un plan
 */
export function getMonthlyPrice(plan: SubscriptionPlan): number | null {
  const monthlyPricing = plan.pricing.find((p) => p.interval === 'monthly')
  return monthlyPricing?.price ?? null
}

/**
 * Obtient le prix annuel d'un plan
 */
export function getYearlyPrice(plan: SubscriptionPlan): number | null {
  const yearlyPricing = plan.pricing.find((p) => p.interval === 'yearly')
  return yearlyPricing?.price ?? null
}

/**
 * Formate un prix pour l'affichage
 */
export function formatSubscriptionPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + '€'
}

/**
 * Calcule le prix mensuel équivalent pour un abonnement annuel
 * (pour afficher "X€/mois" sur un plan annuel)
 */
export function getMonthlyEquivalentPrice(yearlyPrice: number): number {
  return yearlyPrice / 12
}
