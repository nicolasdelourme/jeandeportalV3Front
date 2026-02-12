/**
 * Mock API pour le rattachement de compte legacy "Les Emmerdeurs"
 *
 * Simule les endpoints de rattachement en développement
 */

import type {
    LegacyLinkingCredentials,
    LegacyLinkingResult,
    LegacyLinkingStatus
} from '@/types/legacy-linking.types'

/**
 * Délai simulé pour les requêtes (ms)
 */
const MOCK_DELAY = 800

/**
 * Credentials valides pour les tests
 * Format code abonné : 2 lettres + 6 chiffres (ex: AB123456)
 * Format token : 5 caractères alphanumériques (ex: A1B2C)
 */
const VALID_CREDENTIALS = {
    subscriberId: 'AB123456',
    secretKey: 'A1B2C'
}

/**
 * Credentials pour tester un compte déjà rattaché
 */
const ALREADY_LINKED_CREDENTIALS = {
    subscriberId: 'XY999999',
    secretKey: 'Z9Z9Z'
}

/**
 * Simule une requête async avec délai
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock: Rattacher un compte legacy
 * POST /legacy/link
 */
export async function mockLinkLegacyAccountAPI(
    credentials: LegacyLinkingCredentials
): Promise<LegacyLinkingResult> {
    await delay(MOCK_DELAY)

    // Simuler différents scénarios selon les credentials
    const { subscriberId, secretKey } = credentials

    // Scénario: Credentials invalides
    if (subscriberId !== VALID_CREDENTIALS.subscriberId && subscriberId !== ALREADY_LINKED_CREDENTIALS.subscriberId) {
        return {
            status: 'error',
            message: 'Numéro d\'abonné ou clé secrète invalide. Vérifiez vos informations.'
        }
    }

    // Scénario: Compte déjà rattaché
    if (subscriberId === ALREADY_LINKED_CREDENTIALS.subscriberId) {
        return {
            status: 'error',
            message: 'Ce compte a déjà été rattaché à un autre utilisateur Infocash.'
        }
    }

    // Scénario: Clé secrète incorrecte
    if (secretKey !== VALID_CREDENTIALS.secretKey) {
        return {
            status: 'error',
            message: 'Numéro d\'abonné ou clé secrète invalide. Vérifiez vos informations.'
        }
    }

    // Scénario: Succès
    return {
        status: 'success',
        message: 'Votre compte a été rattaché avec succès !',
        linkedThemes: [
            {
                id: '1',
                name: 'Métaux précieux',
                slug: 'metaux',
                expiresAt: '2025-12-31'
            },
            {
                id: '2',
                name: 'Portefeuille permanent',
                slug: 'portefeuille',
                expiresAt: '2025-12-31'
            }
        ],
        starsRecovered: 15
    }
}

/**
 * Mock: Récupérer le statut de rattachement
 * GET /legacy/status
 */
export async function mockGetLegacyStatusAPI(): Promise<LegacyLinkingStatus> {
    await delay(MOCK_DELAY / 2)

    // Par défaut, simuler un utilisateur non rattaché
    // Pour tester un utilisateur rattaché, modifier cette valeur
    const IS_LINKED = false

    if (IS_LINKED) {
        return {
            isLinked: true,
            linkedAt: '2024-06-15T10:30:00Z',
            subscriberId: 'AB***456',
            linkedThemes: [
                {
                    id: '1',
                    name: 'Métaux précieux',
                    slug: 'metaux',
                    expiresAt: '2025-12-31'
                }
            ]
        }
    }

    return {
        isLinked: false
    }
}
