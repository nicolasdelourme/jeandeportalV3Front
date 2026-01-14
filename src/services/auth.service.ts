/**
 * Service d'authentification
 * Centralise toutes les opérations liées à l'authentification
 */

import { apiClient } from '@/api/client'
import type { LoginCredentials, RegisterCredentials, AuthResponse, AuthSuccessResponse, User, VerifyEmailResponse, ResetPasswordResponse, ChangeEmailResponse, ValidateEmailChangeResponse, UpdateProfileDto } from '@/types/auth.types'
import { AuthError } from '@/types/auth.types'
import { logger } from '@/utils/logger'

// MOCK MODE : Contrôlé par VITE_API_MODE
// - "mock" (défaut en dev) : utilise les données fictives
// - "real" (npm run dev:real) : utilise le vrai backend
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

// Sécurité : Empêcher le build si mock activé en production
if (import.meta.env.PROD && USE_MOCK) {
    throw new Error('🚨 SECURITY: Mock authentication must be disabled in production builds!')
}

// Import conditionnel du mock
import {
    mockLoginAPI,
    mockRegisterAPI,
    mockGetUserProfileAPI,
    mockLogoutAPI,
    mockForgotPasswordAPI,
    mockVerifyEmailAPI,
    mockVerifyResetCodeAPI,
    mockCompletePasswordResetAPI,
    mockRequestEmailChangeAPI,
    mockValidateEmailChangeAPI,
    mockUpdateProfileAPI
} from '@/api/auth.mock'

/**
 * Service d'authentification
 */
export class AuthService {
    /**
     * Connexion d'un utilisateur
     */
    async login(credentials: LoginCredentials): Promise<AuthSuccessResponse> {
        try {
            let response: AuthResponse

            if (USE_MOCK) {
                // Utiliser le mock
                response = await mockLoginAPI(credentials)
            } else {
                // Appel API réel
                response = await apiClient.post<AuthResponse>('/login', {
                    email: credentials.email,
                    password: credentials.password,
                    rememberMe: credentials.rememberMe,
                    redirectUrl: credentials.redirectUrl
                })
            }

            // Vérifier si la réponse contient une erreur (dans le body)
            if (response.status === 'error') {
                throw new AuthError(
                    response.message,
                    'INVALID_CREDENTIALS'
                )
            }

            return response
        } catch (error: any) {
            // Si c'est déjà une AuthError, la re-lancer
            if (error instanceof AuthError) {
                throw error
            }

            // Gérer les erreurs HTTP/réseau
            logger.error('Erreur lors de la connexion:', error)

            // Essayer d'extraire le message d'erreur de la réponse
            const errorMessage = error.response?.data?.message || 'Impossible de se connecter. Vérifiez vos identifiants.'

            throw new AuthError(
                errorMessage,
                'INVALID_CREDENTIALS',
                error.response?.status
            )
        }
    }

    /**
     * Inscription d'un nouvel utilisateur
     *
     * Note: L'inscription ne connecte plus automatiquement l'utilisateur.
     * Un email de confirmation est envoyé et l'utilisateur doit valider son email.
     */
    async register(credentials: RegisterCredentials): Promise<AuthSuccessResponse> {
        try {
            let response: AuthResponse

            if (USE_MOCK) {
                // Utiliser le mock
                response = await mockRegisterAPI(credentials)
            } else {
                // Appel API réel - nouveaux champs ajoutés
                response = await apiClient.post<AuthResponse>('/register', {
                    firstname: credentials.firstName,
                    lastname: credentials.lastName,
                    email: credentials.email,
                    password: credentials.password,
                    passwordConfirm: credentials.passwordConfirm,
                    phone: credentials.phone || null,
                    birthdate: credentials.birthDate || null
                })
            }

            // Vérifier si la réponse contient une erreur (dans le body)
            if (response.status === 'error') {
                // Déterminer le code d'erreur selon le message
                const errorCode = response.message.toLowerCase().includes('existe')
                    ? 'USER_EXISTS'
                    : 'UNKNOWN_ERROR'

                throw new AuthError(
                    response.message,
                    errorCode
                )
            }

            return response
        } catch (error: any) {
            // Si c'est déjà une AuthError, la re-lancer
            if (error instanceof AuthError) {
                throw error
            }

            // Gérer les erreurs HTTP/réseau
            logger.error('Erreur lors de l\'inscription:', error)

            // Gérer les erreurs spécifiques
            if (error.response?.status === 409) {
                throw new AuthError(
                    error.response?.data?.message || 'Un compte existe déjà avec cet email.',
                    'USER_EXISTS',
                    409
                )
            }

            // Essayer d'extraire le message d'erreur de la réponse
            const errorMessage = error.response?.data?.message || 'Impossible de créer le compte. Veuillez réessayer.'

            throw new AuthError(
                errorMessage,
                'UNKNOWN_ERROR',
                error.response?.status
            )
        }
    }

