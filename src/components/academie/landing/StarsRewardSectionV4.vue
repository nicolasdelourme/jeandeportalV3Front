<script setup lang="ts">
/**
 * StarsRewardSection V4 - Style gaming fond sombre + animation auto scroll
 * Barre de progression avec paliers visuels
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
  crown: byPrefixAndName.fas?.['crown'],
}))

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
}

interface Reward {
  stars: number
  title: string
  icon: 'question' | 'fileLines' | 'userSecret' | 'handshake' | 'gift'
}

const rewards: Reward[] = [
  { stars: 10, title: 'Question prioritaire', icon: 'question' },
  { stars: 30, title: 'Dossier spécial', icon: 'fileLines' },
  { stars: 50, title: 'Question confidentielle', icon: 'userSecret' },
  { stars: 100, title: 'Tiers de confiance', icon: 'handshake' },
  { stars: 200, title: 'Bonus mystère', icon: 'gift' },
]

const subscriptions = [
  { id: 'essentiel', name: 'Essentiel', stars: 1, monthsTo200: 200 },
  { id: 'standard', name: 'Standard', stars: 5, monthsTo200: 40 },
  { id: 'premium', name: 'Premium', stars: 10, monthsTo200: 20 },
]

// État
const sectionRef = ref<HTMLElement | null>(null)
const selectedSub = ref('premium')
const currentMonth = ref(0)
const isPlaying = ref(false)
const hasPlayed = ref(false)
const animationInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Calculs
const selectedSubscription = computed(() => subscriptions.find(s => s.id === selectedSub.value)!)
const currentStars = computed(() => currentMonth.value * selectedSubscription.value.stars)
const progressPercent = computed(() => Math.min((currentStars.value / 200) * 100, 100))

// Animation
const startAnimation = () => {
  if (isPlaying.value || hasPlayed.value) return
  isPlaying.value = true
  currentMonth.value = 0

  animationInterval.value = setInterval(() => {
    if (currentStars.value >= 200) {
      stopAnimation()
      hasPlayed.value = true
      return
    }
    currentMonth.value++
  }, 500)
}

const stopAnimation = () => {
  isPlaying.value = false
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
    animationInterval.value = null
  }
}

const resetAnimation = () => {
  stopAnimation()
  currentMonth.value = 0
  hasPlayed.value = false
}

// Reset et relance quand on change d'abonnement
watch(selectedSub, () => {
  resetAnimation()
  setTimeout(() => {
    startAnimation()
  }, 300)
})

// IntersectionObserver pour démarrer au scroll
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasPlayed.value && !isPlaying.value) {
          setTimeout(() => {
            startAnimation()
          }, 500)
        }
      })
    },
    { threshold: 0.3 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  stopAnimation()
  if (observer) {
    observer.disconnect()
  }
})

// Position des récompenses sur la barre (en %)
const getRewardPosition = (stars: number) => (stars / 200) * 100
</script>

<template>
  <section ref="sectionRef" class="py-16 md:py-24 bg-primary text-white">
    <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs bg-white text-primary">VERSION 4 - Gaming dark + auto scroll</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-10">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
          Gagnez des étoiles, débloquez des récompenses
        </h2>
        <p class="text-white/70 max-w-2xl mx-auto">
          Voyez combien de temps il vous faut pour débloquer toutes les récompenses selon votre formule.
        </p>
      </div>

      <!-- Sélecteur d'offre -->
      <div class="flex flex-wrap justify-center gap-3 mb-10">
        <button
          v-for="sub in subscriptions"
          :key="sub.id"
          :class="[
            'flex items-center gap-3 px-5 py-3 rounded-sm transition-all duration-300',
            selectedSub === sub.id
              ? 'bg-accent-yellow text-primary shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20',
          ]"
          @click="selectedSub = sub.id"
        >
          <div class="flex items-center gap-1">
            <FontAwesomeIcon v-if="icons.star" :icon="icons.star" :class="selectedSub === sub.id ? 'text-primary' : 'text-accent-yellow'" class="size-4" />
            <span class="font-bold">+{{ sub.stars }}</span>
          </div>
          <div class="text-left">
            <p class="font-semibold text-sm">{{ sub.name }}</p>
            <p :class="['text-xs', selectedSub === sub.id ? 'text-primary/70' : 'text-white/50']">
              {{ sub.monthsTo200 }} mois pour 200★
            </p>
          </div>
          <FontAwesomeIcon
            v-if="sub.id === 'premium' && icons.crown"
            :icon="icons.crown"
            :class="['size-4 ml-1', selectedSub === sub.id ? 'text-primary' : 'text-accent-yellow']"
          />
        </button>
      </div>

      <!-- Compteur de mois et étoiles -->
      <div class="flex justify-center gap-8 mb-8">
        <div class="text-center">
          <p class="font-heading font-bold text-4xl text-white">{{ currentMonth }}</p>
          <p class="text-white/60 text-sm">mois</p>
        </div>
        <div class="text-center">
          <p class="font-heading font-bold text-4xl text-accent-yellow">{{ currentStars }}</p>
          <p class="text-white/60 text-sm">étoiles</p>
        </div>
      </div>

      <!-- Barre de progression -->
      <div class="relative mb-6">
        <!-- Barre de fond -->
        <div class="h-4 bg-white/20 rounded-full overflow-hidden">
          <!-- Progression -->
          <div
            class="h-full bg-gradient-to-r from-accent-yellow/80 to-accent-yellow rounded-full transition-all duration-300"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>

        <!-- Marqueurs des paliers -->
        <div
          v-for="reward in rewards"
          :key="reward.stars"
          class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
          :style="{ left: `${getRewardPosition(reward.stars)}%` }"
        >
          <div
            :class="[
              'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300',
              currentStars >= reward.stars
                ? 'bg-accent-yellow border-accent-yellow scale-110'
                : 'bg-primary border-white/40',
            ]"
          >
            <FontAwesomeIcon
              v-if="icons[reward.icon]"
              :icon="getIconDef(reward.icon)"
              :class="[
                'size-3.5',
                currentStars >= reward.stars ? 'text-primary' : 'text-white/40',
              ]"
            />
          </div>
          <!-- Label étoiles -->
          <p
            :class="[
              'absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap',
              currentStars >= reward.stars ? 'text-accent-yellow' : 'text-white/40',
            ]"
          >
            {{ reward.stars }}★
          </p>
        </div>
      </div>

      <!-- Légende des récompenses -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-12 mb-8">
        <div
          v-for="reward in rewards"
          :key="reward.stars"
          :class="[
            'text-center p-3 rounded-sm transition-all duration-300',
            currentStars >= reward.stars ? 'bg-accent-yellow/20' : 'bg-white/5',
          ]"
        >
          <p :class="['font-semibold text-xs', currentStars >= reward.stars ? 'text-accent-yellow' : 'text-white/40']">
            {{ reward.title }}
          </p>
        </div>
      </div>

      <!-- Message de fin -->
      <p
        v-if="currentStars >= 200"
        class="text-center text-accent-yellow font-semibold mt-6"
      >
        🎉 Toutes les récompenses débloquées en {{ currentMonth }} mois avec {{ selectedSubscription.name }} !
      </p>
    </div>
  </section>
</template>
