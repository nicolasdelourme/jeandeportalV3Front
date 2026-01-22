<script setup lang="ts">
/**
 * ProseContent - Render TipTap HTML with shadcn Table components
 * Parses HTML content, extracts tables and renders them as shadcn Tables
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

interface Props {
    html: string
}

interface TableData {
    headers: string[]
    rows: string[][]
}

interface ContentSegment {
    type: 'html' | 'table'
    content: string | TableData
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
 * Decoupe le HTML en segments (html brut et tables)
 */
const segments = computed<ContentSegment[]>(() => {
    if (!props.html) return []

    const result: ContentSegment[] = []
    const tableRegex = /<table[\s\S]*?<\/table>/gi
    let lastIndex = 0
    let match

    while ((match = tableRegex.exec(props.html)) !== null) {
        // Add HTML before the table
        if (match.index > lastIndex) {
            const htmlContent = props.html.slice(lastIndex, match.index).trim()
            if (htmlContent) {
                result.push({ type: 'html', content: htmlContent })
            }
        }

        // Add the table
        result.push({
            type: 'table',
            content: parseTable(match[0]),
        })

        lastIndex = match.index + match[0].length
    }

    // Add remaining HTML after last table
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
            <div v-if="segment.type === 'html'" v-html="segment.content as string" />

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
        </template>
    </div>
</template>
