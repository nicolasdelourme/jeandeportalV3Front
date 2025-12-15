<script setup lang="ts">
/**
 * Dialog de changement de mot de passe
 * Envoie un email de réinitialisation via le flow forgot-password existant
 */
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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

const userEmail = computed(() => user.value?.email || '')

/**
 * Envoie l'email de réinitialisation
 */
async function handleConfirm() {
  if (!userEmail.value) return

  isSubmitting.value = true
  try {
    await authService.forgotPassword(userEmail.value)
    toast.success('Un email de réinitialisation vous a été envoyé')
    emit('update:open', false)
  } catch (error) {
    console.error('Erreur envoi email:', error)
    toast.error("Impossible d'envoyer l'email de réinitialisation")
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Ferme le dialog
 */
function handleClose() {
  if (!isSubmitting.value) {
    emit('update:open', false)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle style="font-family: Roboto, sans-serif">
          Changer le mot de passe
        </DialogTitle>
        <DialogDescription style="font-family: Roboto, sans-serif">
          Un email de réinitialisation sera envoyé à :
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <p class="text-center font-medium text-primary text-lg">
          {{ userEmail }}
        </p>
        <p class="text-sm text-muted-foreground text-center mt-3">
          Cliquez sur le lien dans l'email pour définir votre nouveau mot de passe.
        </p>
      </div>

      <DialogFooter class="gap-2 sm:gap-0">
        <Button
          variant="outline"
          @click="handleClose"
          :disabled="isSubmitting"
        >
          Annuler
        </Button>
        <Button
          @click="handleConfirm"
          :disabled="isSubmitting || !userEmail"
        >
          <span style="font-family: Roboto, sans-serif">
            {{ isSubmitting ? 'Envoi en cours...' : "Envoyer l'email" }}
          </span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
