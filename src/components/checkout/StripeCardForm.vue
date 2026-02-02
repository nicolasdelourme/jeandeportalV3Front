<script setup lang="ts">
/**
 * StripeCardForm - Formulaire de carte Stripe isolé
 * Gère le rendu du Card Element et expose les méthodes de paiement
 */
import { computed, watch, onMounted } from 'vue'
import type { Stripe, StripeCardElement } from '@stripe/stripe-js'
import { useStripeCardElement } from '@/composables/useStripeCardElement'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  publicKey: string
}>()

const emit = defineEmits<{
  ready: [stripe: Stripe, cardElement: StripeCardElement]
  error: [message: string]
}>()

const { stripe, cardElement, isReady, error, mount, cleanup } = useStripeCardElement()

const icons = computed(() => ({
  lock: byPrefixAndName.fas?.['lock'],
  ccVisa: byPrefixAndName.fab?.['cc-visa'],
  ccMastercard: byPrefixAndName.fab?.['cc-mastercard'],
  ccAmex: byPrefixAndName.fab?.['cc-amex'],
}))

// Monter Stripe quand la publicKey est disponible
onMounted(async () => {
  if (props.publicKey) {
    try {
      await mount(props.publicKey, '#card-element')
    } catch (err) {
      emit('error', err instanceof Error ? err.message : 'Erreur Stripe')
    }
  }
})

// Émettre l'événement ready quand Stripe est prêt
watch(isReady, (ready) => {
  if (ready && stripe.value && cardElement.value) {
    emit('ready', stripe.value, cardElement.value)
  }
})

// Émettre l'erreur si elle survient
watch(error, (err) => {
  if (err) {
    emit('error', err)
  }
})

// Exposer cleanup pour le parent
defineExpose({
  cleanup,
  stripe,
  cardElement,
  isReady,
})
</script>

<template>
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
      <!-- Logos cartes acceptées -->
      <div class="flex items-center gap-4 mb-4">
        <div class="flex items-center justify-center w-full gap-4">
          <FontAwesomeIcon v-if="icons.ccVisa" :icon="icons.ccVisa" class="h-16 w-16 text-[#1A1F71] fa-2x" />
          <FontAwesomeIcon v-if="icons.ccMastercard" :icon="icons.ccMastercard" class="h-16 w-16 text-[#EB001B] fa-2x" />
          <FontAwesomeIcon v-if="icons.ccAmex" :icon="icons.ccAmex" class="h-16 w-16 text-[#006FCF] fa-2x" />
        </div>
      </div>
      <div id="card-element" class="p-4 border border-gray-200 rounded-lg min-h-[50px]">
        <!-- Stripe Card Element sera monté ici -->
      </div>
      <Skeleton v-if="!isReady" class="h-12 w-full mt-2" />
    </CardContent>
  </Card>
</template>
