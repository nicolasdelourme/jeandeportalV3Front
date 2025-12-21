<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { Primitive } from "reka-ui"
import { computed } from "vue"
import { cn } from "@/lib/utils"
import { buttonVariants } from "."

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  rounded?: ButtonVariants["rounded"]
  color?: string
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  color: "primary",
})

/**
 * Génère dynamiquement les styles inline de couleur selon le variant
 * Utilise CSS variables et styles inline pour éviter les problèmes de purge Tailwind
 */
const computedColorStyles = computed(() => {
  const variant = props.variant || "default"
  const color = props.color

  // Convertir les noms de couleurs en valeurs CSS variables
  const getColorValue = (colorName: string): string => {
    // Si c'est primary
    if (colorName === 'primary') {
      return 'var(--primary)'
    }

    // ═══ Thématiques Infocash Académie ═══
    // Support direct des noms de thèmes
    const themeColors: Record<string, string> = {
      'theme-metaux': 'var(--color-theme-metaux)',
      'theme-portefeuille': 'var(--color-theme-portefeuille)',
      'theme-liberte': 'var(--color-theme-liberte)',
      'theme-bonus': 'var(--color-theme-bonus)',
      // Raccourcis pour les thèmes (usage: color="metaux")
      'metaux': 'var(--color-theme-metaux)',
      'portefeuille': 'var(--color-theme-portefeuille)',
      'liberte': 'var(--color-theme-liberte)',
      'bonus': 'var(--color-theme-bonus)',
    }

    if (themeColors[colorName]) {
      return themeColors[colorName]
    }

    // Pour toutes les autres couleurs (custom ou Tailwind)
    // Utiliser --color-{nom} qui est défini dans @theme
    return `var(--color-${colorName})`
  }

  const colorValue = getColorValue(color)

  return {
    '--button-color': colorValue,
  }
})

/**
 * Génère les classes Tailwind selon le variant (sans couleur dynamique)
 */
const computedColorClasses = computed(() => {
  const variant = props.variant || "default"

  // Pour le variant "default" (bouton plein)
  if (variant === "default") {
    return `[background-color:var(--button-color)] hover:opacity-90 text-white`
  }

  // Pour le variant "outline" (bordure)
  if (variant === "outline") {
    return `[border-color:var(--button-color)] [color:var(--button-color)] hover:[background-color:var(--button-color)] hover:text-white`
  }

  // Pour le variant "ghost" (transparent)
  if (variant === "ghost") {
    return `[color:var(--button-color)] hover:[background-color:color-mix(in_srgb,var(--button-color)_10%,transparent)]`
  }

  // Pour le variant "link" (lien)
  if (variant === "link") {
    return `[color:var(--button-color)] underline-offset-4 hover:underline`
  }

  // Fallback
  return ""
})
</script>

<template>
  <Primitive data-slot="button" :as="as" :as-child="asChild"
    :class="cn(buttonVariants({ variant, size, rounded }), computedColorClasses, props.class)"
    :style="computedColorStyles">
    <slot />
  </Primitive>
</template>
