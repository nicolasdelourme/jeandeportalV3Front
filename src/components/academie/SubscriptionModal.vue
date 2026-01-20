<script setup lang="ts">
/**
 * SubscriptionModal - Modal de choix de formule d'abonnement
 * Contextualisé à la formation sélectionnée
 */
import { ref, computed } from 'vue'
import type { Formation } from '@/data/formations.data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  open: boolean
  formation: Formation
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'select': [planId: string, isAnnual: boolean]
}>()

const icons = computed(() => ({
  check: byPrefixAndName.fas?.['check'],
  times: byPrefixAndName.fas?.['times'],
  star: byPrefixAndName.fas?.['star'],
  crown: byPrefixAndName.fas?.['crown'],
  circleCheck: byPrefixAndName.fas?.['circle-check'],
}))

// État
const isAnnual = ref(false)
const selectedPlan = ref<string | null>(null)
const annualDiscount = 2

// Plans
interface PricingPlan {
  id: string
  name: string
  priceMonthly: number
  recommended?: boolean
  isPremium?: boolean
  stars: number
}

const plans: PricingPlan[] = [
  { id: 'essentiel', name: 'Essentiel', priceMonthly: 9.90, stars: 1 },
  { id: 'standard', name: 'Standard', priceMonthly: 14.90, recommended: true, stars: 5 },
  { id: 'premium', name: 'Premium', priceMonthly: 19.90, isPremium: true, stars: 10 },
]

// Features condensées
interface Feature {
  label: string
  essentiel: boolean
  standard: boolean
  premium: boolean
}

const features: Feature[] = [
  { label: 'Tuto mensuel', essentiel: true, standard: true, premium: true },
  { label: 'Consultations privées', essentiel: false, standard: true, premium: true },
  { label: 'Lettre mensuelle', essentiel: false, standard: false, premium: true },
  { label: 'Dossiers bonus', essentiel: false, standard: true, premium: true },
]

// Helpers
const getPrice = (plan: PricingPlan) => {
  if (isAnnual.value) {
    return plan.priceMonthly * (12 - annualDiscount)
  }
  return plan.priceMonthly
}

const formatPrice = (price: number) => price.toFixed(2).replace('.', ',') + '€'

const getFeatureValue = (feature: Feature, planId: string): boolean => {
  return feature[planId as keyof Feature] as boolean
}

const selectPlan = (planId: string) => {
  selectedPlan.value = planId
}

const confirmSelection = () => {
  if (selectedPlan.value) {
    emit('select', selectedPlan.value, isAnnual.value)
    emit('update:open', false)
  }
}

const handleOpenChange = (value: boolean) => {
  emit('update:open', value)
  if (!value) {
    selectedPlan.value = null
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent
      class="max-w-2xl p-0 overflow-hidden"
      :style="{ borderColor: formation.color, borderWidth: '2px' }"
    >
      <!-- Header avec couleur formation -->
      <div
        class="px-6 py-4"
        :style="{ backgroundColor: formation.color }"
      >
        <DialogHeader>
          <DialogTitle :class="['font-heading text-xl', formation.textColor]">
            S'abonner à {{ formation.name }}
          </DialogTitle>
        </DialogHeader>
      </div>

      <div class="p-6">
        <!-- Toggle Mensuel / Annuel -->
        <div class="flex justify-center mb-6">
          <div class="inline-flex items-center gap-2 bg-neutral-100 rounded-full p-1">
            <button
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                !isAnnual ? 'bg-secondary text-white' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isAnnual = false"
            >
              Mensuel
            </button>
            <button
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                isAnnual ? 'bg-secondary text-white' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isAnnual = true"
            >
              Annuel
              <span class="text-xs bg-primary text-secondary px-1.5 py-0.5 rounded-sm font-semibold">
                -2 mois
              </span>
            </button>
          </div>
        </div>

        <!-- Cartes des plans (style aligné avec PricingSection) -->
        <div class="grid grid-cols-3 gap-3 mb-6">
          <div
            v-for="plan in plans"
            :key="plan.id"
            :class="[
              'relative rounded-sm p-4 cursor-pointer transition-all duration-300 border-2',
              selectedPlan === plan.id
                ? 'border-accent-yellow shadow-lg ring-2 ring-accent-yellow/20'
                : plan.recommended
                  ? 'border-accent-yellow/50 hover:border-accent-yellow'
                  : 'border-border hover:border-accent-yellow/50',
              'bg-white',
            ]"
            @click="selectPlan(plan.id)"
          >
            <!-- Badge Recommandé -->
            <Badge
              v-if="plan.recommended"
              variant="default"
              rounded="sm"
              class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent-yellow text-primary text-[10px] font-semibold"
            >
              <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-2.5 mr-1" />
              Recommandé
            </Badge>

            <!-- Nom -->
            <h4 class="font-heading font-bold text-center text-foreground pt-1">
              {{ plan.name }}
            </h4>

            <!-- Prix -->
            <p class="text-center mt-2">
              <span class="font-heading font-bold text-xl text-foreground">
                {{ formatPrice(getPrice(plan)) }}
              </span>
              <span class="text-xs text-muted-foreground">
                {{ isAnnual ? '/an' : '/mois' }}
              </span>
            </p>

            <!-- Étoiles -->
            <div class="flex items-center justify-center gap-1 mt-2 py-2 bg-accent-yellow/10 rounded-sm">
              <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-3 text-accent-yellow" />
              <span class="text-xs font-medium text-foreground">
                +{{ plan.stars }}/mois
              </span>
            </div>

            <!-- Indicateur de sélection (circle-check différent du check simple des features) -->
            <div
              v-if="selectedPlan === plan.id"
              class="absolute top-2 right-2"
            >
              <FontAwesomeIcon v-if="icons.circleCheck" :icon="icons.circleCheck" class="size-5 text-accent-yellow" />
            </div>
          </div>
        </div>

        <!-- Features condensées (style aligné avec PricingSection) -->
        <div class="space-y-2 mb-6 border-t border-border pt-4">
          <div
            v-for="feature in features"
            :key="feature.label"
            class="grid grid-cols-4 gap-2 text-sm py-1"
          >
            <span class="text-muted-foreground">{{ feature.label }}</span>
            <div
              v-for="plan in plans"
              :key="plan.id"
              class="flex justify-center"
            >
              <FontAwesomeIcon
                v-if="getFeatureValue(feature, plan.id) && icons.check"
                :icon="icons.check"
                class="size-4 text-success"
              />
              <FontAwesomeIcon
                v-else-if="icons.times"
                :icon="icons.times"
                class="size-4 text-muted-foreground/50"
              />
            </div>
          </div>
        </div>

        <!-- CTA -->
        <Button
          variant="default"
          size="lg"
          rounded="sm"
          class="w-full bg-accent-yellow hover:bg-accent-yellow/90 text-primary font-semibold"
          :disabled="!selectedPlan"
          @click="confirmSelection"
        >
          <template v-if="selectedPlan">
            Choisir {{ plans.find(p => p.id === selectedPlan)?.name }}
          </template>
          <template v-else>
            Sélectionnez une formule
          </template>
        </Button>

        <!-- Note -->
        <p class="text-center text-muted-foreground text-xs mt-4">
          Sans engagement. Annulez à tout moment.
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
