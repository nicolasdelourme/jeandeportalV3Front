<script setup lang="ts">
/**
 * Composant InfoPlayer
 * Affiche les informations du webinaire et les CTA pour poser des questions (Live uniquement)
 */

import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

/**
 * Icones FontAwesome accessibles de maniere sure
 */
const icons = computed(() => ({
  calendar: byPrefixAndName.fas?.['calendar'],
  clock: byPrefixAndName.fas?.['clock'],
  user: byPrefixAndName.fas?.['user'],
  expand: byPrefixAndName.fas?.['expand'],
  heart: byPrefixAndName.fas?.['heart'],
  comments: byPrefixAndName.fas?.['comments'],
  lock: byPrefixAndName.fas?.['lock'],
}))

/**
 * Props du composant
 */
interface Props {
  /**
   * Titre du webinaire
   */
  title: string
  /**
   * Tag (ex: "métaux précieux", "argent")
   */
  tag: string
  /**
   * Technical tag array (ex: ["metauxprecieux"])
   */
  technicalTagArray: string[]
  /**
   * Date formatee (ex: "27 novembre 2025 a 18h30")
   */
  dateFormatted: string
  /**
   * Duree en minutes
   */
  duration: number
  /**
   * Nom du participant
   */
  participant: string
  /**
   * Description complete
   */
  description: string
  /**
   * Mode de lecture
   */
  mode: 'live' | 'replay'
  /**
   * Statut abonne
   */
  isSubscriber?: boolean
  /**
   * Droit question prioritaire
   */
  hasPriorityRight?: boolean
  /**
   * Droit question confidentielle
   */
  hasConfidentialRight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubscriber: false,
  hasPriorityRight: false,
  hasConfidentialRight: false
})

/**
 * Emits du composant
 */
const emit = defineEmits<{
  'toggle-theater': []
  'support-channel': []
  'ask-priority-question': []
  'ask-confidential-question': []
}>()

/**
 * Classe Tailwind pour la couleur du badge selon technicalTag
 */
const categoryColor = computed(() => {
  const technicalTag = props.technicalTagArray[0] || ''
  return `bg-consultations-nd-${technicalTag} text-white`
})

/**
 * Label du badge avec premiere lettre en majuscule pour chaque mot
 */
const categoryLabel = computed(() => {
  return props.tag
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

/**
 * Afficher le bloc CTA uniquement en mode Live
 */
const showCTA = computed(() => props.mode === 'live')
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
    <!-- Bloc Info (col-8 en Live, col-12 en Replay) -->
    <div :class="showCTA ? 'lg:col-span-8' : 'lg:col-span-12'" class="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <!-- Ligne 1: Badge categorie + Date + Duree + Badge Direct + Boutons a droite -->
      <div class="flex justify-between gap-4">
        <!-- Gauche: Badge + Date + Duree + Direct -->
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Badge categorie -->
            <Badge :class="categoryColor" class="text-sm font-semibold uppercase">
              {{ categoryLabel }}
            </Badge>

            <!-- Date -->
            <div class="flex items-center gap-2 text-gray-700">
              <FontAwesomeIcon v-if="icons.calendar" :icon="icons.calendar" class="h-4 w-4 text-gray-500" />
              <span class="text-sm">{{ dateFormatted }}</span>
            </div>

            <!-- Duree -->
            <div class="flex items-center gap-2 text-gray-700">
              <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="h-4 w-4 text-gray-500" />
              <span class="text-sm">{{ duration }} min</span>
            </div>

            <!-- Badge EN DIRECT (mode live uniquement) -->
            <Badge v-if="mode === 'live'" variant="outline"
              class="bg-red-600 text-white shadow-md text-sm flex items-center gap-2 font-bold">
              <span class="w-2 h-2 bg-red-300 rounded-full pulse-animation"></span>
              EN DIRECT
            </Badge>
          </div>
          <!-- Ligne 2: Participant -->
          <div class="flex items-center gap-2 text-gray-900">
            <FontAwesomeIcon v-if="icons.user" :icon="icons.user" class="h-4 w-4 text-gray-500" />
            <span class="text-sm">{{ participant }}</span>
          </div>
        </div>

        <!-- Droite: Boutons empiles -->
        <div class="flex flex-col gap-2">
          <Button variant="default" size="sm" class="w-full min-w-[200px] bg-consultations-nd hover:bg-consultations-nd/90" @click="emit('toggle-theater')">
            <FontAwesomeIcon v-if="icons.expand" :icon="icons.expand" class="h-4 w-4 mr-2" />
            MODE THEATRE
          </Button>
          <Button variant="ghost" color="primary" size="sm" class="w-full min-w-[200px]" @click="emit('support-channel')">
            <FontAwesomeIcon v-if="icons.heart" :icon="icons.heart" class="h-4 w-4 mr-2" />
            SOUTENIR LA CHAINE
          </Button>
        </div>
      </div>

      <!-- Separateur -->
      <hr class="border-gray-200" />

      <!-- Description -->
      <div class="prose max-w-none">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
        <div class="text-gray-700 leading-relaxed text-sm" v-html="description" />
      </div>
    </div>

    <!-- Bloc CTA (col-4, visible uniquement en Live) -->
    <div v-if="showCTA" class="lg:col-span-4 bg-gray-50 rounded-lg shadow-lg p-6 space-y-4">
      <!-- Titre -->
      <div class="flex justify-center items-center gap-2 mb-4">
        <FontAwesomeIcon v-if="icons.comments" :icon="icons.comments" class="h-5 w-5 text-gray-700" />
        <h3 class="text-lg font-semibold text-gray-900">Questions live</h3>
      </div>

      <!-- Question prioritaire -->
      <div class="space-y-2">
        <h4 class="text-sm font-semibold text-gray-800">Question prioritaire</h4>
        <p class="text-xs text-gray-600">Votre question sera mise en avant pendant le direct</p>
        <Button :variant="hasPriorityRight ? 'default' : 'default'"
          :class="hasPriorityRight ? 'bg-green-600 hover:bg-green-700' : ''" class="w-full font-semibold"
          @click="emit('ask-priority-question')">
          {{ hasPriorityRight ? 'POSER VOTRE QUESTION' : 'POSER VOTRE QUESTION' }}
        </Button>
      </div>

      <!-- Question confidentielle -->
      <div class="space-y-2">
        <h4 class="text-sm font-semibold text-gray-800">Question confidentielle</h4>
        <p class="text-xs text-gray-600">Question privee reservee aux abonnes</p>
        <Button
          :variant="hasConfidentialRight ? 'default' : 'outline'"
          :class="{
            'bg-green-600 hover:bg-green-700': hasConfidentialRight,
            'border-green-600 text-green-600': isSubscriber && !hasConfidentialRight
          }"
          :disabled="!hasConfidentialRight"
          class="w-full font-semibold"
          @click="emit('ask-confidential-question')"
        >
          {{ hasConfidentialRight ? 'POSER VOTRE QUESTION' : 'RESERVE AUX ABONNES' }}
        </Button>
      </div>

      <!-- Footer paiement securise -->
      <div class="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
        <FontAwesomeIcon v-if="icons.lock" :icon="icons.lock" class="h-4 w-4 text-gray-600" />
        <span class="text-xs text-gray-600">Paiement securise</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * Animation de clignotement pour le badge EN DIRECT
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
