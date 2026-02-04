/**
 * Store Pinia pour l'authentification
 * Gère l'état de l'utilisateur connecté et la session
 *
 * ⚠️ SÉCURITÉ: Les tokens JWT sont maintenant gérés via cookies HttpOnly
 * Ce store ne gère plus les tokens - seulement les données utilisateur
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { User, LoginCredentials, RegisterCredentials, VerifyEmailResponse, UpdateProfileDto } from '@/types/auth.types'
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
import { useBookmarkStore } from '@/stores/bookmark.store'

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

        // Évite les doubles initialisations
        if (isInitialized.value) {
            return
        }

        const storedUser = getAuthUser()

        if (!storedUser) {
            isInitialized.value = true
            return
        }

        // ✅ Set loading state FIRST
        isLoading.value = true

        try {
            // ✅ Valide la session en récupérant le profil utilisateur
            // Le cookie HttpOnly sera automatiquement envoyé avec la requête
            const freshUser = await authService.getUserProfile()

            // ✅ Only set state AFTER successful validation
            user.value = sanitizeUser(freshUser)
            setAuthUser(freshUser)
        } catch {
            // Cookie invalide ou expiré, on déconnecte
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

        // Utiliser watch au lieu de polling (plus efficace)
        return new Promise((resolve) => {
            const unwatch = watch(isInitialized, (value) => {
                if (value) {
                    unwatch()
                    resolve()
                }
            }, { immediate: true })
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
            // Le service lance une exception si la réponse contient une erreur
            // Le backend définit le cookie HttpOnly dans Set-Cookie header
            const response = await authService.login(credentials)

            // Récupérer les infos utilisateur (le cookie sera envoyé automatiquement)
            const userProfile = await authService.getUserProfile()

            user.value = sanitizeUser(userProfile)  // ✅ Sanitized
            setAuthUser(userProfile)

            // Synchroniser le panier anonyme avec le compte utilisateur
            // Le backend associera le panier (via basketCode) au compte connecté
            const cartStore = useCartStore()
            if (cartStore.basketCode) {
                try {
                    await cartStore.syncWithBackend()
                } catch (err) {
                    logger.warn('⚠️ [AUTH STORE] Erreur lors de la sync panier (non bloquant):', err)
                }
            }

            // Initialiser les bookmarks
            const bookmarkStore = useBookmarkStore()
            bookmarkStore.initialize()

            // Retourner l'URL de redirection
            const redirectUrl = response.afterLogin || '/'
            return redirectUrl
        } catch (err) {
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
            // Le service lance une exception si la réponse contient une erreur
            await authService.register(credentials)

            // PAS d'auto-login : l'utilisateur doit vérifier son email
            // On ne récupère PAS le profil utilisateur
            // On ne stocke RIEN dans le state

            return { success: true }
        } catch (err) {
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
            const result = await authService.verifyEmail(token)
            return result
        } catch (err) {
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

            // Force page reload to get fresh session cookies from backend
            // (workaround si le backend ne clear pas correctement les cookies)
            window.location.href = '/auth'
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
     * Met à jour le profil utilisateur
     * POST /updateMe
     *
     * @param data - Les champs à mettre à jour (format API: firstname, lastname, etc.)
     */
    async function updateUserProfile(data: UpdateProfileDto): Promise<void> {
        if (!user.value) {
            throw new AuthError('Vous devez être connecté pour modifier votre profil.', 'TOKEN_EXPIRED')
        }

        isLoading.value = true
        error.value = null

        try {
            const updatedUser = await authService.updateProfile(data)

            // Mettre à jour le state avec le user sanitisé
            user.value = sanitizeUser(updatedUser)
            setAuthUser(updatedUser)
        } catch (err) {
            error.value = err instanceof AuthError ? err : new AuthError(
                'Une erreur est survenue lors de la mise à jour du profil',
                'UNKNOWN_ERROR'
            )
            throw error.value
        } finally {
            isLoading.value = false
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
        updateUserProfile,
        clearError
    }
})
