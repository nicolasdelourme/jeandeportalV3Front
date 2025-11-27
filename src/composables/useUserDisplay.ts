/**
 * Composable pour l'affichage des données utilisateur
 * Gère les cas où certains champs sont null et fournit des fallbacks intelligents
 */

import { computed, type Ref, type ComputedRef } from 'vue'
import type { User } from '@/types/auth.types'

interface UserDisplayReturn {
    /** Nom complet avec fallback intelligent */
    displayName: ComputedRef<string>
    /** Initiales pour l'avatar (2 caractères max) */
    avatarInitials: ComputedRef<string>
    /** URL de l'avatar ou null */
    avatarUrl: ComputedRef<string | null>
    /** "Membre depuis novembre 2024" ou null */
    memberSince: ComputedRef<string | null>
    /** Date de dernière connexion formatée ou null */
    lastLoginFormatted: ComputedRef<string | null>
    /** Email vérifié */
    isEmailVerified: ComputedRef<boolean>
    /** Vérifie si le profil est complet (prénom + nom renseignés) */
    isProfileComplete: ComputedRef<boolean>
}

/**
 * Composable pour afficher les données utilisateur avec des fallbacks intelligents
 *
 * @param user - Ref vers l'utilisateur (peut être null)
 * @returns Objets computed pour l'affichage
 *
 * @example
 * ```vue
 * <script setup>
 * const { user } = useAuth()
 * const { displayName, avatarInitials, memberSince } = useUserDisplay(user)
 * </script>
 *
 * <template>
 *   <p>Bonjour {{ displayName }}</p>
 *   <Avatar :initials="avatarInitials" />
 *   <span v-if="memberSince">{{ memberSince }}</span>
 * </template>
 * ```
 */
export function useUserDisplay(user: Ref<User | null>): UserDisplayReturn {
    /**
     * Nom d'affichage avec fallback en cascade :
     * 1. Prénom + Nom
     * 2. Titre + Nom (si prénom manquant)
     * 3. Prénom seul
     * 4. Partie avant @ de l'email
     * 5. "Utilisateur" par défaut
     */
    const displayName = computed((): string => {
        if (!user.value) return 'Utilisateur'

        const title = user.value.title
        const firstName = user.value.firstName
        const lastName = user.value.lastName
        const email = user.value.email

        if (firstName && lastName) {
            return `${firstName} ${lastName}`
        }
        if (lastName) {
            return title ? `${title} ${lastName}` : lastName
        }
        if (firstName) {
            return firstName
        }
        if (email) {
            return email.split('@')[0] ?? 'Utilisateur'
        }
        return 'Utilisateur'
    })

    /**
     * Initiales pour l'avatar (2 caractères max)
     * Fallback: "?" si aucun nom disponible
     */
    const avatarInitials = computed((): string => {
        if (!user.value) return '?'

        const firstName = user.value.firstName
        const lastName = user.value.lastName
        const email = user.value.email

        const firstInitial = firstName?.[0]?.toUpperCase() ?? ''
        const lastInitial = lastName?.[0]?.toUpperCase() ?? ''

        if (firstInitial && lastInitial) {
            return `${firstInitial}${lastInitial}`
        }
        if (lastInitial) {
            return lastInitial
        }
        if (firstInitial) {
            return firstInitial
        }
        if (email && email.length > 0 && email[0]) {
            return email[0].toUpperCase()
        }
        return '?'
    })

    /**
     * URL de l'avatar (null si pas d'avatar)
     */
    const avatarUrl = computed(() => user.value?.avatarUrl ?? null)

    /**
     * "Membre depuis novembre 2024" ou null
     */
    const memberSince = computed(() => {
        if (!user.value?.createdOn) return null

        try {
            const date = new Date(user.value.createdOn)
            if (isNaN(date.getTime())) return null

            return `Membre depuis ${date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long'
            })}`
        } catch {
            return null
        }
    })

    /**
     * Dernière connexion formatée
     */
    const lastLoginFormatted = computed(() => {
        if (!user.value?.lastLogin) return null

        try {
            const date = new Date(user.value.lastLogin)
            if (isNaN(date.getTime())) return null

            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return null
        }
    })

    /**
     * Email vérifié (false par défaut si non défini)
     */
    const isEmailVerified = computed(() => user.value?.emailVerified ?? false)

    /**
     * Vérifie si le profil est "complet" (prénom ET nom renseignés)
     */
    const isProfileComplete = computed(() => {
        if (!user.value) return false
        return !!(user.value.firstName && user.value.lastName)
    })

    return {
        displayName,
        avatarInitials,
        avatarUrl,
        memberSince,
        lastLoginFormatted,
        isEmailVerified,
        isProfileComplete,
    }
}
