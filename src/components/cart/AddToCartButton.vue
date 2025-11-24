<script setup lang="ts">
/**
 * Bouton réutilisable "Ajouter au panier"
 * Gère l'ajout avec feedback visuel et support des quantités
 */
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { CartError } from '@/types/cart.types'

interface Props {
  /** ID de la référence produit */
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
 * Vérifie si le produit est dans le panier
 */
const isInCart = computed(() => cartStore.hasItem(props.referenceId))
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
