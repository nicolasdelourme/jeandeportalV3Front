/**
 * Mock API pour les actualités
 * Utilisé en mode développement (VITE_API_MODE=mock)
 * Émule des articles créés par Tiptap envoyés sous forme JSON
 */

import type { NewsItem, PaginatedNews, NewsQueryParams } from '@/types/news.types'
import { NEWS_CONFIG } from '@/types/news.types'

/**
 * Article court - Brève VeraCash
 * Publié le : 26/01/2026 à 10h54
 */
const ARTICLE_SHORT: NewsItem = {
  id: 'short-veracash',
  slug: 'toujours-pas-droit-garde-veracash',
  type: 'brief',
  title: 'Toujours pas de droit de garde chez VeraCash',
  excerpt:
    "Bonne nouvelle : le négociant français continue d'offrir le stockage gratuit de vos métaux précieux dans les Ports francs de Genève.",
  content: `<p>Au début de l'année 2025, VeraCash annonçait une future révision de ses tarifs et, notamment, l'ajout de frais de garde des métaux précieux. Il faut dire que le négociant ne facture rien pour le stockage sécurisé, audité et assuré de votre or et de votre argent dans ces chambres fortes des Ports francs de Genève. Et, en GoldPremium (jetons et pièces à cours légal), il n'y a pas de frais à la revente, ni de prime négative.</p>
<p>En clair, une fois les frais d'entrée payés (3 %), vous pouvez conserver votre métal jaune pendant des années, sans rien payer de plus (ce qui est très bénéfique en période de hausse du cours) ! A ce stade, le négociant français semble avoir abandonné l'idée et continue d'appliquer les tarifs de 2023, vous invitant même « ne pas vous soucier du stockage, il est offert » ! Pourvu que ça dure…</p>`,
  thumbnail:
    'https://www.shutterstock.com/shutterstock/photos/2209788541/display_1500/stock-photo-strong-room-gate-door-golden-color-for-safety-protect-valuable-in-bank-background-2209788541.jpg',
  publishedAt: new Date('2026-01-26T10:54:00'),
  readTime: 2,
  author: 'Nicolas Delourme',
  views: 3420,
}

/**
 * Article long - Euros hors système bancaire
 * Publié le : 26/01/2026 à 10h54
 */
