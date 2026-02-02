<script setup lang="ts">
/**
 * Composant NewsCard
 * Card horizontale pour le feed principal
 * Thumbnail gauche (4:3), contenu droite
 * Hover: shadow increase + animated gradient fade-in (comme Shop)
 */
import { computed } from 'vue'
import type { NewsItem } from '@/types/news.types'
import NewsBadge from '@/components/shared/NewsBadge.vue'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  item: NewsItem
}>()

const icons = computed(() => ({
  play: byPrefixAndName.fas?.['play'],
  clock: byPrefixAndName.far?.['clock'],
}))

/**
 * URL de la page détail
 */
const detailUrl = computed(() => `/actualites/${props.item.slug}`)

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
 * Durée vidéo formatée (mm:ss)
 */
const formattedDuration = computed(() => {
  if (!props.item.duration) return null
  const minutes = Math.floor(props.item.duration / 60)
  const seconds = props.item.duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

/**
 * Temps de lecture
 */
const readTimeText = computed(() => {
  if (!props.item.readTime) return null
  return `${props.item.readTime} min de lecture`
})
</script>

<template>
  <RouterLink :to="detailUrl" class="block">
    <Card
      class="news-card group relative border border-secondary hover:shadow-md rounded-lg overflow-hidden transition-all duration-500 py-0 gap-0"
    >
    <div class="flex flex-col sm:flex-row">
      <!-- Thumbnail -->
      <div class="relative w-full aspect-video sm:aspect-auto sm:w-48 md:w-56 lg:w-64 shrink-0 overflow-hidden">
        <img
          :src="item.thumbnail"
          :alt="item.title"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <!-- Play button for videos -->
        <div
          v-if="item.type === 'video'"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center ring-4 ring-primary/30 transition-transform duration-300 group-hover:scale-110">
            <FontAwesomeIcon
              v-if="icons.play"
              :icon="icons.play"
              class="w-4 h-4 text-primary-foreground ml-0.5"
            />
          </div>
        </div>

        <!-- Duration badge for videos -->
        <Badge
          v-if="formattedDuration"
          variant="secondary"
          class="absolute bottom-2 right-2 rounded-lg"
        >
          {{ formattedDuration }}
        </Badge>
      </div>

      <!-- Content -->
      <div class="flex flex-col justify-between p-4 flex-1 min-w-0">
        <div class="flex flex-col gap-2">
          <!-- Badge -->
          <NewsBadge :type="item.type" />

          <!-- Title -->
          <h3 class="font-heading font-bold text-lg md:text-xl leading-tight text-secondary line-clamp-2 group-hover:text-primary transition-colors duration-500">
            {{ item.title }}
          </h3>

          <!-- Excerpt -->
          <p class="text-muted-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-white/90 transition-colors duration-500">
            {{ item.excerpt }}
          </p>
        </div>

        <!-- Meta -->
        <div class="flex items-center gap-3 mt-3 text-xs text-muted-foreground group-hover:text-white/70 transition-colors duration-500">
          <span>{{ formattedDate }}</span>
          <span v-if="readTimeText" class="flex items-center gap-1">
            <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="w-3 h-3" />
            {{ readTimeText }}
          </span>
        </div>
      </div>
    </div>
    </Card>
  </RouterLink>
</template>

<style scoped>
.news-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    145deg,
    var(--secondary) 31%,
    color-mix(in srgb, var(--secondary) 75%, transparent) 95%
  );
  opacity: 0;
  transition: opacity 500ms ease;
  pointer-events: none;
  z-index: 0;
}

.news-card:hover::before {
  opacity: 1;
}

.news-card > :deep(*) {
  position: relative;
  z-index: 1;
}
</style>
