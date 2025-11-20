<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  icon?: string
  title?: string
  description?: string
}>(), {
  title: 'Aucune donnée',
  description: 'Il n\'y a rien à afficher pour le moment.'
})
</script>

<template>
  <div :class="cn('flex flex-col items-center justify-center py-16 text-center', props.class)">
    <!-- Icon placeholder - can be customized via slot -->
    <div class="mb-4 rounded-full bg-neutral-100 p-3">
      <slot name="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-10 w-10 text-neutral-400"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </slot>
    </div>

    <!-- Title -->
    <h3 class="mb-2 text-lg font-semibold text-neutral-900">
      <slot name="title">
        {{ props.title }}
      </slot>
    </h3>

    <!-- Description -->
    <p class="mb-4 max-w-sm text-sm text-neutral-500">
      <slot name="description">
        {{ props.description }}
      </slot>
    </p>

    <!-- Action slot (optional) -->
    <slot name="action" />
  </div>
</template>
