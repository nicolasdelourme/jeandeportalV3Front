/**
 * Types pour le rattachement de compte legacy "Les Emmerdeurs"
 *
 * Ce module gère le flux de rattachement d'anciens abonnés vers Infocash
 */

/**
 * Credentials pour rattacher un compte legacy
 */
export interface LegacyLinkingCredentials {
    /** Numéro d'abonné (format: ABC-123456) */
    subscriberId: string
    /** Clé secrète fournie par email */
    secretKey: string
}

/**
 * Thème lié au compte legacy
 */
export interface LegacyLinkedTheme {
    /** Identifiant unique du thème */
    id: string
    /** Nom du thème */
    name: string
    /** Slug pour le thème (metaux, portefeuille, liberte, bonus) */
    slug: 'metaux' | 'portefeuille' | 'liberte' | 'bonus'
    /** Date d'expiration de l'abonnement si applicable */
    expiresAt?: string
}

/**
 * Résultat de la tentative de rattachement
 */
export interface LegacyLinkingResult {
    /** Statut de l'opération */
    status: 'success' | 'error'
    /** Message d'information ou d'erreur */
    message?: string
    /** Thèmes rattachés en cas de succès */
    linkedThemes?: LegacyLinkedTheme[]
    /** Étoiles récupérées du compte legacy */
    starsRecovered?: number
}

/**
 * État du rattachement pour un utilisateur
 */
export interface LegacyLinkingStatus {
    /** L'utilisateur a-t-il déjà rattaché un compte legacy */
    isLinked: boolean
    /** Date du rattachement si effectué */
    linkedAt?: string
    /** Numéro d'abonné rattaché (masqué partiellement) */
    subscriberId?: string
    /** Thèmes hérités du compte legacy */
    linkedThemes?: LegacyLinkedTheme[]
}

/**
 * Réponse API brute pour le rattachement
 */
export interface APILegacyLinkResponse {
    status: 'success' | 'error'
    message?: string
    data?: {
        linkedThemes?: Array<{
            id: string
            name: string
            slug: string
            expiresAt?: string
        }>
        starsRecovered?: number
    }
}

/**
 * Réponse API brute pour le statut de rattachement
 */
export interface APILegacyStatusResponse {
    status: 'success' | 'error'
    data?: {
        isLinked: boolean
        linkedAt?: string
        subscriberId?: string
        linkedThemes?: Array<{
            id: string
            name: string
            slug: string
            expiresAt?: string
        }>
    }
}

/**
 * Erreur spécifique au rattachement
 */
export class LegacyLinkingError extends Error {
    code: 'INVALID_CREDENTIALS' | 'ALREADY_LINKED' | 'EXPIRED_ACCOUNT' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR'
    statusCode?: number

    constructor(
        message: string,
        code: 'INVALID_CREDENTIALS' | 'ALREADY_LINKED' | 'EXPIRED_ACCOUNT' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR',
        statusCode?: number
    ) {
        super(message)
        this.name = 'LegacyLinkingError'
        this.code = code
        this.statusCode = statusCode
    }
}

/**
 * Étapes du tunnel de rattachement
 */
export type LinkingStep = 'welcome' | 'auth' | 'form' | 'success'

/**
 * Mode d'authentification dans le tunnel
 */
export type AuthMode = 'login' | 'register'

/**
 * État du tunnel de rattachement
 */
export interface LinkingTunnelState {
    /** Étape courante */
    currentStep: LinkingStep
    /** Résultat du rattachement (disponible après succès) */
    linkingResult?: LegacyLinkingResult
    /** Erreur en cours (si applicable) */
    error?: string
    /** Chargement en cours */
    isLoading: boolean
}
