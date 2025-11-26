/**
 * Service de gestion du panier
 * Centralise toutes les opérations liées au panier avec le backend
 */

import { apiClient } from '@/api/client'
import type {
    CartAPIResponse,
    CartAPIItem,
    AddToCartRequest,
    UpdateQuantityRequest,
} from '@/types/cart-api.types'
import type { CartItem, CartReceipt } from '@/types/cart.types'
import { CartError, CART_CONFIG } from '@/types/cart.types'
import { logger } from '@/utils/logger'

/**
 * Service du panier
 */
class CartService {
    /**
     * Ajouter une référence au panier
     *
     * @param referenceId - ID de la référence à ajouter
     * @param quantity - Quantité à ajouter (défaut: 1)
     * @param storeId - ID de la boutique (défaut: 28 pour consultations)
     * @returns Panier complet mis à jour
     */
    async addToCart(
        referenceId: number,
        quantity: number = CART_CONFIG.DEFAULT_QUANTITY,
        storeId: number = CART_CONFIG.STORE_ID
    ): Promise<CartAPIResponse> {
        try {
            logger.info(`🛒 [CART SERVICE] Ajout au panier: referenceId=${referenceId}, quantity=${quantity}`)

            const request: AddToCartRequest = {
                referenceId,
                quantity,
                storeId,
            }

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
     * @returns Panier complet
     */
    async fetchCart(): Promise<CartAPIResponse> {
        try {
            logger.info('🛒 [CART SERVICE] Récupération du panier')

            const response = await apiClient.get<CartAPIResponse>('/fetchBasket')

            logger.info(`✅ [CART SERVICE] Panier récupéré: ${response.length} items`)
            return response
        } catch (error: any) {
            logger.error('❌ [CART SERVICE] Erreur lors de la récupération du panier:', error)
            throw new CartError(
                error.response?.data?.message || 'Impossible de récupérer le panier',
                'API_ERROR'
            )
        }
    }

    /**
     * Modifier la quantité d'une référence dans le panier
     *
     * @param referenceId - ID de la référence à modifier
     * @param quantity - Nouvelle quantité (0 = supprimer)
     * @returns Panier complet mis à jour
     */
    async updateQuantity(
        referenceId: number,
        quantity: number
    ): Promise<CartAPIResponse> {
        try {
            if (quantity < 0) {
                throw new CartError('La quantité ne peut pas être négative', 'INVALID_QUANTITY')
            }

            logger.info(
                `🛒 [CART SERVICE] Mise à jour quantité: referenceId=${referenceId}, quantity=${quantity}`
            )

            const request: UpdateQuantityRequest = {
                referenceId,
                quantity,
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
     *
     * @param referenceId - ID de la référence à supprimer
     * @returns Panier complet mis à jour
     */
    async removeFromCart(referenceId: number): Promise<CartAPIResponse> {
        logger.info(`🛒 [CART SERVICE] Suppression du panier: referenceId=${referenceId}`)
        return this.updateQuantity(referenceId, 0)
    }

    /**
     * Vider complètement le panier
     *
     * @param currentItems - Liste des items actuels pour supprimer un par un
     * @returns Panier vide
     */
    async clearCart(currentItems: CartItem[]): Promise<CartAPIResponse> {
        try {
            logger.info('🛒 [CART SERVICE] Vidage du panier')

            // Supprimer tous les items un par un
            for (const item of currentItems) {
                await this.updateQuantity(item.referenceId, 0)
            }

            // Récupérer le panier vide
            const response = await this.fetchCart()

            logger.info('✅ [CART SERVICE] Panier vidé')
            return response
        } catch (error: any) {
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
            referenceId: apiItem.referenceId,
            reference: apiItem.reference,
            priceId: apiItem.priceId,
            storeId: apiItem.storeId,
            couponId: apiItem.couponId || null,

            // Données produit
            id: apiItem.referenceId, // Compatibilité
            name: apiItem.name,

            // Quantité
            quantity: apiItem.quantity,

            // Tarification
            price: apiItem.price,
            priceHT: apiItem.HTPrice,
            discountPrice: apiItem.discountPrice !== apiItem.price ? apiItem.discountPrice : null,
            HTDiscount: apiItem.HTDiscount !== apiItem.HTPrice ? apiItem.HTDiscount : null,
            vatRate: apiItem.vat,
            currency: apiItem.currency,

            // Médias
            images: apiItem.image_array.map(img => img.path),

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
        return {
            referenceNumber: apiResponse.receipt.referenceNumber,
            tax: apiResponse.receipt.tax,
            total: apiResponse.receipt.total,
            discountTotal: apiResponse.receipt.discountotal,
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
    } {
        return {
            items: apiResponse.referenceList.map(item => this.mapAPIItemToCartItem(item)),
            receipt: this.mapAPIResponseToReceipt(apiResponse),
        }
    }
}

// Export d'une instance unique (singleton)
export const cartService = new CartService()

// Export de la classe pour des cas d'usage avancés
export default CartService
