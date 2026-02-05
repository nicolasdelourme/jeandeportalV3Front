/**
 * Types pour la section Actualités (News)
 *
 * Contenu éditorial gratuit : articles, brèves, vidéos YouTube
 */

/**
 * Type de contenu actualité
 */
export type NewsType = 'article' | 'video' | 'brief'

/**
 * Labels français pour les types de contenu
 */
export const NEWS_TYPE_LABELS: Record<NewsType, string> = {
  article: 'ARTICLE',
  video: 'VIDÉO',
  brief: 'BRÈVE',
} as const

/**
 * Auteur d'un contenu
 * Anticipation : table authors en base avec avatar
 */
export interface NewsAuthor {
  /**
   * Identifiant unique (future clé primaire)
   */
  id: string

  /**
   * Nom complet de l'auteur
   */
  name: string

  /**
   * URL de l'avatar (optionnel, fallback sur initiales)
   */
  avatar?: string
}

/**
 * Item d'actualité
 */
export interface NewsItem {
  /**
   * Identifiant unique
   */
  id: string

  /**
   * Slug URL-friendly pour les routes
   */
  slug: string

  /**
   * Type de contenu
   */
  type: NewsType

  /**
   * Titre de l'actualité
   */
  title: string

  /**
   * Extrait/chapô (affiché dans les listes)
   */
  excerpt: string

  /**
   * Contenu de l'article
   * API : TipTap JSON (objet) — converti en HTML string par le service
   */
  content?: string

  /**
   * ID de la vidéo YouTube (pour les vidéos)
   */
  youtubeId?: string

  /**
   * URL de l'image miniature
   */
  thumbnail: string

  /**
   * Date de publication
   */
  publishedAt: Date

  /**
   * Date de dernière mise à jour (si différente de publishedAt)
   */
  updatedAt?: Date

  /**
   * Temps de lecture estimé en minutes (pour les articles)
   */
  readTime?: number

  /**
   * Durée en secondes (pour les vidéos)
   */
  duration?: number

  /**
   * Auteur du contenu (optionnel)
   */
  author?: NewsAuthor

  /**
   * Nombre de vues (pour le classement trending)
   */
  views?: number
}

/**
 * Réponse paginée des actualités
 */
export interface PaginatedNews {
  /**
   * Liste des items
   */
  items: NewsItem[]

  /**
   * Nombre total d'items
   */
  total: number

  /**
   * Page courante (1-indexed)
   */
  page: number

  /**
   * Nombre d'items par page
   */
  pageSize: number
}

/**
 * Paramètres de filtrage des actualités
 */
export interface NewsQueryParams {
  /**
   * Numéro de page (1-indexed)
   */
  page?: number

  /**
   * Nombre d'items par page
   */
  pageSize?: number

  /**
   * Filtrer par type de contenu
   */
  type?: NewsType
}

/**
 * Configuration de la section actualités
 */
export const NEWS_CONFIG = {
  /**
   * Nombre d'items par page par défaut
   */
  DEFAULT_PAGE_SIZE: 10,

  /**
   * Nombre d'items dans "En Continu"
   */
  LIVE_FEED_COUNT: 5,

  /**
   * Nombre d'items dans "Les Plus Lus"
   */
  TRENDING_COUNT: 5,

  /**
   * Durée de cache en millisecondes (5 minutes)
   */
  CACHE_TTL: 5 * 60 * 1000,
} as const

/**
 * Codes d'erreur de la section actualités
 */
export type NewsErrorCode =
  | 'NOT_FOUND'
  | 'API_ERROR'
  | 'INVALID_PARAMS'

/**
 * Erreur de la section actualités
 */
export class NewsError extends Error {
  code: NewsErrorCode

  constructor(message: string, code: NewsErrorCode) {
    super(message)
    this.name = 'NewsError'
    this.code = code
  }
}
