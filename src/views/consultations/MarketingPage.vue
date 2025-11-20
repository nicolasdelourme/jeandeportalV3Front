<script setup lang="ts">
/**
 * Page MarketingPage
 * Page marketing complète pour les consultations privées
 * Présente l'offre, les avantages, les prix et répond aux questions
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import MarketingHero from '@/components/consultations/marketing/MarketingHero.vue'
import BenefitsSection from '@/components/consultations/marketing/BenefitsSection.vue'
import PricingSection from '@/components/consultations/marketing/PricingSection.vue'
import FAQSection from '@/components/consultations/marketing/FAQSection.vue'
import FinalCTA from '@/components/consultations/marketing/FinalCTA.vue'
</script>

<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <MarketingHero />

    <!-- Benefits Section -->
    <BenefitsSection />

    <!-- Pricing Comparison -->
    <PricingSection />

    <!-- FAQ Section -->
    <FAQSection />

    <!-- Final CTA -->
    <FinalCTA />
  </DefaultLayout>
</template>
