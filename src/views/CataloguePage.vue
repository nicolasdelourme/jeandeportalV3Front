<script setup lang="ts">
/**
 * CataloguePage - Page catalogue reunissant newsletters, tutos, consultations, articles et videos
 * Avec filtres par theme et type de contenu
 */
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ThemedCard, ThemedCardModal, themeLabels, type ThemeType } from '@/components/ui/themed-card'
import type { ContentType, Participant } from '@/components/ui/themed-card/ThemedCard.vue'
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

const router = useRouter()

// Icons
const icons = computed(() => ({
  search: byPrefixAndName.fas?.['magnifying-glass'],
}))

// Filters
const selectedTheme = ref<ThemeType | 'all'>('all')
const selectedContentType = ref<ContentType | 'all'>('all')
const searchQuery = ref('')

// Content type labels for filter
const contentTypeLabels: Record<ContentType | 'all', string> = {
  all: 'Tous les types',
  newsletter: 'Newsletter',
  tuto: 'Tuto',
  consultation: 'Consultation',
  article: 'Article',
  video: 'Tuto Video',
  dossier: 'Dossier',
}

// Theme labels for filter
const themeFilterLabels: Record<ThemeType | 'all', string> = {
  all: 'Toutes les thematiques',
  ...themeLabels,
}

// Mock participants
const jeanDePortal: Participant = { name: 'Jean de Portal', avatar: 'https://placehold.co/100x100/F2CC00/1D1D1D?text=JdP', role: 'Fondateur Infocash' }
const nicolasDelourme: Participant = { name: 'Nicolas Delourme', avatar: 'https://placehold.co/100x100/A8C7EA/1D1D1D?text=ND', role: 'Expert or' }
const etienneBrois: Participant = { name: 'Etienne Brois', avatar: 'https://placehold.co/100x100/F4BFA6/1D1D1D?text=EB', role: 'Conseiller patrimoine' }

// Mock catalog content
interface CatalogItem {
  id: string
  theme: ThemeType
  contentType: ContentType
  title: string
  description: string
  thumbnail: string
  date: Date
  isSubscriberOnly: boolean
  participants: Participant[]
}

