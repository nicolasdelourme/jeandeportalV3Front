<script setup lang="ts">
/**
 * Composant LiveChat
 * Chat YouTube Live intégré
 */

import { computed } from 'vue'

/**
 * Props du composant
 */
interface Props {
  /**
   * ID de la vidéo YouTube live
   */
  videoId: string
  /**
   * Mode de lecture
   */
  mode: 'live' | 'replay'
}

const props = defineProps<Props>()

/**
 * URL de l'embed du chat YouTube
 * - Live: utilise /live_chat avec le videoId
 * - Replay: le chat replay n'est pas toujours disponible
 */
const chatUrl = computed(() => {
  if (props.mode === 'live') {
    return `https://www.youtube.com/live_chat?v=${props.videoId}&embed_domain=${window.location.hostname}`
  } else {
    // Pour le replay, on peut tenter d'afficher le chat archivé
    // Mais YouTube ne le rend pas toujours disponible en embed
    return `https://www.youtube.com/live_chat?v=${props.videoId}&embed_domain=${window.location.hostname}`
  }
})

/**
 * Message si le chat n'est pas disponible en replay
 */
const isChatAvailable = computed(() => {
  // En live, le chat est toujours disponible
  // En replay, on l'affiche quand même et YouTube gérera la disponibilité
  return true
})
</script>

<template>
  <div class="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
    <div v-if="isChatAvailable" class="w-full h-full">
      <iframe
        :src="chatUrl"
        title="Chat YouTube Live"
        class="w-full h-full"
        frameborder="0"
      />
    </div>
    <div v-else class="flex items-center justify-center h-full p-8">
      <div class="text-center text-gray-600">
        <p class="text-lg font-semibold mb-2">Chat non disponible</p>
        <p class="text-sm">Le chat n'est pas disponible pour cette rediffusion.</p>
      </div>
    </div>
  </div>
</template>
