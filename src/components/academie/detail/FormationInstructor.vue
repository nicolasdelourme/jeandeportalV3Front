<script setup lang="ts">
/**
 * FormationInstructor - Présentation du formateur
 */
import { computed } from 'vue'
import type { Formation } from '@/data/formations.data'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  formation: Formation
}>()

const icons = computed(() => ({
  check: byPrefixAndName.fas?.['check'],
  user: byPrefixAndName.fas?.['user'],
}))
</script>

<template>
  <div class="bg-neutral-50 rounded-lg p-6">
    <h2 class="font-heading font-bold text-xl md:text-2xl text-foreground mb-6">
      Votre formateur
    </h2>

    <div class="flex flex-col sm:flex-row gap-6">
      <!-- Avatar placeholder -->
      <div class="shrink-0">
        <div
          class="w-24 h-24 rounded-full flex items-center justify-center"
          :style="{ backgroundColor: formation.color }"
        >
          <FontAwesomeIcon
            v-if="icons.user"
            :icon="icons.user"
            :class="['size-10', formation.textColor]"
          />
        </div>
      </div>

      <!-- Info -->
      <div class="flex-1">
        <h3 class="font-heading font-bold text-lg text-foreground">
          {{ formation.instructor.name }}
        </h3>
        <p class="text-muted-foreground text-sm mb-4">{{ formation.instructor.role }}</p>
        <p class="text-foreground/80 mb-4">{{ formation.instructor.bio }}</p>

        <!-- Credentials -->
        <ul class="space-y-2">
          <li
            v-for="(credential, index) in formation.instructor.credentials"
            :key="index"
            class="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <FontAwesomeIcon
              v-if="icons.check"
              :icon="icons.check"
              class="size-3 shrink-0"
              :style="{ color: formation.color }"
            />
            {{ credential }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
