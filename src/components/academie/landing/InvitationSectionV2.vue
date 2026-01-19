<script setup lang="ts">
/**
 * InvitationSection V2 - Style timeline horizontale
 * Parcours : Premium → Carton → Filleul → Bonus
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = computed(() => ({
  crown: byPrefixAndName.fas?.['crown'],
  envelope: byPrefixAndName.fas?.['envelope-open-text'],
  userPlus: byPrefixAndName.fas?.['user-plus'],
  star: byPrefixAndName.fas?.['star'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
}

type StepIcon = 'crown' | 'envelope' | 'userPlus' | 'star'

const steps: Array<{ icon: StepIcon; title: string; description: string; highlight: boolean }> = [
  {
    icon: 'crown',
    title: 'Abonné Premium',
    description: 'Vous recevez 1 carton chaque trimestre',
    highlight: false,
  },
  {
    icon: 'envelope',
    title: 'Carton d\'invitation',
    description: 'À offrir à un proche de votre choix',
    highlight: true,
  },
  {
    icon: 'userPlus',
    title: 'Votre filleul',
    description: '1 mois d\'essai gratuit Essentiel',
    highlight: false,
  },
  {
    icon: 'star',
    title: 'Bonus parrain',
    description: '+25 étoiles si conversion',
    highlight: true,
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 2 - Timeline horizontale</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <Badge
          variant="default"
          rounded="sm"
          class="mb-4 bg-primary text-primary-foreground gap-2"
        >
          <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-3" />
          Exclusif Premium
        </Badge>
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Le carton d'invitation
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Partagez votre passion et soyez récompensé. Un système gagnant-gagnant.
        </p>
      </div>

      <!-- Timeline horizontale -->
      <div class="relative">
        <!-- Ligne de connexion (desktop) -->
        <div class="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-accent-yellow to-primary" />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="relative text-center"
          >
            <!-- Flèche mobile/tablet -->
            <div
              v-if="index < steps.length - 1"
              class="lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 text-accent-yellow"
            >
              <FontAwesomeIcon v-if="icons.arrowRight" :icon="icons.arrowRight" class="size-4 rotate-90" />
            </div>

            <!-- Cercle icône -->
            <div
              :class="[
                'relative z-10 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-110',
                step.highlight
                  ? 'bg-accent-yellow shadow-lg shadow-accent-yellow/30'
                  : 'bg-primary/10 border-2 border-primary/20',
              ]"
            >
              <FontAwesomeIcon
                v-if="icons[step.icon]"
                :icon="getIconDef(step.icon)"
                :class="[
                  'size-10',
                  step.highlight ? 'text-primary' : 'text-primary',
                ]"
              />
            </div>

            <!-- Numéro étape -->
            <div class="absolute top-0 right-1/2 translate-x-[4rem] -translate-y-1">
              <span
                :class="[
                  'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                  step.highlight ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                ]"
              >
                {{ index + 1 }}
              </span>
            </div>

            <!-- Contenu -->
            <h3 class="font-heading font-bold text-lg text-foreground mb-2">
              {{ step.title }}
            </h3>
            <p class="text-muted-foreground text-sm">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Récap -->
      <div class="mt-12 bg-primary/5 rounded-sm p-6 text-center">
        <p class="text-foreground">
          <strong class="text-primary">4 cartons par an</strong> pour partager l'Académie,
          jusqu'à <strong class="text-accent-yellow">+100 étoiles bonus</strong> par an !
        </p>
      </div>
    </div>
  </section>
</template>
