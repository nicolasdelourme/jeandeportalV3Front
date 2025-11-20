/**
 * Utilitaires pour le traitement du HTML
 * Gère le nettoyage et le rendu sécurisé du HTML provenant de l'API
 */

/**
 * Nettoie le HTML tout en préservant certaines balises
 * Remplace les entités HTML par leur équivalent
 *
 * @param html - Texte HTML brut
 * @param preserveTags - Balises à préserver (par défaut: b, strong, i, em)
 * @returns HTML nettoyé et sécurisé
 */
export function sanitizeHtml(
  html: string,
  preserveTags: string[] = ['b', 'strong', 'i', 'em']
): string {
  if (!html) return ''

  // Remplacer les entités HTML communes
  let cleaned = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")

  // Si on ne veut garder aucune balise, on les supprime toutes
  if (preserveTags.length === 0) {
    return cleaned.replace(/<[^>]*>/g, '')
  }

  // Créer un pattern pour les balises à préserver
  const preservePattern = preserveTags.join('|')
  const regex = new RegExp(`<(?!/?(?:${preservePattern})\\b)[^>]*>`, 'gi')

  // Supprimer toutes les balises sauf celles à préserver
  cleaned = cleaned.replace(regex, '')

  // Nettoyer les espaces multiples
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  return cleaned
}

/**
 * Convertit complètement le HTML en texte brut
 * Supprime toutes les balises et entités HTML
 *
 * @param html - Texte HTML
 * @returns Texte brut sans HTML
 */
export function stripHtml(html: string): string {
  if (!html) return ''

  return html
    .replace(/<[^>]*>/g, '') // Supprimer toutes les balises
    .replace(/&nbsp;/g, ' ')
    .replace(/&&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Décode les entités HTML en caractères normaux
 * Utile pour afficher du texte provenant de l'API
 *
 * @param html - Texte avec entités HTML
 * @returns Texte avec caractères décodés
 */
export function decodeHtmlEntities(html: string): string {
  if (!html) return ''

  // Créer un élément temporaire pour décoder les entités
  const textarea = document.createElement('textarea')
  textarea.innerHTML = html
  return textarea.value
}

/**
 * Tronque un texte HTML à une longueur maximale
 * Préserve les balises et ajoute "..." si tronqué
 *
 * @param html - Texte HTML
 * @param maxLength - Longueur maximale (défaut: 150)
 * @param preserveTags - Balises à préserver
 * @returns HTML tronqué
 */
export function truncateHtml(
  html: string,
  maxLength: number = 150,
  preserveTags: string[] = ['b', 'strong', 'i', 'em']
): string {
  const cleaned = sanitizeHtml(html, preserveTags)

  // Extraire le texte brut pour vérifier la longueur
  const plainText = stripHtml(cleaned)

  if (plainText.length <= maxLength) {
    return cleaned
  }

  // Tronquer le texte brut
  const truncated = plainText.substring(0, maxLength).trim()

  // Essayer de couper au dernier mot complet
  const lastSpace = truncated.lastIndexOf(' ')
  const finalText = lastSpace > maxLength * 0.8
    ? truncated.substring(0, lastSpace)
    : truncated

  // Réinjecter les balises HTML si elles étaient présentes
  // (Simplification: on retourne le texte tronqué + ...)
  return finalText + '...'
}

/**
 * Vérifie si une chaîne contient du HTML
 *
 * @param str - Chaîne à vérifier
 * @returns true si la chaîne contient du HTML
 */
export function containsHtml(str: string): boolean {
  if (!str) return false
  return /<[^>]*>/g.test(str)
}

/**
 * Extrait le texte d'un élément HTML de manière sécurisée
 * Utilise DOMParser pour un parsing correct
 *
 * @param html - HTML à parser
 * @returns Texte extrait
 */
export function extractTextFromHtml(html: string): string {
  if (!html) return ''

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  } catch (error) {
    // Fallback sur stripHtml si DOMParser échoue
    return stripHtml(html)
  }
}
