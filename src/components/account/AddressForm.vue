<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Address, CreateAddressDto } from '@/types/address.types'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps<{
  address?: Address
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  submit: [address: CreateAddressDto]
  cancel: []
}>()

// Schéma de validation
const addressSchema = z.object({
  label: z.string().optional(),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  street: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  streetComplement: z.string().optional(),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  country: z.string().min(2, 'Le pays est requis'),
  phone: z
    .string()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide'),
  isDefault: z.boolean().default(false),
  type: z.enum(['billing', 'shipping', 'both']).default('both')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(addressSchema),
  initialValues: props.address || {
    label: '',
    firstName: '',
    lastName: '',
    street: '',
    streetComplement: '',
    postalCode: '',
    city: '',
    country: 'France',
    phone: '',
    isDefault: false,
    type: 'both'
  }
})

// Liste des pays (extensible)
const countries = ref([
  'France',
  'Belgique',
  'Suisse',
  'Luxembourg',
  'Canada',
  'Autre'
])

const onSubmit = handleSubmit((values) => {
  emit('submit', values as CreateAddressDto)
})

const onCancel = () => {
  emit('cancel')
}

// Libellés des types d'adresse
const addressTypeLabels = {
  billing: 'Facturation uniquement',
  shipping: 'Livraison uniquement',
  both: 'Facturation et livraison'
}
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <!-- Label optionnel -->
    <FormField v-slot="{ componentField }" name="label">
      <FormItem>
        <FormLabel>Libellé de l'adresse (optionnel)</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            placeholder="Ex: Maison, Bureau, etc."
            class="max-w-md"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Nom et Prénom -->
    <div class="grid gap-4 sm:grid-cols-2">
      <FormField v-slot="{ componentField }" name="firstName">
        <FormItem>
          <FormLabel>Prénom *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Jean" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="lastName">
        <FormItem>
          <FormLabel>Nom *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Dupont" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Adresse -->
    <FormField v-slot="{ componentField }" name="street">
      <FormItem>
        <FormLabel>Adresse *</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="123 Rue de la Paix" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="streetComplement">
      <FormItem>
        <FormLabel>Complément d'adresse (optionnel)</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            placeholder="Appartement, étage, bâtiment..."
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Code postal et Ville -->
    <div class="grid gap-4 sm:grid-cols-2">
      <FormField v-slot="{ componentField }" name="postalCode">
        <FormItem>
          <FormLabel>Code postal *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="75001" maxlength="5" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="city">
        <FormItem>
          <FormLabel>Ville *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Paris" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Pays -->
    <FormField v-slot="{ componentField }" name="country">
      <FormItem>
        <FormLabel>Pays *</FormLabel>
        <FormControl>
          <select
            v-bind="componentField"
            class="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Sélectionnez un pays</option>
            <option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Téléphone -->
    <FormField v-slot="{ componentField }" name="phone">
      <FormItem>
        <FormLabel>Téléphone *</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            type="tel"
            placeholder="06 12 34 56 78"
            class="max-w-md"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Type d'adresse -->
    <FormField v-slot="{ componentField }" name="type">
      <FormItem>
        <FormLabel>Type d'adresse</FormLabel>
        <FormControl>
          <select
            v-bind="componentField"
            class="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="both">{{ addressTypeLabels.both }}</option>
            <option value="billing">{{ addressTypeLabels.billing }}</option>
            <option value="shipping">{{ addressTypeLabels.shipping }}</option>
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Adresse par défaut -->
    <FormField v-slot="{ value, handleChange }" name="isDefault">
      <FormItem class="flex items-center space-x-3 space-y-0">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" />
        </FormControl>
        <FormLabel class="font-normal cursor-pointer">
          Définir comme adresse par défaut
        </FormLabel>
      </FormItem>
    </FormField>

    <!-- Actions -->
    <div class="flex gap-3 pt-4">
      <Button type="submit" class="flex items-center gap-2">
        <FontAwesomeIcon :icon="['fas', 'check']" />
        {{ mode === 'create' ? 'Ajouter l\'adresse' : 'Enregistrer les modifications' }}
      </Button>
      <Button type="button" variant="outline" @click="onCancel">
        <FontAwesomeIcon :icon="['fas', 'times']" class="mr-2" />
        Annuler
      </Button>
    </div>
  </form>
</template>
