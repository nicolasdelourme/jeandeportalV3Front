<script setup lang="ts">
/**
 * NewsCatalogPage - Catalogue des Actualités
 * Design éditorial/presse : fonctionnel, dense, filtrable
 *
 * Features:
 * - Filtres par type (Tout, Articles, Vidéos, Brèves)
 * - Grille responsive de cards
 * - Pagination "Charger plus"
 * - Compteur de résultats
 */
import { ref, computed, watch, onMounted } from 'vue'
import type { NewsItem, NewsType } from '@/types/news.types'
import { NEWS_CONFIG, NEWS_TYPE_LABELS } from '@/types/news.types'
import { newsService } from '@/services/news.service'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import NewsCatalogCard from '@/components/news/NewsCatalogCard.vue'
import NewsCatalogCardSkeleton from '@/components/shared/NewsCatalogCardSkeleton.vue'
import NewsEmptyState from '@/components/shared/NewsEmptyState.vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { Loader2 } from 'lucide-vue-next'

// Filter state
type FilterType = 'all' | NewsType
const activeFilter = ref<FilterType>('all')

// Data state
const allItems = ref<NewsItem[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)

// Pagination
const currentPage = ref(1)
const totalItems = ref(0)
const pageSize = NEWS_CONFIG.DEFAULT_PAGE_SIZE

// Icons
const icons = computed(() => ({
  fileLines: byPrefixAndName.fas?.['file-lines'],
  video: byPrefixAndName.fas?.['video'],
  bolt: byPrefixAndName.fas?.['bolt'],
  newspaper: byPrefixAndName.far?.['newspaper'],
}))

// Filters configuration
const filters: { value: FilterType; label: string; icon: keyof typeof icons.value }[] = [
  { value: 'all', label: 'Tout', icon: 'newspaper' },
  { value: 'article', label: 'Articles', icon: 'fileLines' },
  { value: 'video', label: 'Vidéos', icon: 'video' },
  { value: 'brief', label: 'Brèves', icon: 'bolt' },
]

/**
 * Filtered items based on active filter
 */
const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return allItems.value
  return allItems.value.filter(item => item.type === activeFilter.value)
})

/**
 * Count per type for badge display
 */
const countByType = computed(() => {
  const counts: Record<FilterType, number> = {
    all: allItems.value.length,
    article: 0,
    video: 0,
    brief: 0,
  }
  allItems.value.forEach(item => {
    counts[item.type]++
  })
  return counts
})

/**
 * Check if there are more items to load
 */
const hasMore = computed(() => allItems.value.length < totalItems.value)

/**
 * Load initial data
 */
const loadData = async () => {
  isLoading.value = true
  error.value = null
  currentPage.value = 1

  try {
    const result = await newsService.fetchNews({ pageSize: pageSize * 2 }) // Load more initially
    allItems.value = result.items
    totalItems.value = result.total
  } catch (e) {
    error.value = 'Impossible de charger les actualités'
  } finally {
    isLoading.value = false
  }
}

/**
 * Load more items
 */
const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return

  isLoadingMore.value = true
  try {
    currentPage.value++
    const result = await newsService.fetchNews({
      page: currentPage.value,
      pageSize: pageSize * 2,
    })
    allItems.value.push(...result.items)
  } catch (e) {
    currentPage.value--
  } finally {
    isLoadingMore.value = false
  }
}

/**
 * Handle filter change
 */
const onFilterChange = (value: string | number) => {
  activeFilter.value = String(value) as FilterType
}

onMounted(loadData)
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-neutral-50">
      <!-- Header -->
      <header class="bg-secondary border-b border-neutral-200">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          <!-- Title row -->
          <div class="py-8 md:py-12">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 class="font-heading font-bold text-4xl md:text-5xl text-primary">
                  Toutes nos publications
                </h1>
              </div>

              <!-- Results count -->
              <p class="text-secondary-foreground">
                <span class="font-semibold text-primary">{{ filteredItems.length }}</span>
                {{ filteredItems.length > 1 ? 'publications' : 'publication' }}
                <span v-if="activeFilter !== 'all'" class="text-primary">
                  · {{ NEWS_TYPE_LABELS[activeFilter as NewsType] }}
                </span>
              </p>
            </div>
          </div>

          <!-- Filters -->
          <div class="pb-4">
            <Tabs :default-value="activeFilter" @update:model-value="onFilterChange">
              <TabsList class="h-auto p-1 bg-white rounded-lg">
                <TabsTrigger
                  v-for="filter in filters"
                  :key="filter.value"
                  :value="filter.value"
                  class="relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:cursor-pointer
                         data-[state=active]:bg-primary data-[state=active]:text-secondary data-[state=active]:shadow-sm
                         data-[state=inactive]:text-secondary data-[state=inactive]:hover:bg-primary/20"
                >
                  <span class="flex items-center gap-2">
                    <FontAwesomeIcon
                      v-if="icons[filter.icon]"
                      :icon="icons[filter.icon]"
                      class="w-3.5 h-3.5"
                    />
                    {{ filter.label }}
                    <span
                      class="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-neutral-200/80
                             data-[state=active]:bg-primary/10 data-[state=active]:text-secondary"
                    >
                      {{ countByType[filter.value] }}
                    </span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="max-w-7xl mx-auto px-4 md:p-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-fr">
          <NewsCatalogCardSkeleton v-for="i in 6" :key="i" />
        </div>

        <!-- Error State -->
        <NewsEmptyState
          v-else-if="error"
          type="error"
          :description="error"
          show-action
          action-label="Réessayer"
          @action="loadData"
        />

        <!-- Grid -->
        <template v-else>
          <!-- Empty state -->
          <NewsEmptyState
            v-if="filteredItems.length === 0"
            :type="activeFilter === 'all' ? 'catalog' : 'filter'"
          />

          <!-- Cards grid -->
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-fr"
          >
            <NewsCatalogCard
              v-for="item in filteredItems"
              :key="item.id"
              :item="item"
            />
          </div>

          <!-- Load More -->
          <div v-if="hasMore && activeFilter === 'all'" class="flex justify-center mt-12">
            <Button
              variant="outline"
              size="lg"
              rounded="lg"
              :disabled="isLoadingMore"
              class="px-8 text-secondary hover:text-secondary"
              @click="loadMore"
            >
              <Loader2 v-if="isLoadingMore" class="w-4 h-4 animate-spin mr-2" />
              {{ isLoadingMore ? 'Chargement...' : 'Voir plus de publications' }}
            </Button>
          </div>

          <!-- End indicator -->
          <div
            v-else-if="filteredItems.length > 0 && activeFilter === 'all'"
            class="flex items-center justify-center gap-4 mt-12"
          >
            <Separator class="flex-1 max-w-24" />
            <p class="text-sm text-muted-foreground">
              Fin du catalogue
            </p>
            <Separator class="flex-1 max-w-24" />
          </div>
        </template>
      </main>
    </div>
  </DefaultLayout>
</template>
