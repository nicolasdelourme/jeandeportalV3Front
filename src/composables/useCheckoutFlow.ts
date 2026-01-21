/**
 * Composable pour unifier le flux de checkout
 * Abstrait les differences entre la boutique (PaymentIntent) et OneClick (SetupIntent)
 */

import { computed, type ComputedRef, type Component, markRaw } from 'vue'
import type { Stripe, StripeCardElement } from '@stripe/stripe-js'
import { useCartStore } from '@/stores/cart.store'
import { useOneClickBasketStore } from '@/stores/oneclick-basket.store'
import { paymentService } from '@/services/payment.service'
import { oneClickBasketService } from '@/services/oneclick-basket.service'
import type { CartItem } from '@/types/cart.types'
import type { OneClickBasketItem } from '@/types/oneclick-basket.types'

/**
 * Type de checkout
 */
export type CheckoutType = 'shop' | 'oneclick'

/**
 * Item generique pour le checkout
 * Union des types CartItem et OneClickBasketItem
 */
export type CheckoutItem = CartItem | OneClickBasketItem

/**
 * Resultat de l'initialisation du paiement
 */
export interface InitPaymentResult {
  clientSecret: string
  publicKey: string
}

/**
 * Billing details pour Stripe
 */
export interface BillingDetails {
  name: string
  address: {
    line1: string | undefined
    line2?: string
    postal_code: string | undefined
    city: string | undefined
    country: string
  }
}

/**
 * Interface du composable
 */
export interface CheckoutFlow {
  // State
  basketCode: ComputedRef<string | null>
  isEmpty: ComputedRef<boolean>
  items: ComputedRef<CheckoutItem[]>
  totalPrice: ComputedRef<number>
  subtotalExclVAT: ComputedRef<number>
  vatAmount: ComputedRef<number>
  isLoading: ComputedRef<boolean>

  // Actions
  initPayment: (shippingId: number, billingId: number) => Promise<InitPaymentResult>
  confirmPayment: (
    stripe: Stripe,
    cardElement: StripeCardElement,
    clientSecret: string,
    billingDetails: BillingDetails
  ) => Promise<{ success: boolean; error?: string }>
  resetBasket: () => void

  // Display
  checkoutTitle: string
  isSubscription: boolean
  successMessage: string
  buttonLabel: (formattedPrice: string) => string
}

/**
 * Composable useCheckoutFlow
 * Fournit une interface unifiee pour le checkout boutique et OneClick
 *
 * @param type - 'shop' pour la boutique, 'oneclick' pour les abonnements
 */
