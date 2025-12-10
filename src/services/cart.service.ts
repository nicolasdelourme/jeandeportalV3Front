/**
 * Service de gestion du panier
 * Centralise toutes les opérations liées au panier avec le backend
 */

import { apiClient } from '@/api/client'
import type {
    CartAPIResponse,
    CartAPIItem,
    AddToCartRequest,
    FetchCartRequest,
    UpdateQuantityRequest,
    DeleteReferenceRequest,
} from '@/types/cart-api.types'
import type { CartItem, CartReceipt } from '@/types/cart.types'
import { CartError, CART_CONFIG } from '@/types/cart.types'
import { logger } from '@/utils/logger'
import { decodeHtmlEntities } from '@/utils/html.utils'

/**
 * URL de base pour les images du backend
 */
const IMAGE_BASE_URL = 'https://api.jeandeportal.fr'

/**
 * Convertit un prix en centimes vers un prix en euros
 * @param cents - Prix en centimes (ex: 2900)
 * @returns Prix en euros (ex: 29.00)
 */
function centsToEuros(cents: number): number {
    return cents / 100
}

/**
 * Service du panier
 */
class CartService {
    /**
     * Ajouter une référence au panier
     *
     * @param referenceId - ID de la référence à ajouter (reference_array[].id du catalogue)
     * @param quantity - Quantité à ajouter (défaut: 1)
     * @param storeId - ID de la boutique (défaut: 28 pour consultations)
     * @param basketCode - Code du panier (null pour créer un nouveau panier)
     * @returns Panier complet mis à jour
     */
    async addToCart(
        referenceId: number,
        quantity: number = CART_CONFIG.DEFAULT_QUANTITY,
        storeId: number = CART_CONFIG.STORE_ID,
        basketCode: string | null = null
    ): Promise<CartAPIResponse> {
        try {
            logger.info(`🛒 [CART SERVICE] Ajout au panier: referenceId=${referenceId}, quantity=${quantity}, storeId=${storeId}, basketCode=${basketCode ? '***' : 'null'}`)

            // Construire la requête (ne pas envoyer basketCode si null)
            const request: AddToCartRequest = {
                referenceId,
                quantity,
                storeId,
                ...(basketCode && { basketCode }), // N'inclure basketCode que s'il existe
            }

            // DEBUG: Afficher le body exact envoyé
            console.log('🔍 [DEBUG] Request body:', JSON.stringify(request))

            const response = await apiClient.post<CartAPIResponse>(
                '/addReference',
                request
            )

            logger.info('✅ [CART SERVICE] Article ajouté avec succès')
            return response
        } catch (error: any) {
            logger.error('❌ [CART SERVICE] Erreur lors de l\'ajout au panier:', error)
            throw new CartError(
                error.response?.data?.message || 'Impossible d\'ajouter l\'article au panier',
                'API_ERROR'
            )
        }
    }

