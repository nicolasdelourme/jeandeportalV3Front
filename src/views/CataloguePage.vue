<script setup lang="ts">
/**
 * CataloguePage - Landing page style presse française
 * Articles + vidéos YouTube, layout 2 colonnes avec sidebar sticky
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const router = useRouter()

// Icons
const icons = computed(() => ({
  search: byPrefixAndName.fas?.['magnifying-glass'],
  play: byPrefixAndName.fas?.['circle-play'],
  clock: byPrefixAndName.far?.['clock'],
  fileLines: byPrefixAndName.far?.['file-lines'],
  envelope: byPrefixAndName.far?.['envelope'],
}))

// Content types
type MediaContentType = 'article' | 'video'

// Filters
const selectedContentType = ref<MediaContentType | 'all'>('all')
const searchQuery = ref('')

// Content type labels
const contentTypeLabels: Record<MediaContentType | 'all', string> = {
  all: 'Tous les contenus',
  article: 'Articles',
  video: 'Vidéos',
}

// Mock media content
interface MediaItem {
  id: string
  type: MediaContentType
  title: string
  description: string
  thumbnail: string
  date: Date
  readTime?: string
  duration?: string
  youtubeId?: string
}

const mockMedia = ref<MediaItem[]>([
  {
    id: '1',
    type: 'article',
    title: "Comment détenir des euros sans dépendre du système bancaire ?",
    description: "Si une crise de la dette frappait à son tour la France, les autorités pourraient instaurer des mesures déjà prises ailleurs. Et vous, qu'avez-vous prévu ?",
    thumbnail: 'https://img.lemde.fr/2015/07/29/686/0/5211/2603/1342/671/60/0/abab459_44dcd005b408410ba645fcccfb529ee6-44dcd005b408410ba645fcccfb529ee6-0.jpg',
    date: new Date('2026-01-26'),
    readTime: '12 min',
  },
  {
    id: '2',
    type: 'article',
    title: "Toujours pas de droit de garde chez VeraCash",
    description: "Le négociant français continue d'offrir le stockage gratuit de vos métaux précieux dans les Ports francs de Genève.",
    thumbnail: 'https://www.shutterstock.com/shutterstock/photos/2209788541/display_1500/stock-photo-strong-room-gate-door-golden-color-for-safety-protect-valuable-in-bank-background-2209788541.jpg',
    date: new Date('2026-01-25'),
    readTime: '2 min',
  },
  {
    id: '3',
    type: 'video',
    title: "Or : faut-il acheter maintenant ou attendre une correction ?",
    description: "Analyse complète du marché de l'or et stratégies d'investissement pour 2026.",
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    date: new Date('2026-01-24'),
    duration: '18:32',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    id: '4',
    type: 'article',
    title: "Portefeuille permanent : bilan de janvier 2026",
    description: "Performance et ajustements du portefeuille permanent ce mois-ci. Une stratégie qui continue de faire ses preuves.",
    thumbnail: 'https://placehold.co/800x450/A8C7EA/1D1D1D?text=Portefeuille',
    date: new Date('2026-01-22'),
    readTime: '8 min',
  },
  {
    id: '5',
    type: 'video',
    title: "Les 5 erreurs à éviter quand on achète de l'or",
    description: "Guide pratique pour les débutants qui veulent investir dans les métaux précieux.",
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    date: new Date('2026-01-20'),
    duration: '12:45',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    id: '6',
    type: 'article',
    title: "Fiscalité de l'or : ce qui change en 2026",
    description: "Les nouvelles règles fiscales pour la détention et la revente d'or physique en France.",
    thumbnail: 'https://placehold.co/800x450/F4BFA6/1D1D1D?text=Fiscalite',
    date: new Date('2026-01-18'),
    readTime: '6 min',
  },
  {
    id: '7',
    type: 'video',
    title: "Bitcoin vs Or : le match de 2026",
    description: "Comparaison détaillée des deux actifs refuges les plus populaires.",
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    date: new Date('2026-01-15'),
    duration: '24:10',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    id: '8',
    type: 'article',
    title: "Les banques centrales accumulent de l'or : que savent-elles ?",
    description: "Analyse des achats massifs d'or par les banques centrales ces dernières années.",
    thumbnail: 'https://placehold.co/800x450/F2CC00/1D1D1D?text=Banques+Centrales',
    date: new Date('2026-01-12'),
    readTime: '10 min',
  },
])

// Filtered media
const filteredMedia = computed(() => {
  return mockMedia.value.filter(item => {
    const matchesType = selectedContentType.value === 'all' || item.type === selectedContentType.value
    const matchesSearch = searchQuery.value === '' ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesType && matchesSearch
  })
})

// Hero article (first filtered item)
const heroArticle = computed(() => filteredMedia.value[0] || null)

// Feed articles (items 2+)
const feedArticles = computed(() => filteredMedia.value.slice(1))

// Live updates - 4 most recent items sorted by date
const liveUpdates = computed(() =>
  [...mockMedia.value].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4)
)

// Top articles - 5 articles (not videos)
const topArticles = computed(() =>
  mockMedia.value.filter(i => i.type === 'article').slice(0, 5)
)

// Count by content type
const countByType = computed(() => {
  const counts: Record<MediaContentType | 'all', number> = {
    all: mockMedia.value.length,
    article: 0,
    video: 0,
  }
  mockMedia.value.forEach(item => {
    counts[item.type]++
  })
  return counts
})

// Format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Get relative time (Il y a Xh / Hier / Il y a Xj)
const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) {
    return "À l'instant"
  } else if (diffHours < 24) {
    return `Il y a ${diffHours}h`
  } else if (diffDays === 1) {
    return 'Hier'
  } else if (diffDays < 7) {
    return `Il y a ${diffDays}j`
  } else {
    return formatDate(date)
  }
}

// Handle click on item
const handleItemClick = (item: MediaItem) => {
  if (item.type === 'video' && item.youtubeId) {
    window.open(`https://www.youtube.com/watch?v=${item.youtubeId}`, '_blank')
  } else {
    router.push('/articleLong')
  }
}

// Reset filters
const resetFilters = () => {
  selectedContentType.value = 'all'
  searchQuery.value = ''
}
</script>

<template>
  <DefaultLayout>
    <!-- Header Section -->
    <section class="bg-white py-6 lg:py-8 border-b">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Title -->
        <h1 class="font-heading text-3xl font-bold text-foreground mb-2">
          Actualités
        </h1>
        <p class="text-muted-foreground text-lg mb-6">
          Articles et vidéos sur l'investissement et les métaux précieux
        </p>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="relative flex-1">
            <FontAwesomeIcon
              v-if="icons.search"
              :icon="icons.search"
              class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Rechercher..."
              class="pl-10"
            />
          </div>

          <!-- Content type filter -->
          <Select v-model="selectedContentType">
            <SelectTrigger class="w-full sm:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="(label, key) in contentTypeLabels"
                :key="key"
                :value="key"
              >
                {{ label }} ({{ countByType[key] }})
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Reset -->
          <Button
            v-if="selectedContentType !== 'all' || searchQuery"
            variant="outline"
            size="sm"
            @click="resetFilters"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="bg-neutral-50 py-8 lg:py-10">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          <!-- Main Feed -->
          <div>
            <!-- Hero Article -->
            <Card
              v-if="heroArticle"
              class="bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-shadow cursor-pointer py-0 mb-6"
              @click="handleItemClick(heroArticle)"
            >
              <!-- Image 16:9 -->
              <div class="relative">
                <AspectRatio :ratio="16/9" class="bg-neutral-100">
                  <img
                    :src="heroArticle.thumbnail"
                    :alt="heroArticle.title"
                    class="w-full h-full object-cover"
                  />
                </AspectRatio>
                <!-- Play icon overlay for video -->
                <div
                  v-if="heroArticle.type === 'video'"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <div class="size-16 rounded-full bg-black/60 flex items-center justify-center">
                    <FontAwesomeIcon v-if="icons.play" :icon="icons.play" class="size-8 text-white" />
                  </div>
                </div>
              </div>

              <CardContent class="p-5 lg:p-6">
                <!-- Badge -->
                <Badge variant="outline" class="mb-3 gap-1.5">
                  <FontAwesomeIcon
                    v-if="heroArticle.type === 'video' && icons.play"
                    :icon="icons.play"
                    class="size-3"
                  />
                  <FontAwesomeIcon
                    v-else-if="icons.fileLines"
                    :icon="icons.fileLines"
                    class="size-3"
                  />
                  {{ heroArticle.type === 'video' ? 'Vidéo' : 'Article' }}
                </Badge>

                <!-- Title -->
                <h2 class="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  {{ heroArticle.title }}
                </h2>

                <!-- Description -->
                <p class="text-muted-foreground line-clamp-3 mb-4">
                  {{ heroArticle.description }}
                </p>

                <!-- Meta -->
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="size-4" />
                  <span>{{ formatDate(heroArticle.date) }}</span>
                  <span class="text-muted-foreground/50">•</span>
                  <span v-if="heroArticle.type === 'video'">{{ heroArticle.duration }}</span>
                  <span v-else>{{ heroArticle.readTime }} de lecture</span>
                </div>
              </CardContent>
            </Card>

            <!-- Feed Articles -->
            <div v-if="feedArticles.length > 0" class="space-y-0">
              <template v-for="(item, index) in feedArticles" :key="item.id">
                <!-- Separator -->
                <Separator v-if="index > 0" class="my-4" />

                <!-- Horizontal Card -->
                <Card
                  class="bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-shadow py-0 cursor-pointer"
                  @click="handleItemClick(item)"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-0">
                    <!-- Image 4:3 -->
                    <div class="relative">
                      <AspectRatio :ratio="4/3" class="bg-neutral-100">
                        <img
                          :src="item.thumbnail"
                          :alt="item.title"
                          class="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <!-- Play icon overlay for video -->
                      <div
                        v-if="item.type === 'video'"
                        class="absolute inset-0 flex items-center justify-center"
                      >
                        <div class="size-10 rounded-full bg-black/60 flex items-center justify-center">
                          <FontAwesomeIcon v-if="icons.play" :icon="icons.play" class="size-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <!-- Content -->
                    <CardContent class="p-4">
                      <!-- Badge + Meta inline -->
                      <div class="flex items-center gap-2 mb-2 text-xs">
                        <Badge variant="outline" class="gap-1 text-xs">
                          <FontAwesomeIcon
                            v-if="item.type === 'video' && icons.play"
                            :icon="icons.play"
                            class="size-2.5"
                          />
                          <FontAwesomeIcon
                            v-else-if="icons.fileLines"
                            :icon="icons.fileLines"
                            class="size-2.5"
                          />
                          {{ item.type === 'video' ? 'Vidéo' : 'Article' }}
                        </Badge>
                        <span class="text-muted-foreground">
                          {{ formatDate(item.date) }}
                        </span>
                        <span class="text-muted-foreground/50">•</span>
                        <span class="text-muted-foreground">
                          {{ item.type === 'video' ? item.duration : item.readTime }}
                        </span>
                      </div>

                      <!-- Title -->
                      <h3 class="font-heading text-lg lg:text-xl font-bold text-foreground mb-2 line-clamp-2">
                        {{ item.title }}
                      </h3>

                      <!-- Description -->
                      <p class="text-sm text-muted-foreground line-clamp-2">
                        {{ item.description }}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </template>
            </div>

            <!-- Empty state -->
            <div
              v-if="filteredMedia.length === 0"
              class="text-center py-16 bg-white rounded-lg"
            >
              <p class="text-muted-foreground text-lg mb-4">
                Aucun contenu ne correspond à vos critères.
              </p>
              <Button variant="outline" @click="resetFilters">
                Réinitialiser les filtres
              </Button>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <!-- En Continu -->
            <Card class="bg-white shadow-sm rounded-lg overflow-hidden py-0">
              <CardContent class="p-4">
                <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                  En Continu
                </h3>
                <div class="space-y-0">
                  <template v-for="(item, index) in liveUpdates" :key="item.id">
                    <div
                      class="py-3 cursor-pointer hover:bg-neutral-50 -mx-4 px-4 transition-colors"
                      :class="{ 'border-b': index < liveUpdates.length - 1 }"
                      @click="handleItemClick(item)"
                    >
                      <p class="text-xs text-muted-foreground mb-1">
                        {{ getRelativeTime(item.date) }}
                      </p>
                      <p class="text-sm font-medium text-foreground line-clamp-2">
                        {{ item.title }}
                      </p>
                    </div>
                  </template>
                </div>
              </CardContent>
            </Card>

            <!-- Les Plus Lus -->
            <Card class="bg-white shadow-sm rounded-lg overflow-hidden py-0">
              <CardContent class="p-4">
                <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                  Les Plus Lus
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="(item, index) in topArticles"
                    :key="item.id"
                    class="flex gap-3 cursor-pointer group"
                    @click="handleItemClick(item)"
                  >
                    <Badge class="size-6 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {{ index + 1 }}
                    </Badge>
                    <p class="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {{ item.title }}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Newsletter CTA -->
            <Card class="bg-primary/5 border-primary/20 shadow-sm rounded-lg overflow-hidden">
              <CardContent class="p-4 text-center">
                <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon v-if="icons.envelope" :icon="icons.envelope" class="size-5 text-primary" />
                </div>
                <h3 class="font-heading font-bold text-foreground mb-2">
                  Restez informé
                </h3>
                <p class="text-sm text-muted-foreground mb-4">
                  Recevez nos analyses et conseils directement dans votre boîte mail.
                </p>
                <Button class="w-full">
                  S'abonner à la newsletter
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
