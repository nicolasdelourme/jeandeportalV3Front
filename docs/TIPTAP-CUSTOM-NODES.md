# Nodes TipTap Custom — Documentation Backend

Ce document décrit les nodes TipTap personnalisés utilisés dans le frontend Infocash. L'éditeur du backoffice doit implémenter ces mêmes nodes pour que le contenu soit correctement rendu côté client.

## Table des matières

1. [Architecture générale](#architecture-générale)
2. [Node `calloutBlock`](#node-calloutblock) — Encadrés éditoriaux
3. [Node `imipieChart`](#node-imipiechart) — Graphiques Highcharts
4. [Node `articleTeaser`](#node-articleteaser) — Renvoi vers un article
5. [CSS pour l'éditeur](#css-pour-léditeur)
6. [Exemples JSON complets](#exemples-json-complets)

---

## Architecture générale

### Flux de données

```
Backoffice TipTap → JSON stocké en BDD → API → Frontend Vue → HTML rendu
```

Le frontend utilise `@tiptap/html` avec `generateHTML()` pour convertir le JSON en HTML, puis `ProseContent.vue` parse le HTML pour détecter les blocs custom et les rendre avec les composants Vue appropriés.

### Types de nodes

| Node | Type | Description |
|------|------|-------------|
| `calloutBlock` | Container (`content: 'block+'`) | Encadré éditorial avec titre et icône |
| `imipieChart` | Atom (`atom: true`) | Graphique Highcharts via API imiPie |
| `articleTeaser` | Atom (`atom: true`) | Renvoi inline vers un autre article |

**Atom** = node vide, sans contenu interne
**Container** = node qui contient d'autres nodes (paragraphes, listes, etc.)

---

## Node `calloutBlock`

Encadré éditorial stylisé pour mettre en valeur du contenu important (alerte, info, conseil, danger).

### Attributs

| Attribut | Type | Obligatoire | Valeurs possibles | Description |
|----------|------|-------------|-------------------|-------------|
| `style` | string | Oui | `alerte`, `info`, `success`, `danger` | Style visuel de l'encadré |
| `icon` | string | Non | Nom FontAwesome (ex: `circle-info`) | Icône affichée à gauche |
| `title` | string | Non | Texte libre | Titre en gras au-dessus du contenu |

### Icônes par défaut (si `icon` non spécifié)

| Style | Icône par défaut | Couleur |
|-------|------------------|---------|
| `alerte` | `triangle-exclamation` | Jaune primary |
| `info` | `circle-info` | Jaune primary |
| `success` | `circle-check` | Vert emerald |
| `danger` | `shield-halved` | Rouge |

### Rendu HTML généré

```html
<div data-callout data-style="info" data-icon="circle-info" data-title="Titre optionnel">
  <p>Contenu de l'encadré...</p>
  <p>Peut contenir plusieurs paragraphes, du <strong>gras</strong>, etc.</p>
</div>
```

### Structure JSON

```json
{
  "type": "calloutBlock",
  "attrs": {
    "style": "info",
    "icon": "circle-info",
    "title": "Qui sont les émetteurs ?"
  },
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Les stablecoins sont émis par..." }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Deuxième paragraphe..." }
      ]
    }
  ]
}
```

### Exemple minimal (sans titre ni icône custom)

```json
{
  "type": "calloutBlock",
  "attrs": { "style": "alerte" },
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Attention : ceci est une alerte importante." }
      ]
    }
  ]
}
```

---

## Node `imipieChart`

Graphique Highcharts alimenté par l'API imiPie. C'est un node **atom** : il n'a pas de contenu interne.

Le backend construit l'URL complète de l'API imiPie et la fournit au frontend, qui la fetch directement.

### Attributs

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `url` | string | **Oui** | URL complète de l'API imiPie |
| `height` | string | Non | Hauteur explicite (ex: `400px`). Si absent, l'API gère le ratio |
| `title` | string | Non | Titre optionnel affiché au-dessus du graphique |

### Format de l'URL imiPie

```
https://imipie.ovh/api/{family}/{serie}/highcharts?output=json&profile=infocashWeb&startDate=...&stopDate=...&xTick=...
```

**Exemple concret :**
```
https://imipie.ovh/api/gold/lbmaSerie/highcharts?output=json&profile=infocashWeb&startDate=2020-01-01&stopDate=2025-12-31&xTick=365
```

### Rendu HTML généré

```html
<div data-imipie-chart
     data-url="https://imipie.ovh/api/gold/lbmaSerie/highcharts?output=json&profile=infocashWeb&startDate=2020-01-01&stopDate=2025-12-31&xTick=365">
</div>
```

Avec attributs optionnels :

```html
<div data-imipie-chart
     data-url="https://imipie.ovh/api/gold/lbmaSerie/highcharts?output=json&profile=infocashWeb"
     data-height="400px"
     data-title="Évolution du cours de l'or">
</div>
```

### Structure JSON TipTap

```json
{
  "type": "imipieChart",
  "attrs": {
    "url": "https://imipie.ovh/api/gold/lbmaSerie/highcharts?output=json&profile=infocashWeb&startDate=2020-01-01&stopDate=2025-12-31&xTick=365"
  }
}
```

Avec attributs optionnels :

```json
{
  "type": "imipieChart",
  "attrs": {
    "url": "https://imipie.ovh/api/gold/lbmaSerie/highcharts?output=json&profile=infocashWeb",
    "height": "400px",
    "title": "Évolution du cours de l'or"
  }
}
```

### Paramètres de l'URL imiPie

Le backend doit construire l'URL avec ces paramètres :

| Paramètre | Position | Obligatoire | Description |
|-----------|----------|-------------|-------------|
| `family` | Path | Oui | Famille de données (ex: `gold`, `silver`, `cpi`) |
| `serie` | Path | Oui | Série à afficher (ex: `lbmaSerie`, `spotSerie`) |
| `output` | Query | Oui | Toujours `json` |
| `profile` | Query | Oui | Toujours `infocashWeb` |
| `startDate` | Query | Non | Date de début `YYYY-MM-DD` |
| `stopDate` | Query | Non | Date de fin `YYYY-MM-DD` |
| `xTick` | Query | Non | Intervalle des ticks X en jours |

### Familles et séries disponibles

*(À compléter avec la liste exhaustive de l'API imiPie)*

| Family | Séries disponibles | Description |
|--------|-------------------|-------------|
| `gold` | `lbmaSerie`, `spotSerie` | Cours de l'or |
| `silver` | `lbmaSerie`, `spotSerie` | Cours de l'argent |
| `cpi` | `frSerie`, `euSerie`, `usSerie` | Indices des prix |

---

## Node `articleTeaser`

Renvoi inline vers un autre article, affiché dans le flux du contenu. C'est un node **atom**.

### Attributs

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `slug` | string | Oui | Slug de l'article cible |

### Rendu HTML généré

```html
<div data-article-teaser data-slug="toujours-pas-droit-garde-veracash"></div>
```

### Structure JSON

```json
{
  "type": "articleTeaser",
  "attrs": {
    "slug": "toujours-pas-droit-garde-veracash"
  }
}
```

### Rendu frontend

Le frontend récupère les métadonnées de l'article cible (titre, thumbnail, type) et affiche un bloc "À LIRE AUSSI" avec lien cliquable.

---

## CSS pour l'éditeur

Le fichier `public/tiptap-editor.css` contient les styles pour prévisualiser les nodes custom dans l'éditeur TipTap du backoffice.

### Import

```html
<link rel="stylesheet" href="https://jeandeportal.fr/tiptap-editor.css">
```

### Styles des callouts

```css
.ProseMirror [data-type="calloutBlock"] {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
}

.ProseMirror [data-type="calloutBlock"][data-style="alerte"] {
  border-left: 4px solid #ffde00;
  background: rgba(255, 222, 0, 0.1);
}

.ProseMirror [data-type="calloutBlock"][data-style="info"] {
  border: 2px solid #ffde00;
}

.ProseMirror [data-type="calloutBlock"][data-style="success"] {
  border-left: 4px solid #10b981;
  background: rgba(16, 185, 129, 0.08);
}

.ProseMirror [data-type="calloutBlock"][data-style="danger"] {
  border-left: 4px solid #ef4444;
  background: rgba(239, 68, 68, 0.08);
}
```

### Placeholder pour imipieChart

```css
.ProseMirror [data-type="imipieChart"] {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  margin: 1.5rem 0;
  background: #fafafa;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  color: #737373;
  font-size: 0.875rem;
}

.ProseMirror [data-type="imipieChart"]::before {
  content: 'Graphique Highcharts';
}
```

### Placeholder pour articleTeaser

```css
.ProseMirror [data-type="articleTeaser"] {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  margin: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.ProseMirror [data-type="articleTeaser"]::before {
  content: 'A LIRE AUSSI';
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #737373;
}
```

---

## Exemples JSON complets

### Article avec tous les types de blocs

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Introduction de l'article..." }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [
        { "type": "text", "text": "Premier titre" }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Texte avec du " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "gras" },
        { "type": "text", "text": " et de l'" },
        { "type": "text", "marks": [{ "type": "italic" }], "text": "italique" },
        { "type": "text", "text": "." }
      ]
    },
    {
      "type": "calloutBlock",
      "attrs": {
        "style": "alerte",
        "icon": "triangle-exclamation"
      },
      "content": [
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Attention : point important à retenir." }
          ]
        }
      ]
    },
    {
      "type": "articleTeaser",
      "attrs": { "slug": "autre-article-slug" }
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [
        { "type": "text", "text": "Évolution des cours" }
      ]
    },
    {
      "type": "imipieChart",
      "attrs": {
        "url": "https://imipie.ovh/api/gold/lbmaSerie/highcharts?output=json&profile=infocashWeb&startDate=2020-01-01&stopDate=2025-12-31&xTick=365"
      }
    },
    {
      "type": "blockquote",
      "content": [
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Citation importante d'un expert." }
          ]
        }
      ]
    },
    {
      "type": "calloutBlock",
      "attrs": {
        "style": "info",
        "icon": "circle-info",
        "title": "Pour aller plus loin"
      },
      "content": [
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Premier paragraphe de l'encadré info." }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Deuxième paragraphe avec des " },
            { "type": "text", "marks": [{ "type": "bold" }], "text": "mots en gras" },
            { "type": "text", "text": "." }
          ]
        }
      ]
    },
    {
      "type": "calloutBlock",
      "attrs": {
        "style": "success",
        "icon": "circle-check",
        "title": "Le saviez-vous ?"
      },
      "content": [
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Fait intéressant à partager." }
          ]
        }
      ]
    },
    {
      "type": "calloutBlock",
      "attrs": {
        "style": "danger",
        "icon": "shield-halved",
        "title": "Attention"
      },
      "content": [
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "Avertissement important sur un risque." }
          ]
        }
      ]
    }
  ]
}
```

---

## Implémentation côté éditeur TipTap

### Node calloutBlock (exemple JS)

```javascript
import { Node } from '@tiptap/core'

