<script setup lang="ts">
/**
 * Section Mes Achats
 * Gestion des dossiers PDF achetés à l'unité
 */
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

/**
 * Type pour un achat
 */
interface Purchase {
    id: string
    title: string
    date: string
    price: number
    invoiceUrl: string
    pdfUrl: string
}

/**
 * Liste des achats (mock data)
 */
const purchases = ref<Purchase[]>([
    {
        id: 'ACH-2024-001',
        title: 'Consultation Stratégie Marketing Digital',
        date: '2024-03-15',
        price: 49.90,
        invoiceUrl: '#',
        pdfUrl: '#'
    },
    {
        id: 'ACH-2024-002',
        title: 'Dossier Optimisation SEO Avancée',
        date: '2024-03-10',
        price: 39.90,
        invoiceUrl: '#',
        pdfUrl: '#'
    },
    {
        id: 'ACH-2024-003',
        title: 'Guide Réseaux Sociaux pour Entrepreneurs',
        date: '2024-02-28',
        price: 29.90,
        invoiceUrl: '#',
        pdfUrl: '#'
    }
])

/**
 * Icônes
 */
const icons = computed(() => ({
    bookOpen: byPrefixAndName.fas?.['book-open'],
    download: byPrefixAndName.fas?.['download'],
    receipt: byPrefixAndName.fas?.['receipt'],
    shoppingBag: byPrefixAndName.fas?.['shopping-bag'],
    fileLines: byPrefixAndName.fas?.['file-lines'],
}))

const getIcon = (iconKey: 'bookOpen' | 'download' | 'receipt' | 'shoppingBag' | 'fileLines'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

/**
 * Formater la date (version longue)
 */
const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date)
}

/**
 * Formater la date (version courte pour le tableau)
 */
