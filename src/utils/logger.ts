/**
 * Logging utility - logs seulement en développement
 * En production, les erreurs devraient être envoyées à un service de monitoring (Sentry, etc.)
 */

export const logger = {
    /**
     * Log une erreur - uniquement en développement
     * TODO: Envoyer à un service de tracking d'erreurs en production
     */
    error: (...args: any[]) => {
        if (import.meta.env.DEV) {
            console.error(...args)
        } else {
            // TODO: Envoyer à Sentry/service de monitoring
            // Sentry.captureException(args[0])
        }
    },

    /**
     * Log un warning - uniquement en développement
     */
    warn: (...args: any[]) => {
        if (import.meta.env.DEV) {
            console.warn(...args)
        }
    },

    /**
     * Log une info - uniquement en développement
     */
    info: (...args: any[]) => {
        if (import.meta.env.DEV) {
            console.log(...args)
        }
    },

    /**
     * Log debug - uniquement en développement
     */
    debug: (...args: any[]) => {
        if (import.meta.env.DEV) {
            console.debug(...args)
        }
    }
}
