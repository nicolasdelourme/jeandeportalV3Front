<script setup lang="ts">
/**
 * Composant AbonnementPromo
 * Affiche une promotion pour devenir abonne Premium
 * Visible uniquement pour les non-abonnes
 */

import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

/**
 * Icones FontAwesome
 */
const icons = computed(() => ({
    crown: byPrefixAndName.fas?.['crown'],
    check: byPrefixAndName.fas?.['check'],
    gift: byPrefixAndName.fas?.['gift'],
    shield: byPrefixAndName.fas?.['shield-alt'],
}))

/**
 * Props du composant
 */
interface Props {
    /**
     * Technical tag array pour la couleur du bouton CTA
     */
    technicalTagArray: string[]
}

const props = defineProps<Props>()

/**
 * Emits du composant
 */
const emit = defineEmits<{
    'discover-offers': []
}>()

/**
 * Classe Tailwind pour la couleur du bouton CTA selon technicalTag
 */
const ctaButtonColor = computed(() => {
    const technicalTag = props.technicalTagArray[0] || ''
    return `bg-consultations-nd-${technicalTag} hover:bg-consultations-nd-${technicalTag}/90`
})
</script>

<template>
    <div class="bg-gray-50 rounded shadow-md p-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Colonne gauche: Avantages (col-8) -->
            <div class="lg:col-span-8">
                <!-- Titre -->
                <div class="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="h-5 w-5 text-yellow-500" />
                    <h2 class="text-xl font-bold text-gray-900">Devenez Abonne Premium</h2>
                </div>

                <!-- Sous-titre -->
                <p class="text-gray-600 mb-4">
                    Accedez a tous les avantages exclusifs de nos consultations
                </p>

                <!-- Liste des avantages -->
                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-3">
                        <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="h-4 w-4 text-green-600" />
                        <span class="text-gray-900 font-semibold">Un droit de consultation prioritaire par mois</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="h-4 w-4 text-green-600" />
                        <span class="text-gray-900 font-semibold">Un droit de consultation confidentielle par
                            semestre</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="h-4 w-4 text-green-600" />
                        <span class="text-gray-900 font-semibold">Le livret de bonus apres chaque consultation</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="h-4 w-4 text-green-600" />
                        <span class="text-gray-900 font-semibold">Toutes les publications presentees pendant les
                            consultations</span>
                    </div>
                </div>

                <!-- Encadre privilege -->
                <div class="bg-white border-l-4 border-yellow-500 rounded p-4 flex items-center gap-2">
                    <FontAwesomeIcon v-if="icons.gift" :icon="icons.gift" class="h-5 w-5 text-yellow-500" />
                    <span class="text-sm text-gray-600">Profitez d'un acces privilegie a tous nos contenus exclusifs
                        !</span>
                </div>
            </div>

            <!-- Colonne droite: Prix et CTA (col-4) -->
            <div class="lg:col-span-4 flex flex-col justify-center items-center">
                <!-- Prix -->
                <div class="text-center mb-4">
                    <div class="text-5xl font-bold text-green-600">0 €</div>
                    <p class="text-sm text-gray-600 mt-1">aujourd'hui seulement</p>
                    <p class="text-xs text-gray-600">
                        <span class="line-through">€/mois</span>
                        <span> -> </span>
                        <span class="font-medium">Offre decouverte</span>
                    </p>
                </div>

                <!-- Bouton CTA -->
                <Button :class="ctaButtonColor" class="w-full text-white font-bold uppercase tracking-wide mb-2"
                    @click="emit('discover-offers')">
                    <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="h-4 w-4 mr-2" />
                    Decouvrir les offres
                </Button>

                <!-- Info resiliation -->
                <div class="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <FontAwesomeIcon v-if="icons.shield" :icon="icons.shield" class="h-4 w-4 text-gray-600" />
                    <span>Sans engagement - Resiliation simple</span>
                </div>
            </div>
        </div>
    </div>
</template>
