<script setup lang="ts">
/**
 * Page ShopPage
 * Landing page de la boutique avec style éditorial/magazine
 *
 * - Hero carrousel immersif
 * - Filtres horizontaux (pills)
 * - Layout magazine avec cartes de tailles variées
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useShopStore } from '@/stores/shop.store'
import { useCartStore } from '@/stores/cart.store'
import ShopHeroCarousel from '@/components/shop/ShopHeroCarousel.vue'
import ShopFilters from '@/components/shop/ShopFilters.vue'
import EditorialGrid from '@/components/shop/EditorialGrid.vue'
import type { ShopReference } from '@/types/shop-api.types'
import { decodeHTMLEntities } from '@/types/shop-api.types'
import { CartError } from '@/types/cart.types'

const router = useRouter()
const shopStore = useShopStore()
const cartStore = useCartStore()

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

const handleAddToCart = async (reference: ShopReference) => {
  try {
    // Utiliser l'ID du premier produit (reference_array[0].referenceId dans l'API)
    // ShopReference.id = itemId (l'article), products[0].id = referenceId (la vraie référence)
    const productId = reference.products[0]?.id
    if (!productId) {
      toast.error('Produit non disponible')
      return
    }
    await cartStore.addItem(Number(productId))

    toast.success(`${decodeHTMLEntities(reference.name)} ajouté au panier`)
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
    <div class="min-h-screen bg-linear-to-br from-neutral-50 via-white to-red-50/30 relative overflow-x-hidden">
      <!-- Éléments décoratifs de fond -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" ></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" ></div>

      <!-- Hero Carrousel immersif -->
      <ShopHeroCarousel />

      <!-- Contenu principal -->
      <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <!-- Filtres horizontaux (inclut tri et compteur) -->
        <ShopFilters />

        <!-- Grille éditoriale / Magazine -->
        <div class="mt-6">
          <EditorialGrid
            @view-details="handleViewDetails"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>
