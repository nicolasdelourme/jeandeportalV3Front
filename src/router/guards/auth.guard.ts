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
 *
 * IMPORTANT: Attend que le store soit initialisé avant de vérifier l'auth
 * pour éviter les faux négatifs lors du refresh de page
 */
export async function authGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): Promise<void> {
    const authStore = useAuthStore()

    // Vérifier si la route nécessite une authentification
    const requiresAuth = to.meta.requiresAuth

    // ⏳ Attendre que le store soit initialisé avant de vérifier l'auth
    // Cela évite les redirections incorrectes lors du refresh de page
    if (!authStore.isInitialized) {
        console.log('🛡️ [AUTH GUARD] Attente initialisation du store...')
        await authStore.waitForInitialization()
        console.log('🛡️ [AUTH GUARD] Store initialisé !')
    }

    console.log('🛡️ [AUTH GUARD] Navigation vers:', to.path)
    console.log('🛡️ [AUTH GUARD] requiresAuth:', requiresAuth)
    console.log('🛡️ [AUTH GUARD] isAuthenticated:', authStore.isAuthenticated)
    console.log('🛡️ [AUTH GUARD] user:', authStore.user)

    if (requiresAuth && !authStore.isAuthenticated) {
        console.log('❌ [AUTH GUARD] Accès refusé, redirection vers /auth')
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
        console.log('✅ [AUTH GUARD] Accès autorisé')
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

    // ⏳ Attendre que le store soit initialisé
    if (!authStore.isInitialized) {
        await authStore.waitForInitialization()
    }

    if (guestOnly && authStore.isAuthenticated) {
        // Si déjà connecté, rediriger vers la home
        next({ path: '/' })
    } else {
        next()
    }
}
