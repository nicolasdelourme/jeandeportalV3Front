<script setup lang="ts">
/**
 * Composant SidebarTrending
 * Section "Les Plus Lus" de la sidebar
 * Affiche les 5 actualités les plus vues avec numérotation
 */
import { ref, onMounted } from 'vue'
import type { NewsItem } from '@/types/news.types'
import { newsService } from '@/services/news.service'
import NewsCardCompact from './NewsCardCompact.vue'

const items = ref<NewsItem[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    items.value = await newsService.fetchTrending()
  } catch (e) {
    error.value = 'Impossible de charger les tendances'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="flex flex-col gap-4">
    <!-- Header -->
    <h3 class="font-heading font-bold text-lg text-secondary">Les Plus Lus</h3>

    <!-- Loading state -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="flex gap-3 animate-pulse">
        <div class="w-8 h-8 rounded bg-neutral-200" />
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

    <!-- Items -->
    <div v-else class="flex flex-col divide-y divide-neutral-100">
      <NewsCardCompact
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :rank="index + 1"
      />
    </div>
  </section>
</template>
