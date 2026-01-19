<script setup lang="ts">
/**
 * Composant WebinarModal
 * Modale dynamique pour afficher les détails des webinaires de consultations
 * - Layout "Replay" : pour consultations passées avec player vidéo
 * - Layout "Hero" : pour consultations à venir avec formulaire d'inscription
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { APIWebinar } from '@/types/consultations-api.types'
import { getWebinarCategory, getWebinarThumbnail } from '@/types/consultations-api.types'
import { sanitizeHtml } from '@/utils/html.utils'
import { toast } from 'vue-sonner'

/**
 * Router
 */
const router = useRouter()

/**
 * Icônes FontAwesome accessibles de manière sûre
 */
const icons = computed(() => ({
  circlePlay: byPrefixAndName.fas?.['circle-play'],
  download: byPrefixAndName.fas?.['download'],
  shareNodes: byPrefixAndName.fas?.['share-nodes'],
  calendarPlus: byPrefixAndName.fas?.['calendar-plus'],
}))

/**
 * Props du composant
 */
interface Props {
  /**
   * Contrôle l'ouverture/fermeture de la modale
   */
  open: boolean
  /**
   * Données du webinaire à afficher (structure de l'API)
   */
  webinar: APIWebinar
  /**
   * Détermine si c'est un replay (passé) ou une consultation à venir
   */
  isReplay: boolean
}

const props = defineProps<Props>()

/**
 * Emits du composant
 */
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

/**
 * Fermer la modale
 */
const closeModal = () => {
  emit('update:open', false)
}

/**
 * Ouvre le PDF dans un nouvel onglet
 */
const handleDownload = () => {
  if (props.webinar.fileDownload) {
    window.open(props.webinar.fileDownload, '_blank')
  }
}

/**
 * Redirige vers la page player du webinaire
 */
const handlePlay = () => {
  closeModal()
  router.push(`/consultations-nicolas-delourme/watch/${props.webinar.id}`)
}

/**
 * Copie le lien du webinaire dans le presse-papiers
 */
const handleShare = async () => {
  try {
    // Construire l'URL complète du webinaire
    const webinarUrl = `${window.location.origin}/consultations-nicolas-delourme/watch/${props.webinar.id}`

    // Copier dans le presse-papiers
    await navigator.clipboard.writeText(webinarUrl)

    // Afficher la notification de succès avec icône
    toast.success('Lien copié avec succès !', {
      duration: 3000,
    })
  } catch (error) {
    console.error('Erreur lors de la copie du lien:', error)

    // Fallback: notification d'erreur
    toast.error('Impossible de copier le lien', {
      duration: 3000,
    })
  }
}

/**
 * Mapper les catégories vers les labels
 */
const getCategoryLabel = (category: string): string => {
  const labelMap: Record<string, string> = {
    argent: 'Argent',
    metaux: 'Métaux Précieux',
    immobilier: 'Immobilier',
    patrimoine: 'Patrimoine'
  }
  return labelMap[category] || category
}

/**
 * Classe du badge selon la catégorie
 */
const categoryBadgeClass = computed(() => {
  const category = getWebinarCategory(props.webinar)
  const classMap: Record<string, string> = {
    argent: 'bg-consultations-nd-argent text-white border-gray-300',
    metaux: 'bg-consultations-nd-metauxprecieux text-white border-gray-300',
    immobilier: 'bg-consultations-nd-immobilier text-white border-gray-300',
    patrimoine: 'bg-consultations-nd-patrimoine text-white border-gray-300'
  }
  return classMap[category] || 'bg-gray-200 text-gray-900'
})
</script>

