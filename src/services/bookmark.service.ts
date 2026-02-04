/**
 * Service API pour les bookmarks (favoris)
 * Singleton pattern, mock/real switch via VITE_API_MODE
 */

import { apiClient } from '@/api/client'
import {
  mockFetchBookmarks,
  mockAddBookmark,
  mockRemoveBookmark,
} from '@/api/bookmark.mock'
import type { Bookmark } from '@/api/bookmark.mock'

const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

class BookmarkService {
  async fetchBookmarks(): Promise<Bookmark[]> {
    if (USE_MOCK) {
      return mockFetchBookmarks()
    }

    return apiClient.get<Bookmark[]>('/bookmarks')
  }

  async addBookmark(slug: string): Promise<Bookmark> {
    if (USE_MOCK) {
      return mockAddBookmark(slug)
    }

    return apiClient.post<Bookmark>(`/bookmarks/${slug}`)
  }

  async removeBookmark(slug: string): Promise<void> {
    if (USE_MOCK) {
      return mockRemoveBookmark(slug)
    }

    await apiClient.delete(`/bookmarks/${slug}`)
  }
}

export const bookmarkService = new BookmarkService()
