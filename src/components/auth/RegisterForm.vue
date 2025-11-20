<script setup lang="ts">
/**
 * Composant RegisterForm
 * Formulaire d'inscription avec validation zod et indicateur de force du mot de passe
 */
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface Props {
    /**
     * État de soumission
     */
    isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isSubmitting: false
})

const emit = defineEmits<{
    submit: [values: {
        firstName: string
        lastName: string
        email: string
        password: string
        confirmPassword: string
    }]
}>()

/**
 * Schéma de validation avec zod
 */
const formSchema = toTypedSchema(z.object({
    firstName: z.string({ required_error: 'Le prénom est requis' })
        .min(1, { message: 'Le prénom est requis' }),
    lastName: z.string({ required_error: 'Le nom est requis' })
        .min(1, { message: 'Le nom est requis' }),
    email: z.string({ required_error: 'L\'email est requis' })
        .email({ message: 'L\'email n\'est pas valide' }),
    password: z.string({ required_error: 'Le mot de passe est requis' })
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
        .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
        .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
        .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' }),
    confirmPassword: z.string({ required_error: 'Veuillez confirmer votre mot de passe' })
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
}))

const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
})

/**
 * Toggle password visibility
 */
const showPassword = ref(false)
const showConfirmPassword = ref(false)

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

    // Critères de force
    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 10
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/[0-9]/.test(password)) score += 15
    if (/[^A-Za-z0-9]/.test(password)) score += 10 // Caractères spéciaux

    // Labels et couleurs avec RGB pour opacité
    if (score < 60) return {
        score,
        label: 'Faible',
        barColor: 'var(--color-primary)',
        bgColor: 'rgba(var(--color-primary-rgb), 0.2)'
    }
    if (score < 80) return {
        score,
        label: 'Moyen',
        barColor: '#f97316', // orange-500
        bgColor: 'rgba(249, 115, 22, 0.2)'
    }
    return {
        score,
        label: 'Fort',
        barColor: '#22c55e', // green-500
        bgColor: 'rgba(34, 197, 94, 0.2)'
    }
})

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    eye: byPrefixAndName.fas?.['eye'],
    eyeSlash: byPrefixAndName.fas?.['eye-slash'],
    user: byPrefixAndName.fas?.['user'],
    envelope: byPrefixAndName.fas?.['envelope'],
    lock: byPrefixAndName.fas?.['lock'],
}))

const getIcon = (iconKey: 'eye' | 'eyeSlash' | 'user' | 'envelope' | 'lock'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

const onSubmit = handleSubmit((values) => {
    emit('submit', values)
})
</script>

<template>
    <form @submit="onSubmit" class="space-y-1">
        <!-- Prénom et Nom -->
        <div class="grid grid-cols-2 gap-4">
            <!-- Prénom -->
            <FormField v-slot="{ componentField }" name="firstName">
                <FormItem class="gap-1">
                    <FormLabel class="text-sm font-medium text-neutral-700">
                        Prénom
                    </FormLabel>
                    <FormControl>
                        <div class="relative">
                            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                <FontAwesomeIcon v-if="getIcon('user')" :icon="getIcon('user')" class="w-4 h-4" />
                            </div>
                            <Input type="text" placeholder="Jean" class="pl-10" v-bind="componentField" />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Nom -->
            <FormField v-slot="{ componentField }" name="lastName">
                <FormItem class="gap-1">
                    <FormLabel class="text-sm font-medium text-neutral-700">
                        Nom
                    </FormLabel>
                    <FormControl>
                        <div class="relative">
                            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                <FontAwesomeIcon v-if="getIcon('user')" :icon="getIcon('user')" class="w-4 h-4" />
                            </div>
                            <Input type="text" placeholder="Dupont" class="pl-10" v-bind="componentField" />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
        </div>

        <!-- Email -->
        <FormField v-slot="{ componentField }" name="email">
            <FormItem class="gap-1">
                <FormLabel class="text-sm font-medium text-neutral-700">
                    Adresse email
                </FormLabel>
                <FormControl>
                    <div class="relative">
                        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <FontAwesomeIcon v-if="getIcon('envelope')" :icon="getIcon('envelope')" class="w-4 h-4" />
                        </div>
                        <Input type="email" placeholder="jean.dupont@exemple.com" class="pl-10" autocomplete="email"
                            v-bind="componentField" />
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <!-- Mot de passe -->
        <FormField v-slot="{ componentField }" name="password">
            <FormItem class="gap-1">
                <FormLabel class="text-sm font-medium text-neutral-700">
                    Mot de passe
                </FormLabel>
                <FormControl>
                    <div class="relative">
                        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <FontAwesomeIcon v-if="getIcon('lock')" :icon="getIcon('lock')" class="w-4 h-4" />
                        </div>
                        <Input :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="pl-10 pr-10"
                            autocomplete="new-password" v-bind="componentField" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                            <FontAwesomeIcon v-if="showPassword && getIcon('eyeSlash')" :icon="getIcon('eyeSlash')"
                                class="w-4 h-4" />
                            <FontAwesomeIcon v-else-if="getIcon('eye')" :icon="getIcon('eye')" class="w-4 h-4" />
                        </button>
                    </div>
                </FormControl>

                <!-- Indicateur de force du mot de passe -->
                <div v-if="values.password" class="space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-neutral-700" style="font-family: Roboto, sans-serif;">
                            Force: {{ passwordStrength.label }}
                        </span>
                        <span class="text-xs text-neutral-700" style="font-family: Roboto, sans-serif;">
                            {{ passwordStrength.score }}%
                        </span>
                    </div>
                    <!-- Progress bar personnalisée avec couleurs dynamiques -->
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
                        <Input :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••"
                            class="pl-10 pr-10" autocomplete="new-password" v-bind="componentField" />
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                            <FontAwesomeIcon v-if="showConfirmPassword && getIcon('eyeSlash')"
                                :icon="getIcon('eyeSlash')" class="w-4 h-4" />
                            <FontAwesomeIcon v-else-if="getIcon('eye')" :icon="getIcon('eye')" class="w-4 h-4" />
                        </button>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <!-- Bouton de soumission -->
        <Button type="submit" color="primary" class="w-full" size="lg" :disabled="isSubmitting">
            <span class="font-bold" style="font-family: Roboto, sans-serif;">
                {{ isSubmitting ? 'Chargement...' : 'Créer mon compte' }}
            </span>
        </Button>

        <!-- CGU / Mentions légales -->
        <div class="pt-6 border-t border-neutral-200">
            <p class="text-xs text-neutral-500 text-center" style="font-family: Roboto, sans-serif;">
                En créant un compte, vous acceptez nos
                <a href="#" class="text-primary hover:underline">Conditions Générales d'Utilisation</a>
                et notre
                <a href="#" class="text-primary hover:underline">Politique de Confidentialité</a>
            </p>
        </div>
    </form>
</template>
