<script setup lang="ts">
/**
 * Composant AuthModeToggle
 * Bouton pour basculer entre les modes d'authentification
 */
interface Props {
    /**
     * Texte avant le lien
     */
    text: string
    /**
     * Texte du lien cliquable
     */
    linkText: string
}

defineProps<Props>()

const emit = defineEmits<{
    toggle: []
}>()
</script>

<template>
    <div class="mt-6 text-center">
        <p class="text-sm text-neutral-600" style="font-family: Roboto, sans-serif;">
            {{ text }}
            <button type="button" @click="emit('toggle')" class="text-primary font-medium hover:underline ml-1">
                {{ linkText }}
            </button>
        </p>
    </div>
</template>
