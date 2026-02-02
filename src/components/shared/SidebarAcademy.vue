<script setup lang="ts">
/**
 * Composant SidebarAcademy
 * Card de cross-sell vers l'Académie
 * Gradient background avec CTA
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { computed } from 'vue'

const icons = computed(() => ({
  graduationCap: byPrefixAndName.fas?.['graduation-cap'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))
</script>

<template>
  <section
    class="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-secondary via-secondary to-secondary/80"
  >
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div class="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

    <!-- Content -->
    <div class="relative z-10 flex flex-col gap-4">
      <!-- Icon -->
      <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
        <FontAwesomeIcon
          v-if="icons.graduationCap"
          :icon="icons.graduationCap"
          class="w-6 h-6 text-primary"
        />
      </div>

      <!-- Text -->
      <div class="flex flex-col gap-2">
        <h3 class="font-heading font-bold text-xl text-white">
          Passez à l'Académie
        </h3>
        <p class="text-sm text-neutral-300 leading-relaxed">
          Formations premium, tutoriels exclusifs et newsletters personnalisées pour maîtriser vos investissements.
        </p>
      </div>

      <!-- CTA -->
      <Button
        as-child
        variant="default"
        rounded="lg"
        class="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <RouterLink to="/academie">
          Découvrir
          <FontAwesomeIcon
            v-if="icons.arrowRight"
            :icon="icons.arrowRight"
            class="w-4 h-4 ml-2"
          />
        </RouterLink>
      </Button>
    </div>
  </section>
</template>
