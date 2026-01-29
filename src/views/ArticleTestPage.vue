<script setup lang="ts">
/**
 * ArticleTestPage - Article test : Or 2024
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logger } from '@/utils/logger'
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

// Mock article data
const mockArticle = ref({
  type: 'newsletter' as ContentType,
  title: "Pourquoi l'or atteint des sommets en 2024 : Analyse complète des facteurs économiques",
  chapeau: "En ce début d'année 2024, le cours de l'or a franchi des seuils historiques. Décryptage des facteurs fondamentaux qui expliquent cette hausse.",
  date: '2024-01-15',
  readTime: '8 min',
  author: 'Jean de Portal',
  image: 'https://placehold.co/1200x675/F2CC00/1D1D1D?text=Or+2024',
  content: `
<h2>Introduction : L'or, valeur refuge par excellence</h2>
<p>
  En ce début d'année 2024, le cours de l'or a franchi des seuils historiques, dépassant les
  <strong>2 100 dollars l'once</strong>. Cette performance exceptionnelle soulève de nombreuses
  questions chez les investisseurs, qu'ils soient novices ou expérimentés.
</p>
<p>
  Dans cette analyse approfondie, nous allons décrypter les <em>facteurs fondamentaux</em>
  qui expliquent cette hausse et vous donner les clés pour comprendre si cette tendance
  est amenée à se poursuivre. Voici un <a href="#">lien vers notre dossier complet</a> sur le sujet.
</p>

<h2>Evolution historique du cours de l'or</h2>
<p>
  Avant d'analyser les facteurs macro-économiques, observons l'évolution du cours de l'or
  sur les dernières années. Ce graphique illustre la tendance haussière depuis 2000.
</p>

<div
  data-imipie-chart
  data-family="gold"
  data-serie="lbmaSerie"
  data-start-date="2000-01-01"
  data-stop-date="2025-12-31"
  data-x-tick="730"
  data-height="400px"
  data-title="Cours de l'or LBMA (EUR/oz)"
></div>

<h2>Les facteurs macro-économiques</h2>
<h3>1. L'inflation persistante</h3>
<p>
  Malgré les efforts des banques centrales, l'inflation reste au-dessus des objectifs dans
  la plupart des économies développées. L'or, traditionnellement considéré comme une
  protection contre l'érosion monétaire, bénéficie directement de ce contexte.
</p>
<ul>
  <li>Inflation zone euro : 2.9% en décembre 2023</li>
  <li>Inflation USA : 3.4% en décembre 2023</li>
  <li>Prévisions 2024 : maintien au-dessus de 2%</li>
</ul>

<h3>2. Les tensions géopolitiques</h3>
<p>
  Les conflits en cours et les tensions commerciales sino-américaines renforcent l'attrait
  des actifs refuges. Les banques centrales des pays émergents, notamment la Chine,
  continuent d'accumuler des réserves d'or à un rythme soutenu.
</p>

<blockquote>
  <p>"L'or est la seule monnaie que les gouvernements ne peuvent pas dévaluer par simple décision politique."</p>
</blockquote>

<h3>3. Les politiques monétaires</h3>
<p>
  La perspective d'une baisse des taux directeurs en 2024 est favorable à l'or. En effet,
  des taux plus bas réduisent le coût d'opportunité de détenir de l'or, qui ne verse pas
  d'intérêts.
</p>

<h2>Comparatif : Or vs autres actifs refuges</h2>
<table>
  <thead>
    <tr>
      <th>Critère</th>
      <th>Or</th>
      <th>Argent</th>
      <th>Bitcoin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Volatilité</td>
      <td>Faible</td>
      <td>Moyenne</td>
      <td>Très élevée</td>
    </tr>
    <tr>
      <td>Liquidité</td>
      <td>Excellente</td>
      <td>Bonne</td>
      <td>Variable</td>
    </tr>
    <tr>
      <td>Stockage</td>
      <td>Physique/Papier</td>
      <td>Encombrant</td>
      <td>Numérique</td>
    </tr>
    <tr>
      <td>Track record</td>
      <td>5000 ans</td>
      <td>5000 ans</td>
      <td>15 ans</td>
    </tr>
  </tbody>
</table>

<h2>Nos recommandations pour 2024</h2>
<p>
  Sur la base de notre analyse, voici nos conseils pour intégrer l'or dans votre
  stratégie patrimoniale :
</p>
<ol>
  <li><strong>Allocation recommandée</strong> : 5 à 15% de votre patrimoine financier</li>
  <li><strong>Diversification</strong> : Combinez or physique et or papier (ETF)</li>
  <li><strong>Timing</strong> : Privilégiez les achats progressifs (DCA)</li>
  <li><strong>Horizon</strong> : Investissement à long terme (5+ ans)</li>
</ol>

<h3>Formule de calcul du ratio or/argent</h3>
<p>Pour suivre le marché, utilisez ce ratio simple :</p>
<pre><code>// Ratio historique moyen : 60-70
const ratio = prix_or / prix_argent;

// Interprétation :
// > 80 : Argent sous-évalué
// < 60 : Or sous-évalué
console.log("Ratio actuel:", ratio);</code></pre>

<h2>Conclusion</h2>
<p>
  L'or reste un pilier incontournable de toute stratégie de diversification patrimoniale.
  Dans le contexte actuel d'incertitudes économiques et géopolitiques, son rôle de
  valeur refuge n'a jamais été aussi pertinent.
</p>
<figure>
  <img src="https://placehold.co/800x400/F2CC00/1D1D1D?text=Evolution+Cours+Or" alt="Évolution du cours de l'or" />
  <figcaption>Évolution du cours de l'or sur 10 ans - Source : World Gold Council</figcaption>
</figure>
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
    type: 'article',
    title: "Toujours pas de droit de garde chez VeraCash",
    thumbnail: 'https://placehold.co/320x180/F2CC00/1D1D1D?text=VeraCash',
    date: '25 jan.',
    readTime: '2 min',
  },
  {
    id: '2',
    type: 'video',
    title: "Or : faut-il acheter maintenant ou attendre ?",
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    date: '24 jan.',
    duration: '18:32',
  },
  {
    id: '3',
    type: 'article',
    title: "Fiscalité de l'or : ce qui change en 2026",
    thumbnail: 'https://placehold.co/320x180/F4BFA6/1D1D1D?text=Fiscalite',
    date: '22 jan.',
    readTime: '6 min',
  },
])

// Handle suggested item click
const handleSuggestedClick = (item: SuggestedItem) => {
  if (item.type === 'video') {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
  } else {
    router.push('/articleShort')
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
    logger.error('Failed to copy link:', err)
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
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
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

            <!-- Chapeau -->
            <p class="text-lg text-muted-foreground mb-4">
              {{ mockArticle.chapeau }}
            </p>

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
