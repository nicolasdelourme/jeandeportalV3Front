<script setup lang="ts">
/**
 * Composant ShopSort
 * Dropdown de tri pour la boutique
 */
import { computed } from 'vue'
import { useShopStore } from '@/stores/shop.store'
import type { ShopSortOption } from '@/types/shop-api.types'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const shopStore = useShopStore()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  sort: byPrefixAndName.fas?.['arrow-down-short-wide'],
}))

/**
 * Options de tri disponibles
 */
const sortOptions: Array<{ value: ShopSortOption; label: string }> = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'name-asc', label: 'Nom (A-Z)' },
  { value: 'name-desc', label: 'Nom (Z-A)' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
]

/**
 * Option de tri active
 */
const activeSortOption = computed({
  get: () => shopStore.activeSortOption,
  set: (value: ShopSortOption) => shopStore.setSortOption(value),
})
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Icône -->
    <FontAwesomeIcon v-if="icons.sort" :icon="icons.sort" class="w-5 h-5 text-primary" />

    <!-- Select custom -->
    <select
      v-model="activeSortOption"
      class="bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer appearance-none bg-no-repeat"
      style="
        background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e');
        background-position: right 0.5rem center;
        background-size: 1.5em 1.5em;
      "
    >
      <option v-for="option in sortOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
