<script setup lang="ts">
/**
 * Composant NewsHero
 * Hero section pour l'actualité à la une
 * Full-width, 16:9, gradient overlay, contenu positionné en bas
 */
import { computed } from 'vue'
import type { NewsItem } from '@/types/news.types'
import NewsBadge from '@/components/shared/NewsBadge.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  item: NewsItem
}>()

const icons = computed(() => ({
  play: byPrefixAndName.fas?.['play'],
}))

/**
 * Date formatée en français
 */
const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(props.item.publishedAt)
})

/**
 * URL de la page détail
 */
const detailUrl = computed(() => `/actualites/${props.item.slug}`)
</script>

<template>
  <RouterLink :to="detailUrl" class="block">
    <article
      class="group relative w-full overflow-hidden rounded-lg"
    >
    <!-- Background Image (16:9) -->
    <div class="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
      <img
        :src="item.thumbnail"
        :alt="item.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>

    <!-- Gradient Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/50 to-transparent"
    />

    <!-- Play Button (for videos) -->
    <div
      v-if="item.type === 'video'"
      class="absolute inset-0 flex items-center justify-center"
    >
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

    <!-- Content -->
    <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
      <div class="max-w-3xl flex flex-col gap-3 md:gap-4">
        <!-- Badge -->
        <NewsBadge :type="item.type" />

        <!-- Title -->
        <h1 class="font-heading font-bold text-2xl md:text-4xl lg:text-5xl text-white leading-tight">
          {{ item.title }}
        </h1>

        <!-- Excerpt (hidden on small screens) -->
        <p class="hidden md:block text-neutral-200 text-lg leading-relaxed line-clamp-2">
          {{ item.excerpt }}
        </p>

        <!-- Date -->
        <p class="text-neutral-400 text-sm md:text-base">
          {{ formattedDate }}
        </p>
      </div>
    </div>
    </article>
  </RouterLink>
</template>
