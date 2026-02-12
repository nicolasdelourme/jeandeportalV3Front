<script setup lang="ts">
/**
 * Composant LinkingProgress
 * Indicateur de progression pour le tunnel de rattachement
 * Style "Apple slides" avec dots animés
 */
import { computed } from 'vue'
import type { LinkingStep } from '@/types/legacy-linking.types'

interface Props {
    /** Étape courante */
    currentStep: LinkingStep
    /** Toutes les étapes du tunnel */
    steps?: LinkingStep[]
}

const props = withDefaults(defineProps<Props>(), {
    steps: () => ['welcome', 'auth', 'form', 'success'] as LinkingStep[]
})

/**
 * Index de l'étape courante
 */
const currentIndex = computed(() => {
    return props.steps.indexOf(props.currentStep)
})

/**
 * Vérifie si une étape est active ou passée
 */
const isStepActiveOrPassed = (index: number): boolean => {
    return index <= currentIndex.value
}

/**
 * Vérifie si une étape est l'étape courante
 */
const isCurrentStep = (index: number): boolean => {
    return index === currentIndex.value
}
</script>

<template>
    <div class="flex justify-center gap-2 py-4" role="progressbar" :aria-valuenow="currentIndex + 1" :aria-valuemin="1" :aria-valuemax="steps.length">
        <div
            v-for="(_, index) in steps"
            :key="index"
            class="transition-all duration-300 rounded-full"
            :class="[
                isCurrentStep(index)
                    ? 'w-6 h-2 bg-primary'
                    : isStepActiveOrPassed(index)
                        ? 'w-2 h-2 bg-primary'
                        : 'w-2 h-2 bg-neutral-300'
            ]"
            :aria-label="`Étape ${index + 1} sur ${steps.length}`"
        />
    </div>
</template>
