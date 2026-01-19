<script setup lang="ts">
/**
 * Composant MarketingHero
 * Section hero de la page marketing consultations
 */
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { useConsultationsStore } from '@/stores/consultations.store'

const router = useRouter()
const consultationsStore = useConsultationsStore()

/**
 * Charger les consultations pour avoir le nombre de replays
 */
onMounted(() => {
  consultationsStore.fetchConsultations()
})

/**
 * Nombre de replays disponibles
 */
const replaysCount = computed(() => {
  const count = consultationsStore.replays.length
  return count > 0 ? count : 150
})

/**
 * Prochaine consultation à venir
 */
const nextConsultation = computed(() => {
  return consultationsStore.upcoming[0] || null
})

/**
 * URL de l'image de la prochaine consultation
 */
const nextConsultationImage = computed(() => {
  if (!nextConsultation.value) {
    return 'https://www.figma.com/api/mcp/asset/afbc6451-6700-4b48-a488-72ab19a253da'
  }
  // Construire l'URL complète du thumbnail
  return `https://jeandeportal.fr/${nextConsultation.value.thumbnail}`
})

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  play: byPrefixAndName.fas?.['circle-play'],
  users: byPrefixAndName.fas?.['users'],
  calendar: byPrefixAndName.fas?.['calendar-days'],
}))

/**
 * Actions
 */
const handleStartFree = () => {
  router.push('/consultations-nicolas-delourme/invitation')
}

const handleWatchReplay = () => {
  router.push('/consultations-nicolas-delourme')
}
</script>

<template>
  <section class="bg-gradient-to-b from-consultations-nd to-consultations-nd/90 py-16">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Badge "Nouveau format" -->
      <div class="flex items-center justify-center gap-2 mb-6">
        <div class="bg-linear-to-r from-yellow-300 to-yellow-500 px-6 py-2 rounded-full shadow-[0px_4px_16px_0px_rgba(222,166,0,0.3)]">
          <p class="font-bold text-[14px] text-consultations-nd text-center tracking-[0.7px] uppercase leading-5"
            style="font-family: Roboto, sans-serif;">
            Notre nouveau format
          </p>
        </div>
      </div>

      <div class="text-white mb-10">
        <!-- Titre principal -->
        <h1 class="text-4xl md:text-5xl font-bold leading-tight" style="font-family: Roboto, sans-serif;">
          Les Consultations Privées de Nicolas Delourme
        </h1>
      </div>
      <div class="grid lg:grid-cols-2 gap-12 items-start mb-14">
        <!-- Colonne gauche: Contenu -->
        <div class="space-y-6 text-white">

          <!-- Sous-titre -->
          <p class="text-xl md:text-2xl font-medium text-white/90" style="font-family: Roboto, sans-serif;">
            Un accès privilégié à l'expertise patrimoniale de référence
          </p>

          <!-- Description -->
          <p class="text-lg text-white/80 leading-relaxed" style="font-family: Roboto, sans-serif;">
            Participez à des consultations en direct où Nicolas Delourme et ses experts répondent à vos questions
            personnalisées sur l'argent, les métaux précieux, le patrimoine et l'immobilier. Recevez des dossiers
            exclusifs et accédez aux replays à vie.
          </p>

        </div>

        <!-- Colonne droite: Image/Vidéo -->
        <div class="relative">
          <div class="relative rounded-lg overflow-hidden shadow-2xl">
            <img :src="nextConsultationImage"
              alt="Consultations Nicolas Delourme" class="w-full h-auto" />

            <!-- Badge overlay -->
            <div class="absolute top-4 right-4">
              <div class="bg-neutral-200 flex gap-3 items-center px-4 py-2 rounded-full shadow-sm">
                <div class="bg-primary animate-pulse duration-1000 opacity-[0.876] rounded-full w-3 h-3" />
                <p class="font-bold text-xs text-neutral-800 leading-5" style="font-family: Roboto, sans-serif;">
                  En direct
                </p>
              </div>
            </div>
          </div>

          <!-- Floating testimonial card -->
          <div class="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 max-w-xs hidden lg:block">
            <p class="text-sm text-gray-700 italic mb-2">
              "Un format unique pour des réponses concrètes à mes questions patrimoniales"
            </p>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <p class="text-xs font-semibold text-gray-900">Jean M.</p>
                <p class="text-xs text-gray-500">Abonné depuis 6 mois</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-6 text-white">

        <!-- Stats clés -->
        <div class="flex justify-center flex-wrap gap-12 pt-4">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-3 rounded-lg">
              <FontAwesomeIcon v-if="icons.calendar" :icon="icons.calendar" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold">1 Live</p>
              <p class="text-sm text-white/70">par semaine</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-3 rounded-lg">
              <FontAwesomeIcon v-if="icons.users" :icon="icons.users" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold">4 Thématiques</p>
              <p class="text-sm text-white/70">au choix</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-3 rounded-lg">
              <FontAwesomeIcon v-if="icons.play" :icon="icons.play" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold">{{ replaysCount }} Replays</p>
              <p class="text-sm text-white/70">en accès illimité</p>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col justify-center sm:flex-row gap-4 pt-4">
          <Button @click="handleStartFree" color="green-600" size="lg"
            class="font-bold uppercase tracking-wide text-lg">
            Commencer gratuitement
          </Button>
          <Button @click="handleWatchReplay" variant="outline" size="lg" class="bg-white font-bold tracking-wide">
            <FontAwesomeIcon v-if="icons.play" :icon="icons.play" class="w-5 h-5 mr-2" />
            Voir un replay
          </Button>
        </div>

        <!-- Trust indicator -->
        <p class="text-sm text-center text-white/60 pt-2">
          Sans engagement • Résiliation à tout moment • Aucun paiement immédiat
        </p>

      </div>
    </div>
  </section>
</template>
