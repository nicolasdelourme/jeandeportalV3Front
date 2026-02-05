<script setup lang="ts">
/**
 * AuthorBadge - Avatar + nom d'auteur
 * Utilise le composant Avatar shadcn avec fallback sur les initiales
 */
import { computed } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { NewsAuthor } from '@/types/news.types'

interface Props {
    author: NewsAuthor
    size?: 'sm' | 'md' | 'lg'
    showName?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    showName: true,
})

/**
 * Initiales de l'auteur pour le fallback
 */
const initials = computed(() => {
    const parts = props.author.name.trim().split(/\s+/)
    if (parts.length >= 2) {
        return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
    }
    return props.author.name.slice(0, 2).toUpperCase()
})

/**
 * Classes de taille pour l'avatar
 */
const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'size-6 text-xs'
        case 'lg':
            return 'size-10 text-base'
        default:
            return 'size-8 text-sm'
    }
})
</script>

<template>
    <div class="flex items-center gap-2">
        <Avatar :class="sizeClasses">
            <AvatarImage v-if="author.avatar" :src="author.avatar" :alt="author.name" />
            <AvatarFallback class="bg-neutral-200 text-neutral-600 font-medium">
                {{ initials }}
            </AvatarFallback>
        </Avatar>
        <span v-if="showName" class="text-base font-medium text-muted-foreground">
            {{ author.name }}
        </span>
    </div>
</template>
