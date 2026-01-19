<script setup lang="ts">
/**
 * Composant ShopSearchBar
 * Barre de recherche pour la boutique
 */
import { ref, watch, computed } from 'vue'
import { useShopStore } from '@/stores/shop.store'
import { Input } from '@/components/ui/input'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const shopStore = useShopStore()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  search: byPrefixAndName.fas?.['magnifying-glass'],
  times: byPrefixAndName.fas?.['times'],
}))

/**
 * Valeur locale de recherche (pour le debounce)
 */
const localSearchQuery = ref(shopStore.searchQuery)

/**
 * Watcher pour mettre à jour le store avec un léger délai (debounce)
 */
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(localSearchQuery, (newValue) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  debounceTimeout = setTimeout(() => {
    shopStore.setSearchQuery(newValue)
  }, 300)
})

/**
 * Effacer la recherche
 */
const clearSearch = () => {
  localSearchQuery.value = ''
  shopStore.setSearchQuery('')
}
</script>

<template>
  <div class="relative">
    <!-- Icône recherche (gauche) -->
    <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
      <FontAwesomeIcon
        v-if="icons.search"
        :icon="icons.search"
        class="w-5 h-5 text-neutral-400"
      />
    </div>

    <!-- Input de recherche shadcn -->
    <Input
      v-model="localSearchQuery"
      type="text"
      placeholder="Rechercher un produit, une référence..."
      class="w-full pl-12 pr-12 py-6 text-base"
    />

    <!-- Bouton clear (droite) - visible uniquement si recherche active -->
    <button
      v-if="localSearchQuery.trim()"
      @click="clearSearch"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors z-10"
    >
      <FontAwesomeIcon v-if="icons.times" :icon="icons.times" class="w-5 h-5" />
    </button>
  </div>
</template>
