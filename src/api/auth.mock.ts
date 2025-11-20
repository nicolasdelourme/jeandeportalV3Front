/**
 * Mock Backend pour l'authentification
 * À REMPLACER par les vrais appels API quand le backend sera prêt
 */

import type { LoginCredentials, RegisterCredentials, AuthResponse, AuthSuccessResponse, AuthErrorResponse, User } from '@/types/auth.types'

// Base de données simulée (en mémoire)
const MOCK_USERS: Array<User & { password: string }> = [
    {
        id: 1,
        email: 'test@example.com',
        password: 'Test1234', // En production, JAMAIS stocker les mots de passe en clair !
        firstName: 'Jean',
        lastName: 'Dupont'
    }
]

/**
 * Génère un faux token JWT (juste pour le développement)
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
 */
export async function mockLoginAPI(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay() // Simule un délai réseau

    // Chercher l'utilisateur
    const user = MOCK_USERS.find(u => u.email === credentials.email)

    // Vérifier les credentials
    if (!user || user.password !== credentials.password) {
        return {
            status: 'error',
            message: 'Email ou mot de passe incorrect'
        } as AuthErrorResponse
    }

    // Calculer l'expiration : 1 jour ou 14 jours si "rester connecté"
    const expiresIn = credentials.rememberMe ? 86400 * 14 : 86400

    // Déterminer la redirection
    const afterLogin = credentials.redirectUrl || '/mon-compte'

    return {
        status: 'success',
        access_token: {
            token: generateMockToken(user.id)
        },
        type: 'Bearer',
        expires_in: expiresIn,
        afterLogin
    } as AuthSuccessResponse
}

/**
 * Mock Register API
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
        firstName: credentials.firstName,
        lastName: credentials.lastName
    }

    MOCK_USERS.push(newUser)

    // Retourner une réponse de succès (comme si on était auto-connecté après inscription)
    return {
        status: 'success',
        access_token: {
            token: generateMockToken(newUser.id)
        },
        type: 'Bearer',
        expires_in: 86400, // 1 jour par défaut
        afterLogin: '/' // Redirection vers home après inscription
    } as AuthSuccessResponse
}

/**
 * Mock Get User Profile API
 * Permet de récupérer les infos de l'utilisateur à partir du token
 */
export async function mockGetUserProfileAPI(token: string): Promise<User | null> {
    await delay(300)

    try {
        // Parser le faux JWT pour récupérer l'ID
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const payload = JSON.parse(atob(parts[1]))
        const userId = payload.sub

        // Chercher l'utilisateur
        const user = MOCK_USERS.find(u => u.id === userId)
        if (!user) return null

        // Retourner les données sans le mot de passe
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    } catch (error) {
        console.error('Erreur lors du parsing du token:', error)
        return null
    }
}

/**
 * Mock Logout API
 * En production, le backend pourrait invalider le token côté serveur
 */
export async function mockLogoutAPI(): Promise<{ success: boolean }> {
    await delay(200)
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
