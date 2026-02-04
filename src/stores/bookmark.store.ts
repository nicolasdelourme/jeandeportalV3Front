/**
 * Store Pinia pour les bookmarks (favoris)
 * Gère les articles sauvegardés par l'utilisateur
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookmarkService } from '@/services/bookmark.service'
import { toast } from 'vue-sonner'
import { logger } from '@/utils/logger'

export const useBookmarkStore = defineStore('bookmark', () => {
  const slugs = ref<Set<string>>(new Set())
  const isInitialized = ref(false)

  function isBookmarked(slug: string): boolean {
    return slugs.value.has(slug)
  }

  async function toggle(slug: string): Promise<void> {
    const wasBookmarked = slugs.value.has(slug)

    // Optimistic update
    if (wasBookmarked) {
      slugs.value.delete(slug)
      // Force reactivity
      slugs.value = new Set(slugs.value)
    } else {
      slugs.value.add(slug)
      slugs.value = new Set(slugs.value)
    }

    try {
      if (wasBookmarked) {
        await bookmarkService.removeBookmark(slug)
        toast.success('Article retiré des favoris')
      } else {
        await bookmarkService.addBookmark(slug)
        toast.success('Article ajouté aux favoris')
      }
    } catch (err) {
      // Rollback
      if (wasBookmarked) {
        slugs.value.add(slug)
      } else {
        slugs.value.delete(slug)
      }
      slugs.value = new Set(slugs.value)

      logger.error('Erreur lors du toggle bookmark:', err)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  async function initialize(): Promise<void> {
    if (isInitialized.value) return

    try {
      const bookmarks = await bookmarkService.fetchBookmarks()
      slugs.value = new Set(bookmarks.map((b) => b.slug))
    } catch (err) {
      logger.warn('Erreur lors du chargement des favoris:', err)
    } finally {
      isInitialized.value = true
    }
  }

  function reset(): void {
    slugs.value = new Set()
    isInitialized.value = false
  }

  return {
    slugs,
    isInitialized,
    isBookmarked,
    toggle,
    initialize,
    reset,
  }
})
