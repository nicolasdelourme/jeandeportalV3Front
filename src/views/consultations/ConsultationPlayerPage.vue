<script setup lang="ts">
/**
 * Page ConsultationPlayerPage
 * Page player pour les consultations Nicolas Delourme
 * Supporte le mode Live et Replay avec chat YouTube
 */

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import DevControlPanel from '@/components/consultations/player/DevControlPanel.vue'
import VideoPlayer from '@/components/consultations/player/VideoPlayer.vue'
import LiveChat from '@/components/consultations/player/LiveChat.vue'
import InfoPlayer from '@/components/consultations/player/InfoPlayer.vue'
import AbonnementPromo from '@/components/consultations/player/AbonnementPromo.vue'
import DossierPlayer from '@/components/consultations/player/DossierPlayer.vue'
import AnnexesPlayer from '@/components/consultations/player/AnnexesPlayer.vue'
import consultationsData from '@/data/consultations-full.json'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

/**
 * Types
 */
type PlayMode = 'live' | 'replay'
type LayoutMode = 'normal' | 'theater'

interface WebinarDate {
  date: string
  weekDay: string
  numberDay: string
  month: string
  hour: string
  minute: string
  year: string
  iso8601: {
    start: string
    end: string
  }
}

interface Webinar {
  id: number
  typeId: number
  fileId: string
  productId: string | number
  name: string
  description: string
  tag: 'argent' | 'metaux precieux' | 'patrimoine' | 'immobilier'
  participant: string
  date: WebinarDate
  duration: number
  url: string
  groupId: number
  videoId: string
  thumbnail: string
  directGroupId: number
  mailchimpAutomationTriggerGroupId: number
  mailchimpAutomationStart: string
  visibility: string
  timestamp: string
  minutesToLive: number
  dateFormatted: string
  shortDescription: string
  tag_array: string[]
  technicalTag_array: string[]
  image_array: any[]
  fileDownload: string
  userChecked: string
}

/**
 * Router et Route
 */
const route = useRoute()

/**
 * Icones FontAwesome
 */
const icons = computed(() => ({
  xmark: byPrefixAndName.fas?.['xmark'],
}))

/**
 * Etat du composant (DEV mode)
 */
const isDev = ref(true)
const playMode = ref<PlayMode>('replay')
const layoutMode = ref<LayoutMode>('normal')
const withChat = computed(() => playMode.value === 'live')

/**
 * Droits de l'utilisateur (simulation pour dev)
 */
const isSubscriber = ref(false)
const hasPriorityRight = ref(false)
const hasConfidentialRight = ref(false)

/**
 * Charger les donnees du webinaire depuis le JSON base sur l'ID de l'URL
 */
const webinarId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id, 10) : 0
})

const webinar = computed<Webinar | null>(() => {
  const allWebinars: Webinar[] = consultationsData.webinar as Webinar[]
  return allWebinars.find(w => w.id === webinarId.value) || null
})

/**
 * Classes pour le layout
 */
const containerClasses = computed(() => {
  if (layoutMode.value === 'theater') {
    return 'fixed inset-0 z-50 bg-black'
  }
  return 'max-w-6xl mx-auto px-4 py-8'
})

const gridClasses = computed(() => {
  if (layoutMode.value === 'theater') {
    return withChat.value ? 'h-screen grid grid-cols-12 gap-0' : 'h-screen'
  }

  if (withChat.value) {
    return 'grid grid-cols-1 lg:grid-cols-12 gap-6'
  }

  return 'grid grid-cols-1'
})

const playerColClasses = computed(() => {
  if (layoutMode.value === 'theater') {
    return withChat.value ? 'col-span-9' : 'col-span-12'
  }

  if (withChat.value) {
    return 'lg:col-span-8'
  }

  return 'col-span-12'
})

const chatColClasses = computed(() => {
  if (layoutMode.value === 'theater') {
    return 'col-span-3'
  }

  return 'lg:col-span-4'
})


/**
 * Handlers pour les actions InfoPlayer
 */
const handleToggleTheater = () => {
  layoutMode.value = layoutMode.value === 'theater' ? 'normal' : 'theater'
}

const handleExitTheater = () => {
  layoutMode.value = 'normal'
}

const handleSupportChannel = () => {
  // TODO: Implementer le support de la chaine
  console.log('Soutenir la chaine')
}

const handleAskPriorityQuestion = () => {
  // TODO: Implementer la question prioritaire
  console.log('Poser une question prioritaire')
}

const handleAskConfidentialQuestion = () => {
  // TODO: Implementer la question confidentielle
  console.log('Poser une question confidentielle')
}

const handleDiscoverOffers = () => {
  // TODO: Rediriger vers la page des offres
  console.log('Decouvrir les offres')
}

const handleViewDocument = () => {
  // TODO: Ouvrir le document PDF
  console.log('Voir le document')
}

const handlePurchaseDossier = (dossierId: number) => {
  // TODO: Ouvrir le tunnel d'achat pour le dossier
  console.log('Acheter le dossier', dossierId)
}

const handleViewDossier = (dossierId: number) => {
  // TODO: Ouvrir le dossier pour consultation
  console.log('Consulter le dossier', dossierId)
}

/**
 * Detection automatique Live/Replay basee sur la date
 */
