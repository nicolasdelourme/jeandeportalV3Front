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
        phoneStatus: 'verified',
        avatarUrl: null,
        birthDate: null,
        addresses: [
            {
                id: 1,
                title: 'M.',
                firstName: 'Jean',
                lastName: 'Dupont',
                recipient: 'Domicile',
                line1: '22 RUE DE MONTREUIL',
                line2: null,
                zipcode: '75011',
                city: 'PARIS',
                country: 'FR',
                isDefaultShipping: true,
                isDefaultBilling: true,
            }
        ],
        optinStatus: 'subscribed',
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

// Stockage des tokens de vérification simulés (email -> token)
const MOCK_VERIFICATION_TOKENS: Map<string, string> = new Map()

// Stockage des codes de réinitialisation de mot de passe (code -> email)
const MOCK_RESET_CODES: Map<string, string> = new Map()

/**
 * Génère un token de vérification simulé
 */
function generateVerificationToken(): string {
    return `verify_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Génère un code de réinitialisation simulé
 */
function generateResetCode(): string {
    return `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Mock Register API
 *
 * Note: L'inscription NE crée plus de session (pas d'auto-login)
 * L'utilisateur doit valider son email avant de pouvoir se connecter
 */
export async function mockRegisterAPI(credentials: RegisterCredentials): Promise<AuthResponse> {
    console.log('📝 [MOCK API] mockRegisterAPI appelé avec:', {
        email: credentials.email,
        birthDate: credentials.birthDate
    })
    await delay(1000) // L'inscription peut prendre un peu plus de temps

    // Vérifier si l'utilisateur existe déjà
    const existingUser = MOCK_USERS.find(u => u.email === credentials.email)
    if (existingUser) {
        console.log('❌ [MOCK API] Email déjà utilisé:', credentials.email)
        return {
            status: 'error',
            message: 'Un compte existe déjà avec cet email'
        } as AuthErrorResponse
    }

    // Créer le nouvel utilisateur (emailVerified: false)
    const newUser: User & { password: string } = {
        id: MOCK_USERS.length + 1,
        email: credentials.email,
        password: credentials.password,
        emailVerified: false, // L'utilisateur doit valider son email
        title: null,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        phone: null,
        phoneStatus: null,
        avatarUrl: null,
        birthDate: credentials.birthDate || null,
        addresses: [],
        optinStatus: null,
        tag: 'new_user',
        createdOn: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lastLogin: null,
    }

    MOCK_USERS.push(newUser)

    // Générer un token de vérification et le stocker
    const verificationToken = generateVerificationToken()
    MOCK_VERIFICATION_TOKENS.set(credentials.email, verificationToken)

    // Simuler l'envoi d'email (log console)
    console.log('📧 [MOCK API] Email de vérification envoyé à:', credentials.email)
    console.log('🔗 [MOCK API] Lien de vérification: /auth/verify-email?token=' + verificationToken)

    // PAS de création de session (pas d'auto-login)
    // L'utilisateur doit valider son email d'abord

    // Retourner une réponse de succès (sans token utilisable)
    return {
        status: 'success',
        access_token: {
            token: '' // Pas de token car pas d'auto-login
        },
        type: 'Bearer',
        expires_in: 0,
        afterLogin: undefined // Pas de redirection, l'utilisateur doit vérifier son email
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
 *
 * Génère un code de réinitialisation et le stocke
 */
export async function mockForgotPasswordAPI(email: string): Promise<{ success: boolean; message: string }> {
    console.log('🔑 [MOCK API] mockForgotPasswordAPI appelé pour:', email)
    await delay(1000)

    const user = MOCK_USERS.find(u => u.email === email)
    if (!user) {
        // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        console.log('⚠️ [MOCK API] Email non trouvé (mais on retourne succès pour sécurité)')
        return {
            success: true,
            message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
        }
    }

    // Générer un code de réinitialisation et le stocker
    const resetCode = generateResetCode()
    MOCK_RESET_CODES.set(resetCode, email)

    console.log('📧 [MOCK API] Email de réinitialisation envoyé à:', email)
    console.log('🔗 [MOCK API] Lien de réinitialisation: /auth/reset-password?code=' + resetCode)

    return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé à votre adresse.'
    }
}

/**
 * Mock Verify Email API
 *
 * Simule la vérification de l'email via le token reçu par email
 */
export async function mockVerifyEmailAPI(token: string): Promise<{ success: boolean; message: string }> {
    console.log('✅ [MOCK API] mockVerifyEmailAPI appelé avec token:', token)
    await delay(800)

    // Chercher l'email associé au token
    let foundEmail: string | null = null
    for (const [email, storedToken] of MOCK_VERIFICATION_TOKENS.entries()) {
        if (storedToken === token) {
            foundEmail = email
            break
        }
    }

    if (!foundEmail) {
        console.log('❌ [MOCK API] Token de vérification invalide ou expiré')
        return {
            success: false,
            message: 'Le lien de vérification est invalide ou a expiré.'
        }
    }

    // Trouver l'utilisateur et mettre à jour emailVerified
    const user = MOCK_USERS.find(u => u.email === foundEmail)
    if (user) {
        user.emailVerified = true
        // Supprimer le token utilisé
        MOCK_VERIFICATION_TOKENS.delete(foundEmail)
        console.log('✅ [MOCK API] Email vérifié pour:', foundEmail)
    }

    return {
        success: true,
        message: 'Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.'
    }
}

/**
 * Mock Resend Verification Email API
 *
 * Simule le renvoi de l'email de vérification
 */
export async function mockResendVerificationEmailAPI(email: string): Promise<{ success: boolean; message: string }> {
    console.log('📧 [MOCK API] mockResendVerificationEmailAPI appelé pour:', email)
    await delay(1000)

    // Chercher l'utilisateur
    const user = MOCK_USERS.find(u => u.email === email)

    if (!user) {
        // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        console.log('⚠️ [MOCK API] Email non trouvé (mais on retourne succès pour sécurité)')
        return {
            success: true,
            message: 'Si un compte existe avec cet email, un nouveau lien de vérification a été envoyé.'
        }
    }

    if (user.emailVerified) {
        console.log('⚠️ [MOCK API] Email déjà vérifié')
        return {
            success: false,
            message: 'Cet email est déjà vérifié. Vous pouvez vous connecter.'
        }
    }

    // Générer un nouveau token
    const newToken = generateVerificationToken()
    MOCK_VERIFICATION_TOKENS.set(email, newToken)

    console.log('📧 [MOCK API] Nouvel email de vérification envoyé à:', email)
    console.log('🔗 [MOCK API] Nouveau lien: /auth/verify-email?token=' + newToken)

    return {
        success: true,
        message: 'Un nouveau lien de vérification a été envoyé à votre adresse email.'
    }
}

/**
 * Mock Verify Reset Code API
 *
 * Vérifie la validité du code de réinitialisation
 */
export async function mockVerifyResetCodeAPI(code: string): Promise<{ success: boolean; message: string }> {
    console.log('🔑 [MOCK API] mockVerifyResetCodeAPI appelé avec code:', code)
    await delay(800)

    // Vérifier si le code existe
    const email = MOCK_RESET_CODES.get(code)

    if (!email) {
        console.log('❌ [MOCK API] Code de réinitialisation invalide ou expiré')
        return {
            success: false,
            message: 'Le lien de réinitialisation est invalide ou a expiré.'
        }
    }

    console.log('✅ [MOCK API] Code valide pour:', email)
    return {
        success: true,
        message: 'Code valide.'
    }
}

/**
 * Mock Complete Password Reset API
 *
 * Finalise la réinitialisation du mot de passe
 */
export async function mockCompletePasswordResetAPI(
    code: string,
    password: string,
    passwordConfirm: string
): Promise<{ success: boolean; message: string }> {
    console.log('🔑 [MOCK API] mockCompletePasswordResetAPI appelé')
    await delay(1000)

    // Vérifier que les mots de passe correspondent
    if (password !== passwordConfirm) {
        console.log('❌ [MOCK API] Les mots de passe ne correspondent pas')
        return {
            success: false,
            message: 'Les mots de passe ne correspondent pas.'
        }
    }

    // Vérifier si le code existe
    const email = MOCK_RESET_CODES.get(code)

    if (!email) {
        console.log('❌ [MOCK API] Code de réinitialisation invalide ou expiré')
        return {
            success: false,
            message: 'Le lien de réinitialisation est invalide ou a expiré.'
        }
    }

    // Trouver l'utilisateur et mettre à jour son mot de passe
    const user = MOCK_USERS.find(u => u.email === email)
    if (user) {
        user.password = password
        // Supprimer le code utilisé
        MOCK_RESET_CODES.delete(code)
        console.log('✅ [MOCK API] Mot de passe réinitialisé pour:', email)
    }

    return {
        success: true,
        message: 'Votre mot de passe a été réinitialisé avec succès.'
    }
}