const mockCatalog = ref<CatalogItem[]>([
  // Metaux precieux
  {
    id: '1',
    theme: 'metaux',
    contentType: 'newsletter',
    title: "L'or atteint des sommets : analyse du marche janvier 2024",
    description: "Decouvrez notre analyse complete des facteurs qui poussent l'or vers de nouveaux records historiques.",
    thumbnail: 'https://placehold.co/600x400/F2CC00/1D1D1D?text=Newsletter+Or',
    date: new Date('2024-01-15'),
    isSubscriberOnly: true,
    participants: [jeanDePortal],
  },
  {
    id: '2',
    theme: 'metaux',
    contentType: 'tuto',
    title: "Comment mettre en place un DCA sur l'or physique",
    description: "Guide pratique pour investir progressivement dans l'or physique avec la methode DCA.",
    thumbnail: 'https://placehold.co/600x400/F2CC00/1D1D1D?text=Tuto+DCA',
    date: new Date('2024-01-10'),
    isSubscriberOnly: true,
    participants: [jeanDePortal, nicolasDelourme, etienneBrois],
  },
  {
    id: '3',
    theme: 'metaux',
    contentType: 'video',
    title: "Pieces d'or : lesquelles acheter en 2024 ?",
    description: "Video complete sur les meilleures pieces d'or d'investissement cette annee.",
    thumbnail: 'https://placehold.co/600x400/F2CC00/1D1D1D?text=Video+Pieces',
    date: new Date('2024-01-08'),
    isSubscriberOnly: false,
    participants: [nicolasDelourme],
  },
  {
    id: '4',
    theme: 'metaux',
    contentType: 'consultation',
    title: "Consultation personnalisee : strategie metaux precieux",
    description: "Reservez une consultation avec nos experts pour definir votre strategie d'investissement.",
    thumbnail: 'https://placehold.co/600x400/F2CC00/1D1D1D?text=Consultation',
    date: new Date('2024-01-20'),
    isSubscriberOnly: true,
    participants: [etienneBrois],
  },
  // Portefeuille permanent
  {
    id: '5',
    theme: 'portefeuille',
    contentType: 'newsletter',
    title: "Bilan du portefeuille permanent T4 2023",
    description: "Analyse de performance et ajustements recommandes pour le premier trimestre 2024.",
    thumbnail: 'https://placehold.co/600x400/A8C7EA/1D1D1D?text=Newsletter+PP',
    date: new Date('2024-01-12'),
    isSubscriberOnly: true,
    participants: [jeanDePortal],
  },
  {
    id: '6',
    theme: 'portefeuille',
    contentType: 'tuto',
    title: "Reequilibrer son portefeuille permanent",
    description: "Apprenez a reequilibrer efficacement votre portefeuille permanent.",
    thumbnail: 'https://placehold.co/600x400/A8C7EA/1D1D1D?text=Tuto+Reequilibrage',
    date: new Date('2024-01-05'),
    isSubscriberOnly: true,
    participants: [jeanDePortal, etienneBrois],
  },
  {
    id: '7',
    theme: 'portefeuille',
    contentType: 'article',
    title: "Harry Browne : l'inventeur du portefeuille permanent",
    description: "Retour sur la philosophie et l'histoire du portefeuille permanent.",
    thumbnail: 'https://placehold.co/600x400/A8C7EA/1D1D1D?text=Article+Browne',
    date: new Date('2024-01-03'),
    isSubscriberOnly: false,
    participants: [],
  },
  // Liberte financiere
  {
    id: '8',
    theme: 'liberte',
    contentType: 'newsletter',
    title: "Les 10 etapes vers l'independance financiere",
    description: "Notre methode eprouvee pour atteindre la liberte financiere en 10 etapes claires.",
    thumbnail: 'https://placehold.co/600x400/F4BFA6/1D1D1D?text=Newsletter+IF',
    date: new Date('2024-01-14'),
    isSubscriberOnly: true,
    participants: [jeanDePortal],
  },
  {
    id: '9',
    theme: 'liberte',
    contentType: 'video',
    title: "Calculer son nombre magique",
    description: "Video tutoriel pour calculer le capital necessaire a votre independance financiere.",
    thumbnail: 'https://placehold.co/600x400/F4BFA6/1D1D1D?text=Video+Calcul',
    date: new Date('2024-01-09'),
    isSubscriberOnly: true,
    participants: [jeanDePortal],
  },
  {
    id: '10',
    theme: 'liberte',
    contentType: 'dossier',
    title: "Dossier complet : optimisation fiscale pour investisseurs",
    description: "Tout ce qu'il faut savoir sur l'optimisation fiscale legale en France.",
    thumbnail: 'https://placehold.co/600x400/F4BFA6/1D1D1D?text=Dossier+Fiscal',
    date: new Date('2024-01-06'),
    isSubscriberOnly: true,
    participants: [etienneBrois],
  },
  // Bonus mystere
  {
    id: '11',
    theme: 'bonus',
    contentType: 'newsletter',
    title: "Astuce fiscale du mois : le PER",
    description: "Decouvrez comment optimiser votre fiscalite grace au Plan Epargne Retraite.",
    thumbnail: 'https://placehold.co/600x400/262626/FFFFFF?text=Bonus+PER',
    date: new Date('2024-01-11'),
    isSubscriberOnly: true,
    participants: [jeanDePortal],
  },
  {
    id: '12',
    theme: 'bonus',
    contentType: 'tuto',
    title: "Creer sa holding patrimoniale",
    description: "Guide avance pour structurer votre patrimoine via une holding.",
    thumbnail: 'https://placehold.co/600x400/262626/FFFFFF?text=Tuto+Holding',
    date: new Date('2024-01-07'),
    isSubscriberOnly: true,
    participants: [etienneBrois],
  },
])

// Filtered catalog
const filteredCatalog = computed(() => {
  return mockCatalog.value.filter(item => {
    const matchesTheme = selectedTheme.value === 'all' || item.theme === selectedTheme.value
    const matchesType = selectedContentType.value === 'all' || item.contentType === selectedContentType.value
    const matchesSearch = searchQuery.value === '' ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesTheme && matchesType && matchesSearch
  })
})

// Count by theme
const countByTheme = computed(() => {
  const counts: Record<ThemeType | 'all', number> = {
    all: mockCatalog.value.length,
    metaux: 0,
    portefeuille: 0,
    liberte: 0,
    bonus: 0,
  }
  mockCatalog.value.forEach(item => {
    counts[item.theme]++
  })
  return counts
})

// Count by content type
const countByType = computed(() => {
  const counts: Record<ContentType | 'all', number> = {
    all: mockCatalog.value.length,
    newsletter: 0,
    tuto: 0,
    consultation: 0,
    article: 0,
    video: 0,
    dossier: 0,
  }
  mockCatalog.value.forEach(item => {
    counts[item.contentType]++
  })
  return counts
})

// Modal state
const isModalOpen = ref(false)
const selectedItem = ref<CatalogItem | null>(null)

const openModal = (item: CatalogItem) => {
  selectedItem.value = item
  isModalOpen.value = true
}

const handleView = () => {
  if (selectedItem.value) {
    router.push(`/academie/contenu/${selectedItem.value.id}`)
  }
  isModalOpen.value = false
}