    /**
     * Vérifie l'email de l'utilisateur via le token reçu par email
     * POST /register/verif-mail
     *
     * @param token - Token (hash) de vérification reçu par email
     */
    async verifyEmail(token: string): Promise<VerifyEmailResponse> {
        try {
            if (USE_MOCK) {
                return await mockVerifyEmailAPI(token)
            } else {
                const response = await apiClient.post<VerifyEmailResponse>(
                    '/register/verif-mail',
                    { hash: token }
                )
                return response
            }
        } catch (error: any) {
            logger.error('Erreur lors de la vérification de l\'email:', error)

            const errorMessage = error.response?.data?.message || 'Impossible de vérifier l\'email. Le lien est peut-être expiré.'

            throw new AuthError(
                errorMessage,
                'UNKNOWN_ERROR',
                error.response?.status
            )
        }
    }

    /**
     * Récupère le profil de l'utilisateur connecté
     *
     * Note: Le cookie HttpOnly est automatiquement envoyé par le navigateur
     * avec la requête (withCredentials: true dans axios config)
     */
    async getUserProfile(): Promise<User> {
        try {
            if (USE_MOCK) {
                // Utiliser le mock
                const user = await mockGetUserProfileAPI()
                if (!user) {
                    throw new Error('Utilisateur non trouvé')
                }
                return user
            } else {
                // Appel API réel - le cookie sera automatiquement envoyé
                const response = await apiClient.get<User>('/me')
                return response
            }
        } catch (error: any) {
            logger.error('Erreur lors de la récupération du profil:', error)
            throw new AuthError(
                'Impossible de récupérer le profil utilisateur.',
                'TOKEN_EXPIRED',
                error.response?.status
            )
        }
    }

    /**
     * Met à jour le profil de l'utilisateur connecté
     * POST /updateMe
     */
    async updateProfile(data: UpdateProfileDto): Promise<User> {
        try {
            if (USE_MOCK) {
                return await mockUpdateProfileAPI(data)
            } else {
                // Appel API réel
                const response = await apiClient.post<User>('/updateMe', data)
                return response
            }
        } catch (error: any) {
            logger.error('Erreur lors de la mise à jour du profil:', error)
            throw new AuthError(
                error.response?.data?.message || 'Impossible de mettre à jour le profil.',
                'UNKNOWN_ERROR',
                error.response?.status
            )
        }
    }

    /**
     * Déconnexion de l'utilisateur
     * En production, invalide le token côté serveur
     */
    async logout(): Promise<void> {
        try {
            if (USE_MOCK) {
                // Utiliser le mock
                await mockLogoutAPI()
            } else {
                // Appel API réel (GET, pas POST!)
                await apiClient.get('/logout')
            }
        } catch (error: any) {
            logger.error('Erreur lors de la déconnexion:', error)
            // On ne lève pas d'erreur car la déconnexion locale doit quand même se faire
        }
    }

