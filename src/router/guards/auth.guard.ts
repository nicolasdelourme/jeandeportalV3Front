/**
 * Guard de navigation pour l'authentification
 * Protège les routes qui nécessitent une authentification
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

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
        // Sauvegarder l'URL de destination pour rediriger après le login
        next({
            path: '/auth',
            query: {
                redirect: to.fullPath // URL complète incluant les query params
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
