<script setup lang="ts">
/**
 * PricingSection V3 - Style tableau comparatif horizontal
 * Vue tableau avec features en lignes + toggle mensuel/annuel
 */
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const icons = computed(() => ({
  check: byPrefixAndName.fas?.['check'],
  times: byPrefixAndName.fas?.['times'],
  star: byPrefixAndName.fas?.['star'],
  crown: byPrefixAndName.fas?.['crown'],
}))

// Billing period toggle
const isAnnual = ref(false)
const annualDiscount = 2 // 2 mois offerts

interface PricingPlan {
  id: string
  name: string
  priceMonthly: number
  recommended?: boolean
  isPremium?: boolean
}

const plans: PricingPlan[] = [
  { id: 'essentiel', name: 'Essentiel', priceMonthly: 9.90 },
  { id: 'standard', name: 'Standard', priceMonthly: 14.90, recommended: true },
  { id: 'premium', name: 'Premium', priceMonthly: 19.90, isPremium: true },
]

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

const getPrice = (plan: PricingPlan) => {
  if (isAnnual.value) {
    // Prix annuel = 10 mois au lieu de 12 (2 mois offerts)
    return plan.priceMonthly * (12 - annualDiscount)
  }
  return plan.priceMonthly
}

const formatPrice = (price: number) => price.toFixed(2).replace('.', ',') + '€'

const getFeatureValue = (feature: Feature, planId: string) => {
  return feature[planId as keyof Feature]
}
</script>

<template>
  <section id="pricing-section" class="py-16 md:py-24 bg-neutral-50">
    <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Choisissez votre formule
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto mb-6">
          Ces tarifs s'appliquent à chaque formation. Comparez les offres et trouvez celle qui vous correspond.
        </p>

        <!-- Toggle Mensuel / Annuel -->
        <div class="inline-flex items-center gap-3 bg-white rounded-full p-1.5 border border-border shadow-sm">
          <button
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              !isAnnual ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="isAnnual = false"
          >
            Mensuel
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
              isAnnual ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground',
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

      <!-- Tableau -->
      <div class="bg-white rounded-sm border border-border shadow-md">
        <!-- Header du tableau -->
        <div class="grid grid-cols-4 border-b border-border">
          <!-- Cellule vide en haut à gauche -->
          <div class="p-4 bg-neutral-50" />

          <!-- Headers des plans -->
          <div
            v-for="plan in plans"
            :key="plan.id"
            :class="[
              'p-4 text-center relative',
              plan.isPremium ? 'bg-secondary text-white' : 'bg-white',
            ]"
          >
            <!-- Badge Recommandé (sur Standard) -->
            <div
              v-if="plan.recommended"
              class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-secondary text-xs font-semibold px-2 py-0.5 rounded-sm"
            >
              Recommandé
            </div>

            <!-- Couronne pour Premium -->
            <div v-if="plan.isPremium" class="flex justify-center mb-1">
              <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-5 text-primary" />
            </div>

            <h3 :class="['font-heading font-bold text-lg', plan.isPremium ? 'text-white' : 'text-foreground']">
              {{ plan.name }}
            </h3>
            <p class="mt-1">
              <span :class="['font-heading font-bold text-2xl', plan.isPremium ? 'text-primary' : 'text-foreground']">
                {{ formatPrice(getPrice(plan)) }}
              </span>
              <span :class="['text-sm font-normal', plan.isPremium ? 'text-white/70' : 'text-muted-foreground']">
                {{ isAnnual ? '/an' : '/mois' }}
              </span>
            </p>
          </div>
        </div>

        <!-- Lignes des features -->
        <div
          v-for="(feature, index) in features"
          :key="feature.label"
          :class="['grid grid-cols-4 border-b border-border last:border-b-0', index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50']"
        >
          <!-- Label de la feature -->
          <div class="p-4 font-medium text-sm text-foreground flex items-center gap-2">
            {{ feature.label }}
            <FontAwesomeIcon v-if="feature.icon === 'star' && icons.star" :icon="icons.star" class="size-4 text-primary" />
          </div>

          <!-- Valeurs pour chaque plan -->
          <div
            v-for="plan in plans"
            :key="plan.id"
            :class="['p-4 flex items-center justify-center', plan.isPremium ? 'bg-secondary/5' : '']"
          >
            <!-- Checkmark (cercle jaune avec coche noire) -->
            <template v-if="getFeatureValue(feature, plan.id) === true">
              <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="size-4 text-secondary" />
              </div>
            </template>

            <!-- X pour non disponible -->
            <template v-else-if="getFeatureValue(feature, plan.id) === false">
              <FontAwesomeIcon v-if="icons.times" :icon="icons.times" class="size-5 text-muted-foreground/30" />
            </template>

            <!-- Texte pour valeurs spécifiques -->
            <template v-else>
              <span class="text-sm text-muted-foreground">{{ getFeatureValue(feature, plan.id) }}</span>
            </template>
          </div>
        </div>

        <!-- CTAs -->
        <div class="grid grid-cols-4 border-t border-border bg-neutral-50">
          <div class="p-4">
            <!-- Vide -->
          </div>
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="p-4"
          >
            <Button
              :variant="plan.isPremium ? 'default' : 'outline'"
              :color="plan.isPremium ? 'primary' : 'secondary'"
              size="default"
              rounded="lg"
              class="w-full"
              :class="plan.isPremium ? 'text-primary-foreground' : 'hover:bg-secondary hover:border-secondary'"
            >
              CHOISIR
            </Button>
          </div>
        </div>
      </div>

      <!-- Note -->
      <p class="text-center text-muted-foreground text-sm mt-8">
        Sans engagement. Annulez à tout moment.
      </p>
    </div>
  </section>
</template>
