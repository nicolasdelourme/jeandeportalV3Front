/**
 * useStripeCardElement - Composable pour gérer Stripe Card Element
 * Gère le setup et cleanup automatique de Stripe Elements
 */
import { ref, onUnmounted, nextTick } from 'vue'
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js'

export interface StripeCardElementOptions {
  locale?: 'fr' | 'en'
  primaryColor?: string
  hidePostalCode?: boolean
}

export function useStripeCardElement(options: StripeCardElementOptions = {}) {
  const {
    locale = 'fr',
    primaryColor = '#0F766E',
    hidePostalCode = true,
  } = options

  const stripe = ref<Stripe | null>(null)
  const elements = ref<StripeElements | null>(null)
  const cardElement = ref<StripeCardElement | null>(null)
  const isReady = ref(false)
  const error = ref<string | null>(null)

  /**
   * Initialise Stripe et monte le Card Element
   */
  async function mount(publicKey: string, mountSelector: string): Promise<void> {
    error.value = null
    isReady.value = false

    try {
      // Charger Stripe
      stripe.value = await loadStripe(publicKey)
      if (!stripe.value) {
        throw new Error('Impossible de charger Stripe')
      }

      // Attendre le prochain tick pour que le DOM soit prêt
      await nextTick()

      // Créer Elements
      elements.value = stripe.value.elements({
        locale,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: primaryColor,
            borderRadius: '8px',
          },
        },
      })

      // Créer Card Element
      cardElement.value = elements.value.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#1f2937',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            '::placeholder': {
              color: '#9ca3af',
            },
          },
          invalid: {
            color: '#ef4444',
          },
        },
        hidePostalCode,
      })

      // Monter le Card Element
      cardElement.value.mount(mountSelector)
      cardElement.value.on('ready', () => {
        isReady.value = true
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement de Stripe'
      throw err
    }
  }

  /**
   * Nettoie toutes les ressources Stripe
   */
  function cleanup(): void {
    if (cardElement.value) {
      cardElement.value.unmount()
      cardElement.value = null
    }
    elements.value = null
    stripe.value = null
    isReady.value = false
    error.value = null
  }

  // Cleanup automatique au démontage du composant
  onUnmounted(() => {
    cleanup()
  })

  return {
    stripe,
    elements,
    cardElement,
    isReady,
    error,
    mount,
    cleanup,
  }
}
