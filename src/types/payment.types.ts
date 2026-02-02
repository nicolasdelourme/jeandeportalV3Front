/**
 * Types pour l'intégration du paiement Stripe
 */

// ============================================
// Types API (Backend)
// ============================================

/**
 * Requête pour valider le checkout boutique
 * POST /checkout
 * DOIT être appelé avant /initPayment
 */
export interface CheckoutRequest {
  basketCode: string
}

/**
 * Réponse de validation du checkout boutique
 */
export interface CheckoutResponse {
  status: 'success' | 'error'
  stripePublicKey?: string
  basket?: {
    basketCode: string
    referenceNumber: number
    count: number
    tax: number
    total: number
    discountTotal: number
    referenceList: Array<{
      name: string
      itemId: number
      storeId: number
      priceId: number
      quantity: number
      price: number
      HTPrice: number
      vat: number
      currency: string
    }>
  }
  message?: string
}

/**
 * Requête pour initialiser un paiement
 * POST /initPayment
 */
export interface InitPaymentRequest {
  basketCode: string
  adressId: number      // ID de l'adresse de livraison
  billAdressId: number  // ID de l'adresse de facturation
  currency: string      // 'eur'
}

/**
 * Réponse d'initialisation du paiement
 */
export interface InitPaymentResponse {
  status: 'success' | 'error'
  stripePublicKey?: string  // Clé publique Stripe (pk_live_xxx ou pk_test_xxx)
  client_secret?: string    // pi_xxx_secret_xxx (uniquement si success)
  message?: string          // Message d'erreur (si error)
}

/**
 * Résultat de l'initialisation du paiement (frontend)
 */
export interface InitPaymentResult {
  clientSecret: string
  publicKey: string
}

// ============================================
// Types Frontend
// ============================================

/**
 * État du processus de checkout
 */
export type CheckoutStep = 'addresses' | 'payment' | 'processing' | 'success' | 'error'

/**
 * Codes d'erreur du paiement
 */
export type PaymentErrorCode =
  | 'INIT_FAILED'
  | 'PAYMENT_FAILED'
  | 'NETWORK_ERROR'
  | 'INVALID_ADDRESS'
  | 'BASKET_EXPIRED'

/**
 * Erreur de paiement
 */
export class PaymentError extends Error {
  code: PaymentErrorCode
  statusCode?: number

  constructor(
    message: string,
    code: PaymentErrorCode,
    statusCode?: number
  ) {
    super(message)
    this.name = 'PaymentError'
    this.code = code
    this.statusCode = statusCode
  }
}
