<script setup lang="ts">
/**
 * ThemedCardModal - Modal pour afficher le détail d'un contenu thématisé
 *
 * Basé sur les designs Figma:
 * - Desktop: node 56-1428 (image top, 2 colonnes below)
 * - Mobile: node 56-1615 (image top, CTA, content, participants)
 *
 * @example
 * <ThemedCardModal
 *   v-model:open="isOpen"
 *   theme="metaux"
 *   :thumbnail="imageUrl"
 *   title="Comment investir dans l'or"
 *   :date="new Date()"
 *   description="Description complète..."
 *   content-type="tuto"
 *   :participants="participants"
 *   @view="handleView"
 *   @add="handleAdd"
 *   @download="handleDownload"
 * />
 */
import type { HTMLAttributes } from "vue"
import { computed } from "vue"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getThemeClasses, themeLabels, type ThemeType } from "./index"
import type { Participant, ContentType } from "./ThemedCard.vue"

// Icons
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { byPrefixAndName } from "@/lib/icons"

// Définition des icônes depuis le kit FontAwesome
const icons = {
  clock: byPrefixAndName.far['clock'],
  graduationCap: byPrefixAndName.far['graduation-cap'],
  fileLines: byPrefixAndName.far['file-lines'],
  newspaper: byPrefixAndName.far['newspaper'],
  plus: byPrefixAndName.far['plus'],
  download: byPrefixAndName.far['download'],
  // These icons are only available in solid (fas)
  comments: byPrefixAndName.fas['comments'],
  book: byPrefixAndName.fas['book'],
  circlePlay: byPrefixAndName.fas['circle-play'],
}

interface Props {
  open: boolean
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
}

const props = withDefaults(defineProps<Props>(), {
  contentType: 'tuto',
  isSubscriberOnly: false,
  participants: () => [],
  ctaLabel: 'VOIR LE TUTO',
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'view'): void
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
  const typeIcons: Record<ContentType, unknown> = {
    tuto: icons.graduationCap,
    dossier: icons.fileLines,
    newsletter: icons.newspaper,
    consultation: icons.comments,
    article: icons.book,
    video: icons.circlePlay,
  }
  return typeIcons[props.contentType]
})

// Label du type de contenu
const contentTypeLabel = computed(() => {
  const labels: Record<ContentType, string> = {
    tuto: 'Tuto',
    dossier: 'Dossier',
    newsletter: 'Newsletter',
    consultation: 'Consultation',
    article: 'Article',
    video: 'Tuto Vidéo',
  }
  return labels[props.contentType]
})

// CTA label dynamique selon le type
const dynamicCtaLabel = computed(() => {
  if (props.ctaLabel !== 'VOIR LE TUTO') return props.ctaLabel
  const labels: Record<ContentType, string> = {
    tuto: 'VOIR LE TUTO',
    dossier: 'LIRE LE DOSSIER',
    newsletter: 'LIRE LA NEWSLETTER',
    consultation: 'RESERVER',
    article: 'LIRE L\'ARTICLE',
    video: 'VOIR LA VIDEO',
  }
  return labels[props.contentType]
})

