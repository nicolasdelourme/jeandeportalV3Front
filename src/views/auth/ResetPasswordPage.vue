<script setup lang="ts">
/**
 * Page ResetPasswordPage
 * Page de réinitialisation du mot de passe
 * URL: /auth/lostPassword/:token
 */
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { authService } from '@/services/auth.service'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const route = useRoute()
const router = useRouter()

/**
 * Token de réinitialisation (depuis path params)
 */
const resetToken = ref('')

/**
 * États de la page
 */
const isVerifying = ref(true)
const isCodeValid = ref(false)
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

/**
 * Toggle password visibility
 */
const showPassword = ref(false)
const showConfirmPassword = ref(false)

/**
 * Schéma de validation avec zod
 */
const formSchema = toTypedSchema(z.object({
    password: z.string({ required_error: 'Le mot de passe est requis' })
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
        .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
        .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
        .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' }),
    confirmPassword: z.string({ required_error: 'Veuillez confirmer votre mot de passe' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
}))

const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
})

/**
 * Calcul de la force du mot de passe
 */
const passwordStrength = computed(() => {
    const password = values.password || ''
    if (!password) return {
        score: 0,
        label: '',
        barColor: 'var(--color-neutral-300)',
        bgColor: 'rgba(163, 163, 163, 0.2)'
    }

    let score = 0

    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 10
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/[0-9]/.test(password)) score += 15
    if (/[^A-Za-z0-9]/.test(password)) score += 10

    if (score < 60) return {
        score,
        label: 'Faible',
        barColor: 'var(--color-primary)',
        bgColor: 'rgba(var(--color-primary-rgb), 0.2)'
    }
    if (score < 80) return {
        score,
        label: 'Moyen',
        barColor: '#f97316',
        bgColor: 'rgba(249, 115, 22, 0.2)'
    }
    return {
        score,
        label: 'Fort',
        barColor: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.2)'
    }
})

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    eye: byPrefixAndName.fas?.['eye'],
    eyeSlash: byPrefixAndName.fas?.['eye-slash'],
    lock: byPrefixAndName.fas?.['lock'],
}))

const getIcon = (iconKey: 'eye' | 'eyeSlash' | 'lock'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

/**
 * Titre dynamique selon l'état
 */
const pageTitle = computed(() => {
    if (isVerifying.value) return 'Vérification...'
    if (!isCodeValid.value) return 'Lien invalide'
    if (isSuccess.value) return 'Mot de passe réinitialisé !'
    return 'Nouveau mot de passe'
})

/**
 * Vérifie le token au montage de la page
 */
onMounted(async () => {
    // Token depuis le path param (ex: /auth/lostPassword/abc123)
    const token = route.params.token as string

    if (!token) {
        isVerifying.value = false
        isCodeValid.value = false
        errorMessage.value = 'Le lien de réinitialisation est invalide. Aucun token fourni.'
        return
    }

    resetToken.value = token

    try {
        const result = await authService.verifyResetCode(token)
        isCodeValid.value = result.status === 'success'
        if (result.status !== 'success') {
            errorMessage.value = result.message || 'Le lien de réinitialisation est invalide ou a expiré.'
        }
    } catch (error: any) {
        isCodeValid.value = false
        errorMessage.value = error.message || 'Le lien de réinitialisation est invalide ou a expiré.'
    } finally {
        isVerifying.value = false
    }
})

/**
 * Soumettre le nouveau mot de passe
 */
const onSubmit = handleSubmit(async (formValues) => {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
        const result = await authService.completePasswordReset(
            resetToken.value,
            formValues.password,
            formValues.confirmPassword
        )

        if (result.status === 'success') {
            isSuccess.value = true
            toast.success('Mot de passe réinitialisé avec succès !')
        } else {
            errorMessage.value = result.message || 'Une erreur est survenue.'
        }
    } catch (error: any) {
        errorMessage.value = error.message || 'Une erreur est survenue lors de la réinitialisation.'
    } finally {
        isSubmitting.value = false
    }
})

/**
 * Rediriger vers la page de connexion
 */
const goToLogin = () => {
    router.push('/auth?mode=login')
}

/**
 * Rediriger vers la page mot de passe oublié
 */
const goToForgotPassword = () => {
    router.push('/auth?mode=forgot-password')
}
</script>

