<script setup lang="ts">
/**
 * Page ShopPage
 * Landing page de la boutique avec filtres, recherche et grille de produits
 */
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useShopStore } from '@/stores/shop.store'
import { useCartStore } from '@/stores/cart.store'
import ShopSearchBar from '@/components/shop/ShopSearchBar.vue'
import ShopSort from '@/components/shop/ShopSort.vue'
import ShopFilters from '@/components/shop/ShopFilters.vue'
import ProductGrid from '@/components/shop/ProductGrid.vue'
import type { ShopReference } from '@/types/shop-api.types'
import { getShopImageUrl } from '@/types/shop-api.types'
import { CartError } from '@/types/cart.types'

const router = useRouter()
const shopStore = useShopStore()
const cartStore = useCartStore()

/**
 * Nombre de résultats
 */
const resultsCount = computed(() => shopStore.resultsCount)

/**
 * Charger le catalogue au montage du composant
 */
onMounted(() => {
  // Mettre à jour le titre de la page
  document.title = 'Éditions Jean de Portal : La boutique'

  shopStore.fetchCatalog()
})

/**
 * Gérer les actions produit
 */
const handleViewDetails = (reference: ShopReference) => {
  router.push(`/boutique/${reference.id}`)
}

const handleAddToCart = (reference: ShopReference) => {
  try {
    // Obtenir le prix minimum pour ce produit
    const allPrices = reference.products.flatMap((product) =>
      product.prices.map((price) => price.amount)
    )
    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0

    // Obtenir l'image principale
    const mainImage = reference.images.length > 0
      ? getShopImageUrl(reference.images[0])
      : undefined

    // Ajouter au panier
    cartStore.addItem({
      id: reference.id,
      name: reference.name || 'Produit',
      price: minPrice,
      image: mainImage,
      slug: reference.id,
    })

    toast.success(`${reference.name} ajouté au panier`)
  } catch (error) {
    if (error instanceof CartError) {
      toast.error(error.message)
    } else {
      toast.error('Impossible d\'ajouter au panier')
    }
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="bg-white border-b border-gray-200 py-12">
        <div class="max-w-7xl mx-auto px-4">
          <!-- Header avec titre et sous-titre -->
          <div class="text-center mb-8">
            <h1 class="text-4xl md:text-5xl font-bold text-neutral-800 mb-3" style="font-family: Roboto, sans-serif;">
              La boutique
            </h1>

            <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
              Découvrez notre sélection de métaux précieux, formations et outils pour développer votre patrimoine
            </p>
          </div>

          <!-- Barre de recherche centrée -->
          <div class="max-w-2xl mx-auto">
            <ShopSearchBar />
          </div>
        </div>
      </section>

      <!-- Contenu principal -->
      <section class="max-w-6xl mx-auto px-4 py-8">
        <div class="grid lg:grid-cols-[280px_1fr] gap-5">
          <!-- Sidebar gauche: Filtres -->
          <aside class="hidden lg:block">
            <div class="sticky top-21">
              <ShopFilters />
            </div>
          </aside>

          <!-- Contenu principal: Grille produits -->
          <main class="space-y-6">
            <!-- Header avec compteur + tri -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <!-- Compteur de résultats -->
              <div>
                <p class="text-sm text-neutral-600">
                  <strong class="text-neutral-800">{{ resultsCount }}</strong>
                  {{ resultsCount === 1 ? 'produit trouvé' : 'produits trouvés' }}
                </p>
              </div>

              <!-- Tri -->
              <ShopSort />
            </div>

            <!-- Filtres mobiles (accordion ou modal) -->
            <div class="lg:hidden">
              <details class="bg-white border border-gray-200 rounded-md">
                <summary
                  class="px-4 py-3 cursor-pointer font-semibold text-neutral-800 flex items-center justify-between">
                  <span>Filtres</span>
                  <span class="text-neutral-400">▼</span>
                </summary>
                <div class="p-4 border-t border-gray-200">
                  <ShopFilters />
                </div>
              </details>
            </div>

            <!-- Grille de produits -->
            <ProductGrid @view-details="handleViewDetails" @add-to-cart="handleAddToCart" />
          </main>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>
