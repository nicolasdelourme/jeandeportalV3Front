/**
 * Types pour la gestion des abonnements et factures
 */

export type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'pending'

export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded'

export type CancellationReason =
  | 'too_expensive'
  | 'not_enough_use'
  | 'found_alternative'
  | 'technical_issues'
  | 'changing_needs'
  | 'other'

export interface Subscription {
  id: string
  status: SubscriptionStatus
  plan: string
  theme: string
  quantity: number
  price: number
  discount?: number
  finalPrice: number
  nextBillingDate?: string
  startDate: string
  canceledAt?: string
  canceledReason?: CancellationReason
}

export interface SubscriptionInvoice {
  id: string
  subscriptionId: string
  date: string
  period: string // Ex: "Janvier 2024", "01/01/2024 - 31/01/2024"
  amount: number
  status: InvoiceStatus
  pdfUrl?: string
  paymentMethod?: string
  createdAt: string
}

export interface CancelSubscriptionDto {
  reason: CancellationReason
  feedback?: string
  immediateCancel: boolean // true = annulation immédiate, false = fin de période
}

export const cancellationReasonLabels: Record<CancellationReason, string> = {
  too_expensive: 'Trop cher',
  not_enough_use: 'Je ne l\'utilise pas assez',
  found_alternative: 'J\'ai trouvé une alternative',
  technical_issues: 'Problèmes techniques',
  changing_needs: 'Mes besoins ont changé',
  other: 'Autre raison'
}
