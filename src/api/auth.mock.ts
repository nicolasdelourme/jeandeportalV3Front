/**
 * Mock Backend pour l'authentification
 * À REMPLACER par les vrais appels API quand le backend sera prêt
 *
 * ⚠️ SÉCURITÉ: Simule maintenant le comportement des cookies HttpOnly
 * La "session" est stockée en mémoire pour simuler le cookie côté serveur
 */

import type { LoginCredentials, RegisterCredentials, AuthResponse, AuthSuccessResponse, AuthErrorResponse, User } from '@/types/auth.types'

// Base de données simulée (en mémoire)
const MOCK_USERS: Array<User & { password: string }> = [
    {
        id: 1,
        email: 'test@example.com',
        password: 'Test1234', // En production, JAMAIS stocker les mots de passe en clair !
        emailVerified: true,
        title: 'M.',
        firstName: 'Jean',
        lastName: 'Dupont',
        phone: '0612345678',
        avatarUrl: null,
        birthDate: null,
        addresses: [],
        tag: 'mock_user',
        createdOn: '2024-01-15 10:00:00',
        lastLogin: null,
    }
]

// Simule la session serveur (équivalent du cookie HttpOnly côté serveur)
let MOCK_SESSION: { userId: number; expiresAt: number } | null = null

/**
 * Génère un faux token JWT (juste pour le développement)
 * Note: En production avec cookies HttpOnly, ce token ne serait jamais exposé au client
 */
function generateMockToken(userId: number | string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
        sub: userId,
        iat: Date.now() / 1000,
        exp: (Date.now() / 1000) + 86400
    }))
    const signature = btoa('mock_signature')
    return `${header}.${payload}.${signature}`
}

/**
 * Simule un délai réseau réaliste
 */
function delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Mock Login API
 *
 * Simule le comportement avec cookies HttpOnly:
 * - Crée une session serveur (MOCK_SESSION)
 * - Ne retourne PAS le token dans le body (il serait dans Set-Cookie)
 */
export async function mockLoginAPI(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 [MOCK API] mockLoginAPI appelé avec:', { email: credentials.email })
    await delay() // Simule un délai réseau

    // Chercher l'utilisateur
    const user = MOCK_USERS.find(u => u.email === credentials.email)

    // Vérifier les credentials
    if (!user || user.password !== credentials.password) {
        console.log('❌ [MOCK API] Credentials invalides')
        return {
            status: 'error',
            message: 'Email ou mot de passe incorrect'
        } as AuthErrorResponse
    }

    // Calculer l'expiration : 1 jour ou 14 jours si "rester connecté"
    const expiresIn = credentials.rememberMe ? 86400 * 14 : 86400

    // Créer la session (simule le cookie HttpOnly côté serveur)
    MOCK_SESSION = {
        userId: Number(user.id),
        expiresAt: Date.now() + expiresIn * 1000
    }
    console.log('✅ [MOCK API] Session créée:', MOCK_SESSION)

    // Déterminer la redirection
    const afterLogin = credentials.redirectUrl || '/mon-compte'
    console.log('🔀 [MOCK API] afterLogin:', afterLogin)

    // Note: En production avec cookies HttpOnly, le token ne serait PAS dans le body
    // Il serait dans l'en-tête Set-Cookie. On le garde ici pour compatibilité avec
    // l'interface AuthSuccessResponse, mais il n'est pas utilisé côté client.
    return {
        status: 'success',
        access_token: {
            token: generateMockToken(user.id) // Non utilisé, juste pour compatibilité
        },
        type: 'Bearer',
        expires_in: expiresIn,
        afterLogin
    } as AuthSuccessResponse
}

/**
 * Mock Register API
 *
 * Simule le comportement avec cookies HttpOnly (auto-login après inscription)
 */
export async function mockRegisterAPI(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay(1000) // L'inscription peut prendre un peu plus de temps

    // Vérifier si l'utilisateur existe déjà
    const existingUser = MOCK_USERS.find(u => u.email === credentials.email)
    if (existingUser) {
        return {
            status: 'error',
            message: 'Un compte existe déjà avec cet email'
        } as AuthErrorResponse
    }

    // Créer le nouvel utilisateur
    const newUser: User & { password: string } = {
        id: MOCK_USERS.length + 1,
        email: credentials.email,
        password: credentials.password,
        emailVerified: false,
        title: null,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        phone: null,
        avatarUrl: null,
        birthDate: null,
        addresses: [],
        tag: 'new_user',
        createdOn: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lastLogin: null,
    }

    MOCK_USERS.push(newUser)

    // Créer la session (simule le cookie HttpOnly côté serveur - auto-login)
    const expiresIn = 86400 // 1 jour par défaut
    MOCK_SESSION = {
        userId: Number(newUser.id),
        expiresAt: Date.now() + expiresIn * 1000
    }

    // Retourner une réponse de succès (comme si on était auto-connecté après inscription)
    return {
        status: 'success',
        access_token: {
            token: generateMockToken(newUser.id) // Non utilisé, juste pour compatibilité
        },
        type: 'Bearer',
        expires_in: expiresIn,
        afterLogin: '/' // Redirection vers home après inscription
    } as AuthSuccessResponse
}

/**
 * Mock Get User Profile API
 *
 * Simule le comportement avec cookies HttpOnly:
 * - Lit la session serveur (MOCK_SESSION) au lieu d'un token
 * - Vérifie l'expiration de la session
 */
export async function mockGetUserProfileAPI(): Promise<User | null> {
    console.log('👤 [MOCK API] mockGetUserProfileAPI appelé')
    console.log('📋 [MOCK API] MOCK_SESSION actuelle:', MOCK_SESSION)
    await delay(300)

    // Vérifier si une session existe
    if (!MOCK_SESSION) {
        console.log('❌ [MOCK API] Aucune session trouvée')
        throw new Error('Non authentifié')
    }

    // Vérifier si la session est expirée
    if (Date.now() >= MOCK_SESSION.expiresAt) {
        console.log('❌ [MOCK API] Session expirée')
        MOCK_SESSION = null // Supprimer la session expirée
        throw new Error('Session expirée')
    }

    // Chercher l'utilisateur
    const user = MOCK_USERS.find(u => u.id === MOCK_SESSION!.userId)
    if (!user) {
        console.log('❌ [MOCK API] Utilisateur non trouvé pour userId:', MOCK_SESSION!.userId)
        MOCK_SESSION = null
        throw new Error('Utilisateur non trouvé')
    }

    // Retourner les données sans le mot de passe
    const { password, ...userWithoutPassword } = user
    console.log('✅ [MOCK API] Profil utilisateur retourné:', userWithoutPassword)
    return userWithoutPassword
}

/**
 * Mock Logout API
 *
 * Simule le comportement avec cookies HttpOnly:
 * - Supprime la session serveur (simule Max-Age=0 du cookie)
 */
export async function mockLogoutAPI(): Promise<{ success: boolean }> {
    await delay(200)

    // Supprimer la session (simule la suppression du cookie HttpOnly)
    MOCK_SESSION = null

    return { success: true }
}

/**
 * Mock Forgot Password API
 */
export async function mockForgotPasswordAPI(email: string): Promise<{ success: boolean; message: string }> {
    await delay(1000)

    const user = MOCK_USERS.find(u => u.email === email)
    if (!user) {
        // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        return {
            success: true,
            message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
        }
    }

    return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé à votre adresse.'
    }
}
