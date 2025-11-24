/**
 * Utilitaires pour la gestion de l'authentification
 * Gère le stockage des données utilisateur en localStorage
 *
 * ⚠️ SÉCURITÉ: Les tokens JWT sont maintenant gérés via cookies HttpOnly
 * Ce fichier ne gère plus les tokens - seulement les données utilisateur
 */

import type { User } from '@/types/auth.types'
import { logger } from '@/utils/logger'

// Clé de stockage pour les données utilisateur
const AUTH_USER_KEY = 'auth_user'

/**
 * Sauvegarde les données utilisateur dans localStorage
 *
 * Note: Seules les données publiques non sensibles sont stockées ici
 * Le token JWT est géré via cookies HttpOnly par le navigateur
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
 *
 * Note: Supprime uniquement les données utilisateur en localStorage
 * Le cookie HttpOnly sera supprimé par le backend lors du logout
 */
export function clearAuthData(): void {
    localStorage.removeItem(AUTH_USER_KEY)

    // Nettoyage des anciennes clés de token (migration)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_token_expiry')
}

/**
 * Vérifie si l'utilisateur est authentifié
 *
 * Note: Vérifie seulement la présence des données utilisateur côté client
 * La vérification réelle du token JWT (dans le cookie HttpOnly) est faite
 * par le backend à chaque requête. Si le token est invalide, l'API
 * retournera 401 et l'intercepteur redirigera vers /auth
 */
export function isAuthenticated(): boolean {
    return getAuthUser() !== null
}