const ARTICLE_LONG: NewsItem = {
  id: 'long-euros-hors-systeme',
  slug: 'euros-hors-systeme-bancaire',
  type: 'article',
  title: 'Comment détenir des euros sans dépendre du système bancaire ?',
  excerpt:
    "Si une crise de la dette frappait à son tour la France, les autorités pourraient instaurer des mesures déjà prises ailleurs (Grèce, Chypre…) ou prévue par la loi (blocage). Et vous, qu'avez-vous prévu ?",
  content: `<p>Qu'avez-vous prévu si, demain matin, vos retraits sont temporairement limités à quelques dizaines d'euros ? Si votre carte bancaire cesse de fonctionner pendant plusieurs heures, voire plusieurs jours ? Si une panne d'électricité ou un « bankrun » (panique bancaire) oblige les agences à baisser leur rideau de fer ? Ou si vos virements sont bloqués « par mesure de précaution », le temps que la situation se stabilise ? Ces scénarios ne relèvent pas de la fiction.</p>
<p>La Grèce a connu des retraits plafonnés et des comptes gelés lors de sa crise bancaire. L'Espagne a récemment expérimenté une panne généralisée d'électricité et, par conséquent, des systèmes de paiement. Dans la zone euro, Chypre a vu l'ensemble de ses banques fermer pendant près de deux semaines en 2013 (et pendant une semaine en Grèce deux ans plus tard). Dans tous ces cas, l'argent n'a pas disparu. Mais il est devenu <strong>inaccessible</strong>, au moins provisoirement. La France n'a pas connu de tels événements mais la <strong>loi Sapin II</strong> prévoit explicitement la possibilité de suspendre temporairement tout retrait de l'épargne placée en assurance-vie, en cas de risque de crise systémique.</p>
<p>La vraie question posée ici n'est pas de savoir si votre banque est solide, mais comment vous feriez face, concrètement, si l'accès à vos euros était perturbé. Pas forcément de manière durable. Mais dans l'intervalle – quelques jours, quelques semaines, le temps d'un retour à la normale – que feriez-vous ? Plusieurs solutions existent, chacune avec ses atouts et ses limites, à condition naturellement de les avoir prévues.</p>

<h2>Des espèces (trop) recherchées</h2>
<p>A court terme, dans les premiers jours de tension, les espèces jouent bien entendu un rôle essentiel. Disposez d'une réserve de billets et de pièces permettant de faire face à une défaillance des moyens de paiement, à un incident technique ou à une limitation ponctuelle des retraits temporaires salvateur. Tout Français devrait d'ailleurs prendre une telle précaution élémentaire, expressément conseillée par le gouvernement et la Banque centrale européenne eux-mêmes (à hauteur de 70 à 100 € par personne, ce qui semble bien insuffisant néanmoins).</p>
<p>Mais cette solution a ses propres limites : s'il est envisageable de se prémunir d'une impossibilité d'accéder à ses comptes bancaires pour quelques jours, réserver des sommes plus importantes en cash afin de tenir dans la durée pose des problèmes pratiques, sécuritaires ou réglementaires. Les espèces sont un tampon, pas une organisation financière en soi, a fortiori en cas de crise plus marquée. Dans ce cas, ne comptez pas retirer de l'argent facilement, même au guichet de votre agence (sous réserve qu'elle soit ouverte). Les banques n'ont évidemment ni le stock d'espèces suffisant ni la logistique nécessaire pour couvrir les besoins les plus courants en temps normal, alors imaginez au beau milieu d'une crise, quand tout le monde battra le pavé pour quelques billets !</p>

<h2>Et les métaux précieux ?</h2>
<p>Les métaux précieux physiques constituent la principale protection patrimoniale reconnue : détenir de l'or (ou de l'argent) vous permet de sortir du système bancaire et de conserver une valeur tangible et indépendante de toute signature monétaire. Pour autant, vous le savez, vivre en « grammes d'or » ne peut s'envisager qu'en cas de crise durable où cours de laquelle les billets de banque ne vaudraient plus rien. Dans une telle situation, les métaux précieux (re)deviendraient effectivement monnaies ultimes.</p>
<p>En revanche, si la restriction était plus mesurée – blocage partiel – voire réputée temporaire, sur quelques jours, or et argent ne seraient pas acceptés aussi spontanément dans la rue. La population, notamment française, y est tout simplement trop peu acculturée. Demandez autour de vous une estimation du prix d'un simple napoléon pour vous en convaincre (vous ne serez pas déçu du résultat) ! <strong>Sans confiance universelle, il n'y a pas de monnaie.</strong></p>

<div data-imipie-chart data-family="gold" data-serie="lbmaSerie" data-start-date="2020-01-01" data-stop-date="2025-12-31" data-x-tick="365" data-height="350px" data-title="Cours de l'or (EUR/oz) - Valeur refuge"></div>

<p>Et le bitcoin ? Lui aussi coche bien des cases puisqu'il est à la fois indépendant et décentralisé, donc impossible à bloquer par une quelconque autorité. Mais, sauf coup de bol, il ferait mal l'affaire en cas une crise : son prix fluctue bien trop fortement. Or, pour appréhender une période d'incertitude, il ne faut pas chercher à conserver un potentiel de gain grâce à la spéculation, mais à <em>sanctuariser une réserve de valeur stable</em>. Ainsi, le bitcoin qui peut très bien avoir toute sa place dans un patrimoine, ne permet pas de disposer d'un solide matelas en attendant que le système se débloque. Sinon d'un matelas… dégonflable !</p>

<h2>Titres financiers et immobiliers inopérants</h2>
<p>Les actions et autres titres financiers restent, quant à eux, entièrement dépendants de l'infrastructure bancaire et financière. Même si leur valeur fluctue indépendamment des comptes courants, leur détention passe par des intermédiaires, des plateformes et des systèmes de règlement centralisés. En cas de crise systémique, leur liquidité serait suspendue au moment même où vous en auriez besoin. Quant à l'immobilier, s'il protège sur le long terme, il est par définition illiquide (et illusoire pour faire face à une interruption temporaire des flux financiers).</p>`,
  encadres: [
    {
      type: 'alerte',
      content: `Détenir des stablecoins ne supprime pas tous les risques. Le principal est celui de la <strong>« contrepartie »</strong> : un stablecoin repose sur un émetteur privé qui s'engage à garantir la parité avec la devise de référence. Autrement dit, vous ne détenez pas une créance sur une banque centrale comme avec un billet, mais d'une créance envers une entreprise privée, comme une banque de détail (ni plus ni moins). Cette société gère des réserves censées couvrir l'ensemble des jetons en circulation.`,
    },
    {
      type: 'info',
      title: 'Qui sont les émetteurs de stablecoins ?',
      content: `Les stablecoins sont émis par des acteurs privés qui garantissent, sur le papier, la parité avec une devise officielle grâce à des réserves dédiées. Le risque de contrepartie n'étant pas nul – l'émetteur pouvant faire faillite emportant avec lui le magot –, il convient de se tourner vers les acteurs les plus solides. Le plus important d'entre eux est <strong>Tether</strong>, émetteur de l'USDT, aujourd'hui le stablecoin le plus utilisé au monde. Selon l'agence Bloomberg, Tether est devenu le 18ᵉ détenteur mondial de bons du Trésor américain, devant des pays comme l'Allemagne ou l'Arabie saoudite ! Environ deux tiers de ses réserves sont investis en dette américaine à court terme (moins d'un an), et près de 5 % en or, soit environ 80 tonnes de lingots, principalement conservées en Suisse.<br><br><strong>Circle</strong> est une autre entreprise américaine, émettrice de l'USDC et l'EURC : l'entreprise se distingue par une communication très orientée vers la transparence et la conformité, avec des réserves composées de liquidités et de dette d'État de court terme. Pour les Européens, l'EURC permet de détenir des euros numériques sans risque de change.<br><br>Enfin, <strong>SG-Forge</strong>, filiale de la Société Générale, émet l'EUR CoinVertible (EURCV). Son intérêt est surtout institutionnel : il illustre l'entrée des grandes banques européennes à pas mesuré dans l'univers des stablecoins.`,
    },
  ],
  thumbnail:
    'https://img.lemde.fr/2015/07/29/686/0/5211/2603/1342/671/60/0/abab459_44dcd005b408410ba645fcccfb529ee6-44dcd005b408410ba645fcccfb529ee6-0.jpg',
  publishedAt: new Date('2026-01-26T10:54:00'),
  readTime: 12,
  author: 'Nicolas Delourme',
  views: 8750,
}

