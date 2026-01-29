<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { Address, CreateAddressDto } from '@/types/address.types'
import { COUNTRIES_LIST } from '@/types/address.types'

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
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false)
})

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: toTypedSchema(addressSchema),
  initialValues: props.address ? {
    label: props.address.label || '',
    firstName: props.address.firstName || '',
    lastName: props.address.lastName || '',
    street: props.address.street || '',
    streetComplement: props.address.streetComplement || '',
    postalCode: props.address.postalCode || '',
    city: props.address.city || '',
    country: props.address.country || 'FR',
    isDefaultShipping: props.address.isDefaultShipping || false,
    isDefaultBilling: props.address.isDefaultBilling || false
  } : {
    label: '',
    firstName: '',
    lastName: '',
    street: '',
    streetComplement: '',
    postalCode: '',
    city: '',
    country: 'FR',
    isDefaultShipping: false,
    isDefaultBilling: false
  }
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values as CreateAddressDto)
})

const onCancel = () => {
  emit('cancel')
}

/**
 * Icônes
 */
const icons = computed(() => ({
  check: byPrefixAndName.fas?.['check'],
  xmark: byPrefixAndName.fas?.['xmark']
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition | undefined => {
  return icons.value[iconKey] as IconDefinition | undefined
}
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">
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
            <option v-for="country in COUNTRIES_LIST" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Adresses par défaut -->
    <div class="space-y-3">
      <FormField v-slot="{ value }" name="isDefaultShipping">
        <FormItem class="flex items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              :checked="Boolean(value)"
              @update:checked="(val: boolean | 'indeterminate') => {
                const boolVal = val === true
                setFieldValue('isDefaultShipping', boolVal)
              }"
            />
          </FormControl>
          <FormLabel class="font-normal cursor-pointer">
            Adresse de livraison par défaut
          </FormLabel>
        </FormItem>
      </FormField>

      <FormField v-slot="{ value }" name="isDefaultBilling">
        <FormItem class="flex items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              :checked="Boolean(value)"
              @update:checked="(val: boolean | 'indeterminate') => {
                const boolVal = val === true
                setFieldValue('isDefaultBilling', boolVal)
              }"
            />
          </FormControl>
          <FormLabel class="font-normal cursor-pointer">
            Adresse de facturation par défaut
          </FormLabel>
        </FormItem>
      </FormField>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4">
      <Button variant="secondary" type="submit" class="flex items-center gap-2">
        <FontAwesomeIcon v-if="getIcon('check')" :icon="getIcon('check')!" />
        {{ mode === 'create' ? 'Ajouter l\'adresse' : 'Enregistrer les modifications' }}
      </Button>
      <Button type="button" variant="outline" color="secondary" class="hover:bg-secondary hover:border-secondary" @click="onCancel">
        <FontAwesomeIcon v-if="getIcon('xmark')" :icon="getIcon('xmark')!" class="mr-2" />
        Annuler
      </Button>
    </div>
  </form>
</template>