    /**
     * Récupérer le panier actuel depuis le backend
     *
     * @param basketCode - Code du panier à récupérer
     * @returns Panier complet
     */
    async fetchCart(basketCode: string): Promise<CartAPIResponse> {
        try {
            logger.info(`🛒 [CART SERVICE] Récupération du panier: basketCode=${basketCode ? basketCode.substring(0, 8) + '...' : 'null'}`)

            const request: FetchCartRequest = { basketCode, storeId: CART_CONFIG.STORE_ID }
            console.log('🔍 [DEBUG] fetchBasket request body:', JSON.stringify(request))
            const response = await apiClient.post<CartAPIResponse>('/fetchBasket', request)

            // Debug: afficher la réponse brute
            console.log('🔍 [DEBUG] fetchCart response:', JSON.stringify(response, null, 2))

            // Vérifier si le backend retourne une erreur
            if (response.status === 'error') {
                logger.warn(`⚠️ [CART SERVICE] Panier non trouvé: ${response.message}`)
                // Le panier n'existe plus côté backend - on doit le signaler
                throw new CartError(response.message || 'Panier non trouvé', 'BASKET_NOT_FOUND')
            }

            // Vérifier la structure de la réponse (basket doit être un objet, pas un array)
            if (!response || !response.basket || Array.isArray(response.basket)) {
                logger.error('❌ [CART SERVICE] Réponse fetchBasket invalide:', response)
                throw new CartError('Réponse du serveur invalide', 'API_ERROR')
            }

            logger.info(`✅ [CART SERVICE] Panier récupéré: ${response.basket.count || 0} items`)
            return response
        } catch (error: any) {
            // Si c'est déjà un CartError (ex: BASKET_NOT_FOUND), le re-throw tel quel
            if (error instanceof CartError) {
                throw error
            }

            logger.error('❌ [CART SERVICE] Erreur lors de la récupération du panier:', error)
            // Debug: afficher plus de détails sur l'erreur
            console.log('🔍 [DEBUG] fetchCart error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            })
            throw new CartError(
                error.response?.data?.message || 'Impossible de récupérer le panier',
                'API_ERROR'
            )
        }
    }

    /**
     * Modifier la quantité d'une référence dans le panier
     *
     * @param priceId - ID du prix à modifier
     * @param quantity - Nouvelle quantité (0 = supprimer)
     * @param basketCode - Code du panier
     * @returns Panier complet mis à jour
     */
    async updateQuantity(
        priceId: number,
        quantity: number,
        basketCode: string
    ): Promise<CartAPIResponse> {
        try {
            if (quantity < 0) {
                throw new CartError('La quantité ne peut pas être négative', 'INVALID_QUANTITY')
            }

            logger.info(
                `🛒 [CART SERVICE] Mise à jour quantité: priceId=${priceId}, quantity=${quantity}`
            )

            const request: UpdateQuantityRequest = {
                priceId,
                quantity,
                basketCode,
            }

            const response = await apiClient.post<CartAPIResponse>(
                '/basketChangeQuantityReference',
                request
            )

            if (quantity === 0) {
                logger.info('✅ [CART SERVICE] Article supprimé du panier')
            } else {
                logger.info('✅ [CART SERVICE] Quantité mise à jour')
            }

            return response
        } catch (error: any) {
            if (error instanceof CartError) {
                throw error
            }

            logger.error('❌ [CART SERVICE] Erreur lors de la mise à jour de quantité:', error)
            throw new CartError(
                error.response?.data?.message || 'Impossible de modifier la quantité',
                'API_ERROR'
            )
        }
    }

    /**
     * Supprimer une référence du panier
     * Utilise POST /deleteReference
     *
     * @param referenceId - ID de la référence à supprimer (itemId dans le panier)
     * @param quantity - Quantité à supprimer (défaut: 1)
     * @param basketCode - Code du panier
     * @returns Panier complet mis à jour
     */
    async deleteReference(
        referenceId: number,
        quantity: number = 1,
        basketCode: string
    ): Promise<CartAPIResponse> {
        try {
            logger.info(`🛒 [CART SERVICE] Suppression du panier: referenceId=${referenceId}, quantity=${quantity}`)

            const request: DeleteReferenceRequest = {
                referenceId,
                quantity,
                storeId: CART_CONFIG.STORE_ID,
                basketCode,
            }

            console.log('🔍 [DEBUG] deleteReference request body:', JSON.stringify(request))

            const response = await apiClient.post<CartAPIResponse>('/deleteReference', request)

            console.log('🔍 [DEBUG] deleteReference response:', JSON.stringify(response, null, 2))

            // Vérifier si le backend retourne une erreur
            if (response.status === 'error') {
                logger.error('❌ [CART SERVICE] Erreur deleteReference:', response.message)
                throw new CartError(response.message || 'Erreur lors de la suppression', 'API_ERROR')
            }

            logger.info('✅ [CART SERVICE] Article supprimé du panier')
            return response
        } catch (error: any) {
            if (error instanceof CartError) {
                throw error
            }

            logger.error('❌ [CART SERVICE] Erreur lors de la suppression:', error)
            throw new CartError(
                error.response?.data?.message || 'Impossible de supprimer l\'article',
                'API_ERROR'
            )
        }
    }

    /**
     * @deprecated Utiliser deleteReference à la place
     */
    async removeFromCart(priceId: number, basketCode: string): Promise<CartAPIResponse> {
        logger.info(`🛒 [CART SERVICE] Suppression du panier (legacy): priceId=${priceId}`)
        return this.updateQuantity(priceId, 0, basketCode)
    }

    /**
     * Vider complètement le panier
     * Utilise POST /deleteReference pour chaque item
     *
     * @param currentItems - Liste des items actuels pour supprimer un par un
     * @param basketCode - Code du panier
     * @returns Panier vide
     */
    async clearCart(currentItems: CartItem[], basketCode: string): Promise<CartAPIResponse> {
        try {
            logger.info('🛒 [CART SERVICE] Vidage du panier')

            // Supprimer tous les items un par un via deleteReference
            let response: CartAPIResponse | null = null
            for (const item of currentItems) {
                response = await this.deleteReference(item.itemId, item.quantity, basketCode)
            }

            // Retourner la dernière réponse (panier vide)
            if (!response) {
                throw new CartError('Panier déjà vide', 'API_ERROR')
            }

            logger.info('✅ [CART SERVICE] Panier vidé')
            return response
        } catch (error: any) {
            if (error instanceof CartError) {
                throw error
            }
            logger.error('❌ [CART SERVICE] Erreur lors du vidage du panier:', error)
            throw new CartError(
                'Impossible de vider le panier',
                'API_ERROR'
            )
        }
    }

    /**
     * Mapper un item backend vers un item frontend
     *
     * @param apiItem - Item depuis l'API
     * @returns Item formaté pour le frontend
     */
    mapAPIItemToCartItem(apiItem: CartAPIItem): CartItem {
        return {
            // Identifiants backend
            itemId: apiItem.itemId,
            priceId: apiItem.priceId,
            storeId: apiItem.storeId,

            // Données produit
            id: apiItem.priceId, // Compatibilité
            name: decodeHtmlEntities(apiItem.name), // Décoder les entités HTML (&nbsp; → espace)

            // Quantité
            quantity: apiItem.quantity,
            couponId: apiItem.couponId,

            // Tarification (conversion centimes → euros)
            price: centsToEuros(apiItem.price),
            priceHT: centsToEuros(apiItem.HTPrice),
            discountPrice: centsToEuros(apiItem.discountPrice),
            discountPriceHT: centsToEuros(apiItem.HTDiscount),
            vatRate: apiItem.vat,
            currency: apiItem.currency,

            // Médias (ajout URL de base si chemin relatif)
            images: apiItem.image_array?.map(img => {
                // Si le path est déjà une URL complète, le garder tel quel
                if (img.path.startsWith('http')) {
                    return img.path
                }
                // Sinon, ajouter l'URL de base
                return `${IMAGE_BASE_URL}${img.path.startsWith('/') ? '' : '/'}${img.path}`
            }) || [],

            // Note: slug, physical, immaterial sont frontend-only et ne viennent pas du backend
            // Ils seront ajoutés par le store si nécessaire
        }
    }

    /**
     * Mapper le receipt backend vers le format frontend
     *
     * @param apiResponse - Réponse complète de l'API
     * @returns Receipt formaté
     */
    mapAPIResponseToReceipt(apiResponse: CartAPIResponse): CartReceipt {
        const basket = apiResponse.basket
        return {
            referenceNumber: basket.referenceNumber,
            // Conversion centimes → euros pour les totaux
            tax: centsToEuros(basket.tax),
            total: centsToEuros(basket.total),
            discountTotal: centsToEuros(basket.discountTotal),
        }
    }

    /**
     * Mapper une réponse API complète vers items + receipt
     *
     * @param apiResponse - Réponse complète de l'API
     * @returns Objet avec items et receipt
     */
    mapAPIResponse(apiResponse: CartAPIResponse): {
        items: CartItem[]
        receipt: CartReceipt
        basketCode: string
    } {
        // Vérification défensive de la réponse
        if (!apiResponse) {
            logger.error('❌ [CART SERVICE] Réponse API vide')
            throw new CartError('Réponse du serveur invalide', 'API_ERROR')
        }

        if (!apiResponse.basket) {
            logger.error('❌ [CART SERVICE] Réponse API sans basket:', apiResponse)
            throw new CartError('Panier non trouvé dans la réponse', 'API_ERROR')
        }

        const basket = apiResponse.basket

        // Si referenceList est undefined ou null, utiliser un tableau vide
        const referenceList = basket.referenceList || []

        logger.info(`🛒 [CART SERVICE] Mapping réponse: ${referenceList.length} items`)

        return {
            items: referenceList.map(item => this.mapAPIItemToCartItem(item)),
            receipt: this.mapAPIResponseToReceipt(apiResponse),
            basketCode: basket.basketCode,
        }
    }
}

// Export d'une instance unique (singleton)
export const cartService = new CartService()

// Export de la classe pour des cas d'usage avancés
export default CartService