export function useCheckoutFlow(type: CheckoutType): CheckoutFlow {
  const cartStore = useCartStore()
  const oneClickStore = useOneClickBasketStore()

  // ============================================
  // State
  // ============================================

  const basketCode = computed(() => {
    if (type === 'shop') {
      return cartStore.basketCode
    }
    return oneClickStore.basketCode
  })

  const isEmpty = computed(() => {
    if (type === 'shop') {
      return cartStore.isEmpty
    }
    return oneClickStore.isEmpty
  })

  const items = computed<CheckoutItem[]>(() => {
    if (type === 'shop') {
      return cartStore.items
    }
    return oneClickStore.items
  })

  const totalPrice = computed(() => {
    if (type === 'shop') {
      return cartStore.subtotal
    }
    return oneClickStore.totalPrice
  })

  const subtotalExclVAT = computed(() => {
    if (type === 'shop') {
      return cartStore.subtotalExclVAT
    }
    // Pour OneClick, on considere que le prix est TTC
    // et on calcule le HT (TVA a 20%)
    return oneClickStore.totalPrice / 1.2
  })

  const vatAmount = computed(() => {
    if (type === 'shop') {
      return cartStore.vatAmount
    }
    // Pour OneClick, TVA = prix - HT
    return oneClickStore.totalPrice - subtotalExclVAT.value
  })

  const isLoading = computed(() => {
    if (type === 'shop') {
      return cartStore.isLoading
    }
    return oneClickStore.isLoading
  })

  // ============================================
  // Actions
  // ============================================

  /**
   * Initialise le paiement aupres du backend
   * Retourne le client_secret et la cle publique Stripe
   */
  async function initPayment(
    shippingId: number,
    billingId: number
  ): Promise<InitPaymentResult> {
    const code = basketCode.value

    if (!code) {
      throw new Error('Pas de panier actif')
    }

    if (type === 'shop') {
      // Boutique: PaymentIntent
      console.log('💳 [CHECKOUT FLOW] Init PaymentIntent (shop)')
      return paymentService.initPayment(code, shippingId, billingId, 'eur')
    } else {
      // OneClick: SetupIntent
      console.log('💳 [CHECKOUT FLOW] Init SetupIntent (oneclick)')
      return oneClickBasketService.initPayment(code, shippingId, billingId)
    }
  }

  /**
   * Confirme le paiement avec Stripe
   * Boutique: confirmCardPayment (paiement immediat)
   * OneClick: confirmCardSetup (autorisation recurrente)
   */
  async function confirmPayment(
    stripe: Stripe,
    cardElement: StripeCardElement,
    clientSecret: string,
    billingDetails: BillingDetails
  ): Promise<{ success: boolean; error?: string }> {
    if (type === 'shop') {
      // Boutique: confirmCardPayment
      console.log('💳 [CHECKOUT FLOW] confirmCardPayment (shop)')

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      })

      if (error) {
        return { success: false, error: error.message || 'Erreur lors du paiement' }
      }

      if (paymentIntent?.status === 'succeeded') {
        return { success: true }
      }

      if (paymentIntent?.status === 'requires_action') {
        // 3D Secure gere automatiquement par Stripe
        console.log('💳 [CHECKOUT FLOW] 3D Secure en cours...')
        return { success: true }
      }

      if (paymentIntent?.status === 'processing') {
        // Rare pour CB
        return { success: true }
      }

      return { success: false, error: `Statut inattendu: ${paymentIntent?.status}` }
    } else {
      // OneClick: confirmCardSetup
      console.log('💳 [CHECKOUT FLOW] confirmCardSetup (oneclick)')

      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      })

      if (error) {
        return { success: false, error: error.message || 'Erreur lors de la configuration' }
      }

      if (setupIntent?.status === 'succeeded') {
        return { success: true }
      }

      if (setupIntent?.status === 'requires_action') {
        // 3D Secure gere automatiquement par Stripe
        console.log('💳 [CHECKOUT FLOW] 3D Secure en cours...')
        return { success: true }
      }

      return { success: false, error: `Statut inattendu: ${setupIntent?.status}` }
    }
  }

  /**
   * Reinitialise le panier apres paiement reussi
   */
  function resetBasket(): void {
    if (type === 'shop') {
      console.log('🛒 [CHECKOUT FLOW] Reset cart (shop)')
      cartStore.resetCart()
    } else {
      console.log('🛒 [CHECKOUT FLOW] Reset basket (oneclick)')
      oneClickStore.resetBasket()
    }
  }

  // ============================================
  // Display
  // ============================================

  const checkoutTitle = type === 'shop' ? 'Votre commande' : 'Votre abonnement'

  const isSubscription = type === 'oneclick'

  const successMessage =
    type === 'shop'
      ? 'Merci pour votre commande. Vous allez recevoir un email de confirmation.'
      : 'Votre abonnement est active ! Vous allez recevoir un email de confirmation.'

  const buttonLabel = (formattedPrice: string) => {
    if (type === 'shop') {
      return `Payer ${formattedPrice}`
    }
    return `Souscrire pour ${formattedPrice}/mois`
  }

  // ============================================
  // Return
  // ============================================

  return {
    // State
    basketCode,
    isEmpty,
    items,
    totalPrice,
    subtotalExclVAT,
    vatAmount,
    isLoading,

    // Actions
    initPayment,
    confirmPayment,
    resetBasket,

    // Display
    checkoutTitle,
    isSubscription,
    successMessage,
    buttonLabel,
  }
}

/**
 * Helper pour determiner si un item est un CartItem
 */
export function isCartItem(item: CheckoutItem): item is CartItem {
  return 'itemId' in item && 'quantity' in item
}

/**
 * Helper pour determiner si un item est un OneClickBasketItem
 */
export function isOneClickItem(item: CheckoutItem): item is OneClickBasketItem {
  return 'planId' in item && 'interval' in item
}
