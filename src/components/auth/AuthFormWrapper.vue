<script setup lang="ts">
/**
 * Composant AuthFormWrapper
 * Conteneur réutilisable pour les formulaires d'authentification
 */
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import { computed } from 'vue'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface Props {
    /**
     * Titre du formulaire
     */
    title: string
    /**
     * Sous-titre du formulaire
     */
    subtitle: string
    /**
     * Message d'erreur général (optionnel)
     */
    errorMessage?: string
}

defineProps<Props>()

const icons = computed(() => ({
    circleExclamation: byPrefixAndName.fas?.['circle-exclamation'],
}))

const getIcon = (iconKey: 'circleExclamation'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}
</script>

<template>
    <section class="bg-neutral-50 flex flex-1 justify-center items-center py-16">
        <div class="max-w-md mx-auto px-4 w-full">
            <!-- Carte du formulaire -->
            <div class="bg-white rounded-md shadow-xl p-8">
                <!-- En-tête -->
                <div class="text-center mb-8">
                    <h1 class="font-bold text-3xl text-neutral-800 mb-2" style="font-family: Roboto, sans-serif;">
                        {{ title }}
                    </h1>
                    <p class="font-normal text-base text-neutral-600" style="font-family: Roboto, sans-serif;">
                        {{ subtitle }}
                    </p>
                </div>

                <!-- Erreur générale -->
                <Alert v-if="errorMessage" variant="destructive" class="mb-6">
                    <FontAwesomeIcon v-if="getIcon('circleExclamation')" :icon="getIcon('circleExclamation')" class="h-4 w-4" />
                    <AlertDescription style="font-family: Roboto, sans-serif;">
                        {{ errorMessage }}
                    </AlertDescription>
                </Alert>

                <!-- Contenu du formulaire (slot) -->
                <slot />
            </div>
        </div>
    </section>
</template>
