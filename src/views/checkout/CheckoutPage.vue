<script setup lang="ts">
/**
 * Page de Checkout Unifiee
 * Gere le processus de paiement pour:
 * - Boutique (PaymentIntent) via route /commander
 * - Abonnements OneClick (SetupIntent) via route /abonnement/checkout
 *
 * Le type de checkout est determine par la meta de la route (checkoutType)
 */
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js'
import { useCheckoutFlow, isOneClickItem, type CheckoutType } from '@/composables/useCheckoutFlow'
import { useAuth } from '@/composables/useAuth'
import type { CheckoutStep } from '@/types/payment.types'
import type { OneClickBasketItem } from '@/types/oneclick-basket.types'
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
import { byPrefixAndName } from '@/lib/icons'
import CheckoutSubscriptionSummary from '@/components/checkout/CheckoutSubscriptionSummary.vue'

// ============================================
// Router et Type de checkout
// ============================================
const router = useRouter()
const route = useRoute()
const { user } = useAuth()

// Determiner le type de checkout depuis la meta de la route
const checkoutType = computed<CheckoutType>(() => {
  return (route.meta.checkoutType as CheckoutType) || 'shop'
})

// Utiliser le composable avec le type de checkout
const {
  basketCode,
  isEmpty,
  items,
  totalPrice,
  subtotalExclVAT,
  vatAmount,
  isLoading: flowIsLoading,
  initPayment,
  confirmPayment,
  resetBasket,
  checkoutTitle,
  isSubscription,
  successMessage,
  buttonLabel,
} = useCheckoutFlow(checkoutType.value)

// ============================================
// Etat du checkout
// ============================================
const currentStep = ref<CheckoutStep>('addresses')
const isLoading = ref(false)
const error = ref<string | null>(null)

// Selection des adresses
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
  ccVisa: byPrefixAndName.fab?.['cc-visa'],
  ccMastercard: byPrefixAndName.fab?.['cc-mastercard'],
  ccAmex: byPrefixAndName.fab?.['cc-amex'],
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

// Titre de page dynamique
const pageTitle = computed(() => {
  return isSubscription ? 'Finaliser mon abonnement' : 'Finaliser ma commande'
})

const pageSubtitle = computed(() => {
  return isSubscription
    ? 'Configurez votre methode de paiement pour votre abonnement'
    : 'Confirmez vos adresses et procedez au paiement securise'
})

// Route de retour
const backRoute = computed(() => {
  return isSubscription ? '/academie' : '/panier'
})

