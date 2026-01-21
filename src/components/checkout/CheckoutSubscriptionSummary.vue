<script setup lang="ts">
/**
 * CheckoutSubscriptionSummary - Resume de l'abonnement OneClick
 * Affiche le plan selectionne avec ses details
 */
import { computed } from 'vue'
import type { OneClickBasketItem } from '@/types/oneclick-basket.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  item: OneClickBasketItem
  totalPrice: number
}>()

const icons = computed(() => ({
  star: byPrefixAndName.fas?.['star'],
  clock: byPrefixAndName.fas?.['clock'],
  creditCard: byPrefixAndName.fas?.['credit-card'],
  checkCircle: byPrefixAndName.fas?.['check-circle'],
}))

/**
 * Formatage du prix
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

/**
 * Label de l'intervalle
 */
const intervalLabel = computed(() => {
  return props.item.interval === 'monthly' ? '/mois' : '/an'
})

/**
 * Couleur du theme
 */
const defaultColors = {
  bg: 'bg-[var(--color-theme-metaux-light)]',
  border: 'border-[var(--color-theme-metaux)]',
  text: 'text-[var(--color-theme-metaux-dark)]',
}

const themeColors = computed(() => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    metaux: {
      bg: 'bg-[var(--color-theme-metaux-light)]',
      border: 'border-[var(--color-theme-metaux)]',
      text: 'text-[var(--color-theme-metaux-dark)]',
    },
    portefeuille: {
      bg: 'bg-[var(--color-theme-portefeuille-light)]',
      border: 'border-[var(--color-theme-portefeuille)]',
      text: 'text-[var(--color-theme-portefeuille-dark)]',
    },
    liberte: {
      bg: 'bg-[var(--color-theme-liberte-light)]',
      border: 'border-[var(--color-theme-liberte)]',
      text: 'text-[var(--color-theme-liberte-dark)]',
    },
    bonus: {
      bg: 'bg-neutral-100',
      border: 'border-neutral-800',
      text: 'text-neutral-800',
    },
  }
  return colors[props.item.theme] ?? defaultColors
})
</script>

<template>
  <Card class="sticky top-24">
    <CardHeader>
      <CardTitle>Votre abonnement</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Plan selectionne -->
      <div
        class="p-4 rounded-lg border-2"
        :class="[themeColors.bg, themeColors.border]"
      >
        <!-- Badge theme -->
        <p
          class="mb-3 underline font-semibold"
        >
          {{ item.oneClickName }}
        </p>

        <!-- Nom du plan -->
        <h3 class="font-heading font-bold text-lg text-foreground mb-2">
          {{ item.name }}
        </h3>

        <!-- Description -->
        <p class="text-sm text-muted-foreground mb-4">
          {{ item.description }}
        </p>

        <!-- Details -->
        <div class="space-y-2 text-sm">
          <!-- Periode d'essai -->
          <div v-if="item.trialDays > 0" class="flex items-center gap-2 text-success">
            <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="h-4 w-4" />
            <span>{{ item.trialDays }} jours d'essai gratuit</span>
          </div>

          <!-- Frequence -->
          <div class="flex items-center gap-2 text-muted-foreground">
            <FontAwesomeIcon v-if="icons.creditCard" :icon="icons.creditCard" class="h-4 w-4" />
            <span>Facturation {{ item.interval === 'monthly' ? 'mensuelle' : 'annuelle' }}</span>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Recapitulatif prix -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span>Abonnement</span>
          <span>{{ formatPrice(item.price) }}{{ intervalLabel }}</span>
        </div>

        <div v-if="item.trialDays > 0" class="flex justify-between text-sm text-success">
          <span>Essai gratuit</span>
          <span>{{ item.trialDays }} jours</span>
        </div>

        <Separator />

        <div class="flex justify-between font-bold text-lg">
          <span>A payer aujourd'hui</span>
          <span class="text-secondary">
            {{ item.trialDays > 0 ? formatPrice(0) : formatPrice(totalPrice) }}
          </span>
        </div>

        <p v-if="item.trialDays > 0" class="text-xs text-muted-foreground">
          Premier prelevement de {{ formatPrice(totalPrice) }} apres {{ item.trialDays }} jours
        </p>
      </div>

      <!-- Note -->
      <div class="pt-2 border-t border-border">
        <p class="text-xs text-muted-foreground flex items-start gap-2">
          <FontAwesomeIcon
            v-if="icons.checkCircle"
            :icon="icons.checkCircle"
            class="h-3 w-3 mt-0.5 text-success shrink-0"
          />
          <span>Sans engagement. Annulez a tout moment depuis votre espace membre.</span>
        </p>
      </div>
    </CardContent>
  </Card>
</template>
