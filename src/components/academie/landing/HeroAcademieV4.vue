<script setup lang="ts">
/**
 * HeroAcademie V4 - Vidéo/Image centrale avec présentation
 * Format témoignage/présentation vidéo
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const icons = computed(() => ({
  arrowDown: byPrefixAndName.fas?.['arrow-down'],
  graduationCap: byPrefixAndName.fas?.['graduation-cap'],
  play: byPrefixAndName.fas?.['play'],
  envelope: byPrefixAndName.fas?.['envelope'],
  video: byPrefixAndName.fas?.['video'],
  comments: byPrefixAndName.fas?.['comments'],
}))

const scrollToPricing = () => {
  const pricingSection = document.getElementById('pricing-section')
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="relative overflow-hidden bg-primary">
    <!-- Version indicator -->
    <div class="absolute top-4 left-4 z-20">
      <Badge variant="outline" class="text-xs bg-white">VERSION 4 - Vidéo centrale</Badge>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
      <!-- Header -->
      <div class="text-center mb-10">
        <Badge
          variant="outline"
          rounded="sm"
          class="mb-4 border-white/30 bg-white/10 text-white gap-2"
        >
          <FontAwesomeIcon v-if="icons.graduationCap" :icon="icons.graduationCap" class="size-3" />
          Formation Premium
        </Badge>

        <h1 class="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
          Infocash Académie
        </h1>

        <p class="text-white/70 text-lg max-w-2xl mx-auto">
          Découvrez la formation qui va transformer votre approche de l'investissement
        </p>
      </div>

      <!-- Vidéo centrale -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="relative rounded-sm overflow-hidden shadow-2xl">
          <!-- Placeholder vidéo -->
          <div class="aspect-video bg-neutral-900 flex items-center justify-center">
            <!--
              VIDÉO/IMAGE À FOURNIR AU GRAPHISTE:
              - Thumbnail vidéo de présentation
              - Nicolas Delourme face caméra, souriant
              - Décor professionnel (bureau, bibliothèque)
              - Texte overlay possible: "Découvrez l'Académie"
              - Format: 1280x720px minimum (720p)
            -->
            <div class="text-center text-white/50">
              <p class="font-heading font-bold text-xl mb-2">Vidéo de présentation</p>
              <p class="text-sm">Nicolas présente l'Académie</p>
              <p class="text-xs mt-2">1280x720px</p>
            </div>
          </div>

          <!-- Bouton play -->
          <button class="absolute inset-0 flex items-center justify-center group">
            <div class="w-20 h-20 rounded-full bg-accent-yellow flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FontAwesomeIcon
                v-if="icons.play"
                :icon="icons.play"
                class="size-8 text-primary ml-1"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- 3 pilliers en dessous -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        <div class="text-center">
          <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon v-if="icons.envelope" :icon="icons.envelope" class="size-5 text-white" />
          </div>
          <p class="font-semibold text-white">Newsletters</p>
          <p class="text-white/60 text-sm">Chaque lundi</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon v-if="icons.video" :icon="icons.video" class="size-5 text-white" />
          </div>
          <p class="font-semibold text-white">Tutoriels</p>
          <p class="text-white/60 text-sm">Chaque mardi</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon v-if="icons.comments" :icon="icons.comments" class="size-5 text-white" />
          </div>
          <p class="font-semibold text-white">Consultations</p>
          <p class="text-white/60 text-sm">Chaque jeudi</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <Button
          size="lg"
          rounded="sm"
          class="bg-accent-yellow text-primary hover:bg-accent-yellow/90 font-semibold gap-2"
          @click="scrollToPricing"
        >
          Voir les offres à partir de 9,90€
          <FontAwesomeIcon v-if="icons.arrowDown" :icon="icons.arrowDown" class="size-4" />
        </Button>
      </div>
    </div>
  </section>
</template>
