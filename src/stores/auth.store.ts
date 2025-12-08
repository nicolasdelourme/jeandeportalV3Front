/**
 * Store Pinia pour l'authentification
 * Gère l'état de l'utilisateur connecté et la session
 *
 * ⚠️ SÉCURITÉ: Les tokens JWT sont maintenant gérés via cookies HttpOnly
 * Ce store ne gère plus les tokens - seulement les données utilisateur
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterCredentials, VerifyEmailResponse } from '@/types/auth.types'
import { AuthError } from '@/types/auth.types'
import { authService } from '@/services/auth.service'
import {
    setAuthUser,
    clearAuthData,
    getAuthUser
} from '@/utils/auth'
import { logger } from '@/utils/logger'
import { sanitizeUser } from '@/utils/sanitize'
import { useCartStore } from '@/stores/cart.store'

/**
 * Store d'authentification
 */
export const useAuthStore = defineStore('auth', () => {
    // === État ===
    const user = ref<User | null>(null)
    const isLoading = ref<boolean>(false)
    const error = ref<AuthError | null>(null)
    const isInitialized = ref<boolean>(false) // Track si initialize() a été appelé

    // === Getters (computed) ===

    /**
     * Vérifie si l'utilisateur est authentifié
     *
     * Note: La vérification réelle du token JWT se fait côté serveur
     * Côté client, on vérifie seulement la présence des données utilisateur
     * dans le store (user.value) qui est réactif, pas dans localStorage
     */
    const isAuthenticated = computed(() => {
        return user.value !== null
    })

    /**
     * Nom complet de l'utilisateur
     */
    const userFullName = computed(() => {
        if (!user.value) return ''
        return `${user.value.firstName} ${user.value.lastName}`
    })

    // === Actions ===

    /**
     * Initialise le store à partir du localStorage et valide la session
     * À appeler au démarrage de l'application
     *
     * Note: Le cookie HttpOnly est automatiquement envoyé par le navigateur
     * On vérifie juste si le backend reconnaît la session
     */
    async function initialize(): Promise<void> {
        console.log('🔄 [AUTH STORE] initialize() appelé')

        // Évite les doubles initialisations
        if (isInitialized.value) {
            console.log('🔄 [AUTH STORE] Déjà initialisé, skip')
            return
        }

        const storedUser = getAuthUser()
        console.log('🔄 [AUTH STORE] storedUser:', storedUser)

        if (!storedUser) {
            console.log('🔄 [AUTH STORE] Pas de user stocké, skip init')
            isInitialized.value = true
            return
        }

        // ✅ Set loading state FIRST
        isLoading.value = true

        try {
            // ✅ Valide la session en récupérant le profil utilisateur
            // Le cookie HttpOnly sera automatiquement envoyé avec la requête
            console.log('🔄 [AUTH STORE] Validation de la session via /me...')
            const freshUser = await authService.getUserProfile()
            console.log('✅ [AUTH STORE] Session valide, user:', freshUser)

            // ✅ Only set state AFTER successful validation
            user.value = sanitizeUser(freshUser)
            setAuthUser(freshUser)
        } catch (error) {
            // Cookie invalide ou expiré, on déconnecte
            console.error('❌ [AUTH STORE] Session invalide lors de l\'initialisation:', error)
            logger.warn('Session invalide lors de l\'initialisation, déconnexion')
            clearAuthData()
            user.value = null
        } finally {
            isLoading.value = false
            isInitialized.value = true
        }
    }

    /**
     * Attend que le store soit initialisé
     * Utile pour les guards de navigation
     */
    async function waitForInitialization(): Promise<void> {
        if (isInitialized.value) return

        // Attendre que isInitialized devienne true (polling simple)
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (isInitialized.value) {
                    clearInterval(checkInterval)
                    resolve()
                }
            }, 10)
        })
    }

    /**
     * Connexion d'un utilisateur
     *
     * Note: Le backend définira le cookie HttpOnly automatiquement
     * dans la réponse. Le navigateur stockera ce cookie et l'enverra
     * automatiquement avec chaque requête ultérieure.
     */
    async function login(credentials: LoginCredentials): Promise<string> {
        isLoading.value = true
        error.value = null

        try {
            console.log('🔐 [AUTH STORE] Début du login...')

            // Le service lance une exception si la réponse contient une erreur
            // Le backend définit le cookie HttpOnly dans Set-Cookie header
            const response = await authService.login(credentials)
            console.log('✅ [AUTH STORE] Login API réussi, response:', response)

            // Récupérer les infos utilisateur (le cookie sera envoyé automatiquement)
            console.log('👤 [AUTH STORE] Récupération du profil utilisateur...')
            const userProfile = await authService.getUserProfile()
            console.log('✅ [AUTH STORE] Profil récupéré:', userProfile)

            user.value = sanitizeUser(userProfile)  // ✅ Sanitized
            setAuthUser(userProfile)
            console.log('✅ [AUTH STORE] User défini dans le store:', user.value)

            // Retourner l'URL de redirection
            const redirectUrl = response.afterLogin || '/'
            console.log('🔀 [AUTH STORE] URL de redirection:', redirectUrl)
            return redirectUrl
        } catch (err: any) {
            console.error('❌ [AUTH STORE] Erreur lors du login:', err)
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
     *
     * Note: L'inscription ne connecte PLUS automatiquement l'utilisateur.
     * Un email de vérification est envoyé et l'utilisateur doit cliquer sur le lien
     * pour activer son compte avant de pouvoir se connecter.
     *
     * @returns { success: true } si l'inscription a réussi
     */
    async function register(credentials: RegisterCredentials): Promise<{ success: boolean }> {
        isLoading.value = true
        error.value = null

        try {
            console.log('📝 [AUTH STORE] Début de l\'inscription...')

            // Le service lance une exception si la réponse contient une erreur
            await authService.register(credentials)

            console.log('✅ [AUTH STORE] Inscription réussie, email de vérification envoyé')

            // PAS d'auto-login : l'utilisateur doit vérifier son email
            // On ne récupère PAS le profil utilisateur
            // On ne stocke RIEN dans le state

            return { success: true }
        } catch (err: any) {
            console.error('❌ [AUTH STORE] Erreur lors de l\'inscription:', err)
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
     * Vérifie l'email de l'utilisateur via le token reçu par email
     * POST /register/verif-mail
     *
     * @param token - Token (hash) de vérification reçu par email
     * @returns VerifyEmailResponse { status, next?, message? }
     */
    async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
        isLoading.value = true
        error.value = null

        try {
            console.log('✅ [AUTH STORE] Vérification de l\'email...')
            const result = await authService.verifyEmail(token)
            console.log('✅ [AUTH STORE] Résultat vérification:', result)
            return result
        } catch (err: any) {
            console.error('❌ [AUTH STORE] Erreur lors de la vérification:', err)
            error.value = err instanceof AuthError ? err : new AuthError(
                'Une erreur est survenue lors de la vérification',
                'UNKNOWN_ERROR'
            )
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Déconnexion de l'utilisateur
     *
     * Note: Le backend supprimera le cookie HttpOnly (Max-Age=0)
     */
    async function logout(): Promise<void> {
        isLoading.value = true

        try {
            // Appeler le backend pour supprimer le cookie HttpOnly
            await authService.logout()
        } catch (err) {
            logger.error('Erreur lors de la déconnexion côté serveur:', err)
        } finally {
            // Nettoyer l'état local (même si l'appel backend a échoué)
            user.value = null
            clearAuthData()

            // Réinitialiser le panier (vide le basketCode)
            const cartStore = useCartStore()
            cartStore.resetCart()

            isLoading.value = false
        }
    }

    /**
     * Rafraîchit les données utilisateur
     *
     * Note: Le cookie HttpOnly sera automatiquement envoyé avec la requête
     */
    async function refreshUser(): Promise<void> {
        if (!user.value) return

        try {
            const userProfile = await authService.getUserProfile()
            user.value = sanitizeUser(userProfile)  // ✅ Sanitized
            setAuthUser(userProfile)
        } catch (err) {
            logger.error('Erreur lors du rafraîchissement du profil:', err)
            // Si le cookie est invalide, déconnecter
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
        isLoading,
        error,
        isInitialized,

        // Getters
        isAuthenticated,
        userFullName,

        // Actions
        initialize,
        waitForInitialization,
        login,
        register,
        verifyEmail,
        logout,
        refreshUser,
        clearError
    }
})
