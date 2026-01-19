<script setup lang="ts">
/**
 * Page UI - Démo de la palette de couleurs
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'

const colors = [
    { name: "Project Primary", class: "bg-primary", hex: "#cc0000" },
    { name: "ND", class: "bg-consultations-nd", hex: "#1a2d40" },
    { name: "Métaux Précieux", class: "bg-consultations-nd-metauxprecieux", hex: "#dea600" },
    { name: "Immobilier", class: "bg-consultations-nd-immobilier", hex: "#489886" },
    { name: "Argent", class: "bg-consultations-nd-argent", hex: "#c8462f" },
    { name: "Patrimoine", class: "bg-consultations-nd-patrimoine", hex: "#33b9c9" },
];
</script>

<template>
    <DefaultLayout>
        <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div class="max-w-6xl w-full">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-7xl font-bold mb-4">
                    <span class="text-primary">Hello</span>
                    <span class="text-gray-800"> JDP v3</span>
                </h1>
                <p class="text-xl text-gray-600">
                    Palette de couleurs du projet
                </p>
            </div>

            <!-- Palette de couleurs -->
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6">
                    Thème personnalisé
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="color in colors" :key="color.name"
                        class="group relative overflow-hidden rounded-lg border-2 border-gray-100 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
                        <div :class="[color.class, 'h-24 w-full']"></div>
                        <div class="p-4 bg-white">
                            <h3 class="font-semibold text-gray-800 mb-1">
                                {{ color.name }}
                            </h3>
                            <code class="text-sm text-gray-500 font-mono">
                                {{ color.hex }}
                            </code>
                        </div>
                    </div>
                </div>

                <!-- Info -->
                <div class="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p class="text-sm text-gray-600">
                        ✨ Tailwind CSS 4 configuré avec <strong>{{ colors.length }}</strong> couleurs personnalisées
                    </p>
                </div>

                <!-- Démo des boutons -->
                <div class="mt-8 space-y-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                        Composants Button
                    </h2>

                    <!-- Variants avec couleur primary -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Variants (couleur: primary)</h3>
                        <div class="flex flex-wrap gap-3">
                            <Button variant="default">Default</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </div>
                    </div>

                    <!-- Couleurs avec variant default -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Couleurs (variant: default)</h3>
                        <div class="flex flex-wrap gap-3">
                            <Button color="primary">Primary</Button>
                            <Button color="nd">Nicolas Delourme</Button>
                            <Button color="metaux">Métaux Précieux</Button>
                            <Button color="immobilier">Immobilier</Button>
                            <Button color="argent">Argent</Button>
                            <Button color="patrimoine">Patrimoine</Button>
                        </div>
                    </div>

                    <!-- Couleurs avec variant outline -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Couleurs outline</h3>
                        <div class="flex flex-wrap gap-3">
                            <Button variant="outline" color="primary">Primary</Button>
                            <Button variant="outline" color="nd">Nicolas Delourme</Button>
                            <Button variant="outline" color="metaux">Métaux</Button>
                            <Button variant="outline" color="immobilier">Immobilier</Button>
                            <Button variant="outline" color="argent">Argent</Button>
                        </div>
                    </div>

                    <!-- Couleurs ghost -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Couleurs ghost</h3>
                        <div class="flex flex-wrap gap-3">
                            <Button variant="ghost" color="primary">Primary</Button>
                            <Button variant="ghost" color="nd">Nicolas Delourme</Button>
                            <Button variant="ghost" color="metaux">Métaux</Button>
                            <Button variant="ghost" color="immobilier">Immobilier</Button>
                            <Button variant="ghost" color="patrimoine">Patrimoine</Button>
                        </div>
                    </div>

                    <!-- Tailles -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Tailles</h3>
                        <div class="flex flex-wrap items-center gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="xl">Extra Large</Button>
                        </div>
                    </div>

                    <!-- Rounded -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Border radius</h3>
                        <div class="flex flex-wrap gap-3">
                            <Button rounded="none">None</Button>
                            <Button rounded="sm">Small (default)</Button>
                            <Button rounded="default">Default</Button>
                            <Button rounded="lg">Large</Button>
                            <Button rounded="full">Full</Button>
                        </div>
                    </div>

                    <!-- Exemples combinés -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Exemples combinés</h3>
                        <div class="flex flex-wrap gap-3">
                            <Button variant="default" color="metaux" size="lg" rounded="lg">
                                Consulter Métaux
                            </Button>
                            <Button variant="outline" color="immobilier" size="default" rounded="full">
                                Immobilier
                            </Button>
                            <Button variant="ghost" color="patrimoine" size="xl">
                                Patrimoine
                            </Button>
                            <Button variant="link" color="argent">
                                Lien Argent
                            </Button>
                        </div>
                    </div>

                    <!-- Bouton vers l'Académie -->
                    <div class="mt-6 text-center pt-6 border-t border-gray-200">
                        <Button as-child variant="default" color="primary" size="lg" rounded="sm">
                            <RouterLink to="/academie">
                                Découvrir l'Académie
                            </RouterLink>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </DefaultLayout>
</template>
