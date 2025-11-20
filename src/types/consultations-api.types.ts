/**
 * Types pour l'API fetchWebinarList
 * Structure exacte de la réponse de https://jeandeportal.fr/fetchWebinarList
 */

/**
 * Structure ISO 8601 pour les dates de consultation
 */
export interface WebinarISO8601 {
  start: string // Format: "20250424T163000Z"
  end: string // Format: "20250424T174500Z"
}

/**
 * Informations détaillées sur la date d'un webinaire
 */
export interface WebinarDate {
  date: string // Format: "YYYY-MM-DD HH:MM:SS"
  weekDay: string // "jeudi", "vendredi", etc.
  numberDay: string // "24", "1", etc.
  month: string // "avril", "mai", etc.
  hour: string // "18"
  minute: string // "30"
  year: string // "2025"
  iso8601: WebinarISO8601
}

/**
 * Image associée à une consultation (via productId)
 */
export interface WebinarImage {
  id: string
  imageTypeId: string
  name: string
  description: string
  width: string
  height: string
  size: string
  tag: string
  path: string
  timestamp: string
  imageId: string
  productId: string
}

/**
 * Structure complète d'un webinaire depuis l'API
 */
export interface APIWebinar {
  id: string
  typeId: string // 2=argent, 3=patrimoine, 4=immobilier, 5=métaux
  fileId: string | null
  productId: string | null
  name: string // Contient du HTML (balises <b>, &nbsp;)
  description: string // Contient du HTML (balises <strong>, &nbsp;)
  tag: 'argent' | 'métaux précieux' | 'patrimoine' | 'immobilier'
  participant: string
  date: WebinarDate
  duration: string // En minutes
  viewPath: string
  url: string
  groupId: string
  videoId: string // YouTube video ID pour le player (utilisé dans la page player)
  thumbnail: string // Chemin relatif vers l'image
  pendingReroute: string
  directView: string
  replayView: string
  directGroupId: string
  mailchimpAutomationTriggerGroupId: string
  mailchimpAutomationStart: string // Format: "YYYY-MM-DD HH:MM:SS"
  visibility: 'restricted' | 'public' | 'premium'
  timestamp: string // Format: "YYYY-MM-DD HH:MM:SS"
  minutesToLive: string // Peut être négatif (passé) ou positif (futur)
  dateFormatted: string // " 1 mai 2025 à 16h30"
  shortDescription: string // Description tronquée avec HTML
  tag_array: string[]
  technicalTag_array: string[]
  image_array: WebinarImage[]
  fileDownload: string | null
}

/**
 * Réponse complète de l'API fetchWebinarList
 */
export interface APIWebinarListResponse {
  webinar: APIWebinar[]
  lastWebinar: number // ID du dernier webinaire passé (replay)
  nextWebinar: number // ID du prochain webinaire à venir
}

/**
 * Type de catégorie pour les filtres (version normalisée)
 */
export type FilterCategory = 'argent' | 'metaux' | 'patrimoine' | 'immobilier'

/**
 * Mapping des typeId vers les catégories de filtre
 * typeId: 2=argent, 3=patrimoine, 4=immobilier, 5=métaux
 */
const TYPE_ID_TO_CATEGORY: Record<string, FilterCategory> = {
  '2': 'argent',
  '3': 'patrimoine',
  '4': 'immobilier',
  '5': 'metaux',
}

/**
 * Convertir le typeId en catégorie de filtre (méthode recommandée)
 * @param typeId - ID du type de consultation (2, 3, 4, 5)
 * @returns Catégorie normalisée
 */
export function typeIdToFilterCategory(typeId: string): FilterCategory {
  return TYPE_ID_TO_CATEGORY[typeId] || 'argent'
}

/**
 * Convertir le tag API en catégorie de filtre (DEPRECATED - utiliser typeIdToFilterCategory)
 * @deprecated Utiliser typeIdToFilterCategory(webinar.typeId) au lieu de apiTagToFilterCategory(webinar.tag)
 */
export function apiTagToFilterCategory(tag: APIWebinar['tag']): FilterCategory {
  if (tag === 'métaux précieux') return 'metaux'
  return tag as FilterCategory
}

/**
 * Obtenir la catégorie à partir d'un webinaire (utilise typeId en priorité)
 * @param webinar - Webinaire complet
 * @returns Catégorie normalisée
 */
export function getWebinarCategory(webinar: APIWebinar): FilterCategory {
  return typeIdToFilterCategory(webinar.typeId)
}

