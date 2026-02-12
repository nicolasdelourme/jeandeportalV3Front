<script setup lang="ts">
/**
 * Composant LinkingSlideWelcome
 * Slide 1 : Bienvenue et explication du processus de rattachement
 */
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
    /** Si l'utilisateur est déjà connecté */
    isAuthenticated?: boolean
}>()

const emit = defineEmits<{
    login: []
    register: []
    continue: []
}>()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    arrowRight: byPrefixAndName.fas?.['arrow-right'],
    link: byPrefixAndName.fas?.['link'],
    star: byPrefixAndName.fas?.['star'],
    graduationCap: byPrefixAndName.fas?.['graduation-cap'],
    userPlus: byPrefixAndName.fas?.['user-plus'],
}))
</script>

<template>
    <div class="flex flex-col items-center text-center px-6 py-8">
        <!-- Illustration/Icône -->
        <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <FontAwesomeIcon
                v-if="icons.link"
                :icon="icons.link"
                class="w-10 h-10 fa-xl text-secondary"
            />
        </div>

        <!-- Titre -->
        <h2 class="text-2xl font-bold text-neutral-800 mb-4" style="font-family: Roboto, sans-serif;">
            Bienvenue sur Infocash !
        </h2>

        <!-- Description -->
        <p class="text-neutral-600 mb-8 max-w-sm" style="font-family: Roboto, sans-serif;">
            Vous étiez abonné à notre ancien service <strong>"Les Emmerdeurs"</strong> ?
            Rattachez votre compte en quelques étapes pour conserver tous vos avantages.
        </p>

        <!-- Avantages -->
        <div class="w-full max-w-sm mb-8 space-y-3">
            <div class="flex items-center gap-3 text-left p-3 bg-neutral-50 rounded-lg">
                <div class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <FontAwesomeIcon
                        v-if="icons.graduationCap"
                        :icon="icons.graduationCap"
                        class="w-4 h-4 text-primary"
                    />
                </div>
                <span class="text-sm text-neutral-700" style="font-family: Roboto, sans-serif;">
                    Accès à vos formations de l'Académie
                </span>
            </div>

            <div class="flex items-center gap-3 text-left p-3 bg-neutral-50 rounded-lg">
                <div class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <FontAwesomeIcon
                        v-if="icons.star"
                        :icon="icons.star"
                        class="w-4 h-4 text-primary"
                    />
                </div>
                <span class="text-sm text-neutral-700" style="font-family: Roboto, sans-serif;">
                    Récupération de vos étoiles accumulées
                </span>
            </div>
        </div>

        <!-- CTAs -->
        <div class="w-full max-w-sm space-y-3">
            <!-- Si déjà connecté : un seul bouton Continuer -->
            <template v-if="props.isAuthenticated">
                <Button
                    variant="secondary"
                    size="lg"
                    rounded="lg"
                    class="w-full"
                    @click="emit('continue')"
                >
                    <span class="font-bold" style="font-family: Roboto, sans-serif;">
                        Continuer
                    </span>
                    <FontAwesomeIcon
                        v-if="icons.arrowRight"
                        :icon="icons.arrowRight"
                        class="ml-2 w-4 h-4"
                    />
                </Button>
            </template>

            <!-- Sinon : deux boutons login/register -->
            <template v-else>
                <!-- Question de clarification -->
                <p class="text-sm text-neutral-600 mb-3" style="font-family: Roboto, sans-serif;">
                    Avez-vous un compte Infocash ?
                </p>

                <!-- Bouton principal : J'ai déjà un compte -->
                <Button
                    variant="secondary"
                    size="lg"
                    rounded="lg"
                    class="w-full"
                    @click="emit('login')"
                >
                    <span class="font-bold" style="font-family: Roboto, sans-serif;">
                        J'ai déjà un compte
                    </span>
                    <FontAwesomeIcon
                        v-if="icons.arrowRight"
                        :icon="icons.arrowRight"
                        class="ml-2 w-4 h-4"
                    />
                </Button>

                <!-- Bouton secondaire : Créer mon compte -->
                <Button
                    variant="outline"
                    color="secondary"
                    size="lg"
                    rounded="lg"
                    class="w-full hover:text-primary"
                    @click="emit('register')"
                >
                    <FontAwesomeIcon
                        v-if="icons.userPlus"
                        :icon="icons.userPlus"
                        class="mr-2 w-4 h-4"
                    />
                    <span class="font-bold" style="font-family: Roboto, sans-serif;">
                        Créer mon compte
                    </span>
                </Button>
            </template>
        </div>
    </div>
</template>
