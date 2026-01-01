<script setup lang="ts">
/**
 * ContentRhythmSection - Présentation du rythme mensuel des contenus
 * Lundi: Newsletter, Mardi: Tuto, Jeudi: Consultation
 */
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = computed(() => ({
  envelope: byPrefixAndName.fas?.['envelope'],
  playCircle: byPrefixAndName.fas?.['play-circle'],
  users: byPrefixAndName.fas?.['users'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))

const getIcon = (key: keyof typeof icons.value): IconDefinition => {
  return icons.value[key] as IconDefinition
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
    color: 'text-blue-500',
  },
  {
    day: 'Mardi',
    title: 'Tutoriel vidéo',
    description: 'Formation approfondie sur un sujet spécifique. Apprenez à votre rythme avec des vidéos de qualité.',
    icon: 'playCircle',
    color: 'text-green-500',
  },
  {
    day: 'Jeudi',
    title: 'Consultation live',
    description: 'Échangez en direct avec Nicolas Delourme. Posez vos questions et obtenez des réponses personnalisées.',
    icon: 'users',
    color: 'text-purple-500',
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
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

      <!-- Timeline -->
      <div class="relative">
        <!-- Ligne de connexion (desktop) -->
        <div class="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />

        <!-- Items -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div
            v-for="(content, index) in contentTypes"
            :key="content.day"
            class="flex flex-col items-center text-center"
          >
            <!-- Jour -->
            <div class="bg-primary text-primary-foreground font-semibold text-sm px-4 py-1 rounded-full mb-4">
              {{ content.day }}
            </div>

            <!-- Card -->
            <div class="bg-white rounded-sm p-6 shadow-sm border border-border w-full">
              <!-- Icône -->
              <div
                :class="[
                  'w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4',
                  'bg-neutral-100',
                ]"
              >
                <FontAwesomeIcon
                  v-if="getIcon(content.icon)"
                  :icon="getIcon(content.icon)"
                  class="size-6"
                  :class="content.color"
                />
              </div>

              <!-- Contenu -->
              <h3 class="font-heading font-bold text-lg text-foreground mb-2">
                {{ content.title }}
              </h3>
              <p class="text-muted-foreground text-sm leading-relaxed">
                {{ content.description }}
              </p>
            </div>

            <!-- Flèche (desktop, sauf dernier) -->
            <div
              v-if="index < contentTypes.length - 1"
              class="hidden md:flex absolute top-1/2 -translate-y-1/2 items-center justify-center"
              :style="{ left: `${(index + 1) * 33.33 - 2}%` }"
            >
              <div class="bg-white p-2 rounded-full border border-border">
                <FontAwesomeIcon
                  v-if="icons.arrowRight"
                  :icon="icons.arrowRight"
                  class="size-4 text-muted-foreground"
                />
              </div>
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
