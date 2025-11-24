/**
 * Types pour la gestion des adresses postales
 */

export type AddressType = 'billing' | 'shipping' | 'both'

export interface Address {
  id: string
  label?: string // Ex: "Maison", "Bureau", etc.
  firstName: string
  lastName: string
  street: string
  streetComplement?: string
  postalCode: string
  city: string
  country: string
  phone: string
  isDefault: boolean
  type: AddressType
  createdAt?: string
  updatedAt?: string
}

export interface CreateAddressDto {
  label?: string
  firstName: string
  lastName: string
  street: string
  streetComplement?: string
  postalCode: string
  city: string
  country: string
  phone: string
  isDefault?: boolean
  type?: AddressType
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {
  id: string
}