<template>
  <Dialog :open="open" @update:open="closeModal">
    <DialogContent class="min-w-4xl p-0 gap-0 overflow-hidden">
      <!-- Layout Replay (pour consultations passées) -->
      <div v-if="isReplay" class="flex flex-col">
        <!-- Image de couverture avec player vidéo -->
        <div class="relative h-[450px] rounded-t-lg overflow-hidden">
          <img :src="getWebinarThumbnail(webinar)" :alt="webinar.name" class="w-full h-full object-cover" />

          <!-- Boutons en overlay (en bas à gauche) -->
          <div class="absolute bottom-4 left-4 flex items-end gap-2">
            <!-- Bouton Play -->
            <Button variant="default" color="primary" size="xl" class="shadow-lg" @click="handlePlay">
              <FontAwesomeIcon v-if="icons.circlePlay" :icon="icons.circlePlay" class="fa-xl" />
            </Button>

            <!-- Bouton Télécharger le dossier -->
            <Button variant="default" color="primary" size="default"
              class="flex items-center shadow-lg uppercase text-sm font-bold tracking-wide"
              :class="{ 'opacity-65 cursor-not-allowed': !webinar.fileDownload }" :disabled="!webinar.fileDownload"
              @click="webinar.fileDownload ? handleDownload() : undefined">
              <FontAwesomeIcon v-if="icons.download" :icon="icons.download" class="h-5 w-5 mr-2" />
              <span>Télécharger le dossier</span>
            </Button>

            <!-- Bouton Share -->
            <Button variant="outline" color="primary" size="default" class="shadow-lg bg-white" @click="handleShare">
              <FontAwesomeIcon v-if="icons.shareNodes" :icon="icons.shareNodes" class="h-5 w-5" />
            </Button>
          </div>
        </div>

        <!-- Contenu du bas -->
        <div class="bg-white p-4 space-y-2">
          <!-- Titre et informations -->
          <div class="flex gap-4 pb-4 border-b">
            <div class="flex-1 space-y-2">
              <DialogTitle class="text-2xl font-medium text-gray-900 leading-tight" v-html="sanitizeHtml(webinar.name)">
              </DialogTitle>

              <h5 class="text-xl font-medium text-gray-900">
                {{ webinar.dateFormatted }}
              </h5>

              <div class="flex items-center gap-2">
                <Badge :class="categoryBadgeClass" class="text-xs uppercase">
                  {{ getCategoryLabel(getWebinarCategory(webinar)) }}
                </Badge>
              </div>
            </div>

            <!-- Participants et Durée -->
            <div class="w-64 space-y-3">
              <div class="space-y-1">
                <p class="text-base font-bold text-gray-900">Participants :</p>
                <p class="text-base text-gray-900">{{ webinar.participant }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-base font-bold text-gray-900">Durée :</p>
                <p class="text-base text-gray-900">{{ webinar.duration }} minutes</p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="text-base text-gray-900 leading-relaxed pt-2" v-html="webinar.description">
          </div>
        </div>
      </div>

      <!-- Layout Hero (pour consultations à venir) -->
      <div v-else class="flex flex-col">
        <!-- Image de couverture -->
        <div class="relative h-[450px] rounded-t-lg overflow-hidden">
          <img :src="getWebinarThumbnail(webinar)" :alt="webinar.name" class="w-full h-full object-cover" />

          <!-- Boutons en overlay (en bas à gauche) -->
          <div class="absolute bottom-4 left-4 flex gap-2">
            <!-- Bouton Poser une question -->
            <Button variant="default" color="primary" size="default"
              class="shadow-lg uppercase text-sm font-bold tracking-wide">
              Poser une question
            </Button>

            <!-- Bouton Add to Calendar -->
            <Button variant="outline" color="primary" size="default" class="shadow-lg">
              <FontAwesomeIcon v-if="icons.calendarPlus" :icon="icons.calendarPlus" class="h-5 w-5" />
            </Button>

            <!-- Bouton Share -->
            <Button variant="outline" color="primary" size="default" class="shadow-lg bg-white " @click="handleShare">
              <FontAwesomeIcon v-if="icons.shareNodes" :icon="icons.shareNodes" class="h-5 w-5" />
            </Button>
          </div>

        </div>

        <!-- Contenu du bas -->
        <div class="bg-white p-6 space-y-2">
          <!-- Titre et informations -->
          <div class="flex gap-4">
            <div class="flex-1 space-y-2">
              <DialogTitle class="text-2xl font-medium text-gray-900 leading-tight" v-html="sanitizeHtml(webinar.name)">
              </DialogTitle>

              <h5 class="text-xl font-medium text-gray-900">
                {{ webinar.dateFormatted }}
              </h5>

              <div class="flex items-center gap-2">
                <Badge :class="categoryBadgeClass" class="text-xs uppercase">
                  {{ getCategoryLabel(getWebinarCategory(webinar)) }}
                </Badge>
              </div>
            </div>

            <!-- Participants et Durée -->
            <div class="w-64 space-y-3">
              <div class="space-y-1">
                <p class="text-base font-bold text-gray-900">Participants :</p>
                <p class="text-base text-gray-900">{{ webinar.participant }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-base font-bold text-gray-900">Durée :</p>
                <p class="text-base text-gray-900">{{ webinar.duration }} minutes</p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="text-base text-gray-900 leading-relaxed pt-2" v-html="webinar.description">
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
/* Styles pour le contenu HTML de la description */
:deep(strong) {
  font-weight: 500;
}
</style>
