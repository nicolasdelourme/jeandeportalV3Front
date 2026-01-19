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
        <Button @click="retry" variant="outline" size="sm" color="red-600">
          Réessayer
        </Button>
      </div>
    </div>

    <!-- Message si aucun résultat -->
    <div v-else-if="products.length === 0" class="text-center py-16">
      <div class="max-w-md mx-auto bg-linear-to-br from-red-50 to-white rounded-xl p-8 border border-red-100">
        <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p class="text-xl text-neutral-800 font-semibold mb-2">Aucun produit trouvé</p>
        <p class="text-sm text-neutral-500">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </div>
    </div>

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
