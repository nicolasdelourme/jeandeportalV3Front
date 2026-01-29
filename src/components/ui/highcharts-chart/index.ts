/**
 * HighchartsChart - Composant pour afficher des graphiques Highcharts via l'API imiPie
 *
 * @example
 * // Usage standalone dans n'importe quelle page
 * <HighchartsChart
 *   :config="{
 *     family: 'gold',
 *     serie: 'lbmaSerie',
 *     startDate: '2020-01-01',
 *     stopDate: '2025-12-31',
 *     xTick: 365,
 *     height: '400px',
 *     title: 'Cours de l\'or LBMA'
 *   }"
 * />
 *
 * @example
 * // Usage dans un article via placeholder HTML (ProseContent)
 * <div
 *   data-imipie-chart
 *   data-family="gold"
 *   data-serie="lbmaSerie"
 *   data-start-date="2020-01-01"
 *   data-height="400px"
 * ></div>
 */

export { default as HighchartsChart } from './HighchartsChart.vue'
