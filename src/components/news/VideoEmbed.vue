<script setup lang="ts">
/**
 * Composant VideoEmbed
 * Embed YouTube responsive (16:9)
 * Lazy loading avec poster image
 */
import { ref, computed } from 'vue'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  youtubeId: string
  title?: string
}>()

const isLoaded = ref(false)

const icons = computed(() => ({
  play: byPrefixAndName.fas?.['play'],
}))

/**
 * Thumbnail YouTube haute qualité
 */
const thumbnailUrl = computed(() => {
  return `https://img.youtube.com/vi/${props.youtubeId}/maxresdefault.jpg`
})

/**
 * URL d'embed YouTube
 */
const embedUrl = computed(() => {
  return `https://www.youtube.com/embed/${props.youtubeId}?autoplay=1&rel=0`
})

/**
 * Charger l'iframe au clic
 */
const handleLoad = () => {
  isLoaded.value = true
}
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-lg bg-neutral-900">
    <AspectRatio :ratio="16/9">
      <!-- Poster/Preview -->
      <template v-if="!isLoaded">
        <button
          type="button"
          class="absolute inset-0 w-full h-full cursor-pointer group"
          :aria-label="`Lire la vidéo : ${title || 'Vidéo YouTube'}`"
          @click="handleLoad"
        >
          <!-- Thumbnail -->
          <img
            :src="thumbnailUrl"
            :alt="title || 'Aperçu vidéo'"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <!-- Overlay -->
          <div class="absolute inset-0 bg-secondary/30 transition-colors group-hover:bg-secondary/20" />

          <!-- Play Button -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/90 flex items-center justify-center ring-8 ring-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:ring-primary/50"
            >
              <FontAwesomeIcon
                v-if="icons.play"
                :icon="icons.play"
                class="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1"
              />
            </div>
          </div>
        </button>
      </template>

      <!-- YouTube Iframe -->
      <iframe
        v-else
        :src="embedUrl"
        :title="title || 'Vidéo YouTube'"
        class="absolute inset-0 w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </AspectRatio>
  </div>
</template>