const handleAdd = () => {
  console.log('Add to list:', selectedItem.value?.id)
}

const handleDownload = () => {
  console.log('Download:', selectedItem.value?.id)
}

const handleShare = () => {
  console.log('Share:', selectedItem.value?.id)
}

// Reset filters
const resetFilters = () => {
  selectedTheme.value = 'all'
  selectedContentType.value = 'all'
  searchQuery.value = ''
}
</script>

<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <section class="bg-white py-8 lg:py-12">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Breadcrumb -->
        <Breadcrumb class="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/academie">Academie</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Catalogue</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <!-- Title -->
        <h1 class="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Catalogue des contenus
        </h1>
        <p class="text-muted-foreground text-lg max-w-2xl mb-8">
          Retrouvez tous nos contenus premium : newsletters, tutos, consultations, articles et videos.
          Filtrez par thematique ou type de contenu.
        </p>

        <!-- Filters -->
        <div class="bg-neutral-50 rounded-lg p-4 lg:p-6 space-y-4">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search -->
            <div class="relative flex-1">
              <FontAwesomeIcon
                v-if="icons.search"
                :icon="icons.search"
                class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              />
              <Input
                v-model="searchQuery"
                placeholder="Rechercher un contenu..."
                class="pl-10"
              />
            </div>

            <!-- Theme filter -->
            <Select v-model="selectedTheme">
              <SelectTrigger class="w-full lg:w-[220px]">
                <SelectValue placeholder="Thematique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="(label, key) in themeFilterLabels"
                  :key="key"
                  :value="key"
                >
                  {{ label }} ({{ countByTheme[key] }})
                </SelectItem>
              </SelectContent>
            </Select>

            <!-- Content type filter -->
            <Select v-model="selectedContentType">
              <SelectTrigger class="w-full lg:w-[200px]">
                <SelectValue placeholder="Type de contenu" />
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
              v-if="selectedTheme !== 'all' || selectedContentType !== 'all' || searchQuery"
              variant="outline"
              @click="resetFilters"
            >
              Reinitialiser
            </Button>
          </div>

          <!-- Active filters badges -->
          <div v-if="selectedTheme !== 'all' || selectedContentType !== 'all'" class="flex flex-wrap gap-2">
            <Badge
              v-if="selectedTheme !== 'all'"
              :variant="`theme-${selectedTheme}-outline`"
              class="cursor-pointer"
              @click="selectedTheme = 'all'"
            >
              {{ themeLabels[selectedTheme] }} x
            </Badge>
            <Badge
              v-if="selectedContentType !== 'all'"
              variant="secondary"
              class="cursor-pointer"
              @click="selectedContentType = 'all'"
            >
              {{ contentTypeLabels[selectedContentType] }} x
            </Badge>
          </div>
        </div>
      </div>
    </section>

    <!-- Catalog Grid -->
    <section class="bg-neutral-50 py-12 lg:py-16">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Results count -->
        <div class="flex items-center justify-between mb-6">
          <p class="text-muted-foreground">
            <span class="font-semibold text-foreground">{{ filteredCatalog.length }}</span>
            {{ filteredCatalog.length > 1 ? 'contenus' : 'contenu' }}
            {{ filteredCatalog.length !== mockCatalog.length ? 'filtre(s)' : '' }}
          </p>
        </div>

        <!-- Grid -->
        <div
          v-if="filteredCatalog.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ThemedCard
            v-for="item in filteredCatalog"
            :key="item.id"
            :theme="item.theme"
            :thumbnail="item.thumbnail"
            :title="item.title"
            :description="item.description"
            :date="item.date"
            :content-type="item.contentType"
            :is-subscriber-only="item.isSubscriberOnly"
            :participants="item.participants"
            cta-label="Voir le contenu"
            class="cursor-pointer"
            @click="openModal(item)"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="text-center py-16 bg-white rounded-lg"
        >
          <p class="text-muted-foreground text-lg mb-4">
            Aucun contenu ne correspond a vos criteres.
          </p>
          <Button variant="outline" @click="resetFilters">
            Reinitialiser les filtres
          </Button>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <ThemedCardModal
      v-if="selectedItem"
      v-model:open="isModalOpen"
      :theme="selectedItem.theme"
      :thumbnail="selectedItem.thumbnail"
      :title="selectedItem.title"
      :date="selectedItem.date"
      :description="selectedItem.description"
      :content-type="selectedItem.contentType"
      :is-subscriber-only="selectedItem.isSubscriberOnly"
      :participants="selectedItem.participants"
      @view="handleView"
      @add="handleAdd"
      @download="handleDownload"
      @share="handleShare"
    />
  </DefaultLayout>
</template>
