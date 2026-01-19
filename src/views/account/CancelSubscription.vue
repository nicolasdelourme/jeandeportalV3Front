<script setup lang="ts">
/**
 * Page d'annulation d'abonnement (tunnel)
 * Processus en plusieurs étapes pour annuler un abonnement
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { CancellationReason } from '@/types/subscription.types'
import { cancellationReasonLabels } from '@/types/subscription.types'

const router = useRouter()

/**
 * Icônes
 */
const icons = computed(() => ({
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
  timesCircle: byPrefixAndName.fas?.['times-circle'],
  infoCircle: byPrefixAndName.fas?.['info-circle'],
  check: byPrefixAndName.fas?.['check']
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition => {
  return icons.value[iconKey] as IconDefinition
}

// Étapes du tunnel
const currentStep = ref(1)
const totalSteps = 3

// Abonnement simulé (à récupérer via API)
const subscription = ref({
  plan: 'Premium',
  themeName: 'Métaux Précieux',
  quantity: 3,
  price: 75,
  nextBillingDate: '2025-12-10'
})

// Schéma de validation
const formSchema = toTypedSchema(
  z.object({
    reason: z.enum(
      [
        'too_expensive',
        'not_enough_use',
        'found_alternative',
        'technical_issues',
        'changing_needs',
        'other'
      ],
      {
        required_error: 'Veuillez sélectionner une raison'
      }
    ),
    feedback: z.string().optional(),
    immediateCancel: z.boolean().default(false)
  })
)

const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    immediateCancel: false
  }
})

// Navigation entre étapes
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const cancelProcess = () => {
  router.push('/mon-compte?tab=subscription')
}

// Soumission finale
const onSubmit = handleSubmit(async (formValues) => {
  try {
    // TODO: Appel API pour annuler l'abonnement
    console.log('Annulation abonnement:', formValues)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success('Votre abonnement a été annulé avec succès')
    router.push('/mon-compte?tab=subscription')
  } catch (error) {
    console.error(error)
    toast.error('Une erreur est survenue lors de l\'annulation')
  }
})

// Breadcrumb
const goBack = () => {
  router.back()
}
</script>

