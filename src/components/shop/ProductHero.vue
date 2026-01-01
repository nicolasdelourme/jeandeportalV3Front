<script setup lang="ts">
/**
 * ProductHero - Hero image pleine largeur pour la fiche produit
 *
 * Affiche l'image principale avec overlay et badges
 * Gère la galerie en mode plein écran si plusieurs images
 */
import { computed, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { getShopImageUrl } from '@/types/shop-api.types'

interface Props {
  images: string[]
  title: string
  collectionId: string
  collectionLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  collectionLabel: '',
})

const emit = defineEmits<{
  back: []
}>()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  chevronLeft: byPrefixAndName.fas?.['chevron-left'],
  chevronRight: byPrefixAndName.fas?.['chevron-right'],
}))

/**
 * Index de l'image active
 */
const activeImageIndex = ref(0)

/**
 * Image active
 */
const activeImage = computed(() => {
  if (props.images.length === 0) {
    return 'https://placehold.co/1200x800/e5e7eb/6b7280?text=Pas+d%27image'
  }
  const currentImage = props.images[activeImageIndex.value]
  if (!currentImage) {
    return 'https://placehold.co/1200x800/e5e7eb/6b7280?text=Pas+d%27image'
  }
  return getShopImageUrl(currentImage)
})

/**
 * Couleur du badge de collection
 */
const collectionBadgeColor = computed(() => {
  const collectionColors: Record<string, string> = {
    or: 'yellow-500',
    argent: 'gray-400',
    patrimoine: 'blue-600',
    immobilier: 'green-600',
    securite: 'red-600',
    formation: 'purple-600',
  }
  return collectionColors[props.collectionId] || 'neutral-600'
})

/**
 * Navigation galerie
 */
const previousImage = () => {
  if (activeImageIndex.value > 0) {
    activeImageIndex.value--
  } else {
    activeImageIndex.value = props.images.length - 1
  }
}

const nextImage = () => {
  if (activeImageIndex.value < props.images.length - 1) {
    activeImageIndex.value++
  } else {
    activeImageIndex.value = 0
  }
}

const goToImage = (index: number) => {
  activeImageIndex.value = index
}
</script>

<template>
  <div class="relative w-full overflow-hidden bg-neutral-900">
    <!-- Image principale -->
    <AspectRatio :ratio="16 / 9" class="md:aspect-auto md:h-[50vh] md:min-h-[400px] md:max-h-[600px]">
      <img
        :src="activeImage"
        :alt="title"
        class="w-full h-full object-cover"
      />
    </AspectRatio>

    <!-- Overlay gradient -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
    <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

    <!-- Bouton retour -->
    <div class="absolute top-4 left-4 z-10">
      <Button
        variant="ghost"
        size="sm"
        class="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 gap-2"
        @click="emit('back')"
      >
        <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="w-4 h-4" />
        <span class="hidden sm:inline">Boutique</span>
      </Button>
    </div>

    <!-- Badge collection -->
    <div class="absolute top-4 right-4 z-10">
      <Badge
        :color="collectionBadgeColor"
        variant="default"
        class="text-xs font-semibold uppercase tracking-wider"
      >
        {{ collectionLabel || collectionId }}
      </Badge>
    </div>

    <!-- Navigation galerie (si plusieurs images) -->
    <template v-if="images.length > 1">
      <!-- Flèches de navigation -->
      <Button
        variant="ghost"
        size="icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hidden md:flex"
        @click="previousImage"
      >
        <FontAwesomeIcon v-if="icons.chevronLeft" :icon="icons.chevronLeft" class="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hidden md:flex"
        @click="nextImage"
      >
        <FontAwesomeIcon v-if="icons.chevronRight" :icon="icons.chevronRight" class="w-5 h-5" />
      </Button>

      <!-- Indicateurs en bas -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        <button
          v-for="(_, index) in images"
          :key="index"
          class="transition-all duration-300 rounded-full"
          :class="
            activeImageIndex === index
              ? 'bg-white w-6 h-2'
              : 'bg-white/40 hover:bg-white/60 w-2 h-2'
          "
          :aria-label="`Voir image ${index + 1}`"
          @click="goToImage(index)"
        />
      </div>

      <!-- Miniatures (visible sur desktop) -->
      <div class="absolute bottom-4 right-4 z-10 hidden lg:flex gap-2">
        <button
          v-for="(image, index) in images.slice(0, 4)"
          :key="index"
          class="w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
          :class="
            activeImageIndex === index
              ? 'border-white ring-2 ring-white/50'
              : 'border-white/30 hover:border-white/60'
          "
          @click="goToImage(index)"
        >
          <img
            :src="getShopImageUrl(image)"
            :alt="`${title} - ${index + 1}`"
            class="w-full h-full object-cover"
          />
        </button>
        <div
          v-if="images.length > 4"
          class="w-16 h-16 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-sm font-medium"
        >
          +{{ images.length - 4 }}
        </div>
      </div>
    </template>
  </div>
</template>
