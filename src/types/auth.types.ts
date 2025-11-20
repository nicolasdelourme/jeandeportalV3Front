/**
 * Types pour l'authentification
 */

/**
 * Credentials pour le login
 */
export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean  // "Rester connecté"
    redirectUrl?: string  // URL de redirection après login (pour dire au backend d'où on vient)
}

/**
 * Credentials pour l'inscription
 */
export interface RegisterCredentials {
    firstName: string
    lastName: string
    email: string
    password: string
}

/**
 * Réponse du backend pour le login/register
 */
export interface AuthResponse {
    status: 'success' | 'error'
    access_token: {
        token: string  // Le token JWT en clair
    }
    type: 'Bearer'
    expires_in: number  // Durée de validité en secondes (86400 = 1 jour, 86400 * 14 = 14 jours)
    afterLogin?: string  // URL de redirection après login
    message?: string  // Message d'erreur éventuel
}

/**
 * Données de l'utilisateur connecté
 */
export interface User {
    id: number | string
    email: string
    firstName: string
    lastName: string
    // Ajoute d'autres champs selon ton backend
}

/**
 * État de l'authentification stocké
 */
export interface AuthState {
    token: string | null
    tokenExpiry: number | null  // Timestamp d'expiration (Date.now() + expires_in * 1000)
    user: User | null
    isAuthenticated: boolean
}

/**
 * Erreurs d'authentification
 */
export class AuthError extends Error {
    constructor(
        message: string,
        public code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR' | 'USER_EXISTS',
        public statusCode?: number
    ) {
        super(message)
        this.name = 'AuthError'
    }
}
