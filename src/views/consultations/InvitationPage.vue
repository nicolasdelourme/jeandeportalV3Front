<script setup lang="ts">
/**
 * Page InvitationPage
 * Page d'abonnement aux consultations privées
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import SubscriptionCard from '@/components/consultations/abonnement/SubscriptionCard.vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const router = useRouter()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    gift: byPrefixAndName.fas?.['gift'],
    chartLine: byPrefixAndName.fas?.['chart-line'],
    info: byPrefixAndName.fas?.['circle-info'],
}))

const getIcon = (iconKey: 'gift' | 'chartLine' | 'info'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

/**
 * État des sélections avec ordre
 * Tableau d'IDs dans l'ordre de sélection
 */
const selectionOrder = ref<string[]>([])

/**
 * Configuration des abonnements
 */
const subscriptions = [
    {
        id: 'argent',
        title: "Les consultations privées de Nicolas Delourme: l'argent",
        color: 'consultations-nd-argent',
        badgeColor: 'consultations-nd-argent',
        price: 24,
        icon: 'https://www.figma.com/api/mcp/asset/8fbbbe08-cd3b-41e5-839e-b5b691634fb7',
        features: [
            '1 question prioritaire par mois',
            '1 question confidentielle par semestre',
            'Livret bonus après chaque consultation',
            'Toutes les publications présentées',
        ],
    },
    {
        id: 'metaux',
        title: 'Les consultations privées de Nicolas Delourme: les métaux précieux',
        color: 'consultations-nd-metauxprecieux',
        badgeColor: 'consultations-nd-metauxprecieux',
        price: 24,
        icon: 'https://www.figma.com/api/mcp/asset/8fbbbe08-cd3b-41e5-839e-b5b691634fb7',
        features: [
            '1 question prioritaire par mois',
            '1 question confidentielle par semestre',
            'Livret bonus après chaque consultation',
            'Toutes les publications présentées',
        ],
    },
    {
        id: 'patrimoine',
        title: 'Les consultations privées de Nicolas Delourme: le patrimoine',
        color: 'consultations-nd-patrimoine',
        badgeColor: 'consultations-nd-patrimoine',
        price: 24,
        icon: 'https://www.figma.com/api/mcp/asset/8fbbbe08-cd3b-41e5-839e-b5b691634fb7',
        features: [
            '1 question prioritaire par mois',
            '1 question confidentielle par semestre',
            'Livret bonus après chaque consultation',
            'Toutes les publications présentées',
        ],
    },
    {
        id: 'immobilier',
        title: "Les consultations privées de Nicolas Delourme: l'immobilier",
        color: 'consultations-nd-immobilier',
        badgeColor: 'consultations-nd-immobilier',
        price: 24,
        icon: 'https://www.figma.com/api/mcp/asset/8fbbbe08-cd3b-41e5-839e-b5b691634fb7',
        features: [
            '1 question prioritaire par mois',
            '1 question confidentielle par semestre',
            'Livret bonus après chaque consultation',
            'Toutes les publications présentées',
        ],
    },
]

/**
 * Configuration des prix
 */
const BASE_PRICE = 24
const DISCOUNTS = [0, 0.25, 0.50, 0.75]

/**
 * Calcule le prix pour une position donnée
 */
const getPriceForPosition = (position: number): number => {
    const discountRate = position >= 0 && position < DISCOUNTS.length ? DISCOUNTS[position]! : DISCOUNTS[DISCOUNTS.length - 1]!
    return BASE_PRICE * (1 - discountRate)
}

/**
 * Retourne la position d'un abonnement dans l'ordre de sélection
 * -1 si non sélectionné
 */
const getSubscriptionPosition = (id: string): number => {
    return selectionOrder.value.indexOf(id)
}

/**
 * Retourne la prochaine position disponible
 */
const nextAvailablePosition = computed(() => {
    return selectionOrder.value.length
})

/**
 * Calcul du prix total avec réductions
 */
const totalPrice = computed(() => {
    return selectionOrder.value.reduce((total, _id, index) => {
        return total + getPriceForPosition(index)
    }, 0)
})

const originalPrice = computed(() => {
    return selectionOrder.value.length * BASE_PRICE
})

const savings = computed(() => {
    return originalPrice.value - totalPrice.value
})

const annualSavings = computed(() => {
    return savings.value * 12
})

/**
 * Toggle sélection
 * Maintient l'ordre de sélection
 */
const toggleSubscription = (id: string) => {
    const index = selectionOrder.value.indexOf(id)
    if (index > -1) {
        // Désélection : retirer de l'ordre
        selectionOrder.value.splice(index, 1)
    } else {
        // Sélection : ajouter à la fin de l'ordre
        selectionOrder.value.push(id)
    }
}

