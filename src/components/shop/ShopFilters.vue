<script setup lang="ts">
/**
 * Composant ShopFilters
 * Barre de filtres horizontale style éditorial/magazine
 *
 * Desktop: Pills horizontaux + dropdown tri + compteur résultats
 * Mobile: Bouton ouvrant un Sheet avec tous les filtres
 */
import { computed, ref } from 'vue'
import { useShopStore } from '@/stores/shop.store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import ShopSort from './ShopSort.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const shopStore = useShopStore()

/**
 * État du Sheet mobile
 */
const isSheetOpen = ref(false)

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  filter: byPrefixAndName.fas?.['sliders'],
  times: byPrefixAndName.fas?.['times'],
  check: byPrefixAndName.fas?.['check'],
}))

/**
 * Tags de filtre disponibles (préfixe "filter_") avec displayName pour l'affichage
 */
const filterTags = computed(() => shopStore.availableTagsFiltered)

/**
 * Vérifie si un tag est actif
 */
const isTagActive = (tag: string): boolean => {
  return shopStore.activeTagFilters.has(tag)
}

/**
 * Toggle un tag
 */
const toggleTag = (tag: string) => {
  shopStore.toggleTagFilter(tag)
}

/**
 * Réinitialiser tous les filtres
 */
const resetFilters = () => {
  shopStore.resetFilters()
}

/**
 * Nombre de filtres actifs
 */
const activeFiltersCount = computed(() => {
  return shopStore.activeTagFilters.size
})
</script>

<template>
  <div class="w-full">
    <!-- Desktop: Barre horizontale -->
    <div class="hidden md:flex items-center gap-4 py-4 border-b border-border">
      <!-- Pills de filtres (basés sur les tags filter_*) -->
      <div class="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
        <Button
          variant="outline"
          size="sm"
          rounded="default"
          :color="!shopStore.hasActiveFilters ? 'primary' : 'neutral-400'"
          :class="!shopStore.hasActiveFilters ? 'bg-primary/10' : ''"
          @click="resetFilters"
        >
          Tous
        </Button>

        <Button
          v-for="tag in filterTags"
          :key="tag.raw"
          :variant="isTagActive(tag.raw) ? 'default' : 'outline'"
          color="primary"
          size="sm"
          rounded="default"
          class="whitespace-nowrap"
          @click="toggleTag(tag.raw)"
        >
          {{ tag.displayName }}
        </Button>
      </div>

      <!-- Séparateur vertical -->
      <Separator orientation="vertical" class="h-6" />

      <!-- Tri -->
      <ShopSort />

      <!-- Compteur de résultats -->
      <span class="text-muted-foreground text-sm whitespace-nowrap ml-auto">
        {{ shopStore.resultsCount }} {{ shopStore.resultsCount === 1 ? 'dossier' : 'dossiers' }}
      </span>
    </div>

    <!-- Mobile: Bouton + Sheet -->
    <div class="flex md:hidden items-center justify-between gap-4 py-4 border-b border-border">
      <!-- Bouton filtres -->
      <Sheet v-model:open="isSheetOpen">
        <SheetTrigger as-child>
          <Button variant="outline" size="sm" class="gap-2">
            <FontAwesomeIcon v-if="icons.filter" :icon="icons.filter" class="w-4 h-4" />
            Filtres
            <Badge
              v-if="activeFiltersCount > 0"
              variant="default"
              color="primary"
              class="ml-1 px-1.5 py-0 text-xs"
            >
              {{ activeFiltersCount }}
            </Badge>
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" class="h-[80vh] rounded-t-xl">
          <SheetHeader class="pb-4">
            <div class="flex items-center justify-between">
              <SheetTitle>Filtres</SheetTitle>
              <Button
                v-if="shopStore.hasActiveFilters"
                variant="ghost"
                size="sm"
                class="text-xs text-muted-foreground"
                @click="resetFilters"
              >
                <FontAwesomeIcon v-if="icons.times" :icon="icons.times" class="w-3 h-3 mr-1" />
                Réinitialiser
              </Button>
            </div>
          </SheetHeader>

          <div class="space-y-6 overflow-y-auto">
            <!-- Filtres par tag -->
            <div v-if="filterTags.length > 0" class="space-y-3">
              <h4 class="font-semibold text-sm text-foreground uppercase tracking-wide">
                Filtres
              </h4>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="tag in filterTags"
                  :key="tag.raw"
                  :variant="isTagActive(tag.raw) ? 'default' : 'outline'"
                  color="primary"
                  size="sm"
                  rounded="sm"
                  @click="toggleTag(tag.raw)"
                >
                  {{ tag.displayName }}
                </Button>
              </div>
            </div>

            <Separator />

            <!-- Tri -->
            <div class="space-y-3">
              <h4 class="font-semibold text-sm text-foreground uppercase tracking-wide">
                Trier par
              </h4>
              <ShopSort />
            </div>
          </div>

          <!-- Footer avec compteur -->
          <div class="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
            <Button
              variant="default"
              color="primary"
              class="w-full"
              @click="isSheetOpen = false"
            >
              Voir {{ shopStore.resultsCount }} {{ shopStore.resultsCount === 1 ? 'résultat' : 'résultats' }}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <!-- Tri rapide mobile -->
      <ShopSort />

      <!-- Compteur -->
      <span class="text-muted-foreground text-sm">
        {{ shopStore.resultsCount }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
