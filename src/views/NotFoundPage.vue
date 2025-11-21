<script setup lang="ts">
/**
 * Page 404 - Not Found
 * Page d'erreur affichée lorsqu'une route n'existe pas
 * Design thématique avec la couleur primary
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const router = useRouter()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    home: byPrefixAndName.fas?.['home'],
    arrowLeft: byPrefixAndName.fas?.['arrow-left'],
    compass: byPrefixAndName.fas?.['compass'],
    search: byPrefixAndName.fas?.['magnifying-glass'],
}))

/**
 * Actions
 */
const goHome = () => {
    router.push('/')
}

const goBack = () => {
    // Si l'historique existe, revenir en arrière, sinon aller à l'accueil
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/')
    }
}

const goToShop = () => {
    router.push('/boutique')
}
</script>

<template>
    <DefaultLayout>
        <section class="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-neutral-50">
            <div class="max-w-2xl mx-auto flex flex-col items-center gap-8 text-center">
                <!-- Icône 404 avec design primary -->
                <div class="relative">
                    <!-- Circle background avec effet de pulse -->
                    <div class="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>

                    <!-- Icône principale -->
                    <div class="relative bg-gradient-to-br from-primary to-[#aa0000] p-8 md:p-12 rounded-full shadow-2xl shadow-primary/20">
                        <FontAwesomeIcon
                            v-if="icons.compass"
                            :icon="icons.compass"
                            class="w-16 h-16 md:w-24 md:h-24 text-white animate-spin"
                            style="animation-duration: 8s;"
                        />
                    </div>
                </div>

                <!-- Code 404 -->
                <div class="flex flex-col gap-2">
                    <h1 class="font-black text-6xl md:text-8xl text-primary leading-none tracking-tight"
                        style="font-family: Roboto, sans-serif;">
                        404
                    </h1>
                    <div class="h-1 w-24 mx-auto bg-gradient-to-r from-primary to-[#aa0000] rounded-full"></div>
                </div>

                <!-- Message principal -->
                <div class="flex flex-col gap-3">
                    <h2 class="font-bold text-2xl md:text-4xl text-neutral-800 leading-tight"
                        style="font-family: Roboto, sans-serif;">
                        Page introuvable
                    </h2>
                    <p class="font-normal text-base md:text-lg text-neutral-600 leading-relaxed max-w-md"
                        style="font-family: Roboto, sans-serif;">
                        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                        Utilisez les boutons ci-dessous pour retrouver votre chemin.
                    </p>
                </div>

                <!-- Suggestions avec icônes -->
                <div class="flex flex-col gap-3 w-full max-w-md">
                    <p class="font-semibold text-sm text-neutral-500 uppercase tracking-wide"
                       style="font-family: Roboto, sans-serif;">
                        Suggestions
                    </p>
                    <div class="flex flex-wrap gap-2 justify-center">
                        <div class="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg text-sm text-neutral-600"
                             style="font-family: Roboto, sans-serif;">
                            <FontAwesomeIcon v-if="icons.search" :icon="icons.search" class="w-3 h-3" />
                            Vérifiez l'URL
                        </div>
                        <div class="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg text-sm text-neutral-600"
                             style="font-family: Roboto, sans-serif;">
                            <FontAwesomeIcon v-if="icons.home" :icon="icons.home" class="w-3 h-3" />
                            Retournez à l'accueil
                        </div>
                    </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <!-- Bouton principal : Retour accueil -->
                    <Button
                        @click="goHome"
                        variant="default"
                        color="primary"
                        size="lg"
                        class="flex-1"
                    >
                        <FontAwesomeIcon v-if="icons.home" :icon="icons.home" class="w-4 h-4 mr-2" />
                        <span style="font-family: Roboto, sans-serif;">Retour à l'accueil</span>
                    </Button>

                    <!-- Bouton secondaire : Retour arrière -->
                    <Button
                        @click="goBack"
                        variant="outline"
                        color="neutral-800"
                        size="lg"
                        class="flex-1"
                    >
                        <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="w-4 h-4 mr-2" />
                        <span style="font-family: Roboto, sans-serif;">Page précédente</span>
                    </Button>
                </div>

                <!-- Lien vers la boutique -->
                <div class="pt-4 border-t border-neutral-200 w-full max-w-md">
                    <p class="font-normal text-sm text-neutral-600 mb-3"
                       style="font-family: Roboto, sans-serif;">
                        Ou découvrez nos publications
                    </p>
                    <Button
                        @click="goToShop"
                        variant="ghost"
                        color="primary"
                        class="mx-auto"
                    >
                        <span class="font-semibold" style="font-family: Roboto, sans-serif;">
                            Visiter la boutique →
                        </span>
                    </Button>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>
