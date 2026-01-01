<script setup lang="ts">
/**
 * StickyCart - CTA sticky mobile pour la fiche produit
 *
 * Affiche le prix et le bouton d'ajout au panier
 * Apparaît en bas de l'écran sur mobile quand la sidebar n'est pas visible
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { formatPrice } from '@/types/shop-api.types'

interface Props {
  price: number | null
  productName: string
  isInCart?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isInCart: false,
  disabled: false,
})

const emit = defineEmits<{
  addToCart: []
}>()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  shoppingCart: byPrefixAndName.fas?.['cart-shopping'],
  check: byPrefixAndName.fas?.['check'],
}))

/**
 * Prix formaté
 */
const formattedPrice = computed(() => {
  if (props.price === null) return 'Prix non disponible'
  return formatPrice(props.price)
})

/**
 * Texte du bouton
 */
const buttonText = computed(() => {
  if (props.isInCart) return 'Dans le panier'
  return 'Ajouter au panier'
})
</script>

<template>
  <!-- CTA Sticky visible uniquement sur mobile -->
  <div class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-border shadow-lg safe-area-pb">
    <div class="flex items-center gap-4 p-4">
      <!-- Prix -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-muted-foreground truncate">{{ productName }}</p>
        <p class="font-bold text-xl text-foreground">{{ formattedPrice }}</p>
      </div>

      <!-- Bouton CTA -->
      <Button
        :disabled="disabled || price === null"
        :variant="isInCart ? 'outline' : 'default'"
        size="lg"
        class="shrink-0 gap-2 rounded-sm bg-success hover:bg-success/90 text-success-foreground"
        @click="emit('addToCart')"
      >
        <FontAwesomeIcon
          v-if="isInCart && icons.check"
          :icon="icons.check"
          class="w-4 h-4"
        />
        <FontAwesomeIcon
          v-else-if="icons.shoppingCart"
          :icon="icons.shoppingCart"
          class="w-4 h-4"
        />
        {{ buttonText }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* Safe area pour les appareils avec encoche */
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
