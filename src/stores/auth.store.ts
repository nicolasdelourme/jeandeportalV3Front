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
    getAuthUser,
    setAuthUser,
    clearAuthData,
    isAuthenticated as checkIsAuthenticated,
    getTimeUntilExpiry
} from '@/utils/auth'

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
        const storedUser = getAuthUser()

        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = storedUser

            // Optionnel : Vérifier que le token est toujours valide auprès du backend
            // et récupérer les données utilisateur à jour
            try {
                const freshUser = await authService.getUserProfile(storedToken)
                user.value = freshUser
                setAuthUser(freshUser)
            } catch (error) {
                // Token invalide ou expiré, on déconnecte
                console.warn('Token invalide lors de l\'initialisation, déconnexion')
                await logout()
            }
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    async function login(credentials: LoginCredentials): Promise<string> {
        isLoading.value = true
        error.value = null

        try {
            const response = await authService.login(credentials)

            if (response.status === 'error') {
                throw new AuthError(
                    response.message || 'Identifiants incorrects',
                    'INVALID_CREDENTIALS'
                )
            }

            // Sauvegarder le token
            const authToken = response.access_token.token
            token.value = authToken
            setAuthToken(authToken, response.expires_in)

            // Récupérer les infos utilisateur
            const userProfile = await authService.getUserProfile(authToken)
            user.value = userProfile
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
            const response = await authService.register(credentials)

            if (response.status === 'error') {
                throw new AuthError(
                    response.message || 'Impossible de créer le compte',
                    'UNKNOWN_ERROR'
                )
            }

            // Sauvegarder le token (auto-connexion après inscription)
            const authToken = response.access_token.token
            token.value = authToken
            setAuthToken(authToken, response.expires_in)

            // Récupérer les infos utilisateur
            const userProfile = await authService.getUserProfile(authToken)
            user.value = userProfile
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
            console.error('Erreur lors de la déconnexion côté serveur:', err)
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
            user.value = userProfile
            setAuthUser(userProfile)
        } catch (err) {
            console.error('Erreur lors du rafraîchissement du profil:', err)
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
