<script setup lang="ts">
/**
 * ProseContent - Render TipTap HTML with shadcn Table components and Highcharts
 * Parses HTML content, extracts tables, chart placeholders, teasers and callouts, renders them with components
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
import ArticleTeaser from '@/components/news/ArticleTeaser.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { ArticleChartConfig } from '@/types/imipie.types'

interface Props {
    html: string
}

interface TableData {
    headers: string[]
    rows: string[][]
}

interface TeaserData {
    slug: string
}

interface CalloutData {
    style: string
    icon: string | null
    title: string | null
    content: string
}

interface BlockquoteData {
    content: string
}

interface ContentSegment {
    type: 'html' | 'table' | 'chart' | 'teaser' | 'callout' | 'blockquote'
    content: string | TableData | ArticleChartConfig | TeaserData | CalloutData | BlockquoteData
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
 * Format: <div data-imipie-chart data-url="https://imipie.ovh/api/..." ...></div>
 */
function parseChartPlaceholder(divHtml: string): ArticleChartConfig | null {
    const parser = new DOMParser()
    const doc = parser.parseFromString(divHtml, 'text/html')
    const div = doc.querySelector('div[data-imipie-chart]')

    if (!div) return null

    const url = div.getAttribute('data-url')

    // L'URL est obligatoire
    if (!url) return null

    return {
        url,
        height: div.getAttribute('data-height') || undefined,
        title: div.getAttribute('data-title') || undefined,
    }
}

/**
 * Parse un placeholder de teaser article et extrait le slug
 * Format: <div data-article-teaser data-slug="mon-slug"></div>
 */
function parseTeaserPlaceholder(divHtml: string): TeaserData | null {
    const parser = new DOMParser()
    const doc = parser.parseFromString(divHtml, 'text/html')
    const div = doc.querySelector('div[data-article-teaser]')

    if (!div) return null

    const slug = div.getAttribute('data-slug')
    if (!slug) return null

    return { slug }
}

/**
 * Parse un placeholder de callout et extrait les attributs + contenu interne
 * Format: <div data-callout data-style="info" data-icon="circle-info" data-title="...">contenu HTML</div>
 */
function parseCalloutBlock(divHtml: string): CalloutData | null {
    const parser = new DOMParser()
    const doc = parser.parseFromString(divHtml, 'text/html')
    const div = doc.querySelector('div[data-callout]')

    if (!div) return null

    return {
        style: div.getAttribute('data-style') || 'info',
        icon: div.getAttribute('data-icon') || null,
        title: div.getAttribute('data-title') || null,
        content: div.innerHTML,
    }
}

/**
 * Styles par défaut pour les callouts
 */
const CALLOUT_DEFAULTS: Record<string, { icon: string; iconClass: string; classes: string }> = {
    alerte: {
        icon: 'triangle-exclamation',
        iconClass: 'text-primary',
        classes: 'border-l-4 border-l-primary bg-primary/10 rounded-lg p-4 lg:p-6 my-5',
    },
    info: {
        icon: 'circle-info',
        iconClass: 'text-primary',
        classes: 'border-2 border-primary rounded-lg p-4 lg:p-6 my-5',
    },
    success: {
        icon: 'circle-check',
        iconClass: 'text-emerald-600',
        classes: 'border-l-4 border-l-emerald-500 bg-emerald-50 rounded-lg p-4 lg:p-6 my-5',
    },
    danger: {
        icon: 'shield-halved',
        iconClass: 'text-red-600',
        classes: 'border-l-4 border-l-red-500 bg-red-50 rounded-lg p-4 lg:p-6 my-5',
    },
}

function asCallout(content: string | TableData | ArticleChartConfig | TeaserData | CalloutData | BlockquoteData): CalloutData {
    return content as CalloutData
}

function asBlockquote(content: string | TableData | ArticleChartConfig | TeaserData | CalloutData | BlockquoteData): BlockquoteData {
    return content as BlockquoteData
}

function calloutClasses(style: string): string {
    return CALLOUT_DEFAULTS[style]?.classes ?? CALLOUT_DEFAULTS.info!.classes
}

