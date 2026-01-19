<script setup lang="ts">
/**
 * Composant CatalogueConsultations
 * Catalogue filtrable des webinaires de consultations Nicolas Delourme
 * Utilise Pinia pour la gestion des données avec cache intelligent
 */

import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty } from '@/components/ui/empty'
import WebinarCard from './WebinarCard.vue'
import WebinarModal from './WebinarModal.vue'
import { useConsultationsStore } from '@/stores/consultations.store'
import type { APIWebinar, FilterCategory } from '@/types/consultations-api.types'
import { getWebinarCategory, getWebinarThumbnail } from '@/types/consultations-api.types'
import { sanitizeHtml } from '@/utils/html.utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

// Store Pinia
const consultationsStore = useConsultationsStore()

// État des filtres actifs (par défaut tous actifs)
const activeFilters = ref<Set<FilterCategory>>(
  new Set(['argent', 'metaux', 'patrimoine', 'immobilier'])
)

// État de la modale
const isModalOpen = ref(false)
const selectedWebinar = ref<APIWebinar | null>(null)

// Webinaires filtrés par catégorie et triés du plus récent au plus vieux
// Note: On affiche UNIQUEMENT les replays (index 0 à lastWebinarId inclus)
const filteredWebinars = computed(() => {
  const lastIndex = consultationsStore.lastWebinarId

  // Prendre uniquement les replays (index 0 à lastWebinarId)
  const replays = consultationsStore.webinars.slice(0, lastIndex + 1)

  return replays
    .filter((w) => {
      // Filtrer par catégorie active
      const category = getWebinarCategory(w)
      return activeFilters.value.has(category)
    })
    .sort((a, b) => {
      // Trier par ID décroissant (plus récent d'abord)
      return parseInt(b.id) - parseInt(a.id)
    })
})

// Fonction pour toggle un filtre
const toggleFilter = (filter: FilterCategory) => {
  if (activeFilters.value.has(filter)) {
    activeFilters.value.delete(filter)
  } else {
    activeFilters.value.add(filter)
  }
  // Force la réactivité
  activeFilters.value = new Set(activeFilters.value)
}

// Vérifier si un filtre est actif
const isFilterActive = (filter: FilterCategory) => {
  return activeFilters.value.has(filter)
}

/**
 * Extrait uniquement la date sans l'heure du dateFormatted
 * Ex: " 1 mai 2025 à 16h30" => " 1 mai 2025"
 */
const getDateOnly = (dateFormatted: string): string => {
  return dateFormatted.split(' à ')[0] || dateFormatted
}

/**
 * Ouvre la modale avec les données d'un webinaire (en mode Replay)
 */
const openModal = (webinar: APIWebinar) => {
  selectedWebinar.value = webinar
  isModalOpen.value = true
}

/**
 * Charger les consultations au montage du composant
 */
onMounted(async () => {
  await consultationsStore.fetchConsultations()
})
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Section Filtre -->
    <div class="bg-gray-100 py-5 px-4 border-b border-consultations-nd mt-5">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">

        <!-- Gauche: Icône + Titre -->
        <div class="flex items-center gap-3">
          <FontAwesomeIcon v-if="byPrefixAndName.fak?.['consultations-nd']"
            :icon="byPrefixAndName.fak['consultations-nd']"
            class="h-8 w-8 md:h-10 md:w-10 fa-xl text-consultations-nd" />
          <h2 class="text-xl md:text-2xl font-semibold text-consultations-nd">
            Revoir les dernières Consultations
          </h2>
        </div>

        <!-- Droite: Filtres -->
        <div class="flex gap-2 flex-wrap justify-center md:justify-end">
          <Button :variant="isFilterActive('argent') ? 'default' : 'outline'" color="consultations-nd-argent" size="sm"
            rounded="sm" @click="toggleFilter('argent')">
            Argent
          </Button>
          <Button :variant="isFilterActive('metaux') ? 'default' : 'outline'" color="consultations-nd-metauxprecieux"
            size="sm" rounded="sm" @click="toggleFilter('metaux')">
            Métaux précieux
          </Button>
          <Button :variant="isFilterActive('patrimoine') ? 'default' : 'outline'" color="consultations-nd-patrimoine"
            size="sm" rounded="sm" @click="toggleFilter('patrimoine')">
            Patrimoine
          </Button>
          <Button :variant="isFilterActive('immobilier') ? 'default' : 'outline'" color="consultations-nd-immobilier"
            size="sm" rounded="sm" @click="toggleFilter('immobilier')">
            Immobilier
          </Button>
        </div>
      </div>
    </div>

    <!-- Grille de webinaires -->
    <div class="bg-gray-100 py-5 px-4">
      <div class="container mx-auto">
        <!-- État de chargement avec Skeleton -->
        <div v-if="consultationsStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Afficher 6 squelettes de cartes -->
          <div v-for="i in 6" :key="`skeleton-${i}`" class="space-y-3">
            <Skeleton class="h-48 w-full rounded-lg" />
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
          </div>
        </div>

        <!-- État d'erreur -->
        <Empty
          v-else-if="consultationsStore.error"
          title="Erreur de chargement"
          :description="consultationsStore.error.message"
        >
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-10 w-10 text-red-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </template>
          <template #action>
            <Button @click="consultationsStore.refresh()" variant="outline" size="sm">
              Réessayer
            </Button>
          </template>
        </Empty>

        <!-- Message si aucun résultat -->
        <Empty
          v-else-if="filteredWebinars.length === 0"
          title="Aucune consultation trouvée"
          description="Aucun webinaire ne correspond aux filtres sélectionnés."
        >
          <template #icon>
            <FontAwesomeIcon
              v-if="byPrefixAndName.fak?.['consultations-nd']"
              :icon="byPrefixAndName.fak['consultations-nd']"
              class="h-10 w-10 text-neutral-400"
            />
          </template>
        </Empty>

        <!-- Grille -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WebinarCard v-for="webinar in filteredWebinars" :key="webinar.id" :image="getWebinarThumbnail(webinar)"
            :date="getDateOnly(webinar.dateFormatted)" :title="sanitizeHtml(webinar.name)"
            :color="getWebinarCategory(webinar)" :has-file="!!webinar.fileDownload" @click="openModal(webinar)" />
        </div>
      </div>
    </div>

    <!-- Modale pour afficher les détails du webinaire (en mode Replay) -->
    <WebinarModal v-if="selectedWebinar" v-model:open="isModalOpen" :webinar="selectedWebinar" :is-replay="true" />
  </div>
</template>
