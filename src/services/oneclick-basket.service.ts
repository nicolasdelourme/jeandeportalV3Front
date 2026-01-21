/**
 * Service API pour le panier OneClick (abonnements)
 * Gestion des appels a l'API du panier d'abonnements
 */

import { apiClient } from '@/api/client'
import type {
  APIOneClickBasketResponse,
  APIAddOneClickResponse,
  APIDeleteOneClickResponse,
  APIOneClickCheckoutResponse,
  APIOneClickInitPaymentResponse,
  OneClickBasketItem,
  OneClickInitPaymentResult,
} from '@/types/oneclick-basket.types'
import {
  OneClickBasketError,
  mapAPIOneClickBasketResponse,
  ONECLICK_STORE_ID,
} from '@/types/oneclick-basket.types'
import {
  mockFetchOneClickBasket,
  mockAddOneClick,
  mockDeleteOneClick,
  mockOneClickCheckout,
  mockOneClickInitPayment,
} from '@/api/oneclick-basket.mock'
import { logger } from '@/utils/logger'
import { getHttpErrorCode, getHttpErrorData } from '@/lib/error-utils'

// MOCK MODE : Controle par VITE_API_MODE
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

/**
 * Configuration de l'API OneClick Basket
 */
const API_CONFIG = {
  ENDPOINTS: {
    FETCH_BASKET: '/fetchOneClickBasket',
    ADD: '/addOneClick',
    DELETE: '/deleteOneClick',
    CHECKOUT: '/oneClickCheckout',
    INIT_PAYMENT: '/oneClickInitPayment',
  },
} as const

/**
 * Service singleton pour les appels API OneClick Basket
 */
class OneClickBasketService {
  /**
   * Recupere le panier OneClick
   * POST /fetchOneClickBasket
   */
  async fetchBasket(
    basketCode: string
  ): Promise<{ basketCode: string; items: OneClickBasketItem[] }> {
    logger.info('🛒 [ONECLICK SERVICE] Fetching basket:', basketCode.substring(0, 8) + '...')

    // Mode mock
    if (USE_MOCK) {
      const response = await mockFetchOneClickBasket(basketCode)
      if (response.status === 'error') {
        throw new OneClickBasketError(
          response.message || 'Panier non trouve',
          'BASKET_NOT_FOUND'
        )
      }
      return mapAPIOneClickBasketResponse(response)
    }

    // Mode reel
    try {
      const response = await apiClient.post<APIOneClickBasketResponse>(
        API_CONFIG.ENDPOINTS.FETCH_BASKET,
        { basketCode }
      )

      if (response.status === 'error') {
        throw new OneClickBasketError(
          response.message || 'Panier non trouve',
          'BASKET_NOT_FOUND'
        )
      }

      logger.info('✅ [ONECLICK SERVICE] Basket fetched successfully')
      return mapAPIOneClickBasketResponse(response)
    } catch (error) {
      if (error instanceof OneClickBasketError) {
        throw error
      }

      const httpCode = getHttpErrorCode(error)
      const httpData = getHttpErrorData<{ message?: string }>(error)

      if (httpCode === 404) {
        throw new OneClickBasketError('Panier non trouve', 'BASKET_NOT_FOUND', 404)
      }

      throw new OneClickBasketError(
        httpData?.message || 'Erreur lors de la recuperation du panier',
        'NETWORK_ERROR',
        httpCode
      )
    }
  }

  /**
   * Ajoute un plan au panier OneClick
   * POST /addOneClick
   *
   * @param planId - ID du plan a ajouter
   * @param storeId - ID du store (defaut: ONECLICK_STORE_ID = 28)
   * @param basketCode - Code du panier existant (null si premier ajout)
   */
  async addPlan(
    planId: number,
    storeId: number = ONECLICK_STORE_ID,
    basketCode: string | null = null
  ): Promise<{ basketCode: string; items: OneClickBasketItem[] }> {
    logger.info('🛒 [ONECLICK SERVICE] Adding plan:', { planId, storeId, basketCode })

    // Mode mock
    if (USE_MOCK) {
      const response = await mockAddOneClick(planId, storeId, basketCode)
      if (response.status === 'error') {
        throw new OneClickBasketError(
          response.message || 'Erreur lors de l\'ajout',
          'PLAN_NOT_FOUND'
        )
      }
      return mapAPIOneClickBasketResponse(response)
    }

    // Mode reel
    try {
      const request: { planId: number; storeId: number; basketCode?: string } = {
        planId,
        storeId,
      }
      if (basketCode) {
        request.basketCode = basketCode
      }

      const response = await apiClient.post<APIAddOneClickResponse>(
        API_CONFIG.ENDPOINTS.ADD,
        request
      )

      if (response.status === 'error') {
        throw new OneClickBasketError(
          response.message || 'Erreur lors de l\'ajout',
          'PLAN_NOT_FOUND'
        )
      }

      logger.info('✅ [ONECLICK SERVICE] Plan added successfully')
      return mapAPIOneClickBasketResponse(response)
    } catch (error) {
      if (error instanceof OneClickBasketError) {
        throw error
      }

      const httpCode = getHttpErrorCode(error)
      const httpData = getHttpErrorData<{ message?: string }>(error)

      throw new OneClickBasketError(
        httpData?.message || 'Erreur lors de l\'ajout du plan',
        'NETWORK_ERROR',
        httpCode
      )
    }
  }

