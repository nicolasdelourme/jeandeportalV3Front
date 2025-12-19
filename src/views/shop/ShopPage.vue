<script setup lang="ts">
/**
 * Page ShopPage
 * Landing page de la boutique avec hero carrousel et grille de produits
 */
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useShopStore } from '@/stores/shop.store'
import { useCartStore } from '@/stores/cart.store'
import ShopHeroCarousel from '@/components/shop/ShopHeroCarousel.vue'
// import ShopSearchBar from '@/components/shop/ShopSearchBar.vue' // ⚠️ Désactivé temporairement - à réactiver plus tard (décision chef de projet)
import ShopSort from '@/components/shop/ShopSort.vue'
import ShopFilters from '@/components/shop/ShopFilters.vue'
import ProductGrid from '@/components/shop/ProductGrid.vue'
import type { ShopReference } from '@/types/shop-api.types'
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
    <div class="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-red-50/30 relative">
      <!-- Élément décoratif de fond -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      <!-- Hero Carrousel -->
      <ShopHeroCarousel />

      <!--
        ⚠️ PLACEHOLDER RECHERCHE
        La barre de recherche sera activée plus tard (décision chef de projet)
        Position prévue : ici, entre le hero et les filtres
        Layout sans recherche : fonctionne bien tel quel
      -->
      <!--
      <section class="bg-white/50 backdrop-blur-sm border-b border-neutral-200/50 py-6">
        <div class="max-w-7xl mx-auto px-4">
          <div class="max-w-2xl mx-auto">
            <ShopSearchBar />
          </div>
        </div>
      </section>
      -->

      <!-- Séparateur -->
      <div class="h-px bg-neutral-200"></div>

      <!-- Contenu principal -->
      <section class="max-w-6xl mx-auto px-4 py-8">
        <div class="grid lg:grid-cols-[280px_1fr] gap-5">
          <!-- Sidebar gauche: Filtres -->
          <aside class="hidden lg:block sticky top-24 self-start">
            <ShopFilters />
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
