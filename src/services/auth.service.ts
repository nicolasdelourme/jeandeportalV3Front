/**
 * Service d'authentification
 * Centralise toutes les opérations liées à l'authentification
 */

import { apiClient } from '@/api/client'
import type { LoginCredentials, RegisterCredentials, AuthResponse, AuthSuccessResponse, User } from '@/types/auth.types'
import { AuthError } from '@/types/auth.types'

// MOCK MODE : À passer à false quand le vrai backend sera prêt
const USE_MOCK = true

// Import conditionnel du mock
import {
    mockLoginAPI,
    mockRegisterAPI,
    mockGetUserProfileAPI,
    mockLogoutAPI,
    mockForgotPasswordAPI
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
                response = await apiClient.post<AuthResponse>('/auth/login', {
                    email: credentials.email,
                    password: credentials.password,
                    remember_me: credentials.rememberMe,
                    redirect_url: credentials.redirectUrl
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
            console.error('Erreur lors de la connexion:', error)

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
     */
    async register(credentials: RegisterCredentials): Promise<AuthSuccessResponse> {
        try {
            let response: AuthResponse

            if (USE_MOCK) {
                // Utiliser le mock
                response = await mockRegisterAPI(credentials)
            } else {
                // Appel API réel
                response = await apiClient.post<AuthResponse>('/auth/register', {
                    first_name: credentials.firstName,
                    last_name: credentials.lastName,
                    email: credentials.email,
                    password: credentials.password
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
            console.error('Erreur lors de l\'inscription:', error)

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
     * Récupère le profil de l'utilisateur connecté
     */
    async getUserProfile(token: string): Promise<User> {
        try {
            if (USE_MOCK) {
                // Utiliser le mock
                const user = await mockGetUserProfileAPI(token)
                if (!user) {
                    throw new Error('Utilisateur non trouvé')
                }
                return user
            } else {
                // Appel API réel
                const response = await apiClient.get<User>('/auth/me')
                return response
            }
        } catch (error: any) {
            console.error('Erreur lors de la récupération du profil:', error)
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
                await apiClient.post('/auth/logout')
            }
        } catch (error: any) {
            console.error('Erreur lors de la déconnexion:', error)
            // On ne lève pas d'erreur car la déconnexion locale doit quand même se faire
        }
    }

    /**
     * Demande de réinitialisation de mot de passe
     */
    async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
        try {
            if (USE_MOCK) {
                // Utiliser le mock
                return await mockForgotPasswordAPI(email)
            } else {
                // Appel API réel
                const response = await apiClient.post<{ success: boolean; message: string }>(
                    '/auth/forgot-password',
                    { email }
                )
                return response
            }
        } catch (error: any) {
            console.error('Erreur lors de la réinitialisation:', error)
            throw new AuthError(
                'Impossible d\'envoyer l\'email de réinitialisation.',
                'NETWORK_ERROR',
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
