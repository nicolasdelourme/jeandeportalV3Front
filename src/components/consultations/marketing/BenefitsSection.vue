<script setup lang="ts">
/**
 * Composant BenefitsSection
 * Section des avantages et bénéfices des consultations
 */
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  checkCircle: byPrefixAndName.fas?.['circle-check'],
  crown: byPrefixAndName.fas?.['crown'],
  bolt: byPrefixAndName.fas?.['bolt'],
  shield: byPrefixAndName.fas?.['shield-halved'],
  fileContract: byPrefixAndName.fas?.['file-contract'],
  infinity: byPrefixAndName.fas?.['infinity'],
}))

/**
 * Liste des bénéfices
 */
const benefits = [
  {
    icon: 'bolt',
    title: 'Questions Prioritaires',
    description: '1 question prioritaire par mois pour obtenir des réponses rapides et personnalisées à vos problématiques patrimoniales urgentes.',
    badge: 'Premium',
  },
  {
    icon: 'shield',
    title: 'Consultations Confidentielles',
    description: '1 consultation confidentielle par semestre pour aborder vos questions les plus sensibles en toute discrétion.',
    badge: 'Exclusif',
  },
  {
    icon: 'fileContract',
    title: 'Dossiers PDF Complets',
    description: 'Recevez après chaque consultation un dossier PDF détaillé avec les analyses, recommandations et ressources partagées.',
    badge: 'Inclus',
  },
  {
    icon: 'crown',
    title: 'Publications Présentées',
    description: 'Accédez à toutes les publications et ouvrages présentés pendant les consultations, pour approfondir vos connaissances.',
    badge: 'Bonus',
  },
  {
    icon: 'infinity',
    title: 'Replays Illimités',
    description: 'Accès à vie à tous les replays des consultations pour revoir les sujets qui vous intéressent à votre rythme.',
    badge: 'À vie',
  },
  {
    icon: 'checkCircle',
    title: 'Sans Engagement',
    description: 'Résiliez votre abonnement à tout moment en 1 clic, sans frais cachés ni période d\'engagement imposée.',
    badge: 'Flexible',
  },
]
</script>

<template>
  <section class="bg-gray-50 py-16">
    <div class="max-w-6xl mx-auto px-4">
      <!-- En-tête de section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4" style="font-family: Roboto, sans-serif;">
          Pourquoi choisir les Consultations Privées ?
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto" style="font-family: Roboto, sans-serif;">
          Un format unique qui combine expertise de pointe, interaction directe et accompagnement personnalisé pour
          vos décisions patrimoniales
        </p>
      </div>

      <!-- Grille des bénéfices -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="benefit in benefits" :key="benefit.title"
          class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-200">
          <!-- En-tête avec icône et badge -->
          <div class="flex items-start justify-between mb-4">
            <div class="bg-consultations-nd p-3 rounded-lg">
              <FontAwesomeIcon v-if="icons[benefit.icon]" :icon="icons[benefit.icon]" class="w-6 h-6 text-white" />
            </div>
            <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
              {{ benefit.badge }}
            </span>
          </div>

          <!-- Titre -->
          <h3 class="text-xl font-bold text-gray-900 mb-3" style="font-family: Roboto, sans-serif;">
            {{ benefit.title }}
          </h3>

          <!-- Description -->
          <p class="text-gray-600 leading-relaxed" style="font-family: Roboto, sans-serif;">
            {{ benefit.description }}
          </p>
        </div>
      </div>

      <!-- Call-out supplémentaire -->
      <div class="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <FontAwesomeIcon v-if="icons.checkCircle" :icon="icons.checkCircle"
            class="w-8 h-8 text-green-600 shrink-0" />
          <p class="text-lg font-semibold text-gray-900" style="font-family: Roboto, sans-serif;">
            Commencez gratuitement aujourd'hui ! Aucun paiement immédiat requis.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
