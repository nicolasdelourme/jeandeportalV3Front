/**
 * Types pour l'API imiPie - Graphiques Highcharts
 */

/**
 * Paramètres pour une requête API imiPie
 */
export interface ImiPieChartParams {
  /** Famille de données (ex: 'gold', 'silver') */
  family: string
  /** Série de données (ex: 'lbmaSerie') */
  serie: string
  /** Profil d'affichage (défaut: 'infocashWeb') */
  profile?: string
  /** Date de début 'YYYY-MM-DD' */
  startDate?: string
  /** Date de fin 'YYYY-MM-DD' */
  stopDate?: string
  /** Intervalle de l'axe X en jours */
  xTick?: number
}

/**
 * Configuration pour un graphique dans un article ou standalone
 */
export interface ArticleChartConfig {
  /** Famille de données (ex: 'gold', 'silver') */
  family: string
  /** Série de données (ex: 'lbmaSerie') */
  serie: string
  /** Date de début 'YYYY-MM-DD' */
  startDate?: string
  /** Date de fin 'YYYY-MM-DD' */
  stopDate?: string
  /** Intervalle de l'axe X en jours */
  xTick?: number
  /** Hauteur du graphique (ex: '400px') */
  height?: string
  /** Titre affiché au-dessus du graphique */
  title?: string
}

/**
 * Payload enrichi retourné par l'API imiPie
 * Contient toutes les informations pour le rendu via HighchartsPayloadClient
 */
export interface ImiPiePayload {
  /** Type de graphique */
  type?: string
  /** Configuration du chart Highcharts (typage générique car Highcharts est chargé dynamiquement) */
  chart: Record<string, unknown>
  /** Configuration des formateurs (tooltips, labels, etc.) */
  formatter?: Record<string, unknown>
  /** Configuration SDK imiPie */
  sdk?: Record<string, unknown>
}

/**
 * Réponse de l'API imiPie
 * L'API retourne directement le payload enrichi
 */
export type ImiPieChartResponse = ImiPiePayload

/**
 * Erreur spécifique à l'API imiPie
 * Note: utilise des propriétés explicites au lieu de parameter properties
 * pour compatibilité avec erasableSyntaxOnly
 */
export class ImiPieAPIError extends Error {
  statusCode?: number
  originalCause?: Error

  constructor(message: string, statusCode?: number, cause?: Error) {
    super(message)
    this.name = 'ImiPieAPIError'
    this.statusCode = statusCode
    this.originalCause = cause
  }
}

/**
 * État du loader Highcharts
 */
export interface HighchartsLoaderState {
  isLoaded: boolean
  isLoading: boolean
  error: Error | null
}

/**
 * Types pour Highcharts (chargé dynamiquement)
 */
export interface HighchartsGlobal {
  chart: (containerId: string, options: Record<string, unknown>) => HighchartsChartInstance
  charts: Array<HighchartsChartInstance | undefined>
}

export interface HighchartsChartInstance {
  renderTo?: { id: string }
  destroy: () => void
  setSize: (width: number | null, height: number | null, animate?: boolean) => void
  reflow: () => void
}

export interface HighchartsPayloadClientGlobal {
  render: (
    containerId: string,
    payload: ImiPiePayload,
    options?: Record<string, unknown>
  ) => void
}
