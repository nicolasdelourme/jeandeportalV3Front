/**
 * Guard de navigation pour l'authentification
 * Protège les routes qui nécessitent une authentification
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Valide les URLs de redirection pour prévenir les attaques open redirect
 * @param path - Le chemin à valider
 * @returns true si le chemin est sûr, false sinon
 */
function isValidRedirect(path: string): boolean {
    // N'autoriser que les chemins internes (commençant par /)
    if (!path.startsWith('/')) {
        return false
    }

    // Bloquer les URLs protocol-relative (//evil.com)
    if (path.startsWith('//')) {
        return false
    }

    // Bloquer javascript:, data:, vbscript:, file: URLs
    if (path.match(/^(data|javascript|vbscript|file):/i)) {
        return false
    }

    return true
}

/**
 * Guard qui vérifie si l'utilisateur est authentifié
 * Si non authentifié, redirige vers /auth avec l'URL de retour
 */
export async function authGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): Promise<void> {
    const authStore = useAuthStore()

    // Vérifier si la route nécessite une authentification
    const requiresAuth = to.meta.requiresAuth

    if (requiresAuth && !authStore.isAuthenticated) {
        // Valider l'URL de redirection pour prévenir les attaques open redirect
        const safePath = isValidRedirect(to.fullPath) ? to.fullPath : '/mon-compte'

        // Sauvegarder l'URL de destination pour rediriger après le login
        next({
            path: '/auth',
            query: {
                redirect: safePath // ✅ URL validée
            }
        })
    } else {
        next()
    }
}

/**
 * Guard qui redirige les utilisateurs authentifiés
 * Utile pour les pages de login/register : si déjà connecté, rediriger vers home
 */
export async function guestGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): Promise<void> {
    const authStore = useAuthStore()

    // Vérifier si la route est réservée aux invités (non connectés)
    const guestOnly = to.meta.guestOnly

    if (guestOnly && authStore.isAuthenticated) {
        // Si déjà connecté, rediriger vers la home
        next({ path: '/' })
    } else {
        next()
    }
}
