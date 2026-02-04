<script setup lang="ts">
/**
 * BookmarkButton - Bouton de sauvegarde d'article (favoris)
 * Deux variants : 'button' (avec texte) et 'icon-only'
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmark.store'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const props = withDefaults(defineProps<{
  slug: string
  variant?: 'button' | 'icon-only' | 'ghost'
  size?: 'sm' | 'default'
}>(), {
  variant: 'button',
  size: 'sm',
})

const router = useRouter()
const bookmarkStore = useBookmarkStore()
const authStore = useAuthStore()

const isActive = computed(() => bookmarkStore.isBookmarked(props.slug))

const icon = computed(() =>
  isActive.value
    ? byPrefixAndName.fas?.['bookmark']
    : byPrefixAndName.far?.['bookmark']
)

const label = computed(() =>
  isActive.value ? 'Sauvegardé' : 'Sauvegarder'
)

function handleClick(event: Event) {
  event.stopPropagation()
  event.preventDefault()

  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }

  bookmarkStore.toggle(props.slug)
}
</script>

<template>
  <!-- Button variant: with text -->
  <Button
    v-if="variant === 'button'"
    :variant="isActive ? 'default' : 'outline'"
    rounded="lg"
    color="secondary"
    :size="size"
    class="gap-2"
    :class="isActive ? 'text-primary': 'bg-white'"
    @click="handleClick"
  >
    <FontAwesomeIcon v-if="icon" :icon="icon" class="w-4 h-4" :class="{'text-primary': isActive}" />
    {{ label }}
  </Button>

  <!-- Ghost variant: with text, subtle -->
  <Button
    v-else-if="variant === 'ghost'"
    variant="ghost"
    :size="size"
    class="gap-2"
    :class="isActive ? 'text-primary' : 'text-muted-foreground'"
    @click="handleClick"
  >
    <FontAwesomeIcon v-if="icon" :icon="icon" class="w-4 h-4" />
  </Button>

  <!-- Icon-only variant -->
  <Button
    v-else
    :variant="isActive ? 'default' : 'outline'"
    color="secondary"
    rounded="lg"
    size="sm"
    class="transition-colors text-secondary duration-500"
    :class="isActive
      ? ''
      : 'bg-white/40 hover:text-primary'"
    :title="label"
    @click="handleClick"
  >
    <FontAwesomeIcon v-if="icon" :icon="icon" class="w-4 h-4" />
  </Button>
</template>
