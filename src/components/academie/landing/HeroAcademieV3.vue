<script setup lang="ts">
/**
 * HeroAcademie V3 - Les 4 thèmes colorés en vedette
 * Sans image, mise en avant des couleurs thématiques
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const icons = computed(() => ({
  arrowDown: byPrefixAndName.fas?.['arrow-down'],
  graduationCap: byPrefixAndName.fas?.['graduation-cap'],
}))

const scrollToPricing = () => {
  const pricingSection = document.getElementById('pricing-section')
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const themes = [
  { name: 'Métaux précieux', color: '#F2CC00', textColor: 'text-black' },
  { name: 'Portefeuille', color: '#A8C7EA', textColor: 'text-slate-900' },
  { name: 'Liberté', color: '#F4BFA6', textColor: 'text-slate-900' },
  { name: 'Bonus', color: '#1D1D1D', textColor: 'text-white' },
]
</script>

<template>
  <section class="relative overflow-hidden bg-neutral-50">
    <!-- Version indicator -->
    <div class="absolute top-4 left-4 z-20">
      <Badge variant="outline" class="text-xs">VERSION 3 - 4 thèmes colorés (sans image)</Badge>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
      <!-- Header centré -->
      <div class="text-center mb-12">
        <Badge
          variant="outline"
          rounded="sm"
          class="mb-6 border-primary/30 bg-primary/5 text-primary gap-2"
        >
          <FontAwesomeIcon v-if="icons.graduationCap" :icon="icons.graduationCap" class="size-3" />
          Formation Premium
        </Badge>

        <h1 class="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
          Infocash Académie
        </h1>

        <p class="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
          4 thématiques pour maîtriser votre patrimoine. Chaque semaine, des contenus exclusifs
          pour avancer vers votre indépendance financière.
        </p>

        <Button
          size="lg"
          rounded="sm"
          class="font-semibold gap-2"
          @click="scrollToPricing"
        >
          Découvrir les offres
          <FontAwesomeIcon v-if="icons.arrowDown" :icon="icons.arrowDown" class="size-4" />
        </Button>
      </div>

      <!-- Les 4 thèmes en bandes colorées -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
        <div
          v-for="(theme, index) in themes"
          :key="theme.name"
          class="relative rounded-sm overflow-hidden group cursor-pointer"
          :style="{ backgroundColor: theme.color }"
        >
          <div class="aspect-[3/4] md:aspect-[2/3] flex flex-col justify-end p-4 md:p-6">
            <!-- Numéro -->
            <span
              class="absolute top-4 left-4 font-heading font-bold text-4xl md:text-5xl opacity-20"
              :class="theme.textColor"
            >
              0{{ index + 1 }}
            </span>

            <!-- Nom du thème -->
            <p
              class="font-heading font-bold text-lg md:text-xl relative z-10"
              :class="theme.textColor"
            >
              {{ theme.name }}
            </p>
          </div>

          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
      </div>

      <!-- Stats en dessous -->
      <div class="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 pt-8 border-t border-border">
        <div class="text-center">
          <p class="font-heading font-bold text-3xl text-foreground">12+</p>
          <p class="text-muted-foreground text-sm">Contenus/mois</p>
        </div>
        <div class="text-center">
          <p class="font-heading font-bold text-3xl text-foreground">3</p>
          <p class="text-muted-foreground text-sm">Rendez-vous/semaine</p>
        </div>
        <div class="text-center">
          <p class="font-heading font-bold text-3xl text-foreground">9,90€</p>
          <p class="text-muted-foreground text-sm">à partir de</p>
        </div>
      </div>
    </div>
  </section>
</template>
