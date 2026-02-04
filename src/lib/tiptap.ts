/**
 * TipTap JSON → HTML conversion
 *
 * Le backend envoie le contenu des articles en JSON TipTap.
 * Ce module convertit ce JSON en HTML que ProseContent peut parser.
 *
 * Extensions custom :
 * - imipieChart : graphique Highcharts via API imiPie
 * - articleTeaser : renvoi inline vers un autre article
 */

import { generateHTML } from '@tiptap/html'
import type { JSONContent } from '@tiptap/core'
import { Node } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'

/**
 * Node custom : graphique imiPie / Highcharts
 * Produit : <div data-imipie-chart data-family="..." data-serie="..." ...></div>
 */
const ImipieChart = Node.create({
  name: 'imipieChart',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      family: { default: null },
      serie: { default: null },
      startDate: { default: null },
      stopDate: { default: null },
      xTick: { default: null },
      height: { default: null },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const attrs: Record<string, string> = { 'data-imipie-chart': '' }
    const map: Record<string, string> = {
      family: 'data-family',
      serie: 'data-serie',
      startDate: 'data-start-date',
      stopDate: 'data-stop-date',
      xTick: 'data-x-tick',
      height: 'data-height',
    }

    for (const [key, dataAttr] of Object.entries(map)) {
      if (HTMLAttributes[key] != null) {
        attrs[dataAttr] = String(HTMLAttributes[key])
      }
    }

    return ['div', attrs]
  },

  parseHTML() {
    return [{ tag: 'div[data-imipie-chart]' }]
  },
})

/**
 * Node custom : teaser article inline
 * Produit : <div data-article-teaser data-slug="..."></div>
 */
const ArticleTeaser = Node.create({
  name: 'articleTeaser',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      slug: { default: null },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', {
      'data-article-teaser': '',
      'data-slug': HTMLAttributes.slug,
    }]
  },

  parseHTML() {
    return [{ tag: 'div[data-article-teaser]' }]
  },
})

/**
 * Liste des extensions TipTap utilisees pour la conversion
 */
const extensions = [
  StarterKit,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  Underline,
  Link,
  Image,
  ImipieChart,
  ArticleTeaser,
]

/**
 * Convertit un document TipTap JSON en HTML
 * Retourne le HTML que ProseContent peut parser (tables, charts, teasers)
 */
export function tiptapToHtml(doc: JSONContent): string {
  return generateHTML(doc, extensions)
}

export type { JSONContent }
