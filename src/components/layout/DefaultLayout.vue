<script setup lang="ts">
/**
 * Layout par défaut avec navbar et footer
 * Utilisé pour toutes les pages sauf celles qui désactivent explicitement la navbar ou footer
 */
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'

/**
 * Props pour contrôler l'affichage de la navbar et footer
 */
interface Props {
    /**
     * Afficher ou non la navbar
     * @default true
     */
    showNavbar?: boolean
    /**
     * Afficher ou non le footer
     * @default true
     */
    showFooter?: boolean
}

withDefaults(defineProps<Props>(), {
    showNavbar: true,
    showFooter: true,
})
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <!-- Navbar (conditionnelle) -->
        <Navbar v-if="showNavbar" />

        <!-- Contenu de la page -->
        <main class="flex flex-col flex-1">
            <slot />
        </main>

        <!-- Footer (conditionnel) -->
        <Footer v-if="showFooter" />
    </div>
</template>
