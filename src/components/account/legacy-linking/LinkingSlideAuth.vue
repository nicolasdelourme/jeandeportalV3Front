<script setup lang="ts">
/**
 * Composant LinkingSlideAuth
 * Slide 2 : Connexion ou inscription avant rattachement
 * Réutilise les formulaires d'authentification existants
 *
 * Reçoit un mode initial ('login' ou 'register') depuis le parent
 * et permet de basculer entre les modes via un lien texte
 */
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { logger } from '@/utils/logger'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import { getErrorMessage } from '@/lib/error-utils'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import AuthModeToggle from '@/components/auth/AuthModeToggle.vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { AuthMode } from '@/types/legacy-linking.types'

const props = defineProps<{
    /** Mode initial du formulaire */
    initialMode: AuthMode
}>()

const emit = defineEmits<{
    next: []
    back: []
    'change-mode': [mode: AuthMode]
}>()

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

/**
 * Mode du formulaire : 'login', 'register' ou 'forgot-password'
 */
const mode = ref<'login' | 'register' | 'forgot-password'>(props.initialMode)

/**
 * Synchroniser le mode avec la prop initialMode quand elle change
 */
watch(() => props.initialMode, (newMode) => {
    mode.value = newMode
    errors.value = {}
    registrationSuccess.value = false
    registrationEmail.value = ''
})

/**
 * État de soumission
 */
const isSubmitting = ref(false)

/**
 * Erreurs générales
 */
const errors = ref<Record<string, string>>({})

/**
 * État de succès d'inscription
 */
const registrationSuccess = ref(false)
const registrationEmail = ref('')

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    arrowLeft: byPrefixAndName.fas?.['arrow-left'],
    circleExclamation: byPrefixAndName.fas?.['circle-exclamation'],
    envelope: byPrefixAndName.fas?.['envelope'],
}))

/**
 * Soumission du formulaire de connexion
 */
const handleLoginSubmit = async (values: { email: string; password: string; rememberMe: boolean }) => {
    isSubmitting.value = true
    errors.value.general = ''

    try {
        await authStore.login({
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
            redirectUrl: '/rattachement'
        })

        toast.success('Connexion réussie !')
        emit('next')
    } catch (error) {
        logger.error('Erreur lors du login:', error)
        errors.value.general = getErrorMessage(error)
    } finally {
        isSubmitting.value = false
    }
}

/**
 * Soumission du formulaire d'inscription
 */
const handleRegisterSubmit = async (values: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    phone?: string
    birthDate?: string
}) => {
    isSubmitting.value = true
    errors.value.general = ''

    try {
        await authStore.register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            passwordConfirm: values.confirmPassword,
            phone: values.phone || null,
            birthDate: values.birthDate || null
        })

        registrationEmail.value = values.email
        registrationSuccess.value = true
        toast.success('Un email de vérification a été envoyé !')
    } catch (error) {
        logger.error('Erreur:', error)
        errors.value.general = getErrorMessage(error)
    } finally {
        isSubmitting.value = false
    }
}

/**
 * Retourner au formulaire de connexion depuis l'état de succès
 */
const goToLoginFromSuccess = () => {
    registrationSuccess.value = false
    registrationEmail.value = ''
    mode.value = 'login'
    errors.value = {}
}

/**
 * Soumission du formulaire mot de passe oublié
 */
const handleForgotPasswordSubmit = async (values: { email: string }) => {
    isSubmitting.value = true
    errors.value.general = ''

    try {
        const result = await authService.forgotPassword(values.email)
        toast.success(result.message)
        mode.value = 'login'
    } catch (error) {
        logger.error('Erreur:', error)
        errors.value.general = getErrorMessage(error)
    } finally {
        isSubmitting.value = false
    }
}

/**
 * Basculer entre connexion et inscription
 * Émet un événement pour informer le parent du changement
 */
const toggleMode = () => {
    const newMode: AuthMode = mode.value === 'login' ? 'register' : 'login'
    mode.value = newMode
    errors.value = {}
    registrationSuccess.value = false
    registrationEmail.value = ''
    emit('change-mode', newMode)
}

/**
 * Aller vers le mode mot de passe oublié
 */
const goToForgotPassword = () => {
    mode.value = 'forgot-password'
    errors.value = {}
}

