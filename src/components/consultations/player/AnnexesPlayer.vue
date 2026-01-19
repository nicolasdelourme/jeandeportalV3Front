<script setup lang="ts">
/**
 * Composant AnnexesPlayer
 * Affiche les dossiers mentionnes pendant la consultation
 * Visible uniquement en mode Replay
 */

import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import annexesData from '@/data/annexes-webinar-48.json'

/**
 * Icones FontAwesome
 */
const icons = computed(() => ({
    folder: byPrefixAndName.fas?.['folder'],
    crown: byPrefixAndName.fas?.['crown'],
    shoppingCart: byPrefixAndName.fas?.['shopping-cart'],
    eye: byPrefixAndName.fas?.['eye'],
    clock: byPrefixAndName.fas?.['clock'],
    print: byPrefixAndName.fas?.['print'],
}))

/**
 * Props du composant
 */
interface Props {
    /**
     * Statut abonne
     */
    isSubscriber: boolean
    /**
     * Technical tag array pour la couleur
     */
    technicalTagArray: string[]
    /**
     * ID du webinaire pour charger les annexes
     */
    webinarId: number
    /**
     * Mode de lecture (live ou replay)
     */
    mode: 'live' | 'replay'
}

const props = defineProps<Props>()

/**
 * Emits du composant
 */
const emit = defineEmits<{
    'discover-offers': []
    'purchase-dossier': [dossierId: number]
    'view-dossier': [dossierId: number]
}>()

/**
 * Annexes du webinaire
 */
interface Annexe {
    id: number
    title: string
    description: string
    price: number | null
    coverImage: string
    badgeLabel: string
    badgeColor: string
    addedAt: string
}

const annexes = computed<Annexe[]>(() => {
    if (annexesData.webinarId === props.webinarId) {
        return annexesData.annexes as Annexe[]
    }
    return []
})

/**
 * Classe Tailwind pour la couleur du bouton CTA selon technicalTag
 */
const ctaButtonColor = computed(() => {
    const technicalTag = props.technicalTagArray[0] || ''
    return `bg-consultations-nd-${technicalTag} hover:bg-consultations-nd-${technicalTag}/90`
})

/**
 * Formater le temps ecoule depuis l'ajout
 */
const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const added = new Date(dateString)
    const diffMs = now.getTime() - added.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 60) {
        return `Il y a ${diffMinutes} min`
    } else if (diffHours < 24) {
        return `Il y a ${diffHours}h`
    } else {
        return `Il y a ${diffDays}j`
    }
}

/**
 * Formater le prix
 */
const formatPrice = (price: number | null): string => {
    if (price === null) {
        return 'Prix a definir'
    }
    return `${price}€`
}
</script>