const CalloutBlock = Node.create({
  name: 'calloutBlock',
  group: 'block',
  content: 'block+',  // Permet des paragraphes, listes, etc. à l'intérieur

  addAttributes() {
    return {
      style: { default: 'info' },
      icon: { default: null },
      title: { default: null },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = { 'data-callout': '' }
    if (HTMLAttributes.style) attrs['data-style'] = HTMLAttributes.style
    if (HTMLAttributes.icon) attrs['data-icon'] = HTMLAttributes.icon
    if (HTMLAttributes.title) attrs['data-title'] = HTMLAttributes.title
    return ['div', attrs, 0]  // 0 = slot pour le contenu enfant
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }]
  },
})
```

### Node imipieChart (exemple JS)

```javascript
import { Node } from '@tiptap/core'

const ImipieChart = Node.create({
  name: 'imipieChart',
  group: 'block',
  atom: true,  // Pas de contenu interne

  addAttributes() {
    return {
      url: { default: null },      // URL complète de l'API
      height: { default: null },   // Hauteur optionnelle
      title: { default: null },    // Titre optionnel
    }
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = { 'data-imipie-chart': '' }
    if (HTMLAttributes.url) attrs['data-url'] = HTMLAttributes.url
    if (HTMLAttributes.height) attrs['data-height'] = HTMLAttributes.height
    if (HTMLAttributes.title) attrs['data-title'] = HTMLAttributes.title
    return ['div', attrs]
  },

  parseHTML() {
    return [{ tag: 'div[data-imipie-chart]' }]
  },
})
```

### Node articleTeaser (exemple JS)

```javascript
import { Node } from '@tiptap/core'

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
```

---

## Checklist d'implémentation

- [ ] Créer le node `calloutBlock` avec les 4 styles (alerte, info, success, danger)
- [ ] Créer le node `imipieChart` avec tous les attributs
- [ ] Créer le node `articleTeaser` avec sélecteur d'article
- [ ] Ajouter les styles CSS de prévisualisation
- [ ] Créer les boutons/menus pour insérer ces blocs
- [ ] Tester le JSON généré avec le frontend
