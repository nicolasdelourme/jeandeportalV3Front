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
 * Réponse de succès du backend pour le login/register
 */
export interface AuthSuccessResponse {
    status: 'success'
    access_token: {
        token: string  // Le token JWT en clair
    }
    type: 'Bearer'
    expires_in: number  // Durée de validité en secondes (86400 = 1 jour, 86400 * 14 = 14 jours)
    afterLogin?: string  // URL de redirection après login
}

/**
 * Réponse d'erreur du backend
 */
export interface AuthErrorResponse {
    status: 'error'
    message: string  // Message d'erreur du backend
}

/**
 * Union type pour toutes les réponses possibles
 */
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse

/**
 * Données de l'utilisateur connecté
 *
 * SÉCURITÉ: Ces champs sont filtrés via sanitizeUser() - whitelist pattern
 * Les champs sensibles (password, salt, token, etc.) ne sont JAMAIS stockés
 */
export interface User {
    // Identité
    id: number | string
    email: string
    emailVerified?: boolean          // À venir côté backend

    // Profil (disponible maintenant)
    title: string | null             // API: "title" - M. / Mme / Dr
    firstName: string | null         // API: "firstname" (lowercase)
    lastName: string | null          // API: "lastname" (lowercase)
    phone: string | null             // API: "phone"

    // Profil (à venir)
    avatarUrl: string | null         // À venir
    birthDate: string | null         // À venir

    // Adresses (à venir - sera un array)
    addresses: UserAddress[]         // À venir - backend prévoit un array

    // Métadonnées (disponible maintenant)
    tag: string | null               // API: "tag" - segmentation marketing
    createdOn: string | null         // API: "createdOn" - date inscription
    lastLogin: string | null         // API: "lastLogin" - dernière connexion
}

/**
 * Adresse utilisateur (pour livraison/facturation)
 * Structure préparée pour le futur array d'adresses du backend
 */
export interface UserAddress {
    id?: number | string
    label?: string              // "Domicile", "Bureau", etc.
    street: string
    city: string
    postalCode: string
    country: string
    isDefault?: boolean
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
    code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR' | 'USER_EXISTS'
    statusCode?: number

    constructor(
        message: string,
        code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR' | 'USER_EXISTS',
        statusCode?: number
    ) {
        super(message)
        this.name = 'AuthError'
        this.code = code
        this.statusCode = statusCode
    }
}
