<script setup lang="ts">
/**
 * HeroAcademie V2 - Grande image en fond avec overlay
 * Impact visuel fort avec photo pleine largeur
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const icons = computed(() => ({
  arrowDown: byPrefixAndName.fas?.['arrow-down'],
  graduationCap: byPrefixAndName.fas?.['graduation-cap'],
  star: byPrefixAndName.fas?.['star'],
}))

const scrollToPricing = () => {
  const pricingSection = document.getElementById('pricing-section')
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="relative overflow-hidden min-h-[600px] flex items-center">
    <!-- Version indicator -->
    <div class="absolute top-4 left-4 z-20">
      <Badge variant="outline" class="text-xs bg-white">VERSION 2 - Image fond pleine largeur</Badge>
    </div>

    <!-- Background image placeholder -->
    <div class="absolute inset-0 bg-neutral-800">
      <!--
        IMAGE À FOURNIR AU GRAPHISTE:
        - Photo large de Nicolas Delourme dans son environnement de travail
        - Bureau avec écrans, graphiques, livres finance
        - Ambiance sérieuse mais chaleureuse
        - Peut être légèrement floutée pour lisibilité du texte
        - Format: 1920x1080px minimum (full HD)
      -->
      <div class="absolute inset-0 flex items-center justify-center text-white/30">
        <div class="text-center">
          <p class="font-heading font-bold text-2xl mb-2">Image de fond</p>
          <p>Nicolas dans son bureau / environnement de travail</p>
          <p class="text-sm mt-2">1920x1080px</p>
        </div>
      </div>
    </div>

    <!-- Overlay gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />

    <!-- Contenu -->
    <div class="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-32">
      <div class="max-w-2xl">
        <Badge
          variant="outline"
          rounded="sm"
          class="mb-6 border-white/30 bg-white/10 text-white backdrop-blur-sm gap-2"
        >
          <FontAwesomeIcon v-if="icons.graduationCap" :icon="icons.graduationCap" class="size-3" />
          Formation Premium
        </Badge>

        <h1 class="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          Votre parcours vers l'indépendance financière
        </h1>

        <p class="text-white/80 text-lg md:text-xl leading-relaxed mb-8">
          Chaque semaine, accédez à des contenus exclusifs : analyses de marché, tutoriels pratiques
          et consultations personnalisées avec Nicolas Delourme.
        </p>

        <div class="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            rounded="sm"
            class="bg-accent-yellow text-primary hover:bg-accent-yellow/90 font-semibold gap-2"
            @click="scrollToPricing"
          >
            Commencer maintenant
            <FontAwesomeIcon v-if="icons.arrowDown" :icon="icons.arrowDown" class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            rounded="sm"
            class="border-white/30 text-white hover:bg-white/10 gap-2"
          >
            À partir de 9,90€/mois
          </Button>
        </div>

        <!-- Stats en ligne -->
        <div class="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
          <div>
            <p class="font-heading font-bold text-3xl text-white">4</p>
            <p class="text-white/60 text-sm">Thématiques</p>
          </div>
          <div>
            <p class="font-heading font-bold text-3xl text-white">12+</p>
            <p class="text-white/60 text-sm">Contenus/mois</p>
          </div>
          <div>
            <p class="font-heading font-bold text-3xl text-accent-yellow flex items-center gap-2">
              <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-6" />
            </p>
            <p class="text-white/60 text-sm">Récompenses</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