// Générer les initiales pour les avatars sans image
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const handleOpenChange = (value: boolean) => {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent
      :class="cn(
        'sm:max-w-3xl p-0 gap-0 overflow-hidden',
        'border rounded-lg',
        themeClasses.border,
        props.class
      )"
    >
      <!-- Accessibilité - Titre caché -->
      <DialogTitle class="sr-only">{{ title }}</DialogTitle>
      <DialogDescription class="sr-only">{{ description }}</DialogDescription>

      <!-- Image en haut (full width) -->
      <div
        class="relative aspect-video w-full overflow-hidden rounded-t-lg"
        :class="[`bg-gradient-to-br`, themeClasses.gradient]"
      >
        <img
          v-if="thumbnail"
          :src="thumbnail"
          :alt="title"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <!-- Mobile: CTA + Actions juste après l'image -->
      <div class="flex md:hidden items-center gap-3 p-3 border-b border-border">
        <Button
          :color="theme"
          size="default"
          rounded="lg"
          class="flex-1"
          @click="emit('view')"
        >
          Consulter
        </Button>
        <Button variant="outline" size="icon" rounded="lg" @click="emit('add')" aria-label="Ajouter à ma liste">
          <FontAwesomeIcon v-if="icons.plus" :icon="icons.plus" class="size-4" />
        </Button>
        <Button variant="outline" size="icon" rounded="lg" @click="emit('download')" aria-label="Télécharger">
          <FontAwesomeIcon v-if="icons.download" :icon="icons.download" class="size-4" />
        </Button>
      </div>

      <!-- Contenu principal : 2 colonnes sur desktop, 1 colonne sur mobile -->
      <div class="flex flex-col md:flex-row">
        <!-- Colonne gauche: Badges, Titre, Date, Description -->
        <div class="flex-1 p-4 space-y-2">
          <!-- Badges -->
          <div class="flex flex-wrap gap-2">
            <Badge :variant="`theme-${theme}-outline`">
              {{ themeLabels[theme] }}
            </Badge>
            <Badge :variant="`theme-${theme}-outline`" class="gap-1.5">
              <FontAwesomeIcon v-if="contentTypeIcon" :icon="contentTypeIcon" class="size-3" />
              {{ contentTypeLabel }}
            </Badge>
            <Badge v-if="isSubscriberOnly" variant="access-subscriber">
              Accès Abonnés
            </Badge>
          </div>

          <!-- Titre -->
          <h3 class="font-heading font-bold text-xl leading-tight text-foreground">
            {{ title }}
          </h3>

          <!-- Date -->
          <div v-if="formattedDate" class="flex items-center gap-2 text-muted-foreground text-sm">
            <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock" class="size-4" />
            <span class="capitalize">{{ formattedDate }}</span>
          </div>

          <!-- Description -->
          <p v-if="description" class="text-muted-foreground text-sm leading-relaxed pt-2">
            {{ description }}
          </p>

          <!-- Mobile: Participants en bas -->
          <div v-if="participants.length > 0" class="md:hidden flex items-center gap-2 pt-3">
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
            </div>
          </div>
        </div>

        <!-- Colonne droite (desktop uniquement): Participants + Actions -->
        <div class="hidden md:flex flex-col justify-between w-[280px] p-4">
          <!-- Participants avec tooltips -->
          <div class="space-y-2">
            <p class="text-muted-foreground text-sm">Participants :</p>
            <TooltipProvider>
              <div class="flex -space-x-2">
                <Tooltip v-for="(participant, index) in participants" :key="index">
                  <TooltipTrigger as-child>
                    <div
                      :class="cn(
                        'size-10 rounded-full border-4 border-white overflow-hidden cursor-pointer',
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
                  </TooltipTrigger>
                  <TooltipContent :class="[themeClasses.bg, themeClasses.text === 'text-white' ? 'text-white' : 'text-foreground']">
                    <p class="font-medium">{{ participant.name }}</p>
                    <p v-if="participant.role" class="text-xs opacity-80">{{ participant.role }}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          <!-- Actions desktop -->
          <div class="space-y-3 pt-4">
            <Button
              :color="theme"
              size="default"
              rounded="lg"
              class="w-full"
              @click="emit('view')"
            >
              {{ dynamicCtaLabel }}
            </Button>

            <div class="flex gap-3">
              <Button
                variant="outline"
                size="default"
                rounded="lg"
                class="flex-1"
                @click="emit('add')"
                aria-label="Ajouter à ma liste"
              >
                <FontAwesomeIcon v-if="icons.plus" :icon="icons.plus" class="size-4" />
              </Button>
              <Button
                variant="outline"
                size="default"
                rounded="lg"
                class="flex-1"
                @click="emit('download')"
                aria-label="Télécharger"
              >
                <FontAwesomeIcon v-if="icons.download" :icon="icons.download" class="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
