/**
 * Couleurs des thématiques Infocash Académie
 * Source unique de vérité : variables CSS dans src/style.css
 *
 * Usage:
 * import { getThemeColor, THEME_KEYS } from '@/lib/theme-colors'
 * const color = getThemeColor('metaux') // Lit --color-theme-metaux
 */

export const THEME_KEYS = ['metaux', 'portefeuille', 'liberte', 'bonus'] as const
export type ThemeColorKey = (typeof THEME_KEYS)[number]

/**
 * Mapping des clés vers les noms de variables CSS
 */
const CSS_VAR_NAMES: Record<ThemeColorKey, string> = {
  metaux: '--color-theme-metaux',
  portefeuille: '--color-theme-portefeuille',
  liberte: '--color-theme-liberte',
  bonus: '--color-theme-bonus',
}

/**
 * Fallback values (utilisés si CSS non chargé, ex: SSR)
 * Ces valeurs DOIVENT correspondre à src/style.css
 */
const FALLBACK_COLORS: Record<ThemeColorKey, string> = {
  metaux: '#F2CC00',
  portefeuille: '#A8C7EA',
  liberte: '#F4BFA6',
  bonus: '#1D1D1D',
}

/**
 * Cache pour éviter les lectures DOM répétées
 */
let colorsCache: Record<ThemeColorKey, string> | null = null

/**
 * Lit une variable CSS depuis le document
 */
function getCSSVariable(varName: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

/**
 * Récupère la couleur d'une thématique depuis les variables CSS
 * @param theme - Clé de la thématique (metaux, portefeuille, liberte, bonus)
 * @returns La couleur hex
 */
export function getThemeColor(theme: ThemeColorKey): string {
  // En SSR ou si DOM non disponible, utiliser fallback
  if (typeof document === 'undefined') {
    return FALLBACK_COLORS[theme]
  }

  // Utiliser le cache si disponible
  if (colorsCache) {
    return colorsCache[theme]
  }

  // Lire depuis CSS et cacher
  const cssValue = getCSSVariable(CSS_VAR_NAMES[theme])
  return cssValue || FALLBACK_COLORS[theme]
}

/**
 * Charge toutes les couleurs depuis CSS et les met en cache
 * Appeler une fois au démarrage de l'app pour optimiser
 */
export function initThemeColors(): Record<ThemeColorKey, string> {
  if (typeof document === 'undefined') {
    return { ...FALLBACK_COLORS }
  }

  colorsCache = {
    metaux: getCSSVariable(CSS_VAR_NAMES.metaux) || FALLBACK_COLORS.metaux,
    portefeuille: getCSSVariable(CSS_VAR_NAMES.portefeuille) || FALLBACK_COLORS.portefeuille,
    liberte: getCSSVariable(CSS_VAR_NAMES.liberte) || FALLBACK_COLORS.liberte,
    bonus: getCSSVariable(CSS_VAR_NAMES.bonus) || FALLBACK_COLORS.bonus,
  }

  return colorsCache
}

/**
 * Récupère toutes les couleurs (depuis cache ou CSS)
 */
export function getAllThemeColors(): Record<ThemeColorKey, string> {
  if (colorsCache) return colorsCache
  return initThemeColors()
}

/**
 * Configuration complète des thématiques
 * Utilise getThemeColor() pour rester synchronisé avec CSS
 */
export function getThemeConfig(theme: ThemeColorKey) {
  const configs = {
    metaux: {
      textColor: 'text-black',
      name: 'Métaux précieux',
      shortName: 'Métaux',
    },
    portefeuille: {
      textColor: 'text-slate-900',
      name: 'Portefeuille permanent',
      shortName: 'Portefeuille',
    },
    liberte: {
      textColor: 'text-slate-900',
      name: 'Liberté financière',
      shortName: 'Liberté',
    },
    bonus: {
      textColor: 'text-white',
      name: 'Bonus exclusif',
      shortName: 'Bonus',
    },
  } as const

  return {
    ...configs[theme],
    color: getThemeColor(theme),
  }
}
