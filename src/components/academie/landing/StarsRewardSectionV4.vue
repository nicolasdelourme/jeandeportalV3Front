<script setup lang="ts">
/**
 * StarsRewardSection V4 - Système d'étoiles et récompenses
 * Style Figma avec présentation détaillée des récompenses
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
  check: byPrefixAndName.fas?.['check'],
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
  {
    stars: 10,
    title: 'Question prioritaire',
    description: 'Posez votre question en consultation et passez en priorité pour une réponse détaillée.',
    icon: 'question',
  },
  {
    stars: 30,
    title: 'Dossier spécial',
    description: 'Accédez à un dossier approfondi sur un sujet clé : fiscalité, stratégie, opportunités.',
    icon: 'fileLines',
  },
  {
    stars: 50,
    title: 'Question confidentielle',
    description: 'Posez une question privée par email avec une réponse personnalisée sous 48h.',
    icon: 'userSecret',
  },
  {
    stars: 100,
    title: 'Tiers de confiance',
    description: 'Accès à notre réseau de partenaires vérifiés : courtiers, conseillers, experts.',
    icon: 'handshake',
  },
  {
    stars: 200,
    title: 'Bonus mystère',
    description: 'Débloquez l\'accès complet à la formation Bonus avec tous ses contenus exclusifs.',
    icon: 'gift',
  },
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
const highlightedRewards = ref<Set<number>>(new Set())

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
  }, 400)
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
  highlightedRewards.value.clear()
  setTimeout(() => {
    startAnimation()
  }, 300)
})

// Highlight bref quand on passe un palier (un seul à la fois)
let highlightTimeout: ReturnType<typeof setTimeout> | null = null

watch(currentStars, (newStars, oldStars) => {
  rewards.forEach((reward) => {
    if (newStars >= reward.stars && oldStars < reward.stars) {
      // Clear previous highlight
      highlightedRewards.value.clear()
      if (highlightTimeout) clearTimeout(highlightTimeout)

      // Add new highlight
      highlightedRewards.value.add(reward.stars)
      highlightTimeout = setTimeout(() => {
        highlightedRewards.value.delete(reward.stars)
      }, 1000)
    }
  })
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
  <section ref="sectionRef" class="py-16 md:py-24 bg-secondary text-white">
    <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
          Gagnez des étoiles, débloquez des récompenses
        </h2>
        <p class="text-white/70 max-w-2xl mx-auto">
          Voyez combien de temps il vous faut pour débloquer toutes les récompenses selon votre formule.
        </p>
      </div>

      <!-- Sélecteur d'offre (style Figma) -->
      <div class="flex flex-wrap justify-center gap-3 mb-8">
        <button
          v-for="sub in subscriptions"
          :key="sub.id"
          :class="[
            'flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300',
            selectedSub === sub.id
              ? 'bg-primary text-secondary border-2 border-primary shadow-lg'
              : 'bg-white/10 text-white border-2 border-transparent hover:bg-white/20',
          ]"
          @click="selectedSub = sub.id"
        >
          <div class="flex items-center gap-1">
            <FontAwesomeIcon
              v-if="icons.star"
              :icon="icons.star"
              :class="selectedSub === sub.id ? 'text-secondary' : 'text-primary'"
              class="size-4"
            />
            <span class="font-bold">+{{ sub.stars }}</span>
          </div>
          <span class="font-semibold text-sm">{{ sub.name }}</span>
          <FontAwesomeIcon
            v-if="sub.id === 'premium' && icons.crown"
            :icon="icons.crown"
            :class="['size-4', selectedSub === sub.id ? 'text-secondary' : 'text-primary']"
          />
        </button>
      </div>

      <!-- Compteur mois = étoiles -->
      <div class="flex items-center justify-center gap-4 mb-8">
        <div class="text-center">
          <p class="font-heading font-bold text-4xl md:text-5xl text-white">{{ currentMonth }}</p>
          <p class="text-white/60 text-sm">mois</p>
        </div>
        <p class="font-heading font-bold text-4xl md:text-5xl text-white">=</p>
        <div class="text-center">
          <p class="font-heading font-bold text-4xl md:text-5xl text-primary">{{ currentStars }}</p>
          <p class="text-white/60 text-sm">étoiles</p>
        </div>
      </div>

      <!-- Barre de progression -->
      <div class="relative mb-12">
        <!-- Barre de fond -->
        <div class="h-4 bg-white/20 rounded-full overflow-hidden">
          <!-- Progression -->
          <div
            class="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-300"
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
              'w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300',
              currentStars >= reward.stars
                ? 'bg-primary border-primary'
                : 'bg-secondary border-primary',
            ]"
          >
            <FontAwesomeIcon
              v-if="icons[reward.icon]"
              :icon="getIconDef(reward.icon)"
              :class="[
                'size-4',
                currentStars >= reward.stars ? 'text-secondary' : 'text-primary',
              ]"
            />
          </div>
          <!-- Label étoiles -->
          <p class="absolute top-11 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap text-primary">
            {{ reward.stars }}★
          </p>
        </div>
      </div>

      <!-- Section détails des récompenses (statique) -->
      <div class="mt-10">
        <h3 class="font-heading font-bold text-lg md:text-xl text-white text-center mb-6">
          Ce que vous pouvez débloquer
        </h3>

        <div class="space-y-3">
          <div
            v-for="reward in rewards"
            :key="reward.stars"
            :class="[
              'flex items-center gap-4 p-4 rounded-lg transition-all duration-700 ease-in-out',
              highlightedRewards.has(reward.stars)
                ? 'bg-primary/25 shadow-[0_0_20px_rgba(255,221,0,0.3)]'
                : 'bg-white/5',
            ]"
          >
            <!-- Badge étoiles -->
            <div class="w-14 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
              <span class="font-bold text-sm text-primary">{{ reward.stars }}★</span>
            </div>

            <!-- Icône -->
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <FontAwesomeIcon
                v-if="icons[reward.icon]"
                :icon="getIconDef(reward.icon)"
                class="size-4 text-secondary"
              />
            </div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-white text-sm">{{ reward.title }}</h4>
              <p class="text-white/60 text-xs leading-relaxed">{{ reward.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