// Premier item OneClick pour le resume
const oneClickItem = computed<OneClickBasketItem | null>(() => {
  const firstItem = items.value[0]
  if (isSubscription && firstItem && isOneClickItem(firstItem)) {
    return firstItem
  }
  return null
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
  // Verifier que le panier n'est pas vide
  if (isEmpty.value || !basketCode.value) {
    toast.error(isSubscription ? 'Aucun abonnement selectionne' : 'Votre panier est vide')
    router.push(backRoute.value)
    return
  }

  // Pre-selectionner les adresses par defaut
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
 * Passe a l'etape de paiement
 */
async function proceedToPayment() {
  if (!canProceedToPayment.value || !basketCode.value) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // Initialiser le paiement via le composable
    const { clientSecret: secret, publicKey } = await initPayment(
      selectedShippingId.value!,
      effectiveBillingId.value!
    )

    // Charger Stripe
    stripe.value = await loadStripe(publicKey)
    if (!stripe.value) {
      throw new Error('Impossible de charger Stripe')
    }

    clientSecret.value = secret
    currentStep.value = 'payment'

    // Creer le Card Element
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
      hidePostalCode: true,
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
 * Revient a l'etape des adresses
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
 * Confirme le paiement
 */
async function handleConfirmPayment() {
  if (!stripe.value || !cardElement.value || !clientSecret.value) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const result = await confirmPayment(
      stripe.value,
      cardElement.value,
      clientSecret.value,
      {
        name: `${selectedBillingAddress.value?.firstName} ${selectedBillingAddress.value?.lastName}`,
        address: {
          line1: selectedBillingAddress.value?.line1,
          line2: selectedBillingAddress.value?.line2 || undefined,
          postal_code: selectedBillingAddress.value?.zipcode,
          city: selectedBillingAddress.value?.city,
          country: 'FR',
        },
      }
    )

    if (!result.success) {
      throw new Error(result.error || 'Erreur lors du paiement')
    }

    currentStep.value = 'success'
    toast.success(isSubscription ? 'Abonnement active !' : 'Paiement reussi !')

    // Reinitialiser le panier
    resetBasket()

    // Rediriger apres un delai
    setTimeout(() => {
      router.push('/mon-compte')
    }, 3000)
  } catch (err: any) {
    console.error('Erreur confirmation paiement:', err)
    const errorMessage = err.message || 'Erreur lors du paiement'
    error.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

/**
 * Retourne au panier / academie
 */
function goBack() {
  router.push(backRoute.value)
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
              class="h-10 w-10 text-secondary"
            />
            <h1 class="text-4xl md:text-5xl font-bold text-neutral-800" style="font-family: Roboto, sans-serif;">
              {{ pageTitle }}
            </h1>
          </div>
          <p class="text-lg text-neutral-600">
            {{ pageSubtitle }}
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

            <!-- Etape 1: Selection des adresses -->
            <template v-if="currentStep === 'addresses'">
              <!-- Pas d'adresses -->
              <Card v-if="!hasAddresses">
                <CardContent class="py-8 text-center">
                  <p class="text-neutral-600 mb-4">
                    Vous n'avez pas encore d'adresse enregistree.
                  </p>
                  <Button @click="() => router.push('/mon-compte')">
                    Ajouter une adresse
                  </Button>
                </CardContent>
              </Card>

              <!-- Selection adresse de livraison -->
              <Card v-else>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <FontAwesomeIcon v-if="icons.shippingFast" :icon="icons.shippingFast" class="h-5 w-5" />
                    {{ isSubscription ? 'Adresse de facturation' : 'Adresse de livraison' }}
                  </CardTitle>
                  <CardDescription>
                    {{ isSubscription
                      ? 'Selectionnez l\'adresse pour la facturation de votre abonnement'
                      : 'Selectionnez l\'adresse ou vous souhaitez recevoir votre commande'
                    }}
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

              <!-- Meme adresse de facturation (seulement pour boutique) -->
              <Card v-if="hasAddresses && !isSubscription">
                <CardContent class="py-4">
                  <div class="flex items-center gap-3">
                    <Checkbox
                      id="same-address"
                      :checked="useSameAddress"
                      @update:checked="(val: boolean | 'indeterminate') => useSameAddress = val === true"
                    />
                    <Label for="same-address" class="cursor-pointer">
                      Utiliser la meme adresse pour la facturation
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <!-- Selection adresse de facturation (si differente) -->
              <Card v-if="hasAddresses && !useSameAddress && !isSubscription">
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <FontAwesomeIcon v-if="icons.fileInvoice" :icon="icons.fileInvoice" class="h-5 w-5" />
                    Adresse de facturation
                  </CardTitle>
                  <CardDescription>
                    Selectionnez l'adresse pour la facturation
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
                <Button variant="outline" color="secondary" rounded="lg" class="hover:bg-secondary hover:border-secondary" @click="goBack">
                  <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="h-4 w-4 mr-2" />
                  {{ isSubscription ? 'Retour' : 'Retour au panier' }}
                </Button>
                <Button
                  variant="secondary"
                  rounded="lg"
                  class="flex-1"
                  :disabled="!canProceedToPayment || isLoading"
                  @click="proceedToPayment"
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

            <!-- Etape 2: Paiement Stripe -->
            <template v-if="currentStep === 'payment'">
              <!-- Resume des adresses selectionnees -->
              <Card>
                <CardHeader>
                  <CardTitle>{{ isSubscription ? 'Adresse selectionnee' : 'Adresses selectionnees' }}</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div>
                    <p class="text-sm font-medium text-neutral-500 mb-1">
                      {{ isSubscription ? 'Facturation' : 'Livraison' }}
                    </p>
                    <p class="text-sm">{{ formatAddress(selectedShippingAddress) }}</p>
                  </div>
                  <template v-if="!isSubscription">
                    <Separator />
                    <div>
                      <p class="text-sm font-medium text-neutral-500 mb-1">Facturation</p>
                      <p class="text-sm">{{ formatAddress(selectedBillingAddress) }}</p>
                    </div>
                  </template>
                  <Button variant="link" color="secondary" size="sm" class="px-0 underline" @click="backToAddresses">
                    Modifier {{ isSubscription ? 'l\'adresse' : 'les adresses' }}
                  </Button>
                </CardContent>
              </Card>

              <!-- Stripe Card Element -->
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <FontAwesomeIcon v-if="icons.lock" :icon="icons.lock" class="h-5 w-5" />
                    Paiement securise
                  </CardTitle>
                  <CardDescription>
                    Vos informations de paiement sont protegees par Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <!-- Logos cartes acceptees -->
                  <div class="flex items-center gap-4 mb-4">
                    <div class="flex items-center justify-center w-full gap-4">
                      <FontAwesomeIcon v-if="icons.ccVisa" :icon="icons.ccVisa" class="h-16 w-16 text-[#1A1F71] fa-2x" />
                      <FontAwesomeIcon v-if="icons.ccMastercard" :icon="icons.ccMastercard" class="h-16 w-16 text-[#EB001B] fa-2x" />
                      <FontAwesomeIcon v-if="icons.ccAmex" :icon="icons.ccAmex" class="h-16 w-16 text-[#006FCF] fa-2x" />
                    </div>
                  </div>
                  <div id="card-element" class="p-4 border border-gray-200 rounded-lg min-h-[50px]">
                    <!-- Stripe Card Element sera monte ici -->
                  </div>
                  <Skeleton v-if="!cardElementReady" class="h-12 w-full mt-2" />
                </CardContent>
              </Card>

              <!-- Boutons -->
              <div class="flex gap-4">
                <Button variant="outline" color="secondary" rounded="lg" class="hover:bg-secondary hover:border-secondary" @click="backToAddresses">
                  <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <Button
                  class="flex-1"
                  :disabled="!cardElementReady || isLoading"
                  rounded="lg"
                  variant="secondary"
                  @click="handleConfirmPayment"
                >
                  <FontAwesomeIcon
                    v-if="isLoading && icons.spinner"
                    :icon="icons.spinner"
                    class="h-4 w-4 mr-2 animate-spin"
                  />
                  <span v-if="isLoading">Traitement en cours...</span>
                  <span v-else>{{ buttonLabel(formatPrice(totalPrice)) }}</span>
                </Button>
              </div>
            </template>

            <!-- Etape 3: Traitement -->
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

            <!-- Etape 4: Succes -->
            <template v-if="currentStep === 'success'">
              <Card>
                <CardContent class="py-16 text-center">
                  <FontAwesomeIcon
                    v-if="icons.checkCircle"
                    :icon="icons.checkCircle"
                    class="h-16 w-16 text-green-500 mx-auto mb-4"
                  />
                  <h2 class="text-2xl font-bold mb-2">
                    {{ isSubscription ? 'Abonnement active !' : 'Paiement reussi !' }}
                  </h2>
                  <p class="text-neutral-600 mb-4">
                    {{ successMessage }}
                  </p>
                  <p class="text-sm text-neutral-500">
                    Redirection vers votre compte dans quelques secondes...
                  </p>
                </CardContent>
              </Card>
            </template>

            <!-- Etape 5: Erreur -->
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
                    <Button variant="outline" @click="goBack">
                      Retour
                    </Button>
                    <Button @click="backToAddresses">
                      Reessayer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </template>

          </div>

          <!-- Colonne droite: Resume -->
          <div class="lg:col-span-1">
            <!-- Resume abonnement (OneClick) -->
            <CheckoutSubscriptionSummary
              v-if="isSubscription && oneClickItem"
              :item="oneClickItem"
              :total-price="totalPrice"
            />

            <!-- Resume commande (Boutique) -->
            <Card v-else class="sticky top-24">
              <CardHeader>
                <CardTitle>{{ checkoutTitle }}</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <!-- Liste des articles -->
                <div class="space-y-3">
                  <div v-for="item in items" :key="'itemId' in item ? item.itemId : item.planId" class="flex gap-3">
                    <div class="w-12 h-12 shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                      <img
                        v-if="'images' in item && item.images?.[0]"
                        :src="item.images[0]"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">{{ item.name }}</p>
                      <p v-if="'quantity' in item" class="text-sm text-neutral-500">Qte: {{ item.quantity }}</p>
                    </div>
                    <p class="text-sm font-medium">
                      {{ formatPrice('quantity' in item ? item.price * item.quantity : item.price) }}
                    </p>
                  </div>
                </div>

                <Separator />

                <!-- Totaux -->
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>Sous-total HT</span>
                    <span>{{ formatPrice(subtotalExclVAT) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>TVA</span>
                    <span>{{ formatPrice(vatAmount) }}</span>
                  </div>
                  <Separator />
                  <div class="flex justify-between font-bold text-lg">
                    <span>Total TTC</span>
                    <span class="text-secondary">{{ formatPrice(totalPrice) }}</span>
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
