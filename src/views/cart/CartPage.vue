<script setup lang="ts">
/**
 * Page Panier
 * Page complète pour gérer le panier d'achat avec contrôles de quantité
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { toast } from 'vue-sonner'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Empty } from '@/components/ui/empty'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const router = useRouter()
const cartStore = useCartStore()

const icons = computed(() => ({
  shoppingCart: byPrefixAndName.fas?.['shopping-cart'],
  trash: byPrefixAndName.fas?.['trash'],
  plus: byPrefixAndName.fas?.['plus'],
  minus: byPrefixAndName.fas?.['minus'],
}))

/**
 * Formate le prix
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

/**
 * Supprime un article (appel API backend)
 */
async function removeItem(referenceId: number, productName: string) {
  if (confirm(`Voulez-vous vraiment retirer "${productName}" du panier ?`)) {
    try {
      await cartStore.removeItem(referenceId)
      // Toast géré par le store
    } catch (error) {
      // Toast d'erreur géré par le store
    }
  }
}

/**
 * Vide le panier (appel API backend)
 */
async function clearCart() {
  if (confirm('Voulez-vous vraiment vider le panier ?')) {
    try {
      await cartStore.clearCart()
      // Toast géré par le store
    } catch (error) {
      // Toast d'erreur géré par le store
    }
  }
}

/**
 * Augmente la quantité d'un article
 */
async function increaseQuantity(referenceId: number) {
  try {
    await cartStore.increaseQuantity(referenceId)
  } catch (error) {
    // Toast d'erreur géré par le store
  }
}

/**
 * Diminue la quantité d'un article
 */
async function decreaseQuantity(referenceId: number) {
  try {
    await cartStore.decreaseQuantity(referenceId)
  } catch (error) {
    // Toast d'erreur géré par le store
  }
}

/**
 * Va vers la boutique
 */
function goToShop() {
  router.push('/boutique')
}

/**
 * Va vers le checkout (à implémenter)
 */
