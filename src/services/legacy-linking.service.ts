/**
 * Service de rattachement de compte legacy "Les Emmerdeurs"
 * Centralise les opérations de rattachement des anciens abonnés
 */

import { apiClient } from '@/api/client'
import type {
    LegacyLinkingCredentials,
    LegacyLinkingResult,
    LegacyLinkingStatus,
    APILegacyLinkResponse,
    APILegacyStatusResponse
} from '@/types/legacy-linking.types'
import { LegacyLinkingError } from '@/types/legacy-linking.types'
import { logger } from '@/utils/logger'
import { getHttpErrorCode, getHttpErrorData } from '@/lib/error-utils'

// MOCK MODE : Contrôlé par VITE_API_MODE
const USE_MOCK = import.meta.env.VITE_API_MODE === 'mock'

// Sécurité : Empêcher le build si mock activé en production
if (import.meta.env.PROD && USE_MOCK) {
    throw new Error('🚨 SECURITY: Mock legacy linking must be disabled in production builds!')
}

// Import conditionnel du mock
import {
    mockLinkLegacyAccountAPI,
    mockGetLegacyStatusAPI
} from '@/api/legacy-linking.mock'

/**
 * Service de rattachement de compte legacy
 */
export class LegacyLinkingService {
    /**
     * Rattacher un compte legacy au compte Infocash courant
     * POST /legacy/link
     *
     * @param credentials - Numéro d'abonné et clé secrète
     * @returns Résultat du rattachement avec les thèmes accordés
     */
    async linkAccount(credentials: LegacyLinkingCredentials): Promise<LegacyLinkingResult> {
        try {
            let result: LegacyLinkingResult

            if (USE_MOCK) {
                result = await mockLinkLegacyAccountAPI(credentials)
            } else {
                const response = await apiClient.post<APILegacyLinkResponse>('/legacy/link', {
                    subscriberId: credentials.subscriberId,
                    secretKey: credentials.secretKey
                })

                // Transformer la réponse API en format interne
                result = this.transformLinkResponse(response)
            }

            // Vérifier si l'opération a échoué
            if (result.status === 'error') {
                throw new LegacyLinkingError(
                    result.message || 'Le rattachement a échoué.',
                    this.getErrorCode(result.message || '')
                )
            }

            return result
        } catch (error) {
            // Si c'est déjà une LegacyLinkingError, la re-lancer
            if (error instanceof LegacyLinkingError) {
                throw error
            }

            // Gérer les erreurs HTTP/réseau
            logger.error('Erreur lors du rattachement du compte legacy:', error)

            const httpData = getHttpErrorData<{ message?: string }>(error)
            const errorMessage = httpData?.message || 'Impossible de rattacher le compte. Veuillez réessayer.'

            throw new LegacyLinkingError(
                errorMessage,
                'NETWORK_ERROR',
                getHttpErrorCode(error)
            )
        }
    }

    /**
     * Récupérer le statut de rattachement pour l'utilisateur connecté
     * GET /legacy/status
     *
     * @returns Statut du rattachement (lié ou non)
     */
    async getLinkingStatus(): Promise<LegacyLinkingStatus> {
        try {
            if (USE_MOCK) {
                return await mockGetLegacyStatusAPI()
            } else {
                const response = await apiClient.get<APILegacyStatusResponse>('/legacy/status')
                return this.transformStatusResponse(response)
            }
        } catch (error) {
            logger.error('Erreur lors de la récupération du statut de rattachement:', error)

            // En cas d'erreur, retourner un statut "non lié" par défaut
            return { isLinked: false }
        }
    }

    /**
     * Transforme la réponse API de rattachement en format interne
     */
    private transformLinkResponse(response: APILegacyLinkResponse): LegacyLinkingResult {
        if (response.status === 'error') {
            return {
                status: 'error',
                message: response.message
            }
        }

        return {
            status: 'success',
            message: response.message,
            linkedThemes: response.data?.linkedThemes?.map(theme => ({
                id: theme.id,
                name: theme.name,
                slug: theme.slug as 'metaux' | 'portefeuille' | 'liberte' | 'bonus',
                expiresAt: theme.expiresAt
            })),
            starsRecovered: response.data?.starsRecovered
        }
    }

    /**
     * Transforme la réponse API de statut en format interne
     */
    private transformStatusResponse(response: APILegacyStatusResponse): LegacyLinkingStatus {
        if (response.status === 'error' || !response.data) {
            return { isLinked: false }
        }

        return {
            isLinked: response.data.isLinked,
            linkedAt: response.data.linkedAt,
            subscriberId: response.data.subscriberId,
            linkedThemes: response.data.linkedThemes?.map(theme => ({
                id: theme.id,
                name: theme.name,
                slug: theme.slug as 'metaux' | 'portefeuille' | 'liberte' | 'bonus',
                expiresAt: theme.expiresAt
            }))
        }
    }

    /**
     * Détermine le code d'erreur selon le message
     */
    private getErrorCode(message: string): 'INVALID_CREDENTIALS' | 'ALREADY_LINKED' | 'EXPIRED_ACCOUNT' | 'UNKNOWN_ERROR' {
        const lowerMessage = message.toLowerCase()

        if (lowerMessage.includes('invalide') || lowerMessage.includes('introuvable')) {
            return 'INVALID_CREDENTIALS'
        }
        if (lowerMessage.includes('déjà rattaché') || lowerMessage.includes('already linked')) {
            return 'ALREADY_LINKED'
        }
        if (lowerMessage.includes('expiré') || lowerMessage.includes('expired')) {
            return 'EXPIRED_ACCOUNT'
        }

        return 'UNKNOWN_ERROR'
    }

    /**
     * Vérifie si on est en mode mock
     */
    isUsingMock(): boolean {
        return USE_MOCK
    }
}

// Export d'une instance unique (singleton)
export const legacyLinkingService = new LegacyLinkingService()

// Export de la classe pour des cas d'usage avancés
export default LegacyLinkingService
