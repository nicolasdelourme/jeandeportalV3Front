/**
 * Types pour l'API Backend du Panier
 * Structure des réponses de https://api.jeandeportal.fr/*
 */

/**
 * Réponse complète du panier depuis le backend
 * Retourné par /fetchBasket et /addReference
 */
export interface CartAPIResponse {
    /**
     * Statut de la réponse
     */
    status: 'success' | 'error'

    /**
     * Données du panier
     */
    basket: BasketData

    /**
     * Message d'erreur (si status = 'error')
     */
    message?: string
}

/**
 * Données du panier (objet imbriqué)
 */
export interface BasketData {
    /**
     * Code unique du panier (pour identifier le panier)
     */
    basketCode: string

    /**
     * Nombre de références distinctes
     */
    referenceNumber: number

    /**
     * Nombre total d'articles (somme des quantités)
     */
    count: number

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
    discountTotal: number

    /**
     * Liste des articles du panier
     */
    referenceList: CartAPIItem[]
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
     * ID du prix (référence pour le backend)
     */
    priceId: number

    /**
     * ID de la boutique (28 pour consultations)
     */
    storeId: number

    /**
     * Nom commercial de l'article
     */
    name: string

    /**
     * Quantité de cette référence dans le panier
     */
    quantity: number

    /**
     * ID du coupon appliqué (-1 si aucun)
     */
    couponId: number

    /**
     * Prix TTC
     */
    price: number

    /**
     * Prix HT
     */
    HTPrice: number

    /**
     * Prix TTC avec remise
     */
    discountPrice: number

    /**
     * Prix HT avec remise
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
 * POST /addReference
 */
export interface AddToCartRequest {
    /**
     * ID de la référence à ajouter (reference_array[].id du catalogue)
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

    /**
     * Code du panier (null pour créer un nouveau panier)
     */
    basketCode?: string | null
}

/**
 * Requête pour récupérer le panier
 * POST /fetchBasket
 */
export interface FetchCartRequest {
    /**
     * Code du panier à récupérer
     */
    basketCode: string

    /**
     * ID de la boutique (peut être requis par le backend)
     */
    storeId?: number
}

/**
 * Requête pour modifier la quantité d'une référence
 * POST /basketChangeQuantityReference
 */
export interface UpdateQuantityRequest {
    /**
     * ID du prix à modifier
     */
    priceId: number

    /**
     * Nouvelle quantité (0 = supprimer)
     */
    quantity: number

    /**
     * Code du panier
     */
    basketCode: string
}

/**
 * Requête pour supprimer une référence du panier
 * POST /deleteReference
 */
export interface DeleteReferenceRequest {
    /**
     * ID de la référence à supprimer
     */
    referenceId: number

    /**
     * Quantité à supprimer (généralement 1)
     */
    quantity: number

    /**
     * ID de la boutique
     */
    storeId: number

    /**
     * Code du panier
     */
    basketCode: string
}
