/**
 * Service de gestion des paiements
 * Centralise les opérations d'initialisation et de finalisation du paiement
 */

import { apiClient } from '@/api/client'
import type { InitPaymentRequest, InitPaymentResponse, InitPaymentResult } from '@/types/payment.types'
import { PaymentError } from '@/types/payment.types'
import { logger } from '@/utils/logger'

/**
 * Service de paiement
 */
class PaymentService {
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
      logger.info('💳 [PAYMENT SERVICE] Initialisation du paiement...')
      logger.info(`   basketCode: ${basketCode.substring(0, 8)}...`)
      logger.info(`   adressId: ${shippingAddressId}, billAdressId: ${billingAddressId}`)

      const request: InitPaymentRequest = {
        basketCode,
        adressId: shippingAddressId,
        billAdressId: billingAddressId,
        currency,
      }

      // DEBUG: Log du payload pour aider le backend à debug
      console.log('🔍 [DEBUG] initPayment request payload:', JSON.stringify(request, null, 2))

      const response = await apiClient.post<InitPaymentResponse>('/initPayment', request)

      if (response.status === 'error' || !response.client_secret || !response.stripePublicKey) {
        throw new PaymentError(
          response.message || 'Impossible d\'initialiser le paiement',
          'INIT_FAILED'
        )
      }

      logger.info('✅ [PAYMENT SERVICE] PaymentIntent créé avec succès')
      return {
        clientSecret: response.client_secret,
        publicKey: response.stripePublicKey
      }
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error
      }

      logger.error('❌ [PAYMENT SERVICE] Erreur lors de l\'initialisation:', error)

      // Gérer les erreurs spécifiques
      if (error.response?.status === 404) {
        throw new PaymentError(
          'Panier non trouvé ou expiré',
          'BASKET_EXPIRED',
          404
        )
      }

      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'initialisation du paiement'

      throw new PaymentError(
        errorMessage,
        'NETWORK_ERROR',
        error.response?.status
      )
    }
  }
}

// Export singleton
export const paymentService = new PaymentService()
export default PaymentService
