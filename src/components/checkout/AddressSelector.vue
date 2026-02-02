<script setup lang="ts">
/**
 * AddressSelector - Composant de sélection d'adresse
 * Réutilisable pour shipping et billing
 */
import type { UserAddress } from '@/types/auth.types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const props = defineProps<{
  addresses: UserAddress[]
  modelValue: number | null
  title: string
  description: string
  icon?: IconDefinition
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

function selectAddress(id: number) {
  emit('update:modelValue', id)
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <FontAwesomeIcon v-if="icon" :icon="icon" class="h-5 w-5" />
        {{ title }}
      </CardTitle>
      <CardDescription>
        {{ description }}
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-3">
      <div
        v-for="addr in addresses"
        :key="addr.id"
        class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
        :class="{
          'border-primary bg-primary/5': modelValue === Number(addr.id),
          'hover:border-neutral-400': modelValue !== Number(addr.id)
        }"
        @click="selectAddress(Number(addr.id))"
      >
        <input
          type="radio"
          :checked="modelValue === Number(addr.id)"
          class="mt-1"
        />
        <div class="flex-1">
          <p class="font-medium">{{ addr.firstName }} {{ addr.lastName }}</p>
          <p class="text-sm text-neutral-600">{{ addr.line1 }}</p>
          <p v-if="addr.line2" class="text-sm text-neutral-600">{{ addr.line2 }}</p>
          <p class="text-sm text-neutral-600">{{ addr.zipcode }} {{ addr.city }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
