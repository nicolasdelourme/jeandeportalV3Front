<script setup lang="ts">
/**
 * Composant FeaturedPublicationsSection
 * Carrousel automatique de publications phares harmonisé avec le reste de la page
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { type CarouselApi } from '@/components/ui/carousel'

const router = useRouter()

/**
 * Carousel API et autoplay
 */
const emblaApi = ref<CarouselApi>()
const current = ref(0)
const count = ref(0)

let autoplayInterval: number | null = null

/**
 * Retourne le nombre de slides à scroller selon la taille du viewport
 * Mobile (< 768px): 1 slide
 * Tablet (768-1024px): 3 slides
 * Desktop (≥ 1024px): 6 slides
 */
const getSlidesToScroll = (): number => {
    if (typeof window === 'undefined') return 6

    if (window.innerWidth < 768) return 1   // Mobile
    if (window.innerWidth < 1024) return 3  // Tablet
    return 6                                 // Desktop
}

const setApi = (api: CarouselApi) => {
    emblaApi.value = api
    if (!api) return

    count.value = api.scrollSnapList().length
    current.value = api.selectedScrollSnap() + 1

    api.on('select', () => {
        current.value = api.selectedScrollSnap() + 1
    })

    // Démarrer l'autoplay
    startAutoplay()
}

const startAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval)

    autoplayInterval = setInterval(() => {
        if (emblaApi.value) {
            // Défiler selon le viewport (1/3/6 slides)
            const currentIndex = emblaApi.value.selectedScrollSnap()
            const slidesToScroll = getSlidesToScroll()
            const targetIndex = currentIndex + slidesToScroll
            const snapCount = emblaApi.value.scrollSnapList().length

            // Si on dépasse, retourner au début
            if (targetIndex >= snapCount) {
                emblaApi.value.scrollTo(0)
            } else {
                emblaApi.value.scrollTo(targetIndex)
            }
        }
    }, 4000) // 4 secondes
}

const stopAutoplay = () => {
    if (autoplayInterval) {
        clearInterval(autoplayInterval)
        autoplayInterval = null
    }
}

onUnmounted(() => {
    stopAutoplay()
})

const handlePrevious = () => {
    stopAutoplay()
    if (emblaApi.value) {
        const currentIndex = emblaApi.value.selectedScrollSnap()
        const slidesToScroll = getSlidesToScroll()
        const targetIndex = currentIndex - slidesToScroll

        if (targetIndex < 0) {
            // Aller à la dernière "page"
            const snapCount = emblaApi.value.scrollSnapList().length
            const lastPageStart = Math.floor((snapCount - 1) / slidesToScroll) * slidesToScroll
            emblaApi.value.scrollTo(lastPageStart)
        } else {
            emblaApi.value.scrollTo(targetIndex)
        }
    }
    startAutoplay()
}

const handleNext = () => {
    stopAutoplay()
    if (emblaApi.value) {
        const currentIndex = emblaApi.value.selectedScrollSnap()
        const slidesToScroll = getSlidesToScroll()
        const targetIndex = currentIndex + slidesToScroll
        const snapCount = emblaApi.value.scrollSnapList().length

        if (targetIndex >= snapCount) {
            emblaApi.value.scrollTo(0)
        } else {
            emblaApi.value.scrollTo(targetIndex)
        }
    }
    startAutoplay()
}

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    eye: byPrefixAndName.fas?.['eye'],
}))

type IconKey = 'eye'

const getIcon = (iconKey: IconKey): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

/**
 * Publications phares (format A4)
 * 3 slides de 6 publications = 18 publications
 */
