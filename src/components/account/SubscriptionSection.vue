<script setup lang="ts">
/**
 * Section Abonnement
 * Gestion de l'abonnement aux consultations
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const router = useRouter()

/**
 * Données d'abonnement (simulées)
 */
const subscription = ref({
    isActive: true,
    plan: 'Premium',
    theme: 'consultations-nd-metauxprecieux',
    themeName: 'Métaux Précieux',
    quantity: 3,
    price: 75, // Prix après réduction
    discount: 25, // Pourcentage de réduction
    nextBillingDate: '2025-12-10',
})

/**
 * Icônes
 */
const icons = computed(() => ({
    crown: byPrefixAndName.fas?.['crown'],
    calendarDays: byPrefixAndName.fas?.['calendar-days'],
    receipt: byPrefixAndName.fas?.['receipt'],
}))

const getIcon = (iconKey: 'crown' | 'calendarDays' | 'receipt'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

/**
 * Naviguer vers la page d'abonnement
 */
const goToSubscriptionPage = () => {
    router.push('/consultations/invitation')
}

/**
 * Naviguer vers la page des factures d'abonnement
 */
const goToInvoicesPage = () => {
    router.push('/mon-compte/factures-abonnement')
}

/**
 * Naviguer vers le tunnel d'annulation
 */
const goToCancelSubscription = () => {
    router.push('/mon-compte/annuler-abonnement')
}
</script>

<template>
    <div class="space-y-6">
        <!-- Carte d'abonnement actif -->
        <Card v-if="subscription.isActive">
            <CardHeader>
                <div class="flex items-center justify-between">
                    <div>
                        <CardTitle style="font-family: Roboto, sans-serif;">Abonnement actif</CardTitle>
                        <CardDescription style="font-family: Roboto, sans-serif;">
                            Gérez votre abonnement aux consultations
                        </CardDescription>
                    </div>
                    <Badge variant="default" class="bg-green-500">
                        <FontAwesomeIcon v-if="getIcon('crown')" :icon="getIcon('crown')" class="w-3 h-3 mr-1" />
                        Actif
                    </Badge>
                </div>
            </CardHeader>
            <CardContent class="space-y-6">
                <!-- Détails de l'abonnement -->
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <p class="text-sm font-medium text-neutral-500 mb-1" style="font-family: Roboto, sans-serif;">
                            Formule
                        </p>
                        <p class="text-base font-bold text-neutral-800" style="font-family: Roboto, sans-serif;">
                            {{ subscription.plan }} - {{ subscription.themeName }}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-neutral-500 mb-1" style="font-family: Roboto, sans-serif;">
                            Quantité
                        </p>
                        <p class="text-base font-bold text-neutral-800" style="font-family: Roboto, sans-serif;">
                            {{ subscription.quantity }} consultations/mois
                        </p>
                    </div>
                </div>

                <Separator />

                <!-- Tarification -->
                <div class="bg-neutral-50 rounded-lg p-4 space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-neutral-600" style="font-family: Roboto, sans-serif;">
                            Prix mensuel
                        </span>
                        <span class="text-lg font-bold text-neutral-800" style="font-family: Roboto, sans-serif;">
                            {{ subscription.price }}€/mois
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-neutral-600" style="font-family: Roboto, sans-serif;">
                            Réduction appliquée
                        </span>
                        <Badge variant="secondary">-{{ subscription.discount }}%</Badge>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-neutral-600" style="font-family: Roboto, sans-serif;">
                            <FontAwesomeIcon v-if="getIcon('calendarDays')" :icon="getIcon('calendarDays')" class="w-4 h-4 mr-1" />
                            Prochain prélèvement
                        </span>
                        <span class="text-sm font-medium text-neutral-800" style="font-family: Roboto, sans-serif;">
                            {{ subscription.nextBillingDate }}
                        </span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-4">
                    <Button color="primary" @click="goToSubscriptionPage">
                        <span class="font-medium" style="font-family: Roboto, sans-serif;">
                            Modifier mon abonnement
                        </span>
                    </Button>

                    <Button variant="outline" @click="goToCancelSubscription">
                        <span class="font-medium" style="font-family: Roboto, sans-serif;">
                            Annuler l'abonnement
                        </span>
                    </Button>
                </div>
            </CardContent>
        </Card>

        <!-- Pas d'abonnement -->
        <Card v-else>
            <CardHeader>
                <CardTitle style="font-family: Roboto, sans-serif;">Aucun abonnement actif</CardTitle>
                <CardDescription style="font-family: Roboto, sans-serif;">
                    Découvrez nos formules d'abonnement aux consultations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="text-center py-8">
                    <p class="text-neutral-600 mb-6" style="font-family: Roboto, sans-serif;">
                        Accédez à des consultations exclusives avec nos experts en finance et patrimoine.
                    </p>
                    <Button color="primary" size="lg" @click="goToSubscriptionPage">
                        <span class="font-bold" style="font-family: Roboto, sans-serif;">
                            Découvrir les formules
                        </span>
                    </Button>
                </div>
            </CardContent>
        </Card>

        <!-- Historique de facturation -->
        <Card>
            <CardHeader>
                <div class="flex items-center justify-between">
                    <div>
                        <CardTitle style="font-family: Roboto, sans-serif;">
                            <FontAwesomeIcon v-if="getIcon('receipt')" :icon="getIcon('receipt')" class="w-5 h-5 mr-2" />
                            Historique de facturation
                        </CardTitle>
                        <CardDescription style="font-family: Roboto, sans-serif;">
                            Consultez vos factures d'abonnement
                        </CardDescription>
                    </div>
                    <Button variant="outline" @click="goToInvoicesPage">
                        <FontAwesomeIcon :icon="['fas', 'arrow-right']" class="mr-2" />
                        Voir les factures
                    </Button>
                </div>
            </CardHeader>
        </Card>
    </div>
</template>
