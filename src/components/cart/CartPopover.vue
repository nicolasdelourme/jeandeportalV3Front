<script setup lang="ts">
/**
 * Mini-panier (popover) affiché dans la navbar
 * Aperçu rapide avec actions de base
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Empty } from '@/components/ui/empty'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { toast } from 'vue-sonner'

const router = useRouter()
const cartStore = useCartStore()

const icons = computed(() => ({
  shoppingCart: byPrefixAndName.fas?.['shopping-cart'],
  trash: byPrefixAndName.fas?.['trash'],
  xmark: byPrefixAndName.fas?.['xmark'],
}))

/**
 * Supprime un article du panier
 */
function handleRemoveItem(productId: string | number, productName: string) {
  try {
    cartStore.removeItem(productId)
    toast.success(`${productName} retiré du panier`)
  } catch (error) {
    toast.error('Erreur lors de la suppression')
  }
}

/**
 * Navigue vers la page panier
 */
function goToCart() {
  router.push('/panier')
}

/**
 * Formate le prix
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="ghost" color="neutral-800" size="sm" class="relative">
        <FontAwesomeIcon
          v-if="icons.shoppingCart"
          :icon="icons.shoppingCart"
          class="h-5 w-5 text-[#1a2d40]"
        />
        <!-- Badge avec nombre d'articles -->
        <Badge
          v-if="cartStore.itemCount > 0"
          variant="default"
          color="primary"
          class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
        </Badge>
      </Button>
    </PopoverTrigger>

    <PopoverContent align="end" class="w-96">
      <!-- En-tête -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-lg" style="font-family: Roboto, sans-serif;">
          Mon panier
        </h3>
        <span class="text-sm text-neutral-500" style="font-family: Roboto, sans-serif;">
          {{ cartStore.itemCount }} {{ cartStore.itemCount > 1 ? 'produits' : 'produit' }}
        </span>
      </div>

      <!-- Liste des articles ou état vide -->
      <div v-if="cartStore.isEmpty" class="py-8">
        <Empty
          title="Panier vide"
          description="Votre panier est vide. Ajoutez des produits pour commencer."
          class="py-4"
        >
          <template #icon>
            <FontAwesomeIcon
              v-if="icons.shoppingCart"
              :icon="icons.shoppingCart"
              class="h-10 w-10 text-neutral-400"
            />
          </template>
        </Empty>
      </div>

      <div v-else class="space-y-4">
        <!-- Liste des articles (max 3 affichés) -->
        <div class="max-h-64 overflow-y-auto space-y-3">
          <div
            v-for="item in cartStore.items.slice(0, 3)"
            :key="item.id"
            class="flex gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <!-- Image -->
            <div class="w-16 h-16 flex-shrink-0 bg-neutral-100 rounded-md overflow-hidden">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Infos -->
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate" style="font-family: Roboto, sans-serif;">
                {{ item.name }}
              </p>
              <p class="font-semibold text-sm text-primary mt-1">
                {{ formatPrice(item.price) }}
              </p>
            </div>

            <!-- Bouton supprimer -->
            <button
              @click="handleRemoveItem(item.id, item.name)"
              class="flex-shrink-0 text-neutral-400 hover:text-red-600 transition-colors p-1"
              title="Retirer du panier"
            >
              <FontAwesomeIcon v-if="icons.xmark" :icon="icons.xmark" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Message si plus de 3 articles -->
        <div v-if="cartStore.itemCount > 3" class="text-center text-sm text-neutral-500">
          + {{ cartStore.itemCount - 3 }} autre{{ cartStore.itemCount - 3 > 1 ? 's' : '' }} produit{{ cartStore.itemCount - 3 > 1 ? 's' : '' }}
        </div>

        <Separator />

        <!-- Total -->
        <div class="flex items-center justify-between font-semibold text-lg">
          <span style="font-family: Roboto, sans-serif;">Total</span>
          <span class="text-primary">{{ formatPrice(cartStore.subtotal) }}</span>
        </div>

        <!-- CTA -->
        <Button
          @click="goToCart"
          variant="default"
          color="primary"
          class="w-full"
          size="lg"
        >
          <span class="font-bold" style="font-family: Roboto, sans-serif;">
            Voir le panier
          </span>
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
