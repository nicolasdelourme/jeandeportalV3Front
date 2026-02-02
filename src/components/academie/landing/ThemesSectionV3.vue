<script setup lang="ts">
/**
 * ThemesSection V3 - Formations Infocash Académie + Rythme
 * Chaque formation = 1 abonnement séparé (sauf Bonus = fidélité)
 * Inclut la timeline du rythme hebdomadaire
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { getThemeColor } from '@/lib/theme-colors'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const emit = defineEmits<{
  scrollToPricing: []
}>()

const icons = computed(() => ({
  graduationCap: byPrefixAndName.fas?.['graduation-cap'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
  arrowDown: byPrefixAndName.fas?.['arrow-down'],
  star: byPrefixAndName.fas?.['star'],
  lock: byPrefixAndName.fas?.['lock'],
  envelope: byPrefixAndName.fas?.['envelope'],
  video: byPrefixAndName.fas?.['video'],
  comments: byPrefixAndName.fas?.['comments'],
}))

const getIconDef = (key: keyof typeof icons.value): IconDefinition | object => {
  return icons.value[key] ?? {}
}

interface Formation {
  id: string
  number: string
  name: string
  subtitle: string
  description: string
  color: string
  textColor: string
  isBonus?: boolean
}

const formations: Formation[] = [
  {
    id: 'metaux',
    number: '01',
    name: 'Métaux précieux',
    subtitle: 'Or & Argent physique',
    description: 'Apprenez à investir dans l\'or et l\'argent. Comprendre les cycles, le stockage et la protection de votre patrimoine.',
    color: getThemeColor('metaux'),
    textColor: 'text-black',
  },
  {
    id: 'portefeuille',
    number: '02',
    name: 'Portefeuille permanent',
    subtitle: 'Stratégie long terme',
    description: 'Construisez un portefeuille résilient basé sur la diversification. Performant dans toutes les conditions de marché.',
    color: getThemeColor('portefeuille'),
    textColor: 'text-slate-900',
  },
  {
    id: 'liberte',
    number: '03',
    name: 'Liberté financière',
    subtitle: 'Indépendance & revenus',
    description: 'Les clés pour atteindre l\'indépendance financière. Revenus passifs, optimisation et stratégies de croissance.',
    color: getThemeColor('liberte'),
    textColor: 'text-slate-900',
  },
  {
    id: 'bonus',
    number: '04',
    name: 'Bonus exclusif',
    subtitle: 'Déblocable avec vos étoiles',
    description: 'Contenus premium réservés aux membres fidèles. Astuces fiscales avancées et opportunités confidentielles.',
    color: getThemeColor('bonus'),
    textColor: 'text-white',
    isBonus: true,
  },
]

// Types de contenu hebdomadaire
const contentTypes = [
  { day: 'Lundi', title: 'Newsletter', icon: 'envelope' as const },
  { day: 'Mardi', title: 'Tutoriel', icon: 'video' as const },
  { day: 'Jeudi', title: 'Consultation', icon: 'comments' as const },
]

const scrollToPricing = () => {
  emit('scrollToPricing')
}
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-10">
        <Badge variant="outline" rounded="sm" class="mb-4 gap-2">
          <FontAwesomeIcon v-if="icons.graduationCap" :icon="icons.graduationCap" class="size-3" />
          Infocash Académie
        </Badge>

        <h2 class="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
          3 formations indépendantes
        </h2>

        <p class="text-muted-foreground max-w-2xl mx-auto mb-2">
          Choisissez la ou les formations qui correspondent à vos objectifs. Chaque formation est un abonnement séparé avec ses propres contenus exclusifs.
        </p>

        <p class="text-foreground font-medium mb-6">
          À partir de <span href="#pricing-section" class="text-secondary underline font-bold">9,90€/mois</span> par formation
        </p>

        <Button
          variant="secondary"
          size="lg"
          rounded="sm"
          class="gap-2"
          @click="scrollToPricing"
        >
          VOIR LES FORMULES
          <FontAwesomeIcon v-if="icons.arrowDown" :icon="icons.arrowDown" class="size-4" />
        </Button>
      </div>

      <!-- Grid des formations -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink
          v-for="formation in formations"
          :key="formation.id"
          :to="`/academie/formation/${formation.id}`"
          class="relative overflow-hidden cursor-pointer group"
        >
          <!-- Card avec couleur de fond -->
          <div
            class="relative h-80 sm:h-[380px] flex flex-col transition-all duration-500 rounded-lg"
            :style="{ backgroundColor: formation.color }"
          >
            <!-- Numéro en grand (semi-transparent) -->
            <div
              :class="[
                'absolute top-4 left-4 font-heading font-bold text-6xl sm:text-7xl opacity-30',
                formation.textColor,
              ]"
            >
              {{ formation.number }}
            </div>

            <!-- Badge fidélité pour Bonus -->
            <div v-if="formation.isBonus" class="absolute top-4 right-4">
              <Badge variant="default" class="bg-primary text-secondary gap-1.5">
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-3" />
                Fidélité
              </Badge>
            </div>

            <!-- Spacer pour pousser le contenu en bas -->
            <div class="flex-1"></div>

            <!-- Contenu en bas -->
            <div class="p-4 sm:p-5">
              <!-- Titre -->
              <h3 :class="['font-heading font-bold text-lg sm:text-xl', formation.textColor]">
                {{ formation.name }}
              </h3>

              <!-- Sous-titre -->
              <p :class="['text-sm opacity-70 mb-1', formation.textColor]">
                {{ formation.subtitle }}
              </p>

              <!-- Description (apparaît au hover) -->
              <div class="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100">
                <p :class="['text-sm leading-relaxed mb-3 opacity-80', formation.textColor]">
                  {{ formation.description }}
                </p>
              </div>

              <!-- CTA -->
              <div :class="['flex items-center gap-2 text-sm font-medium', formation.textColor]">
                <template v-if="formation.isBonus">
                  <FontAwesomeIcon v-if="icons.lock" :icon="icons.lock" class="size-3 opacity-70" />
                  <span>Débloquer avec mes étoiles</span>
                </template>
                <template v-else>
                  <span>Découvrir la formation</span>
                  <FontAwesomeIcon
                    v-if="icons.arrowRight"
                    :icon="icons.arrowRight"
                    class="size-3 group-hover:translate-x-1 transition-transform"
                  />
                </template>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <!-- Section Rythme (intégrée) -->
      <div class="mt-16 pt-12 border-t border-border">
        <!-- Légende des contenus -->
        <div class="flex flex-wrap items-center justify-center gap-6 mb-8">
          <div
            v-for="content in contentTypes"
            :key="content.day"
            class="flex items-center gap-2"
          >
            <FontAwesomeIcon
              v-if="icons[content.icon]"
              :icon="getIconDef(content.icon)"
              class="size-5 text-muted-foreground"
            />
            <span class="text-sm">
              <span class="font-semibold text-foreground">{{ content.day }}</span>
              <span class="text-muted-foreground"> : {{ content.title }}</span>
            </span>
          </div>
        </div>

        <!-- Timeline 4 semaines -->
        <div class="relative">
          <!-- Ligne de connexion (desktop) -->
          <div class="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-border"></div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="(formation, weekIndex) in formations"
              :key="`week-${formation.id}`"
              class="relative"
            >
              <!-- Header semaine -->
              <div
                class="rounded-t-lg px-4 py-3"
                :style="{ backgroundColor: formation.color }"
              >
                <p :class="['font-heading font-bold text-sm', formation.textColor]">
                  Semaine {{ weekIndex + 1 }}
                </p>
                <p :class="['text-xs opacity-70', formation.textColor]">
                  {{ formation.name }}
                </p>
              </div>

              <!-- Contenus de la semaine -->
              <div class="bg-neutral-50 rounded-b-lg p-4 space-y-3">
                <div
                  v-for="content in contentTypes"
                  :key="`${formation.id}-${content.day}`"
                  class="flex items-center gap-3"
                >
                  <FontAwesomeIcon
                    v-if="icons[content.icon]"
                    :icon="getIconDef(content.icon)"
                    class="size-5 shrink-0"
                    :style="{ color: formation.color }"
                  />
                  <div>
                    <p class="text-[10px] uppercase tracking-wide text-muted-foreground">{{ content.day }}</p>
                    <p class="font-medium text-sm text-foreground">{{ content.title }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicateur de cycle -->
        <div class="flex items-center justify-center gap-2 mt-8">
          <div
            v-for="formation in formations"
            :key="`dot-${formation.id}`"
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: formation.color }"
          ></div>
          <FontAwesomeIcon
            v-if="icons.arrowRight"
            :icon="icons.arrowRight"
            class="size-4 text-muted-foreground mx-2"
          />
          <span class="text-muted-foreground text-sm">puis on recommence !</span>
        </div>

        <!-- Note -->
        <p class="text-center text-muted-foreground text-xs mt-4">
          * Avec un abonnement multi-formations, recevez plusieurs contenus par semaine !
        </p>
      </div>
    </div>
  </section>
</template>
