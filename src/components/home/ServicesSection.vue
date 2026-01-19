<script setup lang="ts">
/**
 * Composant ServicesSection
 * Présentation des deux formats d'accès à l'expertise : Consultations et Publications
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Badge from '../ui/badge/Badge.vue'

const router = useRouter()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    consultationsNd: byPrefixAndName.fak?.['consultations-nd'],
    book: byPrefixAndName.fas?.['book'],
}))

/**
 * Actions
 */
const handleLearnMoreConsultations = () => {
    router.push('/consultations-nicolas-delourme')
}

const handleDiscoverCollections = () => {
    router.push('/boutique')
}
</script>

<template>
    <section class="bg-linear-to-r from-neutral-100 to-neutral-50 py-5">
        <div class="flex flex-col gap-5 px-4 max-w-6xl mx-auto w-full">
            <!-- En-tête de section -->
            <div class="flex flex-col gap-3 items-center justify-center w-full">
                <!-- Badge rouge -->
                <Badge class="bg-linear-to-r from-[#aa0000] to-primary px-6 py-2 rounded-full">
                    <p class="font-bold text-sm text-center text-white tracking-[0.7px] uppercase"
                        style="font-family: Roboto, sans-serif;">
                        Notre univers éditorial
                    </p>
                </Badge>

                <!-- Titre principal -->
                <h2 class="font-bold text-4xl text-neutral-800 text-center leading-10"
                    style="font-family: Roboto, sans-serif;">
                    Deux façons d'accéder à notre expertise
                </h2>

                <!-- Sous-titre -->
                <p class="font-normal text-lg text-neutral-600 text-center leading-8 max-w-2xl"
                    style="font-family: Roboto, sans-serif;">
                    Choisissez le format qui vous correspond le mieux pour développer vos connaissances patrimoniales
                </p>
            </div>

            <!-- Deux cartes -->
            <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center w-full">
                <!-- Carte 1 : Consultations Privées -->
                <div class="flex-1 bg-white border border-neutral-200 rounded-md p-6 relative flex flex-col">
                    <!-- Image avec badges -->
                    <div class="relative h-64">
                        <img src="https://www.figma.com/api/mcp/asset/afbc6451-6700-4b48-a488-72ab19a253da"
                            alt="Consultations Privées"
                            class="w-full h-full object-cover rounded-md shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)]" />


                        <div class="absolute top-3 flex justify-between items-center w-full px-3">
                            <!-- Badge "Live Exclusif" -->
                            <div class="bg-neutral-200 flex gap-3 items-center px-4 py-2 rounded-full shadow-sm">
                                <div
                                    class="bg-primary animate-pulse duration-1000 opacity-[0.876]  rounded-full w-3 h-3" />
                                <p class="font-bold text-xs text-neutral-800 leading-5"
                                    style="font-family: Roboto, sans-serif;">
                                    Live Exclusif
                                </p>
                            </div>

                            <!-- Badge "Notre nouveau format" -->
                            <div class=" bg-yellow-500 px-4 py-2 rounded-full">
                                <p class="font-bold text-xs text-white tracking-[0.6px] uppercase leading-4"
                                    style="font-family: Roboto, sans-serif;">
                                    Notre nouveau format
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Contenu -->
                    <div class="flex flex-col gap-5 mt-5 flex-1">
                        <!-- Titre avec icône -->
                        <div class="flex gap-2 items-center">
                            <div class="">
                                <FontAwesomeIcon v-if="icons.consultationsNd" :icon="icons.consultationsNd" size="2xl"
                                    class="w-8 h-8 text-primary" />
                            </div>
                            <h3 class="font-bold text-3xl text-neutral-800 leading-9"
                                style="font-family: Roboto, sans-serif;">
                                Consultations Privées
                            </h3>
                        </div>

                        <!-- Description -->
                        <p class="font-normal text-base text-neutral-600 flex-1"
                            style="font-family: Roboto, sans-serif;">
                            Rejoignez nos lives hebdomadaires exclusifs où Nicolas Delourme et ses experts répondent à
                            vos questions personnalisées. Recevez des dossiers PDF détaillés après chaque consultation
                            et accédez aux replays à vie. Un format unique pour un accompagnement sur-mesure.
                        </p>

                        <!-- Stats -->
                        <div class="flex gap-5 w-full">
                            <div
                                class="flex-1 bg-neutral-100 flex flex-col gap-1 items-center justify-center py-4 rounded-md shadow-sm">
                                <p class="font-bold text-3xl text-primary leading-8"
                                    style="font-family: Roboto, sans-serif;">
                                    1
                                </p>
                                <p class="font-medium text-xs text-neutral-600 leading-4"
                                    style="font-family: Roboto, sans-serif;">
                                    Live/semaine
                                </p>
                            </div>
                            <div
                                class="flex-1 bg-neutral-100 flex flex-col gap-1 items-center justify-center py-4 rounded-md shadow-sm">
                                <p class="font-bold text-3xl text-primary leading-8"
                                    style="font-family: Roboto, sans-serif;">
                                    PDF
                                </p>
                                <p class="font-medium text-xs text-neutral-600 leading-4"
                                    style="font-family: Roboto, sans-serif;">
                                    Inclus
                                </p>
                            </div>
                            <div
                                class="flex-1 bg-neutral-100 flex flex-col gap-1 items-center justify-center py-4 rounded-md shadow-sm">
                                <p class="font-bold text-3xl text-primary leading-8"
                                    style="font-family: Roboto, sans-serif;">
                                    ∞
                                </p>
                                <p class="font-medium text-xs text-neutral-600 leading-4"
                                    style="font-family: Roboto, sans-serif;">
                                    Replays
                                </p>
                            </div>
                        </div>

                        <!-- Bouton CTA -->
                        <Button @click="handleLearnMoreConsultations" class="w-full mt-auto" size="lg">
                            <p class="font-bold " style="font-family: Roboto, sans-serif;">
                                En savoir plus sur les consultations
                            </p>
                        </Button>
                    </div>
                </div>

                <!-- Carte 2 : Collections & Publications -->
                <div class="flex-1 bg-white border border-neutral-200 rounded-md p-6 relative flex flex-col">
                    <!-- Image avec badges -->
                    <div class="relative h-64">
                        <img src="https://www.figma.com/api/mcp/asset/977b7c08-626a-41de-beee-7b0f8a7c5a8e"
                            alt="Collections & Publications"
                            class="w-full h-full object-cover rounded-md shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)]" />

                        <div class="absolute top-3 flex justify-end items-center w-full px-3">
                            <!-- Badge "Publications Premium" -->
                            <div class="bg-neutral-100 px-4 py-2 rounded-full shadow-sm">
                                <p class="font-bold text-xs text-neutral-800 leading-5"
                                    style="font-family: Roboto, sans-serif;">
                                    Publications Premium
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Contenu -->
                    <div class="flex flex-col gap-5 mt-5 flex-1">
                        <!-- Titre avec icône -->
                        <div class="flex gap-2 items-center">
                            <div class="">
                                <FontAwesomeIcon v-if="icons.book" :icon="icons.book" size="2xl"
                                    class="w-8 h-8 text-yellow-500" />
                            </div>
                            <h3 class="font-bold text-3xl text-neutral-800 leading-9"
                                style="font-family: Roboto, sans-serif;">
                                Collections & Publications
                            </h3>
                        </div>

                        <!-- Description -->
                        <p class="font-normal text-base text-neutral-600 flex-1"
                            style="font-family: Roboto, sans-serif;">
                            Découvrez nos ouvrages de référence, dossiers thématiques approfondis et analyses
                            exclusives. Des publications expertes pour maîtriser tous les aspects de la gestion
                            patrimoniale moderne, rédigées par nos spécialistes reconnus.
                        </p>

                        <!-- Stats -->
                        <div class="flex gap-5 w-full">
                            <div
                                class="flex-1 bg-neutral-100 flex flex-col gap-1 items-center justify-center py-4 rounded-md shadow-sm">
                                <p class="font-bold text-3xl text-yellow-500 leading-8"
                                    style="font-family: Roboto, sans-serif;">
                                    12
                                </p>
                                <p class="font-medium text-xs text-neutral-600 leading-4"
                                    style="font-family: Roboto, sans-serif;">
                                    Collections
                                </p>
                            </div>
                            <div
                                class="flex-1 bg-neutral-100 flex flex-col gap-1 items-center justify-center py-4 rounded-md shadow-sm">
                                <p class="font-bold text-3xl text-yellow-500 leading-8"
                                    style="font-family: Roboto, sans-serif;">
                                    150+
                                </p>
                                <p class="font-medium text-xs text-neutral-600 leading-4"
                                    style="font-family: Roboto, sans-serif;">
                                    Publications
                                </p>
                            </div>
                            <div
                                class="flex-1 bg-neutral-100 flex flex-col gap-1 items-center justify-center py-4 rounded-md shadow-sm">
                                <p class="font-bold text-3xl text-yellow-500 leading-8"
                                    style="font-family: Roboto, sans-serif;">
                                    PDF
                                </p>
                                <p class="font-medium text-xs text-neutral-600 leading-4"
                                    style="font-family: Roboto, sans-serif;">
                                    & Papier
                                </p>
                            </div>
                        </div>

                        <!-- Bouton CTA -->
                        <Button @click="handleDiscoverCollections" variant="outline" color="yellow-500"
                            class="w-full mt-auto" size="lg">
                            <p class="font-bold" style="font-family: Roboto, sans-serif;">
                                Découvrir nos collections
                            </p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
