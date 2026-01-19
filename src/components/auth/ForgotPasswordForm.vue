<script setup lang="ts">
/**
 * Composant ForgotPasswordForm
 * Formulaire de réinitialisation du mot de passe avec validation zod
 */
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
    submit: [values: { email: string }]
}>()

/**
 * Schéma de validation avec zod
 */
const formSchema = toTypedSchema(z.object({
    email: z.string({ required_error: 'L\'email est requis' })
        .email({ message: 'L\'email n\'est pas valide' })
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    envelope: byPrefixAndName.fas?.['envelope'],
}))

const getIcon = (iconKey: 'envelope'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

const onSubmit = handleSubmit((values) => {
    emit('submit', values)
})
</script>

<template>
    <form @submit="onSubmit" class="space-y-1">
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

        <!-- Message d'information -->
        <div class="bg-blue-50 border border-blue-200 rounded p-3">
            <p class="text-sm text-blue-800" style="font-family: Roboto, sans-serif;">
                Un email contenant un lien de réinitialisation sera envoyé à cette adresse.
            </p>
        </div>

        <!-- Bouton de soumission -->
        <Button type="submit" variant="secondary" rounded="lg" class="w-full" size="lg" :disabled="isSubmitting">
            <span class="font-bold text-sm" style="font-family: Roboto, sans-serif;">
                {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
            </span>
        </Button>
    </form>
</template>
