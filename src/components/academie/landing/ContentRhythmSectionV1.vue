<script setup lang="ts">
/**
 * ContentRhythmSection V1 - Cards avec barre latérale colorée
 * Style épuré avec accent sur le côté gauche
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
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
  title: string
  description: string
  icon: 'envelope' | 'playCircle' | 'users'
  color: string
}

const contentTypes: ContentType[] = [
  {
    day: 'Lundi',
    title: 'Newsletter exclusive',
    description: 'Analyse hebdomadaire des marchés et opportunités d\'investissement directement dans votre boîte mail.',
    icon: 'envelope',
    color: '#3B82F6',
  },
  {
    day: 'Mardi',
    title: 'Tutoriel vidéo',
    description: 'Formation approfondie sur un sujet spécifique. Apprenez à votre rythme avec des vidéos de qualité.',
    icon: 'playCircle',
    color: '#22C55E',
  },
  {
    day: 'Jeudi',
    title: 'Consultation live',
    description: 'Échangez en direct avec Nicolas Delourme. Posez vos questions et obtenez des réponses personnalisées.',
    icon: 'users',
    color: '#A855F7',
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 1 - Barres latérales</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Un rythme régulier pour progresser
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Chaque semaine, recevez de nouveaux contenus pour approfondir vos connaissances
          et affiner votre stratégie d'investissement.
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="content in contentTypes"
          :key="content.day"
          class="relative bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col"
        >
          <!-- Barre colorée gauche -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1.5 group-hover:w-2 transition-all duration-300"
            :style="{ backgroundColor: content.color }"
          />

          <div class="p-6 pl-8 flex flex-col flex-1">
            <!-- Jour -->
            <div
              class="inline-flex self-start px-3 py-1 rounded-sm text-xs font-semibold text-white mb-4"
              :style="{ backgroundColor: content.color }"
            >
              {{ content.day }}
            </div>

            <!-- Contenu -->
            <h3 class="font-heading font-bold text-xl text-foreground mb-2">
              {{ content.title }}
            </h3>
            <p class="text-muted-foreground text-sm leading-relaxed flex-1">
              {{ content.description }}
            </p>
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
