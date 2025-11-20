/**
 * Utilitaires pour la gestion de l'authentification
 * Gère le stockage sécurisé du token, de l'expiration et des données utilisateur
 */

import type { User } from '@/types/auth.types'
import { logger } from '@/utils/logger'

// Clés de stockage
const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_TOKEN_EXPIRY_KEY = 'auth_token_expiry'
const AUTH_USER_KEY = 'auth_user'

/**
 * Sauvegarde le token d'authentification dans localStorage
 * @param token - Le token JWT
 * @param expiresIn - Durée de validité en secondes
 */
export function setAuthToken(token: string, expiresIn: number): void {
    const expiryTimestamp = Date.now() + expiresIn * 1000
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, expiryTimestamp.toString())
}

/**
 * Récupère le token d'authentification depuis localStorage
 * Retourne null si le token est expiré
 */
export function getAuthToken(): string | null {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return null

    // Vérifier si le token est expiré
    if (isTokenExpired()) {
        clearAuthData()
        return null
    }

    return token
}

/**
 * Vérifie si le token est expiré
 */
export function isTokenExpired(): boolean {
    const expiryStr = localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY)
    if (!expiryStr) return true

    const expiry = parseInt(expiryStr, 10)
    return Date.now() >= expiry
}

/**
 * Récupère le timestamp d'expiration du token
 */
export function getTokenExpiry(): number | null {
    const expiryStr = localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY)
    return expiryStr ? parseInt(expiryStr, 10) : null
}

/**
 * Sauvegarde les données utilisateur dans localStorage
 */
export function setAuthUser(user: User): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

/**
 * Récupère les données utilisateur depuis localStorage
 */
export function getAuthUser(): User | null {
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    if (!userStr) return null

    try {
        return JSON.parse(userStr) as User
    } catch (error) {
        logger.error('Erreur lors du parsing des données utilisateur:', error)
        return null
    }
}

/**
 * Supprime toutes les données d'authentification
 */
export function clearAuthData(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
}

/**
 * Supprime le token d'authentification (alias pour compatibilité)
 * @deprecated Utiliser clearAuthData() à la place
 */
export function removeAuthToken(): void {
    clearAuthData()
}

/**
 * Vérifie si l'utilisateur est authentifié (token valide et non expiré)
 */
export function isAuthenticated(): boolean {
    return getAuthToken() !== null
}

/**
 * Calcule le temps restant avant expiration en secondes
 */
export function getTimeUntilExpiry(): number {
    const expiry = getTokenExpiry()
    if (!expiry) return 0

    const remainingMs = expiry - Date.now()
    return Math.max(0, Math.floor(remainingMs / 1000))
}
