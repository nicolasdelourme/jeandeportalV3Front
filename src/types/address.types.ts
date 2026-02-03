/**
 * Types pour la gestion des adresses postales
 */

// ============================================
// Types API (Backend)
// ============================================

/**
 * Structure d'une adresse retournée par l'API
 */
export interface AddressAPIItem {
  adressId: number
  firstname: string
  lastname: string
  recipient: string | null  // Libellé de l'adresse (ex: "Maison")
  line1: string
  line2: string | null
  zipcode: string
  city: string
  country: string           // Code ISO (FR, BE, CH, LU, CA)
  mainAdress: number        // Adresse de livraison par défaut (0 | 1)
  mainBillAdress: number    // Adresse de facturation par défaut (0 | 1)
}

/**
 * Réponse standard de l'API pour les adresses
 */
export interface AddressAPIResponse {
  status: 'success' | 'error'
  adress_array: AddressAPIItem[]
  message?: string
}

/**
 * Payload pour créer une nouvelle adresse
 * POST /createAdress
 */
export interface CreateAddressAPIRequest {
  country: string           // Code ISO (FR, BE, etc.)
  city: string
  zipcode: string
  line1: string
  line2?: string | null
  firstname?: string | null // Si null, utilise le prénom du user
  lastname?: string | null  // Si null, utilise le nom du user
  recipient?: string | null // Libellé de l'adresse
  mainAdress: number
  mainBillAdress: number
}

/**
 * Payload pour mettre à jour une adresse existante
 * POST /createAdress (avec adressId)
 */
export interface UpdateAddressAPIRequest {
  adressId: number
  adress_array: Partial<Omit<CreateAddressAPIRequest, 'mainAdress' | 'mainBillAdress'>> & {
    mainAdress?: number
    mainBillAdress?: number
  }
}

/**
 * Payload pour supprimer une adresse
 * POST /deleteAdress
 */
export interface DeleteAddressAPIRequest {
  adressId: number
}

// ============================================
// Mapping codes pays
// ============================================

/**
 * Codes pays ISO supportés
 */
export const COUNTRY_CODES = {
  FR: 'France',
  BE: 'Belgique',
  CH: 'Suisse',
  LU: 'Luxembourg',
  CA: 'Canada'
} as const

export type CountryCode = keyof typeof COUNTRY_CODES

/**
 * Liste des pays pour les selects
 */
export const COUNTRIES_LIST = Object.entries(COUNTRY_CODES).map(([code, name]) => ({
  code: code as CountryCode,
  name
}))

// ============================================
// Types Frontend
// ============================================

export type AddressType = 'billing' | 'shipping' | 'both'

export interface Address {
  id: string
  label?: string // Ex: "Maison", "Bureau", etc. (API: recipient)
  title?: string // Civilité: M., Mme (API: title)
  firstName: string
  lastName: string
  street: string
  streetComplement?: string
  postalCode: string
  city: string
  country: string
  phone?: string
  isDefaultShipping: boolean  // API: mainAdress
  isDefaultBilling: boolean   // API: mainBillAdress
  type: AddressType           // Déduit de isDefaultShipping/isDefaultBilling
  createdAt?: string
  updatedAt?: string
}

export interface CreateAddressDto {
  label?: string
  title?: string
  firstName: string
  lastName: string
  street: string
  streetComplement?: string
  postalCode: string
  city: string
  country: string
  phone?: string
  isDefaultShipping?: boolean
  isDefaultBilling?: boolean
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {
  id: string
}
