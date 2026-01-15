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
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="flex flex-col lg:flex-row min-h-[600px]">
      <!-- Partie gauche - Contenu -->
      <div class="flex-1 bg-white flex items-center">
        <div class="max-w-xl mx-auto px-6 md:px-12 py-16 lg:py-24 lg:ml-auto lg:mr-16">
          <Badge
            variant="default"
            rounded="lg"
            class="mb-6 gap-2"
          >
            <FontAwesomeIcon v-if="icons.graduationCap" :icon="icons.graduationCap" class="size-3" />
            Infocash Académie
          </Badge>

          <h1 class="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
            L'Académie qui vous accompagne vers la liberté
          </h1>

          <!-- Citation -->
          <div class="relative mb-8  p-4">
            <FontAwesomeIcon
              v-if="icons.quote"
              :icon="icons.quote"
              class="absolute -left-0.5 -top-0.5 size-4 text-primary/30"
            />
            <p class="text-muted-foreground italic">
              "Mon objectif : vous transmettre 20 ans d'expérience en investissement
              de manière simple et actionnable."
            </p>
            <p class="text-sm font-semibold text-foreground mt-2">— Nicolas Delourme</p>
          </div>

          <div class="group flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              rounded="lg"
              variant="secondary"
              class="group-hover:text-primary font-semibold gap-2"
              @click="scrollToPricing"
            >
              Rejoindre l'Académie
              <FontAwesomeIcon v-if="icons.arrowRight" :icon="icons.arrowRight" class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              rounded="lg"
              color="secondary"
              class="group-hover:underline font-semibold gap-2"
            >
              À partir de 9,90€/mois
            </Button>
          </div>
        </div>
      </div>

      <!-- Partie droite - Image -->
      <div class="lg:w-1/2 bg-secondary relative">
        <!-- Décor géométrique -->
        <div class="absolute top-0 rounded-lg left-0 w-32 h-32 bg-accent-yellow/20" />
        <div class="absolute bottom-0 rounded-lg right-0 w-48 h-48 bg-white/5" />

        <!-- Image placeholder -->
        <div class="relative h-full min-h-[400px] rounded-lg lg:min-h-0 flex items-center justify-center p-8">
          <!--
            IMAGE À FOURNIR AU GRAPHISTE:
            - Portrait de Nicolas Delourme
            - Style éditorial/magazine
            - Détouré ou sur fond uni
            - Expression confiante, regard vers la gauche (vers le texte)
            - Peut être en noir et blanc avec touche de couleur
            - Format: 600x800px minimum (portrait)
          -->
          <div class="bg-white/10 rounded-lg w-full max-w-md aspect-[3/4] flex items-center justify-center">
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
