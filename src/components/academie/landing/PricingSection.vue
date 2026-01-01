<script setup lang="ts">
/**
 * PricingSection - Tableau de tarification avec 3 formules
 * Essentiel (9,90€), Standard (14,90€), Premium (19,90€)
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

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
  popular?: boolean
  features: {
    label: string
    included: boolean
    note?: string
  }[]
}

const plans: PricingPlan[] = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    priceMonthly: 9.90,
    priceYearly: 99,
    stars: 1,
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

const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',') + '€'
}
</script>

<template>
  <section id="pricing-section" class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div
          v-for="plan in plans"
          :key="plan.id"
          :class="[
            'relative rounded-sm border-2 p-6 transition-all duration-300',
            plan.popular
              ? 'border-accent-yellow shadow-xl scale-[1.02] bg-accent-yellow/5 ring-2 ring-accent-yellow/20'
              : 'border-border bg-white hover:border-accent-yellow/50',
          ]"
        >
          <!-- Badge Recommandé -->
          <Badge
            v-if="plan.popular"
            variant="default"
            rounded="sm"
            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-yellow text-primary font-semibold"
          >
            <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-3 mr-1" />
            Recommandé
          </Badge>

          <!-- Header du plan -->
          <div class="text-center mb-6 pt-2">
            <h3 class="font-heading font-bold text-xl text-foreground mb-3">
              {{ plan.name }}
            </h3>
            <div class="flex items-baseline justify-center gap-1">
              <span class="font-heading font-bold text-4xl text-foreground">
                {{ formatPrice(plan.priceMonthly) }}
              </span>
              <span class="text-muted-foreground text-sm">/mois</span>
            </div>
            <p class="text-muted-foreground text-sm mt-1">
              ou {{ plan.priceYearly }}€/an
            </p>
          </div>

          <!-- Étoiles -->
          <div class="flex items-center justify-center gap-2 mb-6 py-3 bg-accent-yellow/10 rounded-sm">
            <FontAwesomeIcon
              v-if="icons.star"
              :icon="icons.star"
              class="size-5 text-accent-yellow"
            />
            <span class="font-semibold text-foreground">
              {{ plan.stars }} étoile{{ plan.stars > 1 ? 's' : '' }}/mois
            </span>
          </div>

          <!-- Features -->
          <ul class="space-y-3 mb-6">
            <li
              v-for="feature in plan.features"
              :key="feature.label"
              class="flex items-start gap-3"
            >
              <FontAwesomeIcon
                v-if="feature.included && icons.check"
                :icon="icons.check"
                class="size-4 text-success shrink-0 mt-0.5"
              />
              <FontAwesomeIcon
                v-else-if="icons.times"
                :icon="icons.times"
                class="size-4 text-muted-foreground/50 shrink-0 mt-0.5"
              />
              <div class="flex-1">
                <span
                  :class="[
                    'text-sm',
                    feature.included ? 'text-foreground' : 'text-muted-foreground/50',
                  ]"
                >
                  {{ feature.label }}
                </span>
                <span
                  v-if="feature.note && feature.included"
                  class="text-xs text-muted-foreground block"
                >
                  {{ feature.note }}
                </span>
              </div>
            </li>
          </ul>

          <!-- CTA -->
          <Button
            :variant="plan.popular ? 'default' : 'outline'"
            size="lg"
            rounded="sm"
            :class="[
              'w-full',
              plan.popular ? 'bg-accent-yellow hover:bg-accent-yellow/90 text-primary font-semibold' : ''
            ]"
          >
            <FontAwesomeIcon
              v-if="plan.popular && icons.crown"
              :icon="icons.crown"
              class="size-4 mr-2"
            />
            Choisir {{ plan.name }}
          </Button>
        </div>
      </div>

      <!-- Note -->
      <p class="text-center text-muted-foreground text-sm mt-8">
        Sans engagement. Annulez à tout moment.
      </p>
    </div>
  </section>
</template>
