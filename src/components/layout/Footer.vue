<script setup lang="ts">
/**
 * Composant Footer
 * Footer global du site - responsive avec accordéons sur mobile
 */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

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
    <footer class="bg-neutral-800 px-4 py-6 md:px-8 md:py-[25px] lg:px-12 xl:px-[50px] w-full">
        <div class="flex flex-col gap-8 md:gap-12 w-full">
            <!-- Desktop: 3 colonnes (visible >= 768px) -->
            <div class="hidden md:flex gap-8 lg:gap-16 xl:gap-24 items-start justify-between w-full mx-auto">
                <!-- Colonne 1 : À propos -->
                <div class="flex-1 flex flex-col gap-3 items-start max-w-md">
                    <div class="flex flex-col gap-4 w-full">
                        <div class="flex flex-col gap-1">
                            <h3 class="font-bold text-xl text-white leading-7" style="font-family: Roboto, sans-serif;">
                                Infocash Académie
                            </h3>
                            <p class="font-medium text-sm text-[#6c757d] leading-4"
                                style="font-family: Roboto, sans-serif;">
                                L'éducation financière premium
                            </p>
                        </div>
                        <p class="font-normal text-[14px] text-[#b0bec5] leading-[22px]"
                            style="font-family: Roboto, sans-serif;">
                            Formations, tutoriels et consultations exclusives pour maîtriser vos investissements
                            et construire votre liberté financière.
                        </p>
                    </div>
                </div>

                <!-- Colonne 2 : Navigation principale -->
                <div class="flex-1 flex flex-col gap-3">
                    <h4 class="font-semibold text-[18px] text-white leading-6" style="font-family: Roboto, sans-serif;">
                        Navigation
                    </h4>
                    <div class="flex flex-col gap-2 text-[14px] leading-5" style="font-family: Roboto, sans-serif;">
                        <a href="/" @click.prevent="navigate('/')"
                            class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer">
                            Accueil
                        </a>
                        <a href="/academie" @click.prevent="navigate('/academie')"
                            class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer">
                            Académie
                        </a>
                        <a href="/boutique" @click.prevent="navigate('/boutique')"
                            class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer">
                            Boutique
                        </a>
                        <a href="/notre-maison" @click.prevent="navigate('/notre-maison')"
                            class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer">
                            Notre Maison
                        </a>
                    </div>
                </div>

                <!-- Colonne 3 : YouTube -->
                <div class="flex-1 flex flex-col gap-3">
                    <h4 class="font-semibold text-[18px] text-white leading-6" style="font-family: Roboto, sans-serif;">
                        Suivez-nous
                    </h4>
                    <div class="flex flex-col gap-6">
                        <p class="font-normal text-[14px] text-[#b0bec5] leading-[22px]"
                            style="font-family: Roboto, sans-serif;">
                            Retrouvez tous nos contenus gratuits sur la chaîne YouTube Infocash
                        </p>

                        <!-- Lien YouTube -->
                        <a href="https://www.youtube.com/@infocash" target="_blank" rel="noopener noreferrer" aria-label="Chaîne YouTube Infocash">
                            <FontAwesomeIcon v-if="icons.youtube" :icon="icons.youtube"
                                class="fa-2xl w-6 h-6 text-white hover:text-primary transition-colors" />
                        </a>
                    </div>
                </div>
            </div>

            <!-- Mobile: Accordéons (visible < 768px) -->
            <Accordion type="multiple" class="md:hidden w-full" collapsible>
                <!-- Accordéon 1 : À propos -->
                <AccordionItem value="about" class="border-neutral-500">
                    <AccordionTrigger class="text-white font-semibold text-base hover:no-underline py-4"
                                      style="font-family: Roboto, sans-serif;">
                        À propos
                    </AccordionTrigger>
                    <AccordionContent class="pb-4">
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-col gap-1">
                                <h3 class="font-bold text-lg text-white leading-6" style="font-family: Roboto, sans-serif;">
                                    Infocash Académie
                                </h3>
                                <p class="font-medium text-sm text-[#6c757d] leading-4"
                                    style="font-family: Roboto, sans-serif;">
                                    L'éducation financière premium
                                </p>
                            </div>
                            <p class="font-normal text-sm text-[#b0bec5] leading-[22px]"
                                style="font-family: Roboto, sans-serif;">
                                Formations, tutoriels et consultations exclusives pour maîtriser vos investissements
                                et construire votre liberté financière.
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <!-- Accordéon 2 : Navigation -->
                <AccordionItem value="navigation" class="border-neutral-500">
                    <AccordionTrigger class="text-white font-semibold text-base hover:no-underline py-4"
                                      style="font-family: Roboto, sans-serif;">
                        Navigation
                    </AccordionTrigger>
                    <AccordionContent class="pb-4">
                        <div class="flex flex-col gap-3 text-sm leading-5" style="font-family: Roboto, sans-serif;">
                            <a href="/" @click.prevent="navigate('/')"
                                class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer py-1">
                                Accueil
                            </a>
                            <a href="/academie" @click.prevent="navigate('/academie')"
                                class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer py-1">
                                Académie
                            </a>
                            <a href="/boutique" @click.prevent="navigate('/boutique')"
                                class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer py-1">
                                Boutique
                            </a>
                            <a href="/notre-maison" @click.prevent="navigate('/notre-maison')"
                                class="font-normal text-[#b0bec5] hover:text-white transition-colors cursor-pointer py-1">
                                Notre Maison
                            </a>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <!-- Accordéon 3 : Suivez-nous -->
                <AccordionItem value="social" class="border-neutral-500">
                    <AccordionTrigger class="text-white font-semibold text-base hover:no-underline py-4"
                                      style="font-family: Roboto, sans-serif;">
                        Suivez-nous
                    </AccordionTrigger>
                    <AccordionContent class="pb-4">
                        <div class="flex flex-col gap-4">
                            <p class="font-normal text-sm text-[#b0bec5] leading-[22px]"
                                style="font-family: Roboto, sans-serif;">
                                Retrouvez tous nos contenus gratuits sur la chaîne YouTube Infocash
                            </p>

                            <!-- Lien YouTube -->
                            <a href="https://www.youtube.com/@infocash" target="_blank" rel="noopener noreferrer"
                               class="inline-flex" aria-label="Chaîne YouTube Infocash">
                                <FontAwesomeIcon v-if="icons.youtube" :icon="icons.youtube"
                                    class="fa-2xl w-6 h-6 text-white hover:text-primary transition-colors" />
                            </a>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <!-- Ligne de séparation et copyright -->
            <div class="border-t border-neutral-500 pt-6 md:pt-[25px] w-full">
                <div class="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center md:justify-between text-xs md:text-[12px] leading-4 w-full"
                    style="font-family: Roboto, sans-serif;">
                    <!-- Liens légaux - Grid 2x2 sur mobile, horizontal sur desktop -->
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:gap-6 text-[#b0bec5]">
                        <a href="/cgv" @click.prevent="navigate('/cgv')" class="hover:text-white transition-colors cursor-pointer">CGV</a>
                        <a href="/mentions-legales" @click.prevent="navigate('/mentions-legales')" class="hover:text-white transition-colors cursor-pointer">Mentions légales</a>
                        <a href="/confidentialite" @click.prevent="navigate('/confidentialite')" class="hover:text-white transition-colors cursor-pointer">RGPD</a>
                        <a href="/cookies" @click.prevent="navigate('/cookies')" class="hover:text-white transition-colors cursor-pointer">Cookies</a>
                    </div>

                    <!-- Copyright -->
                    <p class="text-[#6c757d] w-full md:w-auto text-left md:text-right">
                        © {{ currentYear }} Infocash Académie. Tous droits réservés.
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>
