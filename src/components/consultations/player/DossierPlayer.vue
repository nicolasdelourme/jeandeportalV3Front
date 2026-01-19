<script setup lang="ts">
/**
 * Composant DossierPlayer
 * Affiche le dossier de la consultation avec les ressources disponibles
 * Visible uniquement en mode Replay
 */

import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

/**
 * Icones FontAwesome
 */
const icons = computed(() => ({
  filePdf: byPrefixAndName.fas?.['file-pdf'],
  check: byPrefixAndName.fas?.['check'],
  key: byPrefixAndName.fas?.['key'],
  lightbulb: byPrefixAndName.fas?.['lightbulb'],
  print: byPrefixAndName.fas?.['print'],
  eye: byPrefixAndName.fas?.['eye'],
  clock: byPrefixAndName.fas?.['clock'],
}))

/**
 * Props du composant
 */
interface Props {
  /**
   * URL du fichier a telecharger (si disponible)
   */
  fileDownload: string
  /**
   * URL de la cover image (si disponible)
   */
  thumbnail: string
  /**
   * Technical tag array pour la couleur
   */
  technicalTagArray: string[]
}

const props = defineProps<Props>()

/**
 * Emits du composant
 */
const emit = defineEmits<{
  'view-document': []
}>()

/**
 * Determine si le document est disponible
 */
const isAvailable = computed(() => !!props.fileDownload)

/**
 * Classe Tailwind pour la couleur selon technicalTag
 */
const tagColor = computed(() => {
  const technicalTag = props.technicalTagArray[0] || ''
  return `bg-consultations-nd-${technicalTag}`
})
</script>

<template>
  <div class="bg-white rounded shadow-md p-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Colonne gauche: Informations (col-8) -->
      <div class="lg:col-span-8 flex items-center gap-6">
        <!-- Icone PDF ou Cover Image -->
        <div v-if="isAvailable && thumbnail" class="shrink-0">
          <img :src="thumbnail" alt="Cover" class="w-20 h-28 object-cover rounded shadow" />
        </div>
        <div v-else :class="tagColor" class="w-20 h-28 rounded shadow flex items-center justify-center shrink-0">
          <FontAwesomeIcon v-if="icons.filePdf" :icon="icons.filePdf" class="h-8 w-8 text-white" />
        </div>

        <!-- Contenu -->
        <div class="flex-1">
          <!-- Titre -->
          <h2 class="text-xl font-bold text-gray-900 mb-2">Dossier de la consultation</h2>

          <!-- Description -->
          <p class="text-gray-600 text-sm mb-3">
            Retrouvez l'integralite des points abordes, les recommandations et les ressources mentionnees pendant cette consultation.
          </p>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2">
            <Badge variant="outline" class="border-consultations-nd text-consultations-nd text-xs font-semibold">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="h-3 w-3 mr-1" />
              Synthese complete
            </Badge>
            <Badge variant="outline" class="border-consultations-nd text-consultations-nd text-xs font-semibold">
              <FontAwesomeIcon v-if="icons.key" :icon="icons.key" class="h-3 w-3 mr-1" />
              Points cles
            </Badge>
            <Badge variant="outline" class="border-consultations-nd text-consultations-nd text-xs font-semibold">
              <FontAwesomeIcon v-if="icons.lightbulb" :icon="icons.lightbulb" class="h-3 w-3 mr-1" />
              Ressources utiles
            </Badge>
          </div>
        </div>
      </div>

      <!-- Colonne droite: CTA (col-4) -->
      <div class="lg:col-span-4 flex flex-col justify-center items-center">
        <!-- Etat: Disponible ou Bientot -->
        <div v-if="isAvailable" class="text-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">Disponible</h3>
        </div>
        <div v-else class="text-center mb-4">
          <h3 class="text-xl font-bold text-gray-600">Bientot</h3>
          <p class="text-xs text-gray-600">en cours de finalisation</p>
        </div>

        <!-- Bouton CTA -->
        <Button
          v-if="isAvailable"
          variant="default"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wide mb-2"
          @click="emit('view-document')"
        >
          <FontAwesomeIcon v-if="icons.eye" :icon="icons.eye" class="h-4 w-4 mr-2" />
          Consulter
        </Button>
        <Button
          v-else
          variant="default"
          disabled
          class="w-full bg-gray-400 text-white font-bold uppercase tracking-wide mb-2 opacity-65"
        >
          <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="h-4 w-4 mr-2" />
          En cours de bouclage
        </Button>

        <!-- Info PDF -->
        <div class="flex items-center justify-center gap-2 text-xs text-gray-600">
          <FontAwesomeIcon v-if="icons.print" :icon="icons.print" class="h-4 w-4" />
          <span>Format PDF - Pret a imprimer</span>
        </div>
      </div>
    </div>
  </div>
</template>
