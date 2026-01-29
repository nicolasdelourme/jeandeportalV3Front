<script setup lang="ts">
/**
 * HighchartsChart - Composant réutilisable pour afficher des graphiques Highcharts
 *
 * Charge les scripts Highcharts de manière lazy, récupère les données via l'API imiPie,
 * et rend le graphique dans le conteneur.
 *
 * Peut être utilisé :
 * - Standalone dans n'importe quelle page Vue
 * - Dans les articles via les placeholders détectés par ProseContent
 */
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useHighchartsLoader } from '@/composables/useHighchartsLoader'
import { imipieService } from '@/services/imipie.service'
import { logger } from '@/utils/logger'
import type { ArticleChartConfig, ImiPieChartResponse, HighchartsGlobal, HighchartsPayloadClientGlobal, HighchartsChartInstance } from '@/types/imipie.types'
import { ImiPieAPIError } from '@/types/imipie.types'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

interface Props {
  /** Configuration du graphique */
  config: ArticleChartConfig
}

const props = defineProps<Props>()

// Icons
const icons = computed(() => ({
  triangleExclamation: byPrefixAndName.fas?.['triangle-exclamation'],
  undo: byPrefixAndName.fas?.['undo'],
  chartLine: byPrefixAndName.fas?.['chart-line'],
}))

// ID unique pour le conteneur du graphique
const containerId = ref(`highcharts-${Math.random().toString(36).substring(2, 11)}`)

// Référence au wrapper pour le ResizeObserver
const wrapperRef = ref<HTMLElement | null>(null)

// Instance du graphique pour reflow
let chartInstance: HighchartsChartInstance | null = null

// ResizeObserver pour adapter le graphique au conteneur
let resizeObserver: ResizeObserver | null = null

// État du composant
const chartData = ref<ImiPieChartResponse | null>(null)
const fetchError = ref<string | null>(null)
const isFetching = ref(false)

// Loader Highcharts
const { isLoaded: scriptsLoaded, isLoading: scriptsLoading, error: scriptsError, loadHighcharts } = useHighchartsLoader()

// Hauteur calculée
const chartHeight = computed(() => props.config.height || '400px')

/**
 * Charge les données du graphique
 */
async function fetchChartData() {
  isFetching.value = true
  fetchError.value = null

  try {
    chartData.value = await imipieService.fetchChart({
      family: props.config.family,
      serie: props.config.serie,
      startDate: props.config.startDate,
      stopDate: props.config.stopDate,
      xTick: props.config.xTick,
    })
  } catch (error) {
    if (error instanceof ImiPieAPIError) {
      fetchError.value = error.message
    } else if (error instanceof Error) {
      fetchError.value = error.message
    } else {
      fetchError.value = 'Erreur lors du chargement du graphique'
    }
    logger.error('[HighchartsChart] Fetch error:', error)
  } finally {
    isFetching.value = false
  }
}

/**
 * Rend le graphique dans le conteneur
 */
function renderChart() {
  if (!chartData.value || !scriptsLoaded.value) return

  const container = document.getElementById(containerId.value)
  if (!container) {
    logger.error('[HighchartsChart] Container not found:', containerId.value)
    return
  }

  try {
    // Convertir les données réactives Vue (Proxy) en objet JavaScript pur
    // pour éviter l'erreur structuredClone du HighchartsPayloadClient
    const purePayload: ImiPieChartResponse = JSON.parse(JSON.stringify(chartData.value))

    // Nettoyer les dimensions fixes du payload pour permettre au graphique
    // de s'adapter à son conteneur (l'API peut envoyer des dimensions fixes)
    if (purePayload.chart) {
      delete (purePayload.chart as Record<string, unknown>).width
      delete (purePayload.chart as Record<string, unknown>).height
      // S'assurer que le chart est responsive
      ;(purePayload.chart as Record<string, unknown>).reflow = true
    }

    // Cast des globales Highcharts
    const Highcharts = window.Highcharts as HighchartsGlobal | undefined
    const PayloadClient = window.HighchartsPayloadClient as HighchartsPayloadClientGlobal | undefined

    // Utiliser le HighchartsPayloadClient si disponible (mode API réelle)
    if (PayloadClient) {
      PayloadClient.render(containerId.value, purePayload)
      // Récupérer l'instance du chart pour le reflow
      chartInstance = Highcharts?.charts?.find(
        (c: HighchartsChartInstance | undefined) => c?.renderTo?.id === containerId.value
      ) || null
    } else if (Highcharts && purePayload.chart) {
      // Fallback: utiliser Highcharts directement avec les options du chart
      chartInstance = Highcharts.chart(containerId.value, purePayload.chart as Record<string, unknown>)
    } else {
      throw new Error('Highcharts ou HighchartsPayloadClient non disponible')
    }

    // Forcer un recalcul complet des dimensions après le rendu
    // setSize(null, null) recalcule automatiquement depuis le conteneur
    setTimeout(() => {
      if (chartInstance) {
        const containerHeight = parseInt(chartHeight.value) || 400
        chartInstance.setSize(null, containerHeight, false)
      }
    }, 50)
  } catch (error) {
    logger.error('[HighchartsChart] Render error:', error)
    fetchError.value = 'Erreur lors du rendu du graphique'
  }
}