/**
 * Les 3 vidéos YouTube de Nicolas Delourme
 */
const VIDEO_1: NewsItem = {
  id: 'yt-video-1',
  slug: 'video-nicolas-delourme-1',
  type: 'video',
  title: 'Vidéo Nicolas Delourme #1',
  excerpt: "Dans cette vidéo, Nicolas Delourme décrypte les dernières évolutions du marché de l'or et vous livre ses conseils pour optimiser vos investissements en métaux précieux.",
  youtubeId: 'hxGC2H2tFvY',
  thumbnail: 'https://img.youtube.com/vi/hxGC2H2tFvY/mqdefault.jpg',
  publishedAt: new Date('2026-01-25T14:00:00'),
  duration: 1200,
  author: 'Nicolas Delourme',
  views: 15420,
}

const VIDEO_2: NewsItem = {
  id: 'yt-video-2',
  slug: 'video-nicolas-delourme-2',
  type: 'video',
  title: 'Vidéo Nicolas Delourme #2',
  excerpt: "Point hebdomadaire sur les cours de l'or et de l'argent : analyse technique, niveaux clés à surveiller et perspectives pour les semaines à venir.",
  youtubeId: 'Y9PYpw6dd4Q',
  thumbnail: 'https://img.youtube.com/vi/Y9PYpw6dd4Q/mqdefault.jpg',
  publishedAt: new Date('2026-01-24T10:00:00'),
  duration: 1245,
  author: 'Nicolas Delourme',
  views: 9870,
}

