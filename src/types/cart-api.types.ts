/**
 * Types pour l'API Backend du Panier
 * Structure des réponses de https://jeandeportal.fr/api/*
 */

/**
 * Réponse complète du panier depuis le backend
 * Retourné par /api/fetchBasket et /api/addReference
 */
export interface CartAPIResponse {
    /**
     * Nombre total de références dans le panier
     */
    length: number

    /**
     * Récapitulatif du panier (totaux, TVA, remises)
     */
    receipt: CartReceiptAPI

    /**
     * Liste des articles du panier
     */
    referenceList: CartAPIItem[]
}

/**
 * Récapitulatif du panier
 */
export interface CartReceiptAPI {
    /**
     * Nombre de références distinctes
     */
    referenceNumber: number

    /**
     * Montant total de TVA
     */
    tax: number

    /**
     * Total TTC hors remises
     */
    total: number

    /**
     * Total TTC avec remises appliquées
     */
    discountotal: number
}

/**
 * Article du panier (référence)
 */
export interface CartAPIItem {
    /**
     * ID de l'item
     */
    itemId: number

    /**
     * ID de la référence produit
     */
    referenceId: number

    /**
     * Référence technique (SKU unique pour facture)
     */
    reference: string

    /**
     * Nom commercial de l'article
     */
    name: string

    /**
     * ID du prix appliqué
     */
    priceId: number

    /**
     * Prix fort TTC
     */
    price: number

    /**
     * Prix fort HT
     */
    HTPrice: number

    /**
     * Prix réduit TTC (avec réductions)
     */
    discountPrice: number

    /**
     * Prix réduit HT (avec réductions)
     */
    HTDiscount: number

    /**
     * Taux de TVA (ex: 5.5, 20)
     */
    vat: number

    /**
     * Devise (toujours "EUR" pour l'instant)
     */
    currency: string

    /**
     * Quantité de cette référence dans le panier
     */
    quantity: number

    /**
     * ID du coupon de réduction appliqué (0 si aucun)
     */
    couponId: number

    /**
     * ID de la boutique (28 pour consultations)
     */
    storeId: number

    /**
     * Tableau d'images associées à l'article
     */
    image_array: CartImageAPI[]
}

/**
 * Image d'un article du panier
 */
export interface CartImageAPI {
    /**
     * ID de l'item associé
     */
    itemId: number

    /**
     * Chemin de l'image
     */
    path: string

    /**
     * Ordre d'affichage des images
     */
    sort: number

    /**
     * ID de l'image
     */
    imageId: number

    /**
     * ID du type d'image
     */
    imageTypeId: number

    /**
     * Nom de l'image
     */
    name: string

    /**
     * Description de l'image
     */
    description: string

    /**
     * Largeur en pixels
     */
    width: number

    /**
     * Hauteur en pixels
     */
    height: number

    /**
     * Poids de l'image en octets
     */
    size: number

    /**
     * Date d'upload (timestamp)
     */
    timestamp: string
}

/**
 * Requête pour ajouter une référence au panier
 * POST /api/addReference
 */
export interface AddToCartRequest {
    /**
     * ID de la référence à ajouter
     */
    referenceId: number

    /**
     * Quantité à ajouter (défaut: 1)
     */
    quantity?: number

    /**
     * ID de la boutique (défaut: 28 pour consultations)
     */
    storeId?: number
}

/**
 * Requête pour modifier la quantité d'une référence
 * POST /api/basketChangeQuantityReference
 */
export interface UpdateQuantityRequest {
    /**
     * ID de la référence à modifier
     */
    referenceId: number

    /**
     * Nouvelle quantité (0 = supprimer)
     */
    quantity: number
}
