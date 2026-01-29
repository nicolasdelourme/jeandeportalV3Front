<script setup lang="ts">
/**
 * Dialog de changement d'adresse email
 * Envoie un email de validation pour confirmer le changement
 */
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { getErrorMessage } from '@/lib/error-utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { useAuth } from '@/composables/useAuth'
import { authService } from '@/services/auth.service'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { user } = useAuth()
const isSubmitting = ref(false)
const emailSent = ref(false)

const currentEmail = computed(() => user.value?.email || '')

/**
 * Schéma de validation Zod
 */
const formSchema = toTypedSchema(
  z.object({
    newEmail: z
      .string()
      .min(1, 'L\'email est requis')
      .email('Adresse email invalide')
      .refine(
        (email) => email.toLowerCase() !== currentEmail.value.toLowerCase(),
        'Le nouvel email doit être différent de l\'actuel'
      )
  })
)

const { handleSubmit, resetForm, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    newEmail: ''
  }
})

/**
 * Envoie la demande de changement d'email
 */
const onSubmit = handleSubmit(async (formValues) => {
  isSubmitting.value = true
  try {
    const result = await authService.requestEmailChange(formValues.newEmail)

    if (result.status === 'success') {
      emailSent.value = true
      toast.success('Un email de validation vous a été envoyé')
    } else {
      toast.error(result.message || 'Impossible de demander le changement d\'email')
    }
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
})

/**
 * Ferme le dialog et réinitialise l'état
 */
function handleClose() {
  if (!isSubmitting.value) {
    emailSent.value = false
    resetForm()
    emit('update:open', false)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle style="font-family: Roboto, sans-serif">
          Modifier l'adresse email
        </DialogTitle>
        <DialogDescription style="font-family: Roboto, sans-serif">
          {{ emailSent
            ? 'Un email de validation a été envoyé.'
            : 'Entrez votre nouvelle adresse email.'
          }}
        </DialogDescription>
      </DialogHeader>

      <!-- État initial : formulaire -->
      <form v-if="!emailSent" class="space-y-4" @submit.prevent="onSubmit">
        <div class="py-4 space-y-4">
          <!-- Email actuel (lecture seule) -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-muted-foreground">
              Email actuel
            </label>
            <p class="text-sm font-medium text-secondary">
              {{ currentEmail }}
            </p>
          </div>

          <!-- Nouveau email -->
          <FormField v-slot="{ componentField }" name="newEmail">
            <FormItem>
              <FormLabel>Nouvel email</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="email"
                  placeholder="nouveau@email.com"
                  :disabled="isSubmitting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <p class="text-xs text-muted-foreground">
            Un email de validation sera envoyé à votre nouvelle adresse.
            Le lien est valable 15 minutes.
          </p>
        </div>

        <DialogFooter class="flex gap-0 md:gap-2">
          <Button
            variant="outline"
            type="button"
            rounded="lg"
            color="secondary"
            class="hover:bg-secondary hover:border-secondary"
            :disabled="isSubmitting"
            @click="handleClose"
          >
            Annuler
          </Button>
          <Button
          variant="secondary"
            type="submit"
            rounded="lg"
            :disabled="isSubmitting || !values.newEmail"
          >
            <span style="font-family: Roboto, sans-serif">
              {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien' }}
            </span>
          </Button>
        </DialogFooter>
      </form>

      <!-- État après envoi : confirmation -->
      <template v-else>
        <div class="py-6 text-center space-y-4">
          <!-- Icône succès -->
          <div class="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div class="space-y-2">
            <p class="text-sm text-neutral-600">
              Un email a été envoyé à <strong>{{ values.newEmail }}</strong>
            </p>
            <p class="text-sm text-neutral-600">
              Cliquez sur le lien dans l'email pour valider le changement.
            </p>
          </div>

          <p class="text-xs text-muted-foreground">
            Le lien est valable 15 minutes.
          </p>
        </div>

        <DialogFooter>
          <Button class="w-full" @click="handleClose">
            Fermer
          </Button>
        </DialogFooter>
      </template>
    </DialogContent>
  </Dialog>
</template>
