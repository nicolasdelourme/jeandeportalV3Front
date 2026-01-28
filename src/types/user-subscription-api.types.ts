/**
 * Types pour GET /fetchUserSubscription
 * Endpoint: /fetchUserSubscription
 */

import type { ThemeType } from '@/components/ui/themed-card'

// ============================================================================
// Types API bruts (structure réelle renvoyée par le backend)
// ============================================================================

/**
 * Schéma de facturation dans la structure API brute
 */
export interface APIUserBillingScheme {
  id: number
  oneClickPlanId: number
  price: number // Prix en centimes (1990 = 19.90€)
}

/**
 * Abonnement dans la structure API brute
 */
export interface APIRawSubscription {
  subscriptionId: number
  status: 'active' | 'suspended' | 'canceled' | 'pending'
  dateStart: string // "2025-01-01 12:00:00"
  dateStop: string | null // Date fin (null si actif)
  planId: number
  regularInterval: string // "P1M" (mensuel), "P1Y" (annuel)
  intervalNumber: number // 1
  nextPaymentDate: string | null // "2025-02-01 09:00:00"
  technicalTag: string // "metauxprecieux", "portefeuillepermanent", etc.
  planName: string // "essentiel", "standard", "premium"
  planDescription: string
  oneClickId: number
  oneClickName: string
  oneClickDescription: string
  billingScheme_array: APIUserBillingScheme[]
}

/**
 * Facture dans la structure API brute
 */
export interface APIRawInvoice {
  subscriptionId: number
  subscriptionName: string
  technicalTag: string // "libertefinanciere", "metauxprecieux", etc.
  oneClickName: string // Nom du produit OneClick
  planName: string // "essentiel", "standard", "premium"
  execution: string // "2026-01-23 09:00:00"
  amount: number // En centimes (990 = 9.90€)
  currency: string // "eur"
  paymentId: number
  invoiceUrl: string // URL Stripe
}

/**
 * Réponse brute de l'API /fetchUserSubscription
 */
export interface APIUserSubscriptionResponse {
  status: 'success' | 'error'
  subscription_array: APIRawSubscription[]
  invoice_array: APIRawInvoice[]
  message?: string
}

// ============================================================================
// Types normalisés frontend
// ============================================================================

/**
 * Statut d'abonnement normalisé
 */
export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled'

/**
 * Abonnement utilisateur normalisé pour l'affichage
 */
export interface UserSubscription {
  id: string
  theme: ThemeType
  themeName: string
  plan: string // "Essentiel", "Standard", "Premium"
  billingPeriod: 'mensuel' | 'annuel'
  status: SubscriptionStatus
  price: number // En euros
  discount?: number
  subscribedSince: string // Date formatée FR
  nextBilling: string | null
  errorMessage?: string
}

/**
 * Facture utilisateur normalisée pour l'affichage
 */
export interface UserInvoice {
  id: string
  theme: ThemeType
  label: string
  date: string // Date formatée FR
  amount: number // En euros
  downloadUrl: string
}

// ============================================================================
// Mappings et constantes
// ============================================================================

/**
 * Mapping des technicalTag API vers les ThemeType frontend
 */
export const USER_SUB_THEME_TAG_MAP: Record<string, ThemeType> = {
  portefeuillepermanent: 'portefeuille',
  metauxprecieux: 'metaux',
  libertefinanciere: 'liberte',
  bonus: 'bonus',
}

/**
 * Mapping des ThemeType vers les noms d'affichage
 */
export const USER_SUB_THEME_NAMES: Record<ThemeType, string> = {
  metaux: 'Métaux Précieux',
  portefeuille: 'Portefeuille Permanent',
  liberte: 'Liberté Financière',
  bonus: 'Bonus',
}

/**
 * Mapping des noms de tier API vers les labels d'affichage
 */
export const USER_SUB_TIER_LABELS: Record<string, string> = {
  essentiel: 'Essentiel',
  standard: 'Standard',
  premium: 'Premium',
}

// ============================================================================
// Réponse updateOneClickPayment
// ============================================================================

/**
 * Réponse de l'API POST /updateOneClickPayment
 * Utilisée pour modifier le moyen de paiement de tous les abonnements actifs
 */
export interface APIUpdatePaymentResponse {
  status: 'success' | 'error'
  stripePublicKey?: string // Clé publique Stripe (absent si monnaie JDP)
  client_secret?: string // Client secret pour SetupIntent
  message?: string
}

// ============================================================================
// Erreur API
// ============================================================================

/**
 * Erreur API User Subscription
 */
export class UserSubscriptionAPIError extends Error {
  public statusCode?: number
  public originalError?: Error

  constructor(message: string, statusCode?: number, originalError?: Error) {
    super(message)
    this.name = 'UserSubscriptionAPIError'
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

// ============================================================================
// Fonctions de mapping
// ============================================================================

/**
 * Mappe un technicalTag vers un ThemeType
 */
export function mapTheme(technicalTag: string): ThemeType {
  return USER_SUB_THEME_TAG_MAP[technicalTag] || 'bonus'
}

/**
 * Mappe un intervalle API vers une période de facturation
 */
export function mapBillingPeriod(regularInterval: string): 'mensuel' | 'annuel' {
  return regularInterval === 'P1Y' ? 'annuel' : 'mensuel'
}

/**
 * Formate une date API vers le format FR (JJ/MM/AAAA)
 */
export function formatDateFR(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR')
}

/**
 * Convertit les centimes en euros
 */
export function centimesToEuros(centimes: number): number {
  return centimes / 100
}

/**
 * Mappe un abonnement API vers un UserSubscription
 */
export function mapAPISubscription(raw: APIRawSubscription): UserSubscription {
  const theme = mapTheme(raw.technicalTag)
  return {
    id: String(raw.subscriptionId),
    theme,
    themeName: USER_SUB_THEME_NAMES[theme],
    plan: USER_SUB_TIER_LABELS[raw.planName] || raw.planName,
    billingPeriod: mapBillingPeriod(raw.regularInterval),
    status: raw.status === 'canceled' ? 'cancelled' : (raw.status as SubscriptionStatus),
    price: centimesToEuros(raw.billingScheme_array[0]?.price || 0),
    subscribedSince: formatDateFR(raw.dateStart),
    nextBilling: raw.nextPaymentDate ? formatDateFR(raw.nextPaymentDate) : null,
  }
}

/**
 * Mappe une facture API vers un UserInvoice
 */
export function mapAPIInvoice(raw: APIRawInvoice): UserInvoice {
  const theme = mapTheme(raw.technicalTag)
  return {
    id: String(raw.paymentId),
    theme,
    label: `${USER_SUB_TIER_LABELS[raw.planName] || raw.planName} - ${USER_SUB_THEME_NAMES[theme]}`,
    date: formatDateFR(raw.execution),
    amount: centimesToEuros(raw.amount),
    downloadUrl: raw.invoiceUrl,
  }
}
