<script setup lang="ts">
/**
 * Composant ShopHeroCarousel
 * Carrousel hero pour la boutique avec 3 produits mis en avant
 * Auto-play 5 secondes + navigation manuelle
 */
import { computed, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useShopStore } from "@/stores/shop.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { byPrefixAndName } from "@/lib/icons";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import type { ShopReference } from "@/types/shop-api.types";
import { getShopImageUrl, decodeHTMLEntities, getFirstTagByPrefix, formatPrice } from "@/types/shop-api.types";

const router = useRouter();
const shopStore = useShopStore();

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    arrowRight: byPrefixAndName.fas["arrow-right"],
    chevronDown: byPrefixAndName.fas["chevron-down"],
    tag: byPrefixAndName.fas["tag"],
}));

/**
 * Helpers pour les tags et le prix
 */
const getFilterTag = (ref: ShopReference) => getFirstTagByPrefix(ref.tags, 'filter');
const getRecoTag = (ref: ShopReference) => getFirstTagByPrefix(ref.tags, 'reco');

const getMinPrice = (ref: ShopReference) => {
    const allPrices = ref.products.flatMap(p => p.prices.map(pr => pr.amount));
    return allPrices.length ? Math.min(...allPrices) : null;
};

const getPriceDisplay = (ref: ShopReference) => {
    const min = getMinPrice(ref);
    return min !== null ? formatPrice(min) : '';
};

/**
 * Carousel API et autoplay
 */
const emblaApi = ref<CarouselApi>();
const current = ref(0);
const count = ref(0);
const autoplayInterval = ref<ReturnType<typeof setInterval> | null>(null);

/**
 * Sélectionner 3 produits aléatoires du catalogue
 */
const featuredProducts = ref<ShopReference[]>([]);

const selectRandomProducts = () => {
    const allReferences = shopStore.references;
    if (allReferences.length === 0) return;

    // Mélanger et prendre 3
    const shuffled = [...allReferences].sort(() => Math.random() - 0.5);
    featuredProducts.value = shuffled.slice(0, 3);
};

/**
 * Initialiser l'API du carrousel
 */
const setApi = (api: CarouselApi) => {
    emblaApi.value = api;
    if (!api) return;

    count.value = api.scrollSnapList().length;
    current.value = api.selectedScrollSnap();

    api.on("select", () => {
        current.value = api.selectedScrollSnap();
    });

    // Démarrer l'autoplay
    startAutoplay();
};

/**
 * Démarrer l'autoplay toutes les 5 secondes
 */
const startAutoplay = () => {
    if (autoplayInterval.value) clearInterval(autoplayInterval.value);

    autoplayInterval.value = setInterval(() => {
        if (emblaApi.value) {
            const currentIndex = emblaApi.value.selectedScrollSnap();
            const snapCount = emblaApi.value.scrollSnapList().length;

            if (currentIndex + 1 >= snapCount) {
                emblaApi.value.scrollTo(0);
            } else {
                emblaApi.value.scrollNext();
            }
        }
    }, 5000);
};

/**
 * Arrêter l'autoplay
 */
const stopAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
        autoplayInterval.value = null;
    }
};

/**
 * Aller à une slide spécifique
 */
const goToSlide = (index: number) => {
    emblaApi.value?.scrollTo(index);
    stopAutoplay();
};

/**
 * Navigation vers la page détail produit
 */
const handleViewProduct = (reference: ShopReference) => {
    router.push(`/boutique/${reference.id}`);
};

/**
 * Scroll vers le contenu
 */
const handleScrollDown = () => {
    window.scrollTo({
        top: 500,
        behavior: "smooth",
    });
};

/**
 * Lifecycle
 */