function calloutIcon(data: CalloutData) {
    const iconName = data.icon ?? CALLOUT_DEFAULTS[data.style]?.icon ?? 'circle-info'
    return byPrefixAndName.fas?.[iconName as keyof typeof byPrefixAndName.fas]
}

function calloutIconClass(style: string): string {
    return CALLOUT_DEFAULTS[style]?.iconClass ?? CALLOUT_DEFAULTS.info!.iconClass
}

/**
 * Parse un blockquote et extrait le contenu interne
 */
function parseBlockquote(html: string): BlockquoteData {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const blockquote = doc.querySelector('blockquote')
    return { content: blockquote?.innerHTML ?? '' }
}

const quoteIcon = byPrefixAndName.fas?.['quote-left']

/**
 * Decoupe le HTML en segments (html brut, tables et graphiques)
 */
const segments = computed<ContentSegment[]>(() => {
    if (!props.html) return []

    const result: ContentSegment[] = []
    // Regex combinée pour tables, placeholders de graphiques, teasers, callouts et blockquotes
    const combinedRegex = /(<table[\s\S]*?<\/table>)|(<div[^>]*data-imipie-chart[^>]*>(?:<\/div>)?)|(<div[^>]*data-article-teaser[^>]*>(?:<\/div>)?)|(<div[^>]*data-callout[^>]*>[\s\S]*?<\/div>)|(<blockquote[\s\S]*?<\/blockquote>)/gi
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

        // Determine if it's a table, chart, or teaser
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
        } else if (match[3]) {
            // It's an article teaser
            const teaserData = parseTeaserPlaceholder(matchedContent)
            if (teaserData) {
                result.push({
                    type: 'teaser',
                    content: teaserData,
                })
            }
        } else if (match[4]) {
            // It's a callout block
            const calloutData = parseCalloutBlock(matchedContent)
            if (calloutData) {
                result.push({
                    type: 'callout',
                    content: calloutData,
                })
            }
        } else if (match[5]) {
            // It's a blockquote
            result.push({
                type: 'blockquote',
                content: parseBlockquote(matchedContent),
            })
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

            <!-- Article teaser -->
            <ArticleTeaser
                v-else-if="segment.type === 'teaser'"
                :slug="(segment.content as TeaserData).slug"
            />

            <!-- Callout block -->
            <div
                v-else-if="segment.type === 'callout'"
                :class="calloutClasses(asCallout(segment.content).style)"
            >
                <div v-if="asCallout(segment.content).title" class="flex items-center gap-2.5 mb-2">
                    <FontAwesomeIcon
                        v-if="calloutIcon(asCallout(segment.content))"
                        :icon="calloutIcon(asCallout(segment.content))"
                        class="w-5 h-5 shrink-0"
                        :class="calloutIconClass(asCallout(segment.content).style)"
                    />
                    <h4 class="font-heading font-bold text-lg my-0!">
                        {{ asCallout(segment.content).title }}
                    </h4>
                </div>
                <div :class="asCallout(segment.content).title ? '' : 'flex items-start gap-2.5'">
                    <FontAwesomeIcon
                        v-if="!asCallout(segment.content).title && calloutIcon(asCallout(segment.content))"
                        :icon="calloutIcon(asCallout(segment.content))"
                        class="w-5 h-5 mt-[0.34em] shrink-0"
                        :class="calloutIconClass(asCallout(segment.content).style)"
                    />
                    <div
                        class="text-lg leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0"
                        v-html="asCallout(segment.content).content"
                    ></div>
                </div>
            </div>

            <!-- Blockquote with quote icon -->
            <blockquote
                v-else-if="segment.type === 'blockquote'"
                class="flex items-start gap-2.5 border-l-4 border-neutral-300 rounded-lg p-4 lg:p-6 italic text-neutral-600 my-5"
            >
                <FontAwesomeIcon
                    v-if="quoteIcon"
                    :icon="quoteIcon"
                    class="text-neutral-300 text-lg opacity-60"
                />
                <div
                    class="[&>p]:mb-0"
                    v-html="asBlockquote(segment.content).content"
                ></div>
            </blockquote>
        </template>
    </div>
</template>
