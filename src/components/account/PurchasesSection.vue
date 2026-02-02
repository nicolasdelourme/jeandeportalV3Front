<script setup lang="ts">
/**
 * Section Mes Achats
 * Historique des achats de l'utilisateur
 * Données chargées depuis l'API /fetchPaidInvoicePerOrder
 */
import { computed, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { useShopOrdersStore } from '@/stores/shop-orders.store'
import type { ShopOrderInvoice } from '@/types/shop-orders-api.types'

/**
 * Store des factures de commandes
 */
const store = useShopOrdersStore()

/**
 * Charger les données au montage
 */
onMounted(() => {
    store.fetchData()
})

/**
 * Icônes
 */
const icons = computed(() => ({
    fileLines: byPrefixAndName.fas?.['file-lines'],
    download: byPrefixAndName.fas?.['download'],
    shoppingBag: byPrefixAndName.fas?.['shopping-bag'],
    spinner: byPrefixAndName.fas?.['spinner'],
    triangleExclamation: byPrefixAndName.fas?.['triangle-exclamation'],
    undo: byPrefixAndName.fas?.['undo'],
}))

/**
 * Formater le prix
 */
const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price)
}

/**
 * Ouvrir la facture dans un nouvel onglet
 */
const openInvoice = (order: ShopOrderInvoice): void => {
    if (order.downloadUrl) {
        window.open(order.downloadUrl, '_blank', 'noopener,noreferrer')
    }
}
</script>

<template>
    <!-- État de chargement -->
    <div v-if="store.isLoading" class="text-center py-12">
        <FontAwesomeIcon
            v-if="icons.spinner"
            :icon="icons.spinner"
            class="w-8 h-8 text-neutral-400 animate-spin mb-4"
        />
        <p class="text-neutral-600">Chargement de vos achats...</p>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="store.error" class="text-center py-12">
        <FontAwesomeIcon
            v-if="icons.triangleExclamation"
            :icon="icons.triangleExclamation"
            class="w-8 h-8 text-destructive mb-4"
        />
        <p class="text-destructive mb-4">{{ store.error }}</p>
        <Button variant="outline" @click="store.refresh()">
            <FontAwesomeIcon
                v-if="icons.undo"
                :icon="icons.undo"
                class="w-4 h-4 mr-2"
            />
            Réessayer
        </Button>
    </div>

    <!-- Contenu principal -->
    <Card v-else>
        <CardHeader>
            <CardTitle>Mes achats</CardTitle>
            <CardDescription>
                Retrouvez ici l'historique de vos achats
            </CardDescription>
        </CardHeader>
        <CardContent>
            <!-- État vide -->
            <Empty
                v-if="store.orders.length === 0"
                title="Aucun achat"
                description="Vous n'avez encore effectué aucun achat."
            >
                <template #icon>
                    <FontAwesomeIcon
                        v-if="icons.shoppingBag"
                        :icon="icons.shoppingBag"
                        class="w-full h-full"
                    />
                </template>
            </Empty>

            <!-- Tableau des achats -->
            <div v-else class="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="font-medium">N° Commande</TableHead>
                            <TableHead class="font-medium">Date</TableHead>
                            <TableHead class="font-medium text-right">Montant</TableHead>
                            <TableHead class="font-medium text-center w-[100px]">Facture</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="order in store.orders" :key="order.id">
                            <TableCell>
                                <div class="flex items-center gap-2">
                                    <FontAwesomeIcon
                                        v-if="icons.fileLines"
                                        :icon="icons.fileLines"
                                        class="w-4 h-4 text-neutral-400"
                                    />
                                    <span class="text-neutral-800">{{ order.orderNumber }}</span>
                                </div>
                            </TableCell>
                            <TableCell class="text-neutral-600">
                                {{ order.date }}
                            </TableCell>
                            <TableCell class="text-right font-medium text-neutral-800">
                                {{ formatPrice(order.amount) }}
                            </TableCell>
                            <TableCell class="text-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    :disabled="!order.downloadUrl"
                                    :class="[
                                        'h-8 w-8 p-0',
                                        !order.downloadUrl && 'opacity-50 cursor-not-allowed'
                                    ]"
                                    :title="order.downloadUrl ? 'Télécharger la facture' : 'Facture non disponible'"
                                    @click="openInvoice(order)"
                                >
                                    <FontAwesomeIcon
                                        v-if="icons.download"
                                        :icon="icons.download"
                                        class="w-4 h-4 text-neutral-600"
                                    />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
</template>
