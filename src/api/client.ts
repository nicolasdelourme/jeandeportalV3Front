import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

/**
 * Client API centralisé basé sur Axios
 * Configuré avec la base URL et les intercepteurs d'authentification
 */
class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setupInterceptors();
    }

    /**
     * Configure les intercepteurs pour ajouter le token Bearer automatiquement
     */
    private setupInterceptors(): void {
        // Request interceptor - Ajoute le token Bearer si disponible
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("auth_token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - Gère les erreurs d'authentification
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expiré ou invalide
                    localStorage.removeItem("auth_token");
                    // Rediriger vers la page de login si nécessaire
                    // window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
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