watch(
    () => shopStore.references,
    (newReferences) => {
        if (newReferences.length > 0 && featuredProducts.value.length === 0) {
            selectRandomProducts();
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    stopAutoplay();
});
</script>

<template>
    <!-- Loading state -->
    <section
        v-if="featuredProducts.length === 0"
        class="hero-carousel bg-neutral-100"
    >
        <div class="flex items-center justify-center h-full">
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-neutral-600 mb-4" ></div>
                <p class="text-neutral-500 text-sm">Chargement...</p>
            </div>
        </div>
    </section>

    <!-- Carrousel avec produits -->
    <section
        v-else
        class="hero-carousel bg-linear-to-br from-secondary via-secondary/90 to-secondary/80"
    >
        <Carousel
            class="w-full h-full"
            :opts="{ align: 'start', loop: true }"
            @init-api="setApi"
        >
            <CarouselContent class="h-full ml-0">
                <CarouselItem
                    v-for="reference in featuredProducts"
                    :key="reference.id"
                    class="h-full pl-0"
                >
                    <!-- Slide content : container centré -->
                    <div class="w-full h-full flex items-center">
                        <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 w-full">
                            <!-- Layout 2 colonnes : image + texte -->
                            <div class="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-16">
                                <!-- Image de couverture à gauche -->
                                <div class="shrink-0">
                                    <div class="rounded-sm overflow-hidden shadow-2xl ring-2 ring-white/20">
                                        <img
                                            v-if="reference.images.length > 0"
                                            :src="getShopImageUrl(reference.images[0] ?? '')"
                                            :alt="decodeHTMLEntities(reference.name)"
                                            class="w-auto h-48 md:h-64 lg:h-80 object-contain"
                                        />
                                        <div
                                            v-else
                                            class="w-32 h-48 bg-neutral-200 flex items-center justify-center"
                                        >
                                            <span class="text-neutral-400 text-sm">Image</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Contenu texte à droite -->
                                <div class="flex-1 text-center md:text-left">
                                    <!-- Titre -->
                                    <h2
                                        class="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-white leading-tight mb-3"
                                        v-html="reference.name"
                                    ></h2>

                                    <!-- Description courte -->
                                    <p
                                        v-if="reference.subname"
                                        class="text-white/80 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 max-w-xl"
                                        v-html="reference.subname"
                                    ></p>

                                    <!-- Badges sous la description -->
                                    <div class="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                                        <!-- Badge catégorie (premier tag filter_) -->
                                        <Badge
                                            v-if="getFilterTag(reference)"
                                            variant="outline"
                                            rounded="sm"
                                            class="text-xs font-semibold border-white/50 bg-white/10 text-white backdrop-blur-sm"
                                        >
                                            {{ getFilterTag(reference)?.displayName }}
                                        </Badge>

                                        <!-- Badge recommandation (premier tag reco_) -->
                                        <Badge
                                            v-if="getRecoTag(reference)"
                                            variant="outline"
                                            rounded="sm"
                                            class="text-xs font-semibold border-white/50 bg-white/10 text-white backdrop-blur-sm gap-1.5"
                                        >
                                            <FontAwesomeIcon
                                                v-if="icons.tag"
                                                :icon="icons.tag"
                                                class="size-3"
                                            />
                                            {{ getRecoTag(reference)?.displayName }}
                                        </Badge>
                                    </div>

                                    <!-- CTA -->
                                    <Button
                                        size="lg"
                                        rounded="sm"
                                        class="bg-white text-secondary hover:bg-white/90 font-semibold"
                                        @click="handleViewProduct(reference)"
                                    >
                                        Découvrir
                                        <FontAwesomeIcon
                                            v-if="icons.arrowRight"
                                            :icon="icons.arrowRight"
                                            class="ml-2 h-4 w-4"
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CarouselItem>
            </CarouselContent>

            <!-- Navigation dans le container -->
            <CarouselPrevious
                class="left-4 md:left-8 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm hidden md:flex rounded-sm"
                @click="stopAutoplay"
            />
            <CarouselNext
                class="right-4 md:right-8 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm hidden md:flex rounded-sm"
                @click="stopAutoplay"
            />
        </Carousel>

        <!-- Pagination dots -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            <button
                v-for="index in count"
                :key="index"
                :aria-label="`Aller à la slide ${index}`"
                :class="current === index - 1
                    ? 'bg-white w-8 h-2'
                    : 'bg-white/40 hover:bg-white/60 w-2 h-2'
                "
                class="transition-all duration-300 rounded-sm"
                @click="goToSlide(index - 1)"
            ></button>
        </div>
    </section>
</template>

<style scoped>
/* Hauteur pour le hero carousel */
.hero-carousel {
    position: relative;
    width: 100%;
    min-height: 350px;
    overflow: hidden;
}

/* Forcer la hauteur sur les éléments du carousel */
.hero-carousel :deep([data-slot="carousel"]) {
    height: 100%;
}

.hero-carousel :deep([data-slot="carousel-content"]) {
    height: 100%;
}

.hero-carousel :deep([data-slot="carousel-content"] > div) {
    height: 100%;
}

.hero-carousel :deep([data-slot="carousel-item"]) {
    height: 100%;
}

/* HTML dans v-html */
:deep(p) {
    margin: 0;
}

:deep(strong),
:deep(b) {
    font-weight: 600;
}
</style>
