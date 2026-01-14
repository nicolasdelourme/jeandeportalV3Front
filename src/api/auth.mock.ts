/**
 * Mock Backend pour l'authentification
 * À REMPLACER par les vrais appels API quand le backend sera prêt
 *
 * ⚠️ SÉCURITÉ: Simule maintenant le comportement des cookies HttpOnly
 * La "session" est stockée en mémoire pour simuler le cookie côté serveur
 */

import type { LoginCredentials, RegisterCredentials, AuthResponse, AuthSuccessResponse, AuthErrorResponse, User, UpdateProfileDto } from '@/types/auth.types'

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
        pseudo: 'JeanD',
        birthDate: '1990-05-15',
        avatarUrl: null,
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
        phone: credentials.phone || null,
        phoneStatus: null,
        pseudo: null, // Sera généré par le backend si null
        birthDate: credentials.birthDate || null,
        avatarUrl: null,
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
    console.log('🔗 [MOCK API] Lien de vérification: /register/verif/' + verificationToken)

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
    console.log('🔗 [MOCK API] Lien de réinitialisation: /auth/lostPassword/' + resetCode)

    return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé à votre adresse.'
    }
}

/**
 * Mock Verify Email API
 * POST /register/verif-mail avec { hash: token }
 *
 * Simule la vérification de l'email via le token reçu par email
 */
export async function mockVerifyEmailAPI(token: string): Promise<{ status: 'success' | 'error'; next?: string; message?: string }> {
    console.log('✅ [MOCK API] mockVerifyEmailAPI appelé avec hash:', token)
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
            status: 'error',
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
        status: 'success',
        next: '/login'
    }
}

/**
 * Mock Verify Reset Code API
 * POST /forgot-password/verif avec { hash }
 *
 * Vérifie la validité du code de réinitialisation
 */
export async function mockVerifyResetCodeAPI(hash: string): Promise<{ status: 'success' | 'error'; message?: string }> {
    console.log('🔑 [MOCK API] mockVerifyResetCodeAPI appelé avec hash:', hash)
    await delay(800)

    // Vérifier si le code existe
    const email = MOCK_RESET_CODES.get(hash)

    if (!email) {
        console.log('❌ [MOCK API] Code de réinitialisation invalide ou expiré')
        return {
            status: 'error',
            message: 'Le lien de réinitialisation est invalide ou a expiré.'
        }
    }

    console.log('✅ [MOCK API] Code valide pour:', email)
    return {
        status: 'success'
    }
}

/**
 * Mock Complete Password Reset API
 * POST /forgot-password/complete avec { hash, password, passwordConfirm }
 *
 * Finalise la réinitialisation du mot de passe
 */
export async function mockCompletePasswordResetAPI(
    hash: string,
    password: string,
    passwordConfirm: string
): Promise<{ status: 'success' | 'error'; next?: string; message?: string }> {
    console.log('🔑 [MOCK API] mockCompletePasswordResetAPI appelé')
    await delay(1000)

    // Vérifier que les mots de passe correspondent
    if (password !== passwordConfirm) {
        console.log('❌ [MOCK API] Les mots de passe ne correspondent pas')
        return {
            status: 'error',
            message: 'Les mots de passe ne correspondent pas.'
        }
    }

    // Vérifier si le code existe
    const email = MOCK_RESET_CODES.get(hash)

    if (!email) {
        console.log('❌ [MOCK API] Code de réinitialisation invalide ou expiré')
        return {
            status: 'error',
            message: 'Le lien de réinitialisation est invalide ou a expiré.'
        }
    }

    // Trouver l'utilisateur et mettre à jour son mot de passe
    const user = MOCK_USERS.find(u => u.email === email)
    if (user) {
        user.password = password
        // Supprimer le code utilisé
        MOCK_RESET_CODES.delete(hash)
        console.log('✅ [MOCK API] Mot de passe réinitialisé pour:', email)
    }

    return {
        status: 'success',
        next: '/login'
    }
}

// Stockage des codes de modification d'email (code -> { oldEmail, newEmail })
const MOCK_EMAIL_CHANGE_CODES: Map<string, { oldEmail: string; newEmail: string }> = new Map()

/**
 * Génère un code de modification d'email simulé
 */
