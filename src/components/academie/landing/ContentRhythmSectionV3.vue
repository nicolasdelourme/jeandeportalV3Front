<script setup lang="ts">
/**
 * ContentRhythmSection V3 - Cards avec icônes et fonds colorés
 * Style moderne avec coins arrondis sm
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

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
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
        <Badge variant="outline" class="text-xs">VERSION 3 - Icônes + fonds colorés</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Un rythme régulier pour progresser
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Chaque semaine, recevez de nouveaux contenus pour approfondir vos connaissances.
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="content in contentTypes"
          :key="content.day"
          class="relative rounded-sm p-6 border-2 hover:shadow-lg transition-all duration-300 group flex flex-col"
          :style="{
            borderColor: content.color,
            backgroundColor: `${content.color}10`,
          }"
        >
          <!-- Jour badge -->
          <div
            class="inline-flex self-start px-3 py-1 rounded-sm text-xs font-semibold text-white mb-4"
            :style="{ backgroundColor: content.color }"
          >
            {{ content.day }}
          </div>

          <!-- Icône -->
          <div
            class="w-10 h-10 rounded-sm flex items-center justify-center mb-4"
            :style="{ backgroundColor: content.color }"
          >
            <FontAwesomeIcon
              v-if="icons[content.icon]"
              :icon="getIconDef(content.icon)"
              class="size-5 text-white"
            />
          </div>

          <!-- Contenu -->
          <h3 class="font-heading font-bold text-lg text-foreground mb-2">
            {{ content.title }}
          </h3>
          <p class="text-muted-foreground text-sm leading-relaxed flex-1">
            {{ content.description }}
          </p>
        </div>
      </div>

      <!-- Note -->
      <p class="text-center text-muted-foreground text-sm mt-10">
        * Chaque thématique suit ce rythme. Avec plusieurs thématiques, multipliez les contenus !
      </p>
    </div>
  </section>
</template>