/**
 * Helper pour nettoyer le HTML des descriptions (DEPRECATED - utiliser sanitizeHtml de html.utils)
 * @deprecated Utiliser sanitizeHtml() ou stripHtml() depuis @/utils/html.utils
 * @param html - Texte contenant du HTML (ex: "Les <b>consultations</b> &nbsp;")
 * @returns Texte nettoyé
 */
export function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Retirer les balises HTML
    .replace(/&nbsp;/g, ' ') // Remplacer &nbsp; par espace
    .replace(/&&nbsp;/g, ' ') // Remplacer &&nbsp; par espace
    .replace(/&amp;/g, '&')
    .trim()
}

/**
 * Construire l'URL complète d'une image
 * Gère tous les formats de chemins : absolus, relatifs, avec ou sans slash initial
 *
 * @param relativePath - Chemin depuis l'API (ex: "project/...", "/project/...", "https://...")
 * @returns URL complète vers l'image
 *
 * @example
 * getFullImageUrl('project/jeandeportalV2/images/...')
 * // => 'https://jeandeportal.fr/project/jeandeportalV2/images/...'
 *
 * getFullImageUrl('/project/jeandeportalV2/images/...')
 * // => 'https://jeandeportal.fr/project/jeandeportalV2/images/...'
 *
 * getFullImageUrl('https://cdn.example.com/image.jpg')
 * // => 'https://cdn.example.com/image.jpg'
 */
export function getFullImageUrl(relativePath: string | null | undefined): string {
  // Si le chemin est vide ou null, retourner une image placeholder
  if (!relativePath) {
    return 'https://via.placeholder.com/400x300?text=Image+indisponible'
  }

  // Si c'est déjà une URL complète (http ou https), la retourner telle quelle
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath
  }

  // Nettoyer le chemin : supprimer le slash initial s'il existe
  let cleanPath = relativePath.startsWith('/')
    ? relativePath.substring(1)
    : relativePath

  // Fix typo dans les données API : cconsultations -> consultations
  cleanPath = cleanPath.replace('/cconsultations-', '/consultations-')

  // Construire l'URL complète
  return `https://jeandeportal.fr/${cleanPath}`
}

/**
 * Obtenir l'image thumbnail d'un webinaire (pour cards et modale)
 * Retourne toujours une URL complète
 *
 * @param webinar - Webinaire dont on veut extraire l'image
 * @returns URL complète du thumbnail
 *
 * @example
 * getWebinarThumbnail(webinar)
 * // => 'https://jeandeportal.fr/project/.../thumbnail/consultations-nd-argent.jpg'
 */
export function getWebinarThumbnail(webinar: APIWebinar): string {
  if (webinar.thumbnail) {
    return getFullImageUrl(webinar.thumbnail)
  }

  // Fallback : placeholder
  return 'https://via.placeholder.com/400x300?text=Image+indisponible'
}

/**
 * Obtenir l'image de couverture du dossier (depuis image_array)
 * Retourne null si pas de dossier associé
 *
 * @param webinar - Webinaire dont on veut extraire la couverture du dossier
 * @returns URL complète de la couverture ou null
 *
 * @example
 * getWebinarFileCover(webinar)
 * // => 'https://jeandeportal.fr/project/.../product/700/CONSULTATIONS-ND-002-ARGENT_382_30.jpg'
 * // ou null si pas de dossier
 */
export function getWebinarFileCover(webinar: APIWebinar): string | null {
  if (webinar.image_array && webinar.image_array.length > 0) {
    const firstImage = webinar.image_array[0]
    if (firstImage?.path) {
      return getFullImageUrl(firstImage.path)
    }
  }

  return null
}

/**
 * Vérifier si un webinaire est passé (replay)
 * @param webinarIndex - Index du webinaire dans le tableau
 * @param lastWebinarIndex - Index du dernier webinaire passé (inclus)
 * @returns true si le webinaire est un replay
 */
export function isReplay(webinarIndex: number, lastWebinarIndex: number): boolean {
  return webinarIndex <= lastWebinarIndex
}

/**
 * Vérifier si un webinaire est à venir (live)
 * @param webinarIndex - Index du webinaire dans le tableau
 * @param nextWebinarIndex - Index du prochain webinaire à venir
 * @returns true si le webinaire est à venir
 */
export function isUpcoming(webinarIndex: number, nextWebinarIndex: number): boolean {
  return webinarIndex >= nextWebinarIndex
}
