<script setup lang="ts">
/**
 * Composant WebinarCard
 * Carte d'affichage d'un webinaire avec image, date et titre
 */

import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

/**
 * Icônes FontAwesome accessibles de manière sûre
 */
const icons = computed(() => ({
  filePdf: byPrefixAndName.fas?.['file-pdf'],
}))

interface Props {
  /**
   * URL de l'image miniature du webinaire
   */
  image: string
  /**
   * Date du webinaire affichée dans le badge
   */
  date: string
  /**
   * Titre du webinaire
   */
  title: string
  /**
   * Couleur thématique du webinaire (pour le badge)
   */
  color?: 'argent' | 'patrimoine' | 'immobilier' | 'metaux'
  /**
   * Indique si un dossier PDF est disponible au téléchargement
   */
  hasFile?: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'argent',
  hasFile: false
})

/**
 * Emit pour l'événement de clic sur la carte
 */
const emit = defineEmits<{
  click: []
}>()

/**
 * Gère le clic sur la carte
 */
const handleClick = () => {
  emit('click')
}
</script>

<template>
  <div class="overflow-hidden rounded-lg shadow-lg bg-white cursor-pointer transition-transform hover:scale-105"
    @click="handleClick">
    <!-- Image avec badge date en overlay -->
    <div class="relative h-[196px]">
      <img :src="image" :alt="title" class="w-full h-full object-cover" />
      <!-- Badge date (coin supérieur droit) -->
      <Badge variant="outline" class="absolute top-3 right-3 bg-white shadow-md text-sm">
        {{ date }}
      </Badge>
    </div>

    <!-- Section titre -->
    <div class="flex items-center justify-between px-4 py-3 bg-white">
      <h3
        class="text-left text-sm font-medium text-gray-900 leading-tight line-clamp-3 flex-1"
        v-html="title"
      ></h3>

      <!-- Icône PDF (à droite du titre) -->
      <div v-if="hasFile" class="flex items-center justify-center ml-2 shrink-0">
        <FontAwesomeIcon v-if="icons.filePdf" :icon="icons.filePdf" class="h-6 w-6 text-red-600" />
      </div>
    </div>
  </div>
</template>
