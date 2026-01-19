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
import { getLocalTimeZone, today, parseDate } from '@internationalized/date'
import type { DateValue } from 'reka-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { cn } from '@/lib/utils'
import AddressManagement from './AddressManagement.vue'
import PasswordChangeDialog from './PasswordChangeDialog.vue'
import ChangeEmailDialog from './ChangeEmailDialog.vue'
import { useAuth } from '@/composables/useAuth'
import { useUserDisplay } from '@/composables/useUserDisplay'

/**
 * Auth store et display utilities
 */
const { user, updateUserProfile } = useAuth()
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
 * État du dialog de changement d'email
 */
const isEmailDialogOpen = ref(false)

/**
 * Date de naissance sélectionnée (DateValue pour Calendar)
 */
const selectedBirthDate = ref<DateValue | undefined>()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    calendar: byPrefixAndName.fas?.['calendar'],
}))

const getIcon = (iconKey: 'calendar'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

/**
 * Convertit une DateValue en string YYYY-MM-DD
 */
const dateValueToString = (date: DateValue | undefined): string => {
    if (!date) return ''
    const year = date.year.toString().padStart(4, '0')
    const month = date.month.toString().padStart(2, '0')
    const day = date.day.toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * Formate la date pour l'affichage (JJ/MM/AAAA)
 */
const formatDateDisplay = (date: DateValue | undefined): string => {
    if (!date) return ''
    const day = date.day.toString().padStart(2, '0')
    const month = date.month.toString().padStart(2, '0')
    const year = date.year.toString()
    return `${day}/${month}/${year}`
}

/**
 * Convertit une string YYYY-MM-DD en DateValue
 */
const stringToDateValue = (dateStr: string | null | undefined): DateValue | undefined => {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return undefined
    try {
        return parseDate(dateStr)
    } catch {
        return undefined
    }
}

/**
 * Date maximale = aujourd'hui (on ne peut pas naître dans le futur)
 */
const maxDate = today(getLocalTimeZone())

/**
 * Date minimale = 120 ans en arrière
 */
const minDate = today(getLocalTimeZone()).subtract({ years: 120 })

/**
 * Handler pour la sélection de date dans le Calendar
 */
const handleDateSelect = (date: unknown, setValue: (value: string) => void) => {
    const singleDate = Array.isArray(date) ? date[0] : date
    if (singleDate && typeof singleDate === 'object' && 'year' in singleDate) {
        selectedBirthDate.value = singleDate as DateValue
        setValue(dateValueToString(singleDate as DateValue))
    } else {
        selectedBirthDate.value = undefined
        setValue('')
    }
}

/**
 * Schéma de validation
 * Note: firstName et lastName peuvent être null côté API, on permet les strings vides
 */
const formSchema = toTypedSchema(z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    pseudo: z.string().optional(),
    phone: z.string().optional(),
    birthDate: z.string().optional(),
}))

/**
 * Valeurs initiales depuis le store (computed pour réactivité)
 */
const initialFormValues = computed(() => ({
    firstName: user.value?.firstName ?? '',
    lastName: user.value?.lastName ?? '',
    pseudo: user.value?.pseudo ?? '',
    phone: user.value?.phone ?? '',
    birthDate: user.value?.birthDate ?? '',
}))

const { handleSubmit, resetForm, meta } = useForm({
    validationSchema: formSchema,
    initialValues: initialFormValues.value,
})

/**
 * Réinitialiser le formulaire quand les données user changent
 * Note: user est un computed, donc on watch user.value pour la réactivité
 */
watch(() => user.value, (newUser) => {
    if (newUser) {
        resetForm({
            values: {
                firstName: newUser.firstName ?? '',
                lastName: newUser.lastName ?? '',
                pseudo: newUser.pseudo ?? '',
                phone: newUser.phone ?? '',
                birthDate: newUser.birthDate ?? '',
            }
        })
        // Synchroniser aussi selectedBirthDate pour le Calendar
        selectedBirthDate.value = stringToDateValue(newUser.birthDate)
    }
}, { immediate: true, deep: true })

/**
 * Soumission du formulaire
 */
