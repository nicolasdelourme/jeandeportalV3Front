<script setup lang="ts">
/**
 * ThemesSection V3 - Cards avec icônes et fonds colorés
 * Style moderne avec coins arrondis sm
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = computed(() => ({
  crown: byPrefixAndName.fas?.['crown'],
  coins: byPrefixAndName.fas?.['coins'],
  chartPie: byPrefixAndName.fas?.['chart-pie'],
  rocket: byPrefixAndName.fas?.['rocket'],
  gift: byPrefixAndName.fas?.['gift'],
}))

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
}

interface Theme {
  id: string
  name: string
  description: string
  color: string
  icon: 'coins' | 'chartPie' | 'rocket' | 'gift'
  premium?: boolean
}

const themes: Theme[] = [
  {
    id: 'metaux',
    name: 'Métaux précieux',
    description: 'Investir dans l\'or et l\'argent physique. Comprendre les cycles et la protection de votre patrimoine.',
    color: '#F2CC00',
    icon: 'coins',
  },
  {
    id: 'portefeuille',
    name: 'Portefeuille permanent',
    description: 'Stratégie long terme basée sur la diversification. Un patrimoine résilient.',
    color: '#A8C7EA',
    icon: 'chartPie',
  },
  {
    id: 'liberte',
    name: 'Liberté financière',
    description: 'Revenus passifs, optimisation fiscale et stratégies de croissance.',
    color: '#F4BFA6',
    icon: 'rocket',
  },
  {
    id: 'bonus',
    name: 'Bonus mystère',
    description: 'Contenus exclusifs réservés aux abonnés Premium.',
    color: '#1D1D1D',
    icon: 'gift',
    premium: true,
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 3 - Icônes + fonds colorés</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          4 thématiques pour maîtriser vos finances
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Choisissez les sujets qui correspondent à vos objectifs.
        </p>
      </div>

      <!-- Grid 4 colonnes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="relative rounded-sm p-6 border-2 hover:shadow-lg transition-all duration-300 group flex flex-col"
          :style="{
            borderColor: theme.color,
            backgroundColor: `${theme.color}10`,
          }"
        >
          <!-- Badge Premium -->
          <Badge
            v-if="theme.premium"
            variant="default"
            rounded="sm"
            class="absolute top-3 right-3 bg-primary text-primary-foreground gap-1 text-xs"
          >
            <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-2.5" />
            Premium
          </Badge>

          <!-- Icône -->
          <div
            class="w-10 h-10 rounded-sm flex items-center justify-center mb-4"
            :style="{ backgroundColor: theme.color }"
          >
            <FontAwesomeIcon
              v-if="icons[theme.icon]"
              :icon="getIconDef(theme.icon)"
              class="size-5"
              :class="theme.premium ? 'text-white' : 'text-white'"
            />
          </div>

          <!-- Contenu -->
          <h3 class="font-heading font-bold text-lg text-foreground mb-2">
            {{ theme.name }}
          </h3>
          <p class="text-muted-foreground text-sm leading-relaxed flex-1">
            {{ theme.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
