<script setup lang="ts">
/**
 * HeroAcademie V1 - Image présentateur à droite
 * Layout classique avec photo du présentateur et ses experts
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
  checkCircle: byPrefixAndName.fas?.['check-circle'],
}))

const scrollToPricing = () => {
  const pricingSection = document.getElementById('pricing-section')
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const features = [
  'Newsletters hebdomadaires',
  'Tutoriels vidéo exclusifs',
  'Consultations en direct',
]
</script>

<template>
  <section class="relative overflow-hidden bg-white">
    <!-- Version indicator -->
    <div class="absolute top-4 left-4 z-20">
      <Badge variant="outline" class="text-xs">VERSION 1 - Présentateur à droite</Badge>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <!-- Contenu texte -->
        <div class="flex-1 text-center lg:text-left">
          <Badge
            variant="outline"
            rounded="sm"
            class="mb-6 border-primary/30 bg-primary/5 text-primary gap-2"
          >
            <FontAwesomeIcon v-if="icons.graduationCap" :icon="icons.graduationCap" class="size-3" />
            Formation Premium
          </Badge>

          <h1 class="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
            Maîtrisez vos finances avec
            <span class="text-primary">l'Académie Infocash</span>
          </h1>

          <p class="text-muted-foreground text-lg leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
            Rejoignez Nicolas Delourme et son équipe d'experts pour un accompagnement personnalisé
            vers votre indépendance financière.
          </p>

          <!-- Features list -->
          <ul class="space-y-3 mb-8 max-w-md mx-auto lg:mx-0">
            <li
              v-for="feature in features"
              :key="feature"
              class="flex items-center gap-3 text-foreground"
            >
              <FontAwesomeIcon
                v-if="icons.checkCircle"
                :icon="icons.checkCircle"
                class="size-5 text-green-500 shrink-0"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              rounded="sm"
              class="font-semibold gap-2"
              @click="scrollToPricing"
            >
              Découvrir les offres
              <FontAwesomeIcon v-if="icons.arrowDown" :icon="icons.arrowDown" class="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              rounded="sm"
              class="gap-2"
            >
              <FontAwesomeIcon v-if="icons.play" :icon="icons.play" class="size-4" />
              Voir la présentation
            </Button>
          </div>
        </div>

        <!-- Image présentateur -->
        <div class="shrink-0 w-full lg:w-1/2 max-w-lg">
          <div class="relative">
            <!-- Décor derrière l'image -->
            <div class="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent-yellow/20 to-primary/10 rounded-sm -z-10" />

            <!-- Placeholder image -->
            <div
              class="aspect-[4/3] bg-neutral-200 rounded-sm flex items-center justify-center overflow-hidden"
            >
              <!--
                IMAGE À FOURNIR AU GRAPHISTE:
                - Nicolas Delourme en position confiante (bras croisés ou main sur bureau)
                - Peut-être avec 1-2 experts en arrière-plan flou
                - Style professionnel mais accessible
                - Fond neutre ou bureau moderne
                - Format: 800x600px minimum
              -->
              <div class="text-center p-8 text-muted-foreground">
                <p class="font-heading font-bold text-lg mb-2">Photo Présentateur</p>
                <p class="text-sm">Nicolas Delourme + experts</p>
                <p class="text-xs mt-2 opacity-60">800x600px</p>
              </div>
            </div>

            <!-- Badge flottant -->
            <div class="absolute -bottom-4 -left-4 bg-white rounded-sm shadow-lg p-4 border border-border">
              <p class="font-heading font-bold text-2xl text-primary">+500</p>
              <p class="text-sm text-muted-foreground">membres actifs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
