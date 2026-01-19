<script setup lang="ts">
/**
 * FormationContentPreview - Aperçu des contenus de la formation
 */
import { computed } from 'vue'
import type { Formation } from '@/data/formations.data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  formation: Formation
}>()

const icons = computed(() => ({
  envelope: byPrefixAndName.fas?.['envelope'],
  video: byPrefixAndName.fas?.['video'],
  comments: byPrefixAndName.fas?.['comments'],
}))

const getContentIcon = (type: string): object => {
  switch (type) {
    case 'newsletter':
      return icons.value.envelope ?? {}
    case 'tuto':
      return icons.value.video ?? {}
    case 'consultation':
      return icons.value.comments ?? {}
    default:
      return icons.value.envelope ?? {}
  }
}

const getContentLabel = (type: string) => {
  switch (type) {
    case 'newsletter':
      return 'Newsletter'
    case 'tuto':
      return 'Tutoriel'
    case 'consultation':
      return 'Consultation'
    default:
      return type
  }
}
</script>

<template>
  <div>
    <h2 class="font-heading font-bold text-xl md:text-2xl text-foreground mb-6">
      Aperçu des contenus
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        v-for="(content, index) in formation.sampleContent"
        :key="index"
        class="border hover:shadow-md transition-shadow"
      >
        <CardContent class="p-4">
          <!-- Type badge -->
          <Badge
            variant="outline"
            class="mb-3 gap-1.5"
            :style="{ borderColor: formation.color, color: formation.color }"
          >
            <FontAwesomeIcon
              :icon="getContentIcon(content.type)"
              class="size-3"
            />
            {{ getContentLabel(content.type) }}
          </Badge>

          <!-- Titre et description -->
          <h4 class="font-semibold text-foreground text-sm mb-2">
            {{ content.title }}
          </h4>
          <p class="text-muted-foreground text-xs leading-relaxed">
            {{ content.description }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
