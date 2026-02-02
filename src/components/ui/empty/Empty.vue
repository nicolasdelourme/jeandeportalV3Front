<script setup lang="ts">
/**
 * Empty State
 * Design géométrique cohérent avec cercles concentriques et dots décoratifs
 */
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  /**
   * Titre (ou utiliser slot #title)
   */
  title?: string
  /**
   * Description (ou utiliser slot #description)
   */
  description?: string
  /**
   * Taille de l'illustration
   */
  size?: 'sm' | 'md' | 'lg'
}>(), {
  title: 'Aucune donnée',
  description: 'Il n\'y a rien à afficher pour le moment.',
  size: 'md',
})

const sizeClasses = {
  sm: {
    outer: 'w-20 h-20',
    inner: 'w-14 h-14',
    icon: 'w-8 h-8',
    dots: 'scale-75',
  },
  md: {
    outer: 'w-28 h-28 md:w-32 md:h-32',
    inner: 'w-20 h-20 md:w-22 md:h-22',
    icon: 'w-10 h-10 md:w-12 md:h-12',
    dots: 'scale-100',
  },
  lg: {
    outer: 'w-36 h-36 md:w-44 md:h-44',
    inner: 'w-28 h-28 md:w-32 md:h-32',
    icon: 'w-14 h-14 md:w-16 md:h-16',
    dots: 'scale-125',
  },
}
</script>

<template>
  <div :class="cn('flex flex-col items-center justify-center py-12 md:py-16 text-center px-4', props.class)">
    <!-- Illustration géométrique -->
    <div class="relative mb-6">
      <!-- Cercle externe -->
      <div :class="cn('rounded-full bg-primary/10 flex items-center justify-center', sizeClasses[size].outer)">
        <!-- Cercle interne -->
        <div :class="cn('rounded-full bg-primary/20 flex items-center justify-center', sizeClasses[size].inner)">
          <!-- Icône (slot) -->
          <div :class="cn('text-secondary flex items-center justify-center', sizeClasses[size].icon)">
            <slot name="icon">
              <!-- Icône par défaut (horloge) -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-full h-full"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </slot>
          </div>
        </div>
      </div>

      <!-- Éléments décoratifs -->
      <div :class="cn('absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full opacity-60', sizeClasses[size].dots)"></div>
      <div :class="cn('absolute -bottom-1 -left-3 w-3 h-3 bg-secondary rounded-full opacity-40', sizeClasses[size].dots)"></div>
      <div :class="cn('absolute top-1/2 -right-5 w-2 h-2 bg-primary/50 rounded-full', sizeClasses[size].dots)"></div>
    </div>

    <!-- Titre -->
    <h3 class="font-heading font-bold text-lg md:text-xl text-secondary mb-2">
      <slot name="title">
        {{ props.title }}
      </slot>
    </h3>

    <!-- Description -->
    <p class="text-muted-foreground text-sm md:text-base max-w-sm mb-6 leading-relaxed">
      <slot name="description">
        {{ props.description }}
      </slot>
    </p>

    <!-- Action (slot optionnel) -->
    <slot name="action"></slot>
  </div>
</template>
