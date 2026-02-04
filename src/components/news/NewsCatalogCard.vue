<script setup lang="ts">
/**
 * NewsCatalogCard
 * Card verticale pour grille catalogue
 * Design aligné avec Shop - border/shadow/hover gradient
 */
import { computed } from 'vue'
import type { NewsItem } from '@/types/news.types'
import { Card } from '@/components/ui/card'
import NewsBadge from '@/components/shared/NewsBadge.vue'
import BookmarkButton from '@/components/shared/BookmarkButton.vue'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = withDefaults(defineProps<{
  item: NewsItem
  featured?: boolean
  horizontal?: boolean
}>(), {
  featured: false,
  horizontal: false,
})

const icons = computed(() => ({
  play: byPrefixAndName.fas?.['play'],
  clock: byPrefixAndName.far?.['clock'],
}))

const detailUrl = computed(() => `/actualites/${props.item.slug}`)

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(props.item.publishedAt)
})

const formattedDuration = computed(() => {
  if (!props.item.duration) return null
  const minutes = Math.floor(props.item.duration / 60)
  const seconds = props.item.duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const readTimeText = computed(() => {
  if (!props.item.readTime) return null
  return `${props.item.readTime} min`
})
</script>

<template>
  <RouterLink :to="detailUrl" class="block h-full">
    <Card :class="[
      'catalog-card gap-2 p-2 group relative border border-secondary hover:shadow-md rounded-lg overflow-hidden transition-all duration-500 h-full',
      horizontal ? 'flex flex-col sm:flex-row' : 'flex flex-col'
    ]">
      <!-- Image section -->
      <div :class="['relative', horizontal ? 'featured-image sm:w-[45%] sm:shrink-0 sm:self-stretch' : '']">
        <!-- Horizontal layout: free height, fills container on sm+ -->
        <img
          v-if="horizontal"
          :src="item.thumbnail"
          :alt="item.title"
          class="w-full h-full object-cover rounded-lg"
        />
        <!-- Standard layout: aspect ratio constrained -->
        <AspectRatio v-else :ratio="16/9">
          <img
            :src="item.thumbnail"
            :alt="item.title"
            class="w-full h-full object-cover"
          />
        </AspectRatio>

        <!-- Video overlay -->
        <div
          v-if="item.type === 'video'"
          class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <FontAwesomeIcon
              v-if="icons.play"
              :icon="icons.play"
              class="w-5 h-5 text-primary-foreground ml-0.5"
            />
          </div>
        </div>

        <!-- Duration badge -->
        <Badge
          v-if="formattedDuration"
          class="absolute bottom-2 right-2 bg-black/80 text-white border-0 text-xs"
        >
          {{ formattedDuration }}
        </Badge>

        <!-- Type badge - top right -->
        <div class="absolute top-3 right-3">
          <NewsBadge :type="item.type" class="shadow-sm" />
        </div>

        <!-- Bookmark button - top left -->
        <div class="absolute top-3 left-3">
          <BookmarkButton :slug="item.slug" variant="icon-only" />
        </div>
      </div>

      <!-- Content section -->
      <div :class="['flex flex-col flex-1', horizontal ? 'sm:py-1 sm:pr-1' : '']">
        <!-- Title -->
        <h3 :class="[
          'font-heading font-bold leading-snug text-secondary mb-2 group-hover:text-secondary-foreground transition-colors duration-500',
          featured ? 'text-xl sm:text-2xl line-clamp-3' : 'text-lg line-clamp-2'
        ]">
          {{ item.title }}
        </h3>

        <!-- Excerpt -->
        <p
          v-if="featured || item.type === 'article'"
          :class="[
            'text-sm text-muted-foreground leading-relaxed mb-3 group-hover:text-white/80 transition-colors duration-500',
            featured ? 'line-clamp-3 sm:line-clamp-4' : 'line-clamp-2'
          ]"
        >
          {{ item.excerpt }}
        </p>

        <!-- Meta row - pushed to bottom -->
        <div class="flex items-center gap-3 mt-auto text-xs text-muted-foreground group-hover:text-white/60 transition-colors duration-500">
          <time class="font-medium">{{ formattedDate }}</time>
          <span v-if="readTimeText" class="flex items-center gap-1">
            <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="w-3 h-3" />
            {{ readTimeText }}
          </span>
          <span v-if="item.author">
            {{ item.author }}
          </span>
        </div>
      </div>
    </Card>
  </RouterLink>
</template>

<style scoped>
.catalog-card {
  position: relative;
}

/* Gradient hover overlay */
.catalog-card::before {
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
  border-radius: inherit;
}

.catalog-card:hover::before {
  opacity: 1;
}

/* Ensure content stays above overlay */
.catalog-card > :deep(*) {
  position: relative;
  z-index: 1;
}

/* Featured: constrain image height on mobile so it doesn't dominate */
.featured-image {
  max-height: 240px;
  overflow: hidden;
  border-radius: var(--radius);
}

@media (min-width: 640px) {
  .featured-image {
    max-height: none;
  }
}
</style>
