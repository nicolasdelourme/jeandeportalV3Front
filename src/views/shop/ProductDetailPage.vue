<script setup lang="ts">
/**
 * Page ProductDetailPage
 * Layout 3 colonnes style Amazon/Figma:
 * - Gauche: Image produit (sticky sur desktop)
 * - Centre: Contenu (titre, description, tags)
 * - Droite: Sidebar sticky (prix, format, CTA)
 * - Mobile: Layout vertical avec sticky CTA en bas
 */
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useShopStore } from '@/stores/shop.store'
import { useCartStore } from '@/stores/cart.store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import FormatSelector from '@/components/shop/FormatSelector.vue'
import StickyCart from '@/components/shop/StickyCart.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { formatPrice, decodeHTMLEntities, sanitizeHTML, getShopImageUrl, getDisplayTags, getFirstTagByPrefix } from '@/types/shop-api.types'
import type { ShopProduct, ShopPrice, ParsedTag } from '@/types/shop-api.types'
import { toast } from 'vue-sonner'
import { CartError } from '@/types/cart.types'

const router = useRouter()
const route = useRoute()
const shopStore = useShopStore()
const cartStore = useCartStore()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  shoppingCart: byPrefixAndName.fas?.['cart-shopping'],
  tag: byPrefixAndName.fas?.['tag'],
  truck: byPrefixAndName.fas?.['truck'],
  shield: byPrefixAndName.fas?.['shield-check'],
  share: byPrefixAndName.fas?.['share-nodes'],
  heart: byPrefixAndName.far?.['heart'],
  heartSolid: byPrefixAndName.fas?.['heart'],
  check: byPrefixAndName.fas?.['check'],
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  star: byPrefixAndName.fas?.['star'],
  creditCard: byPrefixAndName.fas?.['credit-card'],
  coins: byPrefixAndName.fas?.['coins'],
  lock: byPrefixAndName.fas?.['lock'],
  undo: byPrefixAndName.fas?.['undo'],
}))

/**
 * ID de la référence depuis l'URL
 */
const referenceId = computed(() => route.params.ref as string)

/**
 * Référence produit
 */
const reference = computed(() => shopStore.findReferenceById(referenceId.value))

/**
 * Produit et prix sélectionnés
 */
const selectedProduct = ref<ShopProduct | null>(null)
const selectedPrice = ref<ShopPrice | null>(null)

/**
 * Prix sélectionné (montant)
 */
const selectedPriceAmount = computed(() => {
  return selectedPrice.value?.amount ?? null
})

/**
 * Prix sélectionné formaté
 */
const selectedPriceDisplay = computed(() => {
  if (!selectedPrice.value) return null
  return formatPrice(selectedPrice.value.amount)
})

/**
 * Charger la référence au montage
 */
onMounted(async () => {
  document.title = 'Éditions Jean de Portal : Produit'

  await shopStore.fetchCatalog()

  if (reference.value && reference.value.products.length > 0) {
    const firstProduct = reference.value.products[0]
    if (firstProduct) {
      selectedProduct.value = firstProduct
      if (firstProduct.prices.length > 0) {
        selectedPrice.value = firstProduct.prices[0] ?? null
      }
    }

    document.title = `Éditions Jean de Portal : ${decodeHTMLEntities(reference.value.name)}`
  }
})

/**
 * État du wishlist/favoris
 */
const isFavorite = ref(false)

/**
 * État du partage
 */
const showShareMenu = ref(false)

/**
 * Actions
 */
const handleBack = () => {
  router.push('/boutique')
}

const handleAddToCart = async () => {
  if (!reference.value || !selectedProduct.value) {
    toast.error('Produit non trouvé')
    return
  }

  try {
    await cartStore.addItem(Number(selectedProduct.value.id))
    toast.success(`${decodeHTMLEntities(reference.value.name)} ajouté au panier`)
  } catch (error) {
    if (error instanceof CartError) {
      toast.error(error.message)
    } else {
      toast.error('Impossible d\'ajouter au panier')
    }
  }
}

const handleDirectPurchase = async () => {
  if (!reference.value || !selectedProduct.value) {
    toast.error('Produit non trouvé')
    return
  }

  try {
    // Ajouter au panier si pas déjà présent
    if (!isInCart.value) {
      await cartStore.addItem(Number(selectedProduct.value.id))
    }
    // Rediriger vers le checkout
    router.push('/commander')
  } catch (error) {
    if (error instanceof CartError) {
      toast.error(error.message)
    } else {
      toast.error('Impossible de commander')
    }
  }
}

const selectProduct = (product: ShopProduct) => {
  selectedProduct.value = product
}

