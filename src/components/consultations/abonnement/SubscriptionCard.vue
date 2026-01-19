<script setup lang="ts">
/**
 * Composant SubscriptionCard
 * Carte d'abonnement pour une thématique de consultation avec tarification dégressive
 */
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface Props {
    /**
     * ID de la thématique
     */
    id: string
    /**
     * Titre de l'abonnement
     */
    title: string
    /**
     * Couleur de la thématique
     */
    color: string
    /**
     * Liste des avantages
     */
    features: string[]
    /**
     * Icône de la thématique
     */
    icon?: string
    /**
     * Si la carte est sélectionnée
     */
    selected?: boolean
    /**
     * Position dans l'ordre de sélection (-1 si non sélectionné)
     */
    position?: number
    /**
     * Prochaine position disponible (pour les cartes non sélectionnées)
     */
    nextPosition?: number
}

const props = withDefaults(defineProps<Props>(), {
    selected: false,
    position: -1,
    nextPosition: 0
})

const emit = defineEmits<{
    toggle: []
}>()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    check: byPrefixAndName.fas?.['check'],
    gift: byPrefixAndName.fas?.['gift'],
    square: byPrefixAndName.far?.['square'],
    squareCheck: byPrefixAndName.fas?.['square-check'],
}))

const getIcon = (iconKey: 'check' | 'gift' | 'square' | 'squareCheck'): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}

/**
 * Configuration des prix
 */
const BASE_PRICE = 24
const DISCOUNTS = [0, 0.25, 0.50, 0.75]

/**
 * Calcule le prix selon la position
 */
const getPriceForPosition = (pos: number): number => {
    const discountRate = pos >= 0 && pos < DISCOUNTS.length ? DISCOUNTS[pos]! : DISCOUNTS[DISCOUNTS.length - 1]!
    return BASE_PRICE * (1 - discountRate)
}

/**
 * Calcule le pourcentage de réduction
 */
const getDiscountPercent = (pos: number): number => {
    const discountRate = pos >= 0 && pos < DISCOUNTS.length ? DISCOUNTS[pos]! : DISCOUNTS[DISCOUNTS.length - 1]!
    return Math.round(discountRate * 100)
}

/**
 * Prix à afficher selon l'état de sélection
 */
const displayPosition = computed(() => {
    return props.selected ? props.position : props.nextPosition
})

/**
 * Prix final à afficher
 */
const finalPrice = computed(() => {
    return getPriceForPosition(displayPosition.value)
})

/**
 * Pourcentage de réduction
 */
const discountPercent = computed(() => {
    return getDiscountPercent(displayPosition.value)
})

/**
 * Texte du badge selon la position
 */
const badgeText = computed(() => {
    if (displayPosition.value === 0) return 'Essai gratuit de 6 jours !'
    return `Profitez de ${discountPercent.value}% de réduction`
})

/**
 * Label du badge top corner
 * - Si sélectionné ET a une réduction (position > 0) : affiche le pourcentage de réduction appliquée
 * - Si sélectionné SANS réduction (position 0) : PAS de badge
 * - Si non sélectionné ET aurait une réduction : affiche le pourcentage
 * - Si non sélectionné ET pas de réduction (position 0) : rien
 */
const showDiscountBadge = computed(() => {
    // Affiche le badge uniquement s'il y a une réduction (position > 0)
    return discountPercent.value > 0
})

const discountBadgeLabel = computed(() => {
    return `-${discountPercent.value}%`
})

/**
 * Prix barrés à afficher
 */
const crossedPrices = computed(() => {
    const prices: number[] = []
    const pos = displayPosition.value

    if (pos >= 1) prices.push(24)
    if (pos >= 2) prices.push(18)
    if (pos >= 3) prices.push(12)

    return prices
})

/**
 * Couleur du pseudo-élément ::after (overlay transparent)
 */
