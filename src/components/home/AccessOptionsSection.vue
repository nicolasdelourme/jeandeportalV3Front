<script setup lang="ts">
/**
 * Composant AccessOptionsSection
 * Section présentant les deux façons d'accéder aux contenus : Achat et Abonnement
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    basket: byPrefixAndName.fas?.['basket-shopping'],
    consultationsNd: byPrefixAndName.fak?.['consultations-nd'],
}))

type IconKey = 'basket' | 'consultationsNd'

/**
 * Helper pour récupérer une icône de manière typée
 */
const getIcon = (iconKey: IconKey): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

/**
 * Actions
 */
const handleExploreBoutique = () => {
    router.push('/boutique')
}

const handleViewFormulas = () => {
    router.push('/consultations-nicolas-delourme/invitation')
}
</script>

<template>
    <section class="bg-neutral-50 py-16">
        <div class="flex flex-col gap-12 px-4 max-w-6xl mx-auto w-full">
            <!-- Titre de section -->
            <h2 class="font-bold text-4xl text-neutral-800 text-center leading-10"
                style="font-family: Roboto, sans-serif;">
                Comment accéder à nos contenus ?
            </h2>

            <!-- Deux cartes -->
            <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center w-full">
                <!-- Carte 1 : Achat à l'unité ou en collection -->
                <div class="flex-1 bg-white border border-neutral-200 rounded-md p-8 flex flex-col items-center gap-6">
                    <!-- Icône -->
                    <div class="w-16 h-16 rounded-md flex items-center justify-center"
                        style="background: linear-gradient(135deg, var(--color-yellow-600), var(--color-yellow-500))">
                        <FontAwesomeIcon v-if="getIcon('basket')" :icon="getIcon('basket')" class="w-8 h-8 text-white"
                            size="2xl" />
                    </div>

                    <!-- Titre -->
                    <h3 class="font-bold text-2xl text-neutral-800 text-center leading-8"
                        style="font-family: Roboto, sans-serif;">
                        Achat à l'unité ou en collection
                    </h3>

                    <!-- Description -->
                    <p class="font-normal text-base text-neutral-600 text-center leading-6 flex-1"
                        style="font-family: Roboto, sans-serif;">
                        Choisissez vos publications papier ou PDF selon vos besoins spécifiques. Accès immédiat aux
                        contenus numériques.
                    </p>

                    <!-- Stats -->
                    <div class="flex gap-8 w-full justify-center">
                        <div class="flex flex-col items-center gap-1">
                            <p class="font-bold text-3xl text-yellow-600 leading-8"
                                style="font-family: Roboto, sans-serif;">
                                150+
                            </p>
                            <p class="font-medium text-sm text-neutral-600 leading-5"
                                style="font-family: Roboto, sans-serif;">
                                Publications
                            </p>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                            <p class="font-bold text-3xl text-yellow-600 leading-8"
                                style="font-family: Roboto, sans-serif;">
                                PDF
                            </p>
                            <p class="font-medium text-sm text-neutral-600 leading-5"
                                style="font-family: Roboto, sans-serif;">
                                & Papier
                            </p>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                            <p class="font-bold text-3xl text-yellow-600 leading-8"
                                style="font-family: Roboto, sans-serif;">
                                79€
                            </p>
                            <p class="font-medium text-sm text-neutral-600 leading-5"
                                style="font-family: Roboto, sans-serif;">
                                À partir de
                            </p>
                        </div>
                    </div>

                    <!-- Bouton CTA -->
                    <Button @click="handleExploreBoutique" color="yellow-600" class="w-full mt-auto" size="lg">
                        <p class="font-bold" style="font-family: Roboto, sans-serif;">
                            Parcourir la boutique
                        </p>
                    </Button>
                </div>

                <!-- Carte 2 : Abonnement mensuel ou annuel -->
                <div class="flex-1 bg-white border border-neutral-200 rounded-md p-8 flex flex-col items-center gap-6">
                    <!-- Icône -->
                    <div class="w-16 h-16 rounded-md flex items-center justify-center"
                        style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary))">
                        <FontAwesomeIcon v-if="getIcon('consultationsNd')" :icon="getIcon('consultationsNd')"
                            class="w-8 h-8 text-white" size="2xl" />
                    </div>

                    <!-- Titre -->
                    <h3 class="font-bold text-2xl text-neutral-800 text-center leading-8"
                        style="font-family: Roboto, sans-serif;">
                        Abonnement mensuel ou annuel
                    </h3>

                    <!-- Description -->
                    <p class="font-normal text-base text-neutral-600 text-center leading-6 flex-1"
                        style="font-family: Roboto, sans-serif;">
                        Choisissez une ou plusieurs thématiques, résiliable à tout moment. Accès complet aux lives
                        et replays.
                    </p>

                    <!-- Stats -->
                    <div class="flex gap-8 w-full justify-center">
                        <div class="flex flex-col items-center gap-1">
                            <p class="font-bold text-3xl text-primary leading-8"
                                style="font-family: Roboto, sans-serif;">
                                1
                            </p>
                            <p class="font-medium text-sm text-neutral-600 leading-5"
                                style="font-family: Roboto, sans-serif;">
                                Live/semaine
                            </p>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                            <p class="font-bold text-3xl text-primary leading-8"
                                style="font-family: Roboto, sans-serif;">
                                PDF
                            </p>
                            <p class="font-medium text-sm text-neutral-600 leading-5"
                                style="font-family: Roboto, sans-serif;">
                                Inclus
                            </p>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                            <p class="font-bold text-3xl text-primary leading-8"
                                style="font-family: Roboto, sans-serif;">
                                ∞
                            </p>
                            <p class="font-medium text-sm text-neutral-600 leading-5"
                                style="font-family: Roboto, sans-serif;">
                                Replays
                            </p>
                        </div>
                    </div>

                    <!-- Bouton CTA -->
                    <Button @click="handleViewFormulas" color="primary" class="w-full mt-auto" size="lg">
                        <p class="font-bold" style="font-family: Roboto, sans-serif;">
                            Voir les formules
                        </p>
                    </Button>
                </div>
            </div>
        </div>
    </section>
</template>
