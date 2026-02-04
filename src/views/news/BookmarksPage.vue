<script setup lang="ts">
/**
 * Page Favoris - Liste des articles bookmarkés
 * Route: /actualites/favoris (auth requise)
 */
import { ref, onMounted, computed } from 'vue'
import type { NewsItem } from '@/types/news.types'
import { newsService } from '@/services/news.service'
import { useBookmarkStore } from '@/stores/bookmark.store'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import NewsCatalogCard from '@/components/news/NewsCatalogCard.vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const bookmarkStore = useBookmarkStore()

const items = ref<NewsItem[]>([])
const isLoading = ref(true)

const icons = computed(() => ({
  bookmark: byPrefixAndName.fas?.['bookmark'],
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
}))

const bookmarkCount = computed(() => items.value.length)

onMounted(async () => {
  if (!bookmarkStore.isInitialized) {
    await bookmarkStore.initialize()
  }

  const slugs = Array.from(bookmarkStore.slugs)

  if (slugs.length === 0) {
    isLoading.value = false
    return
  }

  try {
    const results = await Promise.allSettled(
      slugs.map((slug) => newsService.fetchNewsItem(slug))
    )
    items.value = results
      .filter((r): r is PromiseFulfilledResult<NewsItem> => r.status === 'fulfilled')
      .map((r) => r.value)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-white">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <!-- Back button -->
        <Button
          variant="ghost"
          size="sm"
          class="mb-6 -ml-2 text-muted-foreground hover:text-secondary"
          as="RouterLink"
          to="/actualites"
        >
          <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="w-4 h-4 mr-2" />
          Retour aux actualités
        </Button>

        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <FontAwesomeIcon v-if="icons.bookmark" :icon="icons.bookmark" class="w-6 h-6 text-primary" />
            <h1 class="font-heading font-bold text-3xl md:text-4xl text-secondary">
              Mes favoris
            </h1>
          </div>
          <p v-if="!isLoading" class="text-muted-foreground">
            {{ bookmarkCount }} article{{ bookmarkCount > 1 ? 's' : '' }} sauvegardé{{ bookmarkCount > 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="aspect-video bg-neutral-200 rounded-lg mb-3"></div>
            <div class="h-5 bg-neutral-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="items.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <FontAwesomeIcon v-if="icons.bookmark" :icon="icons.bookmark" class="w-12 h-12 text-neutral-300 mb-4" />
          <h2 class="font-heading font-bold text-xl text-secondary mb-2">Aucun favori</h2>
          <p class="text-muted-foreground mb-6 max-w-md">
            Sauvegardez des articles en cliquant sur le bouton favori pour les retrouver ici.
          </p>
          <Button as="RouterLink" to="/actualites">
            Parcourir les actualités
          </Button>
        </div>

        <!-- Articles grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewsCatalogCard
            v-for="article in items"
            :key="article.id"
            :item="article"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
