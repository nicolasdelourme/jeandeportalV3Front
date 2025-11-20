<script setup lang="ts">
/**
 * Page ProductDetailPage
 * Page détail d'un produit avec toutes ses variantes et prix
 * Layout optimisé pour la conversion e-commerce
 */
import { onMounted, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useShopStore } from '@/stores/shop.store'
import { useCartStore } from '@/stores/cart.store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { getShopImageUrl, formatPrice, decodeHTMLEntities, sanitizeHTML } from '@/types/shop-api.types'
import type { ShopProduct, ShopPrice } from '@/types/shop-api.types'
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
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  shoppingCart: byPrefixAndName.fas?.['cart-shopping'],
  tag: byPrefixAndName.fas?.['tag'],
  box: byPrefixAndName.fas?.['box'],
  truck: byPrefixAndName.fas?.['truck'],
  shield: byPrefixAndName.fas?.['shield-check'],
  share: byPrefixAndName.fas?.['share-nodes'],
  heart: byPrefixAndName.far?.['heart'],
  heartSolid: byPrefixAndName.fas?.['heart'],
  check: byPrefixAndName.fas?.['check'],
  info: byPrefixAndName.fas?.['circle-info'],
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
 * Image active (pour la galerie)
 */
const activeImageIndex = ref(0)

/**
 * Images de la galerie
 */
const galleryImages = computed(() => {
  if (!reference.value) return []
  return reference.value.images
})

/**
 * Image active
 */
const activeImage = computed(() => {
  const images = galleryImages.value
  if (images.length === 0) return 'https://placehold.co/600x600/e5e7eb/6b7280?text=Pas+d%27image'
  const currentImage = images[activeImageIndex.value]
  if (!currentImage) return 'https://placehold.co/600x600/e5e7eb/6b7280?text=Pas+d%27image'
  return getShopImageUrl(currentImage)
})

/**
 * Couleur du badge de collection
 */
const collectionBadgeColor = computed(() => {
  if (!reference.value) return 'neutral-600'
  const collectionColors: Record<string, string> = {
    or: 'yellow-500',
    argent: 'gray-400',
    patrimoine: 'blue-600',
    immobilier: 'green-600',
    securite: 'red-600',
    formation: 'purple-600',
  }
  return collectionColors[reference.value.collectionId] || 'neutral-600'
})

/**
 * Prix sélectionné formaté
 */
const selectedPriceDisplay = computed(() => {
  if (!selectedPrice.value) return null
  return formatPrice(selectedPrice.value.amount)
})

/**
 * Quantité
 */
const quantity = ref(1)

/**
 * Charger la référence au montage
 */
