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
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import AuthModeToggle from '@/components/auth/AuthModeToggle.vue'

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
 * Soumission du formulaire de connexion
 */
const handleLoginSubmit = async (values: { email: string; password: string; rememberMe: boolean }) => {
    isSubmitting.value = true
    errors.value.general = '' // Clear previous errors

    try {
        console.log('📝 [AUTH PAGE] Soumission du formulaire de login...')

        // Récupérer l'URL de redirection depuis les query params (si l'utilisateur a essayé d'accéder à une page protégée)
        const redirectUrl = (route.query.redirect as string) || undefined
        console.log('🔗 [AUTH PAGE] Redirect URL depuis query params:', redirectUrl)

        // Appeler le store pour se connecter
        console.log('📞 [AUTH PAGE] Appel authStore.login()...')
        const afterLoginUrl = await authStore.login({
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
            redirectUrl
        })
        console.log('✅ [AUTH PAGE] authStore.login() terminé, afterLoginUrl:', afterLoginUrl)

        toast.success('Connexion réussie !')

        // Rediriger vers l'URL retournée par le backend (ou l'URL d'origine si disponible)
        const finalUrl = redirectUrl || afterLoginUrl
        console.log('🚀 [AUTH PAGE] Redirection vers:', finalUrl)
        await router.push(finalUrl)
        console.log('✅ [AUTH PAGE] router.push() terminé')
    } catch (error: any) {
        console.error('❌ [AUTH PAGE] Erreur lors du login:', error)
        errors.value.general = error.message || 'Identifiants incorrects. Veuillez réessayer.'
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
}) => {
    isSubmitting.value = true
    errors.value.general = '' // Clear previous errors

    try {
        // Récupérer l'URL de redirection depuis les query params (même logique que login)
        const redirectUrl = (route.query.redirect as string) || undefined

        // Appeler le store pour s'inscrire
        const afterLoginUrl = await authStore.register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password
        })

        toast.success('Compte créé avec succès !')

        // Rediriger vers l'URL d'origine ou l'URL par défaut
        router.push(redirectUrl || afterLoginUrl)
    } catch (error: any) {
        console.error('Erreur:', error)
        errors.value.general = error.message || 'Une erreur est survenue lors de la création du compte.'
    } finally {
        isSubmitting.value = false
    }
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
    } catch (error: any) {
        console.error('Erreur:', error)
        errors.value.general = error.message || 'Impossible d\'envoyer l\'email de réinitialisation.'
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

/**
 * Au montage, afficher un message si on est en mode mock
 */
onMounted(() => {
    if (authService.isUsingMock()) {
        console.info('🔧 Mode développement : Utilisation du mock backend')
        console.info('📧 Credentials de test : test@example.com / Test1234')
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
            <RegisterForm v-else-if="mode === 'register'"
                :is-submitting="isSubmitting"
                @submit="handleRegisterSubmit" />

            <!-- Formulaire mot de passe oublié -->
            <ForgotPasswordForm v-else-if="mode === 'forgot-password'"
                :is-submitting="isSubmitting"
                @submit="handleForgotPasswordSubmit" />

            <!-- Toggle entre les modes -->
            <AuthModeToggle :text="texts.toggleText" :link-text="texts.toggleLink"
                @toggle="mode === 'forgot-password' ? backToLogin() : toggleMode()" />
        </AuthFormWrapper>
    </DefaultLayout>
</template>
