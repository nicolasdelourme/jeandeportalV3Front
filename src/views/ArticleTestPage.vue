<script setup lang="ts">
/**
 * ArticleTestPage - Simulation d'une vraie page article
 * Layout 3 colonnes avec partage social, contenu principal, et sidebar
 */
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { ProseContent } from '@/components/ui/prose-content'
import { ThemedCard } from '@/components/ui/themed-card'
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
import { getThemeClasses, themeLabels, type ThemeType } from '@/components/ui/themed-card'
import type { ContentType } from '@/components/ui/themed-card/ThemedCard.vue'

// Shop integration
import ProductCard from '@/components/shop/ProductCard.vue'
import { useShopStore } from '@/stores/shop.store'
import { useCartStore } from '@/stores/cart.store'
import type { ShopReference } from '@/types/shop-api.types'
import { decodeHTMLEntities } from '@/types/shop-api.types'
import { CartError } from '@/types/cart.types'

const router = useRouter()
const shopStore = useShopStore()
const cartStore = useCartStore()

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
  star: byPrefixAndName.fas?.['star'],
  envelope: byPrefixAndName.fas?.['envelope'],
  shareNodes: byPrefixAndName.fas?.['share-nodes'],
}))

// Load shop catalog on mount
onMounted(() => {
  shopStore.fetchCatalog()
})

// Get first 4 products for display
const suggestedProducts = computed(() => {
  return shopStore.sortedReferences.slice(0, 4)
})

// Product handlers
const handleViewDetails = (reference: ShopReference) => {
  router.push(`/boutique/${reference.id}`)
}

const handleAddToCart = async (reference: ShopReference) => {
  try {
    const productId = reference.products[0]?.id
    if (!productId) {
      toast.error('Produit non disponible')
      return
    }
    await cartStore.addItem(Number(productId))
    toast.success(`${decodeHTMLEntities(reference.name)} ajoute au panier`)
  } catch (error) {
    if (error instanceof CartError) {
      toast.error(error.message)
    } else {
      toast.error('Impossible d\'ajouter au panier')
    }
  }
}

// Mock article data
const mockArticle = ref({
  theme: 'metaux' as ThemeType,
  type: 'newsletter' as ContentType,
  title: "Pourquoi l'or atteint des sommets en 2024 : Analyse complete des facteurs economiques",
  date: '2024-01-15',
  readTime: '8 min',
  author: 'Jean de Portal',
  image: 'https://placehold.co/1200x675/F2CC00/1D1D1D?text=Or+2024',
  content: `
<h2>Introduction : L'or, valeur refuge par excellence</h2>
<p>
  En ce debut d'annee 2024, le cours de l'or a franchi des seuils historiques, depassant les
  <strong>2 100 dollars l'once</strong>. Cette performance exceptionnelle souleve de nombreuses
  questions chez les investisseurs, qu'ils soient novices ou experimentes.
</p>
<p>
  Dans cette analyse approfondie, nous allons decrypter les <em>facteurs fondamentaux</em>
  qui expliquent cette hausse et vous donner les cles pour comprendre si cette tendance
  est amenee a se poursuivre. Voici un <a href="#">lien vers notre dossier complet</a> sur le sujet.
</p>

<h2>Les facteurs macro-economiques</h2>
<h3>1. L'inflation persistante</h3>
<p>
  Malgre les efforts des banques centrales, l'inflation reste au-dessus des objectifs dans
  la plupart des economies developpees. L'or, traditionnellement considere comme une
  protection contre l'erosion monetaire, beneficie directement de ce contexte.
</p>
<ul>
  <li>Inflation zone euro : 2.9% en decembre 2023</li>
  <li>Inflation USA : 3.4% en decembre 2023</li>
  <li>Previsions 2024 : maintien au-dessus de 2%</li>
</ul>

<h3>2. Les tensions geopolitiques</h3>
<p>
  Les conflits en cours et les tensions commerciales sino-americaines renforcent l'attrait
  des actifs refuges. Les banques centrales des pays emergents, notamment la Chine,
  continuent d'accumuler des reserves d'or a un rythme soutenu.
</p>

<blockquote>
  <p>"L'or est la seule monnaie que les gouvernements ne peuvent pas devaluer par simple decision politique."</p>
</blockquote>

<h3>3. Les politiques monetaires</h3>
<p>
  La perspective d'une baisse des taux directeurs en 2024 est favorable a l'or. En effet,
  des taux plus bas reduisent le cout d'opportunite de detenir de l'or, qui ne verse pas
  d'interets.
</p>

<h2>Comparatif : Or vs autres actifs refuges</h2>
<table>
  <thead>
    <tr>
      <th>Critere</th>
      <th>Or</th>
      <th>Argent</th>
      <th>Bitcoin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Volatilite</td>
      <td>Faible</td>
      <td>Moyenne</td>
      <td>Tres elevee</td>
    </tr>
    <tr>
      <td>Liquidite</td>
      <td>Excellente</td>
      <td>Bonne</td>
      <td>Variable</td>
    </tr>
    <tr>
      <td>Stockage</td>
      <td>Physique/Papier</td>
      <td>Encombrant</td>
      <td>Numerique</td>
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
  Sur la base de notre analyse, voici nos conseils pour integrer l'or dans votre
  strategie patrimoniale :
</p>
<ol>
  <li><strong>Allocation recommandee</strong> : 5 a 15% de votre patrimoine financier</li>
  <li><strong>Diversification</strong> : Combinez or physique et or papier (ETF)</li>
  <li><strong>Timing</strong> : Privilegiez les achats progressifs (DCA)</li>
  <li><strong>Horizon</strong> : Investissement a long terme (5+ ans)</li>
</ol>

<h3>Formule de calcul du ratio or/argent</h3>
<p>Pour suivre le marche, utilisez ce ratio simple :</p>
<pre><code>// Ratio historique moyen : 60-70
const ratio = prix_or / prix_argent;

// Interpretation :
// > 80 : Argent sous-evalue
// < 60 : Or sous-evalue
console.log("Ratio actuel:", ratio);</code></pre>

<h2>Conclusion</h2>
<p>
  L'or reste un pilier incontournable de toute strategie de diversification patrimoniale.
  Dans le contexte actuel d'incertitudes economiques et geopolitiques, son role de
  valeur refuge n'a jamais ete aussi pertinent.
</p>
<figure>
  <img src="https://placehold.co/800x400/F2CC00/1D1D1D?text=Evolution+Cours+Or" alt="Evolution du cours de l'or" />
  <figcaption>Evolution du cours de l'or sur 10 ans - Source : World Gold Council</figcaption>
</figure>
`
})

