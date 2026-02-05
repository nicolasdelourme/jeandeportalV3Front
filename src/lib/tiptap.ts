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
 * Produit : <div data-imipie-chart data-url="..." data-height="..." data-title="..."></div>
 */
const ImipieChart = Node.create({
  name: 'imipieChart',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: { default: null },      // URL complète de l'API
      height: { default: null },   // Hauteur optionnelle
      title: { default: null },    // Titre optionnel
    }
  },

  renderHTML({ HTMLAttributes }) {
    const attrs: Record<string, string> = { 'data-imipie-chart': '' }
    if (HTMLAttributes.url) attrs['data-url'] = HTMLAttributes.url
    if (HTMLAttributes.height) attrs['data-height'] = HTMLAttributes.height
    if (HTMLAttributes.title) attrs['data-title'] = HTMLAttributes.title
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
 * Node custom : encadré éditorial (callout)
 * Contient du texte riche (paragraphes, bold, etc.)
 * Produit : <div data-callout data-style="info" data-icon="circle-info" data-title="...">contenu</div>
 */
const CalloutBlock = Node.create({
  name: 'calloutBlock',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      style: { default: 'info' },
      icon: { default: null },
      title: { default: null },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const attrs: Record<string, string> = { 'data-callout': '' }
    if (HTMLAttributes.style) attrs['data-style'] = HTMLAttributes.style
    if (HTMLAttributes.icon) attrs['data-icon'] = HTMLAttributes.icon
    if (HTMLAttributes.title) attrs['data-title'] = HTMLAttributes.title
    return ['div', attrs, 0]
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }]
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
  CalloutBlock,
]

/**
 * Convertit un document TipTap JSON en HTML
 * Retourne le HTML que ProseContent peut parser (tables, charts, teasers)
 */
export function tiptapToHtml(doc: JSONContent): string {
  return generateHTML(doc, extensions)
}

export type { JSONContent }
