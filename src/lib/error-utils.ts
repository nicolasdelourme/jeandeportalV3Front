/**
 * Utilitaires pour la gestion typée des erreurs
 * Remplace les patterns `catch (error: any)` par une approche type-safe
 */

/**
 * Extrait le message d'une erreur de type unknown
 * @param error - L'erreur capturée (type unknown)
 * @returns Le message d'erreur sous forme de string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Erreur inconnue'
}

/**
 * Vérifie si une erreur est une instance d'Error
 * Type guard pour un usage conditionnel
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Extrait le code d'erreur Axios si disponible
 * @param error - L'erreur capturée
 * @returns Le code HTTP ou undefined
 */
export function getHttpErrorCode(error: unknown): number | undefined {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response
  ) {
    return error.response.status as number
  }
  return undefined
}

/**
 * Extrait les données d'erreur d'une réponse Axios
 * @param error - L'erreur capturée
 * @returns Les données de la réponse ou undefined
 */
export function getHttpErrorData<T = unknown>(error: unknown): T | undefined {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    return error.response.data as T
  }
  return undefined
}
