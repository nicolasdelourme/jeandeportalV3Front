<script setup lang="ts">
/**
 * SubscriptionModal - Modal de choix de formule d'abonnement
 * Contextualisé à la formation sélectionnée
 * Données dynamiques depuis l'API /fetchOneClickCatalog
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
import { useSubscriptionCatalogStore, type UIPricingPlan } from '@/stores/subscription-catalog.store'
import { useOneClickBasketStore } from '@/stores/oneclick-basket.store'

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

// Stores et Router
const router = useRouter()
const subscriptionStore = useSubscriptionCatalogStore()
const oneClickBasketStore = useOneClickBasketStore()

// Charger le catalogue au montage
onMounted(() => {
  subscriptionStore.fetchCatalog()
})

// Etat de chargement du bouton
const isSubmitting = ref(false)

// État
const isAnnual = ref(false)
const selectedPlan = ref<string | null>(null)
const annualDiscount = 2

// Plans de fallback (si l'API ne répond pas)
const fallbackPlans: UIPricingPlan[] = [
  { id: 'essentiel', planId: 0, name: 'Essentiel', priceMonthly: 9.90, stars: 1 },
  { id: 'standard', planId: 0, name: 'Standard', priceMonthly: 14.90, recommended: true, stars: 5 },
  { id: 'premium', planId: 0, name: 'Premium', priceMonthly: 19.90, isPremium: true, stars: 10 },
]

// Plans dynamiques depuis le store avec fallback
const plans = computed<UIPricingPlan[]>(() => {
  const storePlans = subscriptionStore.getPlansForTheme(props.formation.id)
  return storePlans.length > 0 ? storePlans : fallbackPlans
})

// Features condensées (alignées avec PricingSectionV3)
interface Feature {
  label: string
  icon?: 'star'
  essentiel: boolean | string
  standard: boolean | string
  premium: boolean | string
}

const features: Feature[] = [
  { label: 'Tuto mensuel', essentiel: true, standard: true, premium: true },
  { label: 'Consultations privées', essentiel: false, standard: true, premium: true },
  { label: 'Lettre mensuelle', essentiel: false, standard: false, premium: true },
  { label: '3 dossiers bonus', essentiel: false, standard: true, premium: true },
  { label: 'Etoiles', icon: 'star', essentiel: '1/mois', standard: '5/mois', premium: '10/mois' },
  { label: 'Carton d\'invitation', essentiel: 'Occasionnel', standard: '2/ans', premium: '4/ans' },
]

// Helpers
const getPrice = (plan: UIPricingPlan) => {
  if (isAnnual.value) {
    // Utiliser le prix annuel si disponible, sinon calculer
    if (plan.priceYearly) {
      return plan.priceYearly
    }
    return plan.priceMonthly * (12 - annualDiscount)
  }
  return plan.priceMonthly
}

const formatPrice = (price: number) => price.toFixed(2).replace('.', ',') + '€'

const getFeatureValue = (feature: Feature, planId: string): boolean | string => {
  return feature[planId as keyof Feature] as boolean | string
}

const selectPlan = (planId: string) => {
  selectedPlan.value = planId
}

const confirmSelection = async () => {
  if (!selectedPlan.value) return

  const plan = plans.value.find(p => p.id === selectedPlan.value)
  if (!plan || !plan.planId) {
    console.error('Plan non trouve ou planId manquant')
    return
  }

  isSubmitting.value = true

  try {
    // Vider le panier existant avant d'ajouter le nouveau plan
    // Cela garantit qu'on cree toujours un nouveau panier frais
    oneClickBasketStore.clearBasket()

    // Ajouter au panier OneClick avec le planId (creera un nouveau panier)
    await oneClickBasketStore.addPlan(plan.planId, isAnnual.value)

    // Emettre l'event pour les composants parents
    emit('select', selectedPlan.value, isAnnual.value)
    emit('update:open', false)

    // Rediriger vers le checkout abonnement
    router.push('/abonnement/checkout')
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    // L'erreur est deja geree par le store avec un toast
  } finally {
    isSubmitting.value = false
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
          <div class="inline-flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
            <button
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                !isAnnual ? 'bg-secondary text-white' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isAnnual = false"
            >
              Mensuel
            </button>
            <button
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                isAnnual ? 'bg-secondary text-white' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isAnnual = true"
            >
              Annuel
              <span class="text-xs bg-primary text-secondary px-1.5 py-0.5 rounded-sm font-semibold">
                2 mois offerts
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
                ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20'
                : plan.recommended
                  ? 'border-accent-yellow/50 hover:border-accent-yellow bg-white'
                  : 'border-border hover:border-accent-yellow/50 bg-white',
            ]"
            @click="selectPlan(plan.id)"
          >
            <!-- Badge Recommandé -->
            <Badge
              v-if="plan.recommended"
              variant="default"
              rounded="sm"
              class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-secondary text-[10px] font-semibold"
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

          </div>
        </div>

        <!-- Features condensées (style aligné avec PricingSection) -->
        <div class="mb-6 border-t border-border pt-4">
          <div
            v-for="feature in features"
            :key="feature.label"
            class="grid grid-cols-4 gap-2 text-sm py-1"
          >
            <span class="text-muted-foreground flex items-center gap-1">
              {{ feature.label }}
              <FontAwesomeIcon v-if="feature.icon === 'star' && icons.star" :icon="icons.star" class="size-3 text-accent-yellow" />
            </span>
            <div
              v-for="plan in plans"
              :key="plan.id"
              :class="[
                'flex justify-center items-center py-1 -my-1 rounded-sm transition-colors',
                selectedPlan === plan.id ? 'bg-primary/15' : '',
              ]"
            >
              <!-- Checkmark (cercle jaune avec coche noire) -->
              <template v-if="getFeatureValue(feature, plan.id) === true">
                <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <FontAwesomeIcon
                    v-if="icons.check"
                    :icon="icons.check"
                    class="size-3 text-secondary"
                  />
                </div>
              </template>
              <!-- X pour false -->
              <template v-else-if="getFeatureValue(feature, plan.id) === false">
                <FontAwesomeIcon
                  v-if="icons.times"
                  :icon="icons.times"
                  class="size-4 text-muted-foreground/50"
                />
              </template>
              <!-- Texte pour valeurs spécifiques -->
              <template v-else>
                <span class="text-xs text-muted-foreground">{{ getFeatureValue(feature, plan.id) }}</span>
              </template>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <Button
          variant="default"
          size="lg"
          rounded="sm"
          class="w-full text-secondary"
          :disabled="!selectedPlan || isSubmitting"
          @click="confirmSelection"
        >
          <template v-if="isSubmitting">
            <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 mr-2 animate-spin" />
            Chargement...
          </template>
          <template v-else-if="selectedPlan">
            Choisir {{ plans.find(p => p.id === selectedPlan)?.name }}
          </template>
          <template v-else>
            Selectionnez une formule
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
