<script setup lang="ts">
/**
 * Section Mes Achats
 * Historique des achats de l'utilisateur
 */
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

/**
 * Type pour un achat
 */
interface Purchase {
    id: string
    date: string
    price: number
    invoiceUrl: string
}

/**
 * Liste des achats (mock data)
 */
const purchases = ref<Purchase[]>([
    {
        id: 'ACH-2024-001',
        date: '2024-03-15',
        price: 49.90,
        invoiceUrl: '#'
    },
    {
        id: 'ACH-2024-002',
        date: '2024-03-10',
        price: 39.90,
        invoiceUrl: '#'
    },
    {
        id: 'ACH-2024-003',
        date: '2024-02-28',
        price: 29.90,
        invoiceUrl: '#'
    }
])

/**
 * Icônes
 */
const icons = computed(() => ({
    fileLines: byPrefixAndName.fas?.['file-lines'],
    download: byPrefixAndName.fas?.['download'],
    shoppingBag: byPrefixAndName.fas?.['shopping-bag'],
}))

/**
 * Formater la date
 */
const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date)
}

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
 * Télécharger la facture
 */
const downloadInvoice = (purchase: Purchase) => {
    try {
        // TODO: Implémenter le téléchargement réel de la facture
        console.log('Téléchargement facture:', purchase.id)
        toast.success(`Téléchargement de la facture ${purchase.id}`)
    } catch (error) {
        console.error('Erreur:', error)
        toast.error('Impossible de télécharger la facture')
    }
}
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Mes achats</CardTitle>
            <CardDescription>
                Retrouvez ici l'historique de vos achats
            </CardDescription>
        </CardHeader>
        <CardContent>
            <!-- État vide -->
            <div v-if="purchases.length === 0" class="text-center py-12">
                <FontAwesomeIcon
                    v-if="icons.shoppingBag"
                    :icon="icons.shoppingBag"
                    class="w-12 h-12 text-neutral-300 mx-auto mb-4"
                />
                <p class="text-neutral-500">
                    Vous n'avez encore effectué aucun achat
                </p>
            </div>

            <!-- Tableau des achats -->
            <div v-else class="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="font-medium">Article</TableHead>
                            <TableHead class="font-medium">Date</TableHead>
                            <TableHead class="font-medium text-right">Montant</TableHead>
                            <TableHead class="font-medium text-center w-[100px]">Facture</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="purchase in purchases" :key="purchase.id">
                            <TableCell>
                                <div class="flex items-center gap-2">
                                    <FontAwesomeIcon
                                        v-if="icons.fileLines"
                                        :icon="icons.fileLines"
                                        class="w-4 h-4 text-neutral-400"
                                    />
                                    <span class="text-neutral-800">ID Commande</span>
                                </div>
                            </TableCell>
                            <TableCell class="text-neutral-600">
                                {{ formatDate(purchase.date) }}
                            </TableCell>
                            <TableCell class="text-right font-medium text-neutral-800">
                                {{ formatPrice(purchase.price) }}
                            </TableCell>
                            <TableCell class="text-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    @click="downloadInvoice(purchase)"
                                    class="h-8 w-8 p-0"
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
