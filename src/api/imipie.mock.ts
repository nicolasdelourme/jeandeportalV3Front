/**
 * Mock API pour imiPie - Graphiques Highcharts
 * Génère des données fictives pour le développement
 */

import type { ImiPieChartResponse } from '@/types/imipie.types'

/**
 * Parse l'URL imiPie pour extraire les paramètres
 */
interface ParsedImiPieUrl {
  family: string
  serie: string
  startDate?: string
  stopDate?: string
  xTick?: number
}

function parseImiPieUrl(url: string): ParsedImiPieUrl {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    // Expected: ['api', 'gold', 'lbmaSerie', 'highcharts']
    const family = pathParts[1] ?? 'gold'
    const serie = pathParts[2] ?? 'lbmaSerie'

    return {
      family,
      serie,
      startDate: urlObj.searchParams.get('startDate') ?? undefined,
      stopDate: urlObj.searchParams.get('stopDate') ?? undefined,
      xTick: urlObj.searchParams.has('xTick')
        ? parseInt(urlObj.searchParams.get('xTick')!, 10)
        : undefined,
    }
  } catch {
    // Fallback si l'URL est invalide
    return { family: 'gold', serie: 'lbmaSerie' }
  }
}

/**
 * Génère des données de série temporelle aléatoires
 */
function generateTimeSeries(
  startDate: string,
  stopDate: string,
  baseValue: number,
  volatility: number
): [number, number][] {
  const data: [number, number][] = []
  const start = new Date(startDate).getTime()
  const stop = new Date(stopDate).getTime()
  const dayMs = 24 * 60 * 60 * 1000

  let currentValue = baseValue

  for (let time = start; time <= stop; time += dayMs) {
    // Variation aléatoire avec tendance légèrement haussière
    const change = (Math.random() - 0.48) * volatility
    currentValue = Math.max(currentValue * (1 + change / 100), baseValue * 0.5)
    data.push([time, Math.round(currentValue * 100) / 100])
  }

  return data
}

/**
 * Type pour la configuration d'une famille
 */
interface FamilyConfig {
  name: string
  baseValue: number
  volatility: number
  color: string
  unit: string
}

/**
 * Configuration par défaut (or)
 */
const DEFAULT_FAMILY: FamilyConfig = {
  name: "Cours de l'Or",
  baseValue: 1800,
  volatility: 2,
  color: '#F2CC00',
  unit: 'EUR/oz',
}

/**
 * Configuration des familles de données mock
 */
const MOCK_FAMILIES: Record<string, FamilyConfig> = {
  gold: DEFAULT_FAMILY,
  silver: {
    name: "Cours de l'Argent",
    baseValue: 22,
    volatility: 3,
    color: '#C0C0C0',
    unit: 'EUR/oz',
  },
  platinum: {
    name: 'Cours du Platine',
    baseValue: 950,
    volatility: 2.5,
    color: '#E5E4E2',
    unit: 'EUR/oz',
  },
  palladium: {
    name: 'Cours du Palladium',
    baseValue: 1100,
    volatility: 4,
    color: '#CED0DD',
    unit: 'EUR/oz',
  },
}

/**
 * Récupère la config d'une famille avec fallback garanti
 */
function getFamilyConfig(family: string): FamilyConfig {
  return MOCK_FAMILIES[family] ?? DEFAULT_FAMILY
}

/**
 * Simule un appel API avec délai
 * @param url URL complète de l'API imiPie
 */
export async function mockFetchChart(
  url: string
): Promise<ImiPieChartResponse> {
  // Simuler un délai réseau (300-800ms)
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 500)
  )

  // Parser l'URL pour extraire les paramètres
  const params = parseImiPieUrl(url)

  // Récupérer la config de la famille (avec fallback sur gold)
  const familyConfig = getFamilyConfig(params.family)
  const startDate = params.startDate ?? '2020-01-01'
  const today = new Date().toISOString().split('T')[0] ?? '2025-12-31'
  const stopDate = params.stopDate ?? today

  const seriesData = generateTimeSeries(
    startDate,
    stopDate,
    familyConfig.baseValue,
    familyConfig.volatility
  )

  // Générer les options Highcharts (typage générique car Highcharts est chargé dynamiquement)
  const options: Record<string, unknown> = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif',
      },
    },
    title: {
      text: `${familyConfig.name} (${params.serie})`,
      style: {
        fontFamily: 'Bernina Sans Condensed, sans-serif',
        fontWeight: 'bold',
      },
    },
    subtitle: {
      text: `Période: ${startDate} - ${stopDate}`,
    },
    xAxis: {
      type: 'datetime',
      tickInterval: params.xTick
        ? params.xTick * 24 * 60 * 60 * 1000
        : undefined,
      labels: {
        format: '{value:%b %Y}',
      },
    },
    yAxis: {
      title: {
        text: familyConfig.unit,
      },
      labels: {
        format: '{value:.0f}',
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '<b>{point.x:%d %b %Y}</b><br/>',
      pointFormat: `${familyConfig.name}: <b>{point.y:.2f} ${familyConfig.unit}</b>`,
    },
    plotOptions: {
      line: {
        color: familyConfig.color,
        lineWidth: 2,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 5,
            },
          },
        },
      },
    },
    series: [
      {
        type: 'line',
        name: familyConfig.name,
        data: seriesData,
      },
    ],
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadPDF', 'downloadCSV'],
        },
      },
    },
  }

  // Retourner le format payload enrichi comme l'API réelle
  // { type, chart, formatter, sdk }
  return {
    type: 'line',
    chart: options,
    formatter: {
      tooltip: {
        dateFormat: '%d %b %Y',
      },
    },
    sdk: {
      family: params.family,
      serie: params.serie,
      generatedAt: new Date().toISOString(),
    },
  }
}
