/**
 * Types pour GET /fetchPaidInvoicePerOrder
 * Endpoint: /fetchPaidInvoicePerOrder
 * Retourne les factures des commandes payées de l'utilisateur
 */

// ============================================================================
// Types API bruts (structure réelle renvoyée par le backend)
// ============================================================================

/**
 * Facture de commande dans la structure API brute
 */
export interface APIRawOrderInvoice {
  orderId: number
  name: string // Numéro facture "2026-01-2233"
  execution: string // "2026-01-23 09:00:00"
  amount: number // En centimes (990 = 9.90€)
  currency: string // "eur" ou "jdp"
  paymentId: number
  invoiceUrl?: string // Absent si currency=jdp ou amount=0
}

/**
 * Réponse brute de l'API /fetchPaidInvoicePerOrder
 */
export interface APIShopOrdersResponse {
  status: 'success' | 'error'
  invoice_array: APIRawOrderInvoice[]
  message?: string
}

// ============================================================================
// Types normalisés frontend
// ============================================================================

/**
 * Facture de commande normalisée pour l'affichage
 */
export interface ShopOrderInvoice {
  id: string
  orderNumber: string // "2026-01-2233"
  date: string // Date formatée FR
  amount: number // En euros
  currency: string
  downloadUrl: string | null
}

// ============================================================================
// Erreur API
// ============================================================================

/**
 * Erreur API Shop Orders
 */
export class ShopOrdersAPIError extends Error {
  public statusCode?: number
  public originalError?: Error

  constructor(message: string, statusCode?: number, originalError?: Error) {
    super(message)
    this.name = 'ShopOrdersAPIError'
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

// ============================================================================
// Fonctions de mapping
// ============================================================================

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
 * Mappe une facture de commande API vers un ShopOrderInvoice
 * Note: invoiceUrl est absent si currency=jdp ou amount=0
 */
export function mapAPIOrderInvoice(raw: APIRawOrderInvoice): ShopOrderInvoice {
  // Pas d'URL de facture si paiement en JDP ou montant nul
  const hasInvoiceUrl = raw.invoiceUrl && raw.currency !== 'jdp' && raw.amount > 0

  return {
    id: String(raw.paymentId),
    orderNumber: raw.name,
    date: formatDateFR(raw.execution),
    amount: centimesToEuros(raw.amount),
    currency: raw.currency,
    downloadUrl: hasInvoiceUrl ? raw.invoiceUrl! : null,
  }
}
