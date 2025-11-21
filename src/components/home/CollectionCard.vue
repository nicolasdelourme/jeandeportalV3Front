<script setup lang="ts">
/**
 * Composant CollectionCard
 * Carte réutilisable pour afficher une collection thématique
 * Utilisé dans Grid (desktop) et Accordion (mobile)
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

/**
 * Props
 */
interface Props {
    /**
     * ID de la collection
     */
    id: string
    /**
     * Titre de la collection
     */
    title: string
    /**
     * Sous-titre de la collection
     */
    subtitle: string
    /**
     * Description de la collection
     */
    description: string
    /**
     * Icône FontAwesome
     */
    icon: IconDefinition
    /**
     * Couleur thématique (variable CSS)
     */
    color: string
    /**
     * Statistiques (nombre de publications, pages, etc.)
     */
    stats: Array<{ value: string; label: string }>
}

const props = defineProps<Props>()

/**
 * Émissions
 */
const emit = defineEmits<{
    explore: [collectionId: string]
}>()

const handleExplore = () => {
    emit('explore', props.id)
}
</script>

<template>
    <div class="bg-white border border-neutral-200 rounded-lg p-6 flex flex-col gap-5 hover:shadow-lg transition-shadow">
        <!-- En-tête avec icône -->
        <div class="flex gap-3 items-center">
            <div :class="`bg-linear-to-r from-${color} to-${color} p-3 rounded-md shadow-sm`"
                :style="`background: linear-gradient(135deg, var(--color-${color}), var(--color-${color}))`">
                <FontAwesomeIcon :icon="icon" class="w-6 h-6 text-white" />
            </div>
            <div class="flex flex-col">
                <h3 class="font-bold text-2xl text-neutral-800 leading-7" style="font-family: Roboto, sans-serif;">
                    {{ title }}
                </h3>
                <p class="font-medium text-sm text-neutral-600 leading-5" style="font-family: Roboto, sans-serif;">
                    {{ subtitle }}
                </p>
            </div>
        </div>

        <!-- Description -->
        <p class="font-normal text-sm text-neutral-600 flex-1 leading-6" style="font-family: Roboto, sans-serif;">
            {{ description }}
        </p>

        <!-- Stats -->
        <div class="flex gap-4 w-full">
            <div v-for="(stat, index) in stats" :key="index"
                class="flex-1 bg-neutral-50 flex flex-col gap-1 items-center justify-center py-3 rounded-md">
                <p class="font-bold text-2xl leading-7"
                    :style="`color: var(--color-${color}); font-family: Roboto, sans-serif;`">
                    {{ stat.value }}
                </p>
                <p class="font-medium text-xs text-neutral-600 leading-4" style="font-family: Roboto, sans-serif;">
                    {{ stat.label }}
                </p>
            </div>
        </div>

        <!-- Bouton CTA -->
        <Button @click="handleExplore" :color="color" class="w-full mt-auto" size="default">
            <p class="font-bold text-sm" style="font-family: Roboto, sans-serif;">
                Explorer la collection
            </p>
        </Button>
    </div>
</template>
