<script setup lang="ts">
/**
 * Composant VideoPlayer
 * Player YouTube avec support Live et Replay
 */

import { computed } from 'vue'

/**
 * Props du composant
 */
interface Props {
  /**
   * ID de la vidéo YouTube ou du live
   */
  videoId: string
  /**
   * Mode de lecture: 'live' pour le direct, 'replay' pour la rediffusion
   */
  mode: 'live' | 'replay'
  /**
   * Titre de la vidéo (pour l'accessibilité)
   */
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Consultation Nicolas Delourme'
})

/**
 * URL de l'embed YouTube
 * - Live: utilise /live_stream avec le videoId
 * - Replay: utilise /embed avec le videoId standard
 */
const embedUrl = computed(() => {
  const baseUrl = 'https://www.youtube.com'

  if (props.mode === 'live') {
    // Pour le live, YouTube utilise l'URL /live_stream?channel=ID ou /embed/live_stream?channel=ID
    // Mais si on a directement le videoId du live, on peut utiliser /embed/videoId
    return `${baseUrl}/embed/${props.videoId}?autoplay=0&modestbranding=1&rel=0`
  } else {
    // Pour le replay, URL standard
    return `${baseUrl}/embed/${props.videoId}?autoplay=0&modestbranding=1&rel=0`
  }
})
</script>

<template>
  <div class="relative w-full bg-black rounded-lg overflow-hidden shadow-lg player-container">
    <iframe
      :src="embedUrl"
      :title="title"
      class="absolute inset-0 w-full h-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  </div>
</template>

<style scoped>
.player-container {
  aspect-ratio: 16 / 9;
}
</style>