/**
 * Retour à la connexion depuis mot de passe oublié
 */
const backToLogin = () => {
    mode.value = 'login'
    errors.value = {}
}

/**
 * Textes dynamiques selon le mode
 */
const texts = computed(() => {
    if (mode.value === 'login') {
        return {
            title: 'Connectez-vous',
            subtitle: 'pour rattacher votre ancien compte',
            toggleText: 'Vous n\'avez pas de compte ?',
            toggleLink: 'Créer un compte',
        }
    } else if (mode.value === 'register') {
        return {
            title: 'Créez votre compte',
            subtitle: 'pour rattacher votre ancien compte',
            toggleText: 'Vous avez déjà un compte ?',
            toggleLink: 'Se connecter',
        }
    } else {
        return {
            title: 'Mot de passe oublié',
            subtitle: 'Entrez votre email pour réinitialiser',
            toggleText: 'Vous vous souvenez de votre mot de passe ?',
            toggleLink: 'Retour à la connexion',
        }
    }
})
</script>

<template>
    <div class="px-6 py-8">
        <!-- Bouton retour -->
        <button
            type="button"
            class="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-6 transition-colors"
            @click="emit('back')"
        >
            <FontAwesomeIcon
                v-if="icons.arrowLeft"
                :icon="icons.arrowLeft"
                class="w-4 h-4"
            />
            <span class="text-sm" style="font-family: Roboto, sans-serif;">Retour</span>
        </button>

        <!-- En-tête -->
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-neutral-800 mb-2" style="font-family: Roboto, sans-serif;">
                {{ texts.title }}
            </h2>
            <p class="text-neutral-600" style="font-family: Roboto, sans-serif;">
                {{ texts.subtitle }}
            </p>
        </div>

        <!-- Erreur générale -->
        <Alert v-if="errors.general" variant="destructive" class="mb-6">
            <FontAwesomeIcon
                v-if="icons.circleExclamation"
                :icon="icons.circleExclamation"
                class="h-4 w-4"
            />
            <AlertDescription style="font-family: Roboto, sans-serif;">
                {{ errors.general }}
            </AlertDescription>
        </Alert>

        <!-- Formulaire de connexion -->
        <LoginForm
            v-if="mode === 'login'"
            :is-submitting="isSubmitting"
            @submit="handleLoginSubmit"
            @forgot-password="goToForgotPassword"
        />

        <!-- Formulaire d'inscription -->
        <RegisterForm
            v-else-if="mode === 'register' && !registrationSuccess"
            :is-submitting="isSubmitting"
            @submit="handleRegisterSubmit"
        />

        <!-- État de succès après inscription -->
        <div v-else-if="mode === 'register' && registrationSuccess" class="space-y-6 text-center">
            <div class="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                    v-if="icons.envelope"
                    :icon="icons.envelope"
                    class="size-8 text-primary"
                />
            </div>

            <div class="space-y-2">
                <h3 class="text-lg font-semibold text-neutral-900">
                    Vérifiez votre boîte mail
                </h3>
                <p class="text-sm text-neutral-600">
                    Un email de vérification a été envoyé à
                </p>
                <p class="font-medium text-neutral-900">{{ registrationEmail }}</p>
                <p class="text-sm text-neutral-600">
                    Cliquez sur le lien dans l'email pour activer votre compte,
                    puis revenez ici pour vous connecter.
                </p>
            </div>

            <Button
                type="button"
                variant="secondary"
                rounded="lg"
                class="w-full"
                @click="goToLoginFromSuccess"
            >
                <span style="font-family: Roboto, sans-serif;">Aller à la connexion</span>
            </Button>

            <p class="text-xs text-neutral-500">
                Pensez à vérifier vos spams si vous ne trouvez pas l'email.
            </p>
        </div>

        <!-- Formulaire mot de passe oublié -->
        <ForgotPasswordForm
            v-else-if="mode === 'forgot-password'"
            :is-submitting="isSubmitting"
            @submit="handleForgotPasswordSubmit"
        />

        <!-- Toggle entre les modes -->
        <AuthModeToggle
            v-if="!registrationSuccess"
            :text="texts.toggleText"
            :link-text="texts.toggleLink"
            @toggle="mode === 'forgot-password' ? backToLogin() : toggleMode()"
        />
    </div>
</template>
