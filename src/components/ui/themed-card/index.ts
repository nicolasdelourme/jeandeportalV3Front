export { default as ThemedCard } from "./ThemedCard.vue"
export { default as ThemedCardModal } from "./ThemedCardModal.vue"

// Types pour les thèmes
export type ThemeType = 'metaux' | 'portefeuille' | 'liberte' | 'bonus'

// Utilitaire pour obtenir les classes CSS d'un thème
export const getThemeClasses = (theme: ThemeType) => {
  const themes = {
    metaux: {
      border: 'border-theme-metaux',
      bg: 'bg-theme-metaux',
      bgLight: 'bg-theme-metaux-light',
      text: 'text-foreground',
      gradient: 'from-[var(--color-theme-metaux-gradient-start)] to-[var(--color-theme-metaux-gradient-end)]',
    },
    portefeuille: {
      border: 'border-theme-portefeuille',
      bg: 'bg-theme-portefeuille',
      bgLight: 'bg-theme-portefeuille-light',
      text: 'text-foreground',
      gradient: 'from-[var(--color-theme-portefeuille-gradient-start)] to-[var(--color-theme-portefeuille-gradient-end)]',
    },
    liberte: {
      border: 'border-theme-liberte',
      bg: 'bg-theme-liberte',
      bgLight: 'bg-theme-liberte-light',
      text: 'text-foreground',
      gradient: 'from-[var(--color-theme-liberte-gradient-start)] to-[var(--color-theme-liberte-gradient-end)]',
    },
    bonus: {
      border: 'border-theme-bonus',
      bg: 'bg-theme-bonus',
      bgLight: 'bg-theme-bonus-light',
      text: 'text-white',
      gradient: 'from-[var(--color-theme-bonus-gradient-start)] to-[var(--color-theme-bonus-gradient-end)]',
    },
  }
  return themes[theme]
}

// Labels français pour les thèmes
export const themeLabels: Record<ThemeType, string> = {
  metaux: 'Métaux précieux',
  portefeuille: 'Portefeuille permanent',
  liberte: 'Liberté financière',
  bonus: 'Bonus mystère',
}
