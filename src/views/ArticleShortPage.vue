<script setup lang="ts">
/**
 * ArticleShortPage - Article court : VeraCash
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { ProseContent } from '@/components/ui/prose-content'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { ContentType } from '@/components/ui/themed-card/ThemedCard.vue'

const router = useRouter()

// Icons
const icons = computed(() => ({
  facebook: byPrefixAndName.fab?.['facebook-f'],
  twitter: byPrefixAndName.fab?.['x-twitter'],
  linkedin: byPrefixAndName.fab?.['linkedin-in'],
  link: byPrefixAndName.fas?.['link'],
  clock: byPrefixAndName.far?.['clock'],
  user: byPrefixAndName.fas?.['user'],
  graduationCap: byPrefixAndName.far?.['graduation-cap'],
  newspaper: byPrefixAndName.far?.['newspaper'],
  fileLines: byPrefixAndName.far?.['file-lines'],
  comments: byPrefixAndName.fas?.['comments'],
  book: byPrefixAndName.fas?.['book'],
  circlePlay: byPrefixAndName.fas?.['circle-play'],
  check: byPrefixAndName.fas?.['check'],
  envelope: byPrefixAndName.fas?.['envelope'],
}))

// Article court - VeraCash
const mockArticle = ref({
  type: 'article' as ContentType,
  title: "Toujours pas de droit de garde chez VeraCash",
  date: '2026-01-26',
  readTime: '2 min',
  author: 'Nicolas Delourme',
  image: 'https://www.shutterstock.com/shutterstock/photos/2209788541/display_1500/stock-photo-strong-room-gate-door-golden-color-for-safety-protect-valuable-in-bank-background-2209788541.jpg',
  content: `
<p>
  Au début de l'année 2025, VeraCash annonçait une future révision de ses tarifs et, notamment, l'ajout de <strong>frais de garde des métaux précieux</strong>. Il faut dire que le négociant ne facture rien pour le stockage sécurisé, audité et assuré de votre or et de votre argent dans ces chambres fortes des Ports francs de Genève. Et, en GoldPremium (jetons et pièces à cours légal), il n'y a pas de frais à la revente, ni de prime négative.
</p>
<p>
  En clair, une fois les frais d'entrée payés (3 %), vous pouvez conserver votre métal jaune pendant des années, sans rien payer de plus (ce qui est très bénéfique en période de hausse du cours) !
</p>
<p>
  A ce stade, le négociant français semble avoir abandonné l'idée et continue d'appliquer les tarifs de 2023, vous invitant même <em>« ne pas vous soucier du stockage, il est offert »</em> !
</p>
<blockquote>
  <p>Pourvu que ça dure…</p>
</blockquote>
`
})

// Suggested content for sidebar
interface SuggestedItem {
  id: string
  type: 'article' | 'video'
  title: string
  thumbnail: string
  date: string
  readTime?: string
  duration?: string
}

const suggestedContent = ref<SuggestedItem[]>([
  {
    id: '1',
    type: 'video',
    title: "Or : faut-il acheter maintenant ou attendre ?",
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    date: '24 jan.',
    duration: '18:32',
  },
  {
    id: '2',
    type: 'article',
    title: "Fiscalité de l'or : ce qui change en 2026",
    thumbnail: 'https://placehold.co/320x180/F4BFA6/1D1D1D?text=Fiscalite',
    date: '22 jan.',
    readTime: '6 min',
  },
  {
    id: '3',
    type: 'article',
    title: "Les banques centrales accumulent de l'or",
    thumbnail: 'https://placehold.co/320x180/F2CC00/1D1D1D?text=Banques',
    date: '18 jan.',
    readTime: '10 min',
  },
])

// Handle suggested item click
const handleSuggestedClick = (item: SuggestedItem) => {
  if (item.type === 'video') {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
  } else {
    router.push('/articleLong')
  }
}

// Formatted date
const formattedDate = computed(() => {
  const date = new Date(mockArticle.value.date)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

// Content type icon
const contentTypeIcon = computed(() => {
  const typeIcons: Record<ContentType, unknown> = {
    tuto: icons.value.graduationCap,
    dossier: icons.value.fileLines,
    newsletter: icons.value.newspaper,
    consultation: icons.value.comments,
    article: icons.value.book,
    video: icons.value.circlePlay,
  }
  return typeIcons[mockArticle.value.type]
})

// Content type label
const contentTypeLabel = computed(() => {
  const labels: Record<ContentType, string> = {
    tuto: 'Tuto',
    dossier: 'Dossier',
    newsletter: 'Newsletter',
    consultation: 'Consultation',
    article: 'Article',
    video: 'Tuto Vidéo',
  }
  return labels[mockArticle.value.type]
})

// Link copied state
const linkCopied = ref(false)

// Copy link handler
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

// Social share handlers
const shareOnFacebook = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
}

const shareOnTwitter = () => {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(mockArticle.value.title)}`, '_blank')
}

const shareOnLinkedIn = () => {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
}

const shareByEmail = () => {
  window.open(`mailto:?subject=${encodeURIComponent(mockArticle.value.title)}&body=${encodeURIComponent(window.location.href)}`, '_blank')
}
</script>

<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <section class="bg-white py-6 lg:py-8">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb class="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/academie/catalogue">Actualités</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{{ contentTypeLabel }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <!-- Hero 2 columns layout -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 items-start">
          <!-- Left: Content -->
          <div>
            <!-- Badge type contenu -->
            <div class="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" class="gap-1.5">
                <FontAwesomeIcon v-if="contentTypeIcon" :icon="contentTypeIcon" class="size-3" />
                {{ contentTypeLabel }}
              </Badge>
            </div>

            <!-- Title -->
            <h1 class="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {{ mockArticle.title }}
            </h1>

            <!-- Meta -->
            <div class="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div class="flex items-center gap-2">
                <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="size-4" />
                <span>{{ formattedDate }}</span>
              </div>
              <Separator orientation="vertical" class="h-4" />
              <div class="flex items-center gap-2">
                <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="size-4" />
                <span>{{ mockArticle.readTime }} de lecture</span>
              </div>
              <Separator orientation="vertical" class="h-4" />
              <div class="flex items-center gap-2">
                <FontAwesomeIcon v-if="icons.user" :icon="icons.user" class="size-4" />
                <span>{{ mockArticle.author }}</span>
              </div>
            </div>

            <!-- Mobile Social Share -->
            <div class="flex items-center gap-2 mt-6 lg:hidden">
              <span class="text-sm text-muted-foreground mr-2">Partager :</span>
              <Button variant="outline" size="icon" rounded="lg" @click="shareOnFacebook">
                <FontAwesomeIcon v-if="icons.facebook" :icon="icons.facebook" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" rounded="lg" @click="shareOnTwitter">
                <FontAwesomeIcon v-if="icons.twitter" :icon="icons.twitter" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" rounded="lg" @click="shareOnLinkedIn">
                <FontAwesomeIcon v-if="icons.linkedin" :icon="icons.linkedin" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" rounded="lg" @click="copyLink">
                <FontAwesomeIcon v-if="linkCopied && icons.check" :icon="icons.check" class="size-4 text-green-600" />
                <FontAwesomeIcon v-else-if="icons.link" :icon="icons.link" class="size-4" />
              </Button>
            </div>
          </div>

          <!-- Right: Image thumbnail -->
          <div class="order-first lg:order-0">
            <AspectRatio :ratio="4/3" class="overflow-hidden rounded-lg bg-neutral-100">
              <img
                :src="mockArticle.image"
                :alt="mockArticle.title"
                class="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="bg-neutral-50 py-8 lg:py-10">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-[44px_1fr_260px] gap-4 lg:gap-5">
          <!-- Left Column - Social Share (Desktop) -->
          <div class="hidden lg:block">
            <div class="sticky top-24 flex flex-col gap-2">
              <Button title="Partager sur Facebook" variant="outline" size="icon" rounded="lg" @click="shareOnFacebook">
                <FontAwesomeIcon v-if="icons.facebook" :icon="icons.facebook" class="size-4 text-secondary" />
              </Button>
              <Button title="Partager sur X" variant="outline" size="icon" rounded="lg" @click="shareOnTwitter">
                <FontAwesomeIcon v-if="icons.twitter" :icon="icons.twitter" class="size-4 text-secondary" />
              </Button>
              <Button title="Partager sur LinkedIn" variant="outline" size="icon" rounded="lg" @click="shareOnLinkedIn">
                <FontAwesomeIcon v-if="icons.linkedin" :icon="icons.linkedin" class="size-4 text-secondary" />
              </Button>
              <Button title="Envoyer par email" variant="outline" size="icon" rounded="lg" @click="shareByEmail">
                <FontAwesomeIcon v-if="icons.envelope" :icon="icons.envelope" class="size-4 text-secondary" />
              </Button>
              <Button title="Copier le lien" variant="outline" size="icon" rounded="lg" @click="copyLink">
                <FontAwesomeIcon v-if="linkCopied && icons.check" :icon="icons.check" class="size-4 text-green-600" />
                <FontAwesomeIcon v-else-if="icons.link" :icon="icons.link" class="size-4 text-secondary" />
              </Button>
            </div>
          </div>

          <!-- Center Column - Article Content -->
          <div class="order-2 lg:order-0">
            <div class="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <ProseContent :html="mockArticle.content" />
            </div>
          </div>

          <!-- Right Column - Suggested Content -->
          <div class="order-1 lg:order-0">
            <div class="sticky top-24 space-y-4">
              <h4 class="font-heading font-bold text-sm text-muted-foreground uppercase tracking-wide">
                À lire aussi
              </h4>

              <!-- Suggested items -->
              <div class="space-y-3">
                <Card
                  v-for="item in suggestedContent"
                  :key="item.id"
                  class="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-primary rounded-lg gap-2 py-0"
                  @click="handleSuggestedClick(item)"
                >
                  <!-- Thumbnail full width -->
                  <div class="relative">
                    <AspectRatio :ratio="16/9" class="bg-neutral-100">
                      <img
                        :src="item.thumbnail"
                        :alt="item.title"
                        class="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    <!-- Video icon -->
                    <div
                      v-if="item.type === 'video'"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <div class="size-8 rounded-full bg-primary flex items-center justify-center">
                        <FontAwesomeIcon v-if="icons.circlePlay" :icon="icons.circlePlay" class="size-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  <!-- Content -->
                  <CardContent class="px-3 py-2">
                    <p class="text-xs text-muted-foreground mb-1">
                      {{ item.type === 'video' ? item.duration : item.readTime }} · {{ item.date }}
                    </p>
                    <h5 class="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                      {{ item.title }}
                    </h5>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
