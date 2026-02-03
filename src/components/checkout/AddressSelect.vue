<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { UserAddress } from '@/types/auth.types'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = defineProps<{
  addresses: UserAddress[]
  modelValue: number | null
  label: string
  icon?: IconDefinition
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const isOpen = ref(false)

const icons = computed(() => ({
  chevronDown: byPrefixAndName.fas?.['chevron-down'],
  plus: byPrefixAndName.fas?.['plus'],
}))

function formatAddress(addr: UserAddress): string {
  const parts = [addr.line1]
  if (addr.line2) parts.push(addr.line2)
  parts.push(`${addr.zipcode} ${addr.city}`)
  return parts.join(', ')
}

function selectedAddress(): UserAddress | undefined {
  return props.addresses.find(a => Number(a.id) === props.modelValue)
}

function selectAddress(id: number) {
  emit('update:modelValue', id)
  isOpen.value = false
}
</script>

<template>
  <div class="space-y-1.5">
    <Label class="flex items-center gap-2 text-sm font-medium">
      <FontAwesomeIcon v-if="icon" :icon="icon" class="h-4 w-4 text-muted-foreground" />
      {{ label }}
    </Label>

    <Collapsible :open="isOpen" @update:open="(val: boolean) => isOpen = val">
      <!-- Trigger : adresse sélectionnée -->
      <CollapsibleTrigger
        class="flex items-center justify-between w-full rounded-lg border border-input
               bg-background px-3 py-2.5 text-left hover:bg-accent/50
               transition-colors cursor-pointer"
      >
        <div v-if="selectedAddress()" class="min-w-0 flex-1">
          <p class="text-sm font-medium text-foreground truncate">
            {{ selectedAddress()!.firstName }} {{ selectedAddress()!.lastName }}
          </p>
          <p class="text-xs text-muted-foreground truncate">
            {{ formatAddress(selectedAddress()!) }}
          </p>
        </div>
        <span v-else class="text-sm text-muted-foreground">Choisir une adresse</span>
        <FontAwesomeIcon
          v-if="icons.chevronDown"
          :icon="icons.chevronDown"
          :class="[
            'h-4 w-4 text-muted-foreground transition-transform duration-200 ml-2 shrink-0',
            isOpen ? 'rotate-180' : ''
          ]"
        />
      </CollapsibleTrigger>

      <!-- Contenu : liste des adresses -->
      <CollapsibleContent
        class="overflow-hidden data-[state=open]:animate-collapsible-down
               data-[state=closed]:animate-collapsible-up"
      >
        <div class="mt-1.5 rounded-lg border border-input bg-background divide-y divide-border">
          <button
            v-for="addr in addresses"
            :key="addr.id"
            type="button"
            class="flex items-center gap-3 w-full px-3 py-2.5 text-left
                   hover:bg-accent/50 transition-colors first:rounded-t-lg"
            @click="selectAddress(Number(addr.id))"
          >
            <!-- Indicateur radio -->
            <span
              :class="[
                'shrink-0 flex items-center justify-center w-4 h-4 rounded-full border-2 transition-colors',
                Number(addr.id) === modelValue
                  ? 'border-foreground'
                  : 'border-muted-foreground/40'
              ]"
            >
              <span
                v-if="Number(addr.id) === modelValue"
                class="w-2 h-2 rounded-full bg-foreground"
              />
            </span>
            <!-- Info adresse -->
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-foreground truncate">
                {{ addr.firstName }} {{ addr.lastName }}
                <span v-if="addr.recipient" class="text-muted-foreground font-normal">
                  — {{ addr.recipient }}
                </span>
              </p>
              <p class="text-xs text-muted-foreground truncate">{{ formatAddress(addr) }}</p>
            </div>
          </button>

          <!-- Lien ajouter -->
          <RouterLink
            to="/mon-compte"
            class="flex items-center gap-2 w-full px-3 py-2.5 text-sm
                   text-muted-foreground hover:text-foreground hover:bg-accent/50
                   transition-colors rounded-b-lg"
          >
            <FontAwesomeIcon v-if="icons.plus" :icon="icons.plus" class="h-3 w-3" />
            Ajouter une adresse
          </RouterLink>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
