<script setup lang="ts">
/**
 * ThemesSection V1 - Cards avec barre latérale colorée
 * Style épuré avec accent sur le côté gauche
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const icons = computed(() => ({
  crown: byPrefixAndName.fas?.['crown'],
}))

interface Theme {
  id: string
  name: string
  description: string
  color: string
  premium?: boolean
}

const themes: Theme[] = [
  {
    id: 'metaux',
    name: 'Métaux précieux',
    description: 'Investir dans l\'or et l\'argent physique. Comprendre les cycles, les opportunités d\'achat et la protection de votre patrimoine.',
    color: '#F2CC00',
  },
  {
    id: 'portefeuille',
    name: 'Portefeuille permanent',
    description: 'Stratégie d\'investissement long terme basée sur la diversification. Construisez un patrimoine résilient à toutes les conditions économiques.',
    color: '#A8C7EA',
  },
  {
    id: 'liberte',
    name: 'Liberté financière',
    description: 'Les clés pour atteindre l\'indépendance financière. Revenus passifs, optimisation fiscale et stratégies de croissance.',
    color: '#F4BFA6',
  },
  {
    id: 'bonus',
    name: 'Bonus mystère',
    description: 'Contenus exclusifs réservés aux abonnés Premium. Astuces fiscales avancées, opportunités confidentielles et analyses approfondies.',
    color: '#1D1D1D',
    premium: true,
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 1 - Barres latérales</Badge>
      </div>

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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="relative bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col"
        >
          <!-- Barre colorée gauche -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1.5 group-hover:w-2 transition-all duration-300"
            :style="{ backgroundColor: theme.color }"
          />

          <div class="p-6 pl-8 flex flex-col flex-1">
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

            <!-- Contenu -->
            <h3 class="font-heading font-bold text-xl text-foreground mb-2">
              {{ theme.name }}
            </h3>
            <p class="text-muted-foreground text-sm leading-relaxed flex-1">
              {{ theme.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
