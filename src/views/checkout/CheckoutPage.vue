<script setup lang="ts">
/**
 * Page de Checkout
 * Gère le processus de paiement complet:
 * 1. Sélection des adresses
 * 2. Affichage Stripe Payment Element
 * 3. Confirmation du paiement
 */
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js'
import { useCartStore } from '@/stores/cart.store'
import { useAuth } from '@/composables/useAuth'
import { paymentService } from '@/services/payment.service'
import type { CheckoutStep } from '@/types/payment.types'
import { toast } from 'vue-sonner'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

// ============================================
// Stores et Router
// ============================================
const router = useRouter()
const cartStore = useCartStore()
const { user } = useAuth()

// ============================================
// État du checkout
// ============================================
const currentStep = ref<CheckoutStep>('addresses')
const isLoading = ref(false)
const error = ref<string | null>(null)

// Sélection des adresses
const selectedShippingId = ref<number | null>(null)
const selectedBillingId = ref<number | null>(null)
const useSameAddress = ref(true)

// Stripe
const stripe = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
const cardElement = ref<StripeCardElement | null>(null)
const clientSecret = ref<string | null>(null)
const cardElementReady = ref(false)

// ============================================
// Computed
// ============================================
const icons = computed(() => ({
  shippingFast: byPrefixAndName.fas?.['shipping-fast'],
  fileInvoice: byPrefixAndName.fas?.['file-invoice'],
  creditCard: byPrefixAndName.fas?.['credit-card'],
  checkCircle: byPrefixAndName.fas?.['check-circle'],
  exclamationTriangle: byPrefixAndName.fas?.['exclamation-triangle'],
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  lock: byPrefixAndName.fas?.['lock'],
  spinner: byPrefixAndName.fas?.['spinner'],
}))

const addresses = computed(() => user.value?.addresses || [])
const hasAddresses = computed(() => addresses.value.length > 0)

const effectiveBillingId = computed(() => {
  return useSameAddress.value ? selectedShippingId.value : selectedBillingId.value
})

const canProceedToPayment = computed(() => {
  return selectedShippingId.value !== null && effectiveBillingId.value !== null
})

const selectedShippingAddress = computed(() => {
  return addresses.value.find(a => Number(a.id) === selectedShippingId.value)
})

const selectedBillingAddress = computed(() => {
  const id = effectiveBillingId.value
  return addresses.value.find(a => Number(a.id) === id)
})

// ============================================
// Formatage
// ============================================
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

function formatAddress(addr: any): string {
  if (!addr) return ''
  const parts = [addr.line1]
  if (addr.line2) parts.push(addr.line2)
  parts.push(`${addr.zipcode} ${addr.city}`)
  return parts.join(', ')
}

// ============================================
// Lifecycle
// ============================================
onMounted(async () => {
  // Vérifier que le panier n'est pas vide
  if (cartStore.isEmpty || !cartStore.basketCode) {
    toast.error('Votre panier est vide')
    router.push('/panier')
    return
  }

  // Pré-sélectionner les adresses par défaut
  const defaultShipping = addresses.value.find(a => a.isDefaultShipping)
  const defaultBilling = addresses.value.find(a => a.isDefaultBilling)

  if (defaultShipping && defaultShipping.id) {
    selectedShippingId.value = Number(defaultShipping.id)
  } else if (addresses.value.length > 0 && addresses.value[0]?.id) {
    selectedShippingId.value = Number(addresses.value[0].id)
  }

  if (defaultBilling && defaultBilling.id) {
    selectedBillingId.value = Number(defaultBilling.id)
  } else if (addresses.value.length > 0 && addresses.value[0]?.id) {
    selectedBillingId.value = Number(addresses.value[0].id)
  }
})

// ============================================
// Actions
// ============================================

/**
 * Passe à l'étape de paiement
 * Appelle le backend pour obtenir le client_secret et la clé publique Stripe
 */
