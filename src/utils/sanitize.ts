import DOMPurify from 'dompurify'
import type { User } from '@/types/auth.types'

/**
 * Type guard pour valider la structure des données utilisateur
 */
export function isValidUser(obj: any): obj is User {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        (typeof obj.id === 'number' || typeof obj.id === 'string') &&
        typeof obj.email === 'string' &&
        typeof obj.firstName === 'string' &&
        typeof obj.lastName === 'string' &&
        !obj.hasOwnProperty('__proto__')  // Prévention prototype pollution
    )
}

/**
 * Sanitize les données utilisateur pour prévenir les attaques XSS
 */
export function sanitizeUser(user: any): User {
    if (!isValidUser(user)) {
        throw new Error('Invalid user data structure')
    }

    return {
        id: user.id,
        email: DOMPurify.sanitize(user.email),
        firstName: DOMPurify.sanitize(user.firstName),
        lastName: DOMPurify.sanitize(user.lastName)
    }
}
