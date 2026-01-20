<script setup lang="ts">
/**
 * Composant LoginForm
 * Formulaire de connexion avec validation zod
 */
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
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
    submit: [values: { email: string; password: string; rememberMe: boolean }]
    'forgot-password': []
}>()

/**
 * Schéma de validation avec zod
 */
const formSchema = toTypedSchema(z.object({
    email: z.string({ required_error: 'L\'email est requis' })
        .email({ message: 'L\'email n\'est pas valide' }),
    password: z.string({ required_error: 'Le mot de passe est requis' })
        .min(1, { message: 'Le mot de passe est requis' })
}))

const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
})

/**
 * Toggle password visibility
 */
const showPassword = ref(false)

/**
 * Remember me checkbox
 */
const rememberMe = ref(false)

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    eye: byPrefixAndName.fas?.['eye'],
    eyeSlash: byPrefixAndName.fas?.['eye-slash'],
    envelope: byPrefixAndName.fas?.['envelope'],
    lock: byPrefixAndName.fas?.['lock'],
}))

const getIcon = (iconKey: 'eye' | 'eyeSlash' | 'envelope' | 'lock'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

const onSubmit = handleSubmit((values) => {
    emit('submit', { ...values, rememberMe: rememberMe.value })
})
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-1">
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
                            autocomplete="current-password" v-bind="componentField" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
                            <FontAwesomeIcon v-if="showPassword && getIcon('eyeSlash')" :icon="getIcon('eyeSlash')"
                                class="w-4 h-4" />
                            <FontAwesomeIcon v-else-if="getIcon('eye')" :icon="getIcon('eye')" class="w-4 h-4" />
                        </button>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <!-- Rester connecté et mot de passe oublié -->
        <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
                <Checkbox v-model:checked="rememberMe" />
                <span class="text-sm text-neutral-700" style="font-family: Roboto, sans-serif;">
                    Rester connecté
                </span>
            </label>
            <button type="button" @click="emit('forgot-password')" class="text-sm text-secondary hover:underline"
                style="font-family: Roboto, sans-serif;">
                Mot de passe oublié ?
            </button>
        </div>

        <!-- Bouton de soumission -->
        <Button type="submit" variant="secondary" rounded="lg" class="w-full" size="lg" :disabled="isSubmitting">
            <span class="font-bold" style="font-family: Roboto, sans-serif;">
                {{ isSubmitting ? 'Chargement...' : 'Se connecter' }}
            </span>
        </Button>
    </form>
</template>
