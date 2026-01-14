<script setup lang="ts">
/**
 * PricingSection V3 - Style tableau comparatif horizontal
 * Vue tableau avec features en lignes
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
}

const plans: PricingPlan[] = [
  { id: 'essentiel', name: 'Essentiel', priceMonthly: 9.90, priceYearly: 99, stars: 1 },
  { id: 'standard', name: 'Standard', priceMonthly: 14.90, priceYearly: 149, stars: 5 },
  { id: 'premium', name: 'Premium', priceMonthly: 19.90, priceYearly: 199, stars: 10, popular: true },
]

const features = [
  { label: 'Tuto mensuel', essentiel: true, standard: true, premium: true },
  { label: 'Consultations privées', essentiel: false, standard: true, premium: true },
  { label: 'Lettre mensuelle', essentiel: false, standard: false, premium: true },
  { label: '3 dossiers bonus', essentiel: false, standard: true, premium: true },
  { label: 'Bonus mystère', essentiel: false, standard: false, premium: true },
  { label: 'Carton d\'invitation', essentiel: 'Occasionnel', standard: false, premium: false },
]

const formatPrice = (price: number) => price.toFixed(2).replace('.', ',') + '€'

const getFeatureValue = (feature: typeof features[0], planId: string) => {
  return feature[planId as keyof typeof feature]
}
</script>

<template>
  <section id="pricing-section" class="py-16 md:py-24 bg-neutral-50">
    <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 3 - Tableau comparatif</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Choisissez votre formule
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Comparez les offres et trouvez celle qui vous correspond.
        </p>
      </div>

      <!-- Tableau -->
      <div class="bg-white rounded-sm border border-border overflow-hidden shadow-sm">
        <!-- Header du tableau -->
        <div class="grid grid-cols-4 border-b border-border">
          <div class="p-4 bg-neutral-50">
            <!-- Vide -->
          </div>
          <div
            v-for="plan in plans"
            :key="plan.id"
            :class="[
              'p-4 text-center',
              plan.popular ? 'bg-primary text-white' : 'bg-white',
            ]"
          >
            <Badge
              v-if="plan.popular"
              variant="default"
              rounded="sm"
              class="mb-2 bg-accent-yellow text-primary text-xs gap-1"
            >
              <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-2.5" />
              Recommandé
            </Badge>
            <h3 :class="['font-heading font-bold text-lg', plan.popular ? 'text-white' : 'text-foreground']">
              {{ plan.name }}
            </h3>
            <p :class="['font-heading font-bold text-2xl mt-1', plan.popular ? 'text-accent-yellow' : 'text-foreground']">
              {{ formatPrice(plan.priceMonthly) }}
              <span :class="['text-sm font-normal', plan.popular ? 'text-white/70' : 'text-muted-foreground']">/mois</span>
            </p>
            <div :class="['flex items-center justify-center gap-1 mt-2', plan.popular ? 'text-white/80' : 'text-muted-foreground']">
              <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-3 text-accent-yellow" />
              <span class="text-xs">{{ plan.stars }} étoile{{ plan.stars > 1 ? 's' : '' }}/mois</span>
            </div>
          </div>
        </div>

        <!-- Lignes des features -->
        <div
          v-for="(feature, index) in features"
          :key="feature.label"
          :class="['grid grid-cols-4 border-b border-border last:border-b-0', index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50']"
        >
          <div class="p-4 font-medium text-sm text-foreground">
            {{ feature.label }}
          </div>
          <div
            v-for="plan in plans"
            :key="plan.id"
            :class="['p-4 text-center', plan.popular ? 'bg-primary/5' : '']"
          >
            <template v-if="getFeatureValue(feature, plan.id) === true">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="size-5 text-success" />
            </template>
            <template v-else-if="getFeatureValue(feature, plan.id) === false">
              <FontAwesomeIcon v-if="icons.times" :icon="icons.times" class="size-5 text-muted-foreground/30" />
            </template>
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
              :variant="plan.popular ? 'default' : 'outline'"
              size="default"
              rounded="sm"
              :class="[
                'w-full',
                plan.popular ? 'bg-accent-yellow hover:bg-accent-yellow/90 text-primary font-semibold' : '',
              ]"
            >
              Choisir
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
