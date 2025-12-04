/**
 * Service d'authentification
 * Centralise toutes les opérations liées à l'authentification
 */

import { apiClient } from '@/api/client'
import type { LoginCredentials, RegisterCredentials, AuthResponse, AuthSuccessResponse, User } from '@/types/auth.types'
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
    mockResendVerificationEmailAPI,
    mockVerifyResetCodeAPI,
    mockCompletePasswordResetAPI
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
     *
     * @param token - Token de vérification reçu par email
     */
    async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
        try {
            if (USE_MOCK) {
                return await mockVerifyEmailAPI(token)
            } else {
                // Endpoint à définir avec le backend (GET ou POST)
                const response = await apiClient.post<{ success: boolean; message: string }>(
                    '/verify-email',
                    { token }
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
     * Renvoie l'email de vérification
     *
     * @param email - Email de l'utilisateur
     */
    async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
        try {
            if (USE_MOCK) {
                return await mockResendVerificationEmailAPI(email)
            } else {
                const response = await apiClient.post<{ success: boolean; message: string }>(
                    '/resend-verification',
                    { email }
                )
                return response
            }
        } catch (error: any) {
            logger.error('Erreur lors du renvoi de l\'email de vérification:', error)

            const errorMessage = error.response?.data?.message || 'Impossible de renvoyer l\'email de vérification.'

            throw new AuthError(
                errorMessage,
                'NETWORK_ERROR',
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
     * Déconnexion de l'utilisateur
     * En production, invalide le token côté serveur
     */
    async logout(): Promise<void> {
        try {
            if (USE_MOCK) {
                // Utiliser le mock
                await mockLogoutAPI()
            } else {
                // Appel API réel
                await apiClient.post('/logout')
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
     * @param code - Code reçu par email
     */
    async verifyResetCode(code: string): Promise<{ success: boolean; message: string }> {
        try {
            if (USE_MOCK) {
                return await mockVerifyResetCodeAPI(code)
            } else {
                const response = await apiClient.post<{ status: string }>(
                    '/forgot-password/verif',
                    { code }
                )
                return {
                    success: response.status === 'success',
                    message: 'Code valide.'
                }
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
     * @param code - Code reçu par email
     * @param password - Nouveau mot de passe
     * @param passwordConfirm - Confirmation du nouveau mot de passe
     */
    async completePasswordReset(
        code: string,
        password: string,
        passwordConfirm: string
    ): Promise<{ success: boolean; message: string }> {
        try {
            if (USE_MOCK) {
                return await mockCompletePasswordResetAPI(code, password, passwordConfirm)
            } else {
                const response = await apiClient.post<{ status: string }>(
                    '/forgot-password/complete',
                    { code, password, passwordConfirm }
                )
                return {
                    success: response.status === 'success',
                    message: 'Votre mot de passe a été réinitialisé avec succès.'
                }
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