const onSubmit = handleSubmit(async (values) => {
    isSubmitting.value = true

    try {
        await updateUserProfile({
            firstName: values.firstName || undefined,
            lastName: values.lastName || undefined,
            pseudo: values.pseudo || undefined,
            phone: values.phone || undefined,
            birthDate: values.birthDate || undefined,
        })

        toast.success('Profil mis à jour avec succès !')
        // Réinitialiser le formulaire avec les nouvelles valeurs pour que dirty redevienne false
        resetForm({ values })
    } catch (error: any) {
        console.error('Erreur:', error)
        toast.error(error.message || 'Impossible de mettre à jour le profil')
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
                <div class="hidden flex items-center gap-6">
                    <Avatar class="h-24 w-24">
                        <AvatarImage v-if="avatarUrl" :src="avatarUrl" alt="Photo de profil" />
                        <AvatarFallback class="text-2xl bg-primary text-white">{{ avatarInitials }}</AvatarFallback>
                    </Avatar>
                    <div class="space-y-2">
                        <h3 class="font-semibold text-sm text-neutral-700">
                            Photo de profil
                        </h3>
                        <div class="flex gap-2">
                            <Button variant="outline" size="sm">
                                <span class="text-sm font-semibold tracking-wide">MODIFIER</span>
                            </Button>
                            <Button variant="outline" size="sm">
                                <span class="text-sm font-semibold tracking-wide">SUPPRIMER</span>
                            </Button>
                        </div>
                    </div>
                </div>


                <Separator class="hidden" />

                <!-- Form -->
                <form @submit="onSubmit" class="space-y-4">
                    <!-- Prénom et Nom -->
                    <div class="grid grid-cols-2 gap-4">
                        <FormField v-slot="{ componentField }" name="firstName">
                            <FormItem class="gap-1">
                                <FormLabel class="text-sm font-medium text-neutral-700">Prénom</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" class="rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="lastName">
                            <FormItem class="gap-1">
                                <FormLabel class="text-sm font-medium text-neutral-700">Nom</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField"  class="rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <!-- Pseudo et Téléphone -->
                    <div class="grid grid-cols-2 gap-4">
                        <FormField v-slot="{ componentField }" name="pseudo">
                            <FormItem class="gap-1">
                                <FormLabel class="text-sm font-medium text-neutral-700">Pseudo</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" class="rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="phone">
                            <FormItem class="gap-1">
                                <FormLabel class="text-sm font-medium text-neutral-700">Téléphone</FormLabel>
                                <FormControl>
                                    <PhoneInput
                                        v-bind="componentField"
                                        placeholder="6 12 34 56 78"
                                        initial-country="fr"
                                        :preferred-countries="['fr', 'be', 'ch', 'ca']"
                                        class="rounded-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <!-- Date de naissance -->
                    <div class="grid grid-cols-2 gap-4">
                        <FormField v-slot="{ setValue }" name="birthDate">
                            <FormItem class="gap-1">
                                <FormLabel class="text-sm font-medium text-neutral-700">Date de naissance</FormLabel>
                                <Popover>
                                    <PopoverTrigger as-child>
                                        <FormControl>
                                            <button
                                                type="button"
                                                :class="cn(
                                                    'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
                                                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                                    'pl-10 text-left relative cursor-pointer',
                                                    !selectedBirthDate && 'text-muted-foreground'
                                                )"
                                            >
                                                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                                    <FontAwesomeIcon v-if="getIcon('calendar')" :icon="getIcon('calendar')" class="w-4 h-4" />
                                                </div>
                                                <span class="truncate">
                                                    {{ selectedBirthDate ? formatDateDisplay(selectedBirthDate) : 'Sélectionner une date' }}
                                                </span>
                                            </button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent class="w-auto p-0" align="start">
                                        <Calendar
                                            :model-value="selectedBirthDate"
                                            :max-value="maxDate"
                                            :min-value="minDate"
                                            layout="month-and-year"
                                            locale="fr"
                                            initial-focus
                                            @update:model-value="(date) => handleDateSelect(date, setValue)"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <!-- Bouton -->
                    <div class="flex justify-end pt-4">
                        <Button type="submit" variant="default" rounded="lg" :disabled="!meta.dirty || isSubmitting">
                            <span class="font-semibold tracking-wide">
                                {{ isSubmitting ? 'ENREGISTREMENT...' : 'ENREGISTRER LES MODIFICATIONS' }}
                            </span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        <!-- Sécurité / Mot de passe et Email -->
        <Card>
            <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                    Gérez la sécurité de votre compte
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
                <!-- Mot de passe -->
                <div class="flex items-center justify-between">
                    <div class="space-y-1">
                        <h3 class="text-sm font-semibold text-neutral-700">
                            Mot de passe
                        </h3>
                        <p class="text-sm text-muted-foreground">
                            Modifiez votre mot de passe pour sécuriser votre compte
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" class="text-red-500 hover:text-red-600 hover:bg-transparent" @click="isPasswordDialogOpen = true">
                        Changer le mot de passe
                    </Button>
                </div>

                <Separator />

                <!-- Adresse email de connexion -->
                <div class="flex items-center justify-between">
                    <div class="space-y-1">
                        <h3 class="text-sm font-semibold text-neutral-700">
                            Adresse email de connexion
                        </h3>
                        <p class="text-sm text-muted-foreground">
                            Modifiez l'adresse email utilisée pour vous connecter
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" class="text-red-500 hover:text-red-600 hover:bg-transparent" @click="isEmailDialogOpen = true">
                        Modifier l'adresse email
                    </Button>
                </div>
            </CardContent>
        </Card>

        <!-- Adresses postales -->
        <AddressManagement />

        <!-- Dialog de changement de mot de passe -->
        <PasswordChangeDialog v-model:open="isPasswordDialogOpen" />

        <!-- Dialog de changement d'email -->
        <ChangeEmailDialog v-model:open="isEmailDialogOpen" />
    </div>
</template>