<template>
  <DefaultLayout>
    <div class="container max-w-3xl mx-auto py-8 px-4">
    <!-- Breadcrumb -->
    <div class="mb-6">
      <Button variant="ghost" @click="goBack" class="mb-4">
        <FontAwesomeIcon v-if="getIcon('arrowLeft')" :icon="getIcon('arrowLeft')" class="mr-2" />
        Retour
      </Button>
      <h1 class="text-3xl font-bold" style="font-family: Roboto, sans-serif">
        Annulation de l'abonnement
      </h1>
      <p class="text-muted-foreground mt-2">
        Nous sommes désolés de vous voir partir. Aidez-nous à nous améliorer en nous expliquant
        pourquoi.
      </p>
    </div>

    <!-- Progression -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Étape {{ currentStep }} sur {{ totalSteps }}</span>
        <span class="text-sm text-muted-foreground">{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-primary h-2 rounded-full transition-all duration-300"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
      </div>
    </div>

    <form @submit="onSubmit">
      <!-- Étape 1: Confirmation de l'intention -->
      <Card v-if="currentStep === 1">
        <CardHeader>
          <CardTitle style="font-family: Roboto, sans-serif">
            Êtes-vous sûr de vouloir annuler ?
          </CardTitle>
          <CardDescription style="font-family: Roboto, sans-serif">
            Voici ce que vous allez perdre en annulant votre abonnement
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Récapitulatif abonnement -->
          <div class="bg-neutral-50 rounded-lg p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-medium" style="font-family: Roboto, sans-serif">
                {{ subscription.plan }} - {{ subscription.themeName }}
              </span>
              <Badge variant="default">Actif</Badge>
            </div>
            <Separator />
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-neutral-600">Consultations par mois</span>
                <span class="font-medium">{{ subscription.quantity }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-600">Prix mensuel</span>
                <span class="font-medium">{{ subscription.price }}€</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-600">Prochain prélèvement</span>
                <span class="font-medium">{{ subscription.nextBillingDate }}</span>
              </div>
            </div>
          </div>

          <!-- Avantages perdus -->
          <div class="space-y-3">
            <h3 class="font-medium text-sm" style="font-family: Roboto, sans-serif">
              Vous perdrez accès à :
            </h3>
            <ul class="space-y-2">
              <li class="flex items-start gap-3">
                <FontAwesomeIcon
                  v-if="getIcon('timesCircle')"
                  :icon="getIcon('timesCircle')"
                  class="w-5 h-5 text-destructive mt-0.5"
                />
                <span class="text-sm">
                  {{ subscription.quantity }} consultations exclusives par mois avec nos experts
                </span>
              </li>
              <li class="flex items-start gap-3">
                <FontAwesomeIcon
                  v-if="getIcon('timesCircle')"
                  :icon="getIcon('timesCircle')"
                  class="w-5 h-5 text-destructive mt-0.5"
                />
                <span class="text-sm">Accès aux analyses détaillées et recommandations personnalisées</span>
              </li>
              <li class="flex items-start gap-3">
                <FontAwesomeIcon
                  v-if="getIcon('timesCircle')"
                  :icon="getIcon('timesCircle')"
                  class="w-5 h-5 text-destructive mt-0.5"
                />
                <span class="text-sm">Support prioritaire et réponses rapides</span>
              </li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <Button type="button" variant="outline" @click="cancelProcess" class="flex-1">
              Garder mon abonnement
            </Button>
            <Button type="button" color="red" @click="nextStep" class="flex-1">
              Continuer l'annulation
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Étape 2: Raison et feedback -->
      <Card v-if="currentStep === 2">
        <CardHeader>
          <CardTitle style="font-family: Roboto, sans-serif">
            Pourquoi annulez-vous votre abonnement ?
          </CardTitle>
          <CardDescription style="font-family: Roboto, sans-serif">
            Vos retours nous aident à améliorer nos services
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Raison -->
          <FormField v-slot="{ componentField }" name="reason">
            <FormItem class="space-y-3">
              <FormLabel class="text-base font-medium">Sélectionnez une raison *</FormLabel>
              <FormControl>
                <div class="space-y-3">
                  <div
                    v-for="(label, key) in cancellationReasonLabels"
                    :key="key"
                    class="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="radio"
                      :id="`reason-${key}`"
                      :value="key"
                      v-bind="componentField"
                      class="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <label :for="`reason-${key}`" class="flex-1 cursor-pointer text-sm">{{
                      label
                    }}</label>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Feedback optionnel -->
          <FormField v-slot="{ componentField }" name="feedback">
            <FormItem>
              <FormLabel>
                Commentaires supplémentaires (optionnel)
              </FormLabel>
              <FormControl>
                <textarea
                  v-bind="componentField"
                  placeholder="Dites-nous en plus sur votre décision..."
                  class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <Button type="button" variant="outline" @click="prevStep">
              <FontAwesomeIcon v-if="getIcon('arrowLeft')" :icon="getIcon('arrowLeft')" class="mr-2" />
              Retour
            </Button>
            <Button
              type="button"
              @click="nextStep"
              :disabled="!values.reason"
              class="flex-1"
            >
              Continuer
              <FontAwesomeIcon v-if="getIcon('arrowRight')" :icon="getIcon('arrowRight')" class="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Étape 3: Confirmation finale -->
      <Card v-if="currentStep === 3">
        <CardHeader>
          <CardTitle style="font-family: Roboto, sans-serif">
            Confirmation de l'annulation
          </CardTitle>
          <CardDescription style="font-family: Roboto, sans-serif">
            Dernière étape avant d'annuler votre abonnement
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Récapitulatif -->
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div class="flex gap-3">
              <FontAwesomeIcon v-if="getIcon('infoCircle')" :icon="getIcon('infoCircle')" class="w-5 h-5 text-amber-600 mt-0.5" />
              <div class="flex-1 space-y-2">
                <p class="text-sm font-medium text-amber-900">
                  Votre abonnement sera annulé à la fin de la période en cours
                </p>
                <p class="text-sm text-amber-800">
                  Vous conserverez l'accès à vos consultations jusqu'au
                  <strong>{{ subscription.nextBillingDate }}</strong>. Aucun remboursement ne sera
                  effectué.
                </p>
              </div>
            </div>
          </div>

          <!-- Récap raison -->
          <div class="space-y-3">
            <h3 class="font-medium text-sm" style="font-family: Roboto, sans-serif">
              Récapitulatif
            </h3>
            <div class="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
              <div>
                <span class="text-neutral-600">Raison : </span>
                <span class="font-medium">
                  {{ values.reason ? cancellationReasonLabels[values.reason as CancellationReason] : '-' }}
                </span>
              </div>
              <div v-if="values.feedback">
                <span class="text-neutral-600">Commentaire : </span>
                <p class="mt-1 text-neutral-700">{{ values.feedback }}</p>
              </div>
            </div>
          </div>

          <!-- Actions finales -->
          <div class="flex gap-3 pt-4">
            <Button type="button" variant="outline" @click="prevStep">
              <FontAwesomeIcon v-if="getIcon('arrowLeft')" :icon="getIcon('arrowLeft')" class="mr-2" />
              Retour
            </Button>
            <Button type="submit" color="red" class="flex-1">
              <FontAwesomeIcon v-if="getIcon('check')" :icon="getIcon('check')" class="mr-2" />
              Confirmer l'annulation
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
    </div>
  </DefaultLayout>
</template>