/**
 * Réessayer le chargement
 */
async function retry() {
  fetchError.value = null
  await initChart()
}

/**
 * Initialise le graphique (charge scripts + données)
 */
async function initChart() {
  try {
    // Charger les scripts Highcharts
    await loadHighcharts()

    // Charger les données
    await fetchChartData()

    // Rendre le graphique
    renderChart()
  } catch (error) {
    logger.error('[HighchartsChart] Init error:', error)
  }
}

// Watcher pour re-render quand les données changent
watch(
  [chartData, scriptsLoaded],
  ([newData, newLoaded]) => {
    if (newData && newLoaded) {
      // Petit délai pour s'assurer que le DOM est prêt
      requestAnimationFrame(() => {
        renderChart()
      })
    }
  }
)

// Watcher pour recharger si la config change
watch(
  () => props.config,
  () => {
    fetchChartData()
  },
  { deep: true }
)

/**
 * Configure le ResizeObserver pour adapter le graphique au conteneur
 */
function setupResizeObserver() {
  if (!wrapperRef.value) return

  resizeObserver = new ResizeObserver((entries) => {
    // Recalculer les dimensions quand le conteneur change de taille
    if (chartInstance && entries[0]) {
      const { width } = entries[0].contentRect
      const containerHeight = parseInt(chartHeight.value) || 400
      // setSize avec animation désactivée pour éviter les saccades
      chartInstance.setSize(width, containerHeight, false)
    }
  })

  resizeObserver.observe(wrapperRef.value)
}

// Initialisation au montage
onMounted(() => {
  initChart()
  setupResizeObserver()
})

// Cleanup
onUnmounted(() => {
  // Déconnecter le ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  // Détruire le graphique
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<template>
  <div ref="wrapperRef" class="highcharts-chart-wrapper my-6">
    <!-- Titre optionnel -->
    <h4 v-if="config.title" class="font-heading font-bold text-lg mb-3 text-foreground">
      {{ config.title }}
    </h4>

    <!-- État de chargement -->
    <div
      v-if="scriptsLoading || isFetching"
      class="flex flex-col items-center justify-center bg-muted/30 rounded-lg border border-border relative"
      :style="{ height: chartHeight }"
    >
      <Skeleton class="w-full h-full rounded-lg" />
      <div class="absolute flex flex-col items-center gap-2 text-muted-foreground">
        <FontAwesomeIcon
          v-if="icons.chartLine"
          :icon="icons.chartLine"
          class="size-8 animate-pulse"
        />
        <span class="text-sm">Chargement du graphique...</span>
      </div>
    </div>

    <!-- État d'erreur -->
    <Alert
      v-else-if="fetchError || scriptsError"
      variant="destructive"
      class="my-4"
    >
      <FontAwesomeIcon
        v-if="icons.triangleExclamation"
        :icon="icons.triangleExclamation"
        class="size-4"
      />
      <AlertTitle>Erreur de chargement</AlertTitle>
      <AlertDescription class="flex flex-col gap-3">
        <p>{{ fetchError || scriptsError?.message }}</p>
        <Button
          variant="outline"
          size="sm"
          class="w-fit"
          @click="retry"
        >
          <FontAwesomeIcon
            v-if="icons.undo"
            :icon="icons.undo"
            class="size-4 mr-2"
          />
          Réessayer
        </Button>
      </AlertDescription>
    </Alert>

    <!-- Conteneur du graphique -->
    <div
      v-show="!scriptsLoading && !isFetching && !fetchError && !scriptsError"
      :id="containerId"
      class="highcharts-container rounded-lg"
      :style="{ height: chartHeight }"
    ></div>
  </div>
</template>

<style scoped>
.highcharts-chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.highcharts-container {
  width: 100% !important;
  max-width: 100%;
}

/* Override Highcharts styles pour s'intégrer au design et forcer la largeur */
:deep(.highcharts-container) {
  font-family: var(--font-body), Inter, sans-serif;
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.highcharts-container svg) {
  max-width: 100%;
}

:deep(.highcharts-title) {
  font-family: var(--font-heading), 'Bernina Sans Condensed', sans-serif !important;
}

:deep(.highcharts-subtitle) {
  font-family: var(--font-body), Inter, sans-serif !important;
}
</style>