<template>
    <DefaultLayout>
        <AuthFormWrapper :title="pageTitle" :subtitle="''">
            <!-- État de chargement (vérification du code) -->
            <div v-if="isVerifying" class="space-y-6 text-center py-8">
                <div class="mx-auto w-16 h-16 flex items-center justify-center">
                    <svg class="animate-spin w-10 h-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <p class="text-neutral-600">Vérification du lien de réinitialisation...</p>
            </div>

            <!-- Code invalide -->
            <div v-else-if="!isCodeValid && !isSuccess" class="space-y-6 text-center py-4">
                <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <div class="space-y-2">
                    <p class="text-neutral-600">{{ errorMessage }}</p>
                </div>

                <div class="space-y-3">
                    <Button
                        type="button"
                        color="primary"
                        size="lg"
                        class="w-full"
                        @click="goToForgotPassword"
                    >
                        <span class="font-bold">Demander un nouveau lien</span>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        class="w-full"
                        @click="goToLogin"
                    >
                        <span>Retour à la connexion</span>
                    </Button>
                </div>
            </div>

            <!-- Formulaire de réinitialisation -->
            <div v-else-if="isCodeValid && !isSuccess">
                <!-- Message d'erreur général -->
                <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-600">{{ errorMessage }}</p>
                </div>

                <form @submit="onSubmit" class="space-y-4">
                    <!-- Nouveau mot de passe -->
                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem class="gap-1">
                            <FormLabel class="text-sm font-medium text-neutral-700">
                                Nouveau mot de passe
                            </FormLabel>
                            <FormControl>
                                <div class="relative">
                                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <FontAwesomeIcon v-if="getIcon('lock')" :icon="getIcon('lock')" class="w-4 h-4" />
                                    </div>
                                    <Input
                                        :type="showPassword ? 'text' : 'password'"
                                        placeholder="••••••••"
                                        class="pl-10 pr-10"
                                        autocomplete="new-password"
                                        v-bind="componentField"
                                    />
                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    >
                                        <FontAwesomeIcon v-if="showPassword && getIcon('eyeSlash')" :icon="getIcon('eyeSlash')" class="w-4 h-4" />
                                        <FontAwesomeIcon v-else-if="getIcon('eye')" :icon="getIcon('eye')" class="w-4 h-4" />
                                    </button>
                                </div>
                            </FormControl>

                            <!-- Indicateur de force du mot de passe -->
                            <div v-if="values.password" class="space-y-1">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-medium text-neutral-700">
                                        Force: {{ passwordStrength.label }}
                                    </span>
                                    <span class="text-xs text-neutral-700">
                                        {{ passwordStrength.score }}%
                                    </span>
                                </div>
                                <div class="relative h-2 w-full overflow-hidden rounded-full"
                                    :style="{ backgroundColor: passwordStrength.bgColor }">
                                    <div class="h-full transition-all"
                                        :style="{
                                            width: `${passwordStrength.score}%`,
                                            backgroundColor: passwordStrength.barColor
                                        }" />
                                </div>
                            </div>
                            <FormDescription v-if="!values.password" class="text-xs text-neutral-500">
                                Au moins 8 caractères avec majuscule, minuscule et chiffre
                            </FormDescription>

                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <!-- Confirmer mot de passe -->
                    <FormField v-slot="{ componentField }" name="confirmPassword">
                        <FormItem class="gap-1">
                            <FormLabel class="text-sm font-medium text-neutral-700">
                                Confirmer le mot de passe
                            </FormLabel>
                            <FormControl>
                                <div class="relative">
                                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <FontAwesomeIcon v-if="getIcon('lock')" :icon="getIcon('lock')" class="w-4 h-4" />
                                    </div>
                                    <Input
                                        :type="showConfirmPassword ? 'text' : 'password'"
                                        placeholder="••••••••"
                                        class="pl-10 pr-10"
                                        autocomplete="new-password"
                                        v-bind="componentField"
                                    />
                                    <button
                                        type="button"
                                        @click="showConfirmPassword = !showConfirmPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    >
                                        <FontAwesomeIcon v-if="showConfirmPassword && getIcon('eyeSlash')" :icon="getIcon('eyeSlash')" class="w-4 h-4" />
                                        <FontAwesomeIcon v-else-if="getIcon('eye')" :icon="getIcon('eye')" class="w-4 h-4" />
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <!-- Bouton de soumission -->
                    <Button
                        type="submit"
                        color="primary"
                        class="w-full"
                        size="lg"
                        :disabled="isSubmitting"
                    >
                        <span class="font-bold">
                            {{ isSubmitting ? 'Réinitialisation...' : 'Réinitialiser mon mot de passe' }}
                        </span>
                    </Button>
                </form>
            </div>

            <!-- Succès -->
            <div v-else-if="isSuccess" class="space-y-6 text-center py-4">
                <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div class="space-y-2">
                    <p class="text-neutral-600">
                        Votre mot de passe a été réinitialisé avec succès.
                        Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                    </p>
                </div>

                <Button
                    type="button"
                    color="primary"
                    size="lg"
                    class="w-full"
                    @click="goToLogin"
                >
                    <span class="font-bold">Se connecter</span>
                </Button>
            </div>
        </AuthFormWrapper>
    </DefaultLayout>
</template>
