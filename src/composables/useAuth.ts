/**
 * Composable pour l'authentification
 * Expose les fonctionnalités d'authentification de manière pratique dans les composants
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginCredentials, RegisterCredentials } from '@/types/auth.types'

/**
 * Composable useAuth
 * Fournit un accès simplifié aux fonctionnalités d'authentification
 */
export function useAuth() {
    const authStore = useAuthStore()
    const router = useRouter()

    // === Getters ===

    /**
     * Utilisateur connecté
     */
    const user = computed(() => authStore.user)

    /**
     * Token d'authentification
     */
    const token = computed(() => authStore.token)

    /**
     * État de chargement
     */
    const isLoading = computed(() => authStore.isLoading)

    /**
     * Erreur d'authentification
     */
    const error = computed(() => authStore.error)

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    /**
     * Nom complet de l'utilisateur
     */
    const userFullName = computed(() => authStore.userFullName)

    /**
     * Temps restant avant expiration du token (en secondes)
     */
    const timeUntilExpiry = computed(() => authStore.timeUntilExpiry)

    // === Actions ===

    /**
     * Connexion
     */
    async function login(credentials: LoginCredentials): Promise<void> {
        await authStore.login(credentials)
    }

    /**
     * Inscription
     */
    async function register(credentials: RegisterCredentials): Promise<void> {
        await authStore.register(credentials)
    }

    /**
     * Déconnexion
     */
    async function logout(): Promise<void> {
        await authStore.logout()
        router.push('/auth')
    }

    /**
     * Rafraîchit les données utilisateur
     */
    async function refreshUser(): Promise<void> {
        await authStore.refreshUser()
    }

    /**
     * Réinitialise l'erreur
     */
    function clearError(): void {
        authStore.clearError()
    }

    /**
     * Vérifie si l'utilisateur a un rôle spécifique (exemple pour extension future)
     * @param role - Le rôle à vérifier
     */
    function hasRole(role: string): boolean {
        // Pour l'instant, on ne gère pas les rôles
        // À implémenter quand le backend fournira les rôles
        return false
    }

    /**
     * Redirige vers la page de login avec l'URL de retour
     * Utile pour protéger manuellement certaines actions
     */
    function requireAuth(redirectUrl?: string): void {
        if (!isAuthenticated.value) {
            router.push({
                path: '/auth',
                query: { redirect: redirectUrl || router.currentRoute.value.fullPath }
            })
        }
    }

    // === Return (API publique) ===
    return {
        // State
        user,
        token,
        isLoading,
        error,

        // Getters
        isAuthenticated,
        userFullName,
        timeUntilExpiry,

        // Actions
        login,
        register,
        logout,
        refreshUser,
        clearError,
        hasRole,
        requireAuth
    }
}
