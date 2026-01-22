<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  asChild?: boolean
  href?: string
}>()
</script>

<template>
  <component
    :is="asChild ? 'slot' : 'a'"
    :href="href"
    :class="cn('transition-colors hover:text-foreground', props.class)"
  >
    <slot />
  </component>
</template>
