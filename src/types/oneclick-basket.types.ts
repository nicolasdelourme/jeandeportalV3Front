/**
 * Types pour le panier OneClick (abonnements)
 * Endpoints: /fetchOneClickBasket, /addOneClick, /deleteOneClick, /oneClickCheckout, /oneClickInitPayment
 */

import type { ThemeType } from '@/components/ui/themed-card'

// ============================================================================
// Types API bruts (structure réelle renvoyée par le backend)
// ============================================================================

/**
 * Schéma de facturation dans la réponse API
 */
export interface APIOneClickBillingScheme {
  billingSchemeId: number
  price: number // Prix en centimes (990 = 9.90€)
}

/**
 * Produit OneClick dans la réponse API
 */
export interface APIOneClickProduct {
  oneClickId: number
  name: string
  description: string
  technicalTag: string // 'portefeuillepermanent', 'metauxprecieux', etc.
}

/**
 * Plan OneClick dans la réponse API panier
 */
export interface APIOneClickPlan {
  planId: number
  name: string
  description: string
  trialdays: number
  regularInterval: string // 'P1M' = mensuel, 'P1Y' = annuel
  currency: string // 'EUR'
  oneClick: APIOneClickProduct
  oneClickBillingScheme: APIOneClickBillingScheme[]
}

/**
 * Réponse API /fetchOneClickBasket
 */
export interface APIOneClickBasketResponse {
  status: string // 'success' | 'error'
  basket: {
    basketCode: string
    plan_array: APIOneClickPlan[]
  }
  message?: string
}

/**
 * Requête API /addOneClick
 */
export interface APIAddOneClickRequest {
  planId: number
  storeId: number
  basketCode?: string // null si premier ajout
}

/**
 * Réponse API /addOneClick et /deleteOneClick
 * Même format que fetchOneClickBasket
 */
export type APIAddOneClickResponse = APIOneClickBasketResponse
export type APIDeleteOneClickResponse = APIOneClickBasketResponse

/**
 * Requête API /deleteOneClick
 */
export interface APIDeleteOneClickRequest {
  planId: number
  basketCode: string
}

/**
 * Réponse API /oneClickCheckout
 */
export interface APIOneClickCheckoutResponse {
  status: string
  stripePublicKey?: string
  message?: string
}

/**
 * Requête API /oneClickInitPayment
 */
export interface APIOneClickInitPaymentRequest {
  basketCode: string
  adressId: number
  billAdressId: number
}

/**
 * Réponse API /oneClickInitPayment
 */
export interface APIOneClickInitPaymentResponse {
  status: string
  stripePublicKey?: string
  client_secret?: string // setup_intent_xxx_secret_xxx
  message?: string
}

// ============================================================================
// Types normalisés frontend
// ============================================================================

/**
 * Intervalle de facturation
 */
export type OneClickBillingInterval = 'monthly' | 'yearly'

/**
 * Item du panier OneClick (normalisé pour le frontend)
 */
export interface OneClickBasketItem {
  planId: number
  name: string
  description: string
  price: number // Prix en euros
  priceInCentimes: number // Prix en centimes
  trialDays: number
  interval: OneClickBillingInterval
  currency: string
  theme: ThemeType
  oneClickId: number
  oneClickName: string
}

/**
 * État du panier OneClick
 */
export interface OneClickBasketState {
  basketCode: string | null
  items: OneClickBasketItem[]
  isLoading: boolean
  isSynced: boolean
  error: string | null
}

/**
 * Résultat de l'initialisation du paiement OneClick
 */
export interface OneClickInitPaymentResult {
  clientSecret: string
  publicKey: string
}

// ============================================================================
// Erreur API
// ============================================================================

/**
 * Codes d'erreur spécifiques au panier OneClick
 */
export type OneClickBasketErrorCode =
  | 'BASKET_NOT_FOUND'
  | 'PLAN_NOT_FOUND'
  | 'BASKET_ALREADY_HAS_PLAN'
  | 'INIT_FAILED'
  | 'NETWORK_ERROR'
  | 'AUTH_REQUIRED'

/**
 * Erreur du panier OneClick
 */
export class OneClickBasketError extends Error {
  code: OneClickBasketErrorCode
  statusCode?: number

  constructor(
    message: string,
    code: OneClickBasketErrorCode,
    statusCode?: number
  ) {
    super(message)
    this.name = 'OneClickBasketError'
    this.code = code
    this.statusCode = statusCode
  }
}

// ============================================================================
// Constantes et Mappings
// ============================================================================

/**
 * Mapping des technicalTag API vers les ThemeType frontend
 */
export const ONECLICK_THEME_MAP: Record<string, ThemeType> = {
  portefeuillepermanent: 'portefeuille',
  metauxprecieux: 'metaux',
  libertefinanciere: 'liberte',
  bonus: 'bonus',
}

/**
 * Mapping des intervalles API vers OneClickBillingInterval
 */
export const ONECLICK_INTERVAL_MAP: Record<string, OneClickBillingInterval> = {
  P1M: 'monthly',
  P1Y: 'yearly',
}

/**
 * ID du store pour les abonnements OneClick
 */
export const ONECLICK_STORE_ID = 28

// ============================================================================
// Fonctions de mapping
// ============================================================================

/**
 * Mappe un plan API vers un item de panier normalisé
 */
export function mapAPIOneClickPlanToBasketItem(
  plan: APIOneClickPlan
): OneClickBasketItem {
  // Extraire le premier prix (généralement il n'y en a qu'un par plan/intervalle)
  const billingScheme = plan.oneClickBillingScheme?.[0]
  const priceInCentimes = billingScheme?.price ?? 0

  // Mapper le theme depuis le technicalTag
  const theme = ONECLICK_THEME_MAP[plan.oneClick?.technicalTag] || 'metaux'

  // Mapper l'intervalle
  const interval = ONECLICK_INTERVAL_MAP[plan.regularInterval] || 'monthly'

  return {
    planId: plan.planId,
    name: plan.name,
    description: plan.description,
    price: priceInCentimes / 100,
    priceInCentimes,
    trialDays: plan.trialdays,
    interval,
    currency: plan.currency,
    theme,
    oneClickId: plan.oneClick?.oneClickId,
    oneClickName: plan.oneClick?.name,
  }
}

/**
 * Mappe une réponse API panier vers l'état frontend
 */
export function mapAPIOneClickBasketResponse(
  response: APIOneClickBasketResponse
): { basketCode: string; items: OneClickBasketItem[] } {
  const basketCode = response.basket?.basketCode || ''
  const items = (response.basket?.plan_array || []).map(
    mapAPIOneClickPlanToBasketItem
  )

  return { basketCode, items }
}
