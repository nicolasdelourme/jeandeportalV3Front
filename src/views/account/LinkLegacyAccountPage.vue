<script setup lang="ts">
/**
 * Page LinkLegacyAccountPage
 * Tunnel de rattachement de compte legacy "Les Emmerdeurs"
 *
 * Accessible via /rattachement
 * Gère les 4 slides du tunnel avec transitions fluides
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import {
    LinkingProgress,
    LinkingSlideWelcome,
    LinkingSlideAuth,
    LinkingSlideForm,
    LinkingSlideSuccess
} from '@/components/account/legacy-linking'
import { useAuthStore } from '@/stores/auth.store'
import { legacyLinkingService } from '@/services/legacy-linking.service'
import { logger } from '@/utils/logger'
import { getErrorMessage } from '@/lib/error-utils'
import type { LinkingStep, LegacyLinkingCredentials, LegacyLinkingResult, AuthMode } from '@/types/legacy-linking.types'

const router = useRouter()
const authStore = useAuthStore()

/**
 * Étape courante du tunnel
 */
const currentStep = ref<LinkingStep>('welcome')

/**
 * Mode d'authentification choisi (login ou register)
 * Utilisé pour passer le mode initial au composant Auth
 */
const authMode = ref<AuthMode>('login')

/**
 * Liste des étapes (sans 'auth' si déjà connecté)
 */
const steps = computed<LinkingStep[]>(() => {
    if (authStore.isAuthenticated) {
        return ['welcome', 'form', 'success']
    }
    return ['welcome', 'auth', 'form', 'success']
})

/**
 * État de chargement
 */
const isLoading = ref(false)

/**
 * Message d'erreur pour le formulaire
 */
const errorMessage = ref('')

/**
 * Résultat du rattachement (pour le slide de succès)
 */
const linkingResult = ref<LegacyLinkingResult | null>(null)

/**
 * Direction de la transition (pour l'animation)
 */
const transitionDirection = ref<'forward' | 'backward'>('forward')

/**
 * Aller à l'étape suivante
 */
const goToNextStep = () => {
    transitionDirection.value = 'forward'
    const currentIndex = steps.value.indexOf(currentStep.value)
    const nextStep = steps.value[currentIndex + 1]

    if (currentIndex < steps.value.length - 1 && nextStep) {
        currentStep.value = nextStep
    }
}

/**
 * Aller à l'étape précédente
 */
const goToPreviousStep = () => {
    transitionDirection.value = 'backward'
    const currentIndex = steps.value.indexOf(currentStep.value)
    const prevStep = steps.value[currentIndex - 1]

    if (currentIndex > 0 && prevStep) {
        currentStep.value = prevStep
    }
}

/**
 * Handler du slide Welcome - choix "J'ai déjà un compte"
 */
const handleWelcomeLogin = () => {
    authMode.value = 'login'
    goToNextStep()
}

/**
 * Handler du slide Welcome - choix "Créer mon compte"
 */
const handleWelcomeRegister = () => {
    authMode.value = 'register'
    goToNextStep()
}

/**
 * Handler du slide Welcome - "Continuer" (si déjà connecté)
 */
const handleWelcomeContinue = () => {
    goToNextStep()
}

/**
 * Handler du slide Auth (après connexion réussie)
 * Note: On passe directement à 'form' car après connexion,
 * steps change et 'auth' n'est plus dans la liste
 */
const handleAuthNext = () => {
    transitionDirection.value = 'forward'
    currentStep.value = 'form'
}

/**
 * Handler du slide Auth (retour)
 */
const handleAuthBack = () => {
    goToPreviousStep()
}

/**
 * Handler du slide Auth (changement de mode login/register)
 */
const handleAuthModeChange = (newMode: AuthMode) => {
    authMode.value = newMode
}

/**
 * Handler du slide Form (soumission)
 */
const handleFormSubmit = async (credentials: LegacyLinkingCredentials) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        const result = await legacyLinkingService.linkAccount(credentials)

        if (result.status === 'success') {
            linkingResult.value = result
            toast.success('Compte rattaché avec succès !')

            // Rafraîchir les données utilisateur pour récupérer les nouveaux droits
            await authStore.refreshUser()

            goToNextStep()
        } else {
            errorMessage.value = result.message || 'Une erreur est survenue lors du rattachement.'
        }
    } catch (error) {
        logger.error('Erreur lors du rattachement:', error)
        errorMessage.value = getErrorMessage(error)
    } finally {
        isLoading.value = false
    }
}

/**
 * Handler du slide Form (retour)
 */
const handleFormBack = () => {
    errorMessage.value = ''
    goToPreviousStep()
}

/**
 * Vérifier si l'utilisateur est déjà rattaché au montage
 */
onMounted(async () => {
    // Attendre l'initialisation du store auth
    await authStore.waitForInitialization()

    if (authStore.isAuthenticated) {
        try {
            const status = await legacyLinkingService.getLinkingStatus()

            if (status.isLinked) {
                // Déjà rattaché, rediriger vers Mon compte
                toast.info('Votre compte est déjà rattaché.')
                router.replace('/mon-compte')
            }
        } catch (error) {
            logger.warn('Impossible de vérifier le statut de rattachement:', error)
        }
    }
})

/**
 * Watcher pour skip le slide auth si l'utilisateur se connecte pendant le tunnel
 * Note: On passe directement à 'form' car après connexion,
 * steps change et 'auth' n'est plus dans la liste (ce qui casserait goToNextStep)
 */
watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth && currentStep.value === 'auth') {
        transitionDirection.value = 'forward'
        currentStep.value = 'form'
    }
})
</script>

<template>
    <DefaultLayout>
        <section class="bg-neutral-50 flex flex-1 justify-center items-center py-16">
            <div class="max-w-md mx-auto px-4 w-full">
                <!-- Carte du tunnel -->
                <div class="bg-white rounded-md shadow-xl overflow-hidden">
                    <!-- Contenu des slides avec transitions -->
                    <Transition
                        :name="transitionDirection === 'forward' ? 'slide-left' : 'slide-right'"
                        mode="out-in"
                    >
                        <!-- Slide 1: Welcome -->
                        <LinkingSlideWelcome
                            v-if="currentStep === 'welcome'"
                            key="welcome"
                            :is-authenticated="authStore.isAuthenticated"
                            @login="handleWelcomeLogin"
                            @register="handleWelcomeRegister"
                            @continue="handleWelcomeContinue"
                        />

                        <!-- Slide 2: Auth (si non connecté) -->
                        <LinkingSlideAuth
                            v-else-if="currentStep === 'auth'"
                            key="auth"
                            :initial-mode="authMode"
                            @next="handleAuthNext"
                            @back="handleAuthBack"
                            @change-mode="handleAuthModeChange"
                        />

                        <!-- Slide 3: Form -->
                        <LinkingSlideForm
                            v-else-if="currentStep === 'form'"
                            key="form"
                            :is-submitting="isLoading"
                            :error-message="errorMessage"
                            @submit="handleFormSubmit"
                            @back="handleFormBack"
                        />

                        <!-- Slide 4: Success -->
                        <LinkingSlideSuccess
                            v-else-if="currentStep === 'success' && linkingResult"
                            key="success"
                            :result="linkingResult"
                        />
                    </Transition>

                    <!-- Progress dots -->
                    <LinkingProgress
                        :current-step="currentStep"
                        :steps="steps"
                    />
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>

<style scoped>
/* Transitions de slides */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.3s ease-out;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