async function proceedToPayment() {
  if (!canProceedToPayment.value || !cartStore.basketCode) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // Appeler le backend pour initialiser le paiement
    // L'API retourne client_secret + stripePublicKey
    const { clientSecret: secret, publicKey } = await paymentService.initPayment(
      cartStore.basketCode,
      selectedShippingId.value!,
      effectiveBillingId.value!,
      'eur'
    )

    // Charger Stripe avec la clé publique reçue de l'API
    stripe.value = await loadStripe(publicKey)
    if (!stripe.value) {
      throw new Error('Impossible de charger Stripe')
    }

    clientSecret.value = secret
    currentStep.value = 'payment'

    // Créer le Payment Element après le changement d'étape
    await nextTick()

    elements.value = stripe.value.elements({
      locale: 'fr',
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0F766E',
          borderRadius: '8px',
        },
      },
    })

    // Créer le Card Element (CB uniquement, pas de SEPA/PayPal)
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
      hidePostalCode: true, // On a déjà l'adresse de facturation
    })

    cardElement.value.mount('#card-element')
    cardElement.value.on('ready', () => {
      cardElementReady.value = true
    })
  } catch (err: any) {
    console.error('Erreur initialisation paiement:', err)
    const errorMessage = err.message || 'Impossible d\'initialiser le paiement'
    error.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

/**
 * Revient à l'étape de sélection des adresses
 */
function backToAddresses() {
  currentStep.value = 'addresses'
  clientSecret.value = null
  cardElement.value = null
  elements.value = null
  stripe.value = null
  cardElementReady.value = false
  error.value = null
}

/**
 * Confirme le paiement avec Stripe (CB uniquement)
 */
async function confirmPayment() {
  if (!stripe.value || !cardElement.value || !clientSecret.value) {
    return
  }

  isLoading.value = true
  error.value = null
  // Note: On ne change PAS l'étape ici pour garder le Card Element monté

  try {
    // Utiliser confirmCardPayment pour les paiements CB uniquement
    const { error: stripeError, paymentIntent } = await stripe.value.confirmCardPayment(
      clientSecret.value,
      {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: `${selectedBillingAddress.value?.firstName} ${selectedBillingAddress.value?.lastName}`,
            address: {
              line1: selectedBillingAddress.value?.line1,
              line2: selectedBillingAddress.value?.line2 || undefined,
              postal_code: selectedBillingAddress.value?.zipcode,
              city: selectedBillingAddress.value?.city,
              country: 'FR',
            },
          },
        },
      }
    )

    if (stripeError) {
      throw new Error(stripeError.message || 'Erreur lors du paiement')
    }

    if (paymentIntent?.status === 'succeeded') {
      currentStep.value = 'success'
      toast.success('Paiement réussi !')

      // Vider le panier après paiement réussi
      cartStore.resetCart()

      // Rediriger vers la page de confirmation après un délai
      setTimeout(() => {
        router.push('/mon-compte')
      }, 3000)
    } else if (paymentIntent?.status === 'requires_action') {
      // 3D Secure ou autre action requise - Stripe gère ça automatiquement
      console.log('Action supplémentaire requise (3D Secure)')
    } else if (paymentIntent?.status === 'processing') {
      // Paiement en cours de traitement (rare pour CB)
      toast.info('Paiement en cours de traitement...')
    } else {
      throw new Error('Statut de paiement inattendu: ' + paymentIntent?.status)
    }
  } catch (err: any) {
    console.error('Erreur confirmation paiement:', err)
    const errorMessage = err.message || 'Erreur lors du paiement'
    error.value = errorMessage
    // Rester sur l'étape payment pour permettre de réessayer
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

/**
 * Retourne au panier
 */
function goToCart() {
  router.push('/panier')
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="bg-white border-b border-gray-200 py-12">
        <div class="max-w-4xl mx-auto px-4">
          <div class="flex items-center gap-3 mb-3">
            <FontAwesomeIcon
              v-if="icons.creditCard"
              :icon="icons.creditCard"
              class="h-10 w-10 text-primary"
            />
            <h1 class="text-4xl md:text-5xl font-bold text-neutral-800" style="font-family: Roboto, sans-serif;">
              Finaliser ma commande
            </h1>
          </div>
          <p class="text-lg text-neutral-600">
            Confirmez vos adresses et procédez au paiement sécurisé
          </p>
        </div>
      </section>

      <!-- Contenu principal -->
      <section class="max-w-4xl mx-auto px-4 py-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Colonne gauche: Formulaire -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Alerte erreur -->
            <Alert v-if="error && currentStep !== 'error'" variant="destructive">
              <FontAwesomeIcon v-if="icons.exclamationTriangle" :icon="icons.exclamationTriangle" class="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{{ error }}</AlertDescription>
            </Alert>

            <!-- Étape 1: Sélection des adresses -->
            <template v-if="currentStep === 'addresses'">
              <!-- Pas d'adresses -->
              <Card v-if="!hasAddresses">
                <CardContent class="py-8 text-center">
                  <p class="text-neutral-600 mb-4">
                    Vous n'avez pas encore d'adresse enregistrée.
                  </p>
                  <Button @click="() => router.push('/mon-compte')">
                    Ajouter une adresse
                  </Button>
                </CardContent>
              </Card>

              <!-- Sélection adresse de livraison -->
              <Card v-else>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <FontAwesomeIcon v-if="icons.shippingFast" :icon="icons.shippingFast" class="h-5 w-5" />
                    Adresse de livraison
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez l'adresse où vous souhaitez recevoir votre commande
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                  <div
                    v-for="addr in addresses"
                    :key="addr.id"
                    class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
                    :class="{
                      'border-primary bg-primary/5': selectedShippingId === Number(addr.id),
                      'hover:border-neutral-400': selectedShippingId !== Number(addr.id)
                    }"
                    @click="selectedShippingId = Number(addr.id)"
                  >
                    <input
                      type="radio"
                      :checked="selectedShippingId === Number(addr.id)"
                      class="mt-1"
                    />
                    <div class="flex-1">
                      <p class="font-medium">{{ addr.firstName }} {{ addr.lastName }}</p>
                      <p class="text-sm text-neutral-600">{{ addr.line1 }}</p>
                      <p v-if="addr.line2" class="text-sm text-neutral-600">{{ addr.line2 }}</p>
                      <p class="text-sm text-neutral-600">{{ addr.zipcode }} {{ addr.city }}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Même adresse de facturation -->
              <Card v-if="hasAddresses">
                <CardContent class="py-4">
                  <div class="flex items-center gap-3">
                    <Checkbox
                      id="same-address"
                      :checked="useSameAddress"
                      @update:checked="(val: boolean | 'indeterminate') => useSameAddress = val === true"
                    />
                    <Label for="same-address" class="cursor-pointer">
                      Utiliser la même adresse pour la facturation
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <!-- Sélection adresse de facturation (si différente) -->
              <Card v-if="hasAddresses && !useSameAddress">
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <FontAwesomeIcon v-if="icons.fileInvoice" :icon="icons.fileInvoice" class="h-5 w-5" />
                    Adresse de facturation
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez l'adresse pour la facturation
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                  <div
                    v-for="addr in addresses"
                    :key="addr.id"
                    class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
                    :class="{
                      'border-primary bg-primary/5': selectedBillingId === Number(addr.id),
                      'hover:border-neutral-400': selectedBillingId !== Number(addr.id)
                    }"
                    @click="selectedBillingId = Number(addr.id)"
                  >
                    <input
                      type="radio"
                      :checked="selectedBillingId === Number(addr.id)"
                      class="mt-1"
                    />
                    <div class="flex-1">
                      <p class="font-medium">{{ addr.firstName }} {{ addr.lastName }}</p>
                      <p class="text-sm text-neutral-600">{{ addr.line1 }}</p>
                      <p v-if="addr.line2" class="text-sm text-neutral-600">{{ addr.line2 }}</p>
                      <p class="text-sm text-neutral-600">{{ addr.zipcode }} {{ addr.city }}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Bouton continuer -->
              <div class="flex gap-4">
                <Button variant="outline" @click="goToCart">
                  <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="h-4 w-4 mr-2" />
                  Retour au panier
                </Button>
                <Button
                  @click="proceedToPayment"
                  :disabled="!canProceedToPayment || isLoading"
                  class="flex-1"
                >
                  <FontAwesomeIcon
                    v-if="isLoading && icons.spinner"
                    :icon="icons.spinner"
                    class="h-4 w-4 mr-2 animate-spin"
                  />
                  <span v-if="isLoading">Chargement...</span>
                  <span v-else>Continuer vers le paiement</span>
                </Button>
              </div>
            </template>

            <!-- Étape 2: Paiement Stripe -->
            <template v-if="currentStep === 'payment'">
              <!-- Résumé des adresses sélectionnées -->
              <Card>
                <CardHeader>
                  <CardTitle>Adresses sélectionnées</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div>
                    <p class="text-sm font-medium text-neutral-500 mb-1">Livraison</p>
                    <p class="text-sm">{{ formatAddress(selectedShippingAddress) }}</p>
                  </div>
                  <Separator />
                  <div>
                    <p class="text-sm font-medium text-neutral-500 mb-1">Facturation</p>
                    <p class="text-sm">{{ formatAddress(selectedBillingAddress) }}</p>
                  </div>
                  <Button variant="link" size="sm" class="px-0" @click="backToAddresses">
                    Modifier les adresses
                  </Button>
                </CardContent>
              </Card>

              <!-- Stripe Payment Element -->
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <FontAwesomeIcon v-if="icons.lock" :icon="icons.lock" class="h-5 w-5" />
                    Paiement sécurisé
                  </CardTitle>
                  <CardDescription>
                    Vos informations de paiement sont protégées par Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div id="card-element" class="p-4 border border-gray-200 rounded-lg min-h-[50px]">
                    <!-- Stripe Card Element sera monté ici -->
                  </div>
                  <Skeleton v-if="!cardElementReady" class="h-12 w-full mt-2" />
                </CardContent>
              </Card>

              <!-- Boutons -->
              <div class="flex gap-4">
                <Button variant="outline" @click="backToAddresses">
                  <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <Button
                  @click="confirmPayment"
                  :disabled="!cardElementReady || isLoading"
                  class="flex-1"
                >
                  <FontAwesomeIcon
                    v-if="isLoading && icons.spinner"
                    :icon="icons.spinner"
                    class="h-4 w-4 mr-2 animate-spin"
                  />
                  <span v-if="isLoading">Traitement en cours...</span>
                  <span v-else>Payer {{ formatPrice(cartStore.subtotal) }}</span>
                </Button>
              </div>
            </template>

            <!-- Étape 3: Traitement -->
            <template v-if="currentStep === 'processing'">
              <Card>
                <CardContent class="py-16 text-center">
                  <FontAwesomeIcon
                    v-if="icons.spinner"
                    :icon="icons.spinner"
                    class="h-12 w-12 text-primary mx-auto mb-4 animate-spin"
                  />
                  <p class="text-lg font-medium">Traitement de votre paiement...</p>
                  <p class="text-neutral-500">Veuillez ne pas fermer cette page</p>
                </CardContent>
              </Card>
            </template>

            <!-- Étape 4: Succès -->
            <template v-if="currentStep === 'success'">
              <Card>
                <CardContent class="py-16 text-center">
                  <FontAwesomeIcon
                    v-if="icons.checkCircle"
                    :icon="icons.checkCircle"
                    class="h-16 w-16 text-green-500 mx-auto mb-4"
                  />
                  <h2 class="text-2xl font-bold mb-2">Paiement réussi !</h2>
                  <p class="text-neutral-600 mb-4">
                    Merci pour votre commande. Vous allez recevoir un email de confirmation.
                  </p>
                  <p class="text-sm text-neutral-500">
                    Redirection vers votre compte dans quelques secondes...
                  </p>
                </CardContent>
              </Card>
            </template>

            <!-- Étape 5: Erreur -->
            <template v-if="currentStep === 'error'">
              <Card>
                <CardContent class="py-16 text-center">
                  <FontAwesomeIcon
                    v-if="icons.exclamationTriangle"
                    :icon="icons.exclamationTriangle"
                    class="h-16 w-16 text-red-500 mx-auto mb-4"
                  />
                  <h2 class="text-2xl font-bold mb-2">Erreur de paiement</h2>
                  <p class="text-neutral-600 mb-4">
                    {{ error || 'Une erreur est survenue lors du paiement.' }}
                  </p>
                  <div class="flex gap-4 justify-center">
                    <Button variant="outline" @click="goToCart">
                      Retour au panier
                    </Button>
                    <Button @click="backToAddresses">
                      Réessayer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </template>

          </div>

          <!-- Colonne droite: Résumé commande -->
          <div class="lg:col-span-1">
            <Card class="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <!-- Liste des articles -->
                <div class="space-y-3">
                  <div v-for="item in cartStore.items" :key="item.itemId" class="flex gap-3">
                    <div class="w-12 h-12 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
                      <img
                        v-if="item.images?.[0]"
                        :src="item.images[0]"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">{{ item.name }}</p>
                      <p class="text-sm text-neutral-500">Qté: {{ item.quantity }}</p>
                    </div>
                    <p class="text-sm font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
                  </div>
                </div>

                <Separator />

                <!-- Totaux -->
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>Sous-total HT</span>
                    <span>{{ formatPrice(cartStore.subtotalExclVAT) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>TVA</span>
                    <span>{{ formatPrice(cartStore.vatAmount) }}</span>
                  </div>
                  <Separator />
                  <div class="flex justify-between font-bold text-lg">
                    <span>Total TTC</span>
                    <span class="text-primary">{{ formatPrice(cartStore.subtotal) }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </div>
  </DefaultLayout>
</template>
