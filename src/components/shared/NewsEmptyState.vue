<script setup lang="ts">
/**
 * NewsEmptyState
 * État vide stylisé pour les sections actualités
 * Design : illustration géométrique jaune/noir
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = withDefaults(defineProps<{
  /**
   * Type de contenu vide
   */
  type?: 'feed' | 'catalog' | 'filter' | 'error'
  /**
   * Titre personnalisé (optionnel)
   */
  title?: string
  /**
   * Description personnalisée (optionnel)
   */
  description?: string
  /**
   * Afficher le bouton d'action
   */
  showAction?: boolean
  /**
   * Texte du bouton
   */
  actionLabel?: string
}>(), {
  type: 'feed',
  showAction: false,
  actionLabel: 'Réessayer',
})

const emit = defineEmits<{
  action: []
}>()

// Icônes directes (évite les problèmes de typage dynamique)
const newspaperIcon = byPrefixAndName.far?.['newspaper']
const slidersIcon = byPrefixAndName.fas?.['sliders']
const triangleExclamationIcon = byPrefixAndName.fas?.['triangle-exclamation']
const undoIcon = byPrefixAndName.fas?.['undo']

const content = computed(() => {
  switch (props.type) {
    case 'catalog':
      return {
        title: props.title || 'Aucune publication',
        description: props.description || 'Les actualités arrivent bientôt. Restez connecté !',
      }
    case 'filter':
      return {
        title: props.title || 'Aucun résultat',
        description: props.description || 'Aucun contenu ne correspond à ce filtre. Essayez une autre catégorie.',
      }
    case 'error':
      return {
        title: props.title || 'Oups, une erreur',
        description: props.description || 'Impossible de charger les actualités. Veuillez réessayer.',
      }
    default:
      return {
        title: props.title || 'Pas encore d\'actualités',
        description: props.description || 'Notre équipe prépare du contenu exclusif pour vous.',
      }
  }
})

// Icône selon le type
const currentIcon = computed(() => {
  switch (props.type) {
    case 'filter':
      return slidersIcon
    case 'error':
      return triangleExclamationIcon
    default:
      return newspaperIcon
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 md:py-24 text-center px-4">
    <!-- Illustration géométrique stylisée -->
    <div class="relative mb-8">
      <!-- Cercle de fond -->
      <div class="w-28 h-28 md:w-36 md:h-36 rounded-full bg-primary/10 flex items-center justify-center">
        <!-- Cercle intérieur -->
        <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center">
          <!-- Icône -->
          <FontAwesomeIcon
            v-if="currentIcon"
            :icon="currentIcon"
            class="w-10 h-10 md:w-12 md:h-12"
            :class="type === 'error' ? 'text-destructive' : 'text-primary'"
          />
        </div>
      </div>

      <!-- Éléments décoratifs -->
      <div class="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full opacity-60" ></div>
      <div class="absolute -bottom-1 -left-3 w-3 h-3 bg-secondary rounded-full opacity-40" ></div>
      <div class="absolute top-1/2 -right-6 w-2 h-2 bg-primary/50 rounded-full" ></div>
    </div>

    <!-- Titre -->
    <h3 class="font-heading font-bold text-xl md:text-2xl text-secondary mb-3">
      {{ content.title }}
    </h3>

    <!-- Description -->
    <p class="text-muted-foreground max-w-md mb-6 leading-relaxed">
      {{ content.description }}
    </p>

    <!-- Action button -->
    <Button
      v-if="showAction"
      variant="outline"
      rounded="lg"
      class="gap-2 text-secondary hover:text-secondary"
      @click="emit('action')"
    >
      <FontAwesomeIcon
        v-if="undoIcon"
        :icon="undoIcon"
        class="w-4 h-4"
      />
      {{ actionLabel }}
    </Button>
  </div>
</template>
