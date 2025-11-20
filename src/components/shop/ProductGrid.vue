<script setup lang="ts">
/**
 * Composant ProductGrid
 * Grille responsive des produits avec gestion des états
 */
import { computed } from 'vue'
import { useShopStore } from '@/stores/shop.store'
import ProductCard from './ProductCard.vue'
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
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-neutral-700">Chargement des produits...</p>
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
      <div class="max-w-md mx-auto">
        <p class="text-xl text-neutral-700 mb-2">Aucun produit trouvé</p>
        <p class="text-sm text-neutral-500">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </div>
    </div>

    <!-- Grille de produits -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
      <ProductCard v-for="reference in products" :key="reference.id" :reference="reference"
        @view-details="handleViewDetails" @add-to-cart="handleAddToCart" />
    </div>
  </div>
</template>