// Mock suggested articles
const suggestedArticles = ref([
  {
    theme: 'metaux' as ThemeType,
    contentType: 'tuto' as ContentType,
    title: "Comment acheter de l'or physique en France",
    description: "Guide complet pour acquerir des pieces et lingots en toute securite.",
    thumbnail: 'https://placehold.co/600x400/F2CC00/1D1D1D?text=Tuto+Or',
    date: new Date('2024-01-10'),
    isSubscriberOnly: true,
  },
  {
    theme: 'portefeuille' as ThemeType,
    contentType: 'newsletter' as ContentType,
    title: "Portefeuille permanent : bilan du T4 2023",
    description: "Analyse de performance et ajustements recommandes pour 2024.",
    thumbnail: 'https://placehold.co/600x400/A8C7EA/1D1D1D?text=Portefeuille',
    date: new Date('2024-01-08'),
    isSubscriberOnly: false,
  },
  {
    theme: 'liberte' as ThemeType,
    contentType: 'dossier' as ContentType,
    title: "Les 10 etapes vers l'independance financiere",
    description: "Methode eprouvee pour atteindre la liberte financiere en 10 ans.",
    thumbnail: 'https://placehold.co/600x400/F4BFA6/1D1D1D?text=Liberte',
    date: new Date('2024-01-05'),
    isSubscriberOnly: true,
  },
])