const formatDateShort = (dateString: string): string => {
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

/**
 * Consulter le PDF
 */
const viewPdf = (purchase: Purchase) => {
    try {
        // TODO: Implémenter l'ouverture du PDF
        console.log('Ouverture PDF:', purchase.title)
        toast.success(`Ouverture de "${purchase.title}"`)
    } catch (error) {
        console.error('Erreur:', error)
        toast.error('Impossible d\'ouvrir le PDF')
    }
}

/**
 * Total dépensé
 */
const totalSpent = computed(() => {
    return purchases.value.reduce((sum, p) => sum + p.price, 0)
})
</script>

<template>
    <div class="space-y-4">
        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardContent class="pt-6">
                    <div class="flex items-center gap-4">
                        <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <FontAwesomeIcon v-if="getIcon('shoppingBag')" :icon="getIcon('shoppingBag')"
                                class="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p class="text-sm text-neutral-500" style="font-family: Roboto, sans-serif;">
                                Nombre d'achats
                            </p>
                            <p class="text-2xl font-bold text-neutral-800" style="font-family: Roboto, sans-serif;">
                                {{ purchases.length }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="pt-6">
                    <div class="flex items-center gap-4">
                        <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <FontAwesomeIcon v-if="getIcon('receipt')" :icon="getIcon('receipt')"
                                class="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p class="text-sm text-neutral-500" style="font-family: Roboto, sans-serif;">
                                Total dépensé
                            </p>
                            <p class="text-2xl font-bold text-neutral-800" style="font-family: Roboto, sans-serif;">
                                {{ formatPrice(totalSpent) }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Liste des achats -->
        <Card>
            <CardHeader>
                <CardTitle style="font-family: Roboto, sans-serif;">Mes achats</CardTitle>
                <CardDescription style="font-family: Roboto, sans-serif;">
                    Retrouvez tous vos dossiers et factures
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="purchases.length === 0" class="text-center py-12">
                    <FontAwesomeIcon v-if="getIcon('shoppingBag')" :icon="getIcon('shoppingBag')"
                        class="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p class="text-neutral-500" style="font-family: Roboto, sans-serif;">
                        Vous n'avez encore effectué aucun achat
                    </p>
                </div>

                <template v-else>
                    <!-- Version Desktop - Tableau -->
                    <div class="hidden md:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead class="font-medium" style="font-family: Roboto, sans-serif;">
                                        Dossier
                                    </TableHead>
                                    <TableHead class="font-medium w-[100px]" style="font-family: Roboto, sans-serif;">
                                        Date
                                    </TableHead>
                                    <TableHead class="font-medium text-right w-[90px]"
                                        style="font-family: Roboto, sans-serif;">
                                        Montant
                                    </TableHead>
                                    <TableHead class="font-medium text-center w-[50px]"
                                        style="font-family: Roboto, sans-serif;">
                                        Consulter
                                    </TableHead>
                                    <TableHead class="font-medium text-center w-[50px]"
                                        style="font-family: Roboto, sans-serif;">
                                        Facture
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="purchase in purchases" :key="purchase.id">
                                    <TableCell>
                                        <div class="flex items-center gap-2">
                                            <FontAwesomeIcon v-if="getIcon('fileLines')" :icon="getIcon('fileLines')"
                                                class="w-4 h-4 text-neutral-400 shrink-0" />
                                            <div class="min-w-0">
                                                <p class="font-medium text-neutral-800 truncate"
                                                    style="font-family: Roboto, sans-serif;">
                                                    {{ purchase.title }}
                                                </p>
                                                <p class="text-xs text-neutral-500 font-mono">
                                                    {{ purchase.id }}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell class="text-neutral-600 text-sm"
                                        style="font-family: Roboto, sans-serif;">
                                        {{ formatDateShort(purchase.date) }}
                                    </TableCell>
                                    <TableCell class="text-right font-medium text-neutral-800"
                                        style="font-family: Roboto, sans-serif;">
                                        {{ formatPrice(purchase.price) }}
                                    </TableCell>
                                    <TableCell class="text-center">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger as-child>
                                                    <Button variant="ghost" size="icon-sm" @click="viewPdf(purchase)">
                                                        <FontAwesomeIcon v-if="getIcon('bookOpen')"
                                                            :icon="getIcon('bookOpen')" class="w-4 h-4 text-primary" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p style="font-family: Roboto, sans-serif;">Consulter</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell class="text-center">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger as-child>
                                                    <Button variant="ghost" size="icon-sm"
                                                        @click="downloadInvoice(purchase)">
                                                        <FontAwesomeIcon v-if="getIcon('download')"
                                                            :icon="getIcon('download')"
                                                            class="w-4 h-4 text-neutral-800" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p style="font-family: Roboto, sans-serif;">Facture</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <!-- Version Mobile - Cards -->
                    <div class="md:hidden space-y-3">
                        <Card v-for="purchase in purchases" :key="purchase.id" class="overflow-hidden">
                            <CardContent class="p-4">
                                <div class="space-y-3">
                                    <!-- Titre et icône -->
                                    <div class="flex items-start gap-3">
                                        <div
                                            class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FontAwesomeIcon v-if="getIcon('fileLines')" :icon="getIcon('fileLines')"
                                                class="w-4 h-4 text-primary" />
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <h3 class="font-medium text-neutral-800 text-sm leading-tight mb-1"
                                                style="font-family: Roboto, sans-serif;">
                                                {{ purchase.title }}
                                            </h3>
                                            <p class="text-xs text-neutral-500 font-mono">{{ purchase.id }}</p>
                                        </div>
                                    </div>

                                    <!-- Info date et prix -->
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-neutral-600" style="font-family: Roboto, sans-serif;">
                                            {{ formatDate(purchase.date) }}
                                        </span>
                                        <span class="font-bold text-neutral-800"
                                            style="font-family: Roboto, sans-serif;">
                                            {{ formatPrice(purchase.price) }}
                                        </span>
                                    </div>

                                    <!-- Actions -->
                                    <div class="grid grid-cols-2 gap-2 pt-2">
                                        <Button variant="ghost" size="xs" @click="viewPdf(purchase)" class="w-full">
                                            <FontAwesomeIcon v-if="getIcon('bookOpen')" :icon="getIcon('bookOpen')"
                                                class="w-3 h-3 mr-1.5 text-primary" />
                                            <span class="text-xs" style="font-family: Roboto, sans-serif;">
                                                Consulter
                                            </span>
                                        </Button>
                                        <Button variant="ghost" size="xs" @click="downloadInvoice(purchase)"
                                            class="w-full">
                                            <FontAwesomeIcon v-if="getIcon('download')" :icon="getIcon('download')"
                                                class="w-3 h-3 mr-1.5 text-neutral-800" />
                                            <span class="text-xs" style="font-family: Roboto, sans-serif;">
                                                Facture
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </template>
            </CardContent>
        </Card>
    </div>
</template>
