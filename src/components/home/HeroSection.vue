<script setup lang="ts">
/**
 * Composant HeroSection
 * Section hero de la page d'accueil avec présentation et CTA
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    chevronDown: byPrefixAndName.fas?.['chevron-down'],
    video: byPrefixAndName.fas?.['video'],
}))

/**
 * Props
 */
interface Props {
    /**
     * Image à afficher à droite (optionnelle)
     */
    image?: string
    /**
     * Texte du prochain live
     */
    nextLive?: string
}

const props = withDefaults(defineProps<Props>(), {
    image: 'https://www.figma.com/api/mcp/asset/ee92c412-d302-41d0-bf34-afb5ddd69ab3',
    nextLive: 'Prochain live : 6 novembre à 18h30 - Argent',
})

/**
 * Actions
 */
const handleDiscoverFormulas = () => {
    router.push('/consultations-nicolas-delourme/invitation')
}

const handleViewCalendar = () => {
    router.push('/consultations-nicolas-delourme')
}

const handleScrollDown = () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    })
}
</script>

<template>
    <section
        class="bg-linear-to-b from-consultations-nd to-consultations-nd/90 flex flex-col gap-4 md:gap-8 items-center py-8 md:py-12 w-full">
        <!-- Contenu principal -->
        <div class="flex flex-col md:flex-row md:gap-[50px] items-center justify-center overflow-hidden px-4 md:px-12 lg:px-[50px] py-0 w-full max-w-7xl">
            <!-- Colonne gauche : Texte et CTA -->
            <div class="flex-1 flex flex-col gap-2.5 items-start w-full">
                <div class="flex flex-col gap-6 md:gap-[35.397px] items-center justify-center w-full">
                    <!-- Badge doré responsive -->
                    <div
                        class="bg-linear-to-r from-yellow-300 to-yellow-500 px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow-[0px_4px_16px_0px_rgba(222,166,0,0.3)]">
                        <p class="font-bold text-xs md:text-[14px] text-consultations-nd text-center tracking-[0.7px] uppercase leading-5"
                            style="font-family: Roboto, sans-serif;">
                            <!-- Texte court sur mobile, complet sur desktop -->
                            <span class="md:hidden">Jean de Portal</span>
                            <span class="hidden md:inline">Les Éditions Jean de Portal présentent</span>
                        </p>
                    </div>

                    <!-- Titre principal responsive -->
                    <h1 class="flex flex-col font-bold items-center text-2xl sm:text-3xl md:text-5xl text-center w-full"
                        style="font-family: Roboto, sans-serif;">
                        <span class="bg-linear-to-r from-neutral-200 to-white bg-clip-text text-transparent">
                            L'expertise patrimoniale
                        </span>
                        <span class="text-yellow-500">
                            sous toutes ses formes
                        </span>
                    </h1>

                    <!-- Sous-titre responsive -->
                    <p class="font-light text-base md:text-[24px] text-[#f1f4f7] text-center leading-normal md:leading-[33.6px] w-full"
                        style="font-family: Roboto, sans-serif;">
                        Protégez et développez votre patrimoine grâce aux conseils d'experts
                    </p>

                    <!-- Description responsive -->
                    <p class="font-normal text-sm md:text-[18px] text-white text-center leading-relaxed md:leading-[30.6px] w-full"
                        style="font-family: Roboto, sans-serif;">
                        Depuis plus de 15 ans, nous accompagnons les investisseurs avertis avec des publications de
                        référence et des consultations privées exclusives. Notre mission : démocratiser l'expertise
                        patrimoniale pour vous aider à prendre les meilleures décisions financières dans un monde en
                        constante évolution.
                    </p>

                    <!-- Prochain live responsive -->
                    <div class="flex gap-2 items-center justify-center w-full">
                        <div class="bg-primary opacity-[0.891] rounded-full w-2.5 h-2.5 md:w-3 md:h-3" />
                        <p class="font-semibold text-sm md:text-base text-center text-white leading-6"
                            style="font-family: Roboto, sans-serif;">
                            {{ nextLive }}
                        </p>
                    </div>

                    <!-- Boutons CTA responsive -->
                    <div class="flex flex-col md:flex-row gap-3 md:gap-6 items-center justify-center w-full">
                        <!-- Bouton Découvrir les formules -->
                        <Button @click="handleDiscoverFormulas" class="w-full md:w-auto">
                            <p style="font-family: Roboto, sans-serif;">
                                Découvrir les formules
                            </p>
                        </Button>

                        <!-- Bouton Voir le calendrier -->
                        <Button @click="handleViewCalendar" variant="outline" color="neutral-900"
                                class="text-white w-full md:w-auto">
                            <p style="font-family: Roboto, sans-serif;">
                                <!-- Texte court sur mobile, complet sur desktop -->
                                <span class="md:hidden">Le calendrier</span>
                                <span class="hidden md:inline">Voir le calendrier des consultations</span>
                            </p>
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Colonne droite : Image avec bouton play (masquée sur mobile) -->
            <div class="hidden md:flex flex-col items-start opacity-30 shrink-0" v-if="image">
                <div class="relative w-[384px] h-[509.328px]">
                    <!-- Image -->
                    <div class="absolute inset-0 border-4 border-black rounded-[20px] overflow-hidden">
                        <img :src="image" alt="Nicolas Delourme Expert"
                            class="w-full h-full object-cover rounded-[20px]" />
                    </div>

                    <!-- Bouton Play flottant -->
                    <div
                        class="absolute left-[336px] top-[461.66px] bg-linear-to-r from-[#aa0000] to-primary p-4 rounded-full shadow-[0px_8px_24px_0px_rgba(204,0,0,0.4)] cursor-pointer hover:scale-110 transition-transform">
                        <FontAwesomeIcon v-if="icons.video" :icon="icons.video" class="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Section "Découvrir notre univers" avec flèche responsive -->
        <div class="flex flex-col gap-3 md:gap-5 items-center justify-center cursor-pointer my-0.5" @click="handleScrollDown">
            <p class="font-medium text-xs md:text-sm text-neutral-200 text-center leading-5"
                style="font-family: Roboto, sans-serif;">
                Découvrir notre univers
            </p>
            <FontAwesomeIcon v-if="icons.chevronDown" :icon="icons.chevronDown"
                class="w-5 h-5 md:w-6 md:h-6 text-[#b0bec5] animate-bounce" />
        </div>
    </section>
</template>
