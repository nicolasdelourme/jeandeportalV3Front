<script setup lang="ts">
/**
 * Composant NewsCardCompact
 * Petite card pour les listes sidebar (En Continu, Les Plus Lus)
 */
import { computed } from 'vue'
import type { NewsItem } from '@/types/news.types'
import NewsBadge from './NewsBadge.vue'

const props = withDefaults(defineProps<{
  item: NewsItem
  /**
   * Numéro de classement (pour "Les Plus Lus")
   */
  rank?: number
  /**
   * Afficher le point jaune "nouveau" (pour "En Continu")
   */
  showNewDot?: boolean
}>(), {
  rank: undefined,
  showNewDot: false,
})

/**
 * URL de la page détail
 */
const detailUrl = computed(() => `/actualites/${props.item.slug}`)

/**
 * Est-ce une actualité récente (< 24h) ?
 */
const isNew = computed(() => {
  const now = new Date()
  const diff = now.getTime() - props.item.publishedAt.getTime()
  const hours = diff / (1000 * 60 * 60)
  return hours < 24
})

/**
 * Date formatée relative
 */
const relativeDate = computed(() => {
  const now = new Date()
  const diff = now.getTime() - props.item.publishedAt.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return "À l'instant"
  if (hours < 24) return `Il y a ${hours}h`
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(props.item.publishedAt)
})
</script>

<template>
  <RouterLink
    :to="detailUrl"
    class="group flex gap-3 p-2 -mx-2 rounded-lg hover:bg-secondary/5 transition-colors"
  >
    <!-- Rank number (for trending) -->
    <div
      v-if="rank !== undefined"
      class="w-8 h-8 shrink-0 flex items-center justify-center font-heading font-bold text-xl text-secondary/30"
    >
      {{ rank }}
    </div>

    <!-- Thumbnail -->
    <div class="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-neutral-100">
      <img
        :src="item.thumbnail"
        :alt="item.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 flex flex-col justify-center gap-1">
      <!-- Title with optional new dot -->
      <div class="flex items-start gap-1.5">
        <span
          v-if="showNewDot && isNew"
          class="w-2 h-2 mt-1.5 shrink-0 rounded-full bg-primary"
          aria-label="Nouveau"
        />
        <h4 class="font-medium text-sm leading-tight text-secondary line-clamp-2 group-hover:text-primary transition-colors">
          {{ item.title }}
        </h4>
      </div>

      <!-- Meta -->
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <NewsBadge :type="item.type" class="!text-[10px] !px-1.5 !py-0.5" />
        <span>{{ relativeDate }}</span>
      </div>
    </div>
  </RouterLink>
</template>
