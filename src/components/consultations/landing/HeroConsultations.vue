<script setup lang="ts">
/**
 * Composant HeroConsultations
 * Section Hero de la page Consultations Nicolas Delourme
 * Contient : banner, section principale avec vidéo et description, et grille de webinaires
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import WebinarCard from './WebinarCard.vue'
import WebinarModal from './WebinarModal.vue'
import { useConsultationsStore } from '@/stores/consultations.store'
import type { APIWebinar } from '@/types/consultations-api.types'
import { getWebinarCategory, getWebinarThumbnail } from '@/types/consultations-api.types'
import { sanitizeHtml } from '@/utils/html.utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

/**
 * Router pour la navigation
 */
const router = useRouter()

/**
 * Store Pinia
 */
const consultationsStore = useConsultationsStore()

/**
 * Icônes FontAwesome accessibles de manière sûre
 */
const icons = computed(() => ({
  circlePlay: byPrefixAndName.fas?.['circle-play'],
  download: byPrefixAndName.fas?.['download'],
  shareNodes: byPrefixAndName.fas?.['share-nodes'],
  calendarPlus: byPrefixAndName.fas?.['calendar-plus'],
  consultationsNd: byPrefixAndName.fak?.['consultations-nd'],
}))

/**
 * État pour l'affichage de la description complète
 */
const showFullDescription = ref(false)

/**
 * État de la modale
 */
const isModalOpen = ref(false)
const selectedWebinar = ref<APIWebinar | null>(null)

/**
 * État pour le compte à rebours
 */
const countdown = ref('')

/**
 * Type d'état du webinaire : 'normal' | 'countdown' | 'live'
 */
type WebinarState = 'normal' | 'countdown' | 'live'

/**
 * État actuel du webinaire
 */
const webinarState = ref<WebinarState>('normal')

/**
 * Le webinaire principal (nextWebinar)
 * C'est le prochain webinaire à venir basé sur nextWebinarId (index dans le tableau)
 */
const mainWebinar = computed(() => {
  const nextIndex = consultationsStore.nextWebinarId
  return consultationsStore.webinars[nextIndex] || consultationsStore.webinars[0]
})

/**
 * URL complète de l'image du webinaire principal
 */
const mainWebinarImage = computed(() => {
  if (!mainWebinar.value) {
    return 'https://via.placeholder.com/400x300?text=Image+indisponible'
  }
  return getWebinarThumbnail(mainWebinar.value)
})

/**
 * Les 3 prochains webinaires pour la grille
 * On prend les webinaires après nextWebinar (3 suivants dans le tableau)
 */
const gridWebinars = computed(() => {
  const nextIndex = consultationsStore.nextWebinarId
  return consultationsStore.webinars.slice(nextIndex + 1, nextIndex + 4)
})

/**
 * Toggle l'affichage de la description complète
 */
const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

/**
 * Ouvre la modale avec les données d'un webinaire
 */
const openModal = (webinar: APIWebinar) => {
  selectedWebinar.value = webinar
  isModalOpen.value = true
}

/**
 * Ouvre la modale pour le webinaire principal
 */
const openMainWebinarModal = () => {
  if (mainWebinar.value) {
    openModal(mainWebinar.value)
  }
}

/**
 * Calcule l'état du webinaire et met à jour le compte à rebours
 */
