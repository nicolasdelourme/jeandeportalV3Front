<script setup lang="ts">
/**
 * CheckoutShopSummary - Résumé de commande boutique
 * Affiche la liste des articles et les totaux
 */
import type { CartItem } from '@/types/cart.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

defineProps<{
  items: CartItem[]
  subtotalExclVAT: number
  vatAmount: number
  totalPrice: number
  title: string
}>()

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}
</script>

<template>
  <Card class="sticky top-24">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Liste des articles -->
      <div class="space-y-3">
        <div v-for="item in items" :key="item.itemId" class="flex gap-3">
          <div class="w-12 h-12 shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
            <img
              v-if="item.images?.[0]"
              :src="item.images[0]"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ item.name }}</p>
            <p class="text-sm text-neutral-500">Qté: {{ item.quantity }}</p>
          </div>
          <p class="text-sm font-medium">
            {{ formatPrice(item.price * item.quantity) }}
          </p>
        </div>
      </div>

      <Separator />

      <!-- Totaux -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span>Sous-total HT</span>
          <span>{{ formatPrice(subtotalExclVAT) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>TVA</span>
          <span>{{ formatPrice(vatAmount) }}</span>
        </div>
        <Separator />
        <div class="flex justify-between font-bold text-lg">
          <span>Total TTC</span>
          <span class="text-secondary">{{ formatPrice(totalPrice) }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
