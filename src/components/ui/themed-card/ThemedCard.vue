<script setup lang="ts">
/**
 * ThemedCard - Composant de card thématisée pour Infocash Académie
 *
 * Basé sur le design Figma node 52-1118
 *
 * @example
 * <ThemedCard
 *   theme="metaux"
 *   :thumbnail="imageUrl"
 *   title="Comment investir dans l'or"
 *   :date="new Date()"
 *   description="Description du contenu..."
 *   content-type="tuto"
 *   :is-subscriber-only="true"
 *   :participants="[{ name: 'Jean', avatar: '...' }]"
 *   @click="handleClick"
 * />
 */
import type { HTMLAttributes } from "vue"
import { computed } from "vue"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getThemeClasses, themeLabels, type ThemeType } from "./index"

// Icons
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { byPrefixAndName } from "@awesome.me/kit-0aac173ed2/icons"

// Définition des icônes depuis le kit FontAwesome
const icons = {
  clock: byPrefixAndName.far?.['clock'],
  graduationCap: byPrefixAndName.far?.['graduation-cap'],
  fileLines: byPrefixAndName.far?.['file-lines'],
  newspaper: byPrefixAndName.far?.['newspaper'],
  plus: byPrefixAndName.far?.['plus'],
  download: byPrefixAndName.far?.['download'],
}

export interface Participant {
  name: string
  avatar?: string
  role?: string
}

export type ContentType = 'tuto' | 'dossier' | 'newsletter'

interface Props {
  theme: ThemeType
  thumbnail?: string
  title: string
  date?: Date | string
  description?: string
  contentType?: ContentType
  isSubscriberOnly?: boolean
  participants?: Participant[]
  class?: HTMLAttributes["class"]
  ctaLabel?: string
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  contentType: 'tuto',
  isSubscriberOnly: false,
  participants: () => [],
  ctaLabel: 'Voir le contenu',
  showActions: true,
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'add'): void
  (e: 'download'): void
}>()

// Récupérer les classes du thème
const themeClasses = computed(() => getThemeClasses(props.theme))

// Formater la date
const formattedDate = computed(() => {
  if (!props.date) return null
  const date = typeof props.date === 'string' ? new Date(props.date) : props.date
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// Icône du type de contenu
const contentTypeIcon = computed(() => {
  const typeIcons = {
    tuto: icons.graduationCap,
    dossier: icons.fileLines,
    newsletter: icons.newspaper,
  }
  return typeIcons[props.contentType]
})

// Label du type de contenu
const contentTypeLabel = computed(() => {
  const labels = {
    tuto: 'Tuto',
    dossier: 'Dossier',
    newsletter: 'Newsletter',
  }
  return labels[props.contentType]
})

// Générer les initiales pour les avatars sans image
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div
    :class="cn(
      'group relative bg-white rounded-sm shadow-md overflow-hidden transition-all duration-300',
      'hover:shadow-lg hover:scale-[1.02]',
      'border-2',
      themeClasses.border,
      props.class
    )"
  >
    <!-- Header avec gradient et thumbnail -->
    <div
      class="relative aspect-video overflow-hidden"
      :class="[`bg-gradient-to-br`, themeClasses.gradient]"
    >
      <img
        v-if="thumbnail"
        :src="thumbnail"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- Overlay gradient pour lisibilité -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>

    <!-- Contenu -->
    <div class="p-4 space-y-3">
      <!-- Badges -->
      <div class="flex flex-wrap gap-2">
        <!-- Badge thématique -->
        <Badge :variant="`theme-${theme}-outline`">
          {{ themeLabels[theme] }}
        </Badge>

        <!-- Badge type de contenu -->
        <Badge :variant="`theme-${theme}-outline`" class="gap-1.5">
          <FontAwesomeIcon v-if="contentTypeIcon" :icon="contentTypeIcon" class="size-3" />
          {{ contentTypeLabel }}
        </Badge>

        <!-- Badge accès abonné -->
        <Badge
          v-if="isSubscriberOnly"
          variant="access-subscriber"
        >
          Accès Abonnés
        </Badge>
      </div>

      <!-- Titre -->
      <h3 class="font-heading font-bold text-lg leading-tight text-foreground line-clamp-2">
        {{ title }}
      </h3>

      <!-- Date -->
      <div v-if="formattedDate" class="flex items-center gap-2 text-muted-foreground text-sm">
        <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="size-4" />
        <span class="capitalize">{{ formattedDate }}</span>
      </div>

      <!-- Description -->
      <p v-if="description" class="text-muted-foreground text-sm line-clamp-3">
        {{ description }}
      </p>

      <!-- Participants -->
      <div v-if="participants.length > 0" class="flex items-center gap-2">
        <span class="text-muted-foreground text-sm">Participants :</span>
        <div class="flex -space-x-2">
          <div
            v-for="(participant, index) in participants.slice(0, 3)"
            :key="index"
            class="relative"
            :title="participant.name"
          >
            <div
              :class="cn(
                'size-10 rounded-full border-2 border-white overflow-hidden',
                themeClasses.bg
              )"
            >
              <img
                v-if="participant.avatar"
                :src="participant.avatar"
                :alt="participant.name"
                class="w-full h-full object-cover"
              />
              <span
                v-else
                :class="cn('flex items-center justify-center w-full h-full text-xs font-bold', themeClasses.text)"
              >
                {{ getInitials(participant.name) }}
              </span>
            </div>
          </div>
          <div
            v-if="participants.length > 3"
            class="size-10 rounded-full border-2 border-white bg-muted flex items-center justify-center text-xs font-medium"
          >
            +{{ participants.length - 3 }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="showActions" class="flex items-center gap-3 pt-2">
        <!-- CTA principal -->
        <Button
          :color="theme"
          size="default"
          rounded="lg"
          class="flex-1"
          @click="emit('click')"
        >
          {{ ctaLabel }}
        </Button>

        <!-- Actions secondaires -->
        <Button
          variant="outline"
          size="icon"
          rounded="lg"
          color="neutral-400"
          @click="emit('add')"
        >
          <FontAwesomeIcon v-if="icons.plus" :icon="icons.plus" class="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          rounded="lg"
          color="neutral-400"
          @click="emit('download')"
        >
          <FontAwesomeIcon v-if="icons.download" :icon="icons.download" class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
