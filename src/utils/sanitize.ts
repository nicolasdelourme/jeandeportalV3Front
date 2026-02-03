import DOMPurify from 'dompurify'
import type { User, UserAddress } from '@/types/auth.types'

/**
 * Type guard pour valider la structure des données utilisateur
 * Accepte les deux formats : camelCase (firstName) et lowercase (firstname)
 */
export function isValidUser(obj: unknown): boolean {
    if (typeof obj !== 'object' || obj === null) return false
    if (Object.prototype.hasOwnProperty.call(obj, '__proto__')) return false  // Prévention prototype pollution

    const user = obj as Record<string, unknown>

    // Vérifier id et email (obligatoires)
    if (!(typeof user.id === 'number' || typeof user.id === 'string')) return false
    if (typeof user.email !== 'string') return false

    return true
}

/**
 * Sanitize une string nullable
 */
function sanitizeNullableString(value: unknown): string | null {
    if (value === null || value === undefined) return null
    if (typeof value !== 'string') return null
    const sanitized = DOMPurify.sanitize(value).trim()
    return sanitized || null
}

/**
 * Sanitize une string (retourne '' si invalide)
 */
function sanitizeString(value: unknown): string {
    if (typeof value !== 'string') return ''
    return DOMPurify.sanitize(value).trim()
}

/**
 * Sanitize le tableau d'adresses
 * Retourne un tableau vide si les données ne sont pas un array
 *
 * Note: Le backend utilise "adress_array" (typo) avec le format:
 * { id, title, firstname, lastname, recipient, line1, line2, zipcode, city, country, mainAdress, mainBillAdress }
 */
function sanitizeAddresses(addresses: unknown): UserAddress[] {
    if (!Array.isArray(addresses)) return []

    return addresses
        .filter((addr): addr is Record<string, unknown> =>
            typeof addr === 'object' && addr !== null
        )
        .map(addr => ({
            // L'API renvoie "adressId" (avec typo), fallback sur "id"
            id: (addr.adressId ?? addr.id) as number | string | undefined,
            // Destinataire
            title: sanitizeNullableString(addr.title),
            firstName: sanitizeNullableString(addr.firstname ?? addr.firstName),
            lastName: sanitizeNullableString(addr.lastname ?? addr.lastName),
            recipient: sanitizeNullableString(addr.recipient),
            // Adresse
            line1: sanitizeString(addr.line1),
            line2: sanitizeNullableString(addr.line2),
            zipcode: sanitizeString(addr.zipcode ?? addr.postalCode),
            city: sanitizeString(addr.city),
            country: sanitizeString(addr.country),
            // Métadonnées - adresses par défaut (valeur 1/0)
            isDefaultShipping: Boolean(addr.mainAdress ?? addr.isDefaultShipping ?? false),
            isDefaultBilling: Boolean(addr.mainBillAdress ?? addr.isDefaultBilling ?? false),
        }))
}

/**
 * Sanitize les données utilisateur pour prévenir les attaques XSS
 *
 * SÉCURITÉ: Utilise le pattern WHITELIST - seuls les champs listés explicitement
 * sont extraits. Les champs sensibles (password, salt, token, etc.) sont ignorés
 * même si le backend les envoie.
 *
 * @param user - Données brutes de l'API (peut contenir des champs sensibles)
 * @returns User - Objet User sanitizé avec uniquement les champs autorisés
 */
export function sanitizeUser(user: unknown): User {
    if (!isValidUser(user)) {
        throw new Error('Invalid user data structure')
    }

    const data = user as Record<string, unknown>

    // WHITELIST - On ne garde QUE ces champs (sécurité)
    // ⚠️ JAMAIS inclus : password, salt, token, forgottenPasswordCode,
    //                    rememberCode, ipAddress, facebookId, googleId, etc.
    return {
        // Identité
        id: data.id as number | string,
        email: sanitizeString(data.email),
        emailVerified: Boolean(data.emailVerified ?? data.email_verified ?? false),

        // Profil - gère les deux formats (camelCase et lowercase du backend)
        title: sanitizeNullableString(data.title),
        firstName: sanitizeNullableString(data.firstName ?? data.firstname),
        lastName: sanitizeNullableString(data.lastName ?? data.lastname),
        phone: sanitizeNullableString(data.phone),
        phoneStatus: sanitizeNullableString(data.phoneStatus ?? data.phone_status),
        pseudo: sanitizeNullableString(data.pseudo),
        birthDate: sanitizeNullableString(data.birthDate ?? data.birthdate ?? data.birth_date),

        // À venir - null/[] par défaut pour l'instant
        avatarUrl: sanitizeNullableString(data.avatarUrl ?? data.avatar_url),

        // Adresses - backend utilise "adress_array" (avec typo)
        addresses: sanitizeAddresses(data.addresses ?? data.adress_array),

        // Marketing/Optin
        optinStatus: sanitizeNullableString(data.optinStatus ?? data.optin_status),

        // Gamification
        jdpStar: typeof data.jdpStar === 'number' ? data.jdpStar : null,

        // Métadonnées
        tag: sanitizeNullableString(data.tag),
        createdOn: sanitizeNullableString(data.createdOn ?? data.created_on),
        lastLogin: sanitizeNullableString(data.lastLogin ?? data.last_login),
    }
}
