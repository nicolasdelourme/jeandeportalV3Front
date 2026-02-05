<script setup lang="ts">
/**
 * Page Détail Actualité
 * Articles: Clean reading layout (callouts rendus inline via ProseContent)
 * Videos: YouTube embed + infos enrichies
 * Briefs: Layout compact avec image discrète
 */
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { NewsItem } from '@/types/news.types'
import { newsService } from '@/services/news.service'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import NewsBadge from '@/components/shared/NewsBadge.vue'
import VideoEmbed from '@/components/news/VideoEmbed.vue'
import SidebarAcademy from '@/components/shared/SidebarAcademy.vue'
import NewsCardCompact from '@/components/shared/NewsCardCompact.vue'
import BookmarkButton from '@/components/shared/BookmarkButton.vue'
import AuthorBadge from '@/components/shared/AuthorBadge.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProseContent } from '@/components/ui/prose-content'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const route = useRoute()
const router = useRouter()

const item = ref<NewsItem | null>(null)
const relatedItems = ref<NewsItem[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const icons = computed(() => ({
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  clock: byPrefixAndName.far?.['clock'],
  user: byPrefixAndName.fas?.['user'],

  calendar: byPrefixAndName.fas?.['calendar'],
  play: byPrefixAndName.fas?.['play'],
  share: byPrefixAndName.fas?.['share-nodes'],
}))

/**
 * Date formatée en français
 */
const formattedDate = computed(() => {
  if (!item.value) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(item.value.publishedAt)
})

/**
 * Heure formatée
 */
const formattedTime = computed(() => {
  if (!item.value) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(item.value.publishedAt)
})

/**
 * Date de mise à jour formatée (null si absente ou même jour que publishedAt)
 */
const formattedUpdatedAt = computed(() => {
  if (!item.value?.updatedAt) return null
  // Ne pas afficher si même jour que publishedAt
  const pub = item.value.publishedAt
  const upd = item.value.updatedAt
  if (
    pub.getFullYear() === upd.getFullYear() &&
    pub.getMonth() === upd.getMonth() &&
    pub.getDate() === upd.getDate()
  ) {
    return null
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(upd)
})

/**
 * Durée vidéo formatée (mm:ss)
 */
const formattedDuration = computed(() => {
  if (!item.value?.duration) return null
  const minutes = Math.floor(item.value.duration / 60)
  const seconds = item.value.duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})


/**
 * Charge l'actualité par slug
 */
const loadItem = async (slug: string) => {
  isLoading.value = true
  error.value = null

  try {
    item.value = await newsService.fetchNewsItem(slug)

    // Charger les actualités similaires
    const feed = await newsService.fetchNews({ pageSize: 6 })
    relatedItems.value = feed.items.filter((i) => i.id !== item.value?.id).slice(0, 4)
  } catch (e) {
    error.value = 'Actualité non trouvée'
  } finally {
    isLoading.value = false
  }
}

/**
 * Retour à la liste
 */
const handleBack = () => {
  router.push('/actualites')
}

onMounted(() => {
  const slug = route.params.slug as string
  if (slug) {
    loadItem(slug)
  }
})

// Recharger si le slug change
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug && typeof newSlug === 'string') {
      loadItem(newSlug)
    }
  }
)
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
        @click="handleBack"
      >
        <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="w-4 h-4 mr-2" />
        Retour aux actualités
      </Button>

      <!-- Loading State -->
      <div v-if="isLoading" class="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div class="h-6 bg-neutral-200 rounded w-24" ></div>
        <div class="h-12 bg-neutral-200 rounded w-3/4" ></div>
        <div class="h-4 bg-neutral-200 rounded w-48" ></div>
        <div class="aspect-video bg-neutral-200 rounded-xl" ></div>
        <div class="space-y-3">
          <div class="h-4 bg-neutral-200 rounded w-full" ></div>
          <div class="h-4 bg-neutral-200 rounded w-full" ></div>
          <div class="h-4 bg-neutral-200 rounded w-2/3" ></div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <p class="text-lg text-muted-foreground mb-4">{{ error }}</p>
        <Button variant="default" @click="handleBack">
          Retour aux actualités
        </Button>
      </div>

      <!-- Content -->
      <template v-else-if="item">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <!-- Main Content -->
          <article class="flex-1 min-w-0 max-w-4xl">
            <!-- Header -->
            <header class="mb-8">
              <!-- Badge + Bookmark -->
              <div class="flex items-center justify-between mb-4">
                <NewsBadge :type="item.type" />
                <BookmarkButton :slug="item.slug" variant="button" />
              </div>

              <!-- Title -->
              <h1 class="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight mb-4">
                {{ item.title }}
              </h1>

              <!-- Author -->
              <AuthorBadge v-if="item.author" :author="item.author" class="mb-2" />

              <!-- Meta -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span class="flex items-center gap-1">
                  <FontAwesomeIcon v-if="icons.calendar" :icon="icons.calendar" class="w-3.5 h-3.5" />
                  {{ formattedDate }} à {{ formattedTime }}
                  <template v-if="formattedUpdatedAt">
                    (mis à jour le {{ formattedUpdatedAt }})
                  </template>
                </span>

                <span v-if="item.readTime" class="flex items-center gap-1">
                  <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="w-3.5 h-3.5" />
                  {{ item.readTime }} min de lecture
                </span>

                <span v-if="formattedDuration" class="flex items-center gap-1">
                  <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="w-3.5 h-3.5" />
                  {{ formattedDuration }}
                </span>
              </div>
            </header>

            <!-- ==================== VIDEO ==================== -->
            <template v-if="item.type === 'video' && item.youtubeId">
              <!-- Video embed -->
              <VideoEmbed
                :youtube-id="item.youtubeId"
                :title="item.title"
                class="mb-6"
              />

              <!-- Video info bar -->
              <div class="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-neutral-200">
                <Badge variant="secondary" class="gap-1.5">
                  <FontAwesomeIcon v-if="icons.play" :icon="icons.play" class="w-3 h-3" />
                  Vidéo
                </Badge>
                <span v-if="formattedDuration" class="text-sm text-muted-foreground">
                  Durée : {{ formattedDuration }}
                </span>
                <div class="flex-1" ></div>
                <Button variant="outline" size="sm" class="gap-2">
                  <FontAwesomeIcon v-if="icons.share" :icon="icons.share" class="w-4 h-4" />
                  Partager
                </Button>
              </div>

              <!-- Video description -->
              <div class="prose prose-lg prose-neutral max-w-none mb-8">
                <h2 class="font-heading text-xl text-secondary mb-4">À propos de cette vidéo</h2>
                <p class="text-neutral-700 leading-relaxed">{{ item.excerpt }}</p>
              </div>

              <!-- Related videos -->
              <div v-if="relatedItems.filter(r => r.type === 'video').length > 0" class="mt-8">
                <Separator class="mb-8" />
                <h2 class="font-heading font-bold text-xl text-secondary mb-6">
                  Plus de vidéos
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NewsCardCompact
                    v-for="related in relatedItems.filter(r => r.type === 'video').slice(0, 4)"
                    :key="related.id"
                    :item="related"
                  />
                </div>
              </div>
            </template>

            <!-- ==================== ARTICLE LONG ==================== -->
            <template v-else-if="item.type === 'article'">
              <!-- Featured image -->
              <img
                :src="item.thumbnail"
                :alt="item.title"
                class="w-full aspect-video object-cover rounded-lg mb-8"
              />

              <!-- Chapeau / Excerpt -->
              <p class="text-xl text-neutral-500 leading-relaxed mb-8 font-medium">
                {{ item.excerpt }}
              </p>

              <!-- Article Content with ProseContent for Highcharts support -->
              <div v-if="item.content" class="bg-white rounded-lg">
                <ProseContent :html="item.content" />
              </div>
            </template>

            <!-- ==================== BRÈVE ==================== -->
            <template v-else-if="item.type === 'brief'">
              <!-- Layout compact avec image à droite -->
              <div class="flex flex-col md:flex-row gap-6">
                <!-- Content -->
                <div class="flex-1">
                  <!-- Chapeau -->
                  <p class="text-lg text-neutral-600 leading-relaxed mb-6 font-medium">
                    {{ item.excerpt }}
                  </p>

                  <!-- Brief Content with ProseContent -->
                  <div v-if="item.content">
                    <ProseContent :html="item.content" />
                  </div>
                </div>

                <!-- Image discrète à droite -->
                <div class="md:w-48 lg:w-56 shrink-0">
                  <img
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="w-full aspect-4/3 object-cover rounded-lg"
                  />
                </div>
              </div>
            </template>
          </article>

          <!-- Sidebar -->
          <aside class="w-full lg:w-80 shrink-0">
            <div class="lg:sticky lg:top-24 space-y-8">
              <!-- Academy cross-sell -->
              <SidebarAcademy />

              <!-- Related articles -->
              <div v-if="relatedItems.length > 0">
                <h3 class="font-heading font-bold text-lg text-secondary mb-4">
                  À lire aussi
                </h3>
                <div class="flex flex-col divide-y divide-neutral-100">
                  <NewsCardCompact
                    v-for="related in relatedItems"
                    :key="related.id"
                    :item="related"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
        </template>
      </div>
    </div>
  </DefaultLayout>
</template>

<style>
/* Minimal styles - ProseContent handles all article content rendering */
/* including callouts, charts, teasers and tables */
</style>
