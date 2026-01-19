<script setup lang="ts">
/**
 * Composant ProductCard
 * Card produit basée sur shadcn-vue Card
 */
import { computed } from 'vue'
import type { ShopReference } from '@/types/shop-api.types'
import { getShopImageUrl, formatPrice, stripHTML, decodeHTMLEntities, getFirstTagByPrefix } from '@/types/shop-api.types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { useCartStore } from '@/stores/cart.store'

export type CardSize = 'featured' | 'medium' | 'small' | 'wide'

const props = withDefaults(defineProps<{
  reference: ShopReference
  size?: CardSize
}>(), {
  size: 'medium'
})

const emit = defineEmits<{
  viewDetails: [reference: ShopReference]
  addToCart: [reference: ShopReference]
}>()

const cartStore = useCartStore()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  eye: byPrefixAndName.fas?.['eye'],
  shoppingCart: byPrefixAndName.fas?.['cart-shopping'],
  check: byPrefixAndName.fas?.['check'],
  tag: byPrefixAndName.fas?.['tag'],
}))

/**
 * Image principale
 */
const mainImage = computed(() => {
  if (props.reference.images.length === 0) {
    return 'https://placehold.co/400x600/f5f5f5/a3a3a3?text=Image'
  }
  const firstImage = props.reference.images[0]
  if (!firstImage) {
    return 'https://placehold.co/400x600/f5f5f5/a3a3a3?text=Image'
  }
  return getShopImageUrl(firstImage)
})

/**
 * Prix minimum
 */
const minPrice = computed(() => {
  const allPrices = props.reference.products.flatMap((product) =>
    product.prices.map((price) => price.amount)
  )
  if (allPrices.length === 0) return null
  return Math.min(...allPrices)
})

/**
 * Affichage du prix
 */
const priceDisplay = computed(() => {
  if (minPrice.value === null) return 'Prix N/A'
  return formatPrice(minPrice.value)
})

/**
 * Premier tag filter_ pour badge catégorie
 */
const filterTag = computed(() => {
  return getFirstTagByPrefix(props.reference.tags, 'filter')
})

/**
 * Premier tag reco_ pour badge recommandation
 */
const recoTag = computed(() => {
  return getFirstTagByPrefix(props.reference.tags, 'reco')
})

/**
 * Titre décodé
 */
const decodedName = computed(() => {
  return decodeHTMLEntities(props.reference.name || '')
})

/**
 * Description courte
 */
const shortDescription = computed(() => {
  const subname = props.reference.subname || ''
  if (!subname) return ''
  return stripHTML(subname)
})

/**
 * Dans le panier ?
 */
const isInCart = computed(() => {
  const allPriceIds = props.reference.products.flatMap((product) =>
    product.prices.map((price) => Number(price.id))
  )
  return allPriceIds.some((priceId) => cartStore.hasItem(priceId))
})

/**
 * Handlers
 */
const handleViewDetails = () => {
  emit('viewDetails', props.reference)
}

const handleAddToCart = (e: Event) => {
  e.stopPropagation()
  emit('addToCart', props.reference)
}
</script>

<template>
  <Card
    class="product-card group relative cursor-pointer border-2 border-secondary shadow-md rounded-lg py-0 gap-0 transition-all duration-500 overflow-hidden"
    @click="handleViewDetails"
  >
    <CardContent class="p-2.5 flex flex-col gap-2.5 flex-1">
      <!-- Image -->
      <div class="relative overflow-hidden rounded-lg bg-neutral-100">
        <img
          :src="mainImage"
          :alt="decodedName"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Contenu - flex-1 pour pousser prix+CTA en bas -->
      <div class="flex flex-col gap-2 flex-1">
        <!-- Badges -->
        <div class="flex flex-wrap gap-2">
          <!-- Badge catégorie (premier tag filter_) -->
          <Badge
            v-if="filterTag"
            variant="outline"
            class="border-secondary bg-white rounded-lg"
          >
            {{ filterTag.displayName }}
          </Badge>

          <!-- Badge recommandation (premier tag reco_) -->
          <Badge
            v-if="recoTag"
            variant="outline"
            class="border-secondary bg-white rounded-lg"
          >
            <FontAwesomeIcon v-if="icons.tag" :icon="icons.tag" class="size-3" />
            {{ recoTag.displayName }}
          </Badge>
        </div>

        <!-- Titre -->
        <h3 class="font-heading font-bold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-secondary-foreground transition-colors duration-500">
          {{ decodedName }}
        </h3>

        <!-- Description -->
        <p
          v-if="shortDescription"
          class="text-muted-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-secondary-foreground/80 transition-colors duration-500"
        >
          {{ shortDescription }}
        </p>
      </div>
    </CardContent>

    <CardFooter class="flex-col items-stretch gap-2.5 px-2.5 pb-2.5 mt-auto">
      <!-- Prix -->
      <p class="font-bold text-xl text-secondary group-hover:text-secondary-foreground transition-colors duration-500">
        {{ priceDisplay }}
      </p>

      <!-- Actions - gap-3 comme Figma -->
      <div class="flex items-center gap-3">

        <!-- CTA Principal : Panier (vert success, juste icône) -->
        <Button
          size="default"
          rounded="lg"
          color="success"
          class="w-full bg-success hover:bg-success/90 text-success-foreground"
          @click="handleAddToCart"
        >
          <FontAwesomeIcon
            v-if="isInCart && icons.check"
            :icon="icons.check"
            class="size-4"
          />
          <span v-else-if="icons.shoppingCart" class="flex items-center justify-center gap-2 w-full">
            <FontAwesomeIcon
              :icon="icons.shoppingCart"
              class="size-4"
            />
            <p>Ajouter au panier</p>
          </span>
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>

<style scoped>
.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    145deg,
    var(--secondary) 31%,
    color-mix(in srgb, var(--secondary) 75%, transparent) 95%
  );
  opacity: 0;
  transition: opacity 500ms ease;
  pointer-events: none;
  z-index: 0;
}

.product-card:hover::before {
  opacity: 1;
}

.product-card > :deep(*) {
  position: relative;
  z-index: 1;
}
</style>
