<script setup lang="ts">
/**
 * StarsRewardSection V2 - Animation automatique au scroll
 * Même design que l'original avec progression dynamique
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = computed(() => ({
  star: byPrefixAndName.fas?.['star'],
  question: byPrefixAndName.fas?.['circle-question'],
  fileLines: byPrefixAndName.fas?.['file-lines'],
  userSecret: byPrefixAndName.fas?.['user-secret'],
  handshake: byPrefixAndName.fas?.['handshake'],
  gift: byPrefixAndName.fas?.['gift'],
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
  { stars: 30, title: 'Dossier spécial', description: 'Accédez à un dossier d\'analyse approfondie sur un sujet de votre choix.', icon: 'fileLines' },
  { stars: 50, title: 'Question confidentielle', description: 'Posez une question en privé et recevez une réponse personnalisée.', icon: 'userSecret' },
  { stars: 100, title: 'Tiers de confiance', description: 'Bénéficiez d\'un accompagnement privilégié pour vos démarches.', icon: 'handshake' },
  { stars: 200, title: 'Bonus mystère', description: 'Débloquez le contenu exclusif de la 4ème semaine du mois.', icon: 'gift' },
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
  }, 500) // 500ms par mois - plus lent
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
  // Petit délai pour relancer
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
          // Délai avant de démarrer pour laisser le temps de voir
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
</script>

<template>
  <section
    ref="sectionRef"
    class="py-16 md:py-24 bg-gradient-to-br from-accent-yellow/10 via-white to-accent-yellow/5"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 2 - Animation automatique au scroll</Badge>
      </div>

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

      <!-- Explication des étoiles - Sélecteur cliquable -->
      <div class="relative mb-14">
        <!-- Barre de progression visuelle -->
        <div class="flex items-center justify-center gap-2 md:gap-4 mb-6">
          <!-- Essentiel -->
          <button
            class="flex-1 max-w-[180px] shadow-sm transition-transform"
            :class="selectedSub === 'essentiel' ? 'scale-105' : 'opacity-70 hover:opacity-100'"
            @click="selectedSub = 'essentiel'"
          >
            <div
              class="relative bg-gradient-to-r from-accent-yellow/20 to-accent-yellow/40 rounded-sm p-4 border text-center transition-all"
              :class="selectedSub === 'essentiel' ? 'border-accent-yellow border-2 shadow-lg' : 'border-accent-yellow/30'"
            >
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 rounded-sm border border-accent-yellow/30">
                <span class="text-xs font-medium text-muted-foreground">Essentiel</span>
              </div>
              <div class="flex items-center justify-center gap-1 mt-2">
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-5 text-accent-yellow" />
              </div>
              <p class="font-heading font-bold text-2xl text-foreground mt-1">+1</p>
              <p class="text-xs text-muted-foreground">par mois</p>
            </div>
          </button>

          <!-- Flèche -->
          <div class="text-accent-yellow text-xl font-bold hidden sm:block">→</div>

          <!-- Standard -->
          <button
            class="flex-1 max-w-[180px] shadow-sm transition-transform"
            :class="selectedSub === 'standard' ? 'scale-105' : 'opacity-70 hover:opacity-100'"
            @click="selectedSub = 'standard'"
          >
            <div
              class="relative bg-gradient-to-r from-accent-yellow/40 to-accent-yellow/60 rounded-sm p-4 border text-center transition-all"
              :class="selectedSub === 'standard' ? 'border-accent-yellow border-2 shadow-lg' : 'border-accent-yellow/50'"
            >
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
          </button>

          <!-- Flèche -->
          <div class="text-accent-yellow text-xl font-bold hidden sm:block">→</div>

          <!-- Premium -->
          <button
            class="flex-1 max-w-[180px] shadow-sm transition-transform"
            :class="selectedSub === 'premium' ? 'scale-105' : 'opacity-70 hover:opacity-100'"
            @click="selectedSub = 'premium'"
          >
            <div
              class="relative bg-gradient-to-r from-accent-yellow/60 to-accent-yellow rounded-sm p-4 border-2 text-center shadow-lg transition-all"
              :class="selectedSub === 'premium' ? 'border-primary shadow-accent-yellow/30' : 'border-accent-yellow shadow-accent-yellow/20'"
            >
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
          </button>
        </div>

        <!-- Compteur dynamique -->
        <div class="text-center mb-4">
          <p class="text-muted-foreground text-sm">
            <span class="font-semibold text-foreground">{{ currentMonth }} mois</span>
            d'abonnement {{ selectedSubscription.name }} =
            <span class="font-heading font-bold text-xl text-accent-yellow">{{ currentStars }}★</span>
          </p>
        </div>

        <!-- Barre de progression -->
        <div class="max-w-2xl mx-auto mb-2">
          <div class="h-2 bg-accent-yellow/20 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-accent-yellow/80 to-accent-yellow rounded-full transition-all duration-500"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
        </div>

        <p class="text-center text-muted-foreground text-sm">
          <template v-if="currentStars >= 200">
            🎉 Toutes les récompenses débloquées en <strong>{{ currentMonth }} mois</strong> !
          </template>
          <template v-else>
            Accumulez vos étoiles et échangez-les contre des avantages exclusifs
          </template>
        </p>
      </div>

      <!-- Paliers de récompenses -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="reward in rewards"
          :key="reward.stars"
          :class="[
            'bg-white rounded-sm p-4 border transition-all duration-500',
            currentStars >= reward.stars
              ? 'border-accent-yellow shadow-md shadow-accent-yellow/10 scale-[1.02]'
              : 'border-border opacity-60',
          ]"
        >
          <div class="flex items-center justify-between mb-4">

            <!-- Étoiles requises -->
            <div class="flex items-center gap-1.5 mb-3">
              <FontAwesomeIcon
                v-if="icons.star"
                :icon="icons.star"
                :class="[
                  'size-4 transition-colors duration-500',
                  currentStars >= reward.stars ? 'text-accent-yellow' : 'text-gray-300',
                ]"
              />
              <span
                :class="[
                  'font-heading font-bold text-xl transition-colors duration-500',
                  currentStars >= reward.stars ? 'text-foreground' : 'text-gray-400',
                ]"
              >
                {{ reward.stars }}
              </span>
            </div>

            <!-- Icône -->
            <div
              :class="[
                'w-10 h-10 rounded-sm flex items-center justify-center mb-3 transition-all duration-500',
                currentStars >= reward.stars ? 'bg-accent-yellow/20' : 'bg-gray-100',
              ]"
            >
              <FontAwesomeIcon
                v-if="icons[reward.icon]"
                :icon="getIconDef(reward.icon)"
                :class="[
                  'size-5 transition-colors duration-500',
                  currentStars >= reward.stars ? 'text-accent-yellow' : 'text-gray-300',
                ]"
              />
            </div>
          </div>

          <!-- Contenu -->
          <h3
            :class="[
              'font-semibold text-sm mb-1 transition-colors duration-500',
              currentStars >= reward.stars ? 'text-foreground' : 'text-gray-400',
            ]"
          >
            {{ reward.title }}
          </h3>
          <p
            :class="[
              'text-xs leading-relaxed transition-colors duration-500',
              currentStars >= reward.stars ? 'text-muted-foreground' : 'text-gray-300',
            ]"
          >
            {{ reward.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
