<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { Address, CreateAddressDto, AddressAPIItem } from '@/types/address.types'
import { COUNTRY_CODES, type CountryCode } from '@/types/address.types'
import type { UserAddress } from '@/types/auth.types'
import { toast } from 'vue-sonner'
import { useAuth } from '@/composables/useAuth'
import { addressService } from '@/services/address.service'
import { getErrorMessage } from '@/lib/error-utils'

import AddressForm from './AddressForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Empty } from '@/components/ui/empty'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

/**
 * Auth store
 */
const { user, refreshUser } = useAuth()

/**
 * États de chargement
 */
const isLoading = ref(false)
const isDeleting = ref(false)

/**
 * Icônes
 */
const icons = computed(() => ({
  plus: byPrefixAndName.fas?.['plus'],
  pen: byPrefixAndName.fas?.['pen'],
  trash: byPrefixAndName.fas?.['trash'],
  star: byPrefixAndName.fas?.['star'],
  phone: byPrefixAndName.fas?.['phone'],
  locationDot: byPrefixAndName.fas?.['location-dot'],
  spinner: byPrefixAndName.fas?.['spinner']
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition => {
  return icons.value[iconKey] as IconDefinition
}

/**
 * Convertit une AddressAPIItem (format endpoint /fetchUserAdress) en Address
 * Ce format inclut mainAdress/mainBillAdress (0|1) de façon fiable
 */
function mapAPIAddressToAddress(apiAddr: AddressAPIItem): Address {
  const isShipping = apiAddr.mainAdress === 1
  const isBilling = apiAddr.mainBillAdress === 1

  let type: Address['type'] = 'both'
  if (isShipping && !isBilling) type = 'shipping'
  else if (isBilling && !isShipping) type = 'billing'

  return {
    id: String(apiAddr.adressId),
    label: apiAddr.recipient ?? undefined,
    title: undefined,
    firstName: apiAddr.firstname,
    lastName: apiAddr.lastname,
    street: apiAddr.line1,
    streetComplement: apiAddr.line2 ?? undefined,
    postalCode: apiAddr.zipcode,
    city: apiAddr.city,
    country: apiAddr.country,
    phone: undefined,
    isDefaultShipping: isShipping,
    isDefaultBilling: isBilling,
    type,
  }
}

/**
 * Convertit une UserAddress (format auth store /me) en Address (fallback)
 */
function mapUserAddressToAddress(userAddr: UserAddress, index: number): Address {
  const isShipping = userAddr.isDefaultShipping ?? false
  const isBilling = userAddr.isDefaultBilling ?? false

  let type: Address['type'] = 'both'
  if (isShipping && !isBilling) type = 'shipping'
  else if (isBilling && !isShipping) type = 'billing'

  return {
    id: String(userAddr.id ?? index),
    label: userAddr.recipient ?? undefined,
    title: userAddr.title ?? undefined,
    firstName: userAddr.firstName ?? '',
    lastName: userAddr.lastName ?? '',
    street: userAddr.line1,
    streetComplement: userAddr.line2 ?? undefined,
    postalCode: userAddr.zipcode,
    city: userAddr.city,
    country: userAddr.country,
    phone: undefined,
    isDefaultShipping: isShipping,
    isDefaultBilling: isBilling,
    type,
  }
}

/**
 * Adresses — chargées depuis /fetchUserAdress pour avoir mainAdress/mainBillAdress fiables,
 * fallback sur le auth store si l'endpoint n'est pas disponible (mock mode)
 */
const addresses = ref<Address[]>([])

// Initialisation immédiate depuis le auth store (pas de latence)
function initFromAuthStore() {
  if (user.value?.addresses) {
    addresses.value = user.value.addresses.map((addr, idx) => mapUserAddressToAddress(addr, idx))
  }
}

// Chargement depuis l'endpoint dédié (données complètes avec mainAdress/mainBillAdress)
async function loadAddresses() {
  try {
    const response = await addressService.fetchAddresses()
    addresses.value = response.adress_array.map(mapAPIAddressToAddress)
  } catch {
    // Fallback: garder les données du auth store
    initFromAuthStore()
  }
}

// Init immédiate + fetch async
initFromAuthStore()
onMounted(() => {
  loadAddresses()
})

// État du formulaire
const isFormOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentAddress = ref<Address | undefined>(undefined)

// État de la confirmation de suppression
const isDeleteDialogOpen = ref(false)
const addressToDelete = ref<string | null>(null)

// Ouvrir le formulaire d'ajout
const openCreateForm = () => {
  formMode.value = 'create'
  currentAddress.value = undefined
  isFormOpen.value = true
}

// Ouvrir le formulaire d'édition
const openEditForm = (address: Address) => {
  formMode.value = 'edit'
  currentAddress.value = address
  isFormOpen.value = true
}

// Fermer le formulaire
const closeForm = () => {
  isFormOpen.value = false
  currentAddress.value = undefined
}

// Soumettre le formulaire
const handleSubmit = async (data: CreateAddressDto) => {
  isLoading.value = true

  try {
    if (formMode.value === 'create') {
      await addressService.createAddress(data)
      toast.success('Adresse ajoutée avec succès')
    } else if (currentAddress.value) {
      const addressId = parseInt(currentAddress.value.id)
      await addressService.updateAddress(addressId, data)
      toast.success('Adresse mise à jour avec succès')
    }

    // Rafraîchir les données utilisateur + recharger les adresses avec données complètes
    await refreshUser()
    await loadAddresses()
    closeForm()
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    isLoading.value = false
  }
}

// Ouvrir la confirmation de suppression
const confirmDelete = (addressId: string) => {
  addressToDelete.value = addressId
  isDeleteDialogOpen.value = true
}

// Supprimer l'adresse
const deleteAddress = async () => {
  if (!addressToDelete.value) return

  isDeleting.value = true

  try {
    const addressId = parseInt(addressToDelete.value)
    await addressService.deleteAddress(addressId)

    // Rafraîchir les données utilisateur + recharger les adresses avec données complètes
    await refreshUser()
    await loadAddresses()
    toast.success('Adresse supprimée avec succès')
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    isDeleting.value = false
    isDeleteDialogOpen.value = false
    addressToDelete.value = null
  }
}

// Définir une adresse comme livraison par défaut
const setAsDefaultShipping = async (addressId: string) => {
  isLoading.value = true

  try {
    const id = parseInt(addressId)
    await addressService.setDefaultShipping(id)

    await refreshUser()
    await loadAddresses()
    toast.success('Adresse de livraison par défaut mise à jour')
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    isLoading.value = false
  }
}

// Définir une adresse comme facturation par défaut
const setAsDefaultBilling = async (addressId: string) => {
  isLoading.value = true

  try {
    const id = parseInt(addressId)
    await addressService.setDefaultBilling(id)

    await refreshUser()
    await loadAddresses()
    toast.success('Adresse de facturation par défaut mise à jour')
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    isLoading.value = false
  }
}

/**
 * Récupère le nom du pays à partir du code ISO
 */
const getCountryName = (code: string): string => {
  return COUNTRY_CODES[code as CountryCode] || code
}

// Formatage de l'adresse complète
const formatFullAddress = (address: Address) => {
  const parts = [
    address.street,
    address.streetComplement,
    `${address.postalCode} ${address.city}`,
    getCountryName(address.country)
  ].filter(Boolean)
  return parts.join(', ')
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Adresses postales</CardTitle>
          <CardDescription>
            Gérez vos adresses de facturation et de livraison
          </CardDescription>
        </div>
        <Button
          variant="outline"
          color="secondary"
          size="sm"
          rounded="lg"
          :disabled="isLoading"
          class="flex items-center gap-1.5 hover:bg-secondary hover:border-secondary"
          @click="openCreateForm"
        >
          <FontAwesomeIcon v-if="getIcon('plus')" :icon="getIcon('plus')" class="w-3 h-3" />
          <span class="font-semibold tracking-wide">AJOUTER</span>
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Indicateur de chargement global -->
      <div v-if="isLoading" class="flex items-center justify-center py-4">
        <FontAwesomeIcon
          v-if="getIcon('spinner')"
          :icon="getIcon('spinner')"
          class="w-5 h-5 animate-spin text-secondary"
        />
        <span class="ml-2 text-sm text-muted-foreground">Chargement...</span>
      </div>

      <!-- Liste des adresses -->
      <div v-else-if="addresses.length > 0" class="space-y-2">
        <div
          v-for="address in addresses"
          :key="address.id"
          class="relative p-4 rounded-lg border border-neutral-200"
        >
          <!-- Actions en top-right -->
          <div class="absolute top-3 right-3 flex gap-1">
            <Button
              variant="ghost"
              color="secondary"
              size="sm"
              :disabled="isLoading"
              class="h-8 w-8 p-0"
              @click="openEditForm(address)"
            >
              <FontAwesomeIcon v-if="getIcon('pen')" :icon="getIcon('pen')" class="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              :disabled="isLoading"
              class="h-8 w-8 p-0 text-destructive hover:text-destructive"
              @click="confirmDelete(address.id)"
            >
              <FontAwesomeIcon v-if="getIcon('trash')" :icon="getIcon('trash')" class="w-3.5 h-3.5" />
            </Button>
          </div>

          <!-- Contenu -->
          <div class="space-y-3 pr-20">
            <!-- Titre de l'adresse -->
            <h4 class="font-semibold text-sm text-neutral-900">
              {{ address.label || 'Adresse' }}
            </h4>

            <!-- Informations -->
            <div class="space-y-1 text-sm">
              <p class="font-medium text-neutral-700">
                {{ address.title }} {{ address.firstName }} {{ address.lastName }}
              </p>
              <p class="text-muted-foreground">
                {{ formatFullAddress(address) }}
              </p>
            </div>

            <!-- Badges par défaut (affichés uniquement si l'adresse est par défaut) -->
            <div v-if="address.isDefaultShipping || address.isDefaultBilling" class="pt-2 flex gap-4 flex-wrap">
              <div v-if="address.isDefaultShipping" class="flex items-center gap-1.5 text-xs font-bold text-neutral-900 tracking-wide uppercase">
                <FontAwesomeIcon v-if="getIcon('star')" :icon="getIcon('star')" class="w-3 h-3" />
                Livraison par défaut
              </div>
              <div v-if="address.isDefaultBilling" class="flex items-center gap-1.5 text-xs font-bold text-neutral-900 tracking-wide uppercase">
                <FontAwesomeIcon v-if="getIcon('star')" :icon="getIcon('star')" class="w-3 h-3" />
                Facturation par défaut
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucune adresse -->
      <Empty
        v-else
        title="Aucune adresse enregistrée"
        description="Ajoutez votre première adresse pour faciliter vos commandes"
        class="border-2 border-dashed rounded-lg"
      >
        <template #icon>
          <FontAwesomeIcon
            v-if="getIcon('locationDot')"
            :icon="getIcon('locationDot')"
            class="w-full h-full"
          />
        </template>
        <template #action>
          <Button variant="outline" @click="openCreateForm">
            <FontAwesomeIcon v-if="getIcon('plus')" :icon="getIcon('plus')" class="mr-2" />
            Ajouter une adresse
          </Button>
        </template>
      </Empty>
    </CardContent>

    <!-- Dialog du formulaire -->
    <Dialog v-model:open="isFormOpen">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {{ formMode === 'create' ? 'Ajouter une adresse' : 'Modifier l\'adresse' }}
          </DialogTitle>
          <DialogDescription>
            {{
              formMode === 'create'
                ? 'Remplissez les informations ci-dessous pour ajouter une nouvelle adresse.'
                : 'Modifiez les informations de votre adresse.'
            }}
          </DialogDescription>
        </DialogHeader>
        <AddressForm
          :key="currentAddress?.id ?? 'new'"
          :address="currentAddress"
          :mode="formMode"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </DialogContent>
    </Dialog>

    <!-- Dialog de confirmation de suppression -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div class="flex gap-3 pt-4">
          <Button
            variant="outline"
            :disabled="isDeleting"
            class="flex-1"
            @click="isDeleteDialogOpen = false"
          >
            Annuler
          </Button>
          <Button
            :disabled="isDeleting"
            class="flex-1 bg-destructive hover:bg-destructive/90 text-white"
            @click="deleteAddress"
          >
            <FontAwesomeIcon
              v-if="isDeleting && getIcon('spinner')"
              :icon="getIcon('spinner')"
              class="mr-2 animate-spin"
            />
            {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </Card>
</template>
