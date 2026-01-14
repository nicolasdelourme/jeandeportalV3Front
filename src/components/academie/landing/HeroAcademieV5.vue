<script setup lang="ts">
/**
 * HeroAcademie V5 - Split design avec portrait
 * Style éditorial/magazine, portrait découpé
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const icons = computed(() => ({
  arrowDown: byPrefixAndName.fas?.['arrow-down'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
  graduationCap: byPrefixAndName.fas?.['graduation-cap'],
  quote: byPrefixAndName.fas?.['quote-left'],
}))

const scrollToPricing = () => {
  const pricingSection = document.getElementById('pricing-section')
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const themes = [
  { name: 'Métaux', color: '#F2CC00' },
  { name: 'Portefeuille', color: '#A8C7EA' },
  { name: 'Liberté', color: '#F4BFA6' },
  { name: 'Bonus', color: '#1D1D1D' },
]
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Version indicator -->
    <div class="absolute top-4 left-4 z-20">
      <Badge variant="outline" class="text-xs">VERSION 5 - Split éditorial avec portrait</Badge>
    </div>

    <div class="flex flex-col lg:flex-row min-h-[600px]">
      <!-- Partie gauche - Contenu -->
      <div class="flex-1 bg-white flex items-center">
        <div class="max-w-xl mx-auto px-6 md:px-12 py-16 lg:py-24 lg:ml-auto lg:mr-16">
          <Badge
            variant="outline"
            rounded="sm"
            class="mb-6 border-primary/30 bg-primary/5 text-primary gap-2"
          >
            <FontAwesomeIcon v-if="icons.graduationCap" :icon="icons.graduationCap" class="size-3" />
            Formation Premium
          </Badge>

          <h1 class="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
            L'Académie qui vous accompagne vers la liberté
          </h1>

          <!-- Citation -->
          <div class="relative mb-8 pl-6 border-l-4 border-primary">
            <FontAwesomeIcon
              v-if="icons.quote"
              :icon="icons.quote"
              class="absolute -left-1 -top-2 size-4 text-primary/30"
            />
            <p class="text-muted-foreground italic">
              "Mon objectif : vous transmettre 20 ans d'expérience en investissement
              de manière simple et actionnable."
            </p>
            <p class="text-sm font-semibold text-foreground mt-2">— Nicolas Delourme</p>
          </div>

          <!-- Thèmes en ligne -->
          <div class="flex flex-wrap gap-2 mb-8">
            <div
              v-for="theme in themes"
              :key="theme.name"
              class="px-3 py-1.5 rounded-sm text-sm font-medium"
              :style="{
                backgroundColor: `${theme.color}20`,
                color: theme.color === '#1D1D1D' ? '#1D1D1D' : 'inherit',
                borderLeft: `3px solid ${theme.color}`,
              }"
            >
              {{ theme.name }}
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              rounded="sm"
              class="font-semibold gap-2"
              @click="scrollToPricing"
            >
              Rejoindre l'Académie
              <FontAwesomeIcon v-if="icons.arrowRight" :icon="icons.arrowRight" class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              rounded="sm"
              class="text-muted-foreground"
            >
              À partir de 9,90€/mois
            </Button>
          </div>
        </div>
      </div>

      <!-- Partie droite - Image -->
      <div class="lg:w-1/2 bg-primary relative">
        <!-- Décor géométrique -->
        <div class="absolute top-0 left-0 w-32 h-32 bg-accent-yellow/20" />
        <div class="absolute bottom-0 right-0 w-48 h-48 bg-white/5" />

        <!-- Image placeholder -->
        <div class="relative h-full min-h-[400px] lg:min-h-0 flex items-center justify-center p-8">
          <!--
            IMAGE À FOURNIR AU GRAPHISTE:
            - Portrait de Nicolas Delourme
            - Style éditorial/magazine
            - Détouré ou sur fond uni
            - Expression confiante, regard vers la gauche (vers le texte)
            - Peut être en noir et blanc avec touche de couleur
            - Format: 600x800px minimum (portrait)
          -->
          <div class="bg-white/10 rounded-sm w-full max-w-md aspect-[3/4] flex items-center justify-center">
            <div class="text-center text-white/50 p-8">
              <p class="font-heading font-bold text-xl mb-2">Portrait Nicolas</p>
              <p class="text-sm">Style éditorial / magazine</p>
              <p class="text-xs mt-2">600x800px</p>
            </div>
          </div>
        </div>

        <!-- Stats flottantes -->
        <div class="absolute bottom-8 left-8 right-8 flex justify-between text-white">
          <div>
            <p class="font-heading font-bold text-2xl">4</p>
            <p class="text-white/60 text-xs">Thématiques</p>
          </div>
          <div>
            <p class="font-heading font-bold text-2xl">12+</p>
            <p class="text-white/60 text-xs">Contenus/mois</p>
          </div>
          <div>
            <p class="font-heading font-bold text-2xl">Live</p>
            <p class="text-white/60 text-xs">Consultations</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
