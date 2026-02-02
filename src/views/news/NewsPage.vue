<script setup lang="ts">
/**
 * Page Actualites
 * Layout: Hero + Feed (2/3) + Sidebar sticky (1/3)
 * Responsive: Sidebar passe en dessous sur tablet/mobile
 */
import { ref, onMounted, computed } from 'vue'
import type { NewsItem } from '@/types/news.types'
import { NEWS_CONFIG } from '@/types/news.types'
import { newsService } from '@/services/news.service'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import NewsHero from '@/components/news/NewsHero.vue'
import NewsCard from '@/components/news/NewsCard.vue'
import NewsSidebar from '@/components/news/NewsSidebar.vue'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'

const featuredItem = ref<NewsItem | null>(null)
const feedItems = ref<NewsItem[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)

// Pagination state
const currentPage = ref(1)
const totalItems = ref(0)
const pageSize = NEWS_CONFIG.DEFAULT_PAGE_SIZE

/**
 * Check if there are more items to load
 */
const hasMore = computed(() => feedItems.value.length < totalItems.value)

/**
 * Items du feed (sans l'item featured)
 */
const filteredFeedItems = computed(() => {
  if (!featuredItem.value) return feedItems.value
  return feedItems.value.filter((item) => item.id !== featuredItem.value?.id)
})

/**
 * Load more articles (pagination)
 */
const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return

  isLoadingMore.value = true
  try {
    currentPage.value++
    const result = await newsService.fetchNews({
      page: currentPage.value,
      pageSize,
    })
    feedItems.value.push(...result.items)
  } catch (e) {
    // Revert page increment on error
    currentPage.value--
  } finally {
    isLoadingMore.value = false
  }
}

onMounted(async () => {
  try {
    // Charger featured et feed en parallele
    const [featured, feed] = await Promise.all([
      newsService.fetchFeatured(),
      newsService.fetchNews({ pageSize }),
    ])

    featuredItem.value = featured
    feedItems.value = feed.items
    totalItems.value = feed.total
  } catch (e) {
    error.value = 'Impossible de charger les actualites'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-white">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-8">
        <!-- Hero skeleton -->
        <div class="aspect-[16/9] md:aspect-[21/9] rounded-2xl bg-neutral-200 animate-pulse" />

        <!-- Content skeleton -->
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-1 space-y-6">
            <div v-for="i in 4" :key="i" class="flex gap-4 animate-pulse">
              <div class="w-48 h-36 rounded-lg bg-neutral-200" />
              <div class="flex-1 space-y-3">
                <div class="h-5 bg-neutral-200 rounded w-20" />
                <div class="h-6 bg-neutral-200 rounded w-3/4" />
                <div class="h-4 bg-neutral-200 rounded w-full" />
                <div class="h-4 bg-neutral-200 rounded w-1/2" />
              </div>
            </div>
          </div>
          <div class="w-full lg:w-80 space-y-6">
            <div class="h-64 bg-neutral-200 rounded-xl animate-pulse" />
            <div class="h-64 bg-neutral-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <p class="text-lg text-muted-foreground mb-4">{{ error }}</p>
        <Button variant="default" @click="$router.go(0)">
          Reessayer
        </Button>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Hero -->
        <NewsHero v-if="featuredItem" :item="featuredItem" class="mb-10 md:mb-14" />

        <!-- Main Layout: Feed + Sidebar -->
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <!-- Feed (Main Content) -->
          <main class="flex-1 min-w-0">
            <h2 class="font-heading font-bold text-2xl text-secondary mb-6">
              Toutes les actualites
            </h2>

            <div class="flex flex-col gap-6">
              <NewsCard
                v-for="item in filteredFeedItems"
                :key="item.id"
                :item="item"
              />
            </div>

            <!-- Empty state -->
            <p
              v-if="filteredFeedItems.length === 0"
              class="text-center text-muted-foreground py-10"
            >
              Aucune actualite pour le moment
            </p>

            <!-- Load More Button -->
            <div v-if="hasMore" class="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                :disabled="isLoadingMore"
                @click="loadMore"
              >
                <Loader2 v-if="isLoadingMore" class="w-4 h-4 animate-spin mr-2" />
                {{ isLoadingMore ? 'Chargement...' : "Charger plus d'articles" }}
              </Button>
            </div>

            <!-- End of list indicator -->
            <p
              v-else-if="filteredFeedItems.length > 0"
              class="text-center text-muted-foreground text-sm py-8"
            >
              Vous avez vu toutes les actualites
            </p>
          </main>

          <!-- Sidebar -->
          <div class="w-full lg:w-80 shrink-0">
            <div class="lg:sticky lg:top-24">
              <NewsSidebar />
            </div>
          </div>
        </div>
      </template>
      </div>
    </div>
  </DefaultLayout>
</template>
