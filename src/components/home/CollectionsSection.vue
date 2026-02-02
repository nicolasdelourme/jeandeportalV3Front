<script setup lang="ts">
/**
 * Composant CollectionsSection
 * Présentation des collections thématiques de publications
 * Version responsive avec Accordion sur mobile et Grid sur desktop
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import CollectionCard from './CollectionCard.vue'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
    home: byPrefixAndName.fas?.['home'],
    shield: byPrefixAndName.fas?.['shield-halved'],
    calculator: byPrefixAndName.fas?.['calculator'],
    chartLine: byPrefixAndName.fas?.['chart-line'],
    handshake: byPrefixAndName.fas?.['handshake'],
    umbrella: byPrefixAndName.fas?.['umbrella-beach'],
}))

type IconKey = 'home' | 'shield' | 'calculator' | 'chartLine' | 'handshake' | 'umbrella'

/**
 * Configuration des collections
 */
const collections = [
    {
        id: 'immobilier',
        title: 'Immobilier',
        subtitle: 'Investissez & LMNP',
        description: 'Valorisez vos biens et vos investissements immobiliers avec nos guides experts en fiscalité et gestion patrimoniale.',
        icon: 'home' as IconKey,
        color: 'consultations-nd-immobilier',
        stats: [
            { value: '24', label: 'Publications' },
            { value: '340', label: 'Pages' },
        ]
    },
    {
        id: 'assurance',
        title: 'Assurance',
        subtitle: 'Assurance Vie & Epargne',
        description: 'Optimisez votre épargne avec nos analyses détaillées sur l\'assurance-vie et les solutions d\'épargne.',
        icon: 'shield' as IconKey,
        color: 'yellow-500',
        stats: [
            { value: '18', label: 'Publications' },
            { value: '280', label: 'Pages' },
        ]
    },
    {
        id: 'fiscalite',
        title: 'Fiscalité',
        subtitle: 'Fiscalité Personnelle',
        description: 'Réduisez vos impôts légalement grâce à nos stratégies fiscales et nos analyses des dispositifs en vigueur.',
        icon: 'calculator' as IconKey,
        color: 'primary',
        stats: [
            { value: '32', label: 'Publications' },
            { value: '450', label: 'Pages' },
        ]
    },
    {
        id: 'finance',
        title: 'Finance',
        subtitle: 'Investissements Financiers',
        description: 'Développez votre portefeuille avec nos conseils en investissements et nos analyses de marché approfondies.',
        icon: 'chartLine' as IconKey,
        color: 'consultations-nd',
        stats: [
            { value: '28', label: 'Publications' },
            { value: '380', label: 'Pages' },
        ]
    },
    {
        id: 'transmission',
        title: 'Transmission',
        subtitle: 'Transmission & Donation',
        description: 'Préparez sereinement la transmission de votre patrimoine avec nos guides juridiques et fiscaux complets.',
        icon: 'handshake' as IconKey,
        color: 'yellow-600',
        stats: [
            { value: '22', label: 'Publications' },
            { value: '310', label: 'Pages' },
        ]
    },
    {
        id: 'retraite',
        title: 'Retraite',
        subtitle: 'Retraite & Prévoyance',
        description: 'Anticipez votre retraite avec nos conseils patrimoniaux et nos stratégies de prévoyance personnalisées.',
        icon: 'umbrella' as IconKey,
        color: 'primary',
        stats: [
            { value: '20', label: 'Publications' },
            { value: '290', label: 'Pages' },
        ]
    },
]

/**
 * Helper pour récupérer une icône de manière typée
 * On force le type car on sait que l'icône existe grâce au v-if dans le template
 */
const getIcon = (iconKey: IconKey): IconDefinition => {
    return icons.value[iconKey] as IconDefinition
}
</script>

<template>
    <section class="bg-white py-16">
        <div class="flex flex-col gap-12 px-4 max-w-6xl mx-auto w-full">
            <!-- En-tête de section -->
            <div class="flex flex-col gap-3 items-center justify-center w-full">
                <!-- Badge jaune -->
                <Badge class="bg-linear-to-r from-yellow-400 to-yellow-500 px-6 py-2 rounded-full">
                    <p class="font-bold text-sm text-center text-neutral-900 tracking-[0.7px] uppercase"
                        style="font-family: Roboto, sans-serif;">
                        Notre catalogue
                    </p>
                </Badge>

                <!-- Titre principal -->
                <h2 class="font-bold text-4xl text-neutral-800 text-center leading-10"
                    style="font-family: Roboto, sans-serif;">
                    Des publications expertes pour tous vos enjeux patrimoniaux
                </h2>

                <!-- Sous-titre -->
                <p class="font-normal text-lg text-neutral-600 text-center leading-8 max-w-2xl"
                    style="font-family: Roboto, sans-serif;">
                    Explorez nos collections thématiques rédigées par des spécialistes reconnus
                </p>
            </div>

            <!-- Mobile: Accordion (< 768px) -->
            <Accordion type="single" collapsible class="md:hidden w-full">
                <AccordionItem v-for="collection in collections" :key="collection.id" :value="collection.id"
                               class="border border-neutral-200 rounded-lg mb-3">
                    <AccordionTrigger class="px-4 py-3 hover:no-underline">
                        <div class="flex gap-3 items-center w-full">
                            <div :style="`background: linear-gradient(135deg, var(--color-${collection.color}), var(--color-${collection.color}))`"
                                 class="p-2 rounded-md shadow-sm shrink-0">
                                <FontAwesomeIcon v-if="getIcon(collection.icon)" :icon="getIcon(collection.icon)"
                                                 class="w-5 h-5 text-white" />
                            </div>
                            <div class="flex flex-col items-start text-left">
                                <h3 class="font-bold text-lg text-neutral-800 leading-6"
                                    style="font-family: Roboto, sans-serif;">
                                    {{ collection.title }}
                                </h3>
                                <p class="font-medium text-xs text-neutral-600 leading-4"
                                   style="font-family: Roboto, sans-serif;">
                                    {{ collection.subtitle }}
                                </p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent class="px-4 pb-4">
                        <CollectionCard
                            :id="collection.id"
                            :title="collection.title"
                            :subtitle="collection.subtitle"
                            :description="collection.description"
                            :icon="getIcon(collection.icon)"
                            :color="collection.color"
                            :stats="collection.stats"
                            :link="`/boutique?collection=${collection.id}`"
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <!-- Desktop: Grid (≥ 768px) -->
            <div class="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                <CollectionCard
                    v-for="collection in collections"
                    :id="collection.id"
                    :key="collection.id"
                    :title="collection.title"
                    :subtitle="collection.subtitle"
                    :description="collection.description"
                    :icon="getIcon(collection.icon)"
                    :color="collection.color"
                    :stats="collection.stats"
                    :link="`/boutique?collection=${collection.id}`"
                />
            </div>

            <!-- CTA pour voir toutes les collections -->
            <div class="flex justify-center">
                <Button as-child size="lg" color="primary" variant="outline">
                    <RouterLink to="/boutique">
                        <p class="font-bold" style="font-family: Roboto, sans-serif;">
                            Voir toutes nos collections
                        </p>
                    </RouterLink>
                </Button>
            </div>
        </div>
    </section>
</template>
