<script setup lang="ts">
/**
 * EditorialGrid - Grille classique pour la boutique
 *
 * Grille uniforme 4 colonnes :
 * ┌────────┬────────┬────────┬────────┐
 * │  Card  │  Card  │  Card  │  Card  │
 * ├────────┼────────┼────────┼────────┤
 * │  Card  │  Card  │  Card  │  Card  │
 * └────────┴────────┴────────┴────────┘
 *
 * Responsive:
 * - Mobile: 1 colonne
 * - Tablet: 2 colonnes
 * - Desktop: 4 colonnes
 */
import { computed } from 'vue'
import { useShopStore } from '@/stores/shop.store'
import ProductCard, { type CardSize } from './ProductCard.vue'
import type { ShopReference } from '@/types/shop-api.types'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const searchIcon = byPrefixAndName.fas?.['magnifying-glass']

const emit = defineEmits<{
  viewDetails: [reference: ShopReference]
  addToCart: [reference: ShopReference]
}>()

const shopStore = useShopStore()

/**
 * Produits triés et filtrés
 */
const products = computed(() => shopStore.sortedReferences)

/**
 * État de chargement
 */
const isLoading = computed(() => shopStore.isLoading)

/**
 * Erreur éventuelle
 */
const error = computed(() => shopStore.error)

/**
 * Taille de carte uniforme pour toute la grille
 */
const getCardSize = (_index: number): CardSize => {
  return 'medium'
}

/**
 * Gérer les actions sur les cartes produit
 */
const handleViewDetails = (reference: ShopReference) => {
  emit('viewDetails', reference)
}

const handleAddToCart = (reference: ShopReference) => {
  emit('addToCart', reference)
}

/**
 * Réessayer le chargement
 */
const retry = () => {
  shopStore.refresh()
}
</script>

<template>
  <div>
    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border border-primary/20 border-t-primary"></div>
      <p class="mt-4 text-neutral-700 font-medium">Chargement des produits...</p>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="text-center py-16">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-800 font-semibold mb-2">Erreur de chargement</p>
        <p class="text-red-600 text-sm mb-4">{{ error.message }}</p>
        <Button variant="outline" size="sm" color="red-600" @click="retry">
          Réessayer
        </Button>
      </div>
    </div>

    <!-- Message si aucun résultat -->
    <Empty
      v-else-if="products.length === 0"
      title="Aucun produit trouvé"
      description="Essayez de modifier vos filtres ou votre recherche"
    >
      <template #icon>
        <FontAwesomeIcon
          v-if="searchIcon"
          :icon="searchIcon"
          class="w-full h-full"
        />
      </template>
    </Empty>

    <!-- Grille classique 4 colonnes -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
    >
      <ProductCard
        v-for="(reference, index) in products"
        :key="reference.id"
        :reference="reference"
        :size="getCardSize(index)"
        class="h-full"
        @view-details="handleViewDetails"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>
