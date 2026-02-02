<script setup lang="ts">
/**
 * Composant NewsBadge
 * Badge pour identifier le type de contenu actualité
 * Utilise shadcn Badge avec style primaire (fond jaune, texte noir)
 */
import { computed } from 'vue'
import type { NewsType } from '@/types/news.types'
import { NEWS_TYPE_LABELS } from '@/types/news.types'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  type: NewsType
}>()

const label = computed(() => NEWS_TYPE_LABELS[props.type])
</script>

<template>
  <Badge variant="default" class="uppercase tracking-wide font-bold rounded-lg">
    {{ label }}
  </Badge>
</template>
