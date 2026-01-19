<script setup lang="ts">
/**
 * PricingSection V2 - Style gradients
 * Premium mis en avant avec fond primary, autres en blanc
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const icons = computed(() => ({
  check: byPrefixAndName.fas?.['check'],
  star: byPrefixAndName.fas?.['star'],
  crown: byPrefixAndName.fas?.['crown'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))

interface PricingPlan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  stars: number
  popular?: boolean
  features: string[]
}

const plans: PricingPlan[] = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    priceMonthly: 9.90,
    priceYearly: 99,
    stars: 1,
    features: ['Tuto mensuel', 'Carton d\'invitation occasionnel'],
  },
  {
    id: 'standard',
    name: 'Standard',
    priceMonthly: 14.90,
    priceYearly: 149,
    stars: 5,
    features: ['Tuto mensuel', 'Consultations privées', '3 dossiers bonus'],
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 19.90,
    priceYearly: 199,
    stars: 10,
    popular: true,
    features: ['Tuto mensuel', 'Consultations privées', 'Lettre mensuelle', '3 dossiers bonus', 'Bonus mystère'],
  },
]

const formatPrice = (price: number) => price.toFixed(2).replace('.', ',') + '€'
</script>

<template>
  <section id="pricing-section" class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 2 - Premium inversé (fond sombre)</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Choisissez votre formule
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Des offres adaptées à vos besoins.
        </p>
      </div>

      <!-- Grid des plans -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div
          v-for="plan in plans"
          :key="plan.id"
          :class="[
            'relative rounded-sm p-6 flex flex-col transition-all duration-300',
            plan.popular
              ? 'bg-primary text-white shadow-2xl scale-[1.02]'
              : 'bg-neutral-50 border border-border hover:border-primary/30',
          ]"
        >
          <!-- Badge Recommandé -->
          <Badge
            v-if="plan.popular"
            variant="default"
            rounded="sm"
            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-yellow text-primary font-semibold gap-1"
          >
            <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-3" />
            Recommandé
          </Badge>

          <!-- Header du plan -->
          <div class="text-center mb-6 pt-2">
            <h3
              :class="[
                'font-heading font-bold text-xl mb-3',
                plan.popular ? 'text-white' : 'text-foreground',
              ]"
            >
              {{ plan.name }}
            </h3>
            <div class="flex items-baseline justify-center gap-1">
              <span
                :class="[
                  'font-heading font-bold text-4xl',
                  plan.popular ? 'text-accent-yellow' : 'text-foreground',
                ]"
              >
                {{ formatPrice(plan.priceMonthly) }}
              </span>
              <span :class="plan.popular ? 'text-white/70' : 'text-muted-foreground'" class="text-sm">
                /mois
              </span>
            </div>
            <p :class="plan.popular ? 'text-white/60' : 'text-muted-foreground'" class="text-sm mt-1">
              ou {{ plan.priceYearly }}€/an
            </p>
          </div>

          <!-- Étoiles -->
          <div
            :class="[
              'flex items-center justify-center gap-2 mb-6 py-3 rounded-sm',
              plan.popular ? 'bg-white/10' : 'bg-accent-yellow/10',
            ]"
          >
            <FontAwesomeIcon
              v-if="icons.star"
              :icon="icons.star"
              class="size-5 text-accent-yellow"
            />
            <span :class="plan.popular ? 'text-white' : 'text-foreground'" class="font-semibold">
              {{ plan.stars }} étoile{{ plan.stars > 1 ? 's' : '' }}/mois
            </span>
          </div>

          <!-- Features (seulement celles incluses) -->
          <ul class="space-y-3 mb-6 flex-1">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-center gap-3"
            >
              <FontAwesomeIcon
                v-if="icons.check"
                :icon="icons.check"
                :class="plan.popular ? 'text-accent-yellow' : 'text-success'"
                class="size-4 shrink-0"
              />
              <span :class="plan.popular ? 'text-white/90' : 'text-foreground'" class="text-sm">
                {{ feature }}
              </span>
            </li>
          </ul>

          <!-- CTA -->
          <Button
            :variant="plan.popular ? 'default' : 'outline'"
            size="lg"
            rounded="sm"
            :class="[
              'w-full gap-2',
              plan.popular ? 'bg-accent-yellow hover:bg-accent-yellow/90 text-primary font-semibold' : '',
            ]"
          >
            Choisir {{ plan.name }}
            <FontAwesomeIcon v-if="icons.arrowRight" :icon="icons.arrowRight" class="size-4" />
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