const overlayColor = computed(() => {
    if (!props.selected) return null

    // Map des couleurs vers leur code hexadécimal
    const colorMap: Record<string, string> = {
        'consultations-nd-metauxprecieux': '#dea600',
        'consultations-nd-immobilier': '#489886',
        'consultations-nd-argent': '#c8462f',
        'consultations-nd-patrimoine': '#33b9c9',
    }

    const hexColor = colorMap[props.color]
    if (!hexColor) return null

    // Convertir hex en RGB avec 10% d'opacité
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)

    return `rgba(${r}, ${g}, ${b}, 0.1)`
})

/**
 * Gestion du clic sur la carte
 */
const handleCardClick = () => {
    emit('toggle')
}
</script>

<template>
    <div @click="handleCardClick"
        class="subscription-card border border-neutral-200 rounded p-4 flex flex-col justify-between h-full cursor-pointer transition-all hover:shadow-lg relative bg-white"
        :class="{ 'has-overlay': selected }"
        :style="selected && overlayColor ? `--overlay-color: ${overlayColor};` : ''">
        <!-- Badge réduction (top right) -->
        <div v-if="showDiscountBadge"
            class="absolute top-2 right-2 bg-green-600 rounded px-2 py-1 text-white text-xs font-bold"
            style="z-index: 20;">
            {{ discountBadgeLabel }}
        </div>

        <div class="flex flex-col gap-2">
            <!-- Checkbox (square vide ou square-check) -->
            <div class="flex items-center justify-center pb-2">
                <div class="w-7 h-7 flex items-center justify-center">
                    <FontAwesomeIcon v-if="selected && getIcon('squareCheck')" :icon="getIcon('squareCheck')"
                        class="w-full h-full fa-xl" :style="{ color: `var(--color-${color})` }" />
                    <FontAwesomeIcon v-else-if="getIcon('square')" :icon="getIcon('square')"
                        class="w-full h-full text-neutral-400 fa-xl" />
                </div>
            </div>

            <!-- Badge essai gratuit / réduction -->
            <div class="flex items-center justify-center mb-2 min-h-7">
                <div class="px-2 py-1 rounded text-white text-xs font-bold text-center"
                    :style="{ background: `var(--color-${color})`, fontFamily: 'Roboto, sans-serif' }">
                    {{ badgeText }}
                </div>
            </div>

            <!-- Titre -->
            <h3 class="font-bold text-xl text-center leading-6 mb-1"
                :style="{ color: `var(--color-${color})`, fontFamily: 'Roboto, sans-serif' }">
                {{ title }}
            </h3>

            <!-- Divider -->
            <div class="h-2 w-full"></div>

            <!-- Features -->
            <ul class="flex flex-col gap-0 mb-3 px-3 text-left">
                <li v-for="(feature, index) in features" :key="index"
                    class="flex gap-1 items-start text-neutral-800 text-xs leading-5"
                    style="font-family: Roboto, sans-serif;">
                    <FontAwesomeIcon v-if="getIcon('check')" :icon="getIcon('check')"
                        class="w-3 h-3 text-green-600 mt-1 shrink-0" />
                    <span>{{ feature }}</span>
                </li>
            </ul>
        </div>

        <!-- Prix -->
        <div class="flex flex-col items-center gap-0 mt-auto pt-2">
            <!-- Prix barrés avec espacement réservé pour maintenir la hauteur -->
            <div class="flex flex-col items-center gap-0 mb-1 min-h-[60px] justify-end">
                <span v-for="(price, index) in crossedPrices" :key="index"
                    class="text-xs text-neutral-600 line-through leading-5" style="font-family: Roboto, sans-serif;">
                    {{ price }} €
                </span>
            </div>

            <!-- Prix final -->
            <div class="flex items-baseline justify-center gap-1">
                <span class="font-bold text-2xl leading-6"
                    :class="discountPercent > 0 ? 'text-green-600' : 'text-neutral-800'"
                    style="font-family: Roboto, sans-serif;">
                    {{ finalPrice }} €
                </span>
                <span class="font-normal text-base text-neutral-600 leading-5" style="font-family: Roboto, sans-serif;">
                    /mois
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.subscription-card.has-overlay::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--overlay-color);
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
}

.subscription-card>div:not(.absolute) {
    position: relative;
    z-index: 1;
}
</style>
