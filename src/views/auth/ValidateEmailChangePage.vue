<script setup lang="ts">
/**
 * Page ValidateEmailChangePage
 * Page de callback pour la validation du changement d'email
 * URL: /changement/finalisation/:hash
 */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { authService } from '@/services/auth.service'
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
 * Valide le changement d'email au montage de la page
 */
onMounted(async () => {
    // Hash depuis le path param (ex: /changement/finalisation/abc123)
    const hash = route.params.hash as string

    if (!hash) {
        isLoading.value = false
        isSuccess.value = false
        message.value = 'Le lien de validation est invalide. Aucun code fourni.'
        return
    }

    try {
        const result = await authService.validateEmailChange(hash)
        isSuccess.value = result.status === 'success'

        if (isSuccess.value) {
            message.value = 'Votre adresse email a été modifiée avec succès.'
            // Rafraîchir les données utilisateur pour refléter le nouvel email
            await authStore.refreshUser()
        } else {
            message.value = result.message || 'Le lien de validation est invalide ou a expiré.'
        }
    } catch (error) {
        isSuccess.value = false
        message.value = getErrorMessage(error)
    } finally {
        isLoading.value = false
    }
})

/**
 * Rediriger vers le compte utilisateur
 */
const goToAccount = () => {
    if (isSuccess.value) {
        toast.success('Votre adresse email a été mise à jour !')
    }
    router.push('/mon-compte')
}

/**
 * Rediriger vers la page de connexion
 */
const goToLogin = () => {
    router.push('/auth?mode=login')
}
</script>

<template>
    <DefaultLayout>
        <AuthFormWrapper
            :title="isLoading ? 'Validation en cours...' : (isSuccess ? 'Email modifié !' : 'Erreur de validation')"
            :subtitle="''"
        >
            <!-- État de chargement -->
            <div v-if="isLoading" class="space-y-6 text-center py-8">
                <div class="mx-auto w-16 h-16 flex items-center justify-center">
                    <svg class="animate-spin w-10 h-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                </div>
                <p class="text-neutral-600">Validation de votre nouvelle adresse email...</p>
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

                <!-- Bouton vers le compte -->
                <Button
                    type="button"
                    color="primary"
                    rounded="lg"
                    size="lg"
                    class="w-full text-secondary hover:text-secondary"
                    @click="goToAccount"
                >
                    <span class="font-bold">Retour à mon compte</span>
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
                        rounded="lg"
                        size="lg"
                        class="w-full text-secondary hover:text-secondary"
                        @click="goToAccount"
                    >
                        <span class="font-bold">Retour à mon compte</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        class="w-full"
                        @click="goToLogin"
                    >
                        <span>Se reconnecter</span>
                    </Button>
                </div>

                <!-- Note -->
                <p class="text-xs text-neutral-500">
                    Le lien de validation est valable 15 minutes. Si le problème persiste, demandez un nouveau lien depuis votre compte.
                </p>
            </div>
        </AuthFormWrapper>
    </DefaultLayout>
</template>
