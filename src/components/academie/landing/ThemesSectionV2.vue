<script setup lang="ts">
/**
 * ThemesSection V2 - Cards avec gradient backgrounds
 * Style plus audacieux avec fonds colorés et hover dramatique
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const icons = computed(() => ({
  crown: byPrefixAndName.fas?.['crown'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))

interface Theme {
  id: string
  name: string
  description: string
  gradient: string
  textColor: string
  premium?: boolean
}

const themes: Theme[] = [
  {
    id: 'metaux',
    name: 'Métaux précieux',
    description: 'Investir dans l\'or et l\'argent physique. Comprendre les cycles et la protection de votre patrimoine.',
    gradient: 'from-[#F2CC00] to-[#D4A800]',
    textColor: 'text-black',
  },
  {
    id: 'portefeuille',
    name: 'Portefeuille permanent',
    description: 'Stratégie long terme basée sur la diversification. Un patrimoine résilient à toutes les conditions.',
    gradient: 'from-[#A8C7EA] to-[#7BA3D1]',
    textColor: 'text-slate-900',
  },
  {
    id: 'liberte',
    name: 'Liberté financière',
    description: 'Les clés pour l\'indépendance financière. Revenus passifs et stratégies de croissance.',
    gradient: 'from-[#F4BFA6] to-[#E99B78]',
    textColor: 'text-slate-900',
  },
  {
    id: 'bonus',
    name: 'Bonus mystère',
    description: 'Contenus exclusifs Premium. Astuces fiscales avancées et opportunités confidentielles.',
    gradient: 'from-[#2D2D2D] to-[#1D1D1D]',
    textColor: 'text-white',
    premium: true,
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 2 - Gradients audacieux</Badge>
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

      <!-- Grid des thématiques -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="theme in themes"
          :key="theme.id"
          :class="[
            'relative rounded-sm p-6 transition-all duration-500 cursor-pointer group flex flex-col',
            'bg-gradient-to-br',
            theme.gradient,
            'hover:scale-[1.02] hover:shadow-2xl',
          ]"
        >
          <!-- Badge Premium -->
          <Badge
            v-if="theme.premium"
            variant="default"
            rounded="sm"
            class="absolute top-4 right-4 bg-accent-yellow text-primary gap-1"
          >
            <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-3" />
            Premium
          </Badge>

          <!-- Contenu -->
          <div :class="[theme.textColor, 'flex flex-col flex-1']">
            <h3 class="font-heading font-bold text-xl mb-3">
              {{ theme.name }}
            </h3>
            <p class="text-sm leading-relaxed opacity-90 mb-4 flex-1">
              {{ theme.description }}
            </p>

            <!-- CTA subtle -->
            <div class="flex items-center gap-2 text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
              <span>Explorer</span>
              <FontAwesomeIcon
                v-if="icons.arrowRight"
                :icon="icons.arrowRight"
                class="size-3 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
