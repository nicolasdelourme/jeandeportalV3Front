<script setup lang="ts">
/**
 * StarsRewardSection V3 - Style badges/achievements
 * Cards style médailles à collectionner
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
  medal: byPrefixAndName.fas?.['medal'],
}))

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
}

interface Reward {
  stars: number
  title: string
  description: string
  icon: 'question' | 'fileLines' | 'userSecret' | 'handshake' | 'gift'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
}

const rewards: Reward[] = [
  { stars: 10, title: 'Question prioritaire', description: 'Posez votre question en priorité.', icon: 'question', rarity: 'common' },
  { stars: 30, title: 'Dossier spécial', description: 'Accédez à un dossier d\'analyse.', icon: 'fileLines', rarity: 'rare' },
  { stars: 50, title: 'Question confidentielle', description: 'Question privée personnalisée.', icon: 'userSecret', rarity: 'epic' },
  { stars: 100, title: 'Tiers de confiance', description: 'Accompagnement privilégié.', icon: 'handshake', rarity: 'legendary' },
  { stars: 200, title: 'Bonus mystère', description: 'Contenu exclusif 4ème semaine.', icon: 'gift', rarity: 'mythic' },
]

// Couleurs : uniquement accent-yellow et primary
const rarityColors = {
  common: { bg: 'bg-accent-yellow/5', border: 'border-accent-yellow/30', text: 'text-foreground', glow: '' },
  rare: { bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/50', text: 'text-foreground', glow: '' },
  epic: { bg: 'bg-accent-yellow/15', border: 'border-accent-yellow/70', text: 'text-primary', glow: '' },
  legendary: { bg: 'bg-accent-yellow/20', border: 'border-accent-yellow', text: 'text-primary', glow: 'shadow-md shadow-accent-yellow/20' },
  mythic: { bg: 'bg-primary/5', border: 'border-primary', text: 'text-primary', glow: 'shadow-lg shadow-primary/20' },
}

const rarityLabels = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
  mythic: 'Mythique',
}
</script>

<template>
  <section class="py-16 md:py-24 bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 3 - Style badges/achievements</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 mb-4">
          <FontAwesomeIcon v-if="icons.medal" :icon="icons.medal" class="size-8 text-accent-yellow" />
        </div>
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Collectionnez vos récompenses
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Accumulez des étoiles et débloquez des badges exclusifs avec des avantages croissants.
        </p>
      </div>

      <!-- Abonnements -->
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <div class="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-border">
          <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-gray-400" />
          <span class="text-sm"><strong>Essentiel</strong> +1★/mois</span>
        </div>
        <div class="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-border">
          <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-gray-500" />
          <span class="text-sm"><strong>Standard</strong> +5★/mois</span>
        </div>
        <div class="inline-flex items-center gap-2 bg-accent-yellow/10 rounded-full px-4 py-2 border border-accent-yellow">
          <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-accent-yellow" />
          <span class="text-sm"><strong>Premium</strong> +10★/mois</span>
        </div>
      </div>

      <!-- Badges Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div
          v-for="reward in rewards"
          :key="reward.stars"
          :class="[
            'relative rounded-sm p-6 border-2 text-center transition-all duration-300 hover:scale-105',
            rarityColors[reward.rarity].bg,
            rarityColors[reward.rarity].border,
            rarityColors[reward.rarity].glow ? `shadow-lg ${rarityColors[reward.rarity].glow}` : '',
          ]"
        >
          <!-- Rareté -->
          <div class="absolute -top-2 left-1/2 -translate-x-1/2">
            <span
              :class="[
                'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                rarityColors[reward.rarity].bg,
                rarityColors[reward.rarity].text,
                'border',
                rarityColors[reward.rarity].border,
              ]"
            >
              {{ rarityLabels[reward.rarity] }}
            </span>
          </div>

          <!-- Badge hexagonal (simulé) -->
          <div class="relative mx-auto w-20 h-20 mb-4 mt-2">
            <div
              :class="[
                'absolute inset-0 rounded-full',
                rarityColors[reward.rarity].border,
                'border-4 flex items-center justify-center bg-white',
              ]"
            >
              <FontAwesomeIcon
                v-if="icons[reward.icon]"
                :icon="getIconDef(reward.icon)"
                :class="['size-8', rarityColors[reward.rarity].text]"
              />
            </div>
          </div>

          <!-- Étoiles requises -->
          <div class="flex items-center justify-center gap-1 mb-2">
            <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 text-accent-yellow" />
            <span class="font-heading font-bold text-xl text-foreground">{{ reward.stars }}</span>
          </div>

          <!-- Titre -->
          <h3 :class="['font-semibold text-sm mb-1', rarityColors[reward.rarity].text]">
            {{ reward.title }}
          </h3>

          <!-- Description -->
          <p class="text-muted-foreground text-xs">
            {{ reward.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
