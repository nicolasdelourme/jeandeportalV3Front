<script setup lang="ts">
/**
 * ContentRhythmSection V5 - Cycle des 4 thèmes sur 4 semaines
 * Montre comment les couleurs de thème tournent semaine après semaine
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = computed(() => ({
  envelope: byPrefixAndName.fas?.['envelope'],
  graduationCap: byPrefixAndName.fas?.['graduation-cap'],
  comments: byPrefixAndName.fas?.['comments'],
}))

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
}

// Les 4 thèmes avec leurs couleurs
const themes = [
  { name: 'Métaux précieux', color: '#F2CC00', textColor: 'text-black' },
  { name: 'Portefeuille permanent', color: '#A8C7EA', textColor: 'text-slate-900' },
  { name: 'Liberté financière', color: '#F4BFA6', textColor: 'text-slate-900' },
  { name: 'Bonus mystère', color: '#1D1D1D', textColor: 'text-white' },
]

// Les 3 types de contenu
const contentTypes = [
  { day: 'Lundi', title: 'Newsletter', icon: 'envelope' as const },
  { day: 'Mardi', title: 'Tutoriel', icon: 'graduationCap' as const },
  { day: 'Jeudi', title: 'Consultation', icon: 'comments' as const },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 5 - Cycle 4 semaines</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Un rythme régulier pour progresser
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Chaque semaine, une thématique différente. En un mois, vous explorez les 4 piliers
          de votre indépendance financière.
        </p>
      </div>

      <!-- Légende des contenus -->
      <div class="flex flex-wrap justify-center gap-6 mb-10">
        <div
          v-for="content in contentTypes"
          :key="content.day"
          class="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <div class="w-8 h-8 rounded-sm bg-neutral-200 flex items-center justify-center">
            <FontAwesomeIcon
              v-if="icons[content.icon]"
              :icon="getIconDef(content.icon)"
              class="size-4 text-neutral-600"
            />
          </div>
          <span><strong>{{ content.day }}</strong> : {{ content.title }}</span>
        </div>
      </div>

      <!-- Grille des 4 semaines -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(theme, weekIndex) in themes"
          :key="theme.name"
          class="rounded-sm border-2 overflow-hidden hover:shadow-lg transition-all duration-300"
          :style="{ borderColor: theme.color }"
        >
          <!-- Header semaine -->
          <div
            class="px-4 py-3 font-heading font-bold text-sm"
            :class="theme.textColor"
            :style="{ backgroundColor: theme.color }"
          >
            Semaine {{ weekIndex + 1 }}
            <span class="font-normal opacity-80 block text-xs mt-0.5">{{ theme.name }}</span>
          </div>

          <!-- Contenus de la semaine -->
          <div class="bg-white p-4 space-y-3">
            <div
              v-for="content in contentTypes"
              :key="content.day"
              class="flex items-center gap-3"
            >
              <!-- Icône -->
              <div
                class="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
                :style="{ backgroundColor: `${theme.color}20` }"
              >
                <FontAwesomeIcon
                  v-if="icons[content.icon]"
                  :icon="getIconDef(content.icon)"
                  class="size-4"
                  :style="{ color: theme.color }"
                />
              </div>

              <!-- Texte -->
              <div class="min-w-0">
                <p class="text-xs text-muted-foreground">{{ content.day }}</p>
                <p class="font-medium text-sm text-foreground truncate">{{ content.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicateur de cycle -->
      <div class="flex items-center justify-center gap-2 mt-8">
        <div
          v-for="(theme, index) in themes"
          :key="index"
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: theme.color }"
        />
        <span class="text-muted-foreground text-sm ml-2">→ puis on recommence !</span>
      </div>

      <!-- Note -->
      <p class="text-center text-muted-foreground text-sm mt-6">
        * Avec un abonnement multi-thématiques, recevez plusieurs contenus par semaine !
      </p>
    </div>
  </section>
</template>
