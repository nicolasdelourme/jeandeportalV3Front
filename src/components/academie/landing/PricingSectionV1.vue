<script setup lang="ts">
/**
 * PricingSection V1 - Style barres latérales
 * Cards avec barre colorée progressive (bronze, argent, or)
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const icons = computed(() => ({
  check: byPrefixAndName.fas?.['check'],
  times: byPrefixAndName.fas?.['times'],
  star: byPrefixAndName.fas?.['star'],
  crown: byPrefixAndName.fas?.['crown'],
}))

interface PricingPlan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  stars: number
  color: string
  popular?: boolean
  features: { label: string; included: boolean; note?: string }[]
}

const plans: PricingPlan[] = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    priceMonthly: 9.90,
    priceYearly: 99,
    stars: 1,
    color: '#9CA3AF', // Gris neutre
    features: [
      { label: 'Tuto mensuel', included: true },
      { label: 'Consultations privées', included: false },
      { label: 'Lettre mensuelle', included: false },
      { label: '3 dossiers bonus', included: false },
      { label: 'Bonus mystère', included: false },
      { label: 'Carton d\'invitation', included: true, note: 'Occasionnel' },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    priceMonthly: 14.90,
    priceYearly: 149,
    stars: 5,
    color: '#C0C0C0', // Argent
    features: [
      { label: 'Tuto mensuel', included: true },
      { label: 'Consultations privées', included: true },
      { label: 'Lettre mensuelle', included: false },
      { label: '3 dossiers bonus', included: true },
      { label: 'Bonus mystère', included: false },
      { label: 'Carton d\'invitation', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 19.90,
    priceYearly: 199,
    stars: 10,
    color: '#F2CC00', // Or
    popular: true,
    features: [
      { label: 'Tuto mensuel', included: true },
      { label: 'Consultations privées', included: true },
      { label: 'Lettre mensuelle', included: true },
      { label: '3 dossiers bonus', included: true },
      { label: 'Bonus mystère', included: true },
      { label: 'Carton d\'invitation', included: false },
    ],
  },
]

const formatPrice = (price: number) => price.toFixed(2).replace('.', ',') + '€'
</script>

<template>
  <section id="pricing-section" class="py-16 md:py-24 bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 1 - Barres latérales (Bronze/Argent/Or)</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Choisissez votre formule
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Des offres adaptées à vos besoins. Commencez avec l'Essentiel et évoluez à votre rythme.
        </p>
      </div>

      <!-- Grid des plans -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="relative bg-white rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
        >
          <!-- Barre colorée gauche -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1.5 group-hover:w-2 transition-all duration-300"
            :style="{ backgroundColor: plan.color }"
          />

          <!-- Badge Recommandé -->
          <Badge
            v-if="plan.popular"
            variant="default"
            rounded="sm"
            class="absolute top-4 right-4 bg-accent-yellow text-primary font-semibold gap-1"
          >
            <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-3" />
            Recommandé
          </Badge>

          <div class="p-6 pl-8 flex flex-col flex-1">
            <!-- Header du plan -->
            <div class="mb-6">
              <h3 class="font-heading font-bold text-xl text-foreground mb-2">
                {{ plan.name }}
              </h3>
              <div class="flex items-baseline gap-1">
                <span class="font-heading font-bold text-3xl text-foreground">
                  {{ formatPrice(plan.priceMonthly) }}
                </span>
                <span class="text-muted-foreground text-sm">/mois</span>
              </div>
              <p class="text-muted-foreground text-xs mt-1">
                ou {{ plan.priceYearly }}€/an
              </p>
            </div>

            <!-- Étoiles -->
            <div
              class="flex items-center gap-2 mb-6 py-2 px-3 rounded-sm"
              :style="{ backgroundColor: `${plan.color}15` }"
            >
              <FontAwesomeIcon
                v-if="icons.star"
                :icon="icons.star"
                class="size-4"
                :style="{ color: plan.color }"
              />
              <span class="font-medium text-sm text-foreground">
                {{ plan.stars }} étoile{{ plan.stars > 1 ? 's' : '' }}/mois
              </span>
            </div>

            <!-- Features -->
            <ul class="space-y-2 mb-6 flex-1">
              <li
                v-for="feature in plan.features"
                :key="feature.label"
                class="flex items-start gap-2"
              >
                <FontAwesomeIcon
                  v-if="feature.included && icons.check"
                  :icon="icons.check"
                  class="size-3.5 text-success shrink-0 mt-0.5"
                />
                <FontAwesomeIcon
                  v-else-if="icons.times"
                  :icon="icons.times"
                  class="size-3.5 text-muted-foreground/40 shrink-0 mt-0.5"
                />
                <span
                  :class="[
                    'text-sm',
                    feature.included ? 'text-foreground' : 'text-muted-foreground/40',
                  ]"
                >
                  {{ feature.label }}
                </span>
              </li>
            </ul>

            <!-- CTA -->
            <Button
              :variant="plan.popular ? 'default' : 'outline'"
              size="lg"
              rounded="sm"
              class="w-full"
              :style="plan.popular ? { backgroundColor: plan.color, color: '#1D1D1D' } : {}"
            >
              Choisir {{ plan.name }}
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
