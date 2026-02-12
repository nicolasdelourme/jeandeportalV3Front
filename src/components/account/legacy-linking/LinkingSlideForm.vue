<script setup lang="ts">
/**
 * Composant LinkingSlideForm
 * Slide 3 : Formulaire de rattachement avec numéro d'abonné et clé secrète
 */
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { LegacyLinkingCredentials } from '@/types/legacy-linking.types'

interface Props {
    /** État de soumission */
    isSubmitting?: boolean
    /** Message d'erreur externe */
    errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
    isSubmitting: false
})

const emit = defineEmits<{
    submit: [credentials: LegacyLinkingCredentials]
    back: []
}>()

/**
 * Schéma de validation Zod
 * Format du code abonné : 2 lettres + 6 chiffres (ex: AB123456)
 * Format du token : 5 caractères alphanumériques (ex: A1B2C)
 */
const formSchema = toTypedSchema(z.object({
    subscriberId: z.string({ required_error: 'Le code abonné est requis' })
        .min(1, { message: 'Le code abonné est requis' })
        .regex(/^[A-Za-z]{2}\d{6}$/, {
            message: 'Format invalide (ex: AB123456)'
        }),
    secretKey: z.string({ required_error: 'Le token est requis' })
        .min(1, { message: 'Le token est requis' })
        .regex(/^[A-Za-z0-9]{5}$/, {
            message: 'Format invalide (5 caractères alphanumériques)'
        })
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    arrowLeft: byPrefixAndName.fas?.['arrow-left'],
    user: byPrefixAndName.fas?.['user'],
    key: byPrefixAndName.fas?.['key'],
    circleExclamation: byPrefixAndName.fas?.['circle-exclamation'],
    circleInfo: byPrefixAndName.fas?.['circle-info'],
    link: byPrefixAndName.fas?.['link'],
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition | undefined => {
    return icons.value[iconKey] as IconDefinition | undefined
}

/**
 * Soumission du formulaire
 */
const onSubmit = handleSubmit((values) => {
    emit('submit', {
        subscriberId: values.subscriberId.toUpperCase(),
        secretKey: values.secretKey.toUpperCase()
    })
})

/**
 * Formater automatiquement en majuscules lors de la saisie
 */
const toUpperCase = (event: Event) => {
    const input = event.target as HTMLInputElement
    input.value = input.value.toUpperCase()
}
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
                v-if="getIcon('arrowLeft')"
                :icon="getIcon('arrowLeft')!"
                class="w-4 h-4"
            />
            <span class="text-sm" style="font-family: Roboto, sans-serif;">Retour</span>
        </button>

        <!-- En-tête -->
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-neutral-800 mb-2" style="font-family: Roboto, sans-serif;">
                Rattachez votre ancien compte
            </h2>
            <p class="text-neutral-600" style="font-family: Roboto, sans-serif;">
                Entrez vos identifiants "Les Emmerdeurs"
            </p>
        </div>

        <!-- Erreur externe -->
        <Alert v-if="errorMessage" variant="destructive" class="mb-6">
            <FontAwesomeIcon
                v-if="getIcon('circleExclamation')"
                :icon="getIcon('circleExclamation')!"
                class="h-4 w-4"
            />
            <AlertDescription style="font-family: Roboto, sans-serif;">
                {{ errorMessage }}
            </AlertDescription>
        </Alert>

        <!-- Formulaire -->
        <form class="space-y-4" @submit.prevent="onSubmit">
            <!-- Code abonné -->
            <FormField v-slot="{ componentField }" name="subscriberId">
                <FormItem class="gap-1">
                    <FormLabel class="text-sm font-medium text-neutral-700">
                        Code abonné
                    </FormLabel>
                    <FormControl>
                        <div class="relative">
                            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                <FontAwesomeIcon
                                    v-if="getIcon('user')"
                                    :icon="getIcon('user')!"
                                    class="w-4 h-4"
                                />
                            </div>
                            <Input
                                type="text"
                                placeholder="AB123456"
                                class="pl-10 uppercase"
                                autocomplete="off"
                                maxlength="8"
                                v-bind="componentField"
                                @input="toUpperCase"
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Token -->
            <FormField v-slot="{ componentField }" name="secretKey">
                <FormItem class="gap-1">
                    <FormLabel class="text-sm font-medium text-neutral-700">
                        Token
                    </FormLabel>
                    <FormControl>
                        <div class="relative">
                            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                <FontAwesomeIcon
                                    v-if="getIcon('key')"
                                    :icon="getIcon('key')!"
                                    class="w-4 h-4"
                                />
                            </div>
                            <Input
                                type="text"
                                placeholder="A1B2C"
                                class="pl-10 uppercase"
                                autocomplete="off"
                                maxlength="5"
                                v-bind="componentField"
                                @input="toUpperCase"
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Info helper -->
            <div class="flex items-start gap-2 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600">
                <FontAwesomeIcon
                    v-if="getIcon('circleInfo')"
                    :icon="getIcon('circleInfo')!"
                    class="w-4 h-4 mt-0.5 flex-shrink-0 text-neutral-400"
                />
                <p style="font-family: Roboto, sans-serif;">
                    Vous trouverez ces informations dans votre dernier email de renouvellement.
                </p>
            </div>

            <!-- Bouton de soumission -->
            <Button
                type="submit"
                variant="secondary"
                rounded="lg"
                class="w-full"
                size="lg"
                :disabled="isSubmitting"
            >
                <FontAwesomeIcon
                    v-if="getIcon('link')"
                    :icon="getIcon('link')!"
                    class="mr-2 w-4 h-4"
                />
                <span class="font-bold" style="font-family: Roboto, sans-serif;">
                    {{ isSubmitting ? 'Rattachement en cours...' : 'Rattacher mon compte' }}
                </span>
            </Button>
        </form>
    </div>
</template>
