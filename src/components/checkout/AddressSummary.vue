<script setup lang="ts">
/**
 * AddressSummary - Affichage formaté d'une adresse
 */
import type { UserAddress } from '@/types/auth.types'

defineProps<{
  address: UserAddress | undefined
  label: string
}>()

function formatAddress(addr: UserAddress | undefined): string {
  if (!addr) return ''
  const parts = [addr.line1]
  if (addr.line2) parts.push(addr.line2)
  parts.push(`${addr.zipcode} ${addr.city}`)
  return parts.join(', ')
}
</script>

<template>
  <div>
    <p class="text-sm font-medium text-neutral-500 mb-1">{{ label }}</p>
    <p class="text-sm">{{ formatAddress(address) }}</p>
  </div>
</template>
