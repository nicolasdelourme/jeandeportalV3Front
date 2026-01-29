<script setup lang="ts">
/**
 * ProseContent - Render TipTap HTML with shadcn Table components and Highcharts
 * Parses HTML content, extracts tables and chart placeholders, renders them with components
 */
import { computed } from 'vue'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { HighchartsChart } from '@/components/ui/highcharts-chart'
import type { ArticleChartConfig } from '@/types/imipie.types'

interface Props {
    html: string
}

interface TableData {
    headers: string[]
    rows: string[][]
}

interface ContentSegment {
    type: 'html' | 'table' | 'chart'
    content: string | TableData | ArticleChartConfig
}

const props = defineProps<Props>()

/**
 * Parse une table HTML et extrait les donnees
 */
function parseTable(tableHtml: string): TableData {
    const parser = new DOMParser()
    const doc = parser.parseFromString(tableHtml, 'text/html')
    const table = doc.querySelector('table')

    if (!table) {
        return { headers: [], rows: [] }
    }

    const headers: string[] = []
    const rows: string[][] = []

    // Extract headers from thead or first row
    const thead = table.querySelector('thead')
    if (thead) {
        const headerCells = thead.querySelectorAll('th, td')
        headerCells.forEach((cell) => {
            headers.push(cell.innerHTML)
        })
    }

    // Extract body rows
    const tbody = table.querySelector('tbody') || table
    const bodyRows = tbody.querySelectorAll('tr')

    bodyRows.forEach((row, index) => {
        // Skip first row if no thead and it contains th elements (it's the header)
        if (!thead && index === 0 && row.querySelector('th')) {
            const headerCells = row.querySelectorAll('th, td')
            headerCells.forEach((cell) => {
                headers.push(cell.innerHTML)
            })
            return
        }

        const cells: string[] = []
        row.querySelectorAll('td, th').forEach((cell) => {
            cells.push(cell.innerHTML)
        })

        if (cells.length > 0) {
            rows.push(cells)
        }
    })

    return { headers, rows }
}

/**
 * Parse un placeholder de graphique et extrait la configuration
 * Format: <div data-imipie-chart data-family="gold" data-serie="lbmaSerie" ...></div>
 */
function parseChartPlaceholder(divHtml: string): ArticleChartConfig | null {
    const parser = new DOMParser()
    const doc = parser.parseFromString(divHtml, 'text/html')
    const div = doc.querySelector('div[data-imipie-chart]')

    if (!div) return null

    const family = div.getAttribute('data-family')
    const serie = div.getAttribute('data-serie')

    // family et serie sont requis
    if (!family || !serie) {
        /* console.warn('[ProseContent] Chart placeholder missing required data-family or data-serie') */
        return null
    }

    return {
        family,
        serie,
        startDate: div.getAttribute('data-start-date') || undefined,
        stopDate: div.getAttribute('data-stop-date') || undefined,
        xTick: div.getAttribute('data-x-tick') ? parseInt(div.getAttribute('data-x-tick')!, 10) : undefined,
        height: div.getAttribute('data-height') || undefined,
        title: div.getAttribute('data-title') || undefined,
    }
}

/**
 * Decoupe le HTML en segments (html brut, tables et graphiques)
 */
const segments = computed<ContentSegment[]>(() => {
    if (!props.html) return []

    const result: ContentSegment[] = []
    // Regex combinée pour tables et placeholders de graphiques
    const combinedRegex = /(<table[\s\S]*?<\/table>)|(<div[^>]*data-imipie-chart[^>]*>(?:<\/div>)?)/gi
    let lastIndex = 0
    let match

    while ((match = combinedRegex.exec(props.html)) !== null) {
        // Add HTML before the match
        if (match.index > lastIndex) {
            const htmlContent = props.html.slice(lastIndex, match.index).trim()
            if (htmlContent) {
                result.push({ type: 'html', content: htmlContent })
            }
        }

        // Determine if it's a table or a chart
        const matchedContent = match[0]

        if (match[1]) {
            // It's a table
            result.push({
                type: 'table',
                content: parseTable(matchedContent),
            })
        } else if (match[2]) {
            // It's a chart placeholder
            const chartConfig = parseChartPlaceholder(matchedContent)
            if (chartConfig) {
                result.push({
                    type: 'chart',
                    content: chartConfig,
                })
            }
        }

        lastIndex = match.index + match[0].length
    }

    // Add remaining HTML after last match
    if (lastIndex < props.html.length) {
        const htmlContent = props.html.slice(lastIndex).trim()
        if (htmlContent) {
            result.push({ type: 'html', content: htmlContent })
        }
    }

    return result
})
</script>

<template>
    <div class="prose-tiptap">
        <template v-for="(segment, index) in segments" :key="index">
            <!-- HTML content -->
            <div v-if="segment.type === 'html'" v-html="segment.content as string">
            </div>

            <!-- Table as shadcn component -->
            <Table v-else-if="segment.type === 'table'" class="my-6">
                <TableHeader v-if="(segment.content as TableData).headers.length">
                    <TableRow>
                        <TableHead
                            v-for="(header, hIndex) in (segment.content as TableData).headers"
                            :key="hIndex"
                            v-html="header"
                        />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow
                        v-for="(row, rIndex) in (segment.content as TableData).rows"
                        :key="rIndex"
                    >
                        <TableCell
                            v-for="(cell, cIndex) in row"
                            :key="cIndex"
                            :class="{ 'font-medium': cIndex === 0 }"
                            v-html="cell"
                        />
                    </TableRow>
                </TableBody>
            </Table>

            <!-- Highcharts chart -->
            <HighchartsChart
                v-else-if="segment.type === 'chart'"
                :config="segment.content as ArticleChartConfig"
            />
        </template>
    </div>
</template>
