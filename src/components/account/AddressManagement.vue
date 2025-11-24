<script setup lang="ts">
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { Address, CreateAddressDto } from '@/types/address.types'
import { toast } from 'vue-sonner'

import AddressForm from './AddressForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

/**
 * Icônes
 */
const icons = computed(() => ({
  plus: byPrefixAndName.fas?.['plus'],
  pen: byPrefixAndName.fas?.['pen'],
  trash: byPrefixAndName.fas?.['trash'],
  star: byPrefixAndName.fas?.['star'],
  phone: byPrefixAndName.fas?.['phone'],
  locationDot: byPrefixAndName.fas?.['location-dot']
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition => {
  return icons.value[iconKey] as IconDefinition
}

// État local (à remplacer par un store Pinia en production)
const addresses = ref<Address[]>([
  // Données mockées pour démonstration
  {
    id: '1',
    label: 'Maison',
    firstName: 'Jean',
    lastName: 'Dupont',
    street: '123 Rue de la Paix',
    streetComplement: 'Appartement 5B',
    postalCode: '75001',
    city: 'Paris',
    country: 'France',
    phone: '06 12 34 56 78',
    isDefault: true,
    type: 'both',
    createdAt: '2024-01-15'
  }
])

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
  try {
    if (formMode.value === 'create') {
      // TODO: Appel API pour créer l'adresse
      const newAddress: Address = {
        id: Date.now().toString(),
        ...data,
        isDefault: data.isDefault || false,
        type: data.type || 'both',
        createdAt: new Date().toISOString()
      }

      // Si nouvelle adresse par défaut, retirer le flag des autres
      if (newAddress.isDefault) {
        addresses.value.forEach((addr) => (addr.isDefault = false))
      }

      addresses.value.push(newAddress)
      toast.success('Adresse ajoutée avec succès')
    } else {
      // TODO: Appel API pour modifier l'adresse
      const index = addresses.value.findIndex((a) => a.id === currentAddress.value?.id)
      if (index !== -1 && currentAddress.value) {
        const updatedAddress: Address = {
          id: currentAddress.value.id,
          ...data,
          isDefault: data.isDefault || false,
          type: data.type || 'both',
          createdAt: currentAddress.value.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        // Si nouvelle adresse par défaut, retirer le flag des autres
        if (updatedAddress.isDefault) {
          addresses.value.forEach((addr) => (addr.isDefault = false))
        }

        addresses.value[index] = updatedAddress
        toast.success('Adresse modifiée avec succès')
      }
    }

    closeForm()
  } catch (error) {
    toast.error('Une erreur est survenue')
    console.error(error)
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

  try {
    // TODO: Appel API pour supprimer l'adresse
    addresses.value = addresses.value.filter((a) => a.id !== addressToDelete.value)
    toast.success('Adresse supprimée avec succès')
  } catch (error) {
    toast.error('Impossible de supprimer cette adresse')
    console.error(error)
  } finally {
    isDeleteDialogOpen.value = false
    addressToDelete.value = null
  }
}

// Définir une adresse par défaut
const setAsDefault = async (addressId: string) => {
  try {
    // TODO: Appel API pour définir l'adresse par défaut
    addresses.value.forEach((addr) => {
      addr.isDefault = addr.id === addressId
    })
    toast.success('Adresse par défaut mise à jour')
  } catch (error) {
    toast.error('Une erreur est survenue')
    console.error(error)
  }
}

// Formatage du type d'adresse
const getAddressTypeLabel = (type: Address['type']) => {
  const labels = {
    billing: 'Facturation',
    shipping: 'Livraison',
    both: 'Facturation et Livraison'
  }
  return labels[type]
}

// Formatage de l'adresse complète
const formatFullAddress = (address: Address) => {
  const parts = [
    address.street,
    address.streetComplement,
    `${address.postalCode} ${address.city}`,
    address.country
  ].filter(Boolean)
  return parts.join(', ')
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle style="font-family: Roboto, sans-serif">Adresses postales</CardTitle>
          <CardDescription style="font-family: Roboto, sans-serif">
            Gérez vos adresses de facturation et de livraison
          </CardDescription>
        </div>
        <Button variant="outline" @click="openCreateForm" class="flex items-center gap-2">
          <FontAwesomeIcon v-if="getIcon('plus')" :icon="getIcon('plus')" />
          <span class="hidden sm:inline">Ajouter</span>
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Liste des adresses -->
      <div v-if="addresses.length > 0" class="space-y-4">
        <div
          v-for="address in addresses"
          :key="address.id"
          :class="[
            'relative p-4 rounded-lg border transition-all',
            address.isDefault ? 'border-primary bg-primary/5' : 'border-border'
          ]"
        >
          <!-- Actions en top-right -->
          <div class="absolute top-3 right-3 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              @click="openEditForm(address)"
              class="h-8 w-8 p-0"
            >
              <FontAwesomeIcon v-if="getIcon('pen')" :icon="getIcon('pen')" class="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              @click="confirmDelete(address.id)"
              class="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <FontAwesomeIcon v-if="getIcon('trash')" :icon="getIcon('trash')" class="w-3.5 h-3.5" />
            </Button>
          </div>

          <!-- Contenu -->
          <div class="space-y-3 pr-20">
            <!-- En-tête -->
            <div class="flex items-start gap-2">
              <div class="space-y-1 flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="font-medium text-sm" style="font-family: Roboto, sans-serif">
                    {{ address.label || 'Adresse' }}
                  </h4>
                  <Badge v-if="address.isDefault" variant="default" class="text-xs h-5">
                    Par défaut
                  </Badge>
                </div>
                <Badge variant="outline" class="text-xs">
                  {{ getAddressTypeLabel(address.type) }}
                </Badge>
              </div>
            </div>

            <!-- Informations -->
            <div class="space-y-1 text-sm">
              <p class="font-medium text-neutral-700">
                {{ address.firstName }} {{ address.lastName }}
              </p>
              <p class="text-muted-foreground leading-relaxed">
                {{ formatFullAddress(address) }}
              </p>
              <p class="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon v-if="getIcon('phone')" :icon="getIcon('phone')" class="w-3.5" />
                {{ address.phone }}
              </p>
            </div>

            <!-- Action par défaut -->
            <div v-if="!address.isDefault" class="pt-2">
              <Button
                variant="ghost"
                size="sm"
                @click="setAsDefault(address.id)"
                class="text-xs h-7"
              >
                <FontAwesomeIcon v-if="getIcon('star')" :icon="getIcon('star')" class="mr-1.5 w-3" />
                Définir par défaut
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucune adresse -->
      <div v-else class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
        <FontAwesomeIcon
          v-if="getIcon('locationDot')"
          :icon="getIcon('locationDot')"
          class="w-10 h-10 text-muted-foreground mb-3"
        />
        <h3 class="text-base font-semibold mb-1" style="font-family: Roboto, sans-serif">
          Aucune adresse enregistrée
        </h3>
        <p class="text-sm text-muted-foreground mb-4 max-w-sm">
          Ajoutez votre première adresse pour faciliter vos commandes
        </p>
        <Button variant="outline" @click="openCreateForm">
          <FontAwesomeIcon v-if="getIcon('plus')" :icon="getIcon('plus')" class="mr-2" />
          Ajouter une adresse
        </Button>
      </div>
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
          <Button variant="outline" @click="isDeleteDialogOpen = false" class="flex-1">
            Annuler
          </Button>
          <Button
            @click="deleteAddress"
            class="flex-1 bg-destructive hover:bg-destructive/90 text-white"
          >
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </Card>
</template>