function goToCheckout() {
  // TODO: Implémenter la page checkout
  toast.info('Page de paiement à venir')
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="bg-white border-b border-gray-200 py-12">
        <div class="max-w-7xl mx-auto px-4">
          <!-- Header avec titre et sous-titre -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <FontAwesomeIcon
                v-if="icons.shoppingCart"
                :icon="icons.shoppingCart"
                class="h-10 w-10 text-primary"
              />
              <h1 class="text-4xl md:text-5xl font-bold text-neutral-800" style="font-family: Roboto, sans-serif;">
                Mon panier
              </h1>
            </div>
            <p class="text-lg text-neutral-600">
              {{ cartStore.itemCount }} {{ cartStore.itemCount > 1 ? 'produits' : 'produit' }} dans votre panier
            </p>
          </div>
        </div>
      </section>

      <!-- Contenu principal -->
      <section class="max-w-7xl mx-auto px-4 py-8">

      <!-- État vide -->
      <div v-if="cartStore.isEmpty" class="py-16">
        <Empty
          title="Votre panier est vide"
          description="Découvrez nos produits et ajoutez-les à votre panier pour commencer."
        >
          <template #icon>
            <FontAwesomeIcon
              v-if="icons.shoppingCart"
              :icon="icons.shoppingCart"
              class="h-12 w-12 text-neutral-400"
            />
          </template>
          <template #action>
            <Button @click="goToShop" variant="default" color="primary" size="lg">
              Découvrir la boutique
            </Button>
          </template>
        </Empty>
      </div>

      <!-- Contenu du panier -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Colonne gauche : Liste des produits -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Bouton vider le panier -->
          <div class="flex justify-end">
            <Button
              @click="clearCart"
              variant="ghost"
              color="neutral-800"
              size="sm"
              class="text-red-600 hover:text-red-700"
            >
              <FontAwesomeIcon v-if="icons.trash" :icon="icons.trash" class="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
          </div>

          <!-- Liste des articles -->
          <div class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.itemId"
              class="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="flex gap-4">
                <!-- Image -->
                <div class="w-24 h-24 flex-shrink-0 bg-neutral-100 rounded-md overflow-hidden">
                  <img
                    v-if="item.images && item.images[0]"
                    :src="item.images[0]"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Infos et actions -->
                <div class="flex-1 flex flex-col justify-between">
                  <!-- Nom et prix -->
                  <div>
                    <h3 class="font-semibold text-lg mb-1" style="font-family: Roboto, sans-serif;">
                      {{ item.name }}
                    </h3>
                    <div class="flex items-center gap-2 mt-2">
                      <!-- Prix réduit si applicable -->
                      <p class="font-bold text-lg text-primary">
                        {{ formatPrice(item.discountPrice ?? item.price) }}
                      </p>
                      <!-- Prix barré si réduction -->
                      <p v-if="item.discountPrice" class="text-sm text-neutral-500 line-through">
                        {{ formatPrice(item.price) }}
                      </p>
                    </div>
                  </div>

                  <!-- Contrôles quantité et suppression -->
                  <div class="flex items-center justify-between mt-3">
                    <!-- Contrôles quantité -->
                    <div class="flex items-center gap-2 border border-neutral-300 rounded-md">
                      <Button
                        @click="decreaseQuantity(item.referenceId)"
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0"
                        :disabled="cartStore.isLoading"
                      >
                        <FontAwesomeIcon v-if="icons.minus" :icon="icons.minus" class="h-3 w-3" />
                      </Button>
                      <span class="px-3 font-medium">{{ item.quantity }}</span>
                      <Button
                        @click="increaseQuantity(item.referenceId)"
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0"
                        :disabled="cartStore.isLoading"
                      >
                        <FontAwesomeIcon v-if="icons.plus" :icon="icons.plus" class="h-3 w-3" />
                      </Button>
                    </div>

                    <!-- Bouton suppression -->
                    <Button
                      @click="removeItem(item.referenceId, item.name)"
                      variant="ghost"
                      size="sm"
                      class="text-red-600 hover:text-red-700"
                      :disabled="cartStore.isLoading"
                    >
                      <FontAwesomeIcon v-if="icons.trash" :icon="icons.trash" class="h-4 w-4 mr-2" />
                      Retirer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne droite : Résumé -->
        <div class="lg:col-span-1">
          <div class="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm sticky top-24">
            <h2 class="text-xl font-bold mb-4" style="font-family: Roboto, sans-serif;">
              Résumé de la commande
            </h2>

            <div class="space-y-3 mb-4">
              <!-- Sous-total HT -->
              <div class="flex justify-between text-neutral-600">
                <span>Sous-total HT ({{ cartStore.itemCount }} {{ cartStore.itemCount > 1 ? 'produits' : 'produit' }})</span>
                <span class="font-medium">{{ formatPrice(cartStore.subtotalExclVAT) }}</span>
              </div>

              <!-- TVA par taux (dynamique) -->
              <div
                v-for="(amount, rate) in cartStore.vatByRate"
                :key="rate"
                class="flex justify-between text-neutral-600"
              >
                <span>TVA {{ rate }}%</span>
                <span class="font-medium">{{ formatPrice(amount) }}</span>
              </div>

              <Separator />

              <!-- Total TTC -->
              <div class="flex justify-between text-lg font-bold">
                <span>Total TTC</span>
                <span class="text-primary">{{ formatPrice(cartStore.subtotal) }}</span>
              </div>

              <p class="text-xs text-neutral-500">
                Les frais de livraison seront calculés à l'étape suivante
              </p>
            </div>

            <!-- CTA Commander -->
            <Button
              @click="goToCheckout"
              variant="default"
              color="primary"
              class="w-full"
              size="lg"
            >
              <span class="font-bold" style="font-family: Roboto, sans-serif;">
                Procéder au paiement
              </span>
            </Button>

            <!-- Continuer les achats -->
            <Button
              @click="goToShop"
              variant="outline"
              color="neutral-800"
              class="w-full mt-3"
            >
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
      </section>
    </div>
  </DefaultLayout>
</template>