const VIDEO_3: NewsItem = {
  id: 'yt-video-3',
  slug: 'video-nicolas-delourme-3',
  type: 'video',
  title: 'Vidéo Nicolas Delourme #3',
  excerpt: "Comment construire un portefeuille résilient face aux crises ? Nicolas Delourme partage ses stratégies d'allocation entre or physique, argent et liquidités.",
  youtubeId: 'jN-FLG3xo5k',
  thumbnail: 'https://img.youtube.com/vi/jN-FLG3xo5k/mqdefault.jpg',
  publishedAt: new Date('2026-01-23T11:00:00'),
  duration: 1890,
  author: 'Nicolas Delourme',
  views: 12350,
}

/**
 * Génère des items en boucle pour la pagination
 * 2 articles + 3 vidéos qui se répètent
 */
function generateMockNews(): NewsItem[] {
  const baseItems: NewsItem[] = [ARTICLE_LONG, ARTICLE_SHORT, VIDEO_1, VIDEO_2, VIDEO_3]
  const result: NewsItem[] = []

  // On génère 30 items en répétant les 5 de base
  for (let i = 0; i < 30; i++) {
    const baseItem = baseItems[i % baseItems.length]!
    const daysAgo = i // Chaque item est 1 jour plus ancien

    result.push({
      ...baseItem,
      id: `${baseItem.id}-${i}`,
      slug: `${baseItem.slug}-${i}`,
      publishedAt: new Date(
        new Date('2026-01-26T10:54:00').getTime() - daysAgo * 24 * 60 * 60 * 1000
      ),
      views: Math.floor((baseItem.views ?? 1000) * (1 - i * 0.02)), // Moins de vues pour les plus anciens
    })
  }

  return result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

/**
 * Données mock des actualités
 */
const MOCK_NEWS: NewsItem[] = generateMockNews()

/**
 * Simule un délai réseau
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock API pour récupérer la liste des actualités
 */
export async function mockFetchNews(params?: NewsQueryParams): Promise<PaginatedNews> {
  await delay(300)

  const page = params?.page ?? 1
  const pageSize = params?.pageSize ?? NEWS_CONFIG.DEFAULT_PAGE_SIZE
  const type = params?.type

  // Filtrer par type si spécifié
  let filteredNews = type ? MOCK_NEWS.filter((item) => item.type === type) : MOCK_NEWS

  // Trier par date de publication (plus récent en premier)
  filteredNews = [...filteredNews].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  )

  // Pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = filteredNews.slice(start, end)

  return {
    items,
    total: filteredNews.length,
    page,
    pageSize,
  }
}

/**
 * Mock API pour récupérer un item par son slug
 */
export async function mockFetchNewsItem(slug: string): Promise<NewsItem | null> {
  await delay(200)

  const item = MOCK_NEWS.find((news) => news.slug === slug)
  return item ?? null
}

/**
 * Mock API pour récupérer les actualités tendances (les plus lues)
 */
export async function mockFetchTrending(): Promise<NewsItem[]> {
  await delay(200)

  // Trier par nombre de vues et prendre les N premiers
  return [...MOCK_NEWS]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, NEWS_CONFIG.TRENDING_COUNT)
}

/**
 * Mock API pour récupérer les dernières actualités (En Continu)
 */
export async function mockFetchLatest(
  limit: number = NEWS_CONFIG.LIVE_FEED_COUNT
): Promise<NewsItem[]> {
  await delay(200)

  // Trier par date et prendre les N premiers
  return [...MOCK_NEWS]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit)
}

/**
 * Mock API pour récupérer l'actualité à la une (featured)
 */
export async function mockFetchFeatured(): Promise<NewsItem | null> {
  await delay(200)

  // Retourne l'article long comme featured (le plus complet)
  const featured = MOCK_NEWS.find(
    (item) => item.slug.startsWith('euros-hors-systeme-bancaire')
  )
  return featured ?? MOCK_NEWS[0] ?? null
}
