<script setup lang="ts">
/**
 * FormationFAQ - FAQ spécifique à la formation
 */
import type { Formation } from '@/data/formations.data'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const props = defineProps<{
  formation: Formation
}>()
</script>

<template>
  <div>
    <h2 class="font-heading font-bold text-xl md:text-2xl text-foreground mb-6">
      Questions fréquentes
    </h2>

    <Accordion type="single" collapsible class="w-full">
      <AccordionItem
        v-for="(item, index) in formation.faq"
        :key="index"
        :value="`faq-${index}`"
        class="border-b"
      >
        <AccordionTrigger class="py-4 text-left hover:no-underline">
          <span class="font-semibold text-foreground pr-4">{{ item.question }}</span>
        </AccordionTrigger>
        <AccordionContent class="pb-4">
          <p class="text-muted-foreground leading-relaxed">{{ item.answer }}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <!-- Lien vers FAQ générale -->
    <p class="mt-6 text-sm text-muted-foreground">
      D'autres questions ?
      <RouterLink to="/#faq" class="text-secondary font-medium hover:underline">
        Consultez notre FAQ complète
      </RouterLink>
    </p>
  </div>
</template>