/**
 * Action d'abonnement
 */
const handleSubscribe = () => {
    if (selectionOrder.value.length === 0) {
        return
    }
    // TODO: Rediriger vers le formulaire de paiement
    console.log('Abonnement:', selectionOrder.value)
    console.log('Prix total:', totalPrice.value)
}
</script>

<template>
    <DefaultLayout>
        <!-- Header avec banner -->
        <section class="bg-consultations-nd w-full">
            <div class="max-w-3xl mx-auto">
                <img src="https://www.figma.com/api/mcp/asset/91ec679e-7095-4746-acc5-cf8d9518c170"
                    alt="Les consultations privées de Nicolas Delourme" class="w-full h-auto"
                    style="clip-path: inset(3px 3px 3px 3px);" />
            </div>
        </section>

        <!-- Section info tarification -->
        <section class="bg-consultations-nd py-8">
            <div class="px-4 flex flex-col max-w-6xl mx-auto gap-4">
                <!-- Titre -->
                <h1 class="font-semibold text-3xl text-white text-center leading-10"
                    style="font-family: Roboto, sans-serif;">
                    Économisez jusqu'à 75% avec notre tarification dégressive !
                </h1>

                <!-- Alerte verte -->
                <div class="bg-green-100 border border-green-200 rounded p-3 flex items-center justify-center gap-3">
                    <FontAwesomeIcon v-if="getIcon('gift')" :icon="getIcon('gift')"
                        class="w-4 h-4 text-green-800 shrink-0" />
                    <p class="font-bold text-base text-green-800 text-center leading-6"
                        style="font-family: Roboto, sans-serif;">
                        Commencez gratuitement dès aujourd'hui ! Aucun paiement immédiat, résiliez à tout moment sans
                        frais.
                    </p>
                </div>

                <!-- Alerte bleue avec explication -->
                <div class="bg-cyan-100 border border-cyan-200 rounded p-4 flex flex-col gap-3">
                    <div class="flex items-center gap-3 justify-center">
                        <FontAwesomeIcon v-if="getIcon('info')" :icon="getIcon('info')"
                            class="w-4 h-4 text-cyan-900 shrink-0" />
                        <p class="font-medium text-base text-cyan-900 text-center leading-6"
                            style="font-family: Roboto, sans-serif;">
                            Plus vous cumulez d'abonnements, plus vous économisez !
                        </p>
                    </div>

                    <p class="font-normal text-base text-cyan-900 text-center leading-6"
                        style="font-family: Roboto, sans-serif;">
                        Progressez vers des réductions exceptionnelles :
                        <span class="font-medium">-25%</span> dès le 2ème,
                        <span class="font-medium">-50%</span> au 3ème, et jusqu'à
                        <span class="font-medium">-75%</span> sur le 4ème !
                    </p>

                    <!-- Exemple de calcul -->
                    <div class="bg-white rounded p-4">
                        <div class="flex items-center justify-center gap-4 flex-wrap">
                            <p class="font-bold text-base text-neutral-800" style="font-family: Roboto, sans-serif;">
                                4 abonnements =
                                <span class="text-green-600">60€/mois</span>
                                au lieu de
                                <span class="line-through text-neutral-600">96€</span>
                            </p>
                            <FontAwesomeIcon v-if="getIcon('chartLine')" :icon="getIcon('chartLine')"
                                class="w-4 h-4 text-neutral-600" />
                            <p class="font-bold text-base text-green-600" style="font-family: Roboto, sans-serif;">
                                432€ d'économies par an !
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section formulaire de sélection -->
        <section class="bg-consultations-nd py-4">
            <div class="max-w-6xl mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SubscriptionCard
                        v-for="subscription in subscriptions"
                        :key="subscription.id"
                        :id="subscription.id"
                        :title="subscription.title"
                        :color="subscription.color"
                        :features="subscription.features"
                        :icon="subscription.icon"
                        :selected="selectionOrder.includes(subscription.id)"
                        :position="getSubscriptionPosition(subscription.id)"
                        :next-position="nextAvailablePosition"
                        @toggle="toggleSubscription(subscription.id)" />
                </div>
            </div>
        </section>

        <!-- Section bouton d'abonnement -->
        <section class="bg-consultations-nd py-6">
            <div class="max-w-6xl mx-auto px-4 flex justify-center">
                <Button @click="handleSubscribe" color="green-600" size="lg" class="uppercase tracking-wider"
                    :class="selectionOrder.length === 0 ? 'opacity-65 cursor-not-allowed' : ''"
                    :disabled="selectionOrder.length === 0">
                    <p class="font-bold text-lg" style="font-family: Helvetica, sans-serif;">
                        Je m'abonne
                    </p>
                </Button>
            </div>
        </section>
    </DefaultLayout>
</template>
