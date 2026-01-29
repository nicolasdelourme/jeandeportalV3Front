<script setup lang="ts">
/**
 * Page VerifyEmailPage
 * Page de callback pour la vérification de l'email
 * URL: /register/verif/:token
 */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth.store'
import { getErrorMessage } from '@/lib/error-utils'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper.vue'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

/**
 * États de la page
 */
const isLoading = ref(true)
const isSuccess = ref(false)
const message = ref('')

/**
 * Vérifie l'email au montage de la page
 */
onMounted(async () => {
    // Token depuis le path param (ex: /register/verif/abc123)
    const token = route.params.token as string

    // Mode démo pour prévisualisation UI
    if (token === 'demo') {
        isLoading.value = false
        isSuccess.value = true
        message.value = 'Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.'
        return
    }

    if (!token) {
        isLoading.value = false
        isSuccess.value = false
        message.value = 'Le lien de vérification est invalide. Aucun token fourni.'
        return
    }

    try {
        const result = await authStore.verifyEmail(token)
        isSuccess.value = result.status === 'success'

        if (isSuccess.value) {
            message.value = 'Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.'
        } else {
            message.value = result.message || 'Le lien de vérification est invalide ou a expiré.'
        }
    } catch (error) {
        isSuccess.value = false
        message.value = getErrorMessage(error)
    } finally {
        isLoading.value = false
    }
})

/**
 * Rediriger vers la page de connexion avec toast de succès
 */
const goToLogin = () => {
    if (isSuccess.value) {
        toast.success('Votre compte a été activé ! Vous pouvez vous connecter.')
    }
    router.push('/auth?mode=login')
}
</script>

<template>
    <DefaultLayout>
        <AuthFormWrapper
            :title="isLoading ? 'Vérification en cours...' : (isSuccess ? 'Email vérifié !' : 'Erreur de vérification')"
            :subtitle="''"
        >
            <!-- État de chargement -->
            <div v-if="isLoading" class="space-y-6 text-center py-8">
                <div class="mx-auto w-16 h-16 flex items-center justify-center">
                    <svg class="animate-spin w-10 h-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
                <p class="text-neutral-600">Vérification de votre email en cours...</p>
            </div>

            <!-- État de succès -->
            <div v-else-if="isSuccess" class="space-y-6 text-center py-4">
                <!-- Icône succès -->
                <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <!-- Message de succès -->
                <div class="space-y-2">
                    <p class="text-neutral-600">{{ message }}</p>
                </div>

                <!-- Bouton vers la connexion -->
                <Button
                    type="button"
                    color="primary"
                    rounded="lg"
                    size="lg"
                    class="w-full text-secondary hover:text-secondary"
                    @click="goToLogin"
                >
                    <span class="font-bold">Se connecter</span>
                </Button>
            </div>

            <!-- État d'erreur -->
            <div v-else class="space-y-6 text-center py-4">
                <!-- Icône erreur -->
                <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <!-- Message d'erreur -->
                <div class="space-y-2">
                    <p class="text-neutral-600">{{ message }}</p>
                </div>

                <!-- Boutons d'action -->
                <div class="space-y-3">
                    <Button
                        type="button"
                        color="primary"
                        size="lg"
                        rounded="lg"
                        class="w-full text-secondary hover:text-secondary"
                        @click="goToLogin"
                    >
                        <span class="font-bold">Retour à la connexion</span>
                    </Button>
                </div>

                <!-- Note -->
                <p class="text-xs text-neutral-500">
                    Si le problème persiste, essayez de vous réinscrire ou contactez le support.
                </p>
            </div>
        </AuthFormWrapper>
    </DefaultLayout>
</template>