    /**
     * Demande de réinitialisation de mot de passe
     * POST /forgot-password
     */
    async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
        try {
            if (USE_MOCK) {
                return await mockForgotPasswordAPI(email)
            } else {
                const response = await apiClient.post<{ status: string }>(
                    '/forgot-password',
                    { email }
                )
                // Convertir la réponse API { status: "success" } en format interne
                return {
                    success: response.status === 'success',
                    message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
                }
            }
        } catch (error: any) {
            logger.error('Erreur lors de la réinitialisation:', error)
            throw new AuthError(
                'Impossible d\'envoyer l\'email de réinitialisation.',
                'NETWORK_ERROR',
                error.response?.status
            )
        }
    }

    /**
     * Vérifie la validité du code de réinitialisation
     * POST /forgot-password/verif
     *
     * @param hash - Token (hash) reçu par email
     */
    async verifyResetCode(hash: string): Promise<ResetPasswordResponse> {
        try {
            if (USE_MOCK) {
                return await mockVerifyResetCodeAPI(hash)
            } else {
                const response = await apiClient.post<ResetPasswordResponse>(
                    '/forgot-password/verif',
                    { hash }
                )
                return response
            }
        } catch (error: any) {
            logger.error('Erreur lors de la vérification du code:', error)

            const errorMessage = error.response?.data?.message || 'Le lien de réinitialisation est invalide ou a expiré.'

            throw new AuthError(
                errorMessage,
                'UNKNOWN_ERROR',
                error.response?.status
            )
        }
    }

    /**
     * Finalise la réinitialisation du mot de passe
     * POST /forgot-password/complete
     *
     * @param hash - Token (hash) reçu par email
     * @param password - Nouveau mot de passe
     * @param passwordConfirm - Confirmation du nouveau mot de passe
     */
    async completePasswordReset(
        hash: string,
        password: string,
        passwordConfirm: string
    ): Promise<ResetPasswordResponse> {
        try {
            if (USE_MOCK) {
                return await mockCompletePasswordResetAPI(hash, password, passwordConfirm)
            } else {
                const response = await apiClient.post<ResetPasswordResponse>(
                    '/forgot-password/complete',
                    { hash, password, passwordConfirm }
                )
                return response
            }
        } catch (error: any) {
            logger.error('Erreur lors de la réinitialisation du mot de passe:', error)

            const errorMessage = error.response?.data?.message || 'Impossible de réinitialiser le mot de passe.'

            throw new AuthError(
                errorMessage,
                'UNKNOWN_ERROR',
                error.response?.status
            )
        }
    }

    /**
     * Demande de modification d'email
     * POST /accountKey/modification
     * Envoie un email avec un lien de validation (valable 15 min)
     *
     * @param newEmail - Nouvel email souhaité
     */
    async requestEmailChange(newEmail: string): Promise<ChangeEmailResponse> {
        try {
            console.log('🔍 [DEBUG] requestEmailChange appelé avec:', newEmail)
            console.log('🔍 [DEBUG] USE_MOCK:', USE_MOCK)

            if (USE_MOCK) {
                console.log('🔍 [DEBUG] Utilisation du mock')
                return await mockRequestEmailChangeAPI(newEmail)
            } else {
                console.log('🔍 [DEBUG] Appel API réel: POST /accountKey/modification')
                const response = await apiClient.post<any>(
                    '/accountKey/modification',
                    { email: newEmail }
                )
                console.log('🔍 [DEBUG] Réponse API:', response)

                // L'API peut retourner { status: "success" } ou { email: ["error", "message"] }
                if (response.status === 'success') {
                    return { status: 'success' }
                }

                // Gérer le format d'erreur { email: ["error", "message"] }
                if (response.email && Array.isArray(response.email)) {
                    const [errorType, errorMessage] = response.email
                    if (errorType === 'error') {
                        return { status: 'error', message: errorMessage }
                    }
                }

                // Si format inconnu mais pas d'erreur explicite, considérer comme succès
                return { status: 'success' }
            }
        } catch (error: any) {
            console.error('🔍 [DEBUG] Erreur dans requestEmailChange:', error)
            logger.error('Erreur lors de la demande de modification d\'email:', error)

            const errorMessage = error.response?.data?.message || 'Impossible de demander la modification d\'email.'

            throw new AuthError(
                errorMessage,
                'UNKNOWN_ERROR',
                error.response?.status
            )
        }
    }

    /**
     * Valide la modification d'email via le code reçu par email
     * POST /accountKey/validation
     *
     * @param modificationCode - Hash reçu par email (depuis l'URL /changement/finalisation/:hash)
     */
    async validateEmailChange(modificationCode: string): Promise<ValidateEmailChangeResponse> {
        try {
            if (USE_MOCK) {
                return await mockValidateEmailChangeAPI(modificationCode)
            } else {
                const response = await apiClient.post<ValidateEmailChangeResponse>(
                    '/accountKey/validation',
                    { modificationCode }
                )
                return response
            }
        } catch (error: any) {
            logger.error('Erreur lors de la validation du changement d\'email:', error)

            const errorMessage = error.response?.data?.message || 'Le lien de validation est invalide ou a expiré.'

            throw new AuthError(
                errorMessage,
                'UNKNOWN_ERROR',
                error.response?.status
            )
        }
    }

    /**
     * Vérifie si on est en mode mock
     */
    isUsingMock(): boolean {
        return USE_MOCK
    }
}

// Export d'une instance unique (singleton)
export const authService = new AuthService()

// Export de la classe pour des cas d'usage avancés
export default AuthService