  /**
   * Supprime un plan du panier OneClick
   * POST /deleteOneClick
   */
  async removePlan(
    planId: number,
    basketCode: string
  ): Promise<{ basketCode: string; items: OneClickBasketItem[] }> {
    logger.info('🛒 [ONECLICK SERVICE] Removing plan:', { planId, basketCode })

    // Mode mock
    if (USE_MOCK) {
      const response = await mockDeleteOneClick(planId, basketCode)
      if (response.status === 'error') {
        throw new OneClickBasketError(
          response.message || 'Panier non trouve',
          'BASKET_NOT_FOUND'
        )
      }
      return mapAPIOneClickBasketResponse(response)
    }

    // Mode reel
    try {
      const response = await apiClient.post<APIDeleteOneClickResponse>(
        API_CONFIG.ENDPOINTS.DELETE,
        { planId, basketCode }
      )

      if (response.status === 'error') {
        throw new OneClickBasketError(
          response.message || 'Erreur lors de la suppression',
          'BASKET_NOT_FOUND'
        )
      }

      logger.info('✅ [ONECLICK SERVICE] Plan removed successfully')
      return mapAPIOneClickBasketResponse(response)
    } catch (error) {
      if (error instanceof OneClickBasketError) {
        throw error
      }

      const httpCode = getHttpErrorCode(error)
      const httpData = getHttpErrorData<{ message?: string }>(error)

      throw new OneClickBasketError(
        httpData?.message || 'Erreur lors de la suppression',
        'NETWORK_ERROR',
        httpCode
      )
    }
  }

  /**
   * Valide le checkout OneClick (verification auth)
   * POST /oneClickCheckout
   * Retourne la cle publique Stripe
   */
  async checkout(basketCode: string): Promise<{ publicKey: string }> {
    logger.info('🛒 [ONECLICK SERVICE] Checkout:', basketCode.substring(0, 8) + '...')

    // Mode mock
    if (USE_MOCK) {
      const response = await mockOneClickCheckout(basketCode)
      if (response.status === 'error' || !response.stripePublicKey) {
        throw new OneClickBasketError(
          response.message || 'Erreur lors du checkout',
          'AUTH_REQUIRED'
        )
      }
      return { publicKey: response.stripePublicKey }
    }

    // Mode reel
    try {
      const response = await apiClient.post<APIOneClickCheckoutResponse>(
        API_CONFIG.ENDPOINTS.CHECKOUT,
        { basketCode }
      )

      if (response.status === 'error' || !response.stripePublicKey) {
        throw new OneClickBasketError(
          response.message || 'Erreur lors du checkout',
          'AUTH_REQUIRED'
        )
      }

      logger.info('✅ [ONECLICK SERVICE] Checkout validated')
      return { publicKey: response.stripePublicKey }
    } catch (error) {
      if (error instanceof OneClickBasketError) {
        throw error
      }

      const httpCode = getHttpErrorCode(error)
      const httpData = getHttpErrorData<{ message?: string }>(error)

      if (httpCode === 401) {
        throw new OneClickBasketError('Authentification requise', 'AUTH_REQUIRED', 401)
      }

      throw new OneClickBasketError(
        httpData?.message || 'Erreur lors du checkout',
        'NETWORK_ERROR',
        httpCode
      )
    }
  }

  /**
   * Initialise le paiement OneClick (SetupIntent)
   * POST /oneClickInitPayment
   * Retourne le client_secret pour Stripe
   */
  async initPayment(
    basketCode: string,
    addressId: number,
    billAddressId: number
  ): Promise<OneClickInitPaymentResult> {
    logger.info('💳 [ONECLICK SERVICE] Init payment:', {
      basketCode: basketCode.substring(0, 8) + '...',
      addressId,
      billAddressId,
    })

    // Mode mock
    if (USE_MOCK) {
      const response = await mockOneClickInitPayment(basketCode, addressId, billAddressId)
      if (response.status === 'error' || !response.client_secret || !response.stripePublicKey) {
        throw new OneClickBasketError(
          response.message || 'Erreur lors de l\'initialisation du paiement',
          'INIT_FAILED'
        )
      }
      return {
        clientSecret: response.client_secret,
        publicKey: response.stripePublicKey,
      }
    }

    // Mode reel
    try {
      const response = await apiClient.post<APIOneClickInitPaymentResponse>(
        API_CONFIG.ENDPOINTS.INIT_PAYMENT,
        {
          basketCode,
          adressId: addressId, // Note: 'adressId' sans 'd' comme dans l'API boutique
          billAdressId: billAddressId,
        }
      )

      if (response.status === 'error' || !response.client_secret || !response.stripePublicKey) {
        throw new OneClickBasketError(
          response.message || 'Erreur lors de l\'initialisation du paiement',
          'INIT_FAILED'
        )
      }

      logger.info('✅ [ONECLICK SERVICE] SetupIntent created successfully')
      return {
        clientSecret: response.client_secret,
        publicKey: response.stripePublicKey,
      }
    } catch (error) {
      if (error instanceof OneClickBasketError) {
        throw error
      }

      const httpCode = getHttpErrorCode(error)
      const httpData = getHttpErrorData<{ message?: string }>(error)

      if (httpCode === 401) {
        throw new OneClickBasketError('Authentification requise', 'AUTH_REQUIRED', 401)
      }
      if (httpCode === 404) {
        throw new OneClickBasketError('Panier non trouve', 'BASKET_NOT_FOUND', 404)
      }

      throw new OneClickBasketError(
        httpData?.message || 'Erreur lors de l\'initialisation du paiement',
        'NETWORK_ERROR',
        httpCode
      )
    }
  }
}

// Export de l'instance singleton
export const oneClickBasketService = new OneClickBasketService()
