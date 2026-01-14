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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

/**
 * Label de l'option active
 */
const activeLabel = computed(() => {
  const option = sortOptions.find((o) => o.value === activeSortOption.value)
  return option?.label ?? 'Trier'
})

/**
 * Gestion du changement de valeur
 */
const handleValueChange = (value: string | number | bigint | boolean | Record<string, string> | null) => {
  if (typeof value === 'string') {
    activeSortOption.value = value as ShopSortOption
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Icône -->
    <FontAwesomeIcon v-if="icons.sort" :icon="icons.sort" class="w-5 h-5 text-primary" />

    <!-- Select shadcn-vue -->
    <Select :model-value="activeSortOption" @update:model-value="handleValueChange">
      <SelectTrigger class="w-[180px]">
        <SelectValue :placeholder="activeLabel" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in sortOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
