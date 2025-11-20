/**
 * Store Pinia pour l'authentification
 * Gère l'état de l'utilisateur connecté, le token et la session
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth.types'
import { AuthError } from '@/types/auth.types'
import { authService } from '@/services/auth.service'
import {
    getAuthToken,
    setAuthToken,
    setAuthUser,
    clearAuthData,
    isAuthenticated as checkIsAuthenticated,
    getTimeUntilExpiry
} from '@/utils/auth'
import { logger } from '@/utils/logger'
import { sanitizeUser } from '@/utils/sanitize'

/**
 * Store d'authentification
 */
export const useAuthStore = defineStore('auth', () => {
    // === État ===
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isLoading = ref<boolean>(false)
    const error = ref<AuthError | null>(null)

    // === Getters (computed) ===

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    const isAuthenticated = computed(() => {
        return !!token.value && checkIsAuthenticated()
    })

    /**
     * Nom complet de l'utilisateur
     */
    const userFullName = computed(() => {
        if (!user.value) return ''
        return `${user.value.firstName} ${user.value.lastName}`
    })

    /**
     * Temps restant avant expiration du token (en secondes)
     */
    const timeUntilExpiry = computed(() => {
        return getTimeUntilExpiry()
    })

    // === Actions ===

    /**
     * Initialise le store à partir du localStorage
     * À appeler au démarrage de l'application
     */
    async function initialize(): Promise<void> {
        const storedToken = getAuthToken()

        if (!storedToken) return

        // ✅ Set loading state FIRST
        isLoading.value = true

        try {
            // ✅ Fetch fresh data BEFORE setting authenticated state
            const freshUser = await authService.getUserProfile(storedToken)

            // ✅ Only set state AFTER successful validation
            token.value = storedToken
            user.value = sanitizeUser(freshUser)
            setAuthUser(freshUser)
        } catch (error) {
            // Token invalide ou expiré, on déconnecte
            logger.warn('Token invalide lors de l\'initialisation, déconnexion')
            clearAuthData()
            token.value = null
            user.value = null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    async function login(credentials: LoginCredentials): Promise<string> {
        isLoading.value = true
        error.value = null

        try {
            // Le service lance une exception si la réponse contient une erreur
            const response = await authService.login(credentials)

            // Sauvegarder le token
            const authToken = response.access_token.token
            token.value = authToken
            setAuthToken(authToken, response.expires_in)

            // Récupérer les infos utilisateur
            const userProfile = await authService.getUserProfile(authToken)
            user.value = sanitizeUser(userProfile)  // ✅ Sanitized
            setAuthUser(userProfile)

            // Retourner l'URL de redirection
            return response.afterLogin || '/'
        } catch (err: any) {
            error.value = err instanceof AuthError ? err : new AuthError(
                'Une erreur est survenue lors de la connexion',
                'UNKNOWN_ERROR'
            )
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    async function register(credentials: RegisterCredentials): Promise<string> {
        isLoading.value = true
        error.value = null

        try {
            // Le service lance une exception si la réponse contient une erreur
            const response = await authService.register(credentials)

            // Sauvegarder le token (auto-connexion après inscription)
            const authToken = response.access_token.token
            token.value = authToken
            setAuthToken(authToken, response.expires_in)

            // Récupérer les infos utilisateur
            const userProfile = await authService.getUserProfile(authToken)
            user.value = sanitizeUser(userProfile)  // ✅ Sanitized
            setAuthUser(userProfile)

            // Retourner l'URL de redirection
            return response.afterLogin || '/'
        } catch (err: any) {
            error.value = err instanceof AuthError ? err : new AuthError(
                'Une erreur est survenue lors de l\'inscription',
                'UNKNOWN_ERROR'
            )
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Déconnexion de l'utilisateur
     */
    async function logout(): Promise<void> {
        isLoading.value = true

        try {
            // Appeler le backend pour invalider le token (optionnel mais recommandé)
            await authService.logout()
        } catch (err) {
            logger.error('Erreur lors de la déconnexion côté serveur:', err)
        } finally {
            // Nettoyer l'état local (même si l'appel backend a échoué)
            token.value = null
            user.value = null
            clearAuthData()
            isLoading.value = false
        }
    }

    /**
     * Rafraîchit les données utilisateur
     */
    async function refreshUser(): Promise<void> {
        if (!token.value) return

        try {
            const userProfile = await authService.getUserProfile(token.value)
            user.value = sanitizeUser(userProfile)  // ✅ Sanitized
            setAuthUser(userProfile)
        } catch (err) {
            logger.error('Erreur lors du rafraîchissement du profil:', err)
            // Si le token est invalide, déconnecter
            await logout()
        }
    }

    /**
     * Réinitialise l'erreur
     */
    function clearError(): void {
        error.value = null
    }

    // === Return (API publique du store) ===
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
        initialize,
        login,
        register,
        logout,
        refreshUser,
        clearError
    }
})
