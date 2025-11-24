<script setup lang="ts">
/**
 * Dialog de changement de mot de passe
 * Peut être appelé depuis n'importe où dans l'application
 */
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

/**
 * État de soumission
 */
const isSubmitting = ref(false)

/**
 * Toggle password visibility
 */
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

/**
 * Icônes
 */
const icons = computed(() => ({
  eye: byPrefixAndName.fas?.['eye'],
  eyeSlash: byPrefixAndName.fas?.['eye-slash'],
  lock: byPrefixAndName.fas?.['lock']
}))

const getIcon = (iconKey: 'eye' | 'eyeSlash' | 'lock'): IconDefinition => {
  return icons.value[iconKey] as IconDefinition
}

/**
 * Schéma de validation
 */
const formSchema = toTypedSchema(
  z
    .object({
      currentPassword: z
        .string({ required_error: 'Le mot de passe actuel est requis' })
        .min(1, { message: 'Le mot de passe actuel est requis' }),
      newPassword: z
        .string({ required_error: 'Le nouveau mot de passe est requis' })
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
        .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
        .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
        .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' }),
      confirmPassword: z
        .string({ required_error: 'Veuillez confirmer votre mot de passe' })
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword']
    })
)

const { handleSubmit, resetForm, values } = useForm({
  validationSchema: formSchema
})

/**
 * Soumission du formulaire
 */
const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true

  try {
    // TODO: Appeler l'API de changement de mot de passe
    console.log('Changement mot de passe')
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulation
    toast.success('Mot de passe mis à jour avec succès !')
    resetForm()
    emit('update:open', false)

    // Reset password visibility
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
  } catch (error) {
    console.error('Erreur:', error)
    toast.error('Impossible de changer le mot de passe')
  } finally {
    isSubmitting.value = false
  }
})

/**
 * Fermer le dialog
 */
const closeDialog = () => {
  emit('update:open', false)
  resetForm()
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}
</script>

<template>
  <Dialog :open="open" @update:open="closeDialog">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle style="font-family: Roboto, sans-serif">
          Changer le mot de passe
        </DialogTitle>
        <DialogDescription style="font-family: Roboto, sans-serif">
          Mettez à jour votre mot de passe pour sécuriser votre compte
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <!-- Mot de passe actuel -->
        <FormField v-slot="{ componentField }" name="currentPassword">
          <FormItem class="gap-1">
            <FormLabel class="text-sm font-medium text-neutral-700">
              Mot de passe actuel
            </FormLabel>
            <FormControl>
              <div class="relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <FontAwesomeIcon
                    v-if="getIcon('lock')"
                    :icon="getIcon('lock')"
                    class="w-4 h-4"
                  />
                </div>
                <Input
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="pl-10 pr-10"
                  autocomplete="current-password"
                  v-bind="componentField"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <FontAwesomeIcon
                    v-if="showCurrentPassword && getIcon('eyeSlash')"
                    :icon="getIcon('eyeSlash')"
                    class="w-4 h-4"
                  />
                  <FontAwesomeIcon
                    v-else-if="getIcon('eye')"
                    :icon="getIcon('eye')"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Nouveau mot de passe -->
        <FormField v-slot="{ componentField }" name="newPassword">
          <FormItem class="gap-1">
            <FormLabel class="text-sm font-medium text-neutral-700">
              Nouveau mot de passe
            </FormLabel>
            <FormControl>
              <div class="relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <FontAwesomeIcon
                    v-if="getIcon('lock')"
                    :icon="getIcon('lock')"
                    class="w-4 h-4"
                  />
                </div>
                <Input
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="pl-10 pr-10"
                  autocomplete="new-password"
                  v-bind="componentField"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <FontAwesomeIcon
                    v-if="showNewPassword && getIcon('eyeSlash')"
                    :icon="getIcon('eyeSlash')"
                    class="w-4 h-4"
                  />
                  <FontAwesomeIcon
                    v-else-if="getIcon('eye')"
                    :icon="getIcon('eye')"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Confirmer nouveau mot de passe -->
        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem class="gap-1">
            <FormLabel class="text-sm font-medium text-neutral-700">
              Confirmer le nouveau mot de passe
            </FormLabel>
            <FormControl>
              <div class="relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <FontAwesomeIcon
                    v-if="getIcon('lock')"
                    :icon="getIcon('lock')"
                    class="w-4 h-4"
                  />
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
                  <FontAwesomeIcon
                    v-if="showConfirmPassword && getIcon('eyeSlash')"
                    :icon="getIcon('eyeSlash')"
                    class="w-4 h-4"
                  />
                  <FontAwesomeIcon
                    v-else-if="getIcon('eye')"
                    :icon="getIcon('eye')"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Boutons -->
        <div class="flex gap-3 pt-4">
          <Button type="submit" color="primary" :disabled="isSubmitting" class="flex-1">
            <span class="font-medium" style="font-family: Roboto, sans-serif">
              {{ isSubmitting ? 'Mise à jour...' : 'Mettre à jour' }}
            </span>
          </Button>
          <Button type="button" variant="outline" @click="closeDialog" :disabled="isSubmitting">
            Annuler
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
