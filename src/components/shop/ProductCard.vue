<script setup lang="ts">
/**
 * Composant ProductCard
 * Carte produit pour la grille de la boutique
 */
import { computed } from 'vue'
import type { ShopReference } from '@/types/shop-api.types'
import { getShopImageUrl, formatPrice, stripHTML, decodeHTMLEntities } from '@/types/shop-api.types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { useCartStore } from '@/stores/cart.store'

const props = defineProps<{
  reference: ShopReference
}>()

const emit = defineEmits<{
  viewDetails: [reference: ShopReference]
  addToCart: [reference: ShopReference]
}>()

const cartStore = useCartStore()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  tag: byPrefixAndName.fas?.['tag'],
  eye: byPrefixAndName.fas?.['eye'],
  shoppingCart: byPrefixAndName.fas?.['cart-shopping'],
}))

/**
 * Image principale (première image de la référence)
 */
const mainImage = computed(() => {
  if (props.reference.images.length === 0) {
    return 'https://placehold.co/400x400/e5e7eb/6b7280?text=Pas+d%27image'
  }
  const firstImage = props.reference.images[0]
  if (!firstImage) {
    return 'https://placehold.co/400x400/e5e7eb/6b7280?text=Pas+d%27image'
  }
  return getShopImageUrl(firstImage)
})

/**
 * Prix minimum de tous les produits de cette référence
 */
const minPrice = computed(() => {
  const allPrices = props.reference.products.flatMap((product) =>
    product.prices.map((price) => price.amount)
  )

  if (allPrices.length === 0) return null

  return Math.min(...allPrices)
})

/**
 * Prix maximum de tous les produits de cette référence
 */
const maxPrice = computed(() => {
  const allPrices = props.reference.products.flatMap((product) =>
    product.prices.map((price) => price.amount)
  )

  if (allPrices.length === 0) return null

  return Math.max(...allPrices)
})

/**
 * Affichage du prix (fourchette ou prix unique)
 */
const priceDisplay = computed(() => {
  if (minPrice.value === null || maxPrice.value === null) {
    return 'Prix non disponible'
  }

  if (minPrice.value === maxPrice.value) {
    return formatPrice(minPrice.value)
  }

  return `${formatPrice(minPrice.value)} - ${formatPrice(maxPrice.value)}`
})

/**
 * Couleur du badge de collection
 */
const collectionBadgeColor = computed(() => {
  const collectionColors: Record<string, string> = {
    or: 'yellow-500',
    argent: 'gray-400',
    patrimoine: 'blue-600',
    immobilier: 'green-600',
  }

  return collectionColors[props.reference.collectionId] || 'neutral-600'
})

/**
 * Ratio d'aspect pour les images
 * Format A4 (1/1.414) pour tous les produits
 */
const aspectRatio = computed(() => {
  return 1 / 1.414 // Format A4 (portrait)
})

/**
 * Titre décodé (enlever les entités HTML comme &nbsp;)
 */
const decodedName = computed(() => {
  return decodeHTMLEntities(props.reference.name || '')
})

/**
 * Sous-titre/description courte en texte brut (strip HTML pour la card)
 */
const subnameText = computed(() => {
  const subname = props.reference.subname || ''
  if (!subname) return 'Description non disponible'
  return stripHTML(subname)
})

/**
 * Vérifier si le produit est déjà dans le panier
 */
const isInCart = computed(() => {
  return cartStore.hasItem(Number(props.reference.id))
})

/**
 * Variant du bouton panier (outline si déjà dans le panier)
 */
const cartButtonVariant = computed(() => {
  return isInCart.value ? 'outline' : 'default'
})

/**
 * Gérer les actions
 */
const handleViewDetails = (e: Event) => {
  e.stopPropagation()
  emit('viewDetails', props.reference)
}

const handleAddToCart = (e: Event) => {
  e.stopPropagation()
  emit('addToCart', props.reference)
}
</script>

<template>
  <Card class="group shadow-none hover:shadow-md py-0 rounded-md transition-all duration-300 h-full flex flex-col gap-0">
    <!-- Image avec AspectRatio -->
    <div @click="handleViewDetails" class="relative  bg-gray-100 shrink-0 cursor-pointer">
      <AspectRatio :ratio="aspectRatio">
        <img :src="mainImage" :alt="reference.name"
          class="w-full h-full object-cover group-hover:scale-[102%] transition-transform duration-300" />
      </AspectRatio>
      
      <!-- Badge collection (overlay) -->
      <div class="absolute top-3 left-3">
        <Badge :color="collectionBadgeColor" variant="default" class="text-xs font-semibold uppercase">
          {{ reference.collectionId }}
        </Badge>
      </div>
    </div>
    
    <Separator />
    <!-- Contenu -->
    <CardContent class="p-4 flex flex-col flex-1">
      
      <!-- Contenu flexible qui pousse le bottom -->
      <div class="space-y-2 mb-3 flex-1">
        <!-- Titre (décodé HTML) -->
        <h3 class="font-bold text-base text-neutral-800 line-clamp-2">
          {{ decodedName }}
        </h3>

        <!-- Sous-titre / Description courte (subname) pour vendre -->
        <p class="text-sm text-neutral-600 line-clamp-4 leading-relaxed">
          {{ subnameText }}
        </p>

        <!-- Tags (masqués pour gagner de la place, décommenter si besoin) -->
        <!-- <div v-if="reference.tags.length > 0" class="flex flex-wrap gap-1.5">
          <div v-for="tag in reference.tags.slice(0, 2)" :key="tag"
            class="flex items-center gap-1 text-xs text-neutral-500">
            <FontAwesomeIcon v-if="icons.tag" :icon="icons.tag" class="w-3 h-3" />
            <span>{{ tag }}</span>
          </div>
          <span v-if="reference.tags.length > 2" class="text-xs text-neutral-400">
            +{{ reference.tags.length - 2 }}
          </span>
        </div> -->
      </div>

      <!-- Bloc poussé en bas (toujours aligné grâce à mt-auto) -->
      <div class="space-y-2.5 mt-auto">
        <Separator />

        <!-- Prix + CTA -->
        <div class="space-y-2">
          <div class="bg-gradient-to-r from-red-50 to-transparent rounded-md p-3 -mx-1 text-center">
            <p class="text-xs text-neutral-500 uppercase tracking-wide">Prix</p>
            <p class="font-bold text-lg text-primary">{{ priceDisplay }}</p>
          </div>

          <!-- Boutons d'action -->
          <div class="flex gap-2">
            <Button @click="handleViewDetails" variant="outline" size="sm" class="flex-1">
              <FontAwesomeIcon v-if="icons.eye" :icon="icons.eye" class="w-4 h-4" />
            </Button>
            <Button
              @click="handleAddToCart"
              :variant="cartButtonVariant"
              color="primary"
              size="sm"
              class="flex-1"
            >
              <FontAwesomeIcon v-if="icons.shoppingCart" :icon="icons.shoppingCart" class="w-4 h-4" />
            </Button>
          </div>

          <!-- Référence technique (petite indication) -->
          <p class="text-xs text-neutral-400 italic text-center">Réf: {{ reference.technicalReference }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
