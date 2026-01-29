<script setup lang="ts">
/**
 * FormationHero - Image/gradient hero avec numéro de formation
 */
import { computed } from 'vue'
import type { Formation } from '@/data/formations.data'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  formation: Formation
}>()

const icons = computed(() => ({
  lock: byPrefixAndName.fas?.['lock'],
  star: byPrefixAndName.fas?.['star'],
}))
</script>

<template>
  <div
    class="relative aspect-3/4 rounded-lg overflow-hidden"
    :style="{ backgroundColor: formation.color }"
  >
    <!-- Numéro en grand -->
    <div
      :class="[
        'absolute top-6 left-6 font-heading font-bold text-8xl opacity-20',
        formation.textColor,
      ]"
    >
      {{ formation.number }}
    </div>

    <!-- Badge bonus si applicable -->
    <div v-if="formation.isBonus" class="absolute top-4 right-4">
      <Badge variant="default" class="bg-primary text-secondary gap-1.5">
        <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-3" />
        {{ formation.starsRequired }} étoiles
      </Badge>
    </div>

    <!-- Icône cadenas pour bonus -->
    <div
      v-if="formation.isBonus"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
        <FontAwesomeIcon
          v-if="icons.lock"
          :icon="icons.lock"
          class="size-8 text-white/80"
        />
      </div>
    </div>

    <!-- Contenu en bas -->
    <div class="absolute bottom-0 left-0 right-0 p-6">
      <p :class="['font-heading font-bold text-2xl', formation.textColor]">
        {{ formation.name }}
      </p>
      <p :class="['text-sm opacity-70', formation.textColor]">
        {{ formation.subtitle }}
      </p>
    </div>
  </div>
</template>