<template>
    <div v-if="annexes.length > 0" class="bg-white rounded shadow-sm">
        <!-- Header avec bordure en bas -->
        <div class="border-b border-gray-300 px-5 py-4">
            <div class="flex items-center justify-between">
                <!-- Gauche: Icone + Texte -->
                <div class="flex items-start gap-4">
                    <!-- Icone orange circulaire -->
                    <div :class="ctaButtonColor"
                        class="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <FontAwesomeIcon v-if="icons.folder" :icon="icons.folder" class="h-3.5 w-4 text-white" />
                    </div>

                    <!-- Titre et sous-titre -->
                    <div class="flex flex-col gap-0.5">
                        <h2 class="text-base font-bold text-[#1a2d40] leading-tight">Dossiers mentionnes</h2>
                        <p class="text-[12.8px] text-[#6c757d] leading-tight">Documents exclusifs evoques par nos
                            experts</p>
                    </div>
                </div>

                <!-- Droite: Compteur -->
                <div class="text-[12.8px] text-[#6c757d]">
                    {{ annexes.length }} dossier{{ annexes.length > 1 ? 's' : '' }}
                </div>
            </div>
        </div>

        <!-- Promo banner pour non-abonnes -->
        <div v-if="!isSubscriber" class="px-4 py-4">
            <div class="bg-neutral-100 rounded px-1.5 py-3">
                <div class="flex flex-wrap items-center justify-center gap-4">
                    <!-- Texte centré -->
                    <div class="flex-1 text-center px-4">
                        <p class="text-neutral-800 text-base font-medium leading-6 mb-0">
                            Acces illimite a tous ces dossiers
                        </p>
                        <p class="text-neutral-700 text-[12.8px] leading-tight">
                            Ces documents exclusifs sont inclus dans votre abonnement <span class="font-medium">metaux
                                precieux</span>.
                        </p>
                    </div>

                    <!-- Bouton CTA -->
                    <div class="px-4">
                        <Button :class="ctaButtonColor"
                            class="h-[34px] text-white font-bold text-xs uppercase tracking-wider px-4"
                            @click="emit('discover-offers')">
                            <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="h-3 w-3.5 mr-1" />
                            Decouvrir les offres
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Liste des dossiers -->
        <div class="px-px py-4">
            <div class="space-y-4">
                <div v-for="annexe in annexes" :key="annexe.id" class="mx-4 mb-4">
                    <div class="bg-white border border-[rgba(0,0,0,0.13)] rounded p-px">
                        <div class="flex items-stretch">
                            <!-- Colonne gauche: Image ou Badge -->
                            <div class="bg-neutral-100 flex items-center justify-center shrink-0">
                                <div class="max-w-[120px] max-h-[140px] overflow-hidden">
                                    <div v-if="annexe.coverImage" class="w-[99px] h-[140px]">
                                        <img :src="annexe.coverImage" :alt="annexe.title"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <div v-else :style="{ backgroundColor: annexe.badgeColor }"
                                        class="w-[99px] h-[140px] flex items-center justify-center">
                                        <span class="text-white font-bold text-xs text-center px-2">
                                            {{ annexe.badgeLabel }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Colonne milieu: Infos -->
                            <div class="flex-1 p-5 flex items-center">
                                <div class="flex-1 space-y-2">
                                    <!-- Titre -->
                                    <h3 class="text-base font-bold leading-tight">{{ annexe.title }}</h3>

                                    <!-- Description -->
                                    <p class="text-sm text-neutral-800 leading-tight">{{ annexe.description }}</p>
                                </div>
                            </div>

                            <!-- Colonne droite: Prix et CTA -->
                            <div class="pl-4 flex items-center mr-3">
                                <div class=" flex flex-col gap-2">
                                    <!-- Prix -->
                                    <div class="text-right">
                                        <div v-if="isSubscriber && annexe.price !== null" class="space-y-1">
                                            <div class="text-base font-bold text-neutral-400 line-through leading-6">
                                                {{ formatPrice(annexe.price) }}
                                            </div>
                                            <div class="text-sm text-green-600 font-semibold">Inclus dans votre
                                                abonnement</div>
                                        </div>
                                        <div v-else-if="!isSubscriber && annexe.price !== null"
                                            class="text-base font-bold text-[#1a2d40] leading-6">
                                            {{ formatPrice(annexe.price) }}
                                        </div>
                                        <div v-else class="text-base text-neutral-600 leading-6">
                                            {{ formatPrice(annexe.price) }}
                                        </div>
                                    </div>

                                    <!-- Timestamp (uniquement en mode Live) -->
                                    <div v-if="mode === 'live'"
                                        class="flex items-center justify-end gap-1 h-[15px] pb-1 pt-1.5">
                                        <FontAwesomeIcon v-if="icons.clock" :icon="icons.clock"
                                            class="h-3.5 w-3.5 text-neutral-500" />
                                        <span class="text-sm text-neutral-600 leading-tight">{{
                                            formatTimeAgo(annexe.addedAt) }}</span>
                                    </div>

                                    <!-- Info format (uniquement en mode Replay) -->
                                    <div v-if="mode === 'replay'"
                                        class="flex items-center justify-end gap-1 h-[15px] pb-1 pt-1.5">
                                        <FontAwesomeIcon v-if="icons.print" :icon="icons.print"
                                            class="h-3.5 w-3.5 text-neutral-500" />
                                        <span v-if="isSubscriber" class="text-sm text-neutral-600 leading-tight">Format
                                            PDF - Pret a
                                            imprimer</span>
                                        <span v-else class="text-sm text-neutral-600 leading-tight">Inclus dans
                                            l'abonnement</span>
                                    </div>

                                    <!-- Bouton CTA -->
                                    <div class="flex justify-end">
                                        <Button v-if="isSubscriber" variant="default" color="sucess" size="sm"
                                            class="flex items-center tracking-wider"
                                            @click="emit('view-dossier', annexe.id)">
                                            <FontAwesomeIcon v-if="icons.eye" :icon="icons.eye"
                                                class="h-3 w-3.5 mr-1" />
                                            Consulter
                                        </Button>
                                        <Button v-else variant="outline" size="sm"
                                            class="flex items-center tracking-wider"
                                            @click="emit('purchase-dossier', annexe.id)">
                                            <FontAwesomeIcon v-if="icons.shoppingCart" :icon="icons.shoppingCart"
                                                class="h-3 w-3.5 mr-1" />
                                            {{ mode === 'replay' ? 'Voir la boutique' : 'Acheter' }}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
