<script setup lang="ts">
/**
 * StarsRewardSection - Présentation du système de gamification par étoiles
 * Paliers de récompenses : 50, 100, 200, 500 étoiles
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = computed(() => ({
  star: byPrefixAndName.fas?.['star'],
  question: byPrefixAndName.fas?.['circle-question'],
  fileLines: byPrefixAndName.fas?.['file-lines'],
  userSecret: byPrefixAndName.fas?.['user-secret'],
  handshake: byPrefixAndName.fas?.['handshake'],
  gift: byPrefixAndName.fas?.['gift'],
}))

const getIcon = (key: keyof typeof icons.value): IconDefinition => {
  return icons.value[key] as IconDefinition
}

interface Reward {
  stars: number
  title: string
  description: string
  icon: 'question' | 'fileLines' | 'userSecret' | 'handshake' | 'gift'
}

const rewards: Reward[] = [
  {
    stars: 10,
    title: 'Question prioritaire',
    description: 'Posez votre question en priorité lors des consultations live.',
    icon: 'question',
  },
  {
    stars: 30,
    title: 'Dossier spécial',
    description: 'Accédez à un dossier d\'analyse approfondie sur un sujet de votre choix.',
    icon: 'fileLines',
  },
  {
    stars: 50,
    title: 'Question confidentielle',
    description: 'Posez une question en privé et recevez une réponse personnalisée.',
    icon: 'userSecret',
  },
  {
    stars: 100,
    title: 'Tiers de confiance',
    description: 'Bénéficiez d\'un accompagnement privilégié pour vos démarches.',
    icon: 'handshake',
  },
  {
    stars: 200,
    title: 'Bonus mystère',
    description: 'Débloquez le contenu exclusif de la 4ème semaine du mois.',
    icon: 'gift',
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-gradient-to-br from-accent-yellow/10 via-white to-accent-yellow/5">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <Badge
          variant="outline"
          rounded="sm"
          class="mb-4 border-accent-yellow bg-accent-yellow/10 text-foreground gap-2"
        >
          <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-3 text-accent-yellow" />
          Système de récompenses
        </Badge>

        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Gagnez des étoiles, débloquez des récompenses
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Chaque mois, accumulez des étoiles selon votre formule. Plus vous êtes fidèle,
          plus vous débloquez d'avantages exclusifs.
        </p>
      </div>

      <!-- Explication des étoiles - Style gamification -->
      <div class="relative mb-14">
        <!-- Barre de progression visuelle -->
        <div class="flex items-center justify-center gap-2 md:gap-4 mb-6">
          <!-- Essentiel -->
          <div class="flex-1 max-w-[180px] shadow-sm">
            <div class="relative bg-gradient-to-r from-accent-yellow/20 to-accent-yellow/40 rounded-sm p-4 border border-accent-yellow/30 text-center">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 rounded-sm border border-accent-yellow/30">
                <span class="text-xs font-medium text-muted-foreground">Essentiel</span>
              </div>
              <div class="flex items-center justify-center gap-1 mt-2">
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-5 text-accent-yellow" />
              </div>
              <p class="font-heading font-bold text-2xl text-foreground mt-1">+1</p>
              <p class="text-xs text-muted-foreground">par mois</p>
            </div>
          </div>

          <!-- Flèche -->
          <div class="text-accent-yellow text-xl font-bold hidden sm:block">→</div>

          <!-- Standard -->
          <div class="flex-1 max-w-[180px] shadow-sm">
            <div class="relative bg-gradient-to-r from-accent-yellow/40 to-accent-yellow/60 rounded-sm p-4 border border-accent-yellow/50 text-center">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 rounded-sm border border-accent-yellow/30">
                <span class="text-xs font-medium text-muted-foreground">Standard</span>
              </div>
              <div class="flex items-center justify-center gap-0.5 mt-2">
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-accent-yellow" />
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-5 text-accent-yellow" />
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-accent-yellow" />
              </div>
              <p class="font-heading font-bold text-2xl text-foreground mt-1">+5</p>
              <p class="text-xs text-muted-foreground">par mois</p>
            </div>
          </div>

          <!-- Flèche -->
          <div class="text-accent-yellow text-xl font-bold hidden sm:block">→</div>

          <!-- Premium -->
          <div class="flex-1 max-w-[180px] shadow-sm">
            <div class="relative bg-gradient-to-r from-accent-yellow/60 to-accent-yellow rounded-sm p-4 border-2 border-accent-yellow text-center shadow-lg shadow-accent-yellow/20">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 rounded-sm border border-accent-yellow/30">
                <span class="text-xs font-medium text-primary">Premium</span>
              </div>
              <div class="flex items-center justify-center gap-0.5 mt-2">
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-3 text-primary/70" />
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-primary/80" />
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-5 text-primary" />
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-primary/80" />
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-3 text-primary/70" />
              </div>
              <p class="font-heading font-bold text-2xl text-primary mt-1">+10</p>
              <p class="text-xs text-primary/70">par mois</p>
            </div>
          </div>
        </div>

        <p class="text-center text-muted-foreground text-sm">
          Accumulez vos étoiles et échangez-les contre des avantages exclusifs
        </p>
      </div>

      <!-- Paliers de récompenses -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="reward in rewards"
          :key="reward.stars"
          class="bg-white rounded-sm p-4 border border-border hover:border-accent-yellow/50 transition-colors"
        >
          <div class="flex items-center justify-between mb-4">
            
            <!-- Étoiles requises -->
            <div class="flex items-center gap-1.5 mb-3">
              <FontAwesomeIcon
                v-if="icons.star"
                :icon="icons.star"
                class="size-4 text-accent-yellow"
              />
              <span class="font-heading font-bold text-xl text-foreground">
                {{ reward.stars }}
              </span>
            </div>
  
            <!-- Icône -->
            <div class="w-10 h-10 rounded-sm bg-accent-yellow/10 flex items-center justify-center mb-3">
              <FontAwesomeIcon
                v-if="getIcon(reward.icon)"
                :icon="getIcon(reward.icon)"
                class="size-5 text-accent-yellow"
              />
            </div>
          </div>

          <!-- Contenu -->
          <h3 class="font-semibold text-foreground text-sm mb-1">
            {{ reward.title }}
          </h3>
          <p class="text-muted-foreground text-xs leading-relaxed">
            {{ reward.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
