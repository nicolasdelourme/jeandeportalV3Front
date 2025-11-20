<script setup lang="ts">
/**
 * Composant FAQSection
 * Section FAQ de la page marketing consultations
 */
import { ref } from 'vue'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/**
 * Liste des questions fréquentes
 */
const faqs = [
  {
    question: 'Comment fonctionnent les consultations en direct ?',
    answer:
      'Chaque semaine, Nicolas Delourme et ses experts organisent des consultations en direct sur 4 thématiques : l\'argent, les métaux précieux, le patrimoine et l\'immobilier. Vous pouvez poser vos questions en amont ou en direct via le chat. Les abonnés Premium bénéficient de questions prioritaires traitées en premier.',
  },
  {
    question: 'Que se passe-t-il si je rate un live ?',
    answer:
      'Aucun problème ! Tous les lives sont enregistrés et disponibles en replay immédiatement après la fin de la consultation. L\'accès aux replays est 100% gratuit et illimité pour tous, sans abonnement nécessaire. Vous pouvez les visionner quand vous le souhaitez.',
  },
  {
    question: 'Comment fonctionne la tarification dégressive ?',
    answer:
      'Plus vous cumulez d\'abonnements thématiques, plus vous économisez ! Premier abonnement : 24€/mois. Deuxième : -25% (18€). Troisième : -50% (12€). Quatrième : -75% (6€). Soit 60€/mois au lieu de 96€ pour les 4 thématiques, économisant 432€ par an.',
  },
  {
    question: 'Quelle est la différence entre abonnement et achat unique ?',
    answer:
      'Les lives et replays sont 100% gratuits pour tous. L\'achat unique (9€) vous permet de poser 1 question spécifique qui sera traitée pendant un live de votre choix (en direct ou lors du prochain live). L\'abonnement Premium (24€/mois par thématique) débloque tous les avantages : 1 question prioritaire par mois, 1 question confidentielle par semestre, dossiers PDF après chaque consultation et toutes les publications présentées.',
  },
  {
    question: 'Qu\'est-ce qu\'une question prioritaire et confidentielle ?',
    answer:
      'Les abonnés Premium reçoivent 1 crédit "question prioritaire" par mois : votre question sera traitée en premier pendant le live. Vous recevez aussi 1 crédit "question confidentielle" par semestre : votre question sera traitée hors live, en privé, avec une réponse personnalisée par email.',
  },
  {
    question: 'Puis-je résilier mon abonnement à tout moment ?',
    answer:
      'Oui, absolument ! Il n\'y a aucun engagement. Vous pouvez résilier votre abonnement en 1 clic depuis votre compte, à tout moment, sans frais ni justification. La résiliation prend effet à la fin de votre période de facturation en cours.',
  },
  {
    question: 'Que contiennent les dossiers PDF après chaque consultation ?',
    answer:
      'Après chaque consultation, les abonnés reçoivent un dossier PDF complet comprenant : la synthèse des points abordés, les analyses détaillées, les recommandations des experts, les graphiques et données présentés, ainsi que des ressources complémentaires pour approfondir les sujets traités.',
  },
  {
    question: 'Comment puis-je commencer gratuitement ?',
    answer:
      'Tous les lives et replays sont 100% gratuits et accessibles sans inscription obligatoire. Vous pouvez regarder toutes les consultations librement. Si vous souhaitez poser une question ou accéder aux avantages Premium, vous pourrez alors créer un compte et choisir l\'option qui vous convient.',
  },
]

/**
 * État de l'accordéon (optionnel)
 */
const activeValue = ref<string>('')
</script>

<template>
  <section class="bg-gray-50 py-16">
    <div class="max-w-4xl mx-auto px-4">
      <!-- En-tête de section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4" style="font-family: Roboto, sans-serif;">
          Questions Fréquentes
        </h2>
        <p class="text-xl text-gray-600" style="font-family: Roboto, sans-serif;">
          Tout ce que vous devez savoir sur les Consultations Privées
        </p>
      </div>

      <!-- Accordéon FAQ -->
      <Accordion v-model="activeValue" type="single" class="space-y-4" collapsible>
        <AccordionItem v-for="(faq, index) in faqs" :key="index" :value="`item-${index}`"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger class="px-6 py-4 text-left hover:bg-gray-50">
            <span class="text-lg font-semibold text-gray-900" style="font-family: Roboto, sans-serif;">
              {{ faq.question }}
            </span>
          </AccordionTrigger>
          <AccordionContent class="px-6 pb-4 pt-2">
            <p class="text-gray-700 leading-relaxed" style="font-family: Roboto, sans-serif;">
              {{ faq.answer }}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <!-- Call to action supplémentaire -->
      <div class="mt-12 text-center bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <p class="text-lg text-gray-700 mb-4" style="font-family: Roboto, sans-serif;">
          Vous avez d'autres questions ?
        </p>
        <p class="text-gray-600" style="font-family: Roboto, sans-serif;">
          Notre équipe est là pour vous répondre. Contactez-nous à
          <a href="mailto:contact@jeandeportal.fr" class="text-consultations-nd font-semibold hover:underline">
            contact@jeandeportal.fr
          </a>
        </p>
      </div>
    </div>
  </section>
</template>
