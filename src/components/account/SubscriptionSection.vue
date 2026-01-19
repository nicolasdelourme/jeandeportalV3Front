<script setup lang="ts">
/**
 * Section Abonnements
 * Affichage et gestion des abonnements aux thématiques
 */
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

/**
 * Types
 */
type SubscriptionStatus = 'active' | 'suspended' | 'cancelled'
type ThemeType = 'metaux' | 'portefeuille' | 'liberte' | 'bonus'

interface Subscription {
    id: string
    theme: ThemeType
    themeName: string
    plan: string
    billingPeriod: 'mensuel' | 'annuel'
    status: SubscriptionStatus
    price: number
    discount?: number
    subscribedSince: string
    nextBilling: string | null
    errorMessage?: string
}

interface Invoice {
    id: string
    theme: ThemeType
    label: string
    date: string
    amount: number
    downloadUrl: string
}

/**
 * Icônes
 */
const icons = computed(() => ({
    check: byPrefixAndName.fas?.['check'],
    calendar: byPrefixAndName.fas?.['calendar'],
    chevronDown: byPrefixAndName.fas?.['chevron-down'],
    fileLines: byPrefixAndName.fas?.['file-lines'],
    download: byPrefixAndName.fas?.['download'],
    fileInvoice: byPrefixAndName.fas?.['file-invoice'],
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition | undefined => {
    return icons.value[iconKey] as IconDefinition | undefined
}

/**
 * Données statiques pour les abonnements actifs/suspendus
 */
const activeSubscriptions = ref<Subscription[]>([
    {
        id: '1',
        theme: 'liberte',
        themeName: 'Finance',
        plan: 'Standard',
        billingPeriod: 'mensuel',
        status: 'suspended',
        price: 14.90,
        subscribedSince: '2025-12-10',
        nextBilling: null,
        errorMessage: 'Votre moyen de paiement a été refusé. Merci de le mettre à jour.',
    },
    {
        id: '2',
        theme: 'portefeuille',
        themeName: 'Portefeuille permanent',
        plan: 'Premium',
        billingPeriod: 'annuel',
        status: 'active',
        price: 149,
        discount: 25,
        subscribedSince: '2025-12-10',
        nextBilling: '2026-12-10',
    },
])

/**
 * Données statiques pour les abonnements résiliés
 */
const cancelledSubscriptions = ref<Subscription[]>([
    {
        id: '3',
        theme: 'metaux',
        themeName: 'Métaux Précieux',
        plan: 'Standard',
        billingPeriod: 'mensuel',
        status: 'cancelled',
        price: 14.90,
        subscribedSince: '2025-12-10',
        nextBilling: null,
    },
])

/**
 * Données statiques pour les factures
 */
const invoices = ref<Invoice[]>([
    {
        id: '1',
        theme: 'metaux',
        label: 'Standard - Métaux Précieux (mensuel)',
        date: '10/02/2026',
        amount: 14.90,
        downloadUrl: '#',
    },
    {
        id: '2',
        theme: 'metaux',
        label: 'Standard - Métaux Précieux (mensuel)',
        date: '10/01/2026',
        amount: 14.90,
        downloadUrl: '#',
    },
    {
        id: '3',
        theme: 'metaux',
        label: 'Standard - Métaux Précieux (mensuel)',
        date: '10/12/2025',
        amount: 14.90,
        downloadUrl: '#',
    },
    {
        id: '4',
        theme: 'portefeuille',
        label: 'Premium - Portefeuille permanent (annuel)',
        date: '10/12/2025',
        amount: 149,
        downloadUrl: '#',
    },
])

/**
 * État du collapsible historique
 */
const isHistoryOpen = ref(false)

/**
 * Obtenir la classe de bordure selon le thème
 */
const getThemeBorderClass = (theme: ThemeType): string => {
    const borderClasses: Record<ThemeType, string> = {
        metaux: 'border-[var(--color-theme-metaux)] bg-[var(--color-theme-metaux)]/20',
        portefeuille: 'border-[var(--color-theme-portefeuille)] bg-[var(--color-theme-portefeuille)]/20',
        liberte: 'border-[var(--color-theme-liberte)] bg-[var(--color-theme-liberte)]/20',
        bonus: 'border-[var(--color-theme-bonus)] bg-[var(--color-theme-bonus)]/20',
    }
    return borderClasses[theme]
}

/**
 * Obtenir la classe de couleur d'icône selon le thème
 */
const getThemeIconClass = (theme: ThemeType): string => {
    const iconClasses: Record<ThemeType, string> = {
        metaux: 'text-[var(--color-theme-metaux)]',
        portefeuille: 'text-[var(--color-theme-portefeuille)]',
        liberte: 'text-[var(--color-theme-liberte)]',
        bonus: 'text-[var(--color-theme-bonus)]',
    }
    return iconClasses[theme]
}

/**
 * Obtenir la classe de fond selon le thème (opacité 20%)
 */
const getThemeBgClass = (theme: ThemeType): string => {
    const bgClasses: Record<ThemeType, string> = {
        metaux: 'bg-[var(--color-theme-metaux)]/20',
        portefeuille: 'bg-[var(--color-theme-portefeuille)]/20',
        liberte: 'bg-[var(--color-theme-liberte)]/20',
        bonus: 'bg-[var(--color-theme-bonus)]/20',
    }
    return bgClasses[theme]
}

/**
 * Formatter le label de l'abonnement
 * Format: {ThémaNom} - {Plan} ({période})
 */
const formatSubscriptionLabel = (sub: Subscription): string => {
    return `${sub.themeName} - ${sub.plan} (${sub.billingPeriod})`
}

/**
 * Formatter le prix
 */
const formatPrice = (price: number, period: 'mensuel' | 'annuel'): string => {
    return `${price}€/${period === 'mensuel' ? 'mois' : 'ans'}`
}
</script>

<template>
    <div class="space-y-6">
        <!-- Card Abonnements -->
        <Card>
            <CardHeader>
                <CardTitle>Abonnements</CardTitle>
                <CardDescription>
                    Gérez votre abonnement aux consultations
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <!-- Liste des abonnements actifs/suspendus -->
                <div
                    v-for="subscription in activeSubscriptions"
                    :key="subscription.id"
                    :class="[
                        'border rounded-lg p-4',
                        getThemeBorderClass(subscription.theme)
                    ]"
                >
                    <!-- Header avec titre et badge -->
                    <div class="flex items-start justify-between mb-3">
                        <h3 class="font-semibold text-sm text-neutral-900">
                            {{ formatSubscriptionLabel(subscription) }}
                        </h3>
                        <Badge
                            v-if="subscription.status === 'active'"
                            class="bg-green-500 text-white"
                        >
                            <FontAwesomeIcon
                                v-if="getIcon('check')"
                                :icon="getIcon('check')!"
                                class="w-3 h-3 mr-1"
                            />
                            Actif
                        </Badge>
                        <Badge
                            v-else-if="subscription.status === 'suspended'"
                            class="bg-red-500 text-white"
                        >
                            Suspendu
                        </Badge>
                    </div>

                    <!-- Message d'erreur si suspendu -->
                    <p
                        v-if="subscription.status === 'suspended'"
                        class="text-sm text-red-500 mb-3"
                    >
                        Votre moyen de paiement a été refusé.
                        <a href="#" class="underline hover:text-red-600">Merci de le mettre a jour.</a>
                    </p>

                    <!-- Détails -->
                    <div class="space-y-2 text-sm">
                        <!-- Prix (uniquement pour abonnements actifs) -->
                        <div v-if="subscription.status === 'active'" class="flex justify-between">
                            <span class="text-neutral-600">Prix</span>
                            <span class="font-semibold text-neutral-900">
                                {{ formatPrice(subscription.price, subscription.billingPeriod) }}
                            </span>
                        </div>

                        <!-- Réduction -->
                        <div v-if="subscription.discount" class="flex justify-between items-center">
                            <span class="text-neutral-600">Réduction appliquée</span>
                            <Badge variant="outline" class="text-xs">
                                {{ subscription.discount }}%
                            </Badge>
                        </div>

                        <!-- Abonné depuis -->
                        <div class="flex justify-between">
                            <span class="text-neutral-600 flex items-center gap-1.5">
                                <FontAwesomeIcon
                                    v-if="getIcon('calendar')"
                                    :icon="getIcon('calendar')!"
                                    class="w-3.5 h-3.5"
                                />
                                Abonné depuis
                            </span>
                            <span class="text-neutral-900">{{ subscription.subscribedSince }}</span>
                        </div>

                        <!-- Prochain prélèvement -->
                        <div class="flex justify-between">
                            <span class="text-neutral-600 flex items-center gap-1.5">
                                <FontAwesomeIcon
                                    v-if="getIcon('calendar')"
                                    :icon="getIcon('calendar')!"
                                    class="w-3.5 h-3.5"
                                />
                                Prochain prélèvement
                            </span>
                            <span :class="subscription.nextBilling ? 'text-neutral-900' : 'text-red-500'">
                                {{ subscription.nextBilling || 'Suspendu' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Historique d'abonnement (collapsible) -->
                <Collapsible v-model:open="isHistoryOpen" class="border-t pt-4">
                    <CollapsibleTrigger class="flex items-center justify-between w-full py-2 hover:bg-neutral-50 rounded px-2 -mx-2">
                        <span class="text-sm font-medium text-neutral-700">Historique d'abonnement</span>
                        <FontAwesomeIcon
                            v-if="getIcon('chevronDown')"
                            :icon="getIcon('chevronDown')!"
                            :class="[
                                'w-4 h-4 text-neutral-500 transition-transform',
                                isHistoryOpen ? 'rotate-180' : ''
                            ]"
                        />
                    </CollapsibleTrigger>
                    <CollapsibleContent class="pt-4 space-y-3">
                        <div
                            v-for="subscription in cancelledSubscriptions"
                            :key="subscription.id"
                            :class="[
                                'border rounded-lg p-4',
                                getThemeBorderClass(subscription.theme)
                            ]"
                        >
                            <!-- Header avec titre et badge -->
                            <div class="flex items-start justify-between mb-3">
                                <h3 class="font-semibold text-sm text-neutral-900">
                                    {{ formatSubscriptionLabel(subscription) }}
                                </h3>
                                <Badge variant="secondary" class="bg-neutral-800 text-white">
                                    Résilié
                                </Badge>
                            </div>

                            <!-- Détails -->
                            <div class="space-y-2 text-sm">
                                <!-- Abonné depuis -->
                                <div class="flex justify-between">
                                    <span class="text-neutral-600 flex items-center gap-1.5">
                                        <FontAwesomeIcon
                                            v-if="getIcon('calendar')"
                                            :icon="getIcon('calendar')!"
                                            class="w-3.5 h-3.5"
                                        />
                                        Abonné depuis
                                    </span>
                                    <span class="text-neutral-900">{{ subscription.subscribedSince }}</span>
                                </div>

                                <!-- Prochain prélèvement -->
                                <div class="flex justify-between">
                                    <span class="text-neutral-600 flex items-center gap-1.5">
                                        <FontAwesomeIcon
                                            v-if="getIcon('calendar')"
                                            :icon="getIcon('calendar')!"
                                            class="w-3.5 h-3.5"
                                        />
                                        Prochain prélèvement
                                    </span>
                                    <span class="text-neutral-500">Résilié</span>
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>

        <!-- Card Sécurité -->
        <Card>
            <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                    Gérez la sécurité de votre compte
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <!-- Moyen de paiement -->
                <div class="flex items-center justify-between py-2">
                    <div class="space-y-0.5">
                        <h3 class="text-sm font-semibold text-neutral-900">
                            Moyen de paiement
                        </h3>
                        <p class="text-sm text-muted-foreground">
                            Modifiez votre mot de passe pour sécuriser votre compte
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" class="text-red-500 hover:text-red-600 hover:bg-transparent">
                        Changer le moyen de paiement
                    </Button>
                </div>

                <!-- Adresse de livraison -->
                <div class="flex items-center justify-between py-2">
                    <div class="space-y-0.5">
                        <h3 class="text-sm font-semibold text-neutral-900">
                            Adresse de livraison
                        </h3>
                        <p class="text-sm text-muted-foreground">
                            Modifiez l'adresse utilisée pour la livraison
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" class="text-neutral-900 hover:text-neutral-900 hover:bg-transparent font-medium">
                        Modifier l'adresse de livraison
                    </Button>
                </div>

                <!-- Adresse de facturation -->
                <div class="flex items-center justify-between py-2">
                    <div class="space-y-0.5">
                        <h3 class="text-sm font-semibold text-neutral-900">
                            Adresse de facturation
                        </h3>
                        <p class="text-sm text-muted-foreground">
                            Modifiez l'adresse utilisée pour la facturation
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" class="text-neutral-900 hover:text-neutral-900 hover:bg-transparent font-medium">
                        Modifier l'adresse de facturation
                    </Button>
                </div>
            </CardContent>
        </Card>

        <!-- Card Historique de facturation -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <FontAwesomeIcon
                        v-if="getIcon('fileInvoice')"
                        :icon="getIcon('fileInvoice')!"
                        class="w-5 h-5"
                    />
                    Historique de facturation
                </CardTitle>
                <CardDescription>
                    Consultez vos factures d'abonnement
                </CardDescription>
            </CardHeader>
            <CardContent>
                <!-- Tableau des factures -->
                <div class="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow class="hover:bg-transparent">
                                <TableHead>Article</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead class="text-right">Montant</TableHead>
                                <TableHead class="text-center">Facture</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="invoice in invoices"
                                :key="invoice.id"
                                :class="getThemeBgClass(invoice.theme)"
                            >
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <FontAwesomeIcon
                                            v-if="icons.fileLines"
                                            :icon="icons.fileLines"
                                            :class="['w-4 h-4', getThemeIconClass(invoice.theme)]"
                                        />
                                        <span>{{ invoice.label }}</span>
                                    </div>
                                </TableCell>
                                <TableCell class="text-muted-foreground">{{ invoice.date }}</TableCell>
                                <TableCell class="text-right">{{ invoice.amount }} €</TableCell>
                                <TableCell class="text-center">
                                    <Button variant="ghost" color="secondary" size="icon" class="h-8 w-8">
                                        <FontAwesomeIcon
                                            v-if="icons.download"
                                            :icon="icons.download"
                                            class="w-4 h-4"
                                        />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
