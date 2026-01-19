<script setup lang="ts">
/**
 * ContentRhythmSection V2 - Cards avec gradient backgrounds
 * Style audacieux avec fonds colorés
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
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))

const getIcon = (key: keyof typeof icons.value): IconDefinition | undefined => {
  return icons.value[key] as IconDefinition | undefined
}

interface ContentType {
  day: string
  title: string
  description: string
  icon: 'envelope' | 'playCircle' | 'users'
  gradient: string
  textColor: string
}

const contentTypes: ContentType[] = [
  {
    day: 'Lundi',
    title: 'Newsletter exclusive',
    description: 'Analyse hebdomadaire des marchés et opportunités d\'investissement.',
    icon: 'envelope',
    gradient: 'from-blue-500 to-blue-600',
    textColor: 'text-white',
  },
  {
    day: 'Mardi',
    title: 'Tutoriel vidéo',
    description: 'Formation approfondie sur un sujet spécifique avec des vidéos de qualité.',
    icon: 'playCircle',
    gradient: 'from-green-500 to-green-600',
    textColor: 'text-white',
  },
  {
    day: 'Jeudi',
    title: 'Consultation live',
    description: 'Échangez en direct avec Nicolas Delourme et obtenez des réponses personnalisées.',
    icon: 'users',
    gradient: 'from-purple-500 to-purple-600',
    textColor: 'text-white',
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 2 - Gradients audacieux</Badge>
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
          :class="[
            'relative rounded-sm p-6 transition-all duration-500 cursor-pointer group flex flex-col',
            'bg-gradient-to-br',
            content.gradient,
            'hover:scale-[1.02] hover:shadow-2xl',
          ]"
        >
          <!-- Jour badge -->
          <div class="inline-flex self-start px-3 py-1 rounded-sm text-xs font-semibold bg-white/20 text-white mb-4">
            {{ content.day }}
          </div>

          <!-- Contenu -->
          <div :class="[content.textColor, 'flex flex-col flex-1']">
            <h3 class="font-heading font-bold text-xl mb-3">
              {{ content.title }}
            </h3>
            <p class="text-sm leading-relaxed opacity-90 mb-4 flex-1">
              {{ content.description }}
            </p>

            <!-- CTA subtle -->
            <div class="flex items-center gap-2 text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
              <span>En savoir plus</span>
              <FontAwesomeIcon
                v-if="icons.arrowRight"
                :icon="icons.arrowRight"
                class="size-3 group-hover:translate-x-1 transition-transform"
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
