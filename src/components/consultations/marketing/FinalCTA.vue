<script setup lang="ts">
/**
 * Composant FinalCTA
 * Section CTA finale de la page marketing
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { useConsultationsStore } from '@/stores/consultations.store'

const router = useRouter()
const consultationsStore = useConsultationsStore()

/**
 * Nombre de replays disponibles
 */
const replaysCount = computed(() => consultationsStore.replays.length || 150)

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  consultationsNd: byPrefixAndName.fak?.['consultations-nd'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
  checkCircle: byPrefixAndName.fas?.['circle-check'],
}))

/**
 * Action
 */
const handleStartNow = () => {
  router.push('/consultations-nicolas-delourme/invitation')
}
</script>

<template>
  <section class="bg-gradient-to-r from-consultations-nd via-consultations-nd/95 to-consultations-nd py-20">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <!-- Icône -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
        <FontAwesomeIcon v-if="icons.consultationsNd" :icon="icons.consultationsNd"
          class="w-10 h-10 fa-2xl text-white" />
      </div>

      <!-- Titre -->
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-6" style="font-family: Roboto, sans-serif;">
        Prêt à transformer votre gestion patrimoniale ?
      </h2>

      <!-- Sous-titre -->
      <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed" style="font-family: Roboto, sans-serif;">
        Rejoignez des centaines d'épargnants qui font déjà confiance à Nicolas Delourme et ses experts pour
        sécuriser et développer leur patrimoine.
      </p>

      <!-- Stats de confiance -->
      <div class="flex flex-wrap justify-center gap-12 mb-10">
        <div class="text-center">
          <p class="text-4xl font-bold text-white">1 Live</p>
          <p class="text-white/70 text-sm">par semaine</p>
        </div>
        <div class="text-center">
          <p class="text-4xl font-bold text-white">4 Thèmes</p>
          <p class="text-white/70 text-sm">au choix</p>
        </div>
        <div class="text-center">
          <p class="text-4xl font-bold text-white">{{ replaysCount }}</p>
          <p class="text-white/70 text-sm">Replays gratuits</p>
        </div>
      </div>

      <!-- CTA Button -->
      <Button @click="handleStartNow" color="green-600" size="xl"
        class="font-bold uppercase tracking-wider text-xl px-12 shadow-2xl hover:scale-105 transition-transform">
        Commencer gratuitement maintenant
        <FontAwesomeIcon v-if="icons.arrowRight" :icon="icons.arrowRight" class="w-5 h-5 ml-3" />
      </Button>

      <!-- Trust indicators -->
      <div class="mt-8 flex flex-wrap justify-center items-center gap-6 text-white/70 text-sm">
        <div class="flex items-center gap-2">
          <FontAwesomeIcon v-if="icons.checkCircle" :icon="icons.checkCircle" class="w-5 h-5" />
          <span>Sans engagement</span>
        </div>
        <div class="flex items-center gap-2">
          <FontAwesomeIcon v-if="icons.checkCircle" :icon="icons.checkCircle" class="w-5 h-5" />
          <span>Aucun paiement immédiat</span>
        </div>
        <div class="flex items-center gap-2">
          <FontAwesomeIcon v-if="icons.checkCircle" :icon="icons.checkCircle" class="w-5 h-5" />
          <span>Résiliation en 1 clic</span>
        </div>
      </div>
    </div>
  </section>
</template>