const updateWebinarState = () => {
  if (!mainWebinar.value) return

  const now = new Date()
  const webinarDate = new Date(mainWebinar.value.date.date)
  const timeUntilStart = webinarDate.getTime() - now.getTime()
  const twoHoursInMs = 2 * 60 * 60 * 1000 // 2 heures en millisecondes
  const nintyMinutesInMs = 90 * 60 * 1000 // 90 minutes en millisecondes

  // Déterminer l'état
  if (timeUntilStart > twoHoursInMs) {
    // Plus de 2h avant : affichage normal
    webinarState.value = 'normal'
  } else if (timeUntilStart > 0 && timeUntilStart <= twoHoursInMs) {
    // Moins de 2h avant : compte à rebours
    webinarState.value = 'countdown'

    // Calculer le temps restant
    const hours = Math.floor(timeUntilStart / (1000 * 60 * 60))
    const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000)

    // Formater le compte à rebours
    if (hours > 0) {
      countdown.value = `${hours} h ${minutes.toString().padStart(2, '0')} min`
    } else {
      countdown.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  } else if (timeUntilStart <= 0 && timeUntilStart > -nintyMinutesInMs) {
    // En direct (pendant 90 minutes après le début)
    webinarState.value = 'live'
  } else {
    // Après le direct : affichage normal
    webinarState.value = 'normal'
  }
}

/**
 * Gère le clic sur le bouton principal selon l'état
 */
const handleMainButtonClick = () => {
  if (!mainWebinar.value) return

  if (webinarState.value === 'live') {
    // Rediriger vers la page du direct
    router.push(`/consultations-nicolas-delourme/${mainWebinar.value.id}`)
  } else {
    // Ouvrir la modale pour poser une question
    openMainWebinarModal()
  }
}

/**
 * Texte du bouton principal selon l'état
 */
const mainButtonText = computed(() => {
  return webinarState.value === 'live' ? 'Accéder au direct' : 'Posez votre question'
})

/**
 * Gère l'ajout au calendrier
 */
const handleAddToCalendar = () => {
  // TODO: Implémenter l'ajout au calendrier
  console.log('Ajouter au calendrier')
}

/**
 * Gère le partage
 */
const handleShare = () => {
  // TODO: Implémenter le partage
  console.log('Partager')
}

/**
 * Initialisation du composant
 */
let intervalId: number | null = null

onMounted(async () => {
  // Charger les consultations depuis l'API
  await consultationsStore.fetchConsultations()

  // Mise à jour initiale du countdown
  updateWebinarState()

  // Mise à jour toutes les secondes
  intervalId = window.setInterval(updateWebinarState, 1000)
})

