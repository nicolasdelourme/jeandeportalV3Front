<script setup lang="ts">
/**
 * FormationCurriculum - Programme de la formation en accordion
 */
import { computed } from 'vue'
import type { Formation } from '@/data/formations.data'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  formation: Formation
}>()

const icons = computed(() => ({
  clock: byPrefixAndName.fas?.['clock'],
  circle: byPrefixAndName.fas?.['circle'],
}))
</script>

<template>
  <div>
    <h2 class="font-heading font-bold text-xl md:text-2xl text-foreground mb-6">
      Programme de la formation
    </h2>

    <Accordion type="single" collapsible class="w-full">
      <AccordionItem
        v-for="module in formation.curriculum"
        :key="module.id"
        :value="`module-${module.id}`"
        class="border rounded-lg mb-3 overflow-hidden"
      >
        <AccordionTrigger class="px-4 py-4 hover:no-underline hover:bg-neutral-50">
          <div class="flex items-center gap-4 text-left">
            <!-- Numéro du module -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-heading font-bold"
              :style="{ backgroundColor: formation.color }"
              :class="formation.textColor"
            >
              {{ module.id }}
            </div>
            <div>
              <p class="font-semibold text-foreground">{{ module.title }}</p>
              <p class="text-sm text-muted-foreground">{{ module.description }}</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent class="px-4 pb-4">
          <div class="pl-14">
            <!-- Durée -->
            <div class="flex items-center gap-2 mb-4">
              <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="size-4 text-muted-foreground" />
              <span class="text-sm text-muted-foreground">{{ module.duration }}</span>
            </div>

            <!-- Topics -->
            <ul class="space-y-2">
              <li
                v-for="(topic, index) in module.topics"
                :key="index"
                class="flex items-start gap-3 text-sm"
              >
                <FontAwesomeIcon
                  v-if="icons.circle"
                  :icon="icons.circle"
                  class="size-1.5 mt-2 shrink-0"
                  :style="{ color: formation.color }"
                />
                <span class="text-foreground/80">{{ topic }}</span>
              </li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
