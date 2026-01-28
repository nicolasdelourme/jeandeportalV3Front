<script setup lang="ts">
/**
 * PaymentMethodDialog
 * Modal avec Stripe Elements pour modifier le moyen de paiement
 * de tous les abonnements actifs
 */
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { loadStripe, type Stripe, type StripeCardElement } from '@stripe/stripe-js'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  open: boolean
  stripePublicKey: string | null
  clientSecret: string | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
  (e: 'error', message: string): void
}>()

const stripe = ref<Stripe | null>(null)
const cardElement = ref<StripeCardElement | null>(null)
const isProcessing = ref(false)
const errorMessage = ref<string | null>(null)

const icons = {
  spinner: byPrefixAndName.fas?.['spinner'],
  creditCard: byPrefixAndName.fas?.['credit-card'],
}

// Initialiser Stripe et CardElement quand la modal s'ouvre
watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen && props.stripePublicKey) {
      errorMessage.value = null
      stripe.value = await loadStripe(props.stripePublicKey)

      if (stripe.value) {
        await nextTick()
        const elements = stripe.value.elements()
        cardElement.value = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#1d1d1d',
              '::placeholder': { color: '#a0a0a0' },
            },
          },
        })
        cardElement.value.mount('#stripe-card-element')
      }
    } else if (!isOpen) {
      // Cleanup quand on ferme
      cardElement.value?.unmount()
      cardElement.value = null
      stripe.value = null
    }
  }
)

onUnmounted(() => {
  cardElement.value?.unmount()
})

async function handleSubmit() {
  if (!stripe.value || !cardElement.value || !props.clientSecret) return

  isProcessing.value = true
  errorMessage.value = null

  const { error } = await stripe.value.confirmCardSetup(props.clientSecret, {
    payment_method: { card: cardElement.value },
  })

  isProcessing.value = false

  if (error) {
    errorMessage.value = error.message || 'Erreur lors de la mise à jour'
    emit('error', errorMessage.value)
  } else {
    emit('success')
    emit('update:open', false)
  }
}

function handleClose() {
  if (!isProcessing.value) {
    emit('update:open', false)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <FontAwesomeIcon
            v-if="icons.creditCard"
            :icon="icons.creditCard"
            class="w-5 h-5"
          />
          Modifier le moyen de paiement
        </DialogTitle>
        <DialogDescription>
          Ce nouveau moyen de paiement sera utilisé pour tous vos abonnements actifs.
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <div
          id="stripe-card-element"
          class="border rounded-md p-3 bg-white min-h-[40px]"
        ></div>
        <p v-if="errorMessage" class="text-destructive text-sm mt-2">
          {{ errorMessage }}
        </p>
      </div>

      <DialogFooter class="gap-2">
        <Button variant="outline" rounded="lg" class="text-secondary hover:text-secondary" :disabled="isProcessing" @click="handleClose">
          Annuler
        </Button>
        <Button :disabled="isProcessing || !cardElement" rounded="lg" class="text-secondary" @click="handleSubmit">
          <FontAwesomeIcon
            v-if="isProcessing && icons.spinner"
            :icon="icons.spinner"
            class="w-4 h-4 mr-2 animate-spin"
          />
          {{ isProcessing ? 'Traitement...' : 'Enregistrer' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
