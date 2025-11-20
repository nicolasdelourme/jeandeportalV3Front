<script setup lang="ts">
/**
 * Bouton réutilisable "Ajouter au panier"
 * Gère l'ajout avec feedback visuel (items uniques)
 */
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { toast } from 'vue-sonner'
import { CartError } from '@/types/cart.types'
import type { CartItem } from '@/types/cart.types'

interface Props {
  product: CartItem
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
  showIcon?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  fullWidth: false,
  showIcon: true,
  disabled: false,
})

const cartStore = useCartStore()
const isAdding = ref(false)

const icons = computed(() => ({
  cartPlus: byPrefixAndName.fas?.['cart-plus'],
  check: byPrefixAndName.fas?.['check'],
}))

/**
 * Ajoute le produit au panier
 */
async function addToCart() {
  if (isAdding.value || props.disabled) return

  isAdding.value = true

  try {
    cartStore.addItem(props.product)

    // Feedback visuel de succès
    toast.success(`${props.product.name} ajouté au panier`)

    // Animation de succès
    setTimeout(() => {
      isAdding.value = false
    }, 1000)
  } catch (error) {
    if (error instanceof CartError) {
      toast.error(error.message)
    } else {
      toast.error('Impossible d\'ajouter au panier')
    }
    isAdding.value = false
  }
}

/**
 * Vérifie si le produit est dans le panier
 */
const isInCart = computed(() => cartStore.hasItem(props.product.id))
</script>

<template>
  <Button
    @click="addToCart"
    :variant="variant"
    color="primary"
    :size="size"
    :disabled="disabled || isAdding"
    :class="{ 'w-full': fullWidth }"
    class="relative"
  >
    <!-- Icône et texte selon l'état -->
    <template v-if="!isAdding">
      <FontAwesomeIcon
        v-if="showIcon && icons.cartPlus"
        :icon="icons.cartPlus"
        class="h-4 w-4 mr-2"
      />
      <span style="font-family: Roboto, sans-serif;">
        <slot>Ajouter au panier</slot>
      </span>
    </template>

    <!-- État d'ajout (animation) -->
    <template v-else>
      <FontAwesomeIcon
        v-if="icons.check"
        :icon="icons.check"
        class="h-4 w-4 mr-2 animate-bounce"
      />
      <span style="font-family: Roboto, sans-serif;">Ajouté !</span>
    </template>

    <!-- Indicateur visuel si déjà dans le panier -->
    <span
      v-if="isInCart && !isAdding"
      class="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
      title="Déjà dans le panier"
    />
  </Button>
</template>
