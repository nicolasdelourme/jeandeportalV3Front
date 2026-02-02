<script setup lang="ts">
/**
 * Composant SidebarLive
 * Section "En Continu" de la sidebar
 * Affiche les 3 dernières actualités avec point jaune pour les nouvelles
 */
import { ref, onMounted } from 'vue'
import type { NewsItem } from '@/types/news.types'
import { newsService } from '@/services/news.service'
import NewsCardCompact from '@/components/shared/NewsCardCompact.vue'

const items = ref<NewsItem[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    items.value = await newsService.fetchLatest()
  } catch (e) {
    error.value = 'Impossible de charger les actualités'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
      <h3 class="font-heading font-bold text-lg text-secondary">En Continu</h3>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex gap-3 animate-pulse">
        <div class="w-16 h-16 rounded-md bg-neutral-200" />
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-neutral-200 rounded w-3/4" />
          <div class="h-3 bg-neutral-200 rounded w-1/2" />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <p v-else-if="error" class="text-sm text-muted-foreground">
      {{ error }}
    </p>

    <!-- Items (limité à 3) -->
    <div v-else class="flex flex-col divide-y divide-neutral-100">
      <NewsCardCompact
        v-for="item in items.slice(0, 3)"
        :key="item.id"
        :item="item"
        show-new-dot
      />
    </div>
  </section>
</template>
