<script setup lang="ts">
/**
 * Section Profil
 * Gestion des informations personnelles, avatar, adresses et mot de passe
 * Connecté au store auth pour afficher les vraies données utilisateur
 */
import { ref, computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import AddressManagement from './AddressManagement.vue'
import PasswordChangeDialog from './PasswordChangeDialog.vue'
import { useAuth } from '@/composables/useAuth'
import { useUserDisplay } from '@/composables/useUserDisplay'

/**
 * Auth store et display utilities
 */
const { user } = useAuth()
const { avatarInitials, avatarUrl } = useUserDisplay(user)

/**
 * État de soumission
 */
const isSubmitting = ref(false)

/**
 * État du dialog de changement de mot de passe
 */
const isPasswordDialogOpen = ref(false)

/**
 * Schéma de validation
 * Note: firstName et lastName peuvent être null côté API, on permet les strings vides
 */
const formSchema = toTypedSchema(z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string({ required_error: 'L\'email est requis' })
        .email({ message: 'L\'email n\'est pas valide' }),
    phone: z.string().optional(),
}))

/**
 * Valeurs initiales depuis le store (computed pour réactivité)
 */
const initialFormValues = computed(() => ({
    firstName: user.value?.firstName ?? '',
    lastName: user.value?.lastName ?? '',
    email: user.value?.email ?? '',
    phone: user.value?.phone ?? '',
}))

const { handleSubmit, resetForm } = useForm({
    validationSchema: formSchema,
    initialValues: initialFormValues.value,
})

/**
 * Réinitialiser le formulaire quand les données user changent
 */
watch(user, (newUser) => {
    if (newUser) {
        resetForm({
            values: {
                firstName: newUser.firstName ?? '',
                lastName: newUser.lastName ?? '',
                email: newUser.email ?? '',
                phone: newUser.phone ?? '',
            }
        })
    }
}, { immediate: true })

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
    <div class="space-y-6">
        <!-- Informations personnelles -->
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
                        <AvatarImage v-if="avatarUrl" :src="avatarUrl" alt="Photo de profil" />
                        <AvatarFallback class="text-2xl bg-primary text-white">{{ avatarInitials }}</AvatarFallback>
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

                    <!-- Email et Téléphone -->
                    <div class="grid grid-cols-2 gap-4">
                        <FormField v-slot="{ componentField }" name="email">
                            <FormItem class="gap-1">
                                <FormLabel class="text-sm font-medium text-neutral-700">Adresse email</FormLabel>
                                <FormControl>
                                    <Input type="email" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="phone">
                            <FormItem class="gap-1">
                                <FormLabel class="text-sm font-medium text-neutral-700">Téléphone</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="06 12 34 56 78" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

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

        <!-- Sécurité / Mot de passe -->
        <Card>
            <CardHeader>
                <CardTitle style="font-family: Roboto, sans-serif;">Sécurité</CardTitle>
                <CardDescription style="font-family: Roboto, sans-serif;">
                    Gérez la sécurité de votre compte
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-sm font-medium text-neutral-700" style="font-family: Roboto, sans-serif;">
                            Mot de passe
                        </h3>
                        <p class="text-sm text-muted-foreground mt-1">
                            Modifiez votre mot de passe pour sécuriser votre compte
                        </p>
                    </div>
                    <Button variant="outline" @click="isPasswordDialogOpen = true">
                        <FontAwesomeIcon :icon="['fas', 'key']" class="mr-2" />
                        Changer le mot de passe
                    </Button>
                </div>
            </CardContent>
        </Card>

        <!-- Adresses postales -->
        <AddressManagement />

        <!-- Dialog de changement de mot de passe -->
        <PasswordChangeDialog v-model:open="isPasswordDialogOpen" />
    </div>
</template>