const selectPrice = (price: ShopPrice) => {
  selectedPrice.value = price
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const handleShare = async () => {
  if (navigator.share && reference.value) {
    try {
      await navigator.share({
        title: decodeHTMLEntities(reference.value.name),
        text: reference.value.subname,
        url: window.location.href,
      })
    } catch (err) {
      console.log('Partage annulé')
    }
  } else {
    navigator.clipboard.writeText(window.location.href)
    showShareMenu.value = true
    setTimeout(() => {
      showShareMenu.value = false
    }, 2000)
  }
}

/**
 * Vérifie si le produit est déjà dans le panier
 */
const isInCart = computed(() => {
  if (!selectedProduct.value?.prices[0]?.id) return false
  return cartStore.hasItem(Number(selectedProduct.value.prices[0].id))
})

/**
 * Titre décodé (sans entités HTML)
 */
const decodedName = computed(() => {
  if (!reference.value) return ''
  return decodeHTMLEntities(reference.value.name)
})

/**
 * Image principale du produit
 */
const mainImage = computed(() => {
  if (!reference.value || reference.value.images.length === 0) {
    return 'https://placehold.co/400x600/e5e7eb/6b7280?text=Pas+d%27image'
  }
  const firstImage = reference.value.images[0]
  if (!firstImage) {
    return 'https://placehold.co/400x600/e5e7eb/6b7280?text=Pas+d%27image'
  }
  return getShopImageUrl(firstImage)
})

/**
 * Sous-titre/subname HTML nettoyé pour affichage
 */
const sanitizedSubname = computed(() => {
  if (!reference.value) return ''
  let html = sanitizeHTML(reference.value.subname)

  html = html.replace(/<p>\s*<strong>Caractéristiques<\/strong>\s*<\/p>/gi, '')
  html = html.replace(/<p>Niveau[^<]*★[^<]*<\/p>/gi, '')
  html = html.replace(/\bAuteurs?\b(?=\s*(&nbsp;)*\s*:)/gi, '<strong>$&</strong>')
  html = html.replace(/\bParution\b(?=\s*(&nbsp;)*\s*:)/gi, '<strong>Parution</strong>')
  html = html.replace(/\bNombre de pages\b(?=\s*(&nbsp;)*\s*:)/gi, '<strong>Nombre de pages</strong>')

  return html
})

/**
 * Description HTML nettoyée pour affichage
 */
const sanitizedDescription = computed(() => {
  if (!reference.value) return ''
  return sanitizeHTML(reference.value.description)
})

/**
 * Premier tag filter_ pour le badge catégorie
 */
const filterTag = computed(() => {
  if (!reference.value) return null
  return getFirstTagByPrefix(reference.value.tags, 'filter')
})

/**
 * Tags d'affichage (tab_, et autres sauf filter_ et reco_)
 */
const displayTags = computed((): ParsedTag[] => {
  if (!reference.value) return []
  return getDisplayTags(reference.value.tags)
})
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-background">
      <!-- État de chargement -->
      <div v-if="shopStore.isLoading" class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr_340px] gap-6 lg:gap-10">
          <!-- Skeleton image -->
          <div>
            <Skeleton class="w-full aspect-2/3 rounded-lg" />
            <div class="hidden lg:flex gap-2 mt-3">
              <Skeleton v-for="i in 4" :key="i" class="w-14 h-14 rounded-lg" />
            </div>
          </div>
          <!-- Skeleton contenu -->
          <div class="space-y-6">
            <Skeleton class="h-6 w-24 rounded-sm" />
            <Skeleton class="h-10 w-3/4" />
            <Skeleton class="h-4 w-32" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-2/3" />
            </div>
          </div>
          <!-- Skeleton sidebar -->
          <div>
            <Skeleton class="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Produit non trouvé -->
      <div v-else-if="!reference" class="flex items-center justify-center min-h-[60vh]">
        <div class="max-w-md mx-auto px-4">
          <Alert variant="destructive">
            <FontAwesomeIcon v-if="icons.shield" :icon="icons.shield" class="size-4" />
            <AlertTitle>Produit introuvable</AlertTitle>
            <AlertDescription class="mt-2">
              Ce produit n'existe pas ou a été supprimé.
              <div class="mt-4">
                {# <Button size="sm" variant="outline" @click="handleBack"> #}
                  Retour à la boutique
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <!-- Contenu produit -->
      <template v-else>
        <!-- Header avec breadcrumb/retour -->
        <div class="border-b">
          <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
            <Button
              variant="ghost"
              size="sm"
              class="gap-2 text-muted-foreground hover:text-foreground -ml-2"
              @click="handleBack"
            >
              <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="w-3.5 h-3.5" />
              Retour à la boutique
            </Button>
          </div>
        </div>

        <!-- Layout 3 colonnes -->
        <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
          <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr_340px] gap-6 lg:gap-10">

            <!-- Colonne gauche: Image produit (sticky sur desktop) -->
            <div class="lg:sticky lg:top-24 lg:self-start">
              <!-- Image principale -->
              <div class="bg-neutral-50 rounded-lg overflow-hidden border">
                <AspectRatio :ratio="2/3">
                  <img
                    :src="mainImage"
                    :alt="decodedName"
                    class="w-full h-full object-contain"
                  />
                </AspectRatio>
              </div>

              <!-- Miniatures si plusieurs images (desktop) -->
              <div v-if="reference.images.length > 1" class="hidden lg:flex gap-2 mt-3">
                <button
                  v-for="(image, index) in reference.images.slice(0, 4)"
                  :key="index"
                  class="w-14 h-14 rounded-lg overflow-hidden border-2 transition-all"
                  :class="index === 0 ? 'border-primary' : 'border-transparent hover:border-neutral-300'"
                >
                  <img
                    :src="getShopImageUrl(image)"
                    :alt="`${decodedName} - ${index + 1}`"
                    class="w-full h-full object-contain bg-neutral-50"
                  />
                </button>
              </div>
            </div>

            <!-- Colonne centrale: Contenu -->
            <div class="space-y-6">
              <!-- Header avec badge catégorie -->
              <div>
                <Badge
                  v-if="filterTag"
                  variant="default"
                  color="primary"
                  class="text-xs font-semibold uppercase tracking-wider mb-3"
                >
                  {{ filterTag.displayName }}
                </Badge>

                <!-- Titre -->
                <h1 class="font-heading font-bold text-2xl md:text-3xl text-foreground leading-tight mb-2">
                  {{ decodedName }}
                </h1>

                <!-- Référence -->
                <p class="text-sm text-muted-foreground">
                  Réf: {{ reference.technicalReference }}
                </p>
              </div>

              <!-- Accroche / Pitch -->
              <div
                v-if="reference.subname"
                class="prose prose-sm max-w-none bg-muted/50 border-l-4 border-primary p-4 rounded-r-sm"
                v-html="sanitizedSubname"
              ></div>

              <!-- Description détaillée -->
              <div class="space-y-3">
                <h2 class="font-semibold text-lg text-foreground">
                  Description
                </h2>
                <div
                  class="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                  v-html="sanitizedDescription"
                ></div>
              </div>

              <!-- Tags thématiques (tab_, etc.) -->
              <div v-if="displayTags.length > 0">
                <Separator class="mb-4" />
                <div class="space-y-3">
                  <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thématiques
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <Badge
                      v-for="tag in displayTags"
                      :key="tag.raw"
                      variant="outline"
                      class="text-sm rounded-lg"
                    >
                      <FontAwesomeIcon v-if="icons.tag" :icon="icons.tag" class="w-3 h-3 mr-1.5" />
                      {{ tag.displayName }}
                    </Badge>
                  </div>
                </div>
              </div>

              <!-- Actions secondaires (Favoris + Partage) -->
              <div class="flex gap-3 pt-4">
                <Button class="gap-2 rounded-lg hover:bg-secondary hover:border-secondary" size="sm" color="secondary" variant="outline" @click="toggleFavorite">
                  <FontAwesomeIcon
                    v-if="isFavorite && icons.heartSolid"
                    :icon="icons.heartSolid"
                    class="w-4 h-4 text-red-500"
                  />
                  <FontAwesomeIcon
                    v-else-if="icons.heart"
                    :icon="icons.heart"
                    class="w-4 h-4"
                  />
                  {{ isFavorite ? 'Favori' : 'Ajouter aux favoris' }}
                </Button>
                <TooltipProvider>
                  <Tooltip :open="showShareMenu">
                    <TooltipTrigger as-child>
                      <Button class="gap-2 rounded-lg hover:bg-secondary hover:border-secondary" size="sm" color="secondary" variant="outline" @click="handleShare">
                        <FontAwesomeIcon v-if="icons.share" :icon="icons.share" class="w-4 h-4" />
                        Partager
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" class="bg-green-600 text-white border-green-600">
                      Lien copié !
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <!-- Colonne droite: Sidebar sticky -->
            <div class="lg:sticky lg:top-24 lg:self-start space-y-4">
              <Card class="border shadow-sm rounded-lg">
                <CardContent class="p-5 space-y-5">
                  <!-- Prix principal -->
                  <div>
                    <p class="text-4xl font-bold text-foreground">
                      {{ selectedPriceDisplay || 'Non disponible' }}
                    </p>
                    <p class="text-sm text-muted-foreground mt-1">TTC</p>
                  </div>

                  <!-- Sélection format (si plusieurs produits) -->
                  <div v-if="reference.products.length > 1">
                    <Separator class="my-4" />
                    <FormatSelector
                      :products="reference.products"
                      :selected-product-id="selectedProduct?.id"
                      :selected-price-id="selectedPrice?.id"
                      @select-product="selectProduct"
                      @select-price="selectPrice"
                    />
                  </div>

                  <Separator />

                  <!-- Options de paiement -->
                  <div class="space-y-2">
                    <button class="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                      <FontAwesomeIcon v-if="icons.creditCard" :icon="icons.creditCard" class="w-5 h-5 text-muted-foreground" />
                      <div class="flex-1">
                        <p class="text-sm font-medium">Paiement classique</p>
                        <p class="text-xs text-muted-foreground">CB, PayPal, virement</p>
                      </div>
                      <div class="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                        <div class="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                    </button>
                    <button class="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left opacity-60">
                      <FontAwesomeIcon v-if="icons.coins" :icon="icons.coins" class="w-5 h-5 text-muted-foreground" />
                      <div class="flex-1">
                        <p class="text-sm font-medium">Payer en Points</p>
                        <p class="text-xs text-muted-foreground">Solde: 0 pts</p>
                      </div>
                      <div class="w-4 h-4 rounded-full border-2 border-neutral-300"></div>
                    </button>
                  </div>

                  <!-- Boutons CTA (masqués sur mobile) -->
                  <div class="hidden md:flex flex-col gap-2">
                    <!-- CTA Principal : Commander (achat direct) -->
                    <Button
                      class="w-full justify-center bg-success hover:bg-success/90 text-success-foreground"
                      rounded="lg"
                      size="lg"
                      :disabled="!selectedPrice"
                      @click="handleDirectPurchase"
                    >
                      <FontAwesomeIcon
                        v-if="icons.creditCard"
                        :icon="icons.creditCard"
                        class="w-5 h-5 mr-2"
                      />
                      Commander
                    </Button>
                    <!-- CTA Secondaire : Ajouter au panier -->
                    <Button
                      class="w-full justify-center hover:bg-secondary hover:border-secondary"
                      rounded="lg"
                      size="lg"
                      color="secondary"
                      variant="outline"
                      :disabled="!selectedPrice"
                      @click="handleAddToCart"
                    >
                      <FontAwesomeIcon
                        v-if="isInCart && icons.check"
                        :icon="icons.check"
                        class="w-5 h-5 mr-2"
                      />
                      <FontAwesomeIcon
                        v-else-if="icons.shoppingCart"
                        :icon="icons.shoppingCart"
                        class="w-5 h-5 mr-2"
                      />
                      {{ isInCart ? 'Dans le panier' : 'Ajouter au panier' }}
                    </Button>
                  </div>

                  <Separator />

                  <!-- Garanties -->
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex items-center gap-2">
                      <FontAwesomeIcon
                        v-if="icons.truck"
                        :icon="icons.truck"
                        class="w-4 h-4 text-green-600 shrink-0"
                      />
                      <div>
                        <p class="text-xs font-medium text-foreground">Livraison</p>
                        <p class="text-xs text-muted-foreground">2-5 jours</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <FontAwesomeIcon
                        v-if="icons.lock"
                        :icon="icons.lock"
                        class="w-4 h-4 text-green-600 shrink-0"
                      />
                      <div>
                        <p class="text-xs font-medium text-foreground">Sécurisé</p>
                        <p class="text-xs text-muted-foreground">100%</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <FontAwesomeIcon
                        v-if="icons.undo"
                        :icon="icons.undo"
                        class="w-4 h-4 text-green-600 shrink-0"
                      />
                      <div>
                        <p class="text-xs font-medium text-foreground">Retours</p>
                        <p class="text-xs text-muted-foreground">14 jours</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <FontAwesomeIcon
                        v-if="icons.shield"
                        :icon="icons.shield"
                        class="w-4 h-4 text-green-600 shrink-0"
                      />
                      <div>
                        <p class="text-xs font-medium text-foreground">Qualité</p>
                        <p class="text-xs text-muted-foreground">Garanti</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <!-- Mobile: CTA Sticky -->
        <StickyCart
          :price="selectedPriceAmount"
          :product-name="decodedName"
          :is-in-cart="isInCart"
          :disabled="!selectedPrice"
          @add-to-cart="handleAddToCart"
        />

        <!-- Spacer pour le sticky cart mobile -->
        <div class="h-20 md:hidden" ></div>
      </template>
    </div>
  </DefaultLayout>
</template>
