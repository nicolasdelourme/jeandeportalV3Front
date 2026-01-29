<script setup lang="ts">
/**
 * Section Abonnements
 * Affichage et gestion des abonnements aux thématiques
 * Données chargées depuis l'API /fetchUserSubscription
 */
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
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
import { useUserSubscriptionStore } from '@/stores/user-subscription.store'
import type { UserSubscription, UserInvoice } from '@/types/user-subscription-api.types'
import type { ThemeType } from '@/components/ui/themed-card'
import PaymentMethodDialog from '@/components/account/PaymentMethodDialog.vue'
import { toast } from 'vue-sonner'

/**
 * Store des abonnements utilisateur
 */
const store = useUserSubscriptionStore()

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
    check: byPrefixAndName.fas?.['check'],
    calendar: byPrefixAndName.fas?.['calendar'],
    chevronDown: byPrefixAndName.fas?.['chevron-down'],
    fileLines: byPrefixAndName.fas?.['file-lines'],
    download: byPrefixAndName.fas?.['download'],
    fileInvoice: byPrefixAndName.fas?.['file-invoice'],
    spinner: byPrefixAndName.fas?.['spinner'],
    triangleExclamation: byPrefixAndName.fas?.['triangle-exclamation'],
    undo: byPrefixAndName.fas?.['undo'],
    newspaper: byPrefixAndName.far?.['newspaper'],
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition | undefined => {
    return icons.value[iconKey] as IconDefinition | undefined
}

/**
 * État du collapsible historique
 */
const isHistoryOpen = ref(false)

/**
 * État pour la modal de modification du moyen de paiement
 */
const isPaymentDialogOpen = ref(false)
const stripePublicKey = ref<string | null>(null)
const stripeClientSecret = ref<string | null>(null)

/**
 * Ouvrir la modal de modification du moyen de paiement
 */
async function handleUpdatePayment() {
  const result = await store.updatePaymentMethod()
  if (result?.status === 'success' && result.stripePublicKey && result.client_secret) {
    stripePublicKey.value = result.stripePublicKey
    stripeClientSecret.value = result.client_secret
    isPaymentDialogOpen.value = true
  }
}

/**
 * Callback succès de la mise à jour du paiement
 */
function onPaymentSuccess() {
  store.clearPaymentResult()
}

/**
 * Callback erreur de la mise à jour du paiement
 */
function onPaymentError(message: string) {
  toast.error(message)
}

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
const formatSubscriptionLabel = (sub: UserSubscription): string => {
    return `${sub.themeName} - ${sub.plan} (${sub.billingPeriod})`
}

/**
 * Formatter le prix
 */
const formatPrice = (price: number, period: 'mensuel' | 'annuel'): string => {
    return `${price}€/${period === 'mensuel' ? 'mois' : 'an'}`
}

/**
 * Formatter le montant d'une facture
 */
const formatAmount = (amount: number): string => {
    return amount.toFixed(2).replace('.', ',')
}

/**
 * Ouvrir une facture dans un nouvel onglet
 */
const openInvoice = (invoice: UserInvoice): void => {
    if (invoice.downloadUrl) {
        window.open(invoice.downloadUrl, '_blank', 'noopener,noreferrer')
    }
}
</script>

