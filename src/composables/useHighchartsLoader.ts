/**
 * Composable pour charger les scripts Highcharts de manière lazy
 * Charge les scripts séquentiellement pour respecter les dépendances
 */

import { ref } from 'vue'
import type { HighchartsLoaderState } from '@/types/imipie.types'

/**
 * Scripts Highcharts à charger dans l'ordre
 * L'ordre est important car certains scripts dépendent d'autres
 */
const HIGHCHARTS_SCRIPTS = [
  'https://code.highcharts.com/highcharts.js',
  'https://code.highcharts.com/highcharts-more.js',
  'https://code.highcharts.com/modules/accessibility.js',
  'https://code.highcharts.com/modules/annotations.js',
  'https://code.highcharts.com/modules/exporting.js',
  'https://code.highcharts.com/modules/export-data.js',
  'https://imipie.ovh/project/pie/js/highcharts-pie-payload.js',
] as const

// État global singleton pour éviter les chargements multiples
const globalState: HighchartsLoaderState = {
  isLoaded: false,
  isLoading: false,
  error: null,
}

// Promise partagée pour éviter les chargements concurrents
let loadPromise: Promise<void> | null = null

/**
 * Charge un script externe de manière asynchrone
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Vérifier si le script est déjà chargé
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = false // Charger de manière séquentielle
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Échec du chargement: ${src}`))
    document.head.appendChild(script)
  })
}

/**
 * Charge tous les scripts Highcharts séquentiellement
 */
async function loadAllScripts(): Promise<void> {
  for (const script of HIGHCHARTS_SCRIPTS) {
    await loadScript(script)
  }

  // Vérifier que Highcharts et le payload client sont bien disponibles
  if (!window.Highcharts) {
    throw new Error('Highcharts non disponible après le chargement des scripts')
  }
  if (!window.HighchartsPayloadClient) {
    throw new Error('HighchartsPayloadClient non disponible après le chargement des scripts')
  }
}

/**
 * Composable pour gérer le chargement des scripts Highcharts
 */
export function useHighchartsLoader() {
  // État réactif local lié à l'état global
  const isLoaded = ref(globalState.isLoaded)
  const isLoading = ref(globalState.isLoading)
  const error = ref<Error | null>(globalState.error)

  /**
   * Charge les scripts Highcharts si pas déjà fait
   * Utilise une promise partagée pour éviter les chargements concurrents
   */
  async function loadHighcharts(): Promise<void> {
    // Si déjà chargé, retourner immédiatement
    if (globalState.isLoaded) {
      isLoaded.value = true
      return
    }

    // Si un chargement est en cours, attendre la promise existante
    if (loadPromise) {
      await loadPromise
      isLoaded.value = globalState.isLoaded
      error.value = globalState.error
      return
    }

    // Démarrer un nouveau chargement
    globalState.isLoading = true
    globalState.error = null
    isLoading.value = true
    error.value = null

    loadPromise = loadAllScripts()
      .then(() => {
        globalState.isLoaded = true
        globalState.isLoading = false
        isLoaded.value = true
        isLoading.value = false
      })
      .catch((err) => {
        globalState.error = err instanceof Error ? err : new Error(String(err))
        globalState.isLoading = false
        error.value = globalState.error
        isLoading.value = false
        loadPromise = null // Permettre une nouvelle tentative
        throw err
      })

    await loadPromise
  }

  return {
    isLoaded,
    isLoading,
    error,
    loadHighcharts,
  }
}
