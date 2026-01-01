<script setup lang="ts">
/**
 * ThemesSection - Présentation des 4 thématiques de l'Académie
 * Métaux précieux, Portefeuille permanent, Liberté financière, Bonus mystère
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = computed(() => ({
  coins: byPrefixAndName.fas?.['coins'],
  chartPie: byPrefixAndName.fas?.['chart-pie'],
  rocket: byPrefixAndName.fas?.['rocket'],
  gift: byPrefixAndName.fas?.['gift'],
  crown: byPrefixAndName.fas?.['crown'],
}))

const getIcon = (key: keyof typeof icons.value): IconDefinition => {
  return icons.value[key] as IconDefinition
}

interface Theme {
  id: string
  name: string
  description: string
  colorVar: string
  bgClass: string
  borderClass: string
  icon: 'coins' | 'chartPie' | 'rocket' | 'gift'
  premium?: boolean
}

const themes: Theme[] = [
  {
    id: 'metaux',
    name: 'Métaux précieux',
    description: 'Investir dans l\'or et l\'argent physique. Comprendre les cycles, les opportunités d\'achat et la protection de votre patrimoine.',
    colorVar: '--color-theme-metaux',
    bgClass: 'bg-[#F2CC00]/10',
    borderClass: 'border-[#F2CC00]',
    icon: 'coins',
  },
  {
    id: 'portefeuille',
    name: 'Portefeuille permanent',
    description: 'Stratégie d\'investissement long terme basée sur la diversification. Construisez un patrimoine résilient à toutes les conditions économiques.',
    colorVar: '--color-theme-portefeuille',
    bgClass: 'bg-[#A8C7EA]/10',
    borderClass: 'border-[#A8C7EA]',
    icon: 'chartPie',
  },
  {
    id: 'liberte',
    name: 'Liberté financière',
    description: 'Les clés pour atteindre l\'indépendance financière. Revenus passifs, optimisation fiscale et stratégies de croissance.',
    colorVar: '--color-theme-liberte',
    bgClass: 'bg-[#F4BFA6]/10',
    borderClass: 'border-[#F4BFA6]',
    icon: 'rocket',
  },
  {
    id: 'bonus',
    name: 'Bonus mystère',
    description: 'Contenus exclusifs réservés aux abonnés Premium. Astuces fiscales avancées, opportunités confidentielles et analyses approfondies.',
    colorVar: '--color-theme-bonus',
    bgClass: 'bg-[#1D1D1D]/5',
    borderClass: 'border-[#1D1D1D]',
    icon: 'gift',
    premium: true,
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          4 thématiques pour maîtriser vos finances
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Choisissez les sujets qui correspondent à vos objectifs. Chaque thématique propose des contenus adaptés
          à votre niveau et vos ambitions.
        </p>
      </div>

      <!-- Grid des thématiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="theme in themes"
          :key="theme.id"
          :class="[
            'relative rounded-sm p-6 border-2 transition-all duration-300 hover:shadow-lg',
            theme.bgClass,
            theme.borderClass,
          ]"
        >
          <!-- Badge Premium -->
          <Badge
            v-if="theme.premium"
            variant="default"
            rounded="sm"
            class="absolute top-4 right-4 bg-primary text-primary-foreground gap-1"
          >
            <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-3" />
            Premium
          </Badge>

          <!-- Icône -->
          <div
            :class="[
              'w-12 h-12 rounded-sm flex items-center justify-center mb-4',
              theme.bgClass,
              'border',
              theme.borderClass,
            ]"
          >
            <FontAwesomeIcon
              v-if="getIcon(theme.icon)"
              :icon="getIcon(theme.icon)"
              class="size-6"
              :style="{ color: `var(${theme.colorVar})` }"
            />
          </div>

          <!-- Contenu -->
          <h3 class="font-heading font-bold text-xl text-foreground mb-2">
            {{ theme.name }}
          </h3>
          <p class="text-muted-foreground text-sm leading-relaxed">
            {{ theme.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