<template>
    <div class="space-y-6">
        <!-- État de chargement -->
        <div v-if="store.isLoading" class="text-center py-12">
            <FontAwesomeIcon
                v-if="getIcon('spinner')"
                :icon="getIcon('spinner')!"
                class="w-8 h-8 text-neutral-400 animate-spin mb-4"
            />
            <p class="text-neutral-600">Chargement de vos abonnements...</p>
        </div>

        <!-- État d'erreur -->
        <div v-else-if="store.error" class="text-center py-12">
            <FontAwesomeIcon
                v-if="getIcon('triangleExclamation')"
                :icon="getIcon('triangleExclamation')!"
                class="w-8 h-8 text-destructive mb-4"
            />
            <p class="text-destructive mb-4">{{ store.error }}</p>
            <Button variant="outline" @click="store.refresh()">
                <FontAwesomeIcon
                    v-if="getIcon('undo')"
                    :icon="getIcon('undo')!"
                    class="w-4 h-4 mr-2"
                />
                Réessayer
            </Button>
        </div>

        <!-- Contenu principal -->
        <template v-else>
            <!-- Card Abonnements -->
            <Card>
                <CardHeader>
                    <CardTitle>Abonnements</CardTitle>
                    <CardDescription>
                        Gérez votre abonnement aux consultations
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <!-- Message si aucun abonnement -->
                    <Empty
                        v-if="store.activeSubscriptions.length === 0 && store.cancelledSubscriptions.length === 0"
                        title="Aucun abonnement"
                        description="Vous n'avez pas encore souscrit à un abonnement."
                        class="py-8"
                    >
                        <template #icon>
                            <FontAwesomeIcon
                                v-if="getIcon('newspaper')"
                                :icon="getIcon('newspaper')!"
                                class="h-10 w-10 text-neutral-400"
                            />
                        </template>
                    </Empty>

                    <!-- Liste des abonnements actifs/suspendus -->
                    <div
                        v-for="subscription in store.activeSubscriptions"
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
                            class="text-sm text-destructive mb-3"
                        >
                            Votre moyen de paiement a été refusé.
                            <Button
                                type="button"
                                :disabled="store.isUpdatingPayment"
                                variant="link"
                                color="destructive"
                                class="underline px-0"
                                @click="handleUpdatePayment"
                            >
                                <FontAwesomeIcon
                                    v-if="store.isUpdatingPayment && getIcon('spinner')"
                                    :icon="getIcon('spinner')!"
                                    class="w-3 h-3 mr-1 animate-spin"
                                />
                                Merci de le mettre à jour.
                            </Button>
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
                    <Collapsible
                        v-if="store.cancelledSubscriptions.length > 0"
                        v-model:open="isHistoryOpen"
                        class="border-t pt-4"
                    >
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
                                v-for="subscription in store.cancelledSubscriptions"
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
                        <Button
                            :disabled="store.isUpdatingPayment || store.activeSubscriptions.length === 0"
                            variant="ghost"
                            size="sm"
                            class="text-red-500 hover:text-red-600 hover:bg-transparent"
                            @click="handleUpdatePayment"
                        >
                            <FontAwesomeIcon
                                v-if="store.isUpdatingPayment && getIcon('spinner')"
                                :icon="getIcon('spinner')!"
                                class="w-4 h-4 mr-2 animate-spin"
                            />
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
                    <!-- Message si aucune facture -->
                    <Empty
                        v-if="store.invoices.length === 0"
                        title="Aucune facture"
                        description="Vous n'avez pas encore de facture d'abonnement."
                        class="py-8"
                    >
                        <template #icon>
                            <FontAwesomeIcon
                                v-if="getIcon('fileInvoice')"
                                :icon="getIcon('fileInvoice')!"
                                class="h-10 w-10 text-neutral-400"
                            />
                        </template>
                    </Empty>

                    <!-- Tableau des factures -->
                    <div v-else class="border rounded-lg overflow-hidden">
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
                                    v-for="invoice in store.invoices"
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
                                    <TableCell class="text-right">{{ formatAmount(invoice.amount) }} €</TableCell>
                                    <TableCell class="text-center">
                                        <Button
                                            variant="ghost"
                                            color="secondary"
                                            size="icon"
                                            class="h-8 w-8"
                                            aria-label="Télécharger la facture"
                                            @click="openInvoice(invoice)"
                                        >
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
        </template>

        <!-- Modal modification moyen de paiement -->
        <PaymentMethodDialog
            v-model:open="isPaymentDialogOpen"
            :stripe-public-key="stripePublicKey"
            :client-secret="stripeClientSecret"
            @success="onPaymentSuccess"
            @error="onPaymentError"
        />
    </div>
</template>