function generateEmailChangeCode(): string {
    return `email_change_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Mock Request Email Change API
 * POST /accountKey/modification avec { email }
 *
 * Simule la demande de changement d'email
 * L'utilisateur doit être connecté
 */
export async function mockRequestEmailChangeAPI(newEmail: string): Promise<{ status: 'success' | 'error'; message?: string }> {
    console.log('📧 [MOCK API] mockRequestEmailChangeAPI appelé avec newEmail:', newEmail)
    await delay(800)

    // Vérifier que l'utilisateur est connecté
    if (!MOCK_SESSION) {
        console.log('❌ [MOCK API] Utilisateur non connecté')
        return {
            status: 'error',
            message: 'Vous devez être connecté pour modifier votre email.'
        }
    }

    // Récupérer l'utilisateur actuel
    const user = MOCK_USERS.find(u => u.id === MOCK_SESSION!.userId)
    if (!user) {
        return {
            status: 'error',
            message: 'Utilisateur non trouvé.'
        }
    }

    // Vérifier que le nouvel email n'est pas déjà utilisé
    const existingUser = MOCK_USERS.find(u => u.email === newEmail)
    if (existingUser) {
        console.log('❌ [MOCK API] Email déjà utilisé:', newEmail)
        return {
            status: 'error',
            message: 'Cet email est déjà utilisé par un autre compte.'
        }
    }

    // Générer un code de modification et le stocker
    const changeCode = generateEmailChangeCode()
    MOCK_EMAIL_CHANGE_CODES.set(changeCode, {
        oldEmail: user.email,
        newEmail: newEmail
    })

    console.log('📧 [MOCK API] Email de validation envoyé à:', user.email)
    console.log('🔗 [MOCK API] Lien de validation: /changement/finalisation/' + changeCode)

    return {
        status: 'success'
    }
}

/**
 * Mock Validate Email Change API
 * POST /accountKey/validation avec { modificationCode }
 *
 * Valide la modification d'email via le code reçu
 */
export async function mockValidateEmailChangeAPI(modificationCode: string): Promise<{ status: 'success' | 'error'; message?: string }> {
    console.log('✅ [MOCK API] mockValidateEmailChangeAPI appelé avec code:', modificationCode)
    await delay(800)

    // Vérifier si le code existe
    const changeData = MOCK_EMAIL_CHANGE_CODES.get(modificationCode)

    if (!changeData) {
        console.log('❌ [MOCK API] Code de modification d\'email invalide ou expiré')
        return {
            status: 'error',
            message: 'Le lien de validation est invalide ou a expiré.'
        }
    }

    // Trouver l'utilisateur et mettre à jour son email
    const user = MOCK_USERS.find(u => u.email === changeData.oldEmail)
    if (user) {
        user.email = changeData.newEmail
        // Supprimer le code utilisé
        MOCK_EMAIL_CHANGE_CODES.delete(modificationCode)
        console.log('✅ [MOCK API] Email modifié de', changeData.oldEmail, 'vers', changeData.newEmail)
    }

    return {
        status: 'success'
    }
}

/**
 * Mock Update Profile API
 * POST /updateMe
 *
 * Met à jour les informations du profil de l'utilisateur connecté
 */
export async function mockUpdateProfileAPI(data: UpdateProfileDto): Promise<User> {
    console.log('👤 [MOCK API] mockUpdateProfileAPI appelé avec:', data)
    await delay(800)

    // Vérifier que l'utilisateur est connecté
    if (!MOCK_SESSION) {
        console.log('❌ [MOCK API] Utilisateur non connecté')
        throw new Error('Vous devez être connecté pour modifier votre profil.')
    }

    // Récupérer l'utilisateur actuel
    const user = MOCK_USERS.find(u => u.id === MOCK_SESSION!.userId)
    if (!user) {
        throw new Error('Utilisateur non trouvé.')
    }

    // Mettre à jour les champs fournis (mapping API → User)
    if (data.firstname !== undefined) user.firstName = data.firstname
    if (data.lastname !== undefined) user.lastName = data.lastname
    if (data.phone !== undefined) user.phone = data.phone
    if (data.pseudo !== undefined) user.pseudo = data.pseudo
    if (data.birthdate !== undefined) user.birthDate = data.birthdate

    console.log('✅ [MOCK API] Profil mis à jour:', {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        pseudo: user.pseudo,
        birthDate: user.birthDate
    })

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
}