const publications = [
    // Slide 1
    {
        id: 'av-premium',
        title: 'Assurance Vie Premium',
        category: 'Assurance Vie & Épargne',
        price: 24,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'yellow-500',
    },
    {
        id: 'etf-2024',
        title: 'ETF et Trackers 2024',
        category: 'Investissements Financiers',
        price: 27,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'consultations-nd',
    },
    {
        id: 'succession',
        title: 'Donation et Succession',
        category: 'Transmission & Succession',
        price: 31,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'yellow-600',
    },
    {
        id: 'per-2024',
        title: 'PER et Retraite 2024',
        category: 'Retraite & Prévoyance',
        price: 26,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'primary',
    },
    {
        id: 'immobilier-lmnp',
        title: 'LMNP et Immobilier 2024',
        category: 'Immobilier',
        price: 29,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'consultations-nd-immobilier',
    },
    {
        id: 'fiscalite-revenus',
        title: 'Fiscalité des Revenus 2024',
        category: 'Fiscalité Personnelle',
        price: 28,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'primary',
    },
    // Slide 2
    {
        id: 'scpi-2024',
        title: 'SCPI et Immobilier Papier',
        category: 'Immobilier',
        price: 25,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'consultations-nd-immobilier',
    },
    {
        id: 'crypto-2024',
        title: 'Crypto-actifs 2024',
        category: 'Investissements Financiers',
        price: 30,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'consultations-nd',
    },
    {
        id: 'sci-familiale',
        title: 'SCI Familiale',
        category: 'Transmission & Succession',
        price: 27,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'yellow-600',
    },
    {
        id: 'pea-pme',
        title: 'PEA et PEA-PME',
        category: 'Investissements Financiers',
        price: 23,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'consultations-nd',
    },
    {
        id: 'prevoyance-sante',
        title: 'Prévoyance et Santé',
        category: 'Retraite & Prévoyance',
        price: 24,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'primary',
    },
    {
        id: 'defiscalisation',
        title: 'Stratégies de Défiscalisation',
        category: 'Fiscalité Personnelle',
        price: 32,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'primary',
    },
    // Slide 3
    {
        id: 'assurance-deces',
        title: 'Assurance Décès',
        category: 'Assurance Vie & Épargne',
        price: 22,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'yellow-500',
    },
    {
        id: 'or-metaux',
        title: 'Or et Métaux Précieux',
        category: 'Investissements Financiers',
        price: 29,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'consultations-nd-metauxprecieux',
    },
    {
        id: 'donation-vivant',
        title: 'Donation de son Vivant',
        category: 'Transmission & Succession',
        price: 26,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'yellow-600',
    },
    {
        id: 'pinel-malraux',
        title: 'Pinel et Malraux 2024',
        category: 'Immobilier',
        price: 31,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'consultations-nd-immobilier',
    },
    {
        id: 'plan-epargne-retraite',
        title: 'Plan Épargne Retraite Collectif',
        category: 'Retraite & Prévoyance',
        price: 25,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'primary',
    },
    {
        id: 'optimisation-ir',
        title: 'Optimisation de l\'IR',
        category: 'Fiscalité Personnelle',
        price: 27,
        oldPrice: 39,
        coverUrl: null,
        bgColor: 'primary',
    },
]

/**
 * Actions
 */
const handleViewPublication = (publicationId: string) => {
    router.push(`/boutique/${publicationId}`)
}

const handleViewAllPublications = () => {
    router.push('/boutique')
}
</script>

