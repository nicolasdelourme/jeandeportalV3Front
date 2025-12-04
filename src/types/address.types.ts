/**
 * Types pour la gestion des adresses postales
 */

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
