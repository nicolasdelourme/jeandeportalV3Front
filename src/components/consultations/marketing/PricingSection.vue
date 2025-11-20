<script setup lang="ts">
/**
 * Composant PricingSection
 * Section de comparaison des formules d'accès
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const router = useRouter()

/**
 * Icônes FontAwesome
 */
const icons = computed(() => ({
  check: byPrefixAndName.fas?.['check'],
  xmark: byPrefixAndName.fas?.['xmark'],
  crown: byPrefixAndName.fas?.['crown'],
  shoppingCart: byPrefixAndName.fas?.['shopping-cart'],
  star: byPrefixAndName.fas?.['star'],
  eye: byPrefixAndName.fas?.['eye'],
}))

/**
 * Actions
 */
const handleSubscribe = () => {
  router.push('/consultations-nicolas-delourme/invitation')
}

const handleBuyConsultation = () => {
  // TODO: Implémenter l'achat unique
  console.log('Achat consultation unique')
}
</script>

<template>
  <section class="bg-white py-16">
    <div class="max-w-6xl mx-auto px-4">
      <!-- En-tête de section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4" style="font-family: Roboto, sans-serif;">
          Choisissez votre niveau d'engagement
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto" style="font-family: Roboto, sans-serif;">
          Accès gratuit pour tous • Questions ponctuelles • Abonnement Premium
        </p>
      </div>

      <!-- Grille de comparaison -->
      <div class="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <!-- Carte Gratuit -->
        <div class="bg-white border-2 border-gray-200 rounded-md p-6 shadow-lg flex flex-col">
          <!-- En-tête -->
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-4">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-8 h-8 text-neutral-700" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2" style="font-family: Roboto, sans-serif;">
              Accès Gratuit
            </h3>
            <p class="text-gray-600">Pour découvrir le format</p>
          </div>

          <!-- Prix -->
          <div class="text-center mb-8">
            <div class="flex items-baseline justify-center gap-2">
              <span class="text-5xl font-bold text-neutral-700">0€</span>
            </div>
            <p class="text-sm text-gray-500 mt-2">toujours gratuit</p>
          </div>

          <!-- Avantages -->
          <div class="space-y-3 mb-8 flex-1">
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check"
                class="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <span class="text-gray-700 text-sm">Accès illimité aux lives</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check"
                class="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <span class="text-gray-700 text-sm">Accès illimité aux replays</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check"
                class="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <span class="text-gray-700 text-sm">Chat YouTube en direct</span>
            </div>
            <div class="flex items-start gap-3 opacity-50">
              <FontAwesomeIcon v-if="icons.xmark" :icon="icons.xmark" class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span class="text-gray-500 text-sm">Pas de questions prioritaires</span>
            </div>
            <div class="flex items-start gap-3 opacity-50">
              <FontAwesomeIcon v-if="icons.xmark" :icon="icons.xmark" class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span class="text-gray-500 text-sm">Pas de dossiers PDF</span>
            </div>
          </div>
        </div>

        <!-- Carte Achat Question -->
        <div class="bg-white border-2 border-gray-200 rounded-md p-6 shadow-lg flex flex-col">
          <!-- En-tête -->
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FontAwesomeIcon v-if="icons.shoppingCart" :icon="icons.shoppingCart" class="w-8 h-8 text-gray-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2" style="font-family: Roboto, sans-serif;">
              Question Ponctuelle
            </h3>
            <p class="text-gray-600">Posez votre question</p>
          </div>

          <!-- Prix -->
          <div class="text-center mb-8">
            <div class="flex items-baseline justify-center gap-2">
              <span class="text-5xl font-bold text-gray-900">9€</span>
            </div>
            <p class="text-sm text-gray-500 mt-2">par question posée</p>
          </div>

          <!-- Avantages -->
          <div class="space-y-3 mb-8 flex-1">
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span class="text-gray-700 text-sm">Accès illimité aux lives</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span class="text-gray-700 text-sm">Accès illimité aux replays</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span class="text-gray-700 text-sm">1 question pour un live choisi</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span class="text-gray-700 text-sm">Réponse en direct ou prochain live</span>
            </div>
            <div class="flex items-start gap-3 opacity-50">
              <FontAwesomeIcon v-if="icons.xmark" :icon="icons.xmark" class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span class="text-gray-500 text-sm">Pas de dossiers PDF inclus</span>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-auto">
            <Button @click="handleBuyConsultation" variant="outline" color="primary" size="lg" class="w-full font-bold">
              <FontAwesomeIcon v-if="icons.shoppingCart" :icon="icons.shoppingCart" class="w-5 h-5 mr-2" />
              Poser une question
            </Button>

            <p class="text-center text-xs text-gray-500 mt-3">
              Paiement unique • Sans engagement
            </p>
          </div>
        </div>

        <!-- Carte Abonnement (Recommandé) -->
        <div
          class="relative bg-gradient-to-b from-consultations-nd to-consultations-nd/90 rounded-md p-8 shadow-2xl text-white flex flex-col">
          <!-- Badge recommandé -->
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge
              class="bg-yellow-500 text-white px-6 py-2 text-sm font-bold uppercase shadow-lg flex items-center gap-2">
              <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="w-4 h-4" />
              Recommandé
            </Badge>
          </div>

          <!-- En-tête -->
          <div class="text-center mb-6 pt-4">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold mb-2" style="font-family: Roboto, sans-serif;">
              Abonnement Premium
            </h3>
            <p class="text-white/80">La formule la plus avantageuse</p>
          </div>

          <!-- Prix -->
          <div class="text-center mb-8">
            <div class="flex items-baseline justify-center gap-2">
              <span class="text-5xl font-bold">24€</span>
              <span class="text-xl text-white/70">/mois</span>
            </div>
            <p class="text-sm text-white/60 mt-2">par thématique</p>
            <p class="text-sm text-green-300 font-semibold mt-2">-75% sur le 4ème abonnement !</p>
          </div>

          <!-- Avantages -->
          <div class="space-y-4 mb-8 flex-1">
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-300 shrink-0 mt-0.5" />
              <span class="text-white/90">Accès illimité aux lives et replays</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-300 shrink-0 mt-0.5" />
              <span class="text-white/90">1 question prioritaire par mois</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-300 shrink-0 mt-0.5" />
              <span class="text-white/90">1 question confidentielle par semestre</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-300 shrink-0 mt-0.5" />
              <span class="text-white/90">Dossiers PDF après chaque consultation</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-300 shrink-0 mt-0.5" />
              <span class="text-white/90">Toutes les publications présentées</span>
            </div>
            <div class="flex items-start gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="w-5 h-5 text-green-300 shrink-0 mt-0.5" />
              <span class="text-white/90">Sans engagement • Résiliation facile</span>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-auto">
            <Button @click="handleSubscribe" color="green-600" size="lg" class="w-full font-bold uppercase tracking-wide">
              <FontAwesomeIcon v-if="icons.eye" :icon="icons.eye" class="w-5 h-5 mr-2" />
              Voir les offres
            </Button>

            <p class="text-center text-xs text-white/60 mt-3">
              Aucun paiement immédiat • Profitez de la période d'essai
            </p>
          </div>
        </div>

      </div>

      <!-- Barre de comparaison rapide -->
      <div class="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div class="text-center">
          <p class="text-lg font-semibold text-gray-900 mb-2" style="font-family: Roboto, sans-serif;">
            💡 Bon à savoir
          </p>
          <p class="text-gray-700" style="font-family: Roboto, sans-serif;">
            Les lives et replays sont <strong>100% gratuits</strong> pour tous.
            Avec l'<strong>achat de questions (9€)</strong>, vous pouvez faire répondre vos interrogations spécifiques
            en direct.
            L'<strong>abonnement Premium (24€/mois)</strong> débloque tous les avantages : questions prioritaires
            illimitées,
            consultations confidentielles, dossiers PDF complets et publications exclusives !
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
