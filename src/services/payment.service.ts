/**
 * Service de gestion des paiements
 * Centralise les opérations d'initialisation et de finalisation du paiement
 */

import { apiClient } from '@/api/client'
import type {
  CheckoutResponse,
  InitPaymentRequest,
  InitPaymentResponse,
  InitPaymentResult,
} from '@/types/payment.types'
import { PaymentError } from '@/types/payment.types'
import { logger } from '@/utils/logger'
import { getHttpErrorCode, getHttpErrorData } from '@/lib/error-utils'

/**
 * Service de paiement
 */
class PaymentService {
  /**
   * Valide le checkout et associe l'utilisateur au panier
   * POST /checkout
   * DOIT être appelé avant initPayment()
   *
   * @param basketCode - Code du panier
   * @returns { publicKey } - Clé publique Stripe
   */
  async checkout(basketCode: string): Promise<{ publicKey: string }> {
    try {
      const requestBody = { basketCode }
      console.log('[CHECKOUT] POST /checkout', requestBody)

      const response = await apiClient.post<CheckoutResponse>('/checkout', requestBody)

      if (response.status === 'error' || !response.stripePublicKey) {
        throw new PaymentError(
          response.message || 'Erreur lors du checkout',
          'INIT_FAILED'
        )
      }

      return { publicKey: response.stripePublicKey }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }

      logger.error('❌ [PAYMENT SERVICE] Erreur lors du checkout:', error)

      const httpCode = getHttpErrorCode(error)
      const httpData = getHttpErrorData<{ message?: string }>(error)

      if (httpCode === 401) {
        throw new PaymentError('Authentification requise', 'INIT_FAILED', 401)
      }

      throw new PaymentError(
        httpData?.message || 'Erreur lors du checkout',
        'NETWORK_ERROR',
        httpCode
      )
    }
  }

  /**
   * Initialise un paiement Stripe
   * Appelle le backend qui crée un PaymentIntent et retourne le client_secret + clé publique
   *
   * @param basketCode - Code du panier
   * @param shippingAddressId - ID de l'adresse de livraison
   * @param billingAddressId - ID de l'adresse de facturation
   * @param currency - Devise (défaut: 'eur')
   * @returns { clientSecret, publicKey } pour Stripe Elements
   */
  async initPayment(
    basketCode: string,
    shippingAddressId: number,
    billingAddressId: number,
    currency: string = 'eur'
  ): Promise<InitPaymentResult> {
    try {
      const request: InitPaymentRequest = {
        basketCode,
        adressId: shippingAddressId,
        billAdressId: billingAddressId,
        currency,
      }
      console.log('[INIT PAYMENT] POST /initPayment', request)

      const response = await apiClient.post<InitPaymentResponse>('/initPayment', request)

      if (response.status === 'error' || !response.client_secret || !response.stripePublicKey) {
        throw new PaymentError(
          response.message || 'Impossible d\'initialiser le paiement',
          'INIT_FAILED'
        )
      }

      return {
        clientSecret: response.client_secret,
        publicKey: response.stripePublicKey
      }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }

      logger.error('❌ [PAYMENT SERVICE] Erreur lors de l\'initialisation:', error)

      const httpCode = getHttpErrorCode(error)
      const httpData = getHttpErrorData<{ message?: string }>(error)

      // Gérer les erreurs spécifiques
      if (httpCode === 404) {
        throw new PaymentError(
          'Panier non trouvé ou expiré',
          'BASKET_EXPIRED',
          404
        )
      }

      const errorMessage = httpData?.message || 'Erreur lors de l\'initialisation du paiement'

      throw new PaymentError(
        errorMessage,
        'NETWORK_ERROR',
        httpCode
      )
    }
  }
}

// Export singleton
export const paymentService = new PaymentService()
export default PaymentService
