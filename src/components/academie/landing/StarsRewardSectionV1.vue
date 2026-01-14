<script setup lang="ts">
/**
 * StarsRewardSection V1 - Timeline verticale
 * Progression style escalier avec paliers à débloquer
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
  lock: byPrefixAndName.fas?.['lock'],
}))

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
}

interface Reward {
  stars: number
  title: string
  description: string
  icon: 'question' | 'fileLines' | 'userSecret' | 'handshake' | 'gift'
}

const rewards: Reward[] = [
  { stars: 10, title: 'Question prioritaire', description: 'Posez votre question en priorité lors des consultations live.', icon: 'question' },
  { stars: 30, title: 'Dossier spécial', description: 'Accédez à un dossier d\'analyse approfondie.', icon: 'fileLines' },
  { stars: 50, title: 'Question confidentielle', description: 'Posez une question en privé.', icon: 'userSecret' },
  { stars: 100, title: 'Tiers de confiance', description: 'Accompagnement privilégié pour vos démarches.', icon: 'handshake' },
  { stars: 200, title: 'Bonus mystère', description: 'Contenu exclusif de la 4ème semaine.', icon: 'gift' },
]

const subscriptions = [
  { name: 'Essentiel', stars: 1, color: '#9CA3AF' },
  { name: 'Standard', stars: 5, color: '#C0C0C0' },
  { name: 'Premium', stars: 10, color: '#F2CC00' },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 1 - Timeline verticale</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <Badge variant="outline" rounded="sm" class="mb-4 border-accent-yellow bg-accent-yellow/10 text-foreground gap-2">
          <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-3 text-accent-yellow" />
          Système de récompenses
        </Badge>
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Gagnez des étoiles, débloquez des récompenses
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Plus vous êtes fidèle, plus vous débloquez d'avantages exclusifs.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Colonne gauche: Comment gagner -->
        <div>
          <h3 class="font-heading font-bold text-lg text-foreground mb-6">Comment gagner des étoiles ?</h3>
          <div class="space-y-4">
            <div
              v-for="sub in subscriptions"
              :key="sub.name"
              class="flex items-center gap-4 p-4 rounded-sm border border-border bg-neutral-50"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                :style="{ backgroundColor: sub.color }"
              >
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-foreground">{{ sub.name }}</p>
                <p class="text-sm text-muted-foreground">+{{ sub.stars }} étoile{{ sub.stars > 1 ? 's' : '' }} par mois</p>
              </div>
              <div class="font-heading font-bold text-2xl text-foreground">+{{ sub.stars }}</div>
            </div>
          </div>
        </div>

        <!-- Colonne droite: Timeline des récompenses -->
        <div>
          <h3 class="font-heading font-bold text-lg text-foreground mb-6">Paliers de récompenses</h3>
          <div class="relative">
            <!-- Ligne verticale -->
            <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-yellow/20 via-accent-yellow to-accent-yellow/20" />

            <div class="space-y-6">
              <div
                v-for="(reward, index) in rewards"
                :key="reward.stars"
                class="relative flex items-start gap-4 pl-4"
              >
                <!-- Cercle sur la ligne -->
                <div
                  class="relative z-10 w-5 h-5 rounded-full bg-accent-yellow border-4 border-white shadow-sm shrink-0 mt-1"
                />

                <!-- Card récompense -->
                <div class="flex-1 bg-neutral-50 rounded-sm p-4 border border-border hover:border-accent-yellow/50 transition-colors">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-accent-yellow" />
                        <span class="font-heading font-bold text-lg text-foreground">{{ reward.stars }}</span>
                      </div>
                      <h4 class="font-semibold text-foreground text-sm">{{ reward.title }}</h4>
                      <p class="text-muted-foreground text-xs mt-1">{{ reward.description }}</p>
                    </div>
                    <div class="w-10 h-10 rounded-sm bg-accent-yellow/10 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon v-if="icons[reward.icon]" :icon="getIconDef(reward.icon)" class="size-5 text-accent-yellow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
