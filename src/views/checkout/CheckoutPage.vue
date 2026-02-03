<script setup lang="ts">
/**
 * Page de Checkout Unifiée
 * Gère le processus de paiement pour:
 * - Boutique (PaymentIntent) via route /commander
 * - Abonnements OneClick (SetupIntent) via route /abonnement/checkout
 *
 * Le type de checkout est déterminé par la meta de la route (checkoutType)
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Stripe, StripeCardElement } from '@stripe/stripe-js'
import { logger } from '@/utils/logger'
import { useCheckoutFlow, isOneClickItem, type CheckoutType } from '@/composables/useCheckoutFlow'
import { useAuth } from '@/composables/useAuth'
import type { CheckoutStep } from '@/types/payment.types'
import type { OneClickBasketItem } from '@/types/oneclick-basket.types'
import type { CartItem } from '@/types/cart.types'
import { toast } from 'vue-sonner'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
// Composants extraits
import AddressSelect from '@/components/checkout/AddressSelect.vue'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import AddressSummary from '@/components/checkout/AddressSummary.vue'
import CheckoutSubscriptionSummary from '@/components/checkout/CheckoutSubscriptionSummary.vue'
import CheckoutShopSummary from '@/components/checkout/CheckoutShopSummary.vue'
import StripeCardForm from '@/components/checkout/StripeCardForm.vue'

// ============================================
// Router et Type de checkout
// ============================================
const router = useRouter()
const route = useRoute()
const { user } = useAuth()

const checkoutType = computed<CheckoutType>(() => {
  return (route.meta.checkoutType as CheckoutType) || 'shop'
})

const {
  basketCode,
  isEmpty,
  items,
  totalPrice,
  subtotalExclVAT,
  vatAmount,
  initPayment,
  confirmPayment,
  resetBasket,
  checkoutTitle,
  isSubscription,
  successMessage,
  buttonLabel,
} = useCheckoutFlow(checkoutType.value)

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

// Stripe (refs depuis StripeCardForm)
const stripeFormRef = ref<InstanceType<typeof StripeCardForm> | null>(null)
const stripe = ref<Stripe | null>(null)
const cardElement = ref<StripeCardElement | null>(null)
const clientSecret = ref<string | null>(null)
const stripePublicKey = ref<string | null>(null)
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

const pageTitle = computed(() => {
  return isSubscription ? 'Finaliser mon abonnement' : 'Finaliser ma commande'
})

const pageSubtitle = computed(() => {
  return isSubscription
    ? 'Configurez votre méthode de paiement pour votre abonnement'
    : 'Confirmez vos adresses et procédez au paiement sécurisé'
})

const backRoute = computed(() => {
  return isSubscription ? '/academie' : '/panier'
})

const oneClickItem = computed<OneClickBasketItem | null>(() => {
  const firstItem = items.value[0]
  if (isSubscription && firstItem && isOneClickItem(firstItem)) {
    return firstItem
  }
  return null
})

// Cast items pour le résumé boutique (seulement CartItem[])
const shopItems = computed<CartItem[]>(() => {
  if (isSubscription) return []
  return items.value as CartItem[]
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

// ============================================
// Lifecycle
// ============================================
onMounted(async () => {
  if (isEmpty.value || !basketCode.value) {
    toast.error(isSubscription ? 'Aucun abonnement sélectionné' : 'Votre panier est vide')
    router.push(backRoute.value)
    return
  }

  // Pré-sélectionner les adresses par défaut
  const defaultShipping = addresses.value.find(a => a.isDefaultShipping)
  const defaultBilling = addresses.value.find(a => a.isDefaultBilling)

  if (defaultShipping?.id) {
    selectedShippingId.value = Number(defaultShipping.id)
  } else if (addresses.value.length > 0 && addresses.value[0]?.id) {
    selectedShippingId.value = Number(addresses.value[0].id)
  }

  if (defaultBilling?.id) {
    selectedBillingId.value = Number(defaultBilling.id)
  } else if (addresses.value.length > 0 && addresses.value[0]?.id) {
    selectedBillingId.value = Number(addresses.value[0].id)
  }

  // Smart useSameAddress : si les 2 défauts sont la même adresse, cocher la case
  if (!isSubscription) {
    useSameAddress.value = selectedShippingId.value === selectedBillingId.value
  }
})

// ============================================
// Actions
// ============================================
async function proceedToPayment() {
  if (!canProceedToPayment.value || !basketCode.value) return

  isLoading.value = true
  error.value = null

  try {
    const { clientSecret: secret, publicKey } = await initPayment(
      selectedShippingId.value!,
      effectiveBillingId.value!
    )

    clientSecret.value = secret
    stripePublicKey.value = publicKey
    currentStep.value = 'payment'
  } catch (err) {
    logger.error('Erreur initialisation paiement:', err)
    const errorMessage = err instanceof Error ? err.message : "Impossible d'initialiser le paiement"
    error.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

function backToAddresses() {
  currentStep.value = 'addresses'
  clientSecret.value = null
  stripePublicKey.value = null
  cardElementReady.value = false
  stripe.value = null
  cardElement.value = null
  error.value = null
  // Cleanup du composant Stripe
  stripeFormRef.value?.cleanup()
}

function handleStripeReady(stripeInstance: Stripe, card: StripeCardElement) {
  stripe.value = stripeInstance
  cardElement.value = card
  cardElementReady.value = true
}

function handleStripeError(message: string) {
  error.value = message
  toast.error(message)
}

async function handleConfirmPayment() {
  if (!stripe.value || !cardElement.value || !clientSecret.value) return

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
    toast.success(isSubscription ? 'Abonnement activé !' : 'Paiement réussi !')
    resetBasket()

    setTimeout(() => {
      router.push('/mon-compte')
    }, 3000)
  } catch (err) {
    logger.error('Erreur confirmation paiement:', err)
    const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement'
    error.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.push(backRoute.value)
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Contenu principal -->
      <section class="max-w-4xl mx-auto px-4 py-6">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Colonne gauche: Formulaire -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Header compact -->
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold font-heading text-foreground">{{ pageTitle }}</h1>
                <p class="text-sm text-muted-foreground mt-0.5">{{ pageSubtitle }}</p>
              </div>
              <Button variant="ghost" color="secondary" size="sm" @click="goBack">
                <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="h-4 w-4 mr-1.5 " />
                {{ isSubscription ? 'Retour' : 'Panier' }}
              </Button>
            </div>
            <!-- Alerte erreur -->
            <Alert v-if="error && currentStep !== 'error'" variant="destructive">
              <FontAwesomeIcon v-if="icons.exclamationTriangle" :icon="icons.exclamationTriangle" class="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{{ error }}</AlertDescription>
            </Alert>

            <!-- Étape 1: Sélection des adresses -->
            <template v-if="currentStep === 'addresses'">
              <!-- Pas d'adresses -->
              <Card v-if="!hasAddresses" class="border-secondary">
                <CardContent class="py-8 text-center">
                  <p class="text-neutral-600 mb-4">Vous n'avez pas encore d'adresse enregistrée.</p>
                  <Button @click="() => router.push('/mon-compte')">Ajouter une adresse</Button>
                </CardContent>
              </Card>

              <!-- Sélection des adresses -->
              <Card v-else class="border-secondary rounded-lg">
                <CardContent class="pt-6 pb-5 space-y-5">
                  <!-- Adresse de livraison / facturation (abonnement) -->
                  <AddressSelect
                    v-model="selectedShippingId"
                    :addresses="addresses"
                    :label="isSubscription ? 'Adresse de facturation' : 'Adresse de livraison'"
                    :icon="icons.shippingFast"
                  />

                  <!-- Même adresse facturation (boutique seulement) -->
                  <div v-if="!isSubscription" class="flex items-center gap-2.5">
                    <Checkbox
                      id="same-address"
                      :model-value="useSameAddress"
                      @update:model-value="(val: boolean | 'indeterminate') => useSameAddress = val === true"
                    />
                    <Label for="same-address" class="cursor-pointer text-sm">
                      Utiliser la même adresse pour la facturation
                    </Label>
                  </div>

                  <!-- Adresse facturation (collapsible) -->
                  <Collapsible :open="!useSameAddress && !isSubscription">
                    <CollapsibleContent class="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                      <AddressSelect
                        v-model="selectedBillingId"
                        :addresses="addresses"
                        label="Adresse de facturation"
                        :icon="icons.fileInvoice"
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>

              <!-- Bouton continuer -->
              <Button
                variant="secondary"
                rounded="lg"
                class="w-full"
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
            </template>

            <!-- Étape 2: Paiement Stripe -->
            <template v-if="currentStep === 'payment'">
              <!-- Résumé des adresses sélectionnées -->
              <Card class="border-secondary rounded-lg">
                <CardHeader>
                  <CardTitle>{{ isSubscription ? 'Adresse sélectionnée' : 'Adresses sélectionnées' }}</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <AddressSummary
                    :address="selectedShippingAddress"
                    :label="isSubscription ? 'Facturation' : 'Livraison'"
                  />
                  <template v-if="!isSubscription">
                    <Separator />
                    <AddressSummary :address="selectedBillingAddress" label="Facturation" />
                  </template>
                  <Button variant="link" color="secondary" size="sm" class="px-0 underline" @click="backToAddresses">
                    Modifier {{ isSubscription ? "l'adresse" : 'les adresses' }}
                  </Button>
                </CardContent>
              </Card>

              <!-- Stripe Card Element -->
              <StripeCardForm
                v-if="stripePublicKey"
                ref="stripeFormRef"
                :public-key="stripePublicKey"
                @ready="handleStripeReady"
                @error="handleStripeError"
              />

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

            <!-- Étape 3: Traitement -->
            <template v-if="currentStep === 'processing'">
              <Card class="border-secondary rounded-lg">
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
                  <h2 class="text-2xl font-bold mb-2">
                    {{ isSubscription ? 'Abonnement activé !' : 'Paiement réussi !' }}
                  </h2>
                  <p class="text-neutral-600 mb-4">{{ successMessage }}</p>
                  <p class="text-sm text-neutral-500">Redirection vers votre compte dans quelques secondes...</p>
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
                  <p class="text-neutral-600 mb-4">{{ error || 'Une erreur est survenue lors du paiement.' }}</p>
                  <div class="flex gap-4 justify-center">
                    <Button variant="outline" @click="goBack">Retour</Button>
                    <Button @click="backToAddresses">Réessayer</Button>
                  </div>
                </CardContent>
              </Card>
            </template>
          </div>

          <!-- Colonne droite: Résumé -->
          <div class="lg:col-span-1">
            <!-- Résumé abonnement (OneClick) -->
            <CheckoutSubscriptionSummary
              v-if="isSubscription && oneClickItem"
              :item="oneClickItem"
              :total-price="totalPrice"
            />

            <!-- Résumé commande (Boutique) -->
            <CheckoutShopSummary
              v-else
              :items="shopItems"
              :subtotal-excl-v-a-t="subtotalExclVAT"
              :vat-amount="vatAmount"
              :total-price="totalPrice"
              :title="checkoutTitle"
            />
          </div>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>