onBeforeUnmount(() => {
  // Nettoyage de l'intervalle
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="w-full flex flex-col gap-5 bg-linear-to-b from-consultations-nd to-consultations-nd/90 py-5">
    <!-- Section 1: Banner -->
    <div class="max-w-3xl mx-auto">
      <img src="/images/banner2-t.webp" alt="Banner Consultations Nicolas Delourme" class="w-full h-full object-cover"
        style="clip-path: inset(3px 3px 3px 3px);" />
    </div>

    <!-- Section 2: Section principale - fond bleu foncé -->

    <!-- État de chargement -->
    <div v-if="consultationsStore.isLoading" class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 items-start px-4">
      <!-- Colonne gauche: Skeleton vidéo -->
      <div class="relative">
        <Skeleton class="aspect-video w-full" />
      </div>

      <!-- Colonne droite: Skeleton contenu -->
      <div class="bg-white shadow-lg p-8 flex flex-col justify-center h-full space-y-6">
        <Skeleton class="h-8 w-3/4 mx-auto" />
        <div class="space-y-3">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-2/3" />
        </div>
        <div class="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <Skeleton class="h-10 w-48" />
          <div class="flex gap-2">
            <Skeleton class="h-10 w-10" />
            <Skeleton class="h-10 w-10" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="mainWebinar" class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 items-start px-4">
      <!-- Colonne gauche: Vidéo -->
      <div class="relative cursor-pointer" @click="openMainWebinarModal">
        <div class="relative aspect-video overflow-hidden shadow-lg">
          <img :src="mainWebinarImage" :alt="mainWebinar.name" class="w-full h-full object-cover" />

          <!-- Badge date normal (> 2h avant) -->
          <Badge v-if="webinarState === 'normal'" variant="outline"
            class="absolute top-4 right-4 bg-white shadow-md text-sm">
            {{ mainWebinar.dateFormatted }}
          </Badge>

          <!-- Badge compte à rebours (< 2h avant) -->
          <Badge v-else-if="webinarState === 'countdown'" variant="outline"
            class="absolute top-4 right-4 bg-orange-500 text-white shadow-md text-sm flex items-center gap-2">
            <span class="w-2 h-2 bg-orange-300 rounded-full pulse-animation"></span>
            Dans {{ countdown }}
          </Badge>

          <!-- Badge en direct -->
          <Badge v-else-if="webinarState === 'live'" variant="outline"
            class="absolute top-4 right-4 bg-red-600 text-white shadow-md text-sm flex items-center gap-2 font-bold">
            <span class="w-2 h-2 bg-red-300 rounded-full pulse-animation"></span>
            EN DIRECT
          </Badge>
        </div>
      </div>

      <!-- Colonne droite: Contenu -->
      <div class="bg-white shadow-lg p-8 flex flex-col justify-center h-full">
        <!-- Titre -->
        <h1 class="text-center text-xl font-medium mb-6 text-gray-900 font-roboto"
          v-html="sanitizeHtml(mainWebinar.name)"></h1>

        <!-- Description -->
        <div class="text-gray-700 mb-6 text-base leading-relaxed">
          <p v-html="sanitizeHtml(mainWebinar.shortDescription)"></p>
          <a href="#" @click.prevent="toggleDescription" class="text-blue-600 hover:text-blue-700 underline ml-1">
            voir la suite
          </a>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <!-- Bouton principal : Posez votre question / Accéder au direct -->
          <Button variant="default" color="primary" rounded="sm"
            class="w-full sm:w-auto font-bold uppercase tracking-wide" @click="handleMainButtonClick">
            {{ mainButtonText }}
          </Button>

          <!-- Boutons secondaires -->
          <div class="flex gap-2">
            <!-- Bouton Ajouter au calendrier -->
            <Button variant="outline" color="primary" rounded="sm" class="font-medium" @click="handleAddToCalendar"
              title="Ajouter au calendrier">
              <FontAwesomeIcon v-if="icons.calendarPlus" :icon="icons.calendarPlus" class="h-5 w-5" />
            </Button>

            <!-- Bouton Partager -->
            <Button variant="outline" color="primary" rounded="sm" class="font-medium" @click="handleShare"
              title="Partager">
              <FontAwesomeIcon v-if="icons.shareNodes" :icon="icons.shareNodes" class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>


    <!-- Section 3: Grille de 3 webinaires - fond bleu foncé -->

    <!-- État de chargement pour la grille -->
    <div v-if="consultationsStore.isLoading" class="max-w-6xl mx-auto px-4 space-y-5">
      <div class="grid md:grid-cols-3 gap-5">
        <div v-for="i in 3" :key="`skeleton-grid-${i}`" class="space-y-3">
          <Skeleton class="h-48 w-full rounded-lg" />
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-4 w-1/2" />
        </div>
      </div>
    </div>

    <div v-else-if="gridWebinars.length > 0" class="max-w-6xl mx-auto px-4 space-y-5">

      <!-- Grille de webinaires -->
      <div class="grid md:grid-cols-3 gap-5">
        <WebinarCard v-for="webinar in gridWebinars" :key="webinar.id" :image="getWebinarThumbnail(webinar)"
          :date="webinar.dateFormatted" :title="sanitizeHtml(webinar.name)" :color="getWebinarCategory(webinar)"
          :has-file="!!webinar.fileDownload" @click="openModal(webinar)" />
      </div>
    </div>

    <!-- Modale pour afficher les détails du webinaire -->
    <WebinarModal v-if="selectedWebinar" v-model:open="isModalOpen" :webinar="selectedWebinar" :is-replay="false" />
  </div>
</template>

<style scoped>
.font-roboto {
  font-family: 'Roboto', sans-serif;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/**
 * Animation de clignotement pour les pastilles des badges
 */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

.pulse-animation {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
