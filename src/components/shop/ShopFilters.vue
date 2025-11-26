<script setup lang="ts">
/**
 * Composant ShopFilters
 * Filtres latéraux pour la boutique (collections, tags)
 */
import { computed } from 'vue'
import { useShopStore } from '@/stores/shop.store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const shopStore = useShopStore()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  filter: byPrefixAndName.fas?.['filter'],
  times: byPrefixAndName.fas?.['times'],
  check: byPrefixAndName.fas?.['check'],
  chevronDown: byPrefixAndName.fas?.['chevron-down'],
}))

/**
 * Collections disponibles
 */
const collections = computed(() => shopStore.availableCollections)

/**
 * Tags disponibles (filtrés en fonction des collections sélectionnées)
 */
const tags = computed(() => shopStore.availableTagsFiltered)

/**
 * Couleurs des badges de collection (pour correspondre aux consultations)
 */
const getCollectionColor = (collectionId: string): string => {
  const collectionColors: Record<string, string> = {
    or: 'yellow-500',
    argent: 'gray-400',
    patrimoine: 'blue-600',
    immobilier: 'green-600',
    securite: 'red-600',
    formation: 'purple-600',
  }

  return collectionColors[collectionId] || 'neutral-600'
}

/**
 * Vérifie si une collection est active
 */
const isCollectionActive = (collectionId: string): boolean => {
  return shopStore.activeCollectionFilters.has(collectionId)
}

/**
 * Vérifie si un tag est actif
 */
const isTagActive = (tag: string): boolean => {
  return shopStore.activeTagFilters.has(tag)
}

/**
 * Toggle une collection
 */
const toggleCollection = (collectionId: string) => {
  shopStore.toggleCollectionFilter(collectionId)
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
</script>

<template>
  <Card class="rounded-md">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="flex items-center gap-2 text-primary">
          <FontAwesomeIcon v-if="icons.filter" :icon="icons.filter" class="w-5 h-5" />
          <span>Filtres</span>
        </CardTitle>

        <!-- Bouton reset (visible uniquement si filtres actifs) -->
        <Button v-if="shopStore.hasActiveFilters" @click="resetFilters" variant="ghost" size="sm"
          class="text-xs text-neutral-500 hover:text-primary">
          <FontAwesomeIcon v-if="icons.times" :icon="icons.times" class="w-3 h-3 mr-1" />
          Réinitialiser
        </Button>
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Section Collections avec style boutons -->
      <Collapsible default-open>
        <CollapsibleTrigger
          class="flex items-center justify-between w-full p-2 hover:bg-red-50 rounded-md transition-colors">
          <h4 class="font-semibold text-sm text-neutral-700 uppercase tracking-wide">Collections</h4>
          <FontAwesomeIcon v-if="icons.chevronDown" :icon="icons.chevronDown" class="w-4 h-4 text-neutral-400" />
        </CollapsibleTrigger>

        <CollapsibleContent class="pt-3">
          <div class="flex flex-wrap gap-2">
            <Button v-for="collection in collections" :key="collection" @click="toggleCollection(collection)"
              :variant="isCollectionActive(collection) ? 'default' : 'outline'" :color="getCollectionColor(collection)"
              size="sm" rounded="sm" class="font-semibold text-xs uppercase">
              {{ collection }}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator class="bg-primary/20" />

      <!-- Section Tags/Thèmes en collapse fermé par défaut -->
      <Collapsible>
        <CollapsibleTrigger
          class="flex items-center justify-between w-full p-2 hover:bg-red-50 rounded-md transition-colors">
          <h4 class="font-semibold text-sm text-neutral-700 uppercase tracking-wide">
            Thèmes
            <span v-if="shopStore.activeTagFilters.size > 0" class="ml-2 text-xs text-primary">
              ({{ shopStore.activeTagFilters.size }})
            </span>
          </h4>
          <FontAwesomeIcon v-if="icons.chevronDown" :icon="icons.chevronDown" class="w-4 h-4 text-neutral-400" />
        </CollapsibleTrigger>

        <CollapsibleContent class="pt-3">
          <div class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag" @click="toggleTag(tag)"
              :variant="isTagActive(tag) ? 'default' : 'outline'" color="neutral-700"
              class="cursor-pointer hover:bg-neutral-100 transition-colors text-xs">
              {{ tag }}
              <FontAwesomeIcon v-if="icons.check && isTagActive(tag)" :icon="icons.check" class="w-3 h-3 ml-1" />
            </Badge>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <!-- Compteur de résultats -->
      <div v-if="shopStore.hasActiveFilters">
        <Separator class="bg-primary/20" />
        <div class="pt-4 text-center">
          <Badge color="primary" variant="default" class="text-sm px-4 py-1">
            <strong>{{ shopStore.resultsCount }}</strong>
            {{ shopStore.resultsCount === 1 ? 'produit trouvé' : 'produits trouvés' }}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
