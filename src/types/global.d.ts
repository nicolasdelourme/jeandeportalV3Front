/**
 * Déclarations globales pour les scripts chargés dynamiquement
 */
import type { HighchartsGlobal, HighchartsPayloadClientGlobal } from './imipie.types'

declare global {
  interface Window {
    Highcharts?: HighchartsGlobal
    HighchartsPayloadClient?: HighchartsPayloadClientGlobal
  }
}

export {}
