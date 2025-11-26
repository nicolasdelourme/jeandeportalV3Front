import DOMPurify from 'dompurify'
import type { User } from '@/types/auth.types'

/**
 * Type guard pour valider la structure des données utilisateur
 * Accepte les deux formats : camelCase (firstName) et lowercase (firstname)
 */
export function isValidUser(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false
    if (obj.hasOwnProperty('__proto__')) return false  // Prévention prototype pollution

    // Vérifier id et email (obligatoires)
    if (!(typeof obj.id === 'number' || typeof obj.id === 'string')) return false
    if (typeof obj.email !== 'string') return false

    // Vérifier firstName/firstname et lastName/lastname (au moins un format)
    const hasFirstName = typeof obj.firstName === 'string' || typeof obj.firstname === 'string' || obj.firstname === null || obj.firstName === null
    const hasLastName = typeof obj.lastName === 'string' || typeof obj.lastname === 'string' || obj.lastname === null || obj.lastName === null

    return hasFirstName && hasLastName
}

/**
 * Sanitize les données utilisateur pour prévenir les attaques XSS
 * Mappe les champs du backend (lowercase) vers le format frontend (camelCase)
 */
export function sanitizeUser(user: any): User {
    if (!isValidUser(user)) {
        throw new Error('Invalid user data structure')
    }

    // Mapper les champs (backend peut envoyer firstname ou firstName)
    const firstName = user.firstName ?? user.firstname ?? ''
    const lastName = user.lastName ?? user.lastname ?? ''

    return {
        id: user.id,
        email: DOMPurify.sanitize(user.email),
        firstName: DOMPurify.sanitize(firstName),
        lastName: DOMPurify.sanitize(lastName)
    }
}
