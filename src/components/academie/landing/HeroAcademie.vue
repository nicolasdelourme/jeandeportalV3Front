<script setup lang="ts">
/**
 * HeroAcademie - Section hero de la page Académie
 * Présentation du concept avec CTA vers les offres
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

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
  <section class="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85">
    <!-- Éléments décoratifs -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

    <div class="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
      <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <!-- Contenu texte -->
        <div class="flex-1 text-center md:text-left">
          <Badge
            variant="outline"
            rounded="sm"
            class="mb-6 border-white/30 bg-white/10 text-white backdrop-blur-sm gap-2"
          >
            <FontAwesomeIcon v-if="icons.graduationCap" :icon="icons.graduationCap" class="size-3" />
            Formation Premium
          </Badge>

          <h1 class="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
            Infocash Académie
          </h1>

          <p class="text-xl md:text-2xl text-white/90 font-medium mb-4">
            Votre parcours vers l'indépendance financière
          </p>

          <p class="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
            Accédez à des contenus exclusifs chaque semaine : newsletters, tutoriels vidéo et consultations en direct
            sur les thématiques qui comptent pour votre patrimoine.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              size="lg"
              rounded="sm"
              class="bg-white text-primary hover:bg-white/90 font-semibold gap-2"
              @click="scrollToPricing"
            >
              Découvrir les offres
              <FontAwesomeIcon v-if="icons.arrowDown" :icon="icons.arrowDown" class="size-4" />
            </Button>
          </div>
        </div>

        <!-- Illustration / Stats -->
        <div class="shrink-0 w-full md:w-auto">
          <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0">
            <!-- Stat 1 -->
            <div class="bg-white/10 backdrop-blur-sm rounded-sm p-6 text-center border border-white/20">
              <p class="font-heading font-bold text-3xl text-white mb-1">3</p>
              <p class="text-white/70 text-sm">Thématiques</p>
            </div>
            <!-- Stat 2 -->
            <div class="bg-white/10 backdrop-blur-sm rounded-sm p-6 text-center border border-white/20">
              <p class="font-heading font-bold text-3xl text-white mb-1">12</p>
              <p class="text-white/70 text-sm">Contenus/mois</p>
            </div>
            <!-- Stat 3 -->
            <div class="bg-white/10 backdrop-blur-sm rounded-sm p-6 text-center border border-white/20">
              <p class="font-heading font-bold text-3xl text-white mb-1">
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-6 text-accent-yellow" />
              </p>
              <p class="text-white/70 text-sm">Récompenses</p>
            </div>
            <!-- Stat 4 -->
            <div class="bg-white/10 backdrop-blur-sm rounded-sm p-6 text-center border border-white/20">
              <p class="font-heading font-bold text-3xl text-white mb-1">9,90€</p>
              <p class="text-white/70 text-sm">à partir de</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
