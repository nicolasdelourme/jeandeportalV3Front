<script setup lang="ts">
/**
 * Composant LinkingSlideSuccess
 * Slide 4 : Confirmation de rattachement réussi
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { LegacyLinkingResult, LegacyLinkedTheme } from '@/types/legacy-linking.types'

interface Props {
    /** Résultat du rattachement */
    result: LegacyLinkingResult
}

const props = defineProps<Props>()

const router = useRouter()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    circleCheck: byPrefixAndName.fas?.['circle-check'],
    graduationCap: byPrefixAndName.fas?.['graduation-cap'],
    star: byPrefixAndName.fas?.['star'],
    arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition | undefined => {
    return icons.value[iconKey] as IconDefinition | undefined
}

/**
 * Mapping des thèmes vers leurs badges
 */
const themeConfig: Record<string, { label: string; variant: string }> = {
    metaux: { label: 'Métaux précieux', variant: 'theme-metaux' },
    portefeuille: { label: 'Portefeuille permanent', variant: 'theme-portefeuille' },
    liberte: { label: 'Liberté financière', variant: 'theme-liberte' },
    bonus: { label: 'Bonus mystère', variant: 'theme-bonus' },
}

/**
 * Obtenir la config d'un thème
 */
const getThemeConfig = (theme: LegacyLinkedTheme) => {
    return themeConfig[theme.slug] || { label: theme.name, variant: 'default' }
}

/**
 * Naviguer vers l'Académie
 */
const goToAcademie = () => {
    router.push('/academie')
}

/**
 * Naviguer vers Mon compte
 */
const goToAccount = () => {
    router.push('/mon-compte')
}
</script>

<template>
    <div class="flex flex-col items-center text-center px-6 py-8">
        <!-- Icône de succès animée -->
        <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-in zoom-in-50 duration-300">
            <FontAwesomeIcon
                v-if="getIcon('circleCheck')"
                :icon="getIcon('circleCheck')!"
                class="w-10 h-10 text-green-600"
            />
        </div>

        <!-- Titre -->
        <h2 class="text-2xl font-bold text-neutral-800 mb-2" style="font-family: Roboto, sans-serif;">
            Compte rattaché !
        </h2>

        <!-- Message de succès -->
        <p class="text-neutral-600 mb-6" style="font-family: Roboto, sans-serif;">
            {{ result.message || 'Votre ancien compte a été rattaché avec succès.' }}
        </p>

        <!-- Thèmes rattachés -->
        <div v-if="result.linkedThemes && result.linkedThemes.length > 0" class="w-full max-w-sm mb-6">
            <p class="text-sm text-neutral-500 mb-3" style="font-family: Roboto, sans-serif;">
                Vous avez maintenant accès à :
            </p>
            <div class="space-y-2">
                <div
                    v-for="theme in result.linkedThemes"
                    :key="theme.id"
                    class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <FontAwesomeIcon
                                v-if="getIcon('graduationCap')"
                                :icon="getIcon('graduationCap')!"
                                class="w-4 h-4 text-primary"
                            />
                        </div>
                        <span class="text-sm font-medium text-neutral-700" style="font-family: Roboto, sans-serif;">
                            {{ getThemeConfig(theme).label }}
                        </span>
                    </div>
                    <Badge :variant="getThemeConfig(theme).variant as any" class="text-xs">
                        Actif
                    </Badge>
                </div>
            </div>
        </div>

        <!-- Étoiles récupérées -->
        <div v-if="result.starsRecovered && result.starsRecovered > 0" class="w-full max-w-sm mb-8">
            <div class="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg">
                <FontAwesomeIcon
                    v-if="getIcon('star')"
                    :icon="getIcon('star')!"
                    class="w-5 h-5 text-primary"
                />
                <span class="text-sm font-medium text-neutral-700" style="font-family: Roboto, sans-serif;">
                    <strong>{{ result.starsRecovered }}</strong> étoiles récupérées
                </span>
            </div>
        </div>

        <!-- Actions -->
        <div class="w-full max-w-sm space-y-3">
            <Button
                variant="secondary"
                size="lg"
                rounded="lg"
                class="w-full"
                @click="goToAcademie"
            >
                <span class="font-bold" style="font-family: Roboto, sans-serif;">
                    Accéder à l'Académie
                </span>
                <FontAwesomeIcon
                    v-if="getIcon('arrowRight')"
                    :icon="getIcon('arrowRight')!"
                    class="ml-2 w-4 h-4"
                />
            </Button>

            <Button
                variant="outline"
                size="lg"
                rounded="lg"
                class="w-full"
                @click="goToAccount"
            >
                <span style="font-family: Roboto, sans-serif;">
                    Aller à Mon compte
                </span>
            </Button>
        </div>
    </div>
</template>
