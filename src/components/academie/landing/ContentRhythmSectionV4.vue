<script setup lang="ts">
/**
 * ContentRhythmSection V4 - Timeline avec jours numérotés
 * Style éditorial avec cercles colorés et ligne de connexion
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = computed(() => ({
  envelope: byPrefixAndName.fas?.['envelope'],
  playCircle: byPrefixAndName.fas?.['play-circle'],
  users: byPrefixAndName.fas?.['users'],
}))

const getIcon = (key: keyof typeof icons.value): IconDefinition | undefined => {
  return icons.value[key] as IconDefinition | undefined
}

interface ContentType {
  day: string
  dayShort: string
  title: string
  description: string
  icon: 'envelope' | 'playCircle' | 'users'
  color: string
}

const contentTypes: ContentType[] = [
  {
    day: 'Lundi',
    dayShort: 'LUN',
    title: 'Newsletter exclusive',
    description: 'Analyse hebdomadaire des marchés et opportunités d\'investissement directement dans votre boîte mail.',
    icon: 'envelope',
    color: '#3B82F6',
  },
  {
    day: 'Mardi',
    dayShort: 'MAR',
    title: 'Tutoriel vidéo',
    description: 'Formation approfondie sur un sujet spécifique. Apprenez à votre rythme avec des vidéos de qualité.',
    icon: 'playCircle',
    color: '#22C55E',
  },
  {
    day: 'Jeudi',
    dayShort: 'JEU',
    title: 'Consultation live',
    description: 'Échangez en direct avec Nicolas Delourme. Posez vos questions et obtenez des réponses personnalisées.',
    icon: 'users',
    color: '#A855F7',
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 4 - Timeline jours</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Un rythme régulier pour progresser
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Chaque semaine, recevez de nouveaux contenus pour approfondir vos connaissances.
        </p>
      </div>

      <!-- Timeline Grid -->
      <div class="relative">
        <!-- Ligne de connexion horizontale (desktop) -->
        <div class="hidden md:block absolute top-16 left-0 right-0 h-px bg-border" />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          <div
            v-for="content in contentTypes"
            :key="content.day"
            class="relative group"
          >
            <!-- Jour avec cercle coloré -->
            <div class="flex items-center gap-4 mb-6">
              <div
                class="relative w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-sm z-10 transition-transform group-hover:scale-110 text-white"
                :style="{ backgroundColor: content.color }"
              >
                {{ content.dayShort }}
              </div>
              <!-- Ligne vers le bas (mobile) -->
              <div class="flex-1 h-px bg-border md:hidden" />
            </div>

            <!-- Card content -->
            <div class="bg-neutral-50 rounded-sm p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border group-hover:border-transparent h-full flex flex-col">
              <h3 class="font-heading font-bold text-lg text-foreground mb-2">
                {{ content.title }}
              </h3>
              <p class="text-muted-foreground text-sm leading-relaxed flex-1">
                {{ content.description }}
              </p>

              <!-- Indicateur coloré en bas -->
              <div
                class="mt-4 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-full"
                :style="{ backgroundColor: content.color }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Note -->
      <p class="text-center text-muted-foreground text-sm mt-10">
        * Chaque thématique suit ce rythme. Avec plusieurs thématiques, multipliez les contenus !
      </p>
    </div>
  </section>
</template>
