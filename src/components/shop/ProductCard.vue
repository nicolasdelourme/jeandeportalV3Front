<script setup lang="ts">

import { computed } from 'vue'
import type { ShopReference } from '@/types/shop-api.types'
import { getShopImageUrl, formatPrice, stripHTML, decodeHTMLEntities, getFirstTagByPrefix } from '@/types/shop-api.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { useCartStore } from '@/stores/cart.store'
import { cn } from '@/lib/utils'

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
  <div
    class="product-card group relative bg-white rounded-sm overflow-hidden cursor-pointer border-2 border-primary shadow-md transition-all duration-500"
    @click="handleViewDetails"
  >
    <!-- Inner content avec padding 10px comme Figma -->
    <div class="p-2.5 flex flex-col gap-2.5 h-full">
      <!-- Image -->
      <div class="relative overflow-hidden rounded-sm bg-neutral-100">
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
            rounded="sm"
            class="text-xs font-semibold border-primary bg-secondary text-foreground px-2 py-0.5"
          >
            {{ filterTag.displayName }}
          </Badge>

          <!-- Badge recommandation (premier tag reco_) -->
          <Badge
            v-if="recoTag"
            variant="outline"
            rounded="sm"
            class="text-xs font-semibold border-primary bg-secondary text-foreground px-2 py-0.5 gap-1.5"
          >
            <FontAwesomeIcon v-if="icons.tag" :icon="icons.tag" class="size-3" />
            {{ recoTag.displayName }}
          </Badge>
        </div>

        <!-- Titre -->
        <h3 class="font-heading font-bold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary-foreground transition-colors duration-500">
          {{ decodedName }}
        </h3>

        <!-- Description -->
        <p
          v-if="shortDescription"
          class="text-muted-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-primary-foreground/80 transition-colors duration-500"
        >
          {{ shortDescription }}
        </p>
      </div>

      <!-- Prix + Actions - toujours en bas -->
      <div class="mt-auto space-y-2.5">
        <!-- Prix -->
        <p class="font-bold text-xl text-primary group-hover:text-primary-foreground transition-colors duration-500">
          {{ priceDisplay }}
        </p>

        <!-- Actions - gap-3 comme Figma -->
        <div class="flex items-center gap-3">
          <!-- CTA Secondaire : En savoir plus (outline → secondary au hover card) -->
          <Button
            variant="outline"
            size="default"
            rounded="sm"
            class="flex-1 group-hover:bg-white group-hover:border-border group-hover:text-secondary-foreground transition-all duration-500"
            @click.stop="handleViewDetails"
          >
            En savoir +
          </Button>

          <!-- CTA Principal : Panier (vert success, juste icône) -->
          <Button
            size="default"
            rounded="sm"
            class="shrink-0 bg-success hover:bg-success/90 text-success-foreground"
            @click="handleAddToCart"
          >
            <FontAwesomeIcon
              v-if="isInCart && icons.check"
              :icon="icons.check"
              class="size-4"
            />
            <FontAwesomeIcon
              v-else-if="icons.shoppingCart"
              :icon="icons.shoppingCart"
              class="size-4"
            />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    145deg,
    var(--primary) 31%,
    color-mix(in srgb, var(--primary) 75%, transparent) 95%
  );
  opacity: 0;
  transition: opacity 500ms ease;
  pointer-events: none;
  z-index: 0;
}

.product-card:hover::before {
  opacity: 1;
}

.product-card > * {
  position: relative;
  z-index: 1;
}
</style>
