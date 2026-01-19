<script setup lang="ts">
/**
 * ContentRhythmSection V6 - Timeline mensuelle horizontale
 * Vue calendrier avec progression des thèmes
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
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
}

// Les 4 thèmes avec leurs couleurs
const themes = [
  { name: 'Métaux', fullName: 'Métaux précieux', color: '#F2CC00', textColor: 'text-black' },
  { name: 'Portefeuille', fullName: 'Portefeuille permanent', color: '#A8C7EA', textColor: 'text-slate-900' },
  { name: 'Liberté', fullName: 'Liberté financière', color: '#F4BFA6', textColor: 'text-slate-900' },
  { name: 'Bonus', fullName: 'Bonus mystère', color: '#1D1D1D', textColor: 'text-white' },
]

// Les 3 types de contenu avec leurs icônes
const contentTypes = [
  { day: 'LUN', title: 'Newsletter', icon: 'envelope' as const },
  { day: 'MAR', title: 'Tutoriel', icon: 'graduationCap' as const },
  { day: 'JEU', title: 'Consultation', icon: 'comments' as const },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
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

      <!-- Timeline horizontale -->
      <div class="relative overflow-x-auto pb-4">
        <div class="flex gap-4 min-w-max lg:min-w-0 lg:grid lg:grid-cols-4 lg:gap-12">
          <div
            v-for="(theme, weekIndex) in themes"
            :key="theme.name"
            class="relative flex-1 min-w-[240px] lg:min-w-0"
          >
            <!-- Semaine header -->
            <div class="text-center mb-4">
              <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-full font-heading font-bold text-sm mb-2"
                :class="theme.textColor"
                :style="{ backgroundColor: theme.color }"
              >
                S{{ weekIndex + 1 }}
              </div>
              <p class="font-medium text-foreground text-sm">{{ theme.fullName }}</p>
            </div>

            <!-- Card avec les 3 jours -->
            <div
              class="rounded-sm p-4 border-2"
              :style="{
                borderColor: theme.color,
                backgroundColor: `${theme.color}08`,
              }"
            >
              <div class="space-y-3">
                <div
                  v-for="content in contentTypes"
                  :key="content.day"
                  class="flex items-center gap-3 bg-white rounded-sm p-3 shadow-sm"
                >
                  <!-- Jour -->
                  <div
                    class="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
                    :style="{ backgroundColor: theme.color }"
                  >
                    <FontAwesomeIcon
                      v-if="icons[content.icon]"
                      :icon="getIconDef(content.icon)"
                      class="size-4"
                      :class="theme.textColor"
                    />
                  </div>

                  <!-- Contenu -->
                  <div>
                    <p class="text-[10px] uppercase tracking-wide text-muted-foreground">{{ content.day }}</p>
                    <p class="font-semibold text-sm text-foreground">{{ content.title }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flèche entre les semaines (desktop) -->
            <div
              v-if="weekIndex < themes.length - 1"
              class="hidden lg:flex absolute -right-9 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white rounded-full items-center justify-center border border-border shadow-sm"
            >
              <FontAwesomeIcon
                v-if="icons.arrowRight"
                :icon="icons.arrowRight"
                class="size-3 text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Indicateur de boucle -->
      <div class="flex items-center justify-center gap-3 mt-8">
        <div class="flex items-center gap-1.5">
          <div
            v-for="(theme, index) in themes"
            :key="index"
            class="w-4 h-4 rounded-sm"
            :style="{ backgroundColor: theme.color }"
          />
        </div>
        <FontAwesomeIcon
          v-if="icons.arrowRight"
          :icon="icons.arrowRight"
          class="size-4 text-muted-foreground"
        />
        <div class="flex items-center gap-1.5">
          <div
            v-for="(theme, index) in themes"
            :key="`repeat-${index}`"
            class="w-4 h-4 rounded-sm opacity-50"
            :style="{ backgroundColor: theme.color }"
          />
        </div>
        <span class="text-muted-foreground text-sm">∞</span>
      </div>

      <!-- Note -->
      <p class="text-center text-muted-foreground text-sm mt-6">
        * Avec un abonnement multi-thématiques, recevez plusieurs contenus par semaine !
      </p>
    </div>
  </section>
</template>
