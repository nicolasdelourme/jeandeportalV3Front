<script setup lang="ts">
/**
 * Composant ShopHeroCarousel
 * Carrousel hero pour la boutique avec 3 produits mis en avant
 * Auto-play 5 secondes + navigation manuelle
 */
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useShopStore } from "@/stores/shop.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { byPrefixAndName } from "@awesome.me/kit-0aac173ed2/icons";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import type { ShopReference } from "@/types/shop-api.types";
import { getShopImageUrl, decodeHTMLEntities } from "@/types/shop-api.types";

const router = useRouter();
const shopStore = useShopStore();

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    arrowRight: byPrefixAndName.fas?.["arrow-right"],
    chevronDown: byPrefixAndName.fas?.["chevron-down"],
}));

/**
 * Carousel API et autoplay
 */
const emblaApi = ref<CarouselApi>();
const current = ref(0);
const count = ref(0);

let autoplayInterval: number | null = null;

/**
 * Sélectionner 3 produits aléatoires du catalogue
 */
const featuredProducts = ref<ShopReference[]>([]);

const selectRandomProducts = () => {
    const allReferences = shopStore.references.filter(
        (ref) => ref.images.length > 0 // Seulement les produits avec images
    );

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
    current.value = api.selectedScrollSnap() + 1;

    api.on("select", () => {
        current.value = api.selectedScrollSnap() + 1;
    });

    // Démarrer l'autoplay
    startAutoplay();
};

/**
 * Démarrer l'autoplay toutes les 5 secondes
 */
const startAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);

    autoplayInterval = setInterval(() => {
        if (emblaApi.value) {
            const currentIndex = emblaApi.value.selectedScrollSnap();
            const snapCount = emblaApi.value.scrollSnapList().length;

            // Retour au début si on est à la fin
            if (currentIndex + 1 >= snapCount) {
                emblaApi.value.scrollTo(0);
            } else {
                emblaApi.value.scrollNext();
            }
        }
    }, 5000); // 5 secondes
};

/**
 * Arrêter l'autoplay
 */
const stopAutoplay = () => {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
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
    const heroHeight = window.innerHeight * 0.6; // Approximation hauteur hero
    window.scrollTo({
        top: heroHeight,
        behavior: "smooth",
    });
};

/**
 * Lifecycle
 */
onMounted(() => {
    selectRandomProducts();
});

onUnmounted(() => {
    stopAutoplay();
});
</script>

<template>
    <section
        class="relative bg-linear-to-br from-neutral-500 via-neutral-600 to-neutral-800 w-full overflow-hidden"
    >
        <!-- Badge doré -->
        <div class="absolute top-6 left-1/2 -translate-x-1/2 z-10">
            <div
                class="bg-linear-to-r from-yellow-300 to-yellow-500 px-6 py-2 rounded-full shadow-[0px_4px_16px_0px_rgba(222,166,0,0.3)]"
            >
                <p
                    class="font-bold text-sm text-consultations-nd text-center tracking-[0.7px] uppercase leading-5"
                    style="font-family: Roboto, sans-serif"
                >
                    La Boutique Éditions Jean de Portal
                </p>
            </div>
        </div>

        <!-- Carrousel -->
        <div class="pt-10 pb-8 px-4 md:px-12 lg:px-16">
            <Carousel
                class="w-full max-w-7xl mx-auto"
                @init-api="setApi"
                :opts="{
                    align: 'center',
                    loop: true,
                }"
            >
                <CarouselContent>
                    <CarouselItem
                        v-for="reference in featuredProducts"
                        :key="reference.id"
                        class="basis-full"
                    >
                        <!-- Slide content -->
                        <div
                            class="flex flex-col md:flex-row items-center gap-8 md:gap-12 py-8 md:py-12"
                        >
                            <!-- Image produit -->
                            <div class="w-full md:w-2/5 flex-shrink-0">
                                <div
                                    class="relative aspect-[1/1.414] max-w-sm mx-auto rounded-lg overflow-hidden shadow-2xl"
                                >
                                    <img
                                        v-if="reference.images.length > 0"
                                        :src="getShopImageUrl(reference.images[0]!)"
                                        :alt="
                                            decodeHTMLEntities(reference.name)
                                        "
                                        class="w-full h-full object-cover"
                                    />
                                    <div
                                        v-else
                                        class="w-full h-full bg-linear-to-br from-neutral-700 to-neutral-800 flex items-center justify-center"
                                    >
                                        <p class="text-neutral-400 text-lg">
                                            Pas d'image
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Texte et CTA -->
                            <div
                                class="flex-1 w-full flex flex-col gap-6 items-start"
                            >
                                <!-- Titre -->
                                <h2
                                    class="font-bold text-3xl md:text-5xl text-white leading-tight"
                                    style="font-family: Roboto, sans-serif"
                                    v-html="reference.name"
                                ></h2>

                                <!-- Description -->
                                <div
                                    class="font-normal text-xl text-white/90 leading-relaxed line-clamp-3"
                                    style="font-family: Roboto, sans-serif"
                                    v-html="reference.description"
                                ></div>

                                <!-- Sous-titre -->
                                <p
                                    class="font-light text-sm md:text-base text-white/80 leading-relaxed"
                                    style="font-family: Roboto, sans-serif"
                                    v-html="reference.subname"
                                ></p>

                                <!-- CTA -->
                                <Button
                                    variant="default"
                                    size="lg"
                                    color="primary"
                                    class=""
                                    @click="handleViewProduct(reference)"
                                >
                                    Voir le dossier
                                    <FontAwesomeIcon
                                        v-if="icons.arrowRight"
                                        :icon="icons.arrowRight"
                                        class="ml-2 h-4 w-4"
                                    />
                                </Button>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>

                <!-- Navigation -->
                <CarouselPrevious
                    class="left-4 bg-white/10 hover:bg-white/20 text-white border-white/30 hidden md:flex"
                    @click="stopAutoplay"
                />
                <CarouselNext
                    class="right-4 bg-white/10 hover:bg-white/20 text-white border-white/30 hidden md:flex"
                    @click="stopAutoplay"
                />
            </Carousel>

            <!-- Pagination dots -->
            <div class="flex justify-center gap-2 mt-6">
                <button
                    v-for="index in count"
                    :key="index"
                    @click="
                        () => {
                            emblaApi?.scrollTo(index - 1);
                            stopAutoplay();
                        }
                    "
                    class="w-2 h-2 rounded-full transition-all duration-300"
                    :class="
                        current === index
                            ? 'bg-yellow-400 w-8'
                            : 'bg-white/40 hover:bg-white/60'
                    "
                    :aria-label="`Aller à la slide ${index}`"
                />
            </div>
        </div>

        <!-- Indicateur scroll -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <button
                @click="handleScrollDown"
                class="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors group"
            >
                <span
                    class="text-sm font-light"
                    style="font-family: Roboto, sans-serif"
                >
                    Découvrir nos collections
                </span>
                <FontAwesomeIcon
                    v-if="icons.chevronDown"
                    :icon="icons.chevronDown"
                    class="h-5 w-5 animate-bounce group-hover:animate-none"
                />
            </button>
        </div>
    </section>
</template>

<style scoped>
/* Assurer que le HTML dans v-html respecte le style */
:deep(p) {
    margin: 0;
}

:deep(strong),
:deep(b) {
    font-weight: 600;
}
</style>
