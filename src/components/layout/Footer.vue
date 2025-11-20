<script setup lang="ts">
/**
 * Composant Footer
 * Footer global du site
 */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    youtube: byPrefixAndName.fab?.['youtube'],
}))

/**
 * Année courante pour le copyright
 */
const currentYear = new Date().getFullYear()

/**
 * Navigation
 */
const navigate = (path: string) => {
    router.push(path)
}
</script>

<template>
    <footer class="bg-neutral-800 px-[50px] py-[25px] w-full">
        <div class="flex flex-col gap-[47.844px] w-full">
            <!-- Contenu principal du footer - 3 colonnes -->
            <div class="flex gap-24 items-start justify-between w-full mx-auto">
                <!-- Colonne 1 : À propos -->
                <div class="flex-1 flex flex-col gap-3 items-start max-w-md">
                    <!-- Titre et description -->
                    <div class="flex flex-col gap-4 w-full">
                        <div class="flex flex-col gap-1">
                            <h3 class="font-bold text-xl text-white leading-7" style="font-family: Roboto, sans-serif;">
                                Éditions Jean de Portal
                            </h3>
                            <p class="font-medium text-sm text-[#6c757d] leading-4"
                                style="font-family: Roboto, sans-serif;">
                                L'expertise patrimoniale de référence
                            </p>
                        </div>
                        <p class="font-normal text-[14px] text-[#b0bec5] leading-[22px]"
                            style="font-family: Roboto, sans-serif;">
                            Depuis plus de 15 ans, nous accompagnons les investisseurs avertis avec des publications de
                            référence et des consultations privées exclusives.
                        </p>
                    </div>
                </div>

                <!-- Colonne 2 : Navigation principale -->
                <div class="flex-1 flex flex-col gap-3">
                    <h4 class="font-semibold text-[18px] text-white leading-6" style="font-family: Roboto, sans-serif;">
                        Navigation
                    </h4>
                    <div class="flex flex-col gap-2 text-[14px] leading-5" style="font-family: Roboto, sans-serif;">
                        <a @click="navigate('/')"
                            class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer">
                            Notre Maison
                        </a>
                        <a @click="navigate('/consultations-nicolas-delourme')"
                            class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer">
                            Consultations Privées
                        </a>
                        <a @click="navigate('/boutique')"
                            class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer">
                            Boutique
                        </a>
                        <a href="#" class="font-normal text-[#b0bec5] hover:text-white transition-colors">
                            Contact
                        </a>
                    </div>
                </div>

                <!-- Colonne 3 : Consultations avec YouTube -->
                <div class="flex-1 flex flex-col gap-3">
                    <h4 class="font-semibold text-[18px] text-white leading-6" style="font-family: Roboto, sans-serif;">
                        Suivez nos consultations
                    </h4>
                    <div class="flex flex-col gap-6">
                        <p class="font-normal text-[14px] text-[#b0bec5] leading-[22px]"
                            style="font-family: Roboto, sans-serif;">
                            Retrouvez tous nos lives et replays de consultations exclusives sur YouTube
                        </p>

                        <!-- Lien YouTube -->
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon v-if="icons.youtube" :icon="icons.youtube"
                                class="fa-2xl w-6 h-6 text-white hover:text-primary transition-colors" />
                        </a>
                    </div>
                </div>
            </div>

            <!-- Ligne de séparation et copyright -->
            <div class="border-t border-neutral-500 pt-[25.156px] w-full">
                <div class="flex items-start justify-between text-[12px] leading-4 w-full"
                    style="font-family: Roboto, sans-serif;">
                    <!-- Liens légaux -->
                    <div class="flex gap-[23.667px] text-[#b0bec5]">
                        <a href="#" class="hover:text-white transition-colors">CGV</a>
                        <a href="#" class="hover:text-white transition-colors">Mentions légales</a>
                        <a href="#" class="hover:text-white transition-colors">RGPD</a>
                        <a href="#" class="hover:text-white transition-colors">Cookies</a>
                    </div>

                    <!-- Copyright -->
                    <p class="text-[#6c757d]">
                        Copyright © {{ currentYear }} Éditions Jean de Portal. Tous droits réservés.
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>
