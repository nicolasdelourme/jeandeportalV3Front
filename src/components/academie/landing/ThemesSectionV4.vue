<script setup lang="ts">
/**
 * ThemesSection V4 - Timeline horizontale avec numéros
 * Style éditorial/magazine avec numérotation et ligne de connexion
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
  number: string
  premium?: boolean
}

const themes: Theme[] = [
  {
    id: 'metaux',
    name: 'Métaux précieux',
    description: 'Investir dans l\'or et l\'argent physique. Comprendre les cycles, les opportunités d\'achat et la protection de votre patrimoine.',
    color: '#F2CC00',
    number: '01',
  },
  {
    id: 'portefeuille',
    name: 'Portefeuille permanent',
    description: 'Stratégie d\'investissement long terme basée sur la diversification. Construisez un patrimoine résilient.',
    color: '#A8C7EA',
    number: '02',
  },
  {
    id: 'liberte',
    name: 'Liberté financière',
    description: 'Les clés pour atteindre l\'indépendance financière. Revenus passifs et stratégies de croissance.',
    color: '#F4BFA6',
    number: '03',
  },
  {
    id: 'bonus',
    name: 'Bonus mystère',
    description: 'Contenus exclusifs réservés aux abonnés Premium. Astuces fiscales avancées et opportunités confidentielles.',
    color: '#1D1D1D',
    number: '04',
    premium: true,
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-neutral-50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 4 - Timeline numérotée</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          4 thématiques pour maîtriser vos finances
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Choisissez les sujets qui correspondent à vos objectifs.
        </p>
      </div>

      <!-- Timeline Grid -->
      <div class="relative">
        <!-- Ligne de connexion horizontale (desktop) -->
        <div class="hidden lg:block absolute top-16 left-0 right-0 h-px bg-border" />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          <div
            v-for="theme in themes"
            :key="theme.id"
            class="relative group"
          >
            <!-- Numéro avec cercle coloré -->
            <div class="flex items-center gap-4 mb-6">
              <div
                class="relative w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-xl z-10 transition-transform group-hover:scale-110"
                :style="{
                  backgroundColor: theme.color,
                  color: theme.premium ? 'white' : 'black',
                }"
              >
                {{ theme.number }}
              </div>
              <!-- Ligne vers le bas (mobile/tablet) -->
              <div class="flex-1 h-px bg-border lg:hidden" />
            </div>

            <!-- Card content -->
            <div class="bg-white rounded-sm p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border group-hover:border-transparent h-full flex flex-col"
              :style="{ '--hover-border': theme.color }"
            >
              <!-- Badge Premium -->
              <Badge
                v-if="theme.premium"
                variant="default"
                rounded="sm"
                class="mb-4 bg-primary text-primary-foreground gap-1 self-start"
              >
                <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-3" />
                Premium
              </Badge>

              <h3 class="font-heading font-bold text-lg text-foreground mb-2">
                {{ theme.name }}
              </h3>
              <p class="text-muted-foreground text-sm leading-relaxed flex-1">
                {{ theme.description }}
              </p>

              <!-- Indicateur coloré en bas -->
              <div
                class="mt-4 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-full"
                :style="{ backgroundColor: theme.color }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
