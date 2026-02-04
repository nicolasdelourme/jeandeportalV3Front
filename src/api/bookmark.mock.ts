/**
 * Mock API pour les bookmarks (favoris)
 * Store in-memory pour le mode dev
 */

export interface Bookmark {
  slug: string
  addedAt: Date
}

const mockBookmarks: Bookmark[] = []

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Récupère la liste des bookmarks
 */
export async function mockFetchBookmarks(): Promise<Bookmark[]> {
  await delay(150)
  return [...mockBookmarks]
}

/**
 * Ajoute un bookmark
 */
export async function mockAddBookmark(slug: string): Promise<Bookmark> {
  await delay(150)
  const existing = mockBookmarks.find((b) => b.slug === slug)
  if (existing) return existing

  const bookmark: Bookmark = { slug, addedAt: new Date() }
  mockBookmarks.push(bookmark)
  return bookmark
}

/**
 * Supprime un bookmark
 */
export async function mockRemoveBookmark(slug: string): Promise<void> {
  await delay(150)
  const index = mockBookmarks.findIndex((b) => b.slug === slug)
  if (index !== -1) {
    mockBookmarks.splice(index, 1)
  }
}
