<script setup lang="ts">
/**
 * Page AuthPage
 * Tunnel de connexion/inscription/mot de passe oublié
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import { getErrorMessage } from '@/lib/error-utils'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import AuthModeToggle from '@/components/auth/AuthModeToggle.vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

/**
 * Mode du tunnel : 'login', 'register' ou 'forgot-password'
 * Initialisé depuis le query param si présent
 */
const mode = ref<'login' | 'register' | 'forgot-password'>(
    (route.query.mode as 'login' | 'register' | 'forgot-password') || 'login'
)

/**
 * État de soumission
 */
const isSubmitting = ref(false)

/**
 * Erreurs générales (erreurs serveur)
 */
const errors = ref<Record<string, string>>({})

/**
 * État de succès d'inscription
 * Quand true, affiche le message "vérifiez votre email"
 */
const registrationSuccess = ref(false)
const registrationEmail = ref('')


/**
 * Soumission du formulaire de connexion
 */
const handleLoginSubmit = async (values: { email: string; password: string; rememberMe: boolean }) => {
    isSubmitting.value = true
    errors.value.general = '' // Clear previous errors

    try {

        // Récupérer l'URL de redirection depuis les query params (si l'utilisateur a essayé d'accéder à une page protégée)
        const redirectUrl = (route.query.redirect as string) || undefined

        // Appeler le store pour se connecter
        const afterLoginUrl = await authStore.login({
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
            redirectUrl
        })

        toast.success('Connexion réussie !')

        // Rediriger vers l'URL retournée par le backend (ou l'URL d'origine si disponible)
        const finalUrl = redirectUrl || afterLoginUrl
        await router.push(finalUrl)
    } catch (error) {
        console.error('❌ [AUTH PAGE] Erreur lors du login:', error)
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
    errors.value.general = '' // Clear previous errors

    try {
        // Appeler le store pour s'inscrire (pas d'auto-login)
        await authStore.register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            passwordConfirm: values.confirmPassword,
            phone: values.phone || null,
            birthDate: values.birthDate || null
        })

        // Stocker l'email pour le renvoi
        registrationEmail.value = values.email

        // Afficher l'état de succès (au lieu de rediriger)
        registrationSuccess.value = true

        toast.success('Un email de vérification a été envoyé !')
    } catch (error) {
        console.error('Erreur:', error)
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
    errors.value.general = '' // Clear previous errors

    try {
        // Appeler le service pour demander la réinitialisation
        const result = await authService.forgotPassword(values.email)
        toast.success(result.message)
        mode.value = 'login'
    } catch (error) {
        console.error('Erreur:', error)
        errors.value.general = getErrorMessage(error)
    } finally {
        isSubmitting.value = false
    }
}

/**
 * Basculer entre connexion et inscription
 */
const toggleMode = () => {
    mode.value = mode.value === 'login' ? 'register' : 'login'
    errors.value = {}
    registrationSuccess.value = false
    registrationEmail.value = ''
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
            title: 'Connexion',
            subtitle: 'Connectez-vous à votre compte',
            toggleText: 'Vous n\'avez pas de compte ?',
            toggleLink: 'Créer un compte',
        }
    } else if (mode.value === 'register') {
        return {
            title: 'Inscription',
            subtitle: 'Créez votre compte gratuitement',
            toggleText: 'Vous avez déjà un compte ?',
            toggleLink: 'Se connecter',
        }
    } else {
        return {
            title: 'Mot de passe oublié',
            subtitle: 'Entrez votre email pour réinitialiser votre mot de passe',
            toggleText: 'Vous vous souvenez de votre mot de passe ?',
            toggleLink: 'Retour à la connexion',
        }
    }
})

/**
 * Observer les changements de query param pour changer le mode
 */
watch(() => route.query.mode, (newMode) => {
    if (newMode === 'register' || newMode === 'login' || newMode === 'forgot-password') {
        mode.value = newMode
        errors.value = {} // Clear errors lors du changement de mode
    } else if (!newMode) {
        // Si pas de query param, mode par défaut = login
        mode.value = 'login'
        errors.value = {}
    }
})
</script>

<template>
    <DefaultLayout>
        <AuthFormWrapper :title="texts.title" :subtitle="texts.subtitle" :error-message="errors.general">
            <!-- Formulaire de connexion -->
            <LoginForm v-if="mode === 'login'"
                :is-submitting="isSubmitting"
                @submit="handleLoginSubmit"
                @forgot-password="goToForgotPassword" />

            <!-- Formulaire d'inscription -->
            <RegisterForm v-else-if="mode === 'register' && !registrationSuccess"
                :is-submitting="isSubmitting"
                @submit="handleRegisterSubmit" />

            <!-- État de succès après inscription -->
            <div v-else-if="mode === 'register' && registrationSuccess" class="space-y-6 text-center">
                <!-- Icône email -->
                <div class="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <FontAwesomeIcon
                        v-if="byPrefixAndName.fas?.['envelope']"
                        :icon="byPrefixAndName.fas['envelope']"
                        class="size-8 text-primary"
                    />
                </div>

                <!-- Message de confirmation -->
                <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-neutral-900">
                        Vérifiez votre boîte mail
                    </h3>
                    <p class="text-sm text-neutral-600">
                        Un email de vérification a été envoyé à
                    </p>
                    <p class="font-medium text-neutral-900">{{ registrationEmail }}</p>
                    <p class="text-sm text-neutral-600">
                        Cliquez sur le lien dans l'email pour activer votre compte.
                    </p>
                </div>

                <!-- Bouton vers la connexion -->
                <Button
                    type="button"
                    variant="secondary"
                    rounded="lg"
                    class="w-full transition-colors"
                    @click="goToLoginFromSuccess"
                >
                    Aller à la connexion
                </Button>

                <!-- Note -->
                <p class="text-xs text-neutral-500">
                    Pensez à vérifier vos spams si vous ne trouvez pas l'email.
                </p>
            </div>

            <!-- Formulaire mot de passe oublié -->
            <ForgotPasswordForm v-else-if="mode === 'forgot-password'"
                :is-submitting="isSubmitting"
                @submit="handleForgotPasswordSubmit" />

            <!-- Toggle entre les modes (masqué lors du succès d'inscription) -->
            <AuthModeToggle v-if="!registrationSuccess" :text="texts.toggleText" :link-text="texts.toggleLink"
                @toggle="mode === 'forgot-password' ? backToLogin() : toggleMode()" />
        </AuthFormWrapper>
    </DefaultLayout>
</template>
