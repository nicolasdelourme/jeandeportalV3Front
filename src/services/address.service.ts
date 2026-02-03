/**
 * Service de gestion des adresses
 * Centralise toutes les opérations CRUD sur les adresses utilisateur
 */

import { apiClient } from '@/api/client'
import type {
    AddressAPIResponse,
    CreateAddressAPIRequest,
    UpdateAddressAPIRequest,
    CreateAddressDto
} from '@/types/address.types'
import { logger } from '@/utils/logger'
import { getHttpErrorCode, getHttpErrorData } from '@/lib/error-utils'

/**
 * Erreur spécifique aux adresses
 */
export class AddressError extends Error {
    code: 'FETCH_ERROR' | 'CREATE_ERROR' | 'UPDATE_ERROR' | 'DELETE_ERROR' | 'NETWORK_ERROR'
    statusCode?: number

    constructor(
        message: string,
        code: 'FETCH_ERROR' | 'CREATE_ERROR' | 'UPDATE_ERROR' | 'DELETE_ERROR' | 'NETWORK_ERROR',
        statusCode?: number
    ) {
        super(message)
        this.name = 'AddressError'
        this.code = code
        this.statusCode = statusCode
    }
}

/**
 * Service de gestion des adresses
 */
class AddressService {
    /**
     * Récupère la liste des adresses de l'utilisateur
     * GET /fetchUserAdress
     */
    async fetchAddresses(): Promise<AddressAPIResponse> {
        try {

            const response = await apiClient.get<AddressAPIResponse>('/fetchUserAdress')

            if (response.status === 'error') {
                throw new AddressError(
                    response.message || 'Impossible de récupérer les adresses',
                    'FETCH_ERROR'
                )
            }

            return response
        } catch (error) {
            if (error instanceof AddressError) {
                throw error
            }

            logger.error('❌ Erreur lors de la récupération des adresses:', error)
            const httpData = getHttpErrorData<{ message?: string }>(error)
            const errorMessage = httpData?.message || 'Impossible de récupérer les adresses'

            throw new AddressError(
                errorMessage,
                'FETCH_ERROR',
                getHttpErrorCode(error)
            )
        }
    }

    /**
     * Crée une nouvelle adresse
     * POST /createAdress
     */
    async createAddress(data: CreateAddressDto): Promise<AddressAPIResponse> {
        try {

            // Mapper les données frontend vers le format API (payload plat pour création)
            const payload: CreateAddressAPIRequest = {
                country: data.country,
                city: data.city,
                zipcode: data.postalCode,
                line1: data.street,
                line2: data.streetComplement || null,
                firstname: data.firstName || null,
                lastname: data.lastName || null,
                recipient: data.label || null,
                mainAdress: data.isDefaultShipping ? 1 : 0,
                mainBillAdress: data.isDefaultBilling ? 1 : 0
            }

            const response = await apiClient.post<AddressAPIResponse>('/createAdress', payload)

            if (response.status === 'error') {
                throw new AddressError(
                    response.message || 'Impossible de créer l\'adresse',
                    'CREATE_ERROR'
                )
            }

            return response
        } catch (error) {
            if (error instanceof AddressError) {
                throw error
            }

            logger.error('❌ Erreur lors de la création de l\'adresse:', error)
            const httpData = getHttpErrorData<{ message?: string }>(error)
            const errorMessage = httpData?.message || 'Impossible de créer l\'adresse'

            throw new AddressError(
                errorMessage,
                'CREATE_ERROR',
                getHttpErrorCode(error)
            )
        }
    }

    /**
     * Met à jour une adresse existante
     * POST /createAdress (avec adressId)
     */
    async updateAddress(addressId: number, data: Partial<CreateAddressDto>): Promise<AddressAPIResponse> {
        try {

            // Mapper les données frontend vers le format API
            // Ne pas inclure les champs undefined
            const adressArray: UpdateAddressAPIRequest['adress_array'] = {}

            if (data.country !== undefined) adressArray.country = data.country
            if (data.city !== undefined) adressArray.city = data.city
            if (data.postalCode !== undefined) adressArray.zipcode = data.postalCode
            if (data.street !== undefined) adressArray.line1 = data.street
            if (data.streetComplement !== undefined) adressArray.line2 = data.streetComplement || null
            if (data.firstName !== undefined) adressArray.firstname = data.firstName || null
            if (data.lastName !== undefined) adressArray.lastname = data.lastName || null
            if (data.label !== undefined) adressArray.recipient = data.label || null
            if (data.isDefaultShipping !== undefined) adressArray.mainAdress = data.isDefaultShipping ? 1 : 0
            if (data.isDefaultBilling !== undefined) adressArray.mainBillAdress = data.isDefaultBilling ? 1 : 0

            const payload: UpdateAddressAPIRequest = {
                adressId: addressId,
                adress_array: adressArray
            }

            const response = await apiClient.post<AddressAPIResponse>('/updateAdress', payload)

            if (response.status === 'error') {
                throw new AddressError(
                    response.message || 'Impossible de mettre à jour l\'adresse',
                    'UPDATE_ERROR'
                )
            }

            return response
        } catch (error) {
            if (error instanceof AddressError) {
                throw error
            }

            logger.error('❌ Erreur lors de la mise à jour de l\'adresse:', error)
            const httpData = getHttpErrorData<{ message?: string }>(error)
            const errorMessage = httpData?.message || 'Impossible de mettre à jour l\'adresse'

            throw new AddressError(
                errorMessage,
                'UPDATE_ERROR',
                getHttpErrorCode(error)
            )
        }
    }

    /**
     * Supprime une adresse
     * POST /deleteAdress
     */
    async deleteAddress(addressId: number): Promise<AddressAPIResponse> {
        try {

            const response = await apiClient.post<AddressAPIResponse>('/deleteAdress', {
                adressId: addressId
            })

            if (response.status === 'error') {
                throw new AddressError(
                    response.message || 'Impossible de supprimer l\'adresse',
                    'DELETE_ERROR'
                )
            }

            return response
        } catch (error) {
            if (error instanceof AddressError) {
                throw error
            }

            logger.error('❌ Erreur lors de la suppression de l\'adresse:', error)
            const httpData = getHttpErrorData<{ message?: string }>(error)
            const errorMessage = httpData?.message || 'Impossible de supprimer l\'adresse'

            throw new AddressError(
                errorMessage,
                'DELETE_ERROR',
                getHttpErrorCode(error)
            )
        }
    }

    /**
     * Définit une adresse comme adresse de livraison par défaut
     */
    async setDefaultShipping(addressId: number): Promise<AddressAPIResponse> {
        return this.updateAddress(addressId, { isDefaultShipping: true })
    }

    /**
     * Définit une adresse comme adresse de facturation par défaut
     */
    async setDefaultBilling(addressId: number): Promise<AddressAPIResponse> {
        return this.updateAddress(addressId, { isDefaultBilling: true })
    }
}

// Export singleton
export const addressService = new AddressService()
export default AddressService
