<script setup lang="ts">
/**
 * FAQSection - Questions fréquentes sur l'Académie
 * Utilise le composant Accordion de shadcn-vue
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: 'Comment fonctionne l\'abonnement ?',
    answer: 'L\'abonnement est mensuel ou annuel, sans engagement. Vous choisissez votre formule (Essentiel, Standard ou Premium) et sélectionnez les formations qui vous intéressent. Chaque semaine, vous recevez les contenus correspondants : newsletter le lundi, tutoriel vidéo le mardi, et consultation live le jeudi.',
  },
  {
    question: 'Puis-je changer de formule à tout moment ?',
    answer: 'Oui, vous pouvez upgrader ou downgrader votre formule à tout moment depuis votre espace membre. Le changement prend effet au début de votre prochain cycle de facturation. Vos étoiles accumulées sont conservées.',
  },
  {
    question: 'Comment fonctionnent les étoiles ?',
    answer: 'Les étoiles sont créditées automatiquement chaque mois selon votre formule : 1 pour Essentiel, 5 pour Standard, 10 pour Premium. Elles s\'accumulent et vous permettent de débloquer des récompenses exclusives : question prioritaire (10★), dossier spécial (30★), question confidentielle (50★), tiers de confiance (100★), bonus mystère (200★).',
  },
  {
    question: 'Qu\'est-ce que le carton d\'invitation ?',
    answer: 'Le carton d\'invitation vous permet de partager un code unique avec un proche. Ce code lui offre un mois d\'essai gratuit de la formule Essentiel. Si cette personne s\'abonne ensuite, vous recevez 25 étoiles bonus. La fréquence dépend de votre formule : occasionnel (Essentiel), 2/an (Standard) ou 4/an (Premium).',
  },
  {
    question: 'Comment accéder aux replays des consultations ?',
    answer: 'Tous les abonnés ont accès aux replays des consultations live de leurs formations. Les replays sont disponibles sous 24h après le live et restent accessibles tant que votre abonnement est actif. Vous les retrouvez dans votre espace membre, classés par formation et date.',
  },
  {
    question: 'Puis-je annuler mon abonnement ?',
    answer: 'Oui, vous pouvez annuler à tout moment depuis votre espace membre. L\'annulation prend effet à la fin de votre période de facturation en cours. Vous conservez l\'accès à vos contenus jusqu\'à cette date. Vos étoiles non utilisées expirent 30 jours après la fin de l\'abonnement.',
  },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          Questions fréquentes
        </h2>
        <p class="text-muted-foreground">
          Tout ce que vous devez savoir sur l'Infocash Académie.
        </p>
      </div>

      <!-- Accordion -->
      <Accordion type="single" collapsible class="w-full">
        <AccordionItem
          v-for="(item, index) in faqItems"
          :key="index"
          :value="`item-${index}`"
          class="border-b border-border"
        >
          <AccordionTrigger class="text-left font-semibold text-foreground hover:no-underline py-5">
            {{ item.question }}
          </AccordionTrigger>
          <AccordionContent class="text-muted-foreground pb-5 leading-relaxed">
            {{ item.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <!-- Contact -->
      <div class="mt-10 text-center p-6 bg-neutral-50 rounded-sm">
        <p class="text-muted-foreground mb-2">
          Vous avez d'autres questions ?
        </p>
        <a
          href="mailto:contact@infocash.fr"
          class="text-secondary font-semibold hover:underline"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  </section>
</template>