const autoDetectMode = () => {
  if (!webinar.value) return

  const now = new Date()
  const webinarDate = new Date(webinar.value.date.date)
  const timeUntilStart = webinarDate.getTime() - now.getTime()
  const nintyMinutesInMs = 90 * 60 * 1000

  if (timeUntilStart <= 0 && timeUntilStart > -nintyMinutesInMs) {
    playMode.value = 'live'
  } else {
    playMode.value = 'replay'
  }
}

/**
 * Gestion de la touche Escape pour quitter le mode theatre
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && layoutMode.value === 'theater') {
    handleExitTheater()
  }
}

/**
 * Lifecycle
 */
onMounted(() => {
  if (!isDev.value) {
    autoDetectMode()
  }
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

/**
 * Watcher pour recharger les donnees si l'ID change
 */
watch(() => route.params.id, () => {
  if (!isDev.value) {
    autoDetectMode()
  }
})
</script>

<template>
  <DefaultLayout :show-navbar="layoutMode !== 'theater'">
    <div :class="containerClasses">
      <!-- Bouton X pour quitter le mode theatre -->
      <Button
        v-if="layoutMode === 'theater'"
        variant="ghost"
        size="icon"
        class="fixed top-4 right-4 z-[60] bg-black/50 hover:bg-black/70 text-white rounded-full"
        @click="handleExitTheater"
      >
        <FontAwesomeIcon v-if="icons.xmark" :icon="icons.xmark" class="h-6 w-6" />
      </Button>

      <!-- Panneau de controle DEV -->
      <DevControlPanel
        v-if="isDev && layoutMode !== 'theater'"
        v-model:mode="playMode"
        v-model:layout="layoutMode"
        v-model:is-subscriber="isSubscriber"
        v-model:has-priority-right="hasPriorityRight"
        v-model:has-confidential-right="hasConfidentialRight"
      />

      <!-- Contenu principal -->
      <div v-if="webinar" class="space-y-6">
      <!-- Titre du webinaire -->
      <div v-if="layoutMode !== 'theater'">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ webinar.name }}
        </h1>
      </div>

      <!-- Grille Player + Chat -->
      <div :class="gridClasses" class="player-chat-grid">
        <!-- Colonne Player -->
        <div :class="playerColClasses">
          <VideoPlayer :video-id="webinar.videoId" :mode="playMode" :title="webinar.name" />
        </div>

        <!-- Colonne Chat -->
        <div v-if="withChat" :class="chatColClasses">
          <LiveChat :video-id="webinar.videoId" :mode="playMode" />
        </div>
      </div>

      <!-- InfoPlayer (Info + CTA) -->
      <div v-if="layoutMode !== 'theater'">
        <InfoPlayer
          :title="webinar.name"
          :tag="webinar.tag"
          :technical-tag-array="webinar.technicalTag_array"
          :date-formatted="webinar.dateFormatted"
          :duration="webinar.duration"
          :participant="webinar.participant"
          :description="webinar.description"
          :mode="playMode"
          :is-subscriber="isSubscriber"
          :has-priority-right="hasPriorityRight"
          :has-confidential-right="hasConfidentialRight"
          @toggle-theater="handleToggleTheater"
          @support-channel="handleSupportChannel"
          @ask-priority-question="handleAskPriorityQuestion"
          @ask-confidential-question="handleAskConfidentialQuestion"
        />
      </div>

      <!-- AbonnementPromo (visible uniquement si non abonne) -->
      <div v-if="layoutMode !== 'theater' && !isSubscriber">
        <AbonnementPromo
          :technical-tag-array="webinar.technicalTag_array"
          @discover-offers="handleDiscoverOffers"
        />
      </div>

      <!-- DossierPlayer (visible uniquement en Replay) -->
      <div v-if="layoutMode !== 'theater' && playMode === 'replay'">
        <DossierPlayer
          :file-download="webinar.fileDownload"
          :thumbnail="webinar.thumbnail"
          :technical-tag-array="webinar.technicalTag_array"
          @view-document="handleViewDocument"
        />
      </div>

      <!-- AnnexesPlayer (visible uniquement en Replay) -->
      <div v-if="layoutMode !== 'theater' && playMode === 'replay'">
        <AnnexesPlayer
          :is-subscriber="isSubscriber"
          :technical-tag-array="webinar.technicalTag_array"
          :webinar-id="webinar.id"
          :mode="playMode"
          @discover-offers="handleDiscoverOffers"
          @purchase-dossier="handlePurchaseDossier"
          @view-dossier="handleViewDossier"
        />
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Consultation non trouvee
      </h2>
      <p class="text-gray-600 mb-8">
        La consultation avec l'ID {{ webinarId }} n'existe pas.
      </p>
      <router-link to="/consultations-nicolas-delourme" class="text-blue-600 hover:text-blue-700 underline">
        Retour aux consultations
      </router-link>
    </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.fixed {
  transition: all 0.3s ease-in-out;
}

/* Match chat height to player height */
.player-chat-grid {
  display: grid;
  grid-auto-rows: 1fr;
}

.player-chat-grid>div {
  min-height: 0;
}

/* Force LiveChat to fill parent height */
.player-chat-grid .lg\\:col-span-4>* {
  height: 100%;
}
</style>
