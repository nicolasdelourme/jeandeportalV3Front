<script setup lang="ts">
/**
 * Bouton réutilisable "Ajouter au panier"
 * Gère l'ajout avec feedback visuel et support des quantités
 */
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { CartError } from '@/types/cart.types'

interface Props {
  /** ID de la référence produit (reference_array[].id du catalogue) */
  referenceId: number
  /** Nom du produit (pour feedback visuel optionnel) */
  productName?: string
  /** Quantité à ajouter (défaut: 1) */
  quantity?: number
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
  showIcon?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  quantity: 1,
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
 * Ajoute le produit au panier via l'API backend
 */
async function addToCart() {
  if (isAdding.value || props.disabled) return

  isAdding.value = true

  try {
    // Appel API backend (toast géré par le store)
    await cartStore.addItem(props.referenceId, props.quantity)

    // Animation de succès
    setTimeout(() => {
      isAdding.value = false
    }, 1000)
  } catch (error) {
    // Le store gère déjà l'affichage de l'erreur via toast
    isAdding.value = false
  }
}

/**
 * Note: La vérification isInCart est désactivée car le panier stocke les priceId
 * et non les referenceId. Pour activer cette fonctionnalité, il faudrait mapper
 * les referenceId aux priceId du catalogue.
 */
const isInCart = computed(() => false)
</script>

<template>
  <Button
    class="relative"
    :class="{ 'w-full': fullWidth }"
    :disabled="disabled || isAdding"
    :size="size"
    color="primary"
    :variant="variant"
    @click="addToCart"
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
    ></span>
  </Button>
</template>