<template>
    <section class="bg-white py-16">
        <div class="flex flex-col gap-12 px-4 max-w-6xl mx-auto w-full">
            <!-- En-tête de section -->
            <div class="flex flex-col gap-3 items-center justify-center w-full">
                <!-- Badge rouge -->
                <Badge class="bg-linear-to-r from-[#aa0000] to-primary px-6 py-2 rounded-full shadow-lg">
                    <p class="font-bold text-sm text-center text-white tracking-[0.7px] uppercase"
                        style="font-family: Roboto, sans-serif;">
                        Publications phares
                    </p>
                </Badge>

                <!-- Titre principal -->
                <h2 class="font-bold text-4xl text-neutral-800 text-center leading-10"
                    style="font-family: Roboto, sans-serif;">
                    Nos publications les plus consultées
                </h2>

                <!-- Sous-titre -->
                <p class="font-normal text-lg text-neutral-600 text-center leading-8 max-w-2xl"
                    style="font-family: Roboto, sans-serif;">
                    Découvrez les dossiers et guides qui ont déjà aidé des milliers d'investisseurs
                </p>
            </div>

            <!-- Carousel shadcn-vue -->
            <Carousel class="w-full" :opts="{ loop: true, align: 'start' }" @init-api="setApi">
                <CarouselContent class="-ml-4">
                    <CarouselItem v-for="publication in publications" :key="publication.id"
                        class="pl-4 md:basis-1/3 lg:basis-1/6">
                        <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow group cursor-pointer"
                            @click="handleViewPublication(publication.id)">
                            <!-- Cover A4 (ratio 1:1.414) -->
                            <div class="relative w-full bg-neutral-100 overflow-hidden"
                                style="aspect-ratio: 1 / 1.414;">
                                <template v-if="publication.coverUrl">
                                    <img :src="publication.coverUrl" :alt="publication.title"
                                        class="w-full h-full object-cover" />
                                </template>
                                <template v-else>
                                    <!-- Placeholder A4 -->
                                    <div class="w-full h-full flex flex-col items-center justify-center p-4 gap-3"
                                        :style="`background: linear-gradient(135deg, var(--color-${publication.bgColor}), var(--color-${publication.bgColor}))`">
                                        <div
                                            class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p class="font-bold text-xs text-white text-center leading-4"
                                            style="font-family: Roboto, sans-serif;">
                                            {{ publication.title }}
                                        </p>
                                    </div>
                                </template>

                                <!-- Overlay avec CTA au hover -->
                                <div
                                    class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div class="flex flex-col items-center gap-2">
                                        <FontAwesomeIcon v-if="getIcon('eye')" :icon="getIcon('eye')"
                                            class="w-6 h-6 text-white" />
                                        <p class="font-bold text-sm text-white"
                                            style="font-family: Roboto, sans-serif;">
                                            Voir la fiche
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Infos -->
                            <div class="p-3 flex flex-col gap-2 flex-1">
                                <!-- Titre -->
                                <h3 class="font-bold text-sm text-neutral-800 leading-5 line-clamp-2"
                                    style="font-family: Roboto, sans-serif;">
                                    {{ publication.title }}
                                </h3>

                                <!-- Catégorie -->
                                <p class="font-medium text-xs text-neutral-600 leading-4 flex-1"
                                    style="font-family: Roboto, sans-serif;">
                                    {{ publication.category }}
                                </p>

                                <!-- Prix -->
                                <div class="flex items-baseline gap-2 mt-auto">
                                    <span class="font-bold text-lg leading-6"
                                        :style="`color: var(--color-${publication.bgColor}); font-family: Roboto, sans-serif;`">
                                        {{ publication.price }}€
                                    </span>
                                    <span class="font-normal text-xs text-neutral-400 line-through leading-4"
                                        style="font-family: Roboto, sans-serif;">
                                        {{ publication.oldPrice }}€
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>

                <!-- Contrôles du carousel -->
                <div class="flex items-center justify-center gap-4 mt-8">
                    <!-- Bouton précédent -->
                    <Button @click="handlePrevious" variant="outline"
                        class="rounded-full border border-neutral-300 flex items-center justify-center p-1 transition-colors">
                        <CarouselPrevious class="static translate-y-0" />
                    </Button>

                    <!-- Indicateurs de pagination dynamiques -->
                    <div class="flex gap-2">
                        <button v-for="pageIndex in Math.ceil(publications.length / getSlidesToScroll())" :key="pageIndex" @click="() => {
                            stopAutoplay()
                            emblaApi?.scrollTo((pageIndex - 1) * getSlidesToScroll())
                            startAutoplay()
                        }" class="w-2 h-2 rounded-full transition-all"
                            :class="Math.floor((current - 1) / getSlidesToScroll()) === (pageIndex - 1) ? 'bg-primary w-8' : 'bg-neutral-300'">
                        </button>
                    </div>

                    <!-- Bouton suivant -->
                    <Button @click="handleNext" variant="outline"
                        class="rounded-full border border-neutral-300 flex items-center justify-center p-1 transition-colors">
                        <CarouselNext class="static translate-y-0" />
                    </Button>
                </div>
            </Carousel>

            <!-- CTA pour voir toutes les publications -->
            <div class="flex justify-center">
                <Button @click="handleViewAllPublications" variant="outline" color="primary" size="lg">
                    <p class="font-bold" style="font-family: Roboto, sans-serif;">
                        Voir toutes nos publications
                    </p>
                </Button>
            </div>
        </div>
    </section>
</template>
