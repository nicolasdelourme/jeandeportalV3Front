<script setup lang="ts">
/**
 * Section Profil
 * Gestion des informations personnelles et avatar
 */
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

/**
 * État de soumission
 */
const isSubmitting = ref(false)

/**
 * Schéma de validation
 */
const formSchema = toTypedSchema(z.object({
    firstName: z.string({ required_error: 'Le prénom est requis' })
        .min(1, { message: 'Le prénom est requis' }),
    lastName: z.string({ required_error: 'Le nom est requis' })
        .min(1, { message: 'Le nom est requis' }),
    email: z.string({ required_error: 'L\'email est requis' })
        .email({ message: 'L\'email n\'est pas valide' }),
}))

const { handleSubmit, values, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@exemple.com',
    }
})

/**
 * Initiales pour l'avatar
 */
const initials = ref('JD')

/**
 * Soumission du formulaire
 */
const onSubmit = handleSubmit(async (values) => {
    isSubmitting.value = true

    try {
        // TODO: Appeler l'API de mise à jour du profil
        console.log('Mise à jour profil:', values)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
        toast.success('Profil mis à jour avec succès !')
    } catch (error) {
        console.error('Erreur:', error)
        toast.error('Impossible de mettre à jour le profil')
    } finally {
        isSubmitting.value = false
    }
})
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle style="font-family: Roboto, sans-serif;">Informations personnelles</CardTitle>
            <CardDescription style="font-family: Roboto, sans-serif;">
                Mettez à jour vos informations de profil
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
            <!-- Avatar Section -->
            <div class="flex items-center gap-6">
                <Avatar class="h-24 w-24">
                    <AvatarImage src="" alt="Photo de profil" />
                    <AvatarFallback class="text-2xl bg-primary text-white">{{ initials }}</AvatarFallback>
                </Avatar>
                <div class="space-y-2">
                    <h3 class="font-medium text-sm text-neutral-700" style="font-family: Roboto, sans-serif;">
                        Photo de profil
                    </h3>
                    <div class="flex gap-2">
                        <Button variant="outline" color="neutral-700" size="sm">
                            <span class="text-sm" style="font-family: Roboto, sans-serif;">Modifier</span>
                        </Button>
                        <Button variant="outline" size="sm">
                            <span class="text-sm" style="font-family: Roboto, sans-serif;">Supprimer</span>
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />

            <!-- Form -->
            <form @submit="onSubmit" class="space-y-4">
                <!-- Prénom et Nom -->
                <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="firstName">
                        <FormItem class="gap-1">
                            <FormLabel class="text-sm font-medium text-neutral-700">Prénom</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="lastName">
                        <FormItem class="gap-1">
                            <FormLabel class="text-sm font-medium text-neutral-700">Nom</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>

                <!-- Email -->
                <FormField v-slot="{ componentField }" name="email">
                    <FormItem class="gap-1">
                        <FormLabel class="text-sm font-medium text-neutral-700">Adresse email</FormLabel>
                        <FormControl>
                            <Input type="email" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <!-- Bouton -->
                <div class="flex justify-end pt-4">
                    <Button type="submit" color="primary" :disabled="isSubmitting">
                        <span class="font-medium" style="font-family: Roboto, sans-serif;">
                            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                        </span>
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
</template>
