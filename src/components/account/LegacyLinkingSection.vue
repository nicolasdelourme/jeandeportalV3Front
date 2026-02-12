<script setup lang="ts">
/**
 * Section LegacyLinkingSection
 * Affiche le statut de rattachement du compte legacy dans Mon compte
 * - Si non rattaché : simple CTA
 * - Si rattaché : informations basiques (à compléter quand le backend sera prêt)
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { legacyLinkingService } from '@/services/legacy-linking.service'
import type { LegacyLinkingStatus } from '@/types/legacy-linking.types'
import { logger } from '@/utils/logger'

const router = useRouter()

/**
 * État de chargement
 */
const isLoading = ref(true)

/**
 * Statut de rattachement
 */
const linkingStatus = ref<LegacyLinkingStatus | null>(null)

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    circleCheck: byPrefixAndName.fas?.['circle-check'],
    spinner: byPrefixAndName.fas?.['spinner'],
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition | undefined => {
    return icons.value[iconKey] as IconDefinition | undefined
}

/**
 * Formater la date de rattachement
 */
const formattedLinkedDate = computed(() => {
    if (!linkingStatus.value?.linkedAt) return null

    const date = new Date(linkingStatus.value.linkedAt)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
})

/**
 * Naviguer vers le tunnel de rattachement
 */
const goToLinking = () => {
    router.push('/rattachement')
}

/**
 * Charger le statut de rattachement
 */
onMounted(async () => {
    try {
        linkingStatus.value = await legacyLinkingService.getLinkingStatus()
    } catch (error) {
        logger.error('Erreur lors du chargement du statut de rattachement:', error)
        linkingStatus.value = { isLinked: false }
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div class="space-y-3">
        <Card class="border-secondary">
            <CardHeader>
                <CardTitle>Ancien compte</CardTitle>
                <CardDescription>
                    Rattachez votre compte "Les Emmerdeurs" pour conserver vos avantages
                </CardDescription>
            </CardHeader>

            <CardContent>
                <!-- État de chargement -->
                <div v-if="isLoading" class="flex items-center gap-2 text-muted-foreground">
                    <FontAwesomeIcon
                        v-if="getIcon('spinner')"
                        :icon="getIcon('spinner')!"
                        class="w-4 h-4 animate-spin"
                    />
                    <span class="text-sm">Chargement...</span>
                </div>

                <!-- Non rattaché -->
                <div v-else-if="!linkingStatus?.isLinked" class="flex items-center justify-between">
                    <div class="space-y-1">
                        <h3 class="text-sm font-semibold text-neutral-700">
                            Rattacher un ancien compte
                        </h3>
                        <p class="text-sm text-muted-foreground">
                            Récupérez vos accès et avantages de votre abonnement précédent
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        class="text-red-500 hover:text-red-600 hover:bg-transparent"
                        @click="goToLinking"
                    >
                        Rattacher mon compte
                    </Button>
                </div>

                <!-- Rattaché -->
                <div v-else class="space-y-4">
                    <!-- Statut -->
                    <div class="flex items-center justify-between">
                        <div class="space-y-1">
                            <h3 class="text-sm font-semibold text-neutral-700">
                                Statut du rattachement
                            </h3>
                            <p class="text-sm text-muted-foreground">
                                Votre ancien compte est rattaché
                            </p>
                        </div>
                        <div class="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                            <FontAwesomeIcon
                                v-if="getIcon('circleCheck')"
                                :icon="getIcon('circleCheck')!"
                                class="w-4 h-4"
                            />
                            <span>Actif</span>
                        </div>
                    </div>

                    <!-- Numéro d'abonné (si disponible) -->
                    <template v-if="linkingStatus.subscriberId">
                        <Separator />
                        <div class="flex items-center justify-between">
                            <div class="space-y-1">
                                <h3 class="text-sm font-semibold text-neutral-700">
                                    Numéro d'abonné
                                </h3>
                                <p class="text-sm text-muted-foreground">
                                    Identifiant de votre ancien compte
                                </p>
                            </div>
                            <span class="text-sm font-mono text-neutral-700">
                                {{ linkingStatus.subscriberId }}
                            </span>
                        </div>
                    </template>

                    <!-- Date de rattachement (si disponible) -->
                    <template v-if="formattedLinkedDate">
                        <Separator />
                        <div class="flex items-center justify-between">
                            <div class="space-y-1">
                                <h3 class="text-sm font-semibold text-neutral-700">
                                    Date de rattachement
                                </h3>
                                <p class="text-sm text-muted-foreground">
                                    {{ formattedLinkedDate }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- TODO: Ajouter ici les infos supplémentaires du backend -->
                    <!-- Ex: thèmes hérités, étoiles récupérées, etc. -->
                </div>
            </CardContent>
        </Card>
    </div>
</template>
