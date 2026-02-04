<script setup lang="ts">
/**
 * ArticleTeaser - Teaser inline pour renvoi vers un autre article
 * Utilisé dans ProseContent via placeholder <div data-article-teaser data-slug="...">
 */
import { ref, onMounted } from 'vue'
import { newsService } from '@/services/news.service'

const props = defineProps<{
  slug: string
}>()

const title = ref<string | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const item = await newsService.fetchNewsItem(props.slug)
    title.value = item.title
  } catch {
    title.value = null
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="isLoading" class="flex items-center gap-3 py-3 my-4 not-prose animate-pulse">
    <span class="h-4 w-24 bg-neutral-200 rounded"></span>
    <span class="w-px h-4 bg-neutral-300"></span>
    <span class="h-4 w-48 bg-neutral-200 rounded"></span>
  </div>

  <!-- Resolved teaser -->
  <div v-else-if="title" class="flex items-center gap-3 py-3 my-4 not-prose">
    <span class="text-sm font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">A lire aussi</span>
    <span class="w-px h-4 bg-neutral-300"></span>
    <RouterLink :to="`/actualites/${slug}`" class="text-sm font-medium text-primary hover:underline truncate">
      {{ title }}
    </RouterLink>
  </div>

  <!-- Hidden if slug not found -->
</template>