onMounted(async () => {
  document.title = 'Éditions Jean de Portal : Produit'

  // Charger le catalogue si pas déjà fait
  await shopStore.fetchCatalog()

  // Si la référence existe, sélectionner le premier produit et prix par défaut
  if (reference.value && reference.value.products.length > 0) {
    const firstProduct = reference.value.products[0]
    if (firstProduct) {
      selectedProduct.value = firstProduct
      if (firstProduct.prices.length > 0) {
        const firstPrice = firstProduct.prices[0]
        if (firstPrice) {
          selectedPrice.value = firstPrice
        }
      }
    }

    // Mettre à jour le titre avec le nom du produit
    document.title = `Éditions Jean de Portal : ${reference.value.name}`
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

const handleAddToCart = () => {
  if (!reference.value || !selectedPrice.value) {
    toast.error('Veuillez sélectionner un produit et un prix')
    return
  }

  try {
    // Obtenir l'image principale
    const mainImage = reference.value.images.length > 0
      ? getShopImageUrl(reference.value.images[0])
      : undefined

    // Ajouter au panier
    cartStore.addItem({
      id: reference.value.id,
      name: reference.value.name,
      price: selectedPrice.value.amount,
      image: mainImage,
      slug: reference.value.id,
    })

    toast.success(`${decodeHTMLEntities(reference.value.name)} ajouté au panier`)
  } catch (error) {
    if (error instanceof CartError) {
      toast.error(error.message)
    } else {
      toast.error('Impossible d\'ajouter au panier')
    }
  }
}

const selectProduct = (product: ShopProduct) => {
  selectedProduct.value = product
  if (product.prices.length > 0) {
    const firstPrice = product.prices[0]
    if (firstPrice) {
      selectedPrice.value = firstPrice
    }
  }
}

const selectPrice = (price: ShopPrice) => {
  selectedPrice.value = price
}

const changeImage = (index: number) => {
  activeImageIndex.value = index
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // TODO: Sauvegarder dans localStorage ou backend
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
    // Fallback: copier le lien
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
  if (!reference.value) return false
  return cartStore.hasItem(reference.value.id)
})

/**
 * Titre décodé (sans entités HTML)
 */
const decodedName = computed(() => {
  if (!reference.value) return ''
  return decodeHTMLEntities(reference.value.name)
})

/**
 * Sous-titre/subname HTML nettoyé pour affichage
 */
const sanitizedSubname = computed(() => {
  if (!reference.value) return ''
  let html = sanitizeHTML(reference.value.subname)

  // Enlever le paragraphe "Caractéristiques" complet (avec son <strong>)
  html = html.replace(/<p>\s*<strong>Caractéristiques<\/strong>\s*<\/p>/gi, '')

  // Enlever le paragraphe "Niveau d'expertise..." complet
  html = html.replace(/<p>Niveau[^<]*★[^<]*<\/p>/gi, '')

  // Mettre en gras "Auteurs", "Auteur", "Parution", "Nombre de pages" (uniquement le mot, pas après)
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

</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Breadcrumb / Retour -->
      <section class="bg-white border-b border-gray-200 py-4">
        <div class="max-w-6xl mx-auto px-4">
          <Button @click="handleBack" variant="ghost" size="sm" class="gap-2">
            <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="w-4 h-4" />
            Retour à la boutique
          </Button>
        </div>
      </section>

      <!-- État de chargement -->
      <div v-if="shopStore.isLoading" class="max-w-6xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-neutral-700">Chargement du produit...</p>
      </div>

      <!-- Produit non trouvé -->
      <div v-else-if="!reference" class="max-w-6xl mx-auto px-4 py-16 text-center">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p class="text-red-800 font-semibold mb-2">Produit introuvable</p>
          <p class="text-red-600 text-sm mb-4">Ce produit n'existe pas ou a été supprimé.</p>
          <Button @click="handleBack" variant="outline" size="sm">
            Retour à la boutique
          </Button>
        </div>
      </div>

      <!-- Contenu produit -->
      <section v-else class="max-w-6xl mx-auto px-4 py-8">
        <div class="grid lg:grid-cols-12 gap-8">
          <!-- ========================================
               COLONNE GAUCHE : Informations produit (col-8)
               ======================================== -->
          <div class="lg:col-span-8 space-y-6">
            <!-- Header avec badge et actions -->
            <div class="flex items-start justify-between gap-4">
              <Badge :color="collectionBadgeColor" variant="default" class="text-xs font-semibold uppercase">
                {{ reference.collectionId }}
              </Badge>

              <!-- Actions : Favoris + Partage -->
              <div class="flex gap-2">
                <Button @click="toggleFavorite" variant="outline" size="sm" class="relative">
                  <FontAwesomeIcon
                    v-if="isFavorite ? icons.heartSolid : icons.heart"
                    :icon="isFavorite ? icons.heartSolid! : icons.heart!"
                    :class="isFavorite ? 'text-red-500' : ''"
                    class="w-4 h-4"
                  />
                </Button>
                <Button @click="handleShare" variant="outline" size="sm" class="relative">
                  <FontAwesomeIcon v-if="icons.share" :icon="icons.share" class="w-4 h-4" />
                  <span v-if="showShareMenu"
                    class="absolute -bottom-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Lien copié !
                  </span>
                </Button>
              </div>
            </div>

            <!-- Titre -->
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-neutral-800 mb-2" style="font-family: Roboto, sans-serif;">
                {{ decodedName }}
              </h1>
              <p class="text-sm text-neutral-500">Réf: {{ reference.technicalReference }}</p>
            </div>

            <!-- Grid col-6 col-6 : Info + Prix -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- COLONNE GAUCHE : Infos produit -->
              <div class="space-y-4">
                <!-- Sous-titre / Pitch commercial -->
                <div v-if="reference.subname"
                  class="text-base text-neutral-700 bg-amber-50 border-l-4 border-amber-400 p-4 rounded leading-relaxed"
                  v-html="sanitizedSubname" />
              </div>

              <!-- COLONNE DROITE : Bloc Prix & CTA -->
              <div>
                <Card
                  class="border-2 border-primary p-0 shadow-lg bg-linear-to-br from-primary/10 to-primary/20 h-full">
                  <CardContent class="p-6 space-y-4 flex flex-col h-full">
                    <!-- Prix mis en avant -->
                    <div class="text-center">
                      <p class="text-sm text-primary font-semibold uppercase tracking-wide mb-1">Prix</p>
                      <div class="flex items-center justify-center gap-2">
                        <p class="text-4xl font-bold text-neutal-800">
                          {{ selectedPriceDisplay || 'Non disponible' }}
                        </p>
                        <Badge class="bg-neutral-400 text-xs">TTC</Badge>
                      </div>
                    </div>

                    <Separator />

                    <!-- Bouton CTA Principal -->
                    <Button @click="handleAddToCart" :disabled="!selectedPrice" variant="default" color="primary"
                      size="lg" class="w-full justify-center relative">
                      <FontAwesomeIcon v-if="icons.shoppingCart" :icon="icons.shoppingCart" class="w-5 h-5 mr-2" />
                      {{ isInCart ? 'Déjà dans le panier' : 'Ajouter au panier' }}
                      <!-- Indicateur visuel si déjà dans le panier -->
                      <span
                        v-if="isInCart"
                        class="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                        title="Déjà dans le panier"
                      />
                    </Button>

                    <!-- Garanties intégrées -->
                    <div class="grid grid-cols-2 gap-2 mt-4">
                      <div class="flex items-center gap-2">
                        <FontAwesomeIcon v-if="icons.truck" :icon="icons.truck" class="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p class="text-xs font-semibold text-neutral-700">Livraison rapide</p>
                          <p class="text-xs text-neutral-500">2-5 jours</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <FontAwesomeIcon v-if="icons.shield" :icon="icons.shield"
                          class="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p class="text-xs font-semibold text-neutral-700">Paiement sécurisé</p>
                          <p class="text-xs text-neutral-500">100% protégé</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <!-- Description détaillée -->
            <Card class="border-2">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <FontAwesomeIcon v-if="icons.info" :icon="icons.info" class="w-4 h-4" />
                  Description détaillée
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <!-- Description complète HTML -->
                <div class="prose prose-sm max-w-none text-neutral-600 leading-relaxed" v-html="sanitizedDescription" />

                <!-- Tags -->
                <div v-if="reference.tags.length > 0">
                  <Separator class="mb-3" />
                  <p class="text-xs font-semibold text-neutral-500 uppercase mb-2">Thématiques</p>
                  <div class="flex flex-wrap gap-2">
                    <Badge v-for="tag in reference.tags" :key="tag" variant="outline" color="neutral-700"
                      class="text-xs">
                      <FontAwesomeIcon v-if="icons.tag" :icon="icons.tag" class="w-3 h-3 mr-1" />
                      {{ tag }}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- ========================================
               COLONNE DROITE : Image sticky (col-4)
               ======================================== -->
          <div class="lg:col-span-4">
            <!-- Galerie d'images sticky avec compensation navbar -->
            <div class="sticky top-20 space-y-4">
              <!-- Image principale -->
              <Card class="overflow-hidden shadow-lg">
                <AspectRatio :ratio="1 / 1.414">
                  <img :src="activeImage" :alt="reference.name" class="w-full h-full object-cover" />
                </AspectRatio>
              </Card>

              <!-- Miniatures -->
              <div v-if="galleryImages.length > 1" class="grid grid-cols-4 gap-2">
                <div v-for="(image, index) in galleryImages" :key="index" @click="changeImage(index)"
                  class="cursor-pointer border-2 rounded-md overflow-hidden transition-all hover:shadow-md"
                  :class="activeImageIndex === index ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-gray-200 hover:border-gray-400'">
                  <AspectRatio :ratio="1 / 1.414">
                    <img :src="getShopImageUrl(image)" :alt="`${reference.name} - ${index + 1}`"
                      class="w-full h-full object-cover" />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>
