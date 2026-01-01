<script setup lang="ts">
/**
 * FormatSelector - Sélection du format PDF/Print
 *
 * Affiche les formats disponibles sous forme de cards cliquables
 * avec indication claire du prix et du type de livraison
 */
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { ShopProduct, ShopPrice } from '@/types/shop-api.types'
import { formatPrice } from '@/types/shop-api.types'

interface Props {
  products: ShopProduct[]
  selectedProductId?: string
  selectedPriceId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectProduct: [product: ShopProduct]
  selectPrice: [price: ShopPrice]
}>()

/**
 * Icônes FontAwesome
 */
const icons = {
  filePdf: byPrefixAndName.fas?.['file-pdf'],
  book: byPrefixAndName.fas?.['book'],
  download: byPrefixAndName.fas?.['download'],
  truck: byPrefixAndName.fas?.['truck'],
  check: byPrefixAndName.fas?.['check'],
}

/**
 * Détecter le type de format (PDF ou Print) basé sur le nom du produit
 */
const getFormatType = (product: ShopProduct): 'pdf' | 'print' => {
  const name = product.name.toLowerCase()
  if (name.includes('pdf') || name.includes('numérique') || name.includes('digital')) {
    return 'pdf'
  }
  return 'print'
}

/**
 * Sélectionner un produit et son premier prix
 */
const handleSelectProduct = (product: ShopProduct) => {
  emit('selectProduct', product)
  if (product.prices.length > 0 && product.prices[0]) {
    emit('selectPrice', product.prices[0])
  }
}
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
      Format
    </p>

    <div class="grid grid-cols-1 gap-3">
      <Card
        v-for="product in products"
        :key="product.id"
        :class="cn(
          'relative cursor-pointer transition-all duration-200 p-4 rounded-sm',
          'border-2 hover:border-primary/50',
          selectedProductId === product.id
            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
            : 'border-border hover:bg-muted/30'
        )"
        @click="handleSelectProduct(product)"
      >
        <!-- Indicateur de sélection -->
        <div
          v-if="selectedProductId === product.id"
          class="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
        >
          <FontAwesomeIcon
            v-if="icons.check"
            :icon="icons.check"
            class="w-3 h-3 text-white"
          />
        </div>

        <div class="flex items-start gap-4">
          <!-- Icône format PDF -->
          <div
            v-if="getFormatType(product) === 'pdf'"
            class="w-12 h-12 rounded-sm flex items-center justify-center shrink-0 bg-blue-100 text-blue-600"
          >
            <FontAwesomeIcon
              v-if="icons.filePdf"
              :icon="icons.filePdf"
              class="w-6 h-6"
            />
          </div>

          <!-- Icône format Print -->
          <div
            v-else
            class="w-12 h-12 rounded-sm flex items-center justify-center shrink-0 bg-amber-100 text-amber-600"
          >
            <FontAwesomeIcon
              v-if="icons.book"
              :icon="icons.book"
              class="w-6 h-6"
            />
          </div>

          <!-- Infos format -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-semibold text-foreground">
                {{ product.name }}
              </h4>
              <Badge
                v-if="getFormatType(product) === 'pdf'"
                variant="outline"
                class="text-xs"
              >
                Instant
              </Badge>
            </div>

            <!-- Livraison PDF -->
            <p
              v-if="getFormatType(product) === 'pdf'"
              class="text-sm text-muted-foreground flex items-center gap-1.5"
            >
              <FontAwesomeIcon
                v-if="icons.download"
                :icon="icons.download"
                class="w-3.5 h-3.5"
              />
              Téléchargement immédiat
            </p>

            <!-- Livraison Print -->
            <p
              v-else
              class="text-sm text-muted-foreground flex items-center gap-1.5"
            >
              <FontAwesomeIcon
                v-if="icons.truck"
                :icon="icons.truck"
                class="w-3.5 h-3.5"
              />
              Livraison 2-5 jours
            </p>
          </div>

          <!-- Prix -->
          <div class="text-right shrink-0">
            <p class="font-bold text-lg text-foreground">
              {{ product.prices[0] ? formatPrice(product.prices[0].amount) : 'N/A' }}
            </p>
            <p class="text-xs text-muted-foreground">TTC</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