// Theme classes
const themeClasses = computed(() => getThemeClasses(mockArticle.value.theme))

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
    video: 'Tuto Video',
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
    <section class="bg-white py-8 lg:py-12">
      <div class="max-w-6xl mx-auto px-4">
        <!-- Breadcrumb shadcn -->
        <Breadcrumb class="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/academie">Academie</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink :href="`/academie/${mockArticle.theme}`">
                {{ themeLabels[mockArticle.theme] }}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Article</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge :variant="`theme-${mockArticle.theme}-outline`">
            {{ themeLabels[mockArticle.theme] }}
          </Badge>
          <Badge :variant="`theme-${mockArticle.theme}-outline`" class="gap-1.5">
            <FontAwesomeIcon v-if="contentTypeIcon" :icon="contentTypeIcon" class="size-3" />
            {{ contentTypeLabel }}
          </Badge>
        </div>

        <!-- Title -->
        <h1 class="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-4xl">
          {{ mockArticle.title }}
        </h1>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
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

        <!-- Main Image -->
        <AspectRatio :ratio="16/9" class="overflow-hidden rounded-lg bg-neutral-100">
          <img
            :src="mockArticle.image"
            :alt="mockArticle.title"
            class="w-full h-full object-cover"
          />
        </AspectRatio>

        <!-- Mobile Social Share (visible on mobile only) -->
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
    </section>

    <!-- Main Content Section -->
    <section class="bg-neutral-50 py-12 lg:py-16" :class="['theme-' + mockArticle.theme]">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-[60px_1fr_280px] gap-6 lg:gap-8">
          <!-- Left Column - Social Share (Desktop) -->
          <div class="hidden lg:block">
            <div class="sticky top-24 flex flex-col gap-2">
              <Button variant="outline" size="icon" rounded="lg" @click="shareOnFacebook" title="Partager sur Facebook">
                <FontAwesomeIcon v-if="icons.facebook" :icon="icons.facebook" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" rounded="lg" @click="shareOnTwitter" title="Partager sur X">
                <FontAwesomeIcon v-if="icons.twitter" :icon="icons.twitter" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" rounded="lg" @click="shareOnLinkedIn" title="Partager sur LinkedIn">
                <FontAwesomeIcon v-if="icons.linkedin" :icon="icons.linkedin" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" rounded="lg" @click="shareByEmail" title="Envoyer par email">
                <FontAwesomeIcon v-if="icons.envelope" :icon="icons.envelope" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" rounded="lg" @click="copyLink" title="Copier le lien">
                <FontAwesomeIcon v-if="linkCopied && icons.check" :icon="icons.check" class="size-4 text-green-600" />
                <FontAwesomeIcon v-else-if="icons.link" :icon="icons.link" class="size-4" />
              </Button>
            </div>
          </div>

          <!-- Center Column - Article Content -->
          <div class="order-2 lg:order-none">
            <div class="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <ProseContent :html="mockArticle.content" />
            </div>
          </div>

          <!-- Right Column - Sidebar -->
          <div class="order-1 lg:order-none">
            <div class="sticky top-24 space-y-6">
              <!-- Subscription Card -->
              <Card :class="['border-2 rounded-lg', themeClasses.border]">
                <CardContent class="p-4 space-y-4">
                  <div class="flex items-center gap-2">
                    <FontAwesomeIcon v-if="icons.star" :icon="icons.star" :class="['size-5', themeClasses.text === 'text-white' ? 'text-foreground' : '']" :style="{ color: `var(--color-theme-${mockArticle.theme})` }" />
                    <h4 class="font-heading font-bold text-lg">Acces Premium</h4>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Debloquez tous les contenus {{ themeLabels[mockArticle.theme] }} avec l'abonnement Premium.
                  </p>
                  <ul class="text-sm space-y-2">
                    <li class="flex items-center gap-2">
                      <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="size-4 text-green-600" />
                      <span>Newsletters exclusives</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="size-4 text-green-600" />
                      <span>Tutos video approfondis</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="size-4 text-green-600" />
                      <span>Acces aux archives</span>
                    </li>
                  </ul>
                  <Button :color="mockArticle.theme" class="w-full" rounded="lg">
                    S'abonner
                  </Button>
                  <p class="text-xs text-center text-muted-foreground">
                    A partir de 9,90 EUR/mois
                  </p>
                </CardContent>
              </Card>

              <!-- Related Product Card in Sidebar -->
              <ProductCard
                v-if="suggestedProducts[0]"
                :reference="suggestedProducts[0]"
                size="small"
                @view-details="handleViewDetails"
                @add-to-cart="handleAddToCart"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Suggested Articles Section -->
    <section class="bg-white py-12 lg:py-16">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
          A lire aussi
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ThemedCard
            v-for="(article, index) in suggestedArticles"
            :key="index"
            :theme="article.theme"
            :thumbnail="article.thumbnail"
            :title="article.title"
            :description="article.description"
            :date="article.date"
            :content-type="article.contentType"
            :is-subscriber-only="article.isSubscriberOnly"
          />
        </div>
      </div>
    </section>

    <!-- Products Section with real ProductCards -->
    <section class="bg-neutral-50 py-12 lg:py-16">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Dans notre boutique
          </h2>
          <Button variant="outline" @click="router.push('/boutique')">
            Voir tout
          </Button>
        </div>

        <!-- Loading state -->
        <div v-if="shopStore.isLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border border-primary/20 border-t-primary"></div>
          <p class="mt-2 text-muted-foreground text-sm">Chargement...</p>
        </div>

        <!-- Products grid -->
        <div
          v-else-if="suggestedProducts.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          <ProductCard
            v-for="reference in suggestedProducts"
            :key="reference.id"
            :reference="reference"
            size="medium"
            class="h-full"
            @view-details="handleViewDetails"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <p class="text-muted-foreground">Aucun produit disponible pour le moment.</p>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
