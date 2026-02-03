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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Separator } from '@/components/ui/separator'
import { Empty } from '@/components/ui/empty'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const router = useRouter()
const cartStore = useCartStore()

const icons = computed(() => ({
  shoppingCart: byPrefixAndName.fas?.['shopping-cart'],
  trash: byPrefixAndName.fas?.['trash'],
  creditCard: byPrefixAndName.fas?.['credit-card'],
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
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
 * Supprime un article (appel API backend via /deleteReference)
 * @param itemId - ID de l'item (= referenceId pour l'API)
 * @param productName - Nom du produit pour le message de confirmation
 */
async function removeItem(itemId: number, productName: string) {
  if (confirm(`Voulez-vous vraiment retirer "${productName}" du panier ?`)) {
    try {
      await cartStore.removeItem(itemId)
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
    } catch (error) {
      // Toast d'erreur géré par le store
    }
  }
}

function goToShop() {
  router.push('/boutique')
}

function goToCheckout() {
  router.push('/commander')
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-50">
      <section class="max-w-4xl mx-auto px-4 py-10">

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
                class="w-full h-full"
              />
            </template>
            <template #action>
              <Button variant="secondary" size="lg" rounded="lg" @click="goToShop">
                Découvrir la boutique
              </Button>
            </template>
          </Empty>
        </div>

        <!-- Contenu du panier -->
        <div v-else class="grid lg:grid-cols-3 gap-8">
          <!-- Colonne gauche : Articles -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Header compact -->
            <div class="flex items-center justify-between mb-2">
              <div>
                <h1 class="text-2xl font-bold font-heading text-foreground">Mon panier</h1>
                <p class="text-sm text-muted-foreground mt-1">
                  {{ cartStore.itemCount }} {{ cartStore.itemCount > 1 ? 'produits' : 'produit' }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  variant="ghost"
                  color="secondary"
                  size="sm"
                  class="text-destructive hover:text-destructive"
                  @click="clearCart"
                >
                  <FontAwesomeIcon v-if="icons.trash" :icon="icons.trash" class="h-3.5 w-3.5 mr-1.5" />
                  Vider
                </Button>
                <Button variant="ghost" color="secondary" size="sm" @click="goToShop">
                  <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="h-4 w-4 mr-1.5" />
                  Boutique
                </Button>
              </div>
            </div>

            <!-- Liste des articles -->
            <Card
              v-for="item in cartStore.items"
              :key="item.itemId"
              class="border-secondary rounded-lg p-0"
            >
              <CardContent class="p-3 flex gap-4 items-stretch">
                <!-- Image -->
                <div class="w-32 shrink-0">
                  <AspectRatio :ratio="1" class="bg-muted rounded-lg overflow-hidden">
                    <img
                      v-if="item.images && item.images[0]"
                      :src="item.images[0]"
                      :alt="item.name"
                      class="w-full h-full object-contain"
                    />
                  </AspectRatio>
                </div>

                <!-- Infos -->
                <div class="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 class="text-sm font-semibold text-foreground truncate">
                      {{ item.name }}
                    </h3>
                    <p class="mt-1">
                      <template v-if="item.discountPrice && item.discountPrice > 0 && item.discountPrice !== item.price">
                        <span class="text-sm text-muted-foreground line-through mr-2">{{ formatPrice(item.price) }}</span>
                        <span class="text-lg font-bold text-secondary">{{ formatPrice(item.discountPrice) }}</span>
                      </template>
                      <span v-else class="text-lg font-bold text-secondary">{{ formatPrice(item.price) }}</span>
                    </p>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      HT: {{ formatPrice(item.discountPriceHT && item.discountPriceHT > 0 ? item.discountPriceHT : item.priceHT) }} · TVA {{ item.vatRate }}%
                    </p>
                  </div>

                  <div class="flex items-center justify-end">
                    <Button
                      :disabled="cartStore.isLoading"
                      variant="ghost"
                      size="sm"
                      class="text-destructive hover:text-destructive h-7 px-2"
                      @click="removeItem(item.itemId, item.name)"
                    >
                      <FontAwesomeIcon v-if="icons.trash" :icon="icons.trash" class="h-3.5 w-3.5 mr-1.5" />
                      Retirer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Colonne droite : Résumé -->
          <div class="lg:col-span-1">
            <Card class="sticky top-24 border-0">
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-3">
                  <!-- Sous-total HT -->
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground">Sous-total HT ({{ cartStore.itemCount }} {{ cartStore.itemCount > 1 ? 'produits' : 'produit' }})</span>
                    <span class="font-medium">{{ formatPrice(cartStore.subtotalExclVAT) }}</span>
                  </div>

                  <!-- TVA par taux -->
                  <div
                    v-for="(amount, rate) in cartStore.vatByRate"
                    :key="rate"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-muted-foreground">TVA {{ rate }}%</span>
                    <span class="font-medium">{{ formatPrice(amount) }}</span>
                  </div>

                  <Separator />

                  <!-- Total TTC -->
                  <div class="flex justify-between font-bold text-lg">
                    <span>Total TTC</span>
                    <span class="text-secondary">{{ formatPrice(cartStore.subtotal) }}</span>
                  </div>

                  <p class="text-xs text-muted-foreground">
                    Les frais de livraison seront calculés à l'étape suivante
                  </p>
                </div>

                <!-- CTA Commander -->
                <Button
                  size="lg"
                  class="w-full bg-success hover:bg-success/90 text-success-foreground"
                  rounded="lg"
                  @click="goToCheckout"
                >
                  <FontAwesomeIcon
                    v-if="icons.creditCard"
                    :icon="icons.creditCard"
                    class="w-5 h-5 mr-2"
                  />
                  Commander
                </Button>

                <!-- CTA Continuer achats -->
                <Button
                  class="w-full hover:bg-secondary hover:border-secondary"
                  rounded="lg"
                  color="secondary"
                  variant="outline"
                  size="sm"
                  @click="goToShop"
                >
                  <FontAwesomeIcon
                    v-if="icons.arrowLeft"
                    :icon="icons.arrowLeft"
                    class="w-3.5 h-3.5 mr-1.5"
                  />
                  Continuer mes achats
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>
