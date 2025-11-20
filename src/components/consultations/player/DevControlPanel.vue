<script setup lang="ts">
/**
 * Composant DevControlPanel
 * Panneau de contrôle pour simuler les états de la page player (DEV ONLY)
 */

import { ref, watch, computed } from 'vue'
import { Button } from '@/components/ui/button'

/**
 * Types pour les modes de lecture
 */
type PlayMode = 'live' | 'replay'
type LayoutMode = 'normal' | 'theater'

/**
 * Props du composant
 */
interface Props {
  mode?: PlayMode
  layout?: LayoutMode
  isSubscriber?: boolean
  hasPriorityRight?: boolean
  hasConfidentialRight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'replay',
  layout: 'normal',
  isSubscriber: false,
  hasPriorityRight: false,
  hasConfidentialRight: false
})

/**
 * Emits du composant
 */
const emit = defineEmits<{
  'update:mode': [value: PlayMode]
  'update:layout': [value: LayoutMode]
  'update:isSubscriber': [value: boolean]
  'update:hasPriorityRight': [value: boolean]
  'update:hasConfidentialRight': [value: boolean]
}>()

/**
 * Etat local
 */
const currentMode = ref<PlayMode>(props.mode)
const currentLayout = ref<LayoutMode>(props.layout)
const currentIsSubscriber = ref<boolean>(props.isSubscriber)
const currentHasPriorityRight = ref<boolean>(props.hasPriorityRight)
const currentHasConfidentialRight = ref<boolean>(props.hasConfidentialRight)

/**
 * Chat automatique base sur le mode
 */
const chatStatus = computed(() => currentMode.value === 'live' ? 'Active (Live)' : 'Desactive (Replay)')

/**
 * Watchers pour synchroniser avec les props
 */
watch(() => props.mode, (newVal) => { currentMode.value = newVal })
watch(() => props.layout, (newVal) => { currentLayout.value = newVal })
watch(() => props.isSubscriber, (newVal) => { currentIsSubscriber.value = newVal })
watch(() => props.hasPriorityRight, (newVal) => { currentHasPriorityRight.value = newVal })
watch(() => props.hasConfidentialRight, (newVal) => { currentHasConfidentialRight.value = newVal })

/**
 * Handlers pour les changements
 */
const handleModeChange = (mode: PlayMode) => {
  currentMode.value = mode
  emit('update:mode', mode)
}

const handleLayoutChange = (layout: LayoutMode) => {
  currentLayout.value = layout
  emit('update:layout', layout)
}

const handleSubscriberChange = (value: boolean) => {
  currentIsSubscriber.value = value
  emit('update:isSubscriber', value)

  // Si non abonne, desactiver automatiquement le droit confidentiel
  if (!value && currentHasConfidentialRight.value) {
    currentHasConfidentialRight.value = false
    emit('update:hasConfidentialRight', false)
  }
}

const handlePriorityRightChange = (value: boolean) => {
  currentHasPriorityRight.value = value
  emit('update:hasPriorityRight', value)
}

const handleConfidentialRightChange = (value: boolean) => {
  // Ne peut activer que si abonne
  if (value && !currentIsSubscriber.value) {
    return
  }
  currentHasConfidentialRight.value = value
  emit('update:hasConfidentialRight', value)
}
</script>

<template>
  <div class="bg-yellow-100 border border-yellow-500 rounded p-3 mb-4">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-bold text-yellow-900">
        [DEV] Panneau de Controle
      </h3>
      <span class="text-xs text-yellow-700 font-mono">
        {{ currentMode }} | {{ currentLayout }} | {{ currentIsSubscriber ? 'Abonne' : 'Non-abonne' }}
      </span>
    </div>

    <!-- Ligne 1: Mode, Layout, Chat -->
    <div class="grid grid-cols-3 gap-2 mb-3">
      <!-- Mode de lecture -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-yellow-900">Mode</label>
        <div class="flex gap-1">
          <Button
            :variant="currentMode === 'live' ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handleModeChange('live')"
          >
            Live
          </Button>
          <Button
            :variant="currentMode === 'replay' ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handleModeChange('replay')"
          >
            Replay
          </Button>
        </div>
      </div>

      <!-- Layout -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-yellow-900">Layout</label>
        <div class="flex gap-1">
          <Button
            :variant="currentLayout === 'normal' ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handleLayoutChange('normal')"
          >
            Normal
          </Button>
          <Button
            :variant="currentLayout === 'theater' ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handleLayoutChange('theater')"
          >
            Theatre
          </Button>
        </div>
      </div>

      <!-- Chat (statut automatique) -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-yellow-900">Chat</label>
        <div class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 text-center font-medium h-7 flex items-center justify-center">
          {{ chatStatus }}
        </div>
      </div>
    </div>

    <!-- Ligne 2: Statut abonnement et droits -->
    <div class="grid grid-cols-3 gap-2">
      <!-- Statut abonne -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-yellow-900">Abonne</label>
        <div class="flex gap-1">
          <Button
            :variant="currentIsSubscriber ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handleSubscriberChange(true)"
          >
            Oui
          </Button>
          <Button
            :variant="!currentIsSubscriber ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handleSubscriberChange(false)"
          >
            Non
          </Button>
        </div>
      </div>

      <!-- Droit prioritaire -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-yellow-900">Droit Prio</label>
        <div class="flex gap-1">
          <Button
            :variant="currentHasPriorityRight ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handlePriorityRightChange(true)"
          >
            Oui
          </Button>
          <Button
            :variant="!currentHasPriorityRight ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handlePriorityRightChange(false)"
          >
            Non
          </Button>
        </div>
      </div>

      <!-- Droit confidentiel (reserve aux abonnes) -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-yellow-900">Droit Confid</label>
        <div class="flex gap-1">
          <Button
            :variant="currentHasConfidentialRight ? 'default' : 'outline'"
            :disabled="!currentIsSubscriber"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handleConfidentialRightChange(true)"
          >
            Oui
          </Button>
          <Button
            :variant="!currentHasConfidentialRight ? 'default' : 'outline'"
            size="sm"
            class="flex-1 text-xs py-1 h-7"
            @click="handleConfidentialRightChange(false)"
          >
            Non
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
