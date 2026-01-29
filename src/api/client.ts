import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { clearAuthData } from '@/utils/auth'
import { logger } from '@/utils/logger'

/**
 * Client API centralisé basé sur Axios
 * Configuré avec la base URL et les intercepteurs d'authentification
 *
 * ⚠️ SÉCURITÉ: Utilise des cookies HttpOnly au lieu de localStorage
 * Les tokens JWT sont automatiquement envoyés via cookies (withCredentials: true)
 */
class ApiClient {
    private axiosInstance: AxiosInstance

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
            timeout: 5000,
            // ✅ withCredentials activé en mode "real" ou en production
            // En dev mock: false (pas de cookies nécessaires)
            // En dev real: true (envoie les cookies pour tester le vrai backend)
            // En prod: true (envoie les cookies HttpOnly)
            withCredentials: import.meta.env.VITE_API_MODE === 'real' || import.meta.env.PROD,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",  // ✅ Protection CSRF
            },
        })

        this.setupInterceptors()
    }

    /**
     * Configure les intercepteurs pour gérer les erreurs d'authentification
     *
     * Note: Pas besoin d'ajouter le token manuellement - les cookies HttpOnly
     * sont automatiquement envoyés par le navigateur avec chaque requête
     */
    private setupInterceptors(): void {
        // Response interceptor - Gère les erreurs d'authentification
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const requestUrl = error.config?.url || ''

                // Ne pas rediriger pour les endpoints d'auth et les endpoints publics (panier)
                // Le panier fonctionne pour les utilisateurs non connectés (basketCode provisoire)
                const publicEndpoints = [
                    // Auth endpoints
                    '/login', '/register', '/logout', '/me', '/forgot-password',
                    // Cart endpoints (accessibles sans auth - le backend gère les paniers anonymes)
                    '/addReference', '/fetchBasket', '/basketChangeQuantityReference', '/deleteReference',
                    // Shop endpoints
                    '/fetchStore',
                    // Subscription catalog endpoints
                    '/fetchOneClickCatalog',
                    // OneClick basket endpoints (accessibles sans auth pour création de panier)
                    '/fetchOneClickBasket', '/addOneClick', '/deleteOneClick',
                    // Note: /oneClickCheckout et /oneClickInitPayment nécessitent auth
                ]
                const isPublicEndpoint = publicEndpoints.some(endpoint => requestUrl.includes(endpoint))

                if (error.response?.status === 401 && !isPublicEndpoint) {
                    // Session expirée ou invalide - nettoyage des données utilisateur
                    clearAuthData()

                    logger.warn('Session expirée (401), redirection vers /auth')

                    // Redirection vers login (sera géré par le router)
                    // Note: Évite d'importer router ici pour éviter les dépendances circulaires
                    if (typeof window !== 'undefined') {
                        const currentPath = window.location.pathname
                        window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}&reason=session_expired`
                    }
                }
                return Promise.reject(error)
            }
        )
    }

    /**
     * Effectue une requête GET
     */
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    /**
     * Effectue une requête POST
     */
    async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    /**
     * Effectue une requête PUT
     */
    async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    /**
     * Effectue une requête PATCH
     */
    async patch<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return response.data;
    }

    /**
     * Effectue une requête DELETE
     */
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    /**
     * Donne accès à l'instance axios pour des cas d'usage avancés
     */
    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}

// Export d'une instance unique (singleton)
export const apiClient = new ApiClient();

// Export de la classe pour des cas d'usage avancés
export default ApiClient;
