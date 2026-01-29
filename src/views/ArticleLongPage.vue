<script setup lang="ts">
/**
 * ArticleLongPage - Article long : Stablecoins et euros
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
  triangleExclamation: byPrefixAndName.fas?.['triangle-exclamation'],
  circleInfo: byPrefixAndName.fas?.['circle-info'],
}))

// Article long - Stablecoins
const mockArticle = ref({
  type: 'dossier' as ContentType,
  title: "Comment détenir des euros sans dépendre du système bancaire ?",
  chapeau: "Si une crise de la dette frappait à son tour la France, les autorités pourraient instaurer des mesures déjà prises ailleurs (Grèce, Chypre…) ou prévues par la loi (blocage). Et vous, qu'avez-vous prévu ?",
  date: '2026-01-26',
  readTime: '12 min',
  author: 'Nicolas Delourme',
  image: 'https://img.lemde.fr/2015/07/29/686/0/5211/2603/1342/671/60/0/abab459_44dcd005b408410ba645fcccfb529ee6-44dcd005b408410ba645fcccfb529ee6-0.jpg',
  content: `
<p class="text-lg font-medium text-foreground">
  Qu'avez-vous prévu si, demain matin, vos retraits sont temporairement limités à quelques dizaines d'euros ? Si votre carte bancaire cesse de fonctionner pendant plusieurs heures, voire plusieurs jours ? Si une panne d'électricité ou un « bankrun » (panique bancaire) oblige les agences à baisser leur rideau de fer ? Ou si vos virements sont bloqués « par mesure de précaution », le temps que la situation se stabilise ? Ces scénarios ne relèvent pas de la fiction.
</p>

<p>
  La Grèce a connu des retraits plafonnés et des comptes gelés lors de sa crise bancaire. L'Espagne a récemment expérimenté une panne généralisée d'électricité et, par conséquent, des systèmes de paiement. Dans la zone euro, Chypre a vu l'ensemble de ses banques fermer pendant près de deux semaines en 2013 (et pendant une semaine en Grèce deux ans plus tard). Dans tous ces cas, l'argent n'a pas disparu. Mais il est devenu <strong>inaccessible</strong>, au moins provisoirement.
</p>

<p>
  La France n'a pas connu de tels événements mais la <strong>loi Sapin II</strong> prévoit explicitement la possibilité de suspendre temporairement tout retrait de l'épargne placée en assurance-vie, en cas de risque de crise systémique.
</p>

<p>
  La vraie question posée ici n'est pas de savoir si votre banque est solide, mais comment vous feriez face, concrètement, si l'accès à vos euros était perturbé. Pas forcément de manière durable. Mais dans l'intervalle – quelques jours, quelques semaines, le temps d'un retour à la normale – que feriez-vous ? Plusieurs solutions existent, chacune avec ses atouts et ses limites, à condition naturellement de les avoir prévues.
</p>

<h2>Des espèces (trop) recherchées</h2>

<p>
  À court terme, dans les premiers jours de tension, les espèces jouent bien entendu un rôle essentiel. Disposer d'une réserve de billets et de pièces permet de faire face à une défaillance des moyens de paiement, à un incident technique ou à une limitation ponctuelle des retraits temporaires salvateur. Tout Français devrait d'ailleurs prendre une telle précaution élémentaire, expressément conseillée par le gouvernement et la Banque centrale européenne eux-mêmes (à hauteur de 70 à 100 € par personne, ce qui semble bien insuffisant néanmoins).
</p>

<p>
  Mais cette solution a ses propres limites : s'il est envisageable de se prémunir d'une impossibilité d'accéder à ses comptes bancaires pour quelques jours, réserver des sommes plus importantes en cash afin de tenir dans la durée pose des problèmes pratiques, sécuritaires ou réglementaires. Les espèces sont un tampon, pas une organisation financière en soi, a fortiori en cas de crise plus marquée. Dans ce cas, ne comptez pas retirer de l'argent facilement, même au guichet de votre agence (sous réserve qu'elle soit ouverte). Les banques n'ont évidemment ni le stock d'espèces suffisant ni la logistique nécessaire pour couvrir les besoins les plus courants en temps normal, alors imaginez au beau milieu d'une crise, quand tout le monde battra le pavé pour quelques billets !
</p>

<h2>Et les métaux précieux ?</h2>

<p>
  Les métaux précieux physiques constituent la principale protection patrimoniale reconnue : détenir de l'or (ou de l'argent) vous permet de sortir du système bancaire et de conserver une valeur tangible et indépendante de toute signature monétaire. Pour autant, vous le savez, vivre en « grammes d'or » ne peut s'envisager qu'en cas de crise durable où cours de laquelle les billets de banque ne vaudraient plus rien. Dans une telle situation, les métaux précieux (re)deviendraient effectivement monnaies ultimes.
</p>

<p>
  En revanche, si la restriction était plus mesurée – blocage partiel – voire réputée temporaire, sur quelques jours, or et argent ne seraient pas acceptés aussi spontanément dans la rue. La population, notamment française, y est tout simplement trop peu acculturée. Demandez autour de vous une estimation du prix d'un simple napoléon pour vous en convaincre (vous ne serez pas déçu du résultat) ! <strong>Sans confiance universelle, il n'y a pas de monnaie.</strong>
</p>

<p>
  Et le bitcoin ? Lui aussi coche bien des cases puisqu'il est à la fois indépendant et décentralisé, donc impossible à bloquer par une quelconque autorité. Mais, sauf coup de bol, il ferait mal l'affaire en cas de crise : son prix fluctue bien trop fortement. Or, pour appréhender une période d'incertitude, il ne faut pas chercher à conserver un potentiel de gain grâce à la spéculation, mais à <em>sanctuariser une réserve de valeur stable</em>. Ainsi, le bitcoin qui peut très bien avoir toute sa place dans un patrimoine, ne permet pas de disposer d'un solide matelas en attendant que le système se débloque. Sinon d'un matelas… dégonflable !
</p>

<h2>Titres financiers et immobiliers inopérants</h2>

<p>
  Les actions et autres titres financiers restent, quant à eux, entièrement dépendants de l'infrastructure bancaire et financière. Même si leur valeur fluctue indépendamment des comptes courants, leur détention passe par des intermédiaires, des plateformes et des systèmes de règlement centralisés. En cas de crise systémique, leur liquidité serait suspendue au moment même où vous en auriez besoin. Quant à l'immobilier, s'il protège sur le long terme, il est par définition illiquide (et illusoire pour faire face à une interruption temporaire des flux financiers).
</p>
`
})

// Encadré court (alerte sans titre)
const encadreCourt = `Détenir des stablecoins ne supprime pas tous les risques. Le principal est celui de la <strong>« contrepartie »</strong> : un stablecoin repose sur un émetteur privé qui s'engage à garantir la parité avec la devise de référence. Autrement dit, vous ne détenez pas une créance sur une banque centrale comme avec un billet, mais d'une créance envers une entreprise privée, comme une banque de détail (ni plus ni moins). Cette société gère des réserves censées couvrir l'ensemble des jetons en circulation.`

// Encadré long (avec titre)
const encadreLongTitle = "Qui sont les émetteurs de stablecoins ?"
const encadreLongContent = `Les stablecoins sont émis par des acteurs privés qui garantissent, sur le papier, la parité avec une devise officielle grâce à des réserves dédiées. Le risque de contrepartie n'étant pas nul – l'émetteur pouvant faire faillite emportant avec lui le magot –, il convient de se tourner vers les acteurs les plus solides. Le plus important d'entre eux est <strong>Tether</strong>, émetteur de l'USDT, aujourd'hui le stablecoin le plus utilisé au monde. Selon l'agence Bloomberg, Tether est devenu le 18ᵉ détenteur mondial de bons du Trésor américain, devant des pays comme l'Allemagne ou l'Arabie saoudite ! Environ deux tiers de ses réserves sont investis en dette américaine à court terme (moins d'un an), et près de 5 % en or, soit environ 80 tonnes de lingots, principalement conservées en Suisse.<br><br><strong>Circle</strong> est une autre entreprise américaine, émettrice de l'USDC et l'EURC : l'entreprise se distingue par une communication très orientée vers la transparence et la conformité, avec des réserves composées de liquidités et de dette d'État de court terme. Pour les Européens, l'EURC permet de détenir des euros numériques sans risque de change.<br><br>Enfin, <strong>SG-Forge</strong>, filiale de la Société Générale, émet l'EUR CoinVertible (EURCV). Son intérêt est surtout institutionnel : il illustre l'entrée des grandes banques européennes à pas mesuré dans l'univers des stablecoins.`

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
          <div class="order-2 lg:order-0 space-y-6">
            <!-- Main content -->
            <div class="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <ProseContent :html="mockArticle.content" />
            </div>

            <!-- Encadré court (alerte) -->
            <Card class="border-l-4 border-l-primary rounded-lg bg-primary/10">
              <CardContent class="p-4 lg:p-6">
                <div class="flex items-start gap-3">
                  <FontAwesomeIcon v-if="icons.triangleExclamation" :icon="icons.triangleExclamation" class="size-5 mt-0.5 shrink-0 text-primary" />
                  <p class="text-sm text-foreground leading-relaxed" v-html="encadreCourt"></p>
                </div>
              </CardContent>
            </Card>

            <!-- Encadré long (info box avec titre) -->
            <Card class="border-2 border-primary rounded-lg">
              <CardContent class="p-4 lg:p-6 space-y-3">
                <div class="flex items-center gap-2">
                  <FontAwesomeIcon v-if="icons.circleInfo" :icon="icons.circleInfo" class="size-5 text-primary" />
                  <h4 class="font-heading font-bold text-lg">{{ encadreLongTitle }}</h4>
                </div>
                <p class="text-sm text-muted-foreground leading-relaxed" v-html="encadreLongContent"></p>
              </CardContent>
            </Card>
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
